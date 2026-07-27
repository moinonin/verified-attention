# COMMAND_RUNWAY — Verified Attention Engine (VAE) Reference Implementation

**Target**: Build the Verified Attention Engine (VAE) — the reference implementation of the Verified Attention Protocol (VAP)  
**Specification**: `docs/specs/0001-verified-attention-protocol.md` (VAP), `docs/specs/0000-project-charter.md` (Charter), `docs/specs/0010-verified-attention-engine.md` (VAE)  
**Sprint Plan**: `SPRINTS.md` (21 sprints across 5 phases to VAE 1.0)  
**Monorepo**: TypeScript/Node.js (pnpm + Turborepo), packages: `core`, `pipeline`, `store`, `verification`, `crypto`, `ml/attention`, `ml/fraud`, `sdk/browser`, `sdk/mobile`, `sdk/desktop`, `extension`, `api`, `verifier`, `reward`, `analytics`, `cli`

---

# Global Success Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| G1 | VAP 1.0 specification published (`docs/specs/0001-verified-attention-protocol.md` v1.0) | Public GitHub Release `vap-1.0-draft` |
| G2 | Core VAP data models implemented with Zod schemas & 100% conformance test coverage | `pnpm test:conformance` passes |
| G3 | Evidence pipeline: ingestion → validation → normalization → dedup → feature extraction → store | `pnpm test:integration --filter=@verified-attention/pipeline` passes |
| G4 | Evidence store (append-only, indexed by session_id + EVID) with in-memory + persistent backends | `pnpm test --filter=@verified-attention/store` passes |
| G5 | Session lifecycle state machine (CREATED→ACTIVE→EXPIRED/VERIFIED/CANCELLED) enforced | Conformance test `session-state-machine` passes |
| G6 | Attention Intelligence: behaviour model AUC ≥ 0.95 on held-out human vs bot data | `tests/benchmarks/attention-model/` passes |
| G7 | Fraud Intelligence: ensemble model AUC ≥ 0.98, precision ≥ 0.95 at 0.1% FPR | `tests/benchmarks/fraud-model/` passes |
| G8 | Verification Engine: policy evaluation, confidence calculation, deterministic decisions | Conformance tests `verification-full` pass |
| G9 | Proof of Attention generation: Ed25519 signing, 7 mandatory fields, append-only store | Conformance tests `proof-full` pass |
| G10 | Reward Intelligence: eligibility → pricing → budget → settlement prep pipeline | Integration test `reward-flow` passes |
| G11 | Browser SDK < 50 KB gzipped, produces VAP-conformant evidence | `pnpm build --filter=@verified-attention/sdk-browser` + conformance |
| G12 | Browser Extension (MV3) published to Chrome/Firefox/Edge stores | Store listings approved |
| G13 | Public REST + Streaming APIs with OpenAPI 3.1 spec, generated SDKs (TS, Python, Go, Rust) | `pnpm openapi:generate` + `pnpm sdk:generate` |
| G14 | Security: OAuth2/OIDC, mTLS, RBAC, secrets management, encryption at rest, pen-test clean | `docs/security/pentest-report.md` clean |
| G15 | Privacy: consent management, data minimisation, pseudonymisation, retention, DSR API | Conformance `privacy` passes, DPIA sign-off |
| G16 | Observability: Prometheus metrics, Grafana dashboards, OpenTelemetry tracing, alerting | Dashboards render, alerts fire |
| G17 | Load test: 10K evidence/sec sustained 1hr (p99 < 500ms), 10K proofs/min (p99 < 1s) | `tests/load/` pass |
| G18 | Chaos test: pipeline node kill → recovery < 30s, zero evidence loss | `tests/chaos/` pass |
| G19 | All CI gates pass: lint, typecheck, test, build, conformance | `pnpm lint && pnpm typecheck && pnpm test && pnpm build` |

---

# Execution Stages


## Stage 1: Establish development environment, monorepo, CI/CD, ADR-001, research baseline

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 1 tasks

### Preconditions
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] INSPECT: Check existing project structure and verify no conflicting files

