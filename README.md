# Spec-Forge Ecosystem

Goal-oriented, spec-driven, verified software development. From a single natural language prompt to working software — with full audit trail.

## Quick Start

```bash
# Full autonomous delivery (spec → plan → runbook → execute)
python3 ~/.hermes/skills/software-development/command-runway-autonomous/scripts/autonomous_execute.py \
  --prompt "Add GET /v1/health endpoint returning JSON {status: 'ok'}" \
  --output-dir ./features/health \
  --output all \
  --executor hermes \
  --model nvidia/nemotron-3-ultra-550b-a55b:free \
  --yolo
```

That single command:
1. Generates a validated YAML spec (canonical vocabulary, user-friendly errors)
2. Assembles `PLAN.md` + `RUNBOOK.md` (written to disk before execution)
3. Auto-approves the plan (score ≥ 0.75)
4. Executes the runbook stage-by-stage (self-healing, retries, escalation)
5. Produces working software + full audit trail

---

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AUTONOMOUS CODING PIPELINE                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────┐ │
│  │  NL Prompt   │───▶│  Spec Gen    │───▶│  Plan Gen    │───▶│ Exec │ │
│  │  (Human)     │    │  (Auto)      │    │  (Auto)      │    │ (Auto)│ │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────┘ │
│        │                   │                   │                │       │
│        ▼                   ▼                   ▼                ▼       │
│  validated spec.yaml    PLAN.md +          RUNBOOK.md      working     │
│  (canonical vocab)     RUNBOOK.md         (auto-executed)  software   │
│                        (on disk)          (on disk)                    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    SELF-HEALING LOOP                            │   │
│  │  1. Execute command → Check verification                        │   │
│  │  2. PASS → Next command                                         │   │
│  │  3. FAIL → Diagnose (root cause) → Corrective action → Retry   │   │
│  │  4. MAX_RETRIES exceeded → Escalate to human                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Three Layers

| Layer | File | Purpose | When Created |
|-------|------|---------|--------------|
| **Spec** | `spec.yaml` | WHAT (validated intent, canonical vocabulary) | Before planning |
| **Plan** | `PLAN.md` | HOW (static blueprint with commands, outputs, failure procedures) | Planning phase |
| **Runbook** | `RUNBOOK.md` | PROOF (execution template + audit trail) | Planning phase, filled during execution |

**PLAN.md is always written to disk BEFORE any execution command runs.**

---

## Skills Inventory

| Skill | Category | Purpose |
|-------|----------|---------|
| `spec-forge` | spec-forge | **Umbrella** — ecosystem map + decision matrix |
| `spec-forge-unified` | software-development | NL → validated spec → PLAN + RUNBOOK (agent-as-LLM, no Ollama) |
| `spec-forge-core` | software-development | NL → YAML spec (Ollama pipeline) |
| `spec-forge-scorer` | software-development | 5-category runbook quality gate (hard gate + penalties) |
| `spec-forge-integration-doc` | software-development | Reference: 2-skill workflow |
| `command-runway-planner` | software-development | Spec → PLAN.md + RUNBOOK.md assembly |
| `command-runway-pattern` | software-development | Execution methodology (⏾/✎/✓ commands) |
| `command-runway-autonomous` | software-development | **Full pipeline** — spec → plan → runbook → execute |
| `spec-forge-training` | mlops | Fine-tune qwen2.5-coder:7b on spec generation |

### Skill Locations

```
~/.hermes/skills/
├── spec-forge/                              # Umbrella
│   └── spec-forge/
├── software-development/
│   ├── spec-forge-core/                     # Ollama NL→spec
│   ├── spec-forge-unified/                  # Agent-as-LLM (patched validator)
│   ├── spec-forge-scorer/                   # Quality gate
│   ├── spec-forge-integration-doc/          # Reference
│   ├── command-runway-planner/              # Plan assembly
│   ├── command-runway-pattern/              # Execution methodology
│   └── command-runway-autonomous/           # FULL PIPELINE
│       ├── scripts/
│       │   └── autonomous_execute.py        # Main entry point
│       ├── references/
│       │   ├── autonomous_config.yaml        # Config (retries, timeouts, escalation)
│       │   └── output_modes.md               # Quick reference
│       └── SKILL.md
└── mlops/
    └── spec-forge-training/                 # LoRA fine-tuning pipeline
```

