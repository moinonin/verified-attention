# COMMAND_RUNWAY Comparison Report: Legacy vs Spec-Forge Generated

## Executive Summary

**Generated**: 2026-07-25 via `spec-forge-unified` (agent-as-LLM) pipeline
- 21 per-sprint YAML specs validated against canonical vocabulary
- 21 plan prompts generated via `plan_from_spec.py`
- Master COMMAND_RUNWAY_NEW.md assembled by stitching per-sprint stages + Global Verification

---

## Quantitative Comparison

| Metric | Legacy (hand-crafted) | New (spec-forge) | Delta |
|--------|----------------------|------------------|-------|
| **Total Lines** | 1,406 | 822 | -41% |
| **Total Characters** | 60,619 | 39,863 | -34% |
| **Stages** | 22 | 21 | -1 |
| **Verification Checks (L#)** | 12 | 157 | +1,208% |
| **Global Goals (G#)** | 23 | 22 | -1 |
| **Structure Completeness** | Full (all sections) | Core (stages + global) | Partial |

---

## Stage-by-Stage Mapping

| Legacy Stage | Sprint | New Stage | Sprint | Content Parity |
|--------------|--------|-----------|--------|----------------|
| Stage 1: Core Protocol Data Models | Sprint 2 | Stage 1: Foundations & Environment | Sprint 1 | **Mismatch** - Legacy starts at Sprint 2 |
| Stage 2: Evidence Pipeline | Sprints 2-3, 7 | Stage 2: Evidence Model & Pipeline Skeleton | Sprint 2 | Partial |
| Stage 3: Session Management & API | Sprint 3 | Stage 3: Session Lifecycle & Prototypes | Sprint 3 | Good |
| Stage 4: VAP Spec & Conformance | Sprint 4 | Stage 4: VAP Spec & Conformance | Sprint 4 | Good |
| Stage 5: Verification Engine Core | Sprint 5 | Stage 5: Verification Engine Core | Sprint 5 | Good |
| Stage 6: Proof Generation & Signing | Sprint 6 | Stage 6: Proof Generation | Sprint 6 | Good |
| Stage 7: Pipeline Production Hardening | Sprint 7 | Stage 7: Pipeline Hardening | Sprint 7 | Good |
| Stage 8: Attention Intelligence | Sprint 8 | Stage 8: Attention Intelligence | Sprint 8 | Good |
| Stage 9: Fraud Intelligence | Sprint 9 | Stage 9: Fraud Intelligence | Sprint 9 | Good |
| Stage 10: Verification Hardening | Sprint 10 | Stage 10: Verification Hardening | Sprint 10 | Good |
| Stage 11: Proof Production | Sprint 11 | Stage 11: Proof Production | Sprint 11 | Good |
| Stage 12: Reward Intelligence | Sprint 12 | Stage 12: Reward Intelligence | Sprint 12 | Good |
| Stage 13: Analytics & Observability | Sprint 13 | Stage 13: Analytics & Observability | Sprint 13 | Good |
| Stage 14: Security Hardening | Sprint 14 | Stage 14: Security Hardening | Sprint 14 | Good |
| Stage 15: Privacy Compliance | Sprint 15 | Stage 15: Privacy Compliance | Sprint 15 | Good |
| Stage 16: Browser SDK Core | Sprint 16 | Stage 16: Browser SDK Core | Sprint 16 | Good |
| Stage 17: Browser SDK Advanced & Extension | Sprint 17 | Stage 17: Browser SDK Advanced & Extension | Sprint 17 | Good |
| Stage 18: Mobile & Desktop SDKs | Sprint 18 | Stage 18: Mobile & Desktop SDKs | Sprint 18 | Good |
| Stage 19: Public API Stabilization | Sprint 19 | Stage 19: Public API Stabilization | Sprint 19 | Good |
| Stage 20: Integration Tools & Onboarding | Sprint 20 | Stage 20: Integration Tools & Onboarding | Sprint 20 | Good |
| Stage 21: Beta Program & RC | Sprint 21 | Stage 21: Beta Program & RC | Sprint 21 | Good |
| **Global Verification** | Post-21 | **Global Verification** | Post-21 | Good |

**Key Finding**: Legacy Stage 1 = Sprint 2 (Core Models). New Stage 1 = Sprint 1 (Foundations). The spec-forge correctly generates one stage per sprint starting from Sprint 1.

---

## Section Completeness Comparison

| Section | Legacy | New | Status |
|---------|--------|-----|--------|
| Global Success Criteria | ✅ 19 goals (G1-G19) | ✅ 19 goals (G1-G19) | **Match** |
| Execution Stages | ✅ 22 stages | ✅ 21 stages | Sprint-aligned |
| Stage Inputs | ✅ Detailed | ✅ Concise | New = summary |
| Stage Preconditions | ✅ Detailed | ✅ Concise | New = summary |
| Discovery Tasks | ✅ Checklist format | ✅ Checklist format | Match |
| Execution Tasks | ✅ Numbered, detailed | ✅ From spec goals | New = L# descriptions |
| **Suggested Commands** | ✅ Full bash heredocs | ❌ **Missing** | **Gap** |
| **Expected Outputs** | ✅ File lists | ❌ **Missing** | **Gap** |
| Local Verification | ✅ Table (Check/Command/Expected) | ✅ Table (L#/Command/Expected) | Match |
| **Failure Procedure** | ✅ Detailed diagnostics | ❌ **Missing** | **Gap** |
| Completion Condition | ✅ Per-stage | ✅ Per-stage | Match |
| Global Verification | ✅ 13-row table | ✅ 13-row table | **Match** |

---

## Verification Check Density

| Document | L# Checks | Stage Avg | Coverage |
|----------|-----------|-----------|----------|
| Legacy | 12 | 0.5 | Low (only shows table rows) |
| New | 157 | 7.5 | High (from per-sprint spec) |

**Explanation**: Legacy only shows a few verification rows per stage in the excerpt. New has ~7-8 verification checks per sprint because each sprint spec defines multiple `local_goals` with `verification` blocks.

---

## Critical Gaps in New COMMAND_RUNWAY

### 1. Missing "Suggested Commands" Section
**Legacy**: Full bash heredoc with copy-pasteable commands for each stage
**New**: Absent - only verification commands in the Local Verification table

### 2. Missing "Expected Outputs" Section
**Legacy**: Lists every artifact expected after execution (files, tests, docs, configs, APIs, migrations)
**New**: Absent

### 3. Missing "Failure Procedure" Section
**Legacy**: Detailed diagnostic checklist (incorrect assumption, missing dependency, bad implementation, environment, test failure, unexpected architecture) + corrective plan template
**New**: Absent

### 4. Stage 0 Missing
**Legacy**: Has "Stage 0: Foundation & Monorepo Setup (Sprint 1)" - now mapped to New Stage 1
**New**: Stage 1 covers Sprint 1 correctly, but legacy's Stage 1 was actually Sprint 2

---

## Root Cause Analysis

The spec-forge pipeline produces **validated YAML specs** with:
- `task_id`, `summary`, `depends_on`, `local_goals[]` (with `verification`), `global_goals_refs`, `context`

The `plan_from_spec.py` emits a **plan prompt** (runbookprompt.md + spec YAML) designed for an agent to produce PLAN.md + RUNBOOK.md.

**What was done**: I stitched the per-sprint specs directly into a COMMAND_RUNWAY format, skipping the agent-driven PLAN.md generation step.

**What's missing**: The COMMAND_RUNWAY methodology expects the planning agent to EXPAND each spec into:
- Detailed execution tasks (beyond the L# descriptions)
- Suggested commands (the agent infers these from context + skill)
- Expected outputs (agent predicts artifacts)
- Failure procedures (agent applies methodology)

The specs are **inputs** to planning, not the plan itself.

---

## Recommendation

### Option A: Use Spec-Forge Properly (Recommended)
For each sprint:
```bash
# 1. Generate validated spec (already done - 21 specs in data/sprint{N}_spec.yaml)
# 2. Generate plan prompt 
make plan SPEC=data/sprint1_spec.yaml > plan_prompt.md
# 3. Feed to agent with command-runway-pattern skill → produces PLAN.md + RUNBOOK.md
# 4. Execute stage-by-stage
```

### Option B: Enrich New COMMAND_RUNWAY Post-Generation
Add missing sections by:
1. Generating "Suggested Commands" from `context.framework` + `context.orm` + `local_goals`
2. Deriving "Expected Outputs" from `local_goals` verification paths
3. Adding standard "Failure Procedure" template per stage

### Option C: Keep Legacy as Canonical, Use Spec-Forge for New Features
- Legacy COMMAND_RUNWAY.md remains the master execution document
- Use spec-forge-unified for **new feature requests** within sprints
- Per-sprint specs already validated and available

---

## Files Produced

| File | Purpose |
|------|---------|
| `/Users/nickrotich/.hermes/skills/spec-forge/data/sprint{N}_spec.yaml` | 21 validated sprint specs |
| `/Users/nickrotich/.hermes/skills/spec-forge/data/sprint{N}_plan_prompt.md` | 21 plan prompts for command-runway-pattern |
| `/Users/nickrotich/Desktop/portfolio/projects/python/verified-attention/COMMAND_RUNWAY_NEW.md` | Stitched master (this comparison) |
| `/Users/nickrotich/Desktop/portfolio/projects/python/verified-attention/COMMAND_RUNWAY.md` | Legacy hand-crafted (unchanged) |

---

## Conclusion

The **spec-forge pipeline works correctly** for its intended purpose: producing validated, canonical-vocabulary YAML specs from natural language prompts.

The **COMMAND_RUNWAY_NEW.md** generated by direct stitching is a **valid structural skeleton** (21 sprint-aligned stages, 157 verification checks, complete global criteria) but **lacks the execution detail** that the command-runway-pattern methodology expects the planning agent to add.

**For production use**: Run the 21 plan prompts through an agent with `command-runway-pattern` skill to generate full PLAN.md + RUNBOOK.md per sprint, then execute.

**For reference**: Legacy COMMAND_RUNWAY.md remains the more detailed execution document; the new one is a spec-forge-validated structural equivalent at the sprint level.