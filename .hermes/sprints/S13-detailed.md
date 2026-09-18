# S13 — Building the Real Moat: From Specifications to Deployed Assets

**Status**: Proposed  
**Depends on**: S9 (evidence-graph spec), S10 (verification guarantees spec), S11 (protocol openness spec), S12 (SDKs ready)  
**Goal**: Transform architectural specifications into deployed, validated moat assets — proprietary evidence dataset, calibrated models with published guarantees, adversarial robustness corpus, standards certification, and initial network.

---

## Moat Components & Synthetic Data Strategy

| Moat Component | Synthetic Data Helps? | Real-World Required? | Strategy |
|----------------|----------------------|---------------------|----------|
| **Evidence graph schema** | ✅ Yes | Schema only | Synthetic validates schema, serialization, integrity |
| **ML model training** | ⚠️ Partial | Yes | Synthetic for architecture search, hyperparameter tuning; real for final model |
| **Calibration (ECE, FPR, FNR)** | ❌ No | Yes | Requires ground-truth labels from real humans |
| **Adversarial robustness** | ✅ Yes | Yes | Synthetic for corpus generation; real for validation |
| **Cross-device/domain generalization** | ⚠️ Partial | Yes | Synthetic for coverage; real for validation |
| **Protocol conformance** | ✅ Yes | Yes | Synthetic for test generation; real for certification |
| **Network effects / adoption** | ❌ No | Yes | Requires real publishers, verifiers, consumers |

**Key insight**: Synthetic data accelerates *engineering* (schema, pipeline, CI, test generation) but cannot replace *validation* (calibration, generalization, certification) which requires human ground truth.

---

## S13 Sub-Sprints

### S13.1 — Synthetic Evidence Generation Pipeline (Week 1-2)
**Goal**: Generate realistic synthetic evidence for schema validation, pipeline testing, CI, and adversarial corpus.

**Deliverables**:
- `packages/evidence/synthetic/` — Synthetic data generator
- `contracts/contracts/synthetic-evidence.ts` — Machine-readable synthetic contract
- CI integration: synthetic evidence in `provider-verify.js` and `contract-test.js`

**Synthetic Evidence Components**:
```typescript
interface SyntheticEvidenceConfig {
  sessionCount: number;
  evidencePerSession: number;
  signalTypes: SignalType[];
  noiseLevel: number;
  fraudInjectionRate: number;
  groundTruthLabels: boolean; // for calibration subset
}
```

**Signal Generators**:
| Signal | Synthetic Approach |
|--------|-------------------|
| Mouse/keyboard | Biased random walks + dwell time distributions |
| Scroll | Velocity profiles + reading patterns |
| Viewport | Element visibility + obscuration simulation |
| Focus | Tab/window state machines |
| Timing | Session duration + interaction intervals (Weibull) |
| Fraud signals | Injected automation patterns (replay, velocity, fingerprint) |

**Acceptance Criteria**:
- [ ] Generates 100K+ sessions/minute
- [ ] Schema-valid against `evidence-graph.ts`
- [ ] Fraud injection configurable (0-100%)
- [ ] Ground-truth subset exportable for calibration
- [ ] Runs in CI (< 30s for 10K sessions)

---

### S13.2 — ML Training Pipeline (Week 3-4)
**Goal**: End-to-end training pipeline for attention + fraud models using synthetic + real data.

**Deliverables**:
- `packages/ml/training/` — Training pipeline (data → features → model → calibration → export)
- `packages/ml/models/attention/model.onnx` — Exported attention model
- `packages/ml/models/fraud/model.onnx` — Exported fraud model
- `packages/ml/training/README.md` — Reproducibility guide

**Pipeline Stages**:
```
Synthetic Data → Feature Engineering → Model Training → Calibration → Export (ONNX)
     ↑              ↑                    ↑              ↑            ↑
  S13.1         packages/              XGBoost/       Platt/       ONNX
               ml/features            LightGBM       Isotonic     Runtime
```

**Model Specs**:
| Model | Algorithm | Input | Output |
|-------|-----------|-------|--------|
| Attention | LightGBM | 50+ features (evidence signals) | P(ATTENTIVE) ∈ [0,1] |
| Fraud | XGBoost | 30+ features (velocity, replay, fingerprint) | P(FRAUD) ∈ [0,1] |