### Execution Tasks
1. **INSPECT: Check existing project structure and verify no conflicting files**
1. **CREATE: Initialize pnpm workspace with Turborepo monorepo structure**
1. **CREATE: Configure CI/CD pipeline with GitHub Actions (lint, typecheck, test, build)**
1. **CREATE: Define ADR template and create ADR-001 (Language/Framework Selection)**
1. **CREATE: Implement prototype evidence ingestion script (Python)**
1. **VERIFY: Threat model workshop (STRIDE) documented**
1. **VERIFY: Privacy impact assessment (DPIA) baseline documented**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -e package.json` | exit 0 |
| L2 | `pnpm init -y && pnpm add -D turbo && npx turbo init && echo 'exit_code=0'` | exit 0 |
| L3 | `test -f .github/workflows/ci.yml && grep -q 'lint' .github/workflows/ci.yml` | exit 0 |
| L4 | `test -f docs/adr/0001-language-framework.md && grep -q 'TypeScript' docs/adr/0001-language-framework.md` | exit 0 |
| L5 | `test -f scripts/prototype-ingest.py && grep -q 'evidence' scripts/prototype-ingest.py` | exit 0 |
| L6 | `test -f docs/security/threat-model.md && grep -q 'STRIDE' docs/security/threat-model.md` | exit 0 |
| L7 | `test -f docs/privacy/dpia-baseline.md && grep -q 'DPIA' docs/privacy/dpia-baseline.md` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 1 return PASS.

## Stage 2: Implement core evidence data model and processing pipeline skeleton

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 2 tasks
- Dependencies: sprint-1-foundations-environment

### Preconditions
- Stage 1 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: VAP Evidence model (Section 5) as TypeScript classes with Zod schemas**
1. **CREATE: Observation model (VAP Section 4) with all 8 signal types**
1. **CREATE: Evidence ingestion API (REST + WebSocket) in apps/api**
1. **CREATE: Validation pipeline stage (schema, timestamp, replay protection)**
1. **CREATE: Normalization pipeline stage (platform → canonical)**
1. **CREATE: Evidence store (append-only, immutable, indexed by session_id, EID)**
1. **VERIFY: Unit tests ≥80% coverage for evidence, observation, pipeline, store**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/core/src/evidence.ts && grep -q 'E-INTERACTION' packages/core/src/evidence.ts` | exit 0 |
| L2 | `test -f packages/core/src/observation.ts && grep -q 'SCROLL' packages/core/src/observation.ts` | exit 0 |
| L3 | `test -f apps/api/src/evidence` | exit 0 |
| L4 | `test -f packages/pipeline/src/validation.ts && grep -q 'validateEvidence' packages/pipeline/src/validation.ts` | exit 0 |
| L5 | `test -f packages/pipeline/src/normalization.ts && grep -q 'normalizeObservation' packages/pipeline/src/normalization.ts` | exit 0 |
| L6 | `test -f packages/store/src/evidence-store.ts && grep -q 'append' packages/store/src/evidence-store.ts` | exit 0 |
| L7 | `pnpm test --filter=@verified-attention/core --filter=@verified-attention/pipeline --filter=@verified-attention/store --coverage && echo 'exit_code=0'` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 2 return PASS.

## Stage 3: Session lifecycle management and attention/fraud model prototypes

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 3 tasks
- Dependencies: sprint-2-evidence-model-pipeline-skeleton

### Preconditions
- Stage 2 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Session model (VAP Section 6) with state machine (CREATED→ACTIVE→EXPIRED/VERIFIED/CANCELLED)**
1. **CREATE: Session API (create, get, update, close, expire) in apps/api**
1. **CREATE: Attention behaviour model prototype (reading patterns, scroll velocity)**
1. **CREATE: Fraud detection model prototype (automation, replay, emulator)**
1. **CREATE: Confidence calibration prototype (isotonic regression, conformal prediction)**
1. **CREATE: Evidence feature extraction schema (VAP Section 5 evidence types)**
1. **VERIFY: ADR-002 (Model serving architecture: batch vs streaming vs hybrid)**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/core/src/session.ts && grep -q 'stateMachine' packages/core/src/session.ts` | exit 0 |
| L2 | `test -f apps/api/src/sessions` | exit 0 |
| L3 | `test -f research/models/attention-prototype && grep -q 'attention' research/models/attention-prototype` | exit 0 |
| L4 | `test -f research/models/fraud-prototype && grep -q 'fraud' research/models/fraud-prototype` | exit 0 |
| L5 | `test -f research/models/confidence-prototype && grep -q 'calibration' research/models/confidence-prototype` | exit 0 |
| L6 | `test -f packages/pipeline/features/schema.json && grep -q 'E-INTERACTION' packages/pipeline/features/schema.json` | exit 0 |
| L7 | `test -f docs/adr/0002-model-serving.md && grep -q 'serving' docs/adr/0002-model-serving.md` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 3 return PASS.

## Stage 4: Complete VAP 1.0-draft specification and build conformance test harness

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 4 tasks
- Dependencies: sprint-3-session-model-research-prototypes

### Preconditions
- Stage 3 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Finalize VAP specification (all sections 1–14, appendices, no TODOs)**
1. **CREATE: Conformance test framework (test runner, fixtures, assertions)**
1. **VERIFY: Conformance tests for Evidence model validation (VAP Section 5)**
1. **VERIFY: Conformance tests for Session state machine (VAP Section 6)**
1. **VERIFY: Conformance tests for Proof object structure and signature (VAP Section 10)**
1. **VERIFY: Conformance tests for Protocol messages (SubmitEvidence, ClaimRequest, VerificationCreate)**
1. **VERIFY: Publish VAP 1.0-draft for external review (GitHub Release vap-1.0-draft)**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f docs/specs/0001-verified-attention-protocol.md && grep -q 'Appendix A' docs/specs/0001-verified-attention-protocol.md` | exit 0 |
| L2 | `test -f packages/conformance/src` | exit 0 |
| L3 | `test -f tests/conformance/evidence` | exit 0 |
| L4 | `test -f tests/conformance/session` | exit 0 |
| L5 | `test -f tests/conformance/proof` | exit 0 |
| L6 | `test -f tests/conformance/messages` | exit 0 |
| L7 | `# MANUAL: GitHub Release vap-1.0-draft published and publicly accessible` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 4 return PASS.