---

## Output Modes (`--output`)

| Flag | What It Produces | When To Use |
|------|------------------|-------------|
| `--output spec` | `spec.yaml` only | Just want the validated spec |
| `--output plan` | `PLAN.md` only | Review the plan, no runbook yet |
| `--output plan+runbook` | `PLAN.md` + `RUNBOOK.md` | Full docs, execute manually |
| `--output all` | spec + plan + runbook + **execution** | Full autonomous delivery |
| `--output execute-only` | Executes existing `RUNBOOK.md` | Re-run or resume execution |

### Examples

```bash
# Just the validated spec
python3 autonomous_execute.py --prompt "Add health endpoint" --output-dir ./out --output spec

# Plan only for human review
python3 ... --output plan

# Plan + runbook, no execution
python3 ... --output plan+runbook

# Full autonomous delivery (Python executor)
python3 ... --output all --executor python

# Full delivery via Hermes agent
python3 ... --output all --executor hermes --yolo

# Re-execute existing runbook
python3 ... --output execute-only --executor python

# Execute existing runbook via Hermes
python3 ... --output execute-only --executor hermes --yolo
```

---

## Execution Backends (`--executor`)

| Flag | Backend | How It Works |
|------|---------|-------------|
| `--executor python` | Built-in Python executor | Parses RUNBOOK command table, runs shell commands, verifies, retries (3x), updates log |
| `--executor hermes` | Hermes agent | Feeds RUNBOOK to `hermes chat -q "..." --yolo` |
| `--executor opencode` | OpenCode agent | Feeds RUNBOOK to `opencode run "..."` |

### Python Executor Details

The built-in Python executor:
1. Parses RUNBOOK.md command table (`| Cmd# | Deps | Type | Command | Expected | Fallback |`)
2. Executes commands in dependency order (⏾ inspect before ✎ create before ✓ verify)
3. Verifies each command's result (`exit_code`, `stdout_contains`, `file_exists`, HTTP status)
4. On failure: retries up to `--max-retries` times
5. On max retries exceeded: escalates to human with diagnosis
6. Updates RUNBOOK.md execution log in real-time

---

## All Flags

```bash
python3 autonomous_execute.py --help

usage: autonomous_execute.py [-h] [--prompt PROMPT] --output-dir OUTPUT_DIR
                             [--output {spec,plan,plan+runbook,all,execute-only}]
                             [--executor {python,hermes,opencode}]
                             [--model MODEL] [--provider PROVIDER]
                             [--max-retries MAX_RETRIES] [--timeout TIMEOUT]
                             [--yolo]
```

| Flag | Default | Purpose |
|------|---------|---------|
| `--prompt` | (required) | Natural language feature description |
| `--output-dir` | (required) | Output directory for all artifacts |
| `--output` | `all` | Output mode (spec, plan, plan+runbook, all, execute-only) |
| `--executor` | `python` | Execution backend (python, hermes, opencode) |
| `--model` | `nvidia/nemotron-3-ultra-550b-a55b:free` | LLM model for Hermes execution |
| `--provider` | `openrouter` | LLM provider (openrouter, anthropic, openai) |
| `--max-retries` | `3` | Retries per failed command |
| `--timeout` | `120` | Command timeout in seconds |
| `--yolo` | off | Auto-approve all operations (passed to Hermes) |

---

## Canonical Vocabulary (Enforced by Validator)

### Verification Types

| Type | Required Fields | Valid `expect` Keys |
|------|-----------------|---------------------|
| `http` | `method`, `url` | `status`, `body_regex`, `body_contains`, `json_schema`, `headers_contain` |
| `cli` | `command` (≥3 chars) | `exit_code`, `stdout_regex`, `stdout_contains`, `stdout_lines_min` |
| `file_exists` | `path` | `content`, `content_contains`, `content_not_contains`, `exists` |
| `manual` | `description` | (none — description IS the check) |

### Critical Placement Rules