**Acceptance Criteria**:
- [ ] Reproducible training (fixed seeds, versioned data)
- [ ] Synthetic pre-training → real fine-tuning workflow
- [ ] ONNX export for inference runtime
- [ ] Training metrics logged (loss, AUC, calibration)
- [ ] Model versioning + artifact storage

---

### S13.3 — Calibration & Guarantees Pipeline (Week 5-6)
**Goal**: Produce calibrated models with published guarantees (ECE, FPR, FNR, adversarial robustness).

**Deliverables**:
- `packages/ml/calibration/` — Calibration pipeline (Platt + Isotonic + ECE measurement)
- `contracts/contracts/calibration-report.json` — Per-model guarantees
- `contracts/contracts/verification-guarantees.ts` — Updated with measured values

**Calibration Workflow**:
```
Holdout Set (Real Ground Truth) 
       ↓
Model Predictions → Platt Scaling → Isotonic Regression → ECE Measurement
       ↓
Guarantees Computation:
  - FPR / FNR per policy threshold
  - ECE (10-bin)
  - Adversarial robustness (S13.4 corpus)
  - Cross-device / cross-domain ΔAUC
       ↓
Publish to contracts/contracts/verification-guarantees.ts
```

**Ground Truth Requirements** (Minimum viable):
| Label Source | Sessions | Use Case |
|--------------|----------|----------|
| Behavioral study (lab) | 5,000 | Calibration base |
| Eye-tracking partner | 2,000 | High-confidence attention labels |
| Self-report + behavioral | 10,000 | Scale validation |
| Expert review (edge cases) | 1,000 | Adversarial validation |

**Acceptance Criteria**:
- [ ] ECE < 0.05 on holdout
- [ ] FPR < 2%, FNR < 5% per policy
- [ ] Adversarial robustness > 90% on S13.4 corpus
- [ ] Cross-device ΔAUC < 0.10, cross-domain ΔAcc < 0.15
- [ ] Guarantees published in `verification-guarantees.ts` with timestamps

---

### S13.4 — Adversarial Robustness Corpus (Week 7-8)
**Goal**: Generate and validate adversarial test corpus for continuous robustness evaluation.

**Deliverables**:
- `contracts/contracts/adversarial-corpus.ts` — Machine-readable attack corpus
- `packages/fraud/adversarial/` — Attack generators + evaluation harness
- `contracts/contracts/robustness-report.json` — Per-attack robustness metrics

**Attack Vectors (Synthetic + Real)**:
| Vector | Synthetic Generator | Real Validation |
|--------|-------------------|-----------------|
| Replay | Exact + jittered replay | Captured real sessions |
| Velocity | Superhuman interaction rates | Click-farm captures |
| Automation | Selenium/Playwright patterns | Bot traffic captures |
| Fingerprint | Canvas/WebGL/audio spoofing | Fingerprinting service test |
| Sybil | Coordinated multi-session | Botnet captures |
| Emulator | Device property spoofing | Device farm test |

**Corpus Structure**:
```typescript
interface AdversarialCase {
  attackId: string;
  vector: 'replay' | 'velocity' | 'automation' | 'fingerprint' | 'sybil' | 'emulator';
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: EvidenceRecord; // crafted to evade detection
  expectedDetection: boolean;
  metadata: {
    generator: string;
    parameters: Record<string, unknown>;
    realWorldReference?: string; // link to real capture
  };
}
```

**Acceptance Criteria**:
- [ ] 10,000+ adversarial cases across 6 vectors
- [ ] Each case has `expectedDetection` ground truth
- [ ] Corpus validates against `fraud-attack-generator.ts`
- [ ] Robustness metrics per vector published
- [ ] CI integration: regression test on corpus

---

### S13.5 — Cross-Device / Cross-Domain Generalization (Week 9-10)
**Goal**: Measure and improve generalization across devices and content domains.

**Deliverables**:
- `packages/ml/evaluation/generalization.ts` — Evaluation harness
- `contracts/contracts/generalization-report.json` — ΔAUC/ΔAcc metrics
- Device/domain coverage matrix