## Stage 5: Implement verification decision engine with configurable policies

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 5 tasks
- Dependencies: sprint-4-vap-spec-conformance-framework

### Preconditions
- Stage 4 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Claim model (VAP Section 7) with all 6 claim types**
1. **CREATE: Confidence Model (VAP Section 8) with calibration interface**
1. **CREATE: Verification Engine (VAP Section 9) lifecycle: evidence→claims→confidence→decision**
1. **CREATE: Policy Engine (VAE Section 10) with JSON policy config and threshold evaluation**
1. **CREATE: Verification outcome codes (PASS, FAIL, INSUFFICIENT, PENDING)**
1. **VERIFY: Conformance tests for verification engine (all VAP Section 9 requirements)**
1. **VERIFY: Integration test - Full session → evidence → verification → decision**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/core/src/claim.ts && grep -q 'HUMAN_PRESENCE' packages/core/src/claim.ts` | exit 0 |
| L2 | `test -f packages/verification/confidence/src/confidence-model.ts && grep -q 'calculateConfidence' packages/verification/confidence/src/confidence-model.ts` | exit 0 |
| L3 | `test -f packages/verification/engine/src/verification-engine.ts && grep -q 'verify' packages/verification/engine/src/verification-engine.ts` | exit 0 |
| L4 | `test -f packages/verification/policy/src/policy-engine.ts && grep -q 'evaluatePolicy' packages/verification/policy/src/policy-engine.ts` | exit 0 |
| L5 | `test -f packages/verification/outcomes/src/outcomes.ts && grep -q 'PASS' packages/verification/outcomes/src/outcomes.ts` | exit 0 |
| L6 | `test -f tests/conformance/verification` | exit 0 |
| L7 | `pnpm test:integration --filter=@verified-attention/verification && echo 'exit_code=0'` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 5 return PASS.

## Stage 6: Complete Proof of Attention generation with cryptographic integrity

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 6 tasks
- Dependencies: sprint-5-verification-engine-core-policy

### Preconditions
- Stage 5 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Proof of Attention object (VAP Section 10) with all 7 mandatory fields, serialization, hash computation**
1. **CREATE: Verifier key management (Ed25519, rotation, HSM interface)**
1. **CREATE: Proof signing service**
1. **CREATE: Proof verification (signature + hash validation) independent of verifier**
1. **CREATE: Proof store (append-only, indexed by PID, session_id)**
1. **VERIFY: Conformance tests for Proof structure, signature, immutability (VAP Section 10 + Appendix A)**
1. **VERIFY: ADR-003 (Verifier identity & trust model: centralized vs federated)**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/core/src/proof.ts && grep -q 'proofId' packages/core/src/proof.ts` | exit 0 |
| L2 | `test -f packages/crypto/keys/src/key-manager.ts && grep -q 'Ed25519' packages/crypto/keys/src/key-manager.ts` | exit 0 |
| L3 | `test -f apps/verifier/src/proof-signing` | exit 0 |
| L4 | `test -f packages/core/proof/verify.ts && grep -q 'verifyProof' packages/core/proof/verify.ts` | exit 0 |
| L5 | `test -f packages/store/proof/src/proof-store.ts && grep -q 'append' packages/store/proof/src/proof-store.ts` | exit 0 |
| L6 | `test -f tests/conformance/proof` | exit 0 |
| L7 | `test -f docs/adr/0003-verifier-trust.md && grep -q 'trust' docs/adr/0003-verifier-trust.md` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 6 return PASS.

## Stage 7: Harden pipeline for production throughput, reliability, observability

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 7 tasks
- Dependencies: sprint-6-proof-generation-cryptographic-signing

