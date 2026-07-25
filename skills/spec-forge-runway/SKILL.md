---
name: spec-forge-runway
description: "Unified skill: takes a natural language prompt, feature task, or sprint goal and produces PLAN.md + RUNBOOK.md. Embeds spec validation (no external dependencies). The agent IS the LLM — no Ollama, no githeri, no seed prompts needed."
version: 1.0.0
author: Nous Research
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [spec-forge, command-runway, spec-driven, plan-generation, pipeline, unified]
    related_skills: [spec-forge, command-runway-pattern, spec-forge-integration, writing-plans]
---

# Spec-Forge-Runway: NL Prompt → Validated Spec → PLAN.md + RUNBOOK.md

## What This Is

A single self-contained skill that replaces the two-skill workflow (spec-forge + command-runway-pattern) with one unified pipeline. You supply a natural language feature request, sprint goal, or task description. The skill:

1. **Generates a validated YAML spec** — the agent (you) writes YAML following the canonical vocabulary and rules below, then validates it with the embedded Python validator.
2. **Produces PLAN.md** — Layer 2 static plan with stages, command tables, verification gates.
3. **Produces RUNBOOK.md** — Layer 3 execution template with empty execution log, goal verification, and machine-readable JSON extension.

**No external dependencies:** No Ollama, no githeri repo, no seed prompts. The agent IS the LLM. The user's prompt is the seed.

---

## When To Use This Skill

- User provides a feature request, sprint goal, or task description and wants an executable plan
- User says "generate a plan", "create a runbook", or "spec this feature"
- User references this skill by name

**Don't use for:**
- Single-file edits (overhead exceeds value)
- Throwaway prototypes (use the `spike` skill)
- Pure CI tasks

---

## The Pipeline (4 Steps)

### Step 1: Generate YAML Spec

Take the user's prompt and produce a YAML spec following the SPEC FORMAT and CANONICAL VOCABULARY rules below. Output ONLY the YAML — no commentary, no markdown fences.

Write the spec to a temporary file (e.g. `/tmp/<task_id>-spec.yaml`) so the validator can check it.

### Step 2: Validate

Run the embedded validator:

```bash
python3 ~/.hermes/skills/software-development/spec-forge-runway/scripts/validate_spec.py /tmp/<task_id>-spec.yaml
```

- **Exit 0** = valid. Proceed to Step 3.
- **Exit 1** = validation errors. Read the errors, fix the YAML, re-run. Maximum 3 retries.
- **Exit 2** = file not found or parse error. Check the path.

### Step 3: Produce PLAN.md

Using the validated spec and the `templates/stage-template.md` format, write `PLAN.md` to the user's target directory (default: current working directory, or a `docs/` subdirectory).

### Step 4: Produce RUNBOOK.md

Using the validated spec and the `templates/runbook-template.md` format, write `RUNBOOK.md` to the same directory as PLAN.md.

---

## SPEC FORMAT (YAML)

The YAML spec MUST contain these exact top-level fields, in this order:

```yaml
task_id: <string, kebab-case, non-empty>
summary: "<string, one sentence>"
depends_on: [<list of strings, optional>]
local_goals:
  - id: L1
    description: "<what this goal verifies>"
    verification:
      type: <http | cli | file_exists | manual>
      # ... type-specific fields (see below)
global_goals_refs: [<list of strings, optional, e.g. G1, G5>]
context:
  language: <string, e.g. TypeScript, Python>
  framework: <string, e.g. Express, FastAPI>
  orm: <string, e.g. Prisma, SQLAlchemy>
  test_framework: <string, e.g. Vitest, pytest>
```

---

## CANONICAL VOCABULARY (Enforced By Validator)

### Required Top-Level Fields
`task_id`, `summary`, `local_goals`, `context` (all required)
`depends_on`, `global_goals_refs` (optional)

### Local Goals Rules
- Minimum 2 local_goals (1 is never enough)
- IDs must match `^L[A-Za-z0-9]+` (e.g. L1, L2, L3A)
- No duplicate IDs
- No near-duplicate verifications (same type + same target + same expect keys)
- Every goal must verify a DISTINCT aspect

### Verification Types

| Type | Required Fields | Required `expect` Keys | Valid `expect` Keys |
|------|-----------------|------------------------|---------------------|
| `http` | `method`, `url` | `status` | `status`, `body_regex`, `body_contains`, `json_schema`, `headers_contain` |
| `cli` | `command` (≥3 chars) | `exit_code` | `exit_code`, `stdout_regex`, `stdout_contains`, `stdout_lines_min` |
| `file_exists` | `path` | (one of content/exists) | `content`, `content_contains`, `content_not_contains`, `exists` |
| `manual` | `description` | (none) | (none) |

### Critical Placement Rules (Model Gets These Wrong)

1. **REQUEST headers** (`Authorization`, etc.) are a SIBLING of `expect`, under `verification`. NEVER inside `expect`.
2. **RESPONSE header assertions** go INSIDE `expect` as `headers_contain` (a map of header-name → required-substring).
3. **Regex patterns in string values MUST use single quotes** (e.g. `Retry-After: '\d+'`). YAML double quotes reject backslash escapes like `\d`, `\w`, `\s`.
4. **`json_schema` must be inline** — no `$ref`, no `definitions` blocks.
5. **`body` values must be literal JSON** — no expressions like `"a" * 101`. Use placeholders like `{{test_user_id}}` for dynamic values.

