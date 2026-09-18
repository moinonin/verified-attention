IMPROVEMENTS FROM docs/improvementfeedback.txt (verified against codebase):

1. EVIDENCE DATASET / MOAT (S9 proposed):
   - Build proprietary attention evidence dataset (ground-truth → calibrated model).
   - Deliver: contracts/contracts/evidence-graph.md; expanded fixtures with calibration metrics.

2. MEASURABLE VERIFICATION GUARANTEES (S10 proposed):
   - Publish verification performance (false-positive rate, calibration error, adversarial/replay/bot resistance, cross-device/domain generalization).
   - Deliver: contracts/contracts/verification-guarantees.md; metrics from packages/verification/src/policy/evaluation.

3. PROTOCOL OPENNESS / CONFORMANCE (S11 proposed):
   - Ensure VAP spec (docs/specs/0001-verified-attention-protocol.md) is open (CC0) and conformance suite (contracts/contracts/) runs independently.
   - Verified: provider-verify.js uses only contract definitions, not internal APIs.

4. SDK / APP DEVELOPMENT (S12 proposed):
   - Begin SDK/app packages (packages/sdk/browser/, mobile/, desktop/, extension/) once module resolution fully resolved.
   - Deliver: skeleton SDK package matching README documentation (VerifiedAttention class).

REALITY CHECK (verified):
- SDK/app packages MISSING (README corrected: "Planned — Phase 5").
- Root tests/ directory MISSING (tests embedded in apps/packages — README corrected).
- Deploy-level module resolution BLOCKED locally (node_modules broken by pnpm install after tsdown version change; Docker deploy-time install works — README corrected with accurate instructions: make start-cluster, make stop-cluster, pnpm --filter build passes 981ms, pnpm dev = tsdown --watch).
- Contracts pass (provider-verify.js: 3/3; integration-cicd.js; load-reconcile.js; chaos contracts delivered).
- No durable moat yet (feedback confirms: potential only — requires data + validation + network + trust). These sprint proposals directly address that gap.
- No false claims in updated README (verified line-by-line against actual files/directories).
