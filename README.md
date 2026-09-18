# Verified Attention Engine (VAE)

**Reference implementation of the Verified Attention Protocol (VAP)** — an open, interoperable protocol for verifying human digital engagement with cryptographic provenance, calibrated confidence, and independent verification.

*Current capability: protocol specification (VAP) + reference engine (VAE) + contract test suite. Target: Internet infrastructure layer for verified engagement. See [Protocol vs Capability](#protocol-vs-capability) for details.*

--------------------------------------------------------------------------------

## The Problem

Human attention is the scarcest resource on the Internet. It drives advertising, education, compliance, research, media, healthcare, and AI training. Yet **no infrastructure layer exists to independently verify that a human genuinely engaged with digital content**.

Today's platforms measure their own metrics; advertisers trust platform reports; educators trust completion certificates; researchers trust self-reported data. All are proxy metrics—vulnerable to fraud, gaming, and misaligned incentives. Estimated 20–40% of digital ad spend is wasted on non-human traffic.

--------------------------------------------------------------------------------

## The Solution

**Verified Attention** is a standard, interoperable mechanism for independently verifying human attention with measurable confidence, while preserving privacy and application neutrality.

It is not an advertising technology. It is not an analytics tool. It is not a payment system. It is the **infrastructure** that makes attention verifiable—the same way DNS makes names resolvable, TLS makes connections trustworthy, and HTTP makes resources addressable.

### Core Innovation: Evidence-Centric Architecture (ECA)

```
Observation → Evidence → Claim → Confidence → Verification → Proof of Attention → Applications
```

Evidence is the primary architectural primitive. Everything derives from evidence. No decision without evidence. No evidence without provenance. Evidence is immutable.

--------------------------------------------------------------------------------

## Document Hierarchy

This repository follows a strict document hierarchy (per [AI_AUTHORING_GUIDE.md](docs/AI_AUTHORING_GUIDE.md)):

| Document                                                                            | Purpose                                                                               | Status     |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| [Venture Thesis](docs/VENTURE_THESIS.md)                                          | Why Verified Attention should exist — economic, philosophical, societal justification | ✅ Complete |
| [Project Charter](docs/specs/0000-project-charter.md)                               | What VAE intends to build — scope, phases, governance, roadmap                        | ✅ Complete |
| [Verified Attention Protocol (VAP)](docs/specs/0001-verified-attention-protocol.md) | Normative protocol specification — evidence, claims, confidence, proofs, conformance  | ✅ Complete |
| [Verified Attention Engine (VAE)](docs/specs/0010-verified-attention-engine.md)     | Reference implementation architecture — pipelines, ML, APIs, security, deployment     | ✅ Complete |
| [SPRINTS.md](SPRINTS.md)                                                            | Systematic 21-sprint implementation plan (42 weeks to VAE 1.0)                        | ✅ Complete |

**Rule**: Lower-level documents implement higher-level principles. They never redefine them.

\\--------------------------------------------------------------------------------

## Protocol vs Capability

This repository distinguishes four layers to avoid premature infrastructure claims:

| Layer | Status | What exists today |
|-------|--------|-------------------|
| **Protocol Specification (VAP)** | ✅ Complete | `docs/specs/0001-verified-attention-protocol.md` — normative spec for evidence, claims, confidence, proofs, conformance (CC0) |
| **Reference Implementation (VAE)** | ✅ Complete | `docs/specs/0010-verified-attention-engine.md` + working code: `apps/api/`, `apps/verifier/`, `packages/verification/`, contract tests |
| **Target Infrastructure** | 🔄 In Progress | Deploy-level Docker (`make start-cluster`), CI contracts, observability, security hardening |
| **Future Moat** | 📋 Planned | Proprietary evidence dataset (S9), calibrated verification guarantees (S10), protocol network effects (S11), SDK distribution (S12) |

**Current capability** = VAP spec + VAE engine + contract tests.
**Target infrastructure** = production-deployable VAE with independent verifiers, publishers, consumers.
**Future moat** = data + validation + network effects + trust (not code alone).

\\--------------------------------------------------------------------------------

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           VERIFIED ATTENTION ECOSYSTEM                       │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Client SDKs  ──▶  Evidence Collection  ──▶  Attention Intelligence (ML)     │
│  (Browser,    │      Pipeline                  │                             │
│   Mobile,     │      │                           ▼                           │
│   Desktop,    │      ▼                  Fraud Intelligence (ML)              │
│   Extension)  │  Verification Engine  ──▶  Claims → Confidence               │
│               │  (Policy → Decision)         → Proof of Attention            │
│               │      │                           │                           │
│               │      ▼                           ▼                           │
│               │  Proof Generation: Sign → Store → Index → Webhook            │
│               │      │                           │                           │
│               ▼      ▼                           ▼                           │
│         Public APIs  │  Reward Intelligence  │  Analytics & Dashboards       │
└──────────────────────────────────────────────────────────────────────────────┘
```

--------------------------------------------------------------------------------

## Key Concepts

| Concept                      | Definition                                                                                                              |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Observation**              | Raw signal from interaction environment (mouse move, scroll, key press, viewport change, focus event)                   |
| **Evidence**                 | Validated, immutable record derived from observations, tagged with session, timestamp, source, cryptographic integrity  |
| **Claim**                    | Semantic assertion about an attention session derived from evidence (e.g., "human was present," "content visible >30s") |
| **Confidence**               | Calibrated probability (0.0–1.0) that a claim is correct, computed deterministically from evidence                      |
| **Verification**             | Process of evaluating evidence against policy to produce decision: PASS, FAIL, INSUFFICIENT, PENDING                    |
| **Proof of Attention (PoA)** | Digitally signed, auditable record confirming a session achieved verified attention with a given confidence             |
| **Viewer**                   | The human whose attention is being verified                                                                             |
| **Publisher**                | Entity making content available and requesting attention verification                                                   |
| **Verifier**                 | Entity that evaluates evidence and issues Proofs of Attention                                                           |
| **Consumer**                 | Entity that receives and acts upon Proofs of Attention (advertiser, educator, researcher, etc.)                         |

--------------------------------------------------------------------------------

## Applications (Beyond Advertising)

Verified Attention is **application-neutral infrastructure**. Advertising is merely one application.

| Domain                   | Use Case                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **Education**            | Verified course completion, competency-based credentials, remote assessment integrity |
| **Compliance**           | Mandatory training verification, regulatory disclosure confirmation, audit trails     |
| **Research**             | Ground-truth attention datasets, clinical trial adherence, survey quality filtering   |
| **Healthcare**           | Patient education verification, therapy adherence, clinical trial compliance          |
| **AI Training**          | Human feedback with verified attention (RLHF), training data quality filtering        |
| **Public Communication** | Emergency alert reach verification, civic engagement measurement                      |
| **Enterprise**           | Documentation effectiveness, meeting engagement, knowledge validation                 |
| **Streaming**            | Verified viewership for licensing, engagement-based creator compensation              |

--------------------------------------------------------------------------------

## Quick Start

**Note**: VAE is in active development. The following distinguishes **what works today** from **target GA experience**.

### What works today (local development)

```
# Clone repo and install dependencies
pnpm install

# Build the api (pre-built dist for deploy-level module fix)
pnpm --filter @verified-attention/api run build

# Run contract tests
make test         # Runs contract tests (provider-verify, integration-cicd, load-reconcile)
make lint         # Lint all packages

# Start full cluster (Docker Compose — deploy-level)
make start-cluster   # Starts api + verifier + settlement-worker + postgres + redis + jaeger
make stop-cluster    # Stops and cleans cluster

# Note: 'pnpm dev' runs 'tsdown --watch' (rebuild on file change) — does NOT start the server.
```

### Target GA experience (SDKs not yet available)

*The following reflects the target developer experience at VAE 1.0 GA. SDK packages (`@verified-attention/browser-sdk`, `@verified-attention/client`) are **planned — Phase 5** and not yet published to npm.*

```
# For Publishers (Integrating Verification) — TARGET GA
# npm install @verified-attention/browser-sdk
# import { VerifiedAttention } from '@verified-attention/browser-sdk';
# const va = new VerifiedAttention({ policyId: 'pol_reading_30s', contentId: 'article_12345', onProof: (proof) => console.log('Verified:', proof) });
# va.startSession();

# For Consumers (Verifying Proofs) — TARGET GA  
# npm install @verified-attention/client
# import { VerifiedAttentionClient } from '@verified-attention/client';
# const client = new VerifiedAttentionClient({ verifierUrl: 'https://verifier.verified-attention.org' });
# const proof = await client.getProof('pid_abc123');
# const valid = await client.verifyProof(proof);
```

--------------------------------------------------------------------------------

## Repository Structure

```
verified-attention/
├── docs/
│   ├── AI_AUTHORING_GUIDE.md           # Writing standards for all documents
│   ├── VENTURE_THESIS.md               # Why Verified Attention exists
│   └── specs/
│       ├── 0000-project-charter.md     # What VAE builds
│       ├── 0001-verified-attention-protocol.md  # VAP normative spec
│       └── 0010-verified-attention-engine.md    # VAE architecture
├── SPRINTS.md                          # 21-sprint implementation plan
├── packages/
│   ├── core/                           # Shared types: Evidence, Claim, Proof, Session
│   │   ├── evidence/
│   │   ├── observation/
│   │   ├── session/
│   │   ├── claim/
│   │   └── proof/
│   ├── pipeline/                       # Evidence processing pipeline
│   │   ├── validation/
│   │   ├── normalization/
│   │   ├── deduplication/
│   │   ├── features/
│   │   └── enrichment/
│   ├── verification/                   # Verification engine
│   │   ├── confidence/
│   │   ├── engine/
│   │   └── policy/
│   ├── ml/                             # ML models & serving
│   │   ├── attention/
│   │   └── fraud/
│   ├── reward/                         # Reward intelligence
│   │   ├── eligibility/
│   │   ├── campaigns/
│   │   ├── pricing/
│   │   └── settlement/
│   ├── crypto/                         # Cryptographic primitives
│   │   ├── keys/
│   │   ├── signing/
│   │   └── hsm/
│   ├── store/                          # Storage abstractions
│   │   ├── evidence/
│   │   ├── proof/
│   │   └── verification-audit/
│   ├── observability/                  # Metrics, tracing, alerting
│   ├── auth/                           # Authentication & authorization
│   ├── privacy/                        # Consent, minimisation, retention
│   └── sdk/                           # SDK packages (planned: browser, mobile, desktop, extension — Phase 5)
│       ├── browser/                  # Planned — not yet in repo
│       ├── android/                  # Planned — not yet in repo
│       ├── ios/                      # Planned — not yet in repo
│       ├── desktop/                  # Planned — not yet in repo
│       └── extension/                # Planned — not yet in repo
├── apps/
│   ├── api/                            # Public REST/Streaming APIs
│   ├── verifier/                       # Verification & proof generation service
│   ├── ml-serving/                     # Planned — model inference servers (Phase 4)
│   ├── developer-portal/               # Planned — docs, API explorer, SDK downloads (Phase 5)
│   ├── marketplace/                    # Planned — attention marketplace (Phase 5)
│   └── cli/                            # Planned — command-line tools (Phase 4)
├── contracts/                        # Integration contracts, chaos contracts, load-reconcile, policy-evaluation
├── docs/
│   ├── AI_AUTHORING_GUIDE.md           # Writing standards
│   ├── VENTURE_THESIS.md               # Economic justification
│   └── specs/
│       ├── 0000-project-charter.md     # Scope/phases
│       ├── 0001-verified-attention-protocol.md  # Protocol spec
│       └── 0010-verified-attention-engine.md    # Engine architecture
└── infra/                              # Docker Compose + Kubernetes config (planned; managed via docker-compose.yml + contracts)
```

--------------------------------------------------------------------------------

## Protocol Conformance

Any implementation claiming VAP compliance **MUST** pass the conformance test suite:

```
# Run conformance tests against your implementation
pnpm test:conformance -- --target=
```