### Worked Example

```yaml
task_id: get-user-profile
summary: "GET /v1/user/profile returns the authenticated user's profile"
local_goals:
  - id: L1
    description: "GET /v1/user/profile with valid token returns 200 and profile"
    verification:
      type: http
      method: GET
      url: http://localhost:3000/v1/user/profile
      headers:
        Authorization: "Bearer {{test_token}}"
      expect:
        status: 200
        json_schema:
          type: object
          properties:
            id: { type: string }
            displayName: { type: string }
          required: [id, displayName]
  - id: L2
    description: "GET /v1/user/profile without token returns 401"
    verification:
      type: http
      method: GET
      url: http://localhost:3000/v1/user/profile
      expect:
        status: 401
context:
  language: TypeScript
  framework: Express
  orm: Prisma
  test_framework: Vitest
```

---

## SPEC → PLAN/RUNBOOK FIELD MAPPING

| YAML Field | PLAN/RUNBOOK Section | How It Maps |
|------------|---------------------|-------------|
| `task_id` | Feature / Name | Verbatim |
| `summary` | Feature / Purpose | Verbatim |
| `depends_on` | Feature / Dependencies | Each entry = one dependency |
| `global_goals_refs` | Global Success Criteria | Each ref (G1..G19) = one global criterion |
| `context.language` | Target Environment | Language |
| `context.framework` | Target Environment | Framework for commands |
| `context.orm` | Execution Tasks | ORM for data-layer commands |
| `context.test_framework` | Local Verification | Test runner for verify commands |
| `local_goals[]` | Execution Stages + Local Verification | Each goal → one stage or verification row |
| `local_goals[].id` | Local Verification label | L1, L2... as check ID |
| `local_goals[].description` | Stage Objective | One-sentence objective |
| `local_goals[].verification` | Local Verification command | Translate to exact shell/test/curl command |

### Verification Block Translation

| `verification.type` | Translate To |
|---------------------|-------------|
| `http` | `curl -X METHOD URL -H headers -d body` + assert `expect.status`, `body_contains`, `json_schema` |
| `cli` | Exact `command` string + assert `exit_code`, `stdout_contains`, `stdout_regex` |
| `file_exists` | `test -f path` + `grep` for `content_contains` / `test -e` for `exists` |
| `manual` | Checklist item (no automated command) |

---

## GENERATION RULES (For PLAN.md and RUNBOOK.md)

### Stage Structure
- Each stage: < 1 hour, 5-15 commands
- Order within stage: ⏾ (inspect) → ✎ (mutate) → ✓ (verify)
- Every ✎ command must have at least one ⏾ in its `depends_on` chain
- Every stage ends with at least one ✓ verify command

### Command Roles

| Marker | Role | Can Mutate? |
|--------|------|-------------|
| ⏾ | inspect (read-only) | No |
| ✎ | modify/create | Yes |
| ✓ | verify (assert) | No |

### Backend-First Ordering
Default: backend/infrastructure stages before UI stages. UI comes last.

### Python Virtual Environment Rule
If the project uses Python:
- All commands MUST use `.venv/bin/python` or `.venv/bin/pip` — NEVER bare `python` or `pip`
- Include precondition: `test -d .venv && .venv/bin/python --version`
- If false, FIRST command creates it: `python3 -m venv .venv`

---

## KNOWN PITFALLS (Avoid These)

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| `headers` inside `expect` | Validator rejects | Request headers are SIBLING of `expect` |
| Double-quoted regex `\d+` | YAML parse error | Use single quotes: `'\d+'` |
| Only 1 local_goal | Validator rejects | Minimum 2 goals |
| Near-duplicate goals | Validator rejects | Distinct type + target + expect keys |
| `json_schema` with `$ref` | Validator rejects | Inline full schema |
| `file_exists` with only `exit_code` | Validator rejects | Use `content_contains` or `exists` |
| Delegating plan generation to subagent | 600s timeout | Generate PLAN.md + RUNBOOK.md directly in main session |

---

## OUTPUT LOCATION

Unless the user specifies otherwise, write to:
- `PLAN.md` — in the target directory (default: `docs/<task_id>/PLAN.md` or cwd)
- `RUNBOOK.md` — same directory
- `spec.yaml` — same directory (save the validated spec for reference)

Both files must be self-contained — an agent with no session context should be able to execute the runbook.

---

## VERIFICATION

After generating all three files:
1. Confirm the spec passes the validator (Step 2)
2. Confirm PLAN.md has stages with ⏾/✎/✓ command tables
3. Confirm RUNBOOK.md has all 7 sections (Taxonomy, Intent, Preconditions, Command Runway, Execution Log, Goal Verification, Machine-Readable JSON)
4. Report file paths to the user

---

## Linked Files

- `scripts/validate_spec.py` — embedded spec validator (self-contained, no external deps)
- `templates/stage-template.md` — blank stage template for PLAN.md
- `templates/runbook-template.md` — blank runbook template for RUNBOOK.md

---

## Origin

Unified from the two-skill workflow (spec-forge + command-runway-pattern) tested end-to-end in Sprint 6 of the Verified Attention Engine project. The two-skill chain worked but required githeri (Python+Ollama) as a dependency. This skill makes the agent the LLM — no seed prompts, no Ollama, no external repo.