### Preconditions
- Stage 6 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Deduplication pipeline stage (content-hash + session)**
1. **CREATE: Feature extraction pipeline stage**
1. **CREATE: Evidence enrichment (context, device trust, source reliability)**
1. **CREATE: Pipeline observability - metrics (latency, throughput, error rates, backlog)**
1. **CREATE: Pipeline distributed tracing (OpenTelemetry)**
1. **CREATE: Dead letter queue for failed evidence with retry logic**
1. **VERIFY: Load test - 10K evidence/sec sustained 1 hour (p99 < 500ms, 0% data loss)**
1. **VERIFY: Chaos test - Kill pipeline nodes, verify no data loss (recovery < 30s)**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/pipeline/src/deduplication.ts && grep -q 'deduplicate' packages/pipeline/src/deduplication.ts` | exit 0 |
| L2 | `test -f packages/pipeline/src/features` | exit 0 |
| L3 | `test -f packages/pipeline/src/enrichment.ts && grep -q 'enrich' packages/pipeline/src/enrichment.ts` | exit 0 |
| L4 | `test -f packages/observability/pipeline-metrics/src` | exit 0 |
| L5 | `test -f packages/observability/tracing/src` | exit 0 |
| L6 | `test -f packages/pipeline/dlq/src` | exit 0 |
| L7 | `pnpm test:load --filter=pipeline-10k && echo 'exit_code=0'` | exit 0 |
| L8 | `pnpm test:chaos --filter=pipeline-resilience && echo 'exit_code=0'` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 7 return PASS.

## Stage 8: Production attention models with continuous learning pipeline

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 8 tasks
- Dependencies: sprint-7-pipeline-production-hardening

### Preconditions
- Stage 7 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Attention feature engineering (reading speed, pause distribution, engagement depth)**
1. **CREATE: Train attention behaviour model (Transformer/GRU for sequence modelling)**
1. **CREATE: Model serving (gRPC/REST, batch + streaming, p99 < 50ms)**
1. **CREATE: Model versioning, A/B routing, canary deployment**
1. **CREATE: Continuous learning - drift detection (KS test, population stability index)**
1. **CREATE: Automated retraining pipeline (data → train → validate → deploy)**
1. **VERIFY: Conformance - Model output deterministic for same input (fixed seed)**
1. **VERIFY: Integration test - Pipeline → features → model → confidence score**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/ml/attention/features/src` | exit 0 |
| L2 | `test -f packages/ml/attention/model/src` | exit 0 |
| L3 | `test -f apps/ml-serving/attention/src` | exit 0 |
| L4 | `test -f apps/ml-serving/infra/src` | exit 0 |
| L5 | `test -f packages/ml/attention/drift/src` | exit 0 |
| L6 | `test -f packages/ml/attention/retrain/src` | exit 0 |
| L7 | `test -f tests/conformance/ml-determinism` | exit 0 |
| L8 | `pnpm test:integration --filter=attention-ml && echo 'exit_code=0'` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 8 return PASS.

## Stage 9: Production fraud detection covering all threat vectors

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 9 tasks
- Dependencies: sprint-8-attention-intelligence-behaviour-models

### Preconditions
- Stage 8 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Behavioural biometrics features (mouse curvature, keystroke dynamics, pressure)**
1. **CREATE: Device fingerprinting (browser attrs, canvas, WebGL, audio, battery, entropy ≥ 18 bits)**
1. **CREATE: Automation detection (headless, Puppeteer, Selenium, Playwright signatures, detection ≥ 99%)**
1. **CREATE: Sybil detection (IP clustering, device correlation, velocity checks, graph-based)**
1. **CREATE: Reputation scoring (device, IP, subnet, ASN, time-decayed)**
1. **CREATE: Fraud ensemble model (gradient boosting + neural, AUC ≥ 0.98, precision ≥ 0.95 at 0.1% FPR)**
1. **CREATE: Fraud model serving (p99 < 50ms, shared infra)**
1. **VERIFY: Conformance - Fraud scores deterministic, auditable**
1. **VERIFY: Integration test - Fraud signals → verification engine policy → FAIL outcome**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/ml/fraud/biometrics/src` | exit 0 |
| L2 | `test -f packages/ml/fraud/fingerprint/src` | exit 0 |
| L3 | `test -f packages/ml/fraud/automation/src` | exit 0 |
| L4 | `test -f packages/ml/fraud/sybil/src` | exit 0 |
| L5 | `test -f packages/ml/fraud/reputation/src` | exit 0 |
| L6 | `test -f packages/ml/fraud/ensemble/src` | exit 0 |
| L7 | `test -f apps/ml-serving/fraud/src` | exit 0 |
| L8 | `test -f tests/conformance/fraud-determinism` | exit 0 |
| L9 | `pnpm test:integration --filter=fraud-verification && echo 'exit_code=0'` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 9 return PASS.

## Stage 10: Complete verification engine with all policy types, manual review queue

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 10 tasks
- Dependencies: sprint-9-fraud-intelligence-detection-models, sprint-5-verification-engine-core-policy

### Preconditions
- Stage 9 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Policy types - evidence requirements, confidence thresholds, fraud limits, session constraints**
1. **CREATE: Policy CRUD API (create, list, get, update, deprecate) with versioning + audit log**
1. **CREATE: Manual review queue (verification outcomes = INCONCLUSIVE) with UI + API, reviewer assignment, SLA tracking**
1. **CREATE: Verification audit log (immutable, queryable, full context)**
1. **CREATE: Verification replay (deterministic re-run with new policy, diff output)**
1. **VERIFY: Conformance - All VAP Section 9 verification lifecycle requirements**
1. **VERIFY: Load test - 1K verifications/sec mixed policies (p99 < 200ms, 0% errors)**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/verification/policy/types.ts && grep -q 'evidenceRequirements' packages/verification/policy/types.ts` | exit 0 |
| L2 | `test -f apps/api/src/policies` | exit 0 |
| L3 | `test -f apps/verifier/src/review-queue` | exit 0 |
| L4 | `test -f packages/store/verification-audit/src` | exit 0 |
| L5 | `test -f apps/verifier/src/replay` | exit 0 |
| L6 | `test -f tests/conformance/verification-full` | exit 0 |
| L7 | `pnpm test:load --filter=verification-1k && echo 'exit_code=0'` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 10 return PASS.

## Stage 11: Proof generation at scale with full audit trail

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 11 tasks
- Dependencies: sprint-10-verification-engine-policy-decision-hardening

