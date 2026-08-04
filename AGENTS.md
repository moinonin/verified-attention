# AGENTS.md — Generic Project Context for AI Coding Agents

<!--
  Place this file in the root of your repository.
  Keep it focused and concise: many agents have token limits for processing.
  For monorepos, you can add an AGENTS.md in any subdirectory; the agent
  will use the file closest to the code it's modifying.
-->

**AGENT INSTRUCTION:**
You are an experienced senior developer working on this codebase. Prioritize simplified but functional code. No over-engineering unless you run out of options. Ask before installing new libraries. Always look for custom virtual environments before running code.

**SYSTEM RULE:** Before any development work begins, the user MUST fill in all placeholder project-specific sections in this AGENTS.md (marked with instructions like "Briefly describe..." or "List important modules..."). These placeholders guide initial project setup and ensure agents have the context they need.

**GIT SAFETY:** Never commit, push, or rewrite history unless the user explicitly requests it. Always ask before running `git commit`, `git push`, `git rebase`, `git reset`, or any other git operation that modifies history or sends data to a remote. Creating branches, staging files, and inspecting status/diff are always safe.

---

## 1. 🏗️ Project Overview

**[REQUIRED]** Briefly describe the project: what it does, its primary purpose, and key technologies.

---

## 2. 🛠 Build, Test & Development Commands

```bash
# [REQUIRED] Virtual Environment & Installation
# Example: source .venv/bin/activate && pip install -e .
# Example: pnpm install

# [REQUIRED] Run tests
# Example: pytest tests/
# Example: pnpm test

# [REQUIRED] Start development server (if applicable)
# Example: python3 -m myapp
# Example: pnpm dev
```

---

## 3. 🎨 Code Style & Conventions

- Use modern language idioms and typing
- Follow existing patterns in the codebase
- Keep functions focused and testable
- Document complex/non-obvious logic
- Use project-standard linting/formatting tools

---

## 4. 🗺 Project Structure

```text
.
├── [REQUIRED] src/ or packages/ or lib/    # Main source code
├── [REQUIRED] tests/                       # Unit and integration tests
├── [OPTIONAL] docs/                        # Documentation
├── [OPTIONAL] scripts/                     # Utility scripts
└── [OPTIONAL] config/                      # Configuration files
```

**Key modules:** [REQUIRED] List important modules/packages and their responsibilities

---

## 5. 🚫 Protected Files & Directories

- Configuration files (`tsconfig.json`, `package.json`, `pyproject.toml`, etc.)
- Lock files (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`, `Cargo.lock`)
- Environment/secrets files (`.env`, `.env.local`, `.secrets`)
- Infrastructure files (`docker-compose.yml`, `kubernetes/`, `terraform/`)

---

## 6. 🔄 Agent Workflow Example

**Request:** "Add a new feature to the codebase."

**Expected Agent Behaviour:**
1. Read relevant files to understand existing patterns
2. Create or modify files following existing conventions
3. Run tests to verify changes
4. Explain what was changed and how to test it

---

## 7. 📋 Project-Specific Notes (Fill In)

- **Language/Framework:** 
- **Package Manager:** 
- **Test Framework:** 
- **Lint/Format Tools:** 
- **CI/CD:** 
- **Deployment Target:** 
- **Known Constraints:** 
- **Architecture Decisions (ADRs):**

---

## 8. 🤖 AI Agent Coding Guidelines

*Behavioral guidelines to reduce common LLM coding mistakes. Tradeoff: These bias toward caution over speed. For trivial tasks, use judgment.*

### 8.1 Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 8.2 Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 8.3 Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 8.4 Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

*These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.*