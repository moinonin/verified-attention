# Verified Attention Engine (VAE)

> **Establishing Verified Attention as a new layer of Internet infrastructure**

[![Version](https://img.shields.io/badge/version-1.0--draft-blue)](docs/specs/0001-verified-attention-protocol.md)
[![Status](https://img.shields.io/badge/status-living%20document-orange)](#)
[![License](https://img.shields.io/badge/license-Apache--2.0-green)](#)
[![Protocol](https://img.shields.io/badge/protocol-VAP--1.0-draft-purple)](docs/specs/0001-verified-attention-protocol.md)

---

## The Problem

Human attention is the scarcest resource on the Internet. It drives advertising, education, compliance, research, media, healthcare, and AI training. Yet **no infrastructure layer exists to independently verify that a human genuinely engaged with digital content**.

Today's platforms measure their own metrics; advertisers trust platform reports; educators trust completion certificates; researchers trust self-reported data. All are proxy metrics—vulnerable to fraud, gaming, and misaligned incentives. Estimated 20–40% of digital ad spend is wasted on non-human traffic.

---

## The Solution

**Verified Attention** is a standard, interoperable mechanism for independently verifying human attention with measurable confidence, while preserving privacy and application neutrality.

It is not an advertising technology. It is not an analytics tool. It is not a payment system. It is the **infrastructure** that makes attention verifiable—the same way DNS makes names resolvable, TLS makes connections trustworthy, and HTTP makes resources addressable.

### Core Innovation: Evidence-Centric Architecture (ECA)

```
Observation → Evidence → Claim → Confidence → Verification → Proof of Attention → Applications
```

Evidence is the primary architectural primitive. Everything derives from evidence. No decision without evidence. No evidence without provenance. Evidence is immutable.

---

## Document Hierarchy

This repository follows a strict document hierarchy (per [AI_AUTHORING_GUIDE.md](docs/AI_AUTHORING_GUIDE.md)):

| Document | Purpose | Status |
|----------|---------|--------|
| **[Venture Thesis](docs/VENTURE_THESIS.md)** | Why Verified Attention should exist — economic, philosophical, societal justification | ✅ Complete |
| **[Project Charter](docs/specs/0000-project-charter.md)** | What VAE intends to build — scope, phases, governance, roadmap | ✅ Complete |
| **[Verified Attention Protocol (VAP)](docs/specs/0001-verified-attention-protocol.md)** | Normative protocol specification — evidence, claims, confidence, proofs, conformance | ✅ Complete |
| **[Verified Attention Engine (VAE)](docs/specs/0010-verified-attention-engine.md)** | Reference implementation architecture — pipelines, ML, APIs, security, deployment | ✅ Complete |
| **[SPRINTS.md](SPRINTS.md)** | Systematic 21-sprint implementation plan (42 weeks to VAE 1.0) | ✅ Complete |

**Rule**: Lower-level documents implement higher-level principles. They never redefine them.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            VERIFIED ATTENTION ECOSYSTEM                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────────────────────────────────────────┐   │
│  │   Client     │    │              VERIFIED ATTENTION ENGINE            │   │
│  │   SDKs       │    │                                                  │   │
│  ├──────────────┤    │  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │   │
│  │ Browser SDK  │───▶│  Evidence  │▶│ Attention │▶│ Fraud        │   │   │
│  │ Mobile SDK   │    │  Collection│  │ Intelligence│ Intelligence │   │   │
│  │ Desktop SDK  │    │  Pipeline  │  │ (ML)     │  (ML)        │   │   │
│  │ Extension    │    │            │  │          │  │            │   │   │
│  └──────────────┘    └─────┬──────┘  └────┬─────┘  └──────┬───────┘   │   │
│                            │              │             │            │   │
│                            ▼              ▼             ▼            │   │
│                     ┌──────────────────────────────────────────────┐   │
│                     │           VERIFICATION ENGINE                │   │
│                     │  Claims → Confidence → Policy → Decision    │   │
│                     └────────────────────┬─────────────────────────┘   │
│                                          │                              │
│                                          ▼                              │
│                     ┌──────────────────────────────────────────────┐   │
│                     │           PROOF GENERATION                   │   │
│                     │  Sign → Store → Index → Webhook              │   │
│                     └────────────────────┬─────────────────────────┘   │
│                                          │                              │
│                    ┌─────────────────────┼─────────────────────┐       │
│                    ▼                     ▼                     ▼       │
│           ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│           │   Public     │      │   Reward     │      │  Analytics   │ │
│           │   APIs       │      │  Intelligence│      │  & Dashboards│ │
│           └──────────────┘      └──────────────┘      └──────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Concepts

| Concept | Definition |
|---------|------------|
| **Observation** | Raw signal from interaction environment (mouse move, scroll, key press, viewport change, focus event) |
| **Evidence** | Validated, immutable record derived from observations, tagged with session, timestamp, source, cryptographic integrity |
| **Claim** | Semantic assertion about an attention session derived from evidence (e.g., "human was present," "content visible >30s") |
| **Confidence** | Calibrated probability (0.0–1.0) that a claim is correct, computed deterministically from evidence |
| **Verification** | Process of evaluating evidence against policy to produce decision: PASS, FAIL, INSUFFICIENT, PENDING |
| **Proof of Attention (PoA)** | Digitally signed, auditable record confirming a session achieved verified attention with a given confidence |
| **Viewer** | The human whose attention is being verified |
| **Publisher** | Entity making content available and requesting attention verification |
| **Verifier** | Entity that evaluates evidence and issues Proofs of Attention |
| **Consumer** | Entity that receives and acts upon Proofs of Attention (advertiser, educator, researcher, etc.) |

---

## Applications (Beyond Advertising)

Verified Attention is **application-neutral infrastructure**. Advertising is merely one application.

| Domain | Use Case |
|--------|----------|
| **Education** | Verified course completion, competency-based credentials, remote assessment integrity |
| **Compliance** | Mandatory training verification, regulatory disclosure confirmation, audit trails |
| **Research** | Ground-truth attention datasets, clinical trial adherence, survey quality filtering |
| **Healthcare** | Patient education verification, therapy adherence, clinical trial compliance |
| **AI Training** | Human feedback with verified attention (RLHF), training data quality filtering |
| **Public Communication** | Emergency alert reach verification, civic engagement measurement |
| **Enterprise** | Documentation effectiveness, meeting engagement, knowledge validation |
| **Streaming** | Verified viewership for licensing, engagement-based creator compensation |

---

## Quick Start

> **Note**: VAE is in active development. The following reflects the target developer experience at VAE 1.0 GA (see [SPRINTS.md](SPRINTS.md) for timeline).

### For Publishers (Integrating Verification)

```bash
# 1. Install browser SDK
npm install @verified-attention/browser-sdk

# 2. Initialize with your verification policy
import { VerifiedAttention } from '@verified-attention/browser-sdk';

const va = new VerifiedAttention({
  policyId: 'pol_reading_30s',        // Pre-defined or custom policy
  contentId: 'article_12345',          // Your content identifier
  onProof: (proof) => console.log('Verified:', proof)
});

// 3. Start session when user engages
va.startSession();

// 4. Receive Proof of Attention when verification passes
```

### For Consumers (Verifying Proofs)

```bash
# Install verification client
npm install @verified-attention/client
```

```javascript
import { VerifiedAttentionClient } from '@verified-attention/client';

const client = new VerifiedAttentionClient({
  verifierUrl: 'https://verifier.verified-attention.org'
});

// Verify a Proof of Attention independently
const proof = await client.getProof('pid_abc123');
const valid = await client.verifyProof(proof);

if (valid) {
  console.log(`Confidence: ${proof.confidence}`);
  console.log(`Content: ${proof.contentId}`);
  console.log(`Verifier: ${proof.verifierId}`);
}
```

### For Developers (Running Locally)

```bash
# Clone and start development stack
git clone https://github.com/verified-attention/vae.git
cd vae
pnpm install
pnpm dev          # Starts API, verifier, ML serving, dashboard

# Run conformance tests
pnpm test:conformance
```

---

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
│   └── sdk/
│       ├── browser/
│       ├── android/
│       ├── ios/
│       ├── desktop/
│       └── extension/
├── apps/
│   ├── api/                            # Public REST/Streaming APIs
│   ├── verifier/                       # Verification & proof generation service
│   ├── ml-serving/                     # Model inference servers
│   ├── developer-portal/               # Docs, API explorer, SDK downloads
│   ├── marketplace/                    # Attention marketplace (Phase 5)
│   └── cli/                            # Command-line tools
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── conformance/                    # VAP conformance test suites
│   ├── load/
│   └── chaos/
├── research/
│   ├── literature-review.md
│   └── models/
└── infra/                              # Kubernetes, Terraform, Helm charts
```

---

## Protocol Conformance

Any implementation claiming VAP compliance **MUST** pass the conformance test suite:

```bash
# Run conformance tests against your implementation
pnpm test:conformance -- --target=<your-endpoint>
```

Conformance covers:
- Evidence model validation (VAP Section 5)
- Session state machine (VAP Section 6)
- Claim structure & lifecycle (VAP Section 7)
- Confidence model determinism (VAP Section 8)
- Verification lifecycle & outcomes (VAP Section 9)
- Proof object structure & signature (VAP Section 10)
- Protocol messages (VAP Section 14)
- Privacy requirements (VAP Section 17)

See [Conformance Framework](packages/conformance/) for details.

---

## Security & Privacy

### Security

- **Threat Model**: [STRIDE analysis](docs/security/threat-model.md) covering all components
- **Authentication**: OAuth2/OIDC, API keys, mTLS for service-to-service
- **Authorization**: RBAC (admin, operator, reviewer, consumer, publisher)
- **Encryption**: TLS 1.3 everywhere, AES-256 at rest, HSM/KMS for signing keys
- **Penetration Testing**: Conducted per sprint (see [Sprint 14](SPRINTS.md#sprint-14-security-hardening--penetration-testing))

### Privacy

- **Data Minimisation**: Only VAP-required fields collected and stored
- **Consent**: Opt-in, session-scoped, granular, revocable
- **Pseudonymisation**: Session IDs unlinkable to viewer identity
- **Retention**: Evidence 90 days, Proofs 7 years, Analytics aggregated only
- **Data Subject Rights**: GDPR Art 15–20 API (access, rectification, erasure, portability)
- **DPIA**: [Data Protection Impact Assessment](docs/privacy/dpia-final.md) completed and audited

---

## Development

### Prerequisites

- Node.js ≥ 20 / Python ≥ 3.11
- pnpm ≥ 9
- Docker & Docker Compose
- Kubernetes (kind/minikube for local)

### Commands

```bash
# Install dependencies
pnpm install

# Start local development stack
pnpm dev

# Run all tests
pnpm test

# Run conformance tests only
pnpm test:conformance

# Type-check all packages
pnpm typecheck

# Lint
pnpm lint

# Build all packages
pnpm build

# Generate OpenAPI spec from API code
pnpm openapi:generate

# Generate SDKs from OpenAPI
pnpm sdk:generate
```

### Architecture Decision Records (ADRs)

Significant architectural decisions are documented as ADRs:

- [ADR-001](docs/adr/0001-language-framework.md): Language & Framework Selection
- [ADR-002](docs/adr/0002-model-serving.md): Model Serving Architecture
- [ADR-003](docs/adr/0003-verifier-trust.md): Verifier Identity & Trust Model

Create new ADRs for any decision affecting:
- Cross-package interfaces
- Protocol behaviour
- Security/privacy posture
- Scalability limits
- External dependencies

---

## Roadmap

| Milestone | Target | Criteria |
|-----------|--------|----------|
| **M1: VAP 1.0-Draft** | Sprint 4 | Spec complete, conformance framework running |
| **M2: Verification Core** | Sprint 6 | Session → evidence → verification → proof |
| **M3: Pipeline Hardened** | Sprint 7 | 10K evid/sec, chaos-tested |
| **M4: ML Models Ready** | Sprint 9 | Attention + fraud models serving, calibrated |
| **M5: VAE Feature-Complete** | Sprint 15 | All subsystems integrated, audited |
| **M6: SDKs Complete** | Sprint 18 | Browser, mobile, desktop, extension shipped |
| **M7: Public API Stable** | Sprint 19 | OpenAPI spec, generated SDKs, dev portal |
| **M8: VAE 1.0 RC** | Sprint 21 | Beta feedback integrated, launch checklist done |
| **M9: VAE 1.0 GA** | Sprint 21+2w | RC validated, docs complete, support ready |
| **M10: Marketplace 1.0** | Sprint 24 | Live transactions, legal cleared |
| **M11: Standards Submission** | Sprint 25 | IETF/W3C submission acknowledged |

Full sprint-by-sprint plan: [SPRINTS.md](SPRINTS.md)

---

## Contributing

We welcome contributions aligned with the [Venture Thesis](docs/VENTURE_THESIS.md) and [Project Charter](docs/specs/0000-project-charter.md).

### Getting Started

1. Read the [Venture Thesis](docs/VENTURE_THESIS.md) to understand the *why*
2. Read the [Project Charter](docs/specs/0000-project-charter.md) to understand the *what*
3. Read the [VAP Specification](docs/specs/0001-verified-attention-protocol.md) to understand the *rules*
4. Read the [VAE Architecture](docs/specs/0010-verified-attention-engine.md) to understand the *implementation*
5. Check [SPRINTS.md](SPRINTS.md) for current focus areas
6. Look for `good first issue` labels on GitHub Issues

### Contribution Process

1. **Discuss first**: Open an issue or discussion before significant work
2. **Follow ADR process**: Architectural changes require an ADR
3. **Conformance-first**: New protocol features need conformance tests
4. **Privacy-by-design**: All changes assessed for privacy impact
5. **Documentation**: Update docs in the same PR as code

### Code Standards

- TypeScript (strict mode) for all new packages
- Python 3.11+ for ML/research components
- RFC 2119 language in protocol specifications
- Semantic versioning for all packages
- Conventional commits for changelog generation

---

## Governance

### Protocol Governance

VAP evolution follows an RFC-style process (see [Charter Section 15](docs/specs/0000-project-charter.md#15-governance)):

1. **Proposal** → Anyone may submit
2. **Review** → Technical steering committee evaluates
3. **Discussion** → Open community feedback
4. **Decision** → Approve, reject, or request modifications
5. **Implementation** → VAE + conformance tests updated
6. **Publication** → New specification version

### Project Governance

- **Technical Steering Committee**: Oversees protocol evolution, architectural decisions
- **Security/Privacy Board**: Independent review of security/privacy changes
- **Research Advisory Council**: Guides research agenda, validates methodology

As the ecosystem matures, governance transitions to a neutral foundation (see [Charter Section 15](docs/specs/0000-project-charter.md#15-governance)).

---

## Research Programme

Open research questions driving the project (from [Thesis Section 15](docs/VENTURE_THESIS.md#15-research-agenda)):

1. **Objective attention measurement**: What is ground truth for attention?
2. **Confidence calibration limits**: Theoretical ceiling for human vs. simulation distinction?
3. **Predictive signals**: Which behavioural features maximize information gain per privacy cost?
4. **Uncertainty representation**: Beyond point-confidence to intervals, credal sets?
5. **Fraud economics**: At what detection rate does fraud become unprofitable?
6. **Mathematical privacy guarantees**: Differential privacy, ZK proofs, SMPC, on-device attestation?
7. **Accessibility & cultural fairness**: Verification equity across populations?
8. **Attention market design**: Price discovery, auction mechanisms, incentive compatibility?
9. **AI training dynamics**: Does verified attention filtering improve model quality/alignment?
10. **Decentralised verification**: Federated, on-device, blockchain-anchored, threshold signatures?

See [Research Agenda](docs/VENTURE_THESIS.md#15-research-agenda) and [Charter Section 13](docs/specs/0000-project-charter.md#13-research-programme) for details.

---

## License

This project is licensed under the **Apache License 2.0** — see [LICENSE](LICENSE) for details.

Protocol specifications (VAP) are additionally dedicated to the public domain via **CC0-1.0** to encourage unrestricted implementation.

---

## Development — Make Targets

All backend entrypoints are exposed as Make targets. Each target is verbose (prints what it's doing), idempotent (safe to re-run), and documented here.

**Python Virtual Environment:** All Python targets use `.venv/bin/python` — never bare `python` or `python3`. The `venv` target creates it if missing (prefers Python 3.11, falls back to `python3`). If the `.venv` was created at a different path and moved/copied, its shebangs will break — run `make clean-venv && make venv` to recreate.

**TypeScript Monorepo:** All TS targets use `pnpm` with Turborepo. Packages live in `packages/core`, `packages/pipeline`, `packages/store`.

### Quick Start

```bash
make install     # Create .venv + install pnpm packages
make test        # Run ALL tests (Python + TypeScript)
make verify      # Full verification: build + typecheck + lint + test
```

### Target Reference

| Target | Purpose | Prerequisites | Usage | Expected Output |
|--------|---------|---------------|-------|-----------------|
| `make help` | List all available targets with descriptions | None | `make help` | Colored list of all targets |
| `make venv` | Create or verify Python `.venv` (Python 3.11+ preferred) | `python3` or `python3.11` installed | `make venv` | `.venv/` directory with working Python |
| `make install` | Install all dependencies (Python venv + pnpm packages) | `python3`, `pnpm` | `make install` | `.venv/` created, `node_modules/` populated |
| `make prototype` | Run the Python evidence ingestion prototype (`scripts/prototype-ingest.py`) | `.venv` (auto-created) | `make prototype` | End-to-end pipeline output: mock observations → evidence → store |
| `make test-py` | Run Python tests (currently smoke-tests the prototype) | `.venv` (auto-created) | `make test-py` | Prototype runs without error |
| `make build` | Build all TypeScript packages | `pnpm` installed | `make build` | `dist/` in each package, exit 0 |
| `make test-ts` | Run all TypeScript unit tests | Packages built | `make test-ts` | All tests pass (currently 211 tests across core, pipeline, store) |
| `make typecheck` | Run `tsc --noEmit` across all packages | `pnpm` installed | `make typecheck` | No type errors, exit 0 |
| `make lint` | Run ESLint across all packages | `pnpm` installed | `make lint` | No errors (warnings non-blocking) |
| `make test` | Run ALL tests — Python + TypeScript | `.venv`, pnpm packages | `make test` | All tests pass |
| `make verify` | Full verification gate: build + typecheck + lint + test | `.venv`, pnpm packages | `make verify` | All gates pass, exit 0 |
| `make clean` | Remove build artifacts (`dist/`), coverage, prototype data | None | `make clean` | Clean working tree |
| `make clean-venv` | Remove `.venv` (forces recreation on next `make venv`) | None | `make clean-venv` | `.venv/` deleted |

### Python Prototype Details

The prototype (`scripts/prototype-ingest.py`) demonstrates the VAP evidence pipeline:
1. Creates 15 mock observations (scroll, click, keypress, visibility, focus)
2. Validates each observation against VAP Section 4 requirements
3. Normalizes to canonical signal types
4. Creates evidence from observations (E-INTERACTION, E-VISIBLE, E-DURATION, E-CONTEXT)
5. Stores evidence in append-only JSONL file (`data/evidence_store.jsonl`)
6. Retrieves and displays stored evidence

```bash
make prototype          # Run via Make (preferred)
.venv/bin/python scripts/prototype-ingest.py  # Run directly
```

### Verification Protocol

For COMMAND_RUNWAY sprint execution, the standard verification sequence is:
```bash
make verify   # build → typecheck → lint → test (all must pass)
```

---

## Citation

If you reference this work in academic or technical contexts:

```bibtex
@misc{verified-attention-2026,
  title={Verified Attention: A New Layer of Internet Infrastructure},
  author={Verified Attention Project Contributors},
  year={2026},
  howpublished={\url{https://github.com/verified-attention/vae}},
  note={Venture Thesis v1.0, VAP 1.0-draft, VAE 1.0-dev}
}
```

---

## Links

| Resource | Link |
|----------|------|
| **Venture Thesis** | [docs/VENTURE_THESIS.md](docs/VENTURE_THESIS.md) |
| **Project Charter** | [docs/specs/0000-project-charter.md](docs/specs/0000-project-charter.md) |
| **VAP Specification** | [docs/specs/0001-verified-attention-protocol.md](docs/specs/0001-verified-attention-protocol.md) |
| **VAE Architecture** | [docs/specs/0010-verified-attention-engine.md](docs/specs/0010-verified-attention-engine.md) |
| **Implementation Plan** | [SPRINTS.md](SPRINTS.md) |
| **Authoring Guide** | [docs/AI_AUTHORING_GUIDE.md](docs/AI_AUTHORING_GUIDE.md) |
| **Issue Tracker** | [GitHub Issues](https://github.com/verified-attention/vae/issues) |
| **Discussions** | [GitHub Discussions](https://github.com/verified-attention/vae/discussions) |

---

## Acknowledgements

This work builds on research in behavioural biometrics, bot detection, confidence calibration, privacy-enhancing technologies, and Internet architecture. Key influences include:

- IETF/W3C standards processes (RFC 2119, HTTP, TLS, DID, VC)
- MRC/IAB viewability standards
- Behavioral biometrics literature (keystroke dynamics, mouse dynamics)
- Adversarial ML & fraud detection research
- Privacy-enhancing technologies (differential privacy, ZK proofs, federated learning)
- Open-source infrastructure projects (Kubernetes, Kafka, OpenTelemetry, Prometheus)

See [Thesis Appendix B](docs/VENTURE_THESIS.md#appendix-b-research-references) for detailed references.

---

> **Verified Attention is proposed as a foundational layer of Internet infrastructure that enables trust wherever digital attention carries economic or societal value.**
>
> — [Venture Thesis, Conclusion](docs/VENTURE_THESIS.md#20-conclusion)