### Preconditions
- Stage 10 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Proof generation pipeline (async, batched, idempotent, exactly-once semantics)**
1. **CREATE: Proof signing with HSM/cloud KMS integration (keys never in memory, audit trail)**
1. **CREATE: Proof revocation & supplementary proofs (VAP Section 10)**
1. **CREATE: Proof retrieval API (by PID, session, content, verifier, time range, paginated/filtered)**
1. **CREATE: Proof webhook delivery (retry, backoff, dead letter, HMAC signature)**
1. **VERIFY: Conformance - Proof structure, signature, immutability, revocation (100% VAP Section 10 + Appendix A)**
1. **VERIFY: Load test - 10K proofs/min generation + signing (p99 < 1s)**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f apps/verifier/src/proof-gen` | exit 0 |
| L2 | `test -f packages/crypto/hsm/src` | exit 0 |
| L3 | `test -f packages/core/proof/revocation.ts && grep -q 'revoked' packages/core/proof/revocation.ts` | exit 0 |
| L4 | `test -f apps/api/src/proofs` | exit 0 |
| L5 | `test -f apps/verifier/src/webhooks` | exit 0 |
| L6 | `test -f tests/conformance/proof-full` | exit 0 |
| L7 | `pnpm test:load --filter=proof-gen-10k && echo 'exit_code=0'` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 11 return PASS.

## Stage 12: Reward recommendation engine (eligibility, pricing, budget, ledger prep)

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 12 tasks
- Dependencies: sprint-11-proof-generation-production-ready

### Preconditions
- Stage 11 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Eligibility engine (policy match, proof validation, deduplication)**
1. **CREATE: Campaign policy engine (budget, pricing rules, caps, targeting)**
1. **CREATE: Dynamic pricing (attention value by content type, viewer quality, market)**
1. **CREATE: Budget allocation (pacing, caps, rollover, exhaustion handling)**
1. **CREATE: Settlement preparation (ledger entries, export formats, reconciliation)**
1. **VERIFY: Conformance - Reward recommendations traceable to proofs & policies**
1. **VERIFY: Integration test - Proof → eligibility → pricing → budget → settlement prep**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/reward/eligibility/src` | exit 0 |
| L2 | `test -f packages/reward/campaigns/src` | exit 0 |
| L3 | `test -f packages/reward/pricing/src` | exit 0 |
| L4 | `test -f packages/reward/budget/src` | exit 0 |
| L5 | `test -f packages/reward/settlement/src` | exit 0 |
| L6 | `test -f tests/conformance/reward` | exit 0 |
| L7 | `pnpm test:integration --filter=reward-flow && echo 'exit_code=0'` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 12 return PASS.

## Stage 13: Operational and business analytics dashboards, alerting

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 13 tasks
- Dependencies: sprint-7-pipeline-production-hardening, sprint-8-attention-intelligence-behaviour-models, sprint-9-fraud-intelligence-detection-models, sprint-10-verification-engine-policy-decision-hardening, sprint-11-proof-generation-production-ready, sprint-12-reward-intelligence

### Preconditions
- Stage 12 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Analytics data warehouse (columnar, partitioned by time)**
1. **CREATE: Operational metrics (throughput, latency, error rates, queue depths) with Prometheus + Grafana**
1. **CREATE: Attention metrics (verified sessions, confidence distribution, fraud rates, daily/hourly rollups)**
1. **CREATE: Fraud metrics (detection rates, false positives, new vectors, model performance monitoring)**
1. **CREATE: Business metrics (reward payout, campaign ROI, publisher yield, real-time + historical)**
1. **CREATE: Alerting rules (PagerDuty/Slack/email) for all critical paths, runbook-linked**
1. **CREATE: Distributed tracing query UI (Jaeger/Tempo integration)**
1. **VERIFY: Conformance - All metrics queryable via API for external consumers**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/analytics/warehouse/src` | exit 0 |
| L2 | `test -f packages/observability/ops-metrics/src` | exit 0 |
| L3 | `test -f packages/analytics/attention-metrics/src` | exit 0 |
| L4 | `test -f packages/analytics/fraud-metrics/src` | exit 0 |
| L5 | `test -f packages/analytics/business-metrics/src` | exit 0 |
| L6 | `test -f packages/observability/alerting/src` | exit 0 |
| L7 | `test -f packages/observability/tracing-ui/src` | exit 0 |
| L8 | `test -f tests/conformance/analytics-api` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 13 return PASS.

## Stage 14: Production-grade security posture

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 14 tasks
- Dependencies: sprint-13-analytics-observability-platform

### Preconditions
- Stage 13 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Authentication (OAuth2/OIDC, API keys, mTLS for service-to-service)**
1. **CREATE: Authorization (RBAC: admin, operator, reviewer, consumer, publisher)**
1. **CREATE: Secrets management (HashiCorp Vault / cloud secrets, rotation)**
1. **CREATE: Encryption at rest (evidence store, proof store, analytics warehouse, AES-256, key per tenant/env)**
1. **CREATE: TLS everywhere (internal mTLS, external TLS 1.3, cert-manager, auto-rotation, HSTS)**
1. **VERIFY: Penetration test (internal + external, critical/high findings remediated)**
1. **VERIFY: Dependency scan (SBOM, CVE monitoring, license compliance, zero critical/unpatched CVEs in prod deps)**
1. **CREATE: Security headers, CSP, rate limiting, WAF rules (OWASP ASVS Level 2)**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/auth/src` | exit 0 |
| L2 | `test -f packages/auth/rbac.ts && grep -q 'admin' packages/auth/rbac.ts` | exit 0 |
| L3 | `test -f packages/security/secrets/src` | exit 0 |
| L4 | `test -f packages/security/encryption-at-rest/src` | exit 0 |
| L5 | `test -f packages/security/tls/src` | exit 0 |
| L6 | `# MANUAL: Penetration test report at docs/security/pentest-report.md with zero critical/high findings` | exit 0 |
| L7 | `# MANUAL: SBOM at docs/security/sbom.json with zero critical CVEs` | exit 0 |
| L8 | `test -f apps/api/src/security` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 14 return PASS.