1. **REQUEST headers** (`Authorization`, etc.) are a SIBLING of `expect`, under `verification`. NEVER inside `expect`.
2. **RESPONSE header assertions** go INSIDE `expect` as `headers_contain` (a map of header-name → required-substring).
3. **Regex patterns in string values MUST use single quotes** (e.g. `Retry-After: '\d+'`). YAML double quotes reject backslash escapes like `\d`, `\w`, `\s`.
4. **`json_schema` must be inline** — no `$ref`, no `definitions` blocks.
5. **`body` values must be literal JSON** — no expressions like `"a" * 101`. Use placeholders like `{{test_user_id}}` for dynamic values.

### Spec Rules

- Minimum 2 `local_goals` (1 is never enough)
- Goal IDs must match `^L[A-Za-z0-9]+` (e.g. L1, L2, L3A)
- No duplicate IDs
- No near-duplicate verifications (same type + same target + same expect keys)
- Every goal must verify a DISTINCT aspect

---

## User-Facing Error Messages

When a spec fails validation, the validator produces actionable error messages:

```
❌ Spec validation failed:

  1.
❌ You need at least 2 verification goals (L1, L2...). One goal is never enough.

  2.
❌ HTTP verification must have `expect.status` (e.g., 200, 401, 404).

💡 Fix the issues above and re-run validation.
```

### Error Hint Examples

| Violation | User-Facing Message |
|-----------|---------------------|
| Missing `task_id` | "Add a `task_id` — a short kebab-case identifier like `add-user-profile`" |
| Only 1 goal | "You need at least 2 verification goals (L1, L2...). One goal is never enough." |
| `id: foo` | "Goal IDs must start with 'L' followed by letters/digits. Fix: change 'id: foo' → 'id: L1'" |
| `type: api` | "Verification type must be one of: http, cli, file_exists, manual." |
| Missing `expect.status` | "HTTP verification must have `expect.status` (e.g., 200, 401, 404)." |
| Near-duplicate goals | "Two goals verify the same thing. Differentiate by: Different URL/method, Different path, Different command, Different expect keys." |
| Double-quoted regex `"\d+"` | "Use single quotes: `'\d+'`" |
| `json_schema` with `$ref` | "Don't use `$ref` or `definitions` — write the full schema inline." |

---

## Training Pipeline (Fine-Tuning qwen2.5-coder)

The training pipeline creates a **fine-tuned LLM** (named `specforge`) specialized for spec generation. This is separate from the autonomous executor but complementary.

### When To Use

| If you want... | Use... |
|----------------|--------|
| Build software from a prompt (now) | `--executor hermes` or `--executor python` (current LLM) |
| Generate training data for fine-tuning | `make generate N=100` in githeri repo |
| Fine-tune qwen2.5-coder on spec generation | `make train` in githeri repo (needs CUDA GPU) |
| Deploy the fine-tuned model to Ollama | `make merge` + `ollama create specforge` |
| Use the fine-tuned model for autonomous execution | `autonomous_execute.py --executor python` (uses Ollama specforge) |

### Training Pipeline Stages

```bash
cd ~/Desktop/portfolio/projects/python/verified-attention/githeri

# 1. Generate training data (spec pairs via Ollama)
make generate N=100
make score
make convert-chat

# 2. LoRA fine-tune (needs CUDA GPU — run on Ryzen 9)
make train                    # 3 epochs, LoRA r=16, 4-bit, gradient checkpointing

# 3. Merge + GGUF export
make merge                    # q4_k_m + q8_0 GGUF

# 4. Deploy to Ollama
ollama create specforge -f models/qwen2.5-coder-7b-specforge-gguf/Modelfile

# 5. Evaluate
make eval-model               # Target: >80% first-attempt pass rate

# 6. Upload to HuggingFace Hub (requires HF_TOKEN in .env)
make upload-hf REPO=githeri/qwen2.5-coder-7b-specforge
```

### Full Cycle: Training → Autonomous Execution

```bash
# 1. Generate training data
cd ~/Desktop/portfolio/projects/python/verified-attention/githeri
make generate N=100 && make score && make convert-chat

# 2. Fine-tune (on Ryzen 9 or other CUDA machine)
make train && make merge

# 3. Deploy to Ollama
ollama create specforge -f models/qwen2.5-coder-7b-specforge-gguf/Modelfile

# 4. Use fine-tuned model for autonomous execution
python3 ~/.hermes/skills/software-development/command-runway-autonomous/scripts/autonomous_execute.py \
  --prompt "Add GET /v1/health endpoint" \
  --output-dir ./health \
  --output all \
  --executor python
```