**Evaluation Matrix**:
| Dimension | Splits | Metric |
|-----------|--------|--------|
| Device | Desktop / Mobile / Tablet | ΔAUC |
| OS | Windows / macOS / iOS / Android | ΔAUC |
| Browser | Chrome / Firefox / Safari / Edge | ΔAUC |
| Content Domain | News / Video / E-commerce / Social / Docs | ΔAccuracy |
| Language | EN / ES / ZH / AR / HI | ΔAccuracy |

**Data Sources**:
- Synthetic: parameterized device/content generation
- Real: partner analytics (anonymized), public datasets (Common Crawl, WMT)

**Acceptance Criteria**:
- [ ] ΔAUC < 0.10 across device/OS/browser
- [ ] ΔAccuracy < 0.15 across domains/languages
- [ ] Failure cases documented with root cause
- [ ] Mitigation: domain-adversarial training, feature normalization

---

### S13.6 — Protocol Certification & Standards (Week 11-14)
**Goal**: Achieve VAP conformance certification; engage standards bodies.

**Deliverables**:
- `docs/certification/VAP-conformance-report.md` — Conformance evidence
- `docs/certification/IAB-MRC-submission.md` — MRC accreditation package
- `docs/certification/ISO-roadmap.md` — ISO/IEC path
- Independent verifier implementation guide

**Certification Milestones**:
| Body | Standard | Status | Target |
|------|----------|--------|--------|
| VAP Self-Cert | `provider-verify.js` + contracts | ✅ Ready | S11 complete |
| IAB Tech Lab | OM SDK / Attention Guidelines | 📋 Planned | S13.6 |
| MRC | Attention Measurement Accreditation | 📋 Planned | S13.6+ |
| ISO/IEC | 27001 (security) / 27701 (privacy) | 📋 Planned | S13.6+ |
| W3C | Verifiable Credentials alignment | 📋 Planned | S13.6+ |

**Independent Verifier Requirements** (for ecosystem):
- [ ] Reference implementation in Go/Rust (not TypeScript)
- [ ] Independent conformance test run
- [ ] Published verification key(s)
- [ ] Audit trail / transparency log

**Acceptance Criteria**:
- [ ] VAP conformance report published
- [ ] At least 1 independent verifier running conformance suite
- [ ] IAB/MRC engagement initiated
- [ ] Security/privacy audit completed (SOC 2 Type II or equivalent)

---

### S13.7 — Network Bootstrapping (Week 15-20)
**Goal**: Activate the flywheel — publishers, verifiers, consumers using the protocol.

**Deliverables**:
- `docs/network/onboarding-guide.md` — Publisher/verifier/consumer guides
- `packages/sdk/*` — Production-ready (S12 + hardening)
- `apps/developer-portal/` — API explorer, SDK downloads, docs
- `apps/marketplace/` — Attention marketplace MVP

**Network Components**:
| Role | Target | Incentive |
|------|--------|-----------|
| Publishers | 50+ integrating SDK | Verified inventory premium |
| Verifiers | 3+ independent | Verification fees |
| Consumers | 10+ advertisers/researchers | Verified attention data |
| Developers | 100+ building on SDK | Hackathons, grants |

**Bootstrap Programs**:
| Program | Budget | Target |
|---------|--------|--------|
| Publisher Integration Grant | $50K | 10 publishers |
| Verifier Infrastructure Grant | $100K | 2 verifiers |
| Research Data Access | Free tier | 20 researchers |
| Hackathon / Bounty | $25K | 50+ developers |

**Acceptance Criteria**:
- [ ] 10+ publishers with live SDK integration
- [ ] 2+ independent verifiers operational
- [ ] 5+ consumers purchasing/using proofs
- [ ] Developer portal live with SDK downloads
- [ ] Marketplace MVP processing transactions

---

## Synthetic Data Integration Points