## Stage 15: Full privacy compliance (GDPR, CCPA), data minimisation enforced

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 15 tasks
- Dependencies: sprint-14-security-hardening-penetration-testing, sprint-11-proof-generation-production-ready, sprint-7-pipeline-production-hardening

### Preconditions
- Stage 14 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Consent management (capture, store, query, revoke per session)**
1. **CREATE: Data minimisation enforcement (schema validation, field stripping)**
1. **CREATE: Pseudonymisation (session IDs unlinkable, no PII in evidence)**
1. **CREATE: Retention policies (evidence: 90d, proofs: 7y, analytics: aggregated only, automated deletion jobs)**
1. **CREATE: Data subject rights API (access, rectification, erasure, portability per GDPR Art 15–20)**
1. **CREATE: Selective disclosure for proofs (confidence-only, evidence-hash-only, ZK-ready interface)**
1. **VERIFY: Independent privacy audit (DPIA update, legal review, auditor sign-off)**
1. **VERIFY: Conformance - Privacy requirements from VAP Section 17**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/privacy/consent/src` | exit 0 |
| L2 | `test -f packages/privacy/minimisation/src` | exit 0 |
| L3 | `test -f packages/privacy/pseudonymisation/src` | exit 0 |
| L4 | `test -f packages/privacy/retention/src` | exit 0 |
| L5 | `test -f apps/api/src/privacy` | exit 0 |
| L6 | `test -f packages/core/proof/disclosure.ts && grep -q 'disclosure' packages/core/proof/disclosure.ts` | exit 0 |
| L7 | `# MANUAL: DPIA final at docs/privacy/dpia-final.md with auditor sign-off` | exit 0 |
| L8 | `test -f tests/conformance/privacy` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 15 return PASS.

## Stage 16: Minimal, performant browser SDK for evidence collection

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 16 tasks
- Dependencies: sprint-2-evidence-model-pipeline-skeleton, sprint-7-pipeline-production-hardening

### Preconditions
- Stage 15 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Observation capture (visibility, scroll, click, key, focus, motion per VAP Section 4)**
1. **CREATE: Consent UI (banner, preferences, granular toggles, GDPR-compliant, accessible)**
1. **CREATE: Evidence batching, compression, offline queue (IndexedDB, survives page unload, retries on reconnect)**
1. **CREATE: Session lifecycle (start, heartbeat, close, timeout matching VAP Section 6 state machine)**
1. **CREATE: Schema validation before send (protobuf/JSON Schema)**
1. **VERIFY: Bundle size optimization (target < 50 KB gzipped, Webpack/Rollup, tree-shaking)**
1. **VERIFY: Cross-browser testing (Chrome, Firefox, Safari, Edge) - all observers work, no console errors**
1. **VERIFY: Conformance - SDK produces VAP-conformant evidence**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/sdk/browser/observers/src` | exit 0 |
| L2 | `test -f packages/sdk/browser/consent/src` | exit 0 |
| L3 | `test -f packages/sdk/browser/queue/src` | exit 0 |
| L4 | `test -f packages/sdk/browser/session/src` | exit 0 |
| L5 | `test -f packages/sdk/browser/validation/src` | exit 0 |
| L6 | `gzip -c packages/sdk/browser/dist/sdk.js \| wc -c && echo 'exit_code=0'` | exit 0 |
| L7 | `# MANUAL: Manual/Playwright test: no errors on Chrome/FF/Safari/Edge` | exit 0 |
| L8 | `test -f tests/conformance/browser-sdk` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 16 return PASS.

## Stage 17: Advanced SDK features + browser extension for user-facing verification

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 17 tasks
- Dependencies: sprint-16-browser-sdk-core