---

## Ollama vs Current LLM

| Factor | Ollama (qwen2.5-coder:7b) | Current LLM (Nemotron, Claude, etc.) |
|--------|---------------------------|--------------------------------------|
| Model size | 7B params | 100B-550B params |
| Reasoning quality | Good for code, struggles with complex specs | Excellent at complex reasoning |
| Cost | Free (local hardware) | API costs per token |
| Privacy | Fully local | Data leaves machine |
| Hardware | Needs 8GB+ VRAM | None |
| Fine-tuning | Possible (LoRA) | Not possible |
| Offline | Yes | No |
| Spec first-try pass rate | ~70% (needs retries) | ~90%+ (few retries) |

**Recommendation**: Use `spec-forge-unified` (current LLM) for most work. Use Ollama only if you need offline, zero-cost, or fine-tuned spec generation.

---

## Configuration

### autonomous_config.yaml

```yaml
# ~/.hermes/skills/software-development/command-runway-autonomous/references/autonomous_config.yaml
max_retries_per_command: 3
max_retries_per_stage: 2
escalation_threshold:
  consecutive_failures: 3
  blocked_duration_minutes: 30
  critical_error_keywords:
    - "security"
    - "data_loss"
    - "schema_migration"
    - "permission_denied"
auto_approve_plan: true
auto_execute_runbook: true
min_spec_score: 0.75
max_commands_per_feature: 50
max_execution_time_minutes: 60
allow_destructive: false
```

### Safety Guards

1. **PLAN.md before execution** — Plan written to disk before any command runs
2. **Auto-approval threshold** — Only auto-approves if spec score ≥ 0.75
3. **Max retries** — 3 per command, 2 per stage (configurable)
4. **Escalation** — Human alerted on: max retries, critical errors, 30min blocked
5. **No destructive ops** — `rm -rf`, `DROP TABLE`, `git push --force` blocked unless `allow_destructive: true`
6. **No production writes** — Blocked unless `environment: production` with human approval
7. **Budget limits** — max 50 commands, max 60 minutes per feature

---

## Output Files

### Per Feature

```
<output-dir>/
├── spec.yaml          # Validated spec (always)
├── PLAN.md            # --output plan|plan+runbook|all
├── RUNBOOK.md         # --output plan|plan+runbook|all (with exec log in --output all)
└── logs/
    └── autonomous_execution.log
```

### File Contents

**spec.yaml** — Validated YAML with `task_id`, `summary`, `local_goals[]` (with `verification` blocks), `context` (language, framework, ORM, test_framework), `global_goals_refs[]`.

**PLAN.md** — Human-readable execution plan with:
- Feature name, purpose, dependencies, assumptions
- Global success criteria
- Execution stages (each with objective, inputs, preconditions, discovery tasks, execution tasks, suggested commands, expected outputs, local verification, failure procedure, completion condition)
- Global verification (build, test, typecheck, lint, security, etc.)

**RUNBOOK.md** — Machine-executable template with:
- Taxonomy (Feature → Stages → Commands)
- Intent & goals (global + local)
- Preconditions table
- Command Runway table (`| Cmd# | Deps | Type | Command | Expected | Fallback |`)
- Execution Log (filled during execution)
- Goal Verification (local + global)
- Iteration & Notes
- Machine-Readable JSON (with DAG, structured assertions, `depends_on`)

---

## Command Runway Format

### Command Types

| Marker | Role | Can Mutate? |
|--------|------|-------------|
| ⏾ | inspect (read-only) | No |
| ✎ | modify/create | Yes |
| ✓ | verify (assert) | No |

### Stage Structure

- Each stage: < 1 hour, 5-15 commands
- Order within stage: ⏾ (inspect) → ✎ (mutate) → ✓ (verify)
- Every ✎ command must have at least one ⏾ in its `depends_on` chain
- Every stage ends with at least one ✓ verify command

### Example Command Table