| Sub-Sprint | Synthetic Use | Real Data Gate |
|------------|--------------|----------------|
| S13.1 | 100% synthetic for pipeline CI | None |
| S13.2 | Pre-training (90% synthetic, 10% real) | Real fine-tuning data |
| S13.3 | Synthetic for pipeline testing only | **All calibration on real ground truth** |
| S13.4 | 80% synthetic corpus generation | Real validation captures |
| S13.5 | Synthetic for coverage analysis | Real for validation |
| S13.6 | Synthetic for conformance test generation | Real for certification |
| S13.7 | Synthetic for load testing | Real network only |

---

## Resource Requirements

| Resource | S13.1-2 | S13.3 | S13.4 | S13.5 | S13.6 | S13.7 | Total |
|----------|---------|-------|-------|-------|-------|-------|-------|
| **ML Engineers** | 2 | 2 | 1 | 1 | 0 | 1 | ~3 FTE |
| **Data Engineers** | 2 | 1 | 1 | 1 | 0 | 1 | ~2 FTE |
| **Protocol/Standards** | 0 | 0 | 0 | 0 | 1 | 1 | ~1 FTE |
| **Partnerships/BD** | 0 | 1 | 0 | 0 | 1 | 2 | ~2 FTE |
| **Ground Truth Budget** | $0 | $50K | $30K | $20K | $100K | $175K | $375K |
| **Compute (GPU)** | $5K | $20K | $10K | $10K | $0 | $5K | $50K |

**Total Estimated**: ~8 FTE + $425K over 20 weeks

---

## Success Criteria (S13 Complete)

- [ ] **Proprietary evidence dataset**: 1M+ sessions with ground-truth subset, documented pipeline
- [ ] **Calibrated models**: ECE < 0.05, FPR < 2%, FNR < 5% published per policy
- [ ] **Adversarial robustness**: > 90% detection on 10K-case corpus
- [ ] **Generalization**: ΔAUC < 0.10, ΔAcc < 0.15 across devices/domains
- [ ] **Protocol certification**: VAP conformance + IAB/MRC engagement
- [ ] **Network**: 10+ publishers, 2+ verifiers, 5+ consumers live
- [ ] **All guarantees published**: `verification-guarantees.ts` with measured values + timestamps

---

## Synthetic Data — What It Unblocks vs. What It Can't

| ✅ Synthetic Unblocks | ❌ Synthetic Cannot Replace |
|----------------------|----------------------------|
| Schema validation & CI | Calibration (ECE, FPR, FNR) |
| Pipeline engineering | Ground-truth labeling |
| Adversarial corpus generation | Human attention ground truth |
| Hyperparameter search | Cross-device validation |
| Load/stress testing | Certification / standards |
| Adversarial corpus coverage | Network effects / trust |

**Bottom line**: Synthetic data gets you to *production-ready engineering* (S13.1, S13.2, S13.4 pipeline). Real ground truth is the *only* path to *published guarantees* (S13.3, S13.5) and *certification* (S13.6). Plan budget and partnerships accordingly.

---

## S13 Gantt (20 Weeks)

```
Week:    1-2   3-4   5-6   7-8   9-10  11-14 15-20
S13.1    ████
S13.2        ████
S13.3            ████
S13.4                ████
S13.5                    ████
S13.6                        ████████
S13.7                            ████████████
```

**Critical Path**: S13.1 → S13.2 → S13.3 (calibration requires trained model) → S13.6 (certification requires guarantees). S13.4, S13.5 can run in parallel after S13.2. S13.7 starts after S13.3 guarantees published.

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Ground truth collection delayed | High | Blocks S13.3 | Start partnerships Week 1; synthetic pre-training unblocks S13.2 |
| Calibration targets not met | Medium | Moat credibility | Iterate: more data → better features → recalibrate; publish interim |
| Adversarial corpus not representative | Medium | False robustness | Mix synthetic + real captures; red-team review |
| Standards bodies slow | High | Certification delay | Start engagement Week 1; self-certify VAP first |
| Network bootstrapping stalls | High | No flywheel | Grant programs + dedicated BD; dogfood with own properties |

---

## Next Steps

1. **Approve S13 budget + headcount**
2. **Initiate ground-truth partnerships** (Week 1) — eye-tracking, behavioral labs
3. **Kick off S13.1** — synthetic generator (internal, no external deps)
3. **Parallel track**: S13.6 standards engagement (long lead time)