### Preconditions
- Stage 16 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Advanced features - reading detection, engagement scoring, attention heatmap (match ML feature schema)**
1. **CREATE: Publisher integration API (init, configure, callbacks, TypeScript types)**
1. **CREATE: Browser extension (Manifest V3) with user dashboard (active verifications, proofs earned)**
1. **CREATE: Extension UI - consent management, proof history, reward display (React/Vanilla, accessible, i18n-ready)**
1. **CREATE: Content script for publisher-less verification (user-initiated, works on any page with consent)**
1. **VERIFY: Extension store submission (Chrome Web Store, Firefox Add-ons, Edge Add-ons, approved listings, privacy policies)**
1. **VERIFY: Conformance - Extension produces same evidence as SDK**
1. **VERIFY: Documentation - SDK integration guide, extension user guide**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/sdk/browser/advanced/src` | exit 0 |
| L2 | `test -f packages/sdk/browser/publisher-api/src` | exit 0 |
| L3 | `test -f packages/extension/src` | exit 0 |
| L4 | `test -f packages/extension/ui/src` | exit 0 |
| L5 | `test -f packages/extension/content-script/src` | exit 0 |
| L6 | `# MANUAL: All 3 stores approved, listings live` | exit 0 |
| L7 | `test -f tests/conformance/extension` | exit 0 |
| L8 | `test -f docs/sdk/browser` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 17 return PASS.

## Stage 18: Native mobile (Android/iOS) and desktop SDKs

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 18 tasks
- Dependencies: sprint-17-browser-sdk-advanced-extension, sprint-7-pipeline-production-hardening

### Preconditions
- Stage 17 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Android SDK (Kotlin) - observers, consent, queue, session, network (all VAP observers, same evidence schema)**
1. **CREATE: iOS SDK (Swift) - observers, consent, queue, session, network (all VAP observers, same evidence schema)**
1. **CREATE: Desktop SDK (Electron/Tauri + native modules) - Windows, macOS, Linux (window focus, idle, input observers)**
1. **VERIFY: Cross-platform evidence parity tests (same session → equivalent evidence)**
1. **VERIFY: Mobile app store compliance (privacy manifests, data use declarations, App Store / Play Store ready)**
1. **VERIFY: Documentation - Mobile/desktop integration guides**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/sdk/android/src` | exit 0 |
| L2 | `test -f packages/sdk/ios/src` | exit 0 |
| L3 | `test -f packages/sdk/desktop/src` | exit 0 |
| L4 | `test -f tests/conformance/cross-platform` | exit 0 |
| L5 | `# MANUAL: Privacy manifests and data use declarations complete` | exit 0 |
| L6 | `test -f docs/sdk/mobile` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 18 return PASS.

## Stage 19: Production-ready public REST/Streaming APIs with full documentation

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 19 tasks
- Dependencies: sprint-14-security-hardening-penetration-testing, sprint-15-privacy-compliance-data-governance

### Preconditions
- Stage 18 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: Stabilize all API endpoints (evidence, sessions, proofs, verifications, policies, rewards) - no breaking changes after**
1. **CREATE: API versioning (URL path, headers, deprecation policy)**
1. **CREATE: OpenAPI 3.1 spec auto-generated from code (CI validates spec matches impl)**
1. **CREATE: API gateway (rate limiting, auth, logging, request ID, tracing)**
1. **CREATE: Developer portal (reference docs, quickstarts, API explorer with Try It)**
1. **CREATE: SDK generation from OpenAPI (TypeScript, Python, Go, Rust, CI publishes to npm/PyPI/crates.io)**
1. **VERIFY: Conformance - API matches VAP protocol messages exactly**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f apps/api/src` | exit 0 |
| L2 | `test -f apps/api/src/versioning.ts && grep -q 'v1' apps/api/src/versioning.ts` | exit 0 |
| L3 | `test -f apps/api/openapi.yaml && grep -q 'openapi: 3.1' apps/api/openapi.yaml` | exit 0 |
| L4 | `test -f apps/api-gateway/src` | exit 0 |
| L5 | `test -f apps/developer-portal/src` | exit 0 |
| L6 | `test -f packages/sdk/generated/src` | exit 0 |
| L7 | `test -f tests/conformance/api` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 19 return PASS.

## Stage 20: Developer onboarding experience, integration testing, sample applications

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 20 tasks
- Dependencies: sprint-19-public-api-stabilization-documentation

### Preconditions
- Stage 19 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **CREATE: CLI tool (vap verify, vap proof get, vap policy create)**
1. **CREATE: Integration test framework (testcontainers, mock verifier, fixtures, spin up full stack locally < 2 min)**
1. **CREATE: Sample applications - Publisher demo, Advertiser dashboard, Research notebook (runnable, documented, realistic)**
1. **CREATE: Quickstart guides (5-min, 30-min, production, tested by external developers)**
1. **CREATE: Sandbox environment (free tier, rate limited, auto-provisioned, self-serve signup, auto-cleanup)**
1. **VERIFY: Conformance - Sample apps pass VAP conformance**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `test -f packages/cli/src` | exit 0 |
| L2 | `test -f tests/integration/framework/src` | exit 0 |
| L3 | `test -f examples/publisher-demo/src` | exit 0 |
| L4 | `test -f docs/quickstart` | exit 0 |
| L5 | `test -f infra/sandbox/src` | exit 0 |
| L6 | `test -f tests/conformance/examples` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 20 return PASS.

## Stage 21: External beta with real publishers, iterate on feedback, VAE 1.0 RC

### Inputs
- VAP Spec Sections (see per-sprint SPRINTS.md)
- SPRINTS.md Sprint 21 tasks
- Dependencies: sprint-20-integration-tools-onboarding

### Preconditions
- Stage 20 verified complete
- Node.js >= 20, pnpm >= 9 installed
- Git repo initialized

### Discovery Tasks
- [ ] Inspect project structure
- [ ] Inspect existing APIs
- [ ] Inspect interfaces
- [ ] Inspect tests
- [ ] Inspect configuration
- [ ] Inspect dependencies

### Execution Tasks
1. **VERIFY: Recruit 5–10 beta publishers (diverse verticals: news, edu, e-comm, docs)**
1. **VERIFY: Beta support rotation (daily standups, dedicated Slack, issue triage, SLA: 4h response, 24h fix for blocking)**
1. **CREATE: Collect feedback (usability, API gaps, performance, documentation) - categorized, prioritized, tracked**
1. **CREATE: Implement top 10 feedback items (API fixes, SDK improvements, doc updates)**
1. **VERIFY: Load test with beta traffic (real patterns, real volumes, system stable at 2x expected launch load)**
1. **CREATE: Prepare launch checklist (monitoring, runbooks, rollback, communications)**
1. **VERIFY: VAE 1.0 Release Candidate (GitHub Release vae-1.0-rc1, all Phase 0–4 DoD met)**

### Local Verification
| Check | Command | Expected |
|-------|---------|----------|
| L1 | `# MANUAL: Signed agreements at docs/beta/participants.md, integration started` | exit 0 |
| L2 | `# MANUAL: Support plan at docs/beta/support-plan.md` | exit 0 |
| L3 | `test -f docs/beta/feedback.md && grep -q 'categorized' docs/beta/feedback.md` | exit 0 |
| L4 | `# MANUAL: Beta participants unblocked, top 10 items committed` | exit 0 |
| L5 | `pnpm test:load --filter=beta-traffic && echo 'exit_code=0'` | exit 0 |
| L6 | `test -f docs/launch/checklist.md && grep -q 'monitoring' docs/launch/checklist.md` | exit 0 |
| L7 | `# MANUAL: GitHub Release vae-1.0-rc1 published, all Phase 0–4 Definition of Done criteria satisfied` | exit 0 |