```markdown
### Stage 1: Create health endpoint

| Cmd# | Deps | Type | Command | Expected | Fallback |
|------|------|------|---------|----------|----------|
| C1   | —    | ⏾    | cat packages/core/src/index.ts | file contents | search for file |
| C2   | C1   | ✎    | cat > apps/api/src/routes/health.ts << 'EOF'... | new file | revert, retry |
| C3   | C2   | ✓    | test -f apps/api/src/routes/health.ts && grep -q 'health' ... | exit 0 | revert, retry |
```

---

## Decision Matrix: Which Skill To Use

| Scenario | Skill | Command |
|----------|-------|---------|
| "I have a prompt, give me working software" | `command-runway-autonomous` | `autonomous_execute.py --output all` |
| "I just want a validated spec" | `command-runway-autonomous` | `autonomous_execute.py --output spec` |
| "I want to review the plan before execution" | `command-runway-autonomous` | `autonomous_execute.py --output plan` |
| "I want plan + runbook, I'll execute manually" | `command-runway-autonomous` | `autonomous_execute.py --output plan+runbook` |
| "I have a RUNBOOK, just execute it" | `command-runway-autonomous` | `autonomous_execute.py --output execute-only` |
| "I want to use Ollama for spec generation" | `spec-forge-core` | `make spec` in githeri repo |
| "I want agent-as-LLM, no Ollama" | `spec-forge-unified` | Load skill, agent writes spec directly |
| "I want to score a runbook" | `spec-forge-scorer` | Run scorer script |
| "I want to fine-tune a model" | `spec-forge-training` | `make train` in githeri repo |
| "I want to understand the ecosystem" | `spec-forge` (umbrella) | Load skill, read decision matrix |

---

## Self-Healing Behavior

### On Command Failure (Per-Command)

| Attempt | Action |
|---------|--------|
| 1 | Execute command → Check verification |
| 2 | Re-read spec/PLAN → Re-execute with more context |
| 3 | Diagnose root cause → Corrective action → Retry |
| 4+ | Escalate to human |

### On Stage Failure (Per-Stage)

| Attempt | Action |
|---------|--------|
| 1 | Execute all stage commands |
| 2 | Re-read PLAN.md → Re-execute failed commands |
| 3 | Full stage re-plan (agent re-generates stage commands) |

### Escalation Triggers

- `max_retries_per_stage` exceeded
- `consecutive_failures` > threshold (default: 3)
- `blocked_duration_minutes` exceeded (default: 30)
- Error contains: `security`, `data_loss`, `schema_migration`, `permission_denied`
- Critical infrastructure down (DB, message queue, external API)

### Escalation Report

When escalated, the system produces:

```markdown
## 🚨 AUTONOMOUS ESCALATION

**Feature:** add-user-profile
**Stage:** 3 (Verify: POST /users returns 201)
**Command:** `pnpm test --filter=...`
**Failures:** 3 consecutive
**Duration:** 45 minutes blocked

### Last Error
(error output)

### Diagnosed Root Cause
- [x] Incorrect assumption: email uniqueness not checked
- [ ] Missing dependency
- [ ] Incorrect implementation
- [ ] Environment problem
- [ ] Test failure
- [ ] Unexpected architecture

### Suggested Corrective Actions
1. Add email uniqueness check before INSERT
2. Return 409 CONFLICT with error code EMAIL_EXISTS
3. Add test for duplicate email case

### Options
- [ ] Apply suggested fix and resume
- [ ] Re-plan stage and resume
- [ ] Abort feature
- [ ] Human takes over
```

---

## Origin

Built for the Verified Attention Engine (VAE) project. Tested end-to-end with Hermes Agent on Sprint 6 (proof generation + cryptographic signing) and Sprint 7 (pipeline production hardening).

The Spec-Forge ecosystem evolved from a two-skill workflow (spec-forge-core + command-runway-pattern) into a complete autonomous pipeline with:
- Canonical vocabulary (validated by Python validator)
- User-friendly error messages (15 error hints with fix instructions)
- Multiple output modes (spec, plan, plan+runbook, all, execute-only)
- Multiple execution backends (Python, Hermes, OpenCode)
- Self-healing with escalation
- Training pipeline for fine-tuning models