### Completion Condition
All Local Verification checks for Stage 21 return PASS.

---
# Global Verification (Post-Stage 21)

After all stages complete, perform complete project validation:

| Verification | Command / Action | Pass Criteria |
|--------------|------------------|---------------|
| Full Build | `pnpm build` | All packages build |
| Full Test Suite | `pnpm test` | All unit + integration + conformance pass |
| Typecheck | `pnpm typecheck` | Zero errors |
| Lint | `pnpm lint` | Zero errors |
| Format | `pnpm format --check` | No changes needed |
| Conformance | `pnpm test:conformance` | 100% VAP coverage |
| Load Tests | `pnpm test:load` | All thresholds met |
| Chaos Tests | `pnpm test:chaos` | Recovery < 30s, zero data loss |
| Security | Pen test report, SBOM | Critical/High = 0, SBOM current |
| Privacy | DPIA sign-off, conformance | Auditor approved, tests pass |
| Observability | Dashboards, alerts, tracing | All operational |
| Documentation | `docs/` complete | API, SDK, quickstart, architecture |
| VAP Spec | `docs/specs/0001-verified-attention-protocol.md` | v1.0 published |
| Release | GitHub Release `vae-1.0` | Tagged, artifacts published |

**Only after every global verification succeeds may the COMMAND_RUNWAY declare the feature complete.**

---
# Execution Rules (Mandatory)

1. **Never skip stages** — Each stage builds on verified outputs of previous stages
2. **Never skip verification** — Local verification must pass before proceeding
3. **Never continue after failed verification** — Diagnose, produce corrective plan, repeat stage
4. **Never modify uninspected files** — Read before write, always
5. **Prefer incremental implementation** — Small commits, isolated changes
6. **Minimize edits** — Touch only what the stage requires
7. **Preserve backwards compatibility** — API changes only in Stage 19 with versioning
8. **Do not duplicate functionality** — Reuse existing packages, check before creating
9. **Keep commits small and isolated** — One logical change per commit
10. **Treat every stage as a complete iteration** — Understand → Inspect → Plan → Execute → Verify

---
# Failure Procedure Template (Per Stage)

When any local verification fails:

```markdown
## Failure: [Stage N] - [Check Name]
**Command**: `pnpm test --filter=...`
**Exit Code**: N
**Output**: (last 50 lines)

### Root Cause Analysis
- [ ] Incorrect assumption about [spec/interface/dependency]
- [ ] Missing dependency: [package/service]
- [ ] Incorrect implementation: [file:function]
- [ ] Environment problem: [Node version, missing service, etc.]
- [ ] Test failure: [flaky, incorrect assertion, spec mismatch]
- [ ] Unexpected architecture: [discovered during inspection]

### Corrective Plan
1. [Specific fix action]
2. [Verification step]
3. [Re-run failed check]

### Repeat Stage
Re-execute failed stage tasks after fix. Do not proceed to next stage.
```