# Verified Attention Engine (VAE)

**Production-ready implementation of the Verified Attention Protocol (VAP)** — a cryptographic protocol for verifiable attention tracking, fraud-resistant evidence validation, and transparent reward distribution in digital advertising and content platforms.

## Why This Matters: Industry Context

### The Attention Economy Crisis

| Problem | Impact | VAE Solution |
|---------|--------|--------------|
| **Ad Fraud** | $100B+ annual losses (2024) | Cryptographic evidence + ML fraud detection |
| **Black-box verification** | No audit trail, vendor lock-in | Open protocol (VAP), reproducible verification |
| **Opacity in payouts** | Publishers can't audit revenue | On-chain settlement, transparent ledger |
| **Bot traffic** | 40%+ of web traffic automated | Behavioral evidence + device attestation |
| **Privacy regulations** | GDPR, CCPA, ePrivacy | Pseudonymized viewer IDs, consent tracking |

### Current Industry Dynamics

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ATTENTION VERIFICATION LANDSCAPE                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TRADITIONAL (Broken)                    VAP/VAE (This Project)            │
│  ─────────────────                      ────────────────────              │
│  ▸ IAB Viewability                       ▸ Cryptographic proofs            │
│  ▸ MRC Accreditation                     ▸ Open specification              │
│  ▸ Vendor black boxes                    ▸ Reproducible verification       │
│  ▸ Post-hoc sampling                     ▸ Real-time evidence streams      │
│  ▸ No publisher audit                    ▸ Full settlement transparency    │
│  ▸ Bot detection = heuristics            ▸ ML + behavioral + device        │
│                                                                             │
│  KEY DIFFERENTIATOR: VAE proves attention happened, not just that         │
│  an ad was "in view." Evidence = interaction + visibility + duration +    │
│  context + device attestation, all cryptographically linked.              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Who Needs This

| Role | Use Case |
|------|----------|
| **Publishers** | Prove genuine attention to advertisers, command premium CPMs |
| **Advertisers** | Verify real human attention, eliminate wasted spend |
| **Ad Exchanges/SSPs** | Differentiate with verified inventory, reduce fraud liability |
| **Content Platforms** | Reward creators based on actual engagement, not vanity metrics |
| **Wallets/Reward Apps** | Distribute tokens/points for verified attention (Brave, Permission.io model) |
| **Auditors/Regulators** | Independent verification of attention claims |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VERIFIED ATTENTION ENGINE (VAE)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │   Core       │    │  Pipeline    │    │   Reward     │    │   Apps   │  │
│  │  (Protocol)  │───▶│ (Ingestion)  │───▶│  (Economics) │───▶│ (API/    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘    │ Verifier)│  │
│         ▲                   ▲                   ▲            └──────────┘  │
│         │                   │                   │                     ▲     │
│         └───────────────────┴───────────────────┴─────────────────────┘     │
│                              │                                              │
│                    ┌─────────▼─────────┐                                    │
│                    │   ML Packages     │                                    │
│                    │ (Fraud Detection, │                                    │
│                    │  Attention Intel) │                                    │
│                    └───────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Package Breakdown (15+ NPM Packages)

| Package | Purpose | VAP Section | Deploy As |
|---------|---------|-------------|-----------|
| `@verified-attention/core` | Types, schemas, cryptographic primitives | All | NPM Library |
| `@verified-attention/pipeline` | Evidence validation, normalization, dedup, enrichment, DLQ | 4, 5 | Ingestion Worker |
| `@verified-attention/verification` | Replay, review queue, verification engine | 8, 9 | Verification Worker |
| `@verified-attention/reward-pricing` | CPM/CPC/CPA pricing, dynamic rates | 11 | Pricing Service |
| `@verified-attention/reward-campaigns` | Campaign lifecycle, caps, targeting | 11 | Campaign Service |
| `@verified-attention/reward-eligibility` | Proof validation → reward qualification | 10, 11 | Eligibility Worker |
| `@verified-attention/reward-budget` | Budget management, pacing, rollover | 11 | Budget Service |
| `@verified-attention/reward-settlement` | Ledger, reconciliation, export, payouts | 11, 12 | Settlement Worker |
| `@verified-attention/ml-fraud-detection` | Anomaly scoring, bot detection, behavioral analysis | 5, 8 | ML Inference Service |
| `@verified-attention/ml-attention-model` | Attention quality scoring, engagement prediction | 5, 11 | ML Inference Service |
| `@verified-attention/api` | REST API (Fastify), WebSocket, OpenAPI | All | HTTP Service |
| `@verified-attention/verifier` | Verification execution, proof generation, HSM signing | 9, 10 | Worker + API |

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+ with TimescaleDB extension
- Redis 7+

### Development

```bash
# Clone and install
git clone <repo-url>
cd verified-attention
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Typecheck + lint
pnpm run typecheck
pnpm run lint

# Start development stack (requires Docker)
docker-compose up -d postgres redis minio
pnpm run dev
```

### Production Deployment

```bash
# Build Docker images
docker build -t vae-api:latest ./apps/api
docker build -t vae-verifier:latest ./apps/verifier
docker build -t vae-ingestion:latest ./packages/pipeline
docker build -t vae-rewards:latest ./packages/reward-budget  # repeat for each reward package
docker build -t vae-ml-fraud:latest ./packages/ml-fraud-detection
docker build -t vae-ml-attention:latest ./packages/ml-attention-model

# Deploy to Kubernetes (see docs/devops.md for full manifests)
kubectl apply -f k8s/
```

---

## Integration Guide: How to Use VAE in Your Application

### Option 1: JavaScript SDK (Client-Side)

**For publishers integrating attention tracking on their pages:**

```html
<!-- Load from CDN -->
<script src="https://cdn.verified-attention.io/vap-sdk@v1.0.0/dist/vap-sdk.min.js"></script>
<script>
  // Initialize with your publisher credentials
  VAP.init({
    publisherId: 'pub_abc123',
    verifierUrl: 'https://api.verified-attention.example.com',
    consentId: 'consent_xyz789',  // From your CMP
    debug: false
  });

  // Auto-track attention on designated content elements
  VAP.trackAttention({
    contentSelector: '[data-vap-content]',  // Elements to track
    minViewTimeMs: 1000,                     // Minimum attention threshold
    sampleRate: 1.0                          // 100% of sessions
  });

  // Manual tracking for custom events
  VAP.recordInteraction('video_play', { videoId: 'vid_123', position: 0 });
  VAP.recordInteraction('scroll_depth', { depth: 0.75 });
</script>
```

**HTML markup for tracked content:**

```html
<article data-vap-content data-vap-content-id="article_456">
  <h1>Your Content Title</h1>
  <p>Content that generates verifiable attention...</p>
</article>

<!-- Ad slots also tracked -->
<div data-vap-ad-slot data-vap-campaign-id="camp_789" data-vap-creative-id="crt_101">
  <!-- Ad creative renders here -->
</div>
```

**SDK Configuration Options:**

```typescript
interface VAPConfig {
  publisherId: string;              // Your publisher ID from VAE dashboard
  verifierUrl: string;              // VAE API endpoint
  consentId?: string;               // GDPR/CCPA consent string
  debug?: boolean;                  // Enable console logging
  sampleRate?: number;              // 0.0-1.0, session sampling
  minViewTimeMs?: number;           // Minimum dwell time for evidence
  autoTrack?: boolean;              // Auto-start on load (default: true)
  endpoint?: string;                // Custom evidence ingestion endpoint
  batchSize?: number;               // Batch observations before sending
  flushIntervalMs?: number;         // Max time before flush
}
```

### Option 2: Mobile SDKs (iOS/Android)

**iOS (Swift Package Manager):**

```swift
// Package.swift
dependencies: [
  .package(url: "https://github.com/verified-attention/vap-ios-sdk", from: "1.0.0")
]

// Usage
import VAPSDK

let config = VAPConfig(
  publisherId: "pub_abc123",
  verifierUrl: "https://api.verified-attention.example.com",
  consentId: "consent_xyz789"
)

VAPSDK.shared.initialize(config)
VAPSDK.shared.startTracking(contentId: "article_456")

// Track custom events
VAPSDK.shared.recordInteraction("video_play", metadata: ["videoId": "vid_123"])
```

**Android (Gradle):**

```kotlin
// build.gradle.kts
dependencies {
  implementation("io.verified-attention:vap-android-sdk:1.0.0")
}

// Usage
val config = VAPConfig(
  publisherId = "pub_abc123",
  verifierUrl = "https://api.verified-attention.example.com",
  consentId = "consent_xyz789"
)

VAPSDK.initialize(context, config)
VAPSDK.startTracking(contentId = "article_456")

VAPSDK.recordInteraction("video_play", mapOf("videoId" to "vid_123"))
```

### Option 3: Server-to-Server (Backend Integration)

**For reward redemption, server-side verification, or headless environments:**

```typescript
// npm install @verified-attention/client
import { VAEClient } from '@verified-attention/client';

const client = new VAEClient({
  apiKey: 'vae_sk_live_abc123...',  // Server-side API key
  baseUrl: 'https://api.verified-attention.example.com',
  timeoutMs: 30000
});

// Verify a session's attention proof
const proof = await client.proofs.getBySession('session_xyz789');
if (proof && proof.state === 'PUBLISHED') {
  // Attention cryptographically verified
  console.log(`Verified attention: ${proof.evidenceCount} evidence items`);
}

// Submit evidence directly (headless/batch)
const evidence = await client.evidence.submit({
  sessionId: 'session_xyz789',
  observations: [
    { type: 'VISIBILITY', payload: { visibleRatio: 0.85, durationMs: 5000 }},
    { type: 'INTERACTION', payload: { interactionType: 'click', x: 100, y: 200 }}
  ],
  provenance: {
    sourceId: 'server_batch_v1',
    timestamp: new Date().toISOString(),
    metadata: { userAgent: '...', ipHash: '...' }
  }
});

// Redeem rewards for verified attention
const reward = await client.rewards.redeem({
  proofId: proof.proofId,
  recipientId: 'user_wallet_abc',
  campaignId: 'campaign_summer_2024'
});
```

### Option 4: Direct Protocol Implementation

**For platforms building their own VAP-compliant stack:**

```typescript
// Use core types directly
import {
  createSession,
  createEvidence,
  createClaim,
  createUnsignedProof,
  signProof,
  validateProof,
  ProofState,
  EvidenceType
} from '@verified-attention/core';

// 1. Create session when user lands on content
const session = createSession({
  contentId: 'article_456',
  participant: {
    viewerIdHash: hashViewerId(userId),  // Pseudonymized
    consentId: 'consent_xyz789'
  },
  config: {
    timeoutMs: 3600000,
    requiredEvidenceTypes: ['VISIBILITY', 'INTERACTION', 'DURATION']
  }
});

// 2. Collect observations → create evidence
const evidence = createEvidence({
  sessionId: session.sessionId,
  type: EvidenceType.VISIBILITY,
  payload: { visibleRatio: 0.9, durationMs: 12000 },
  provenance: { sourceId: 'web_sdk_v1', timestamp: new Date().toISOString() }
});

// 3. Create claim after session ends
const claim = createClaim({
  sessionId: session.sessionId,
  evidenceIds: [evidence.evidenceId],
  claimType: 'ATTENTION_QUALIFIED',
  metadata: { contentId: 'article_456', campaignId: 'camp_789' }
});

// 4. Verification engine evaluates → produces proof
// (Handled by VAE verifier service)

// 5. Verify proof independently
const verification = validateProof(proof);
if (verification.valid && isProofValid(proof)) {
  // Cryptographically verified attention
  processReward(claim, proof);
}
```

---

## Core Protocol Flow (VAP)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VAP PROTOCOL DATA FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  USER SESSION                                                              │
│  ────────────                                                              │
│  1. Page Load → VAP SDK initializes                                        │
│  2. createSession() → Session (CREATED)                                    │
│  3. SDK collects Observations (scroll, click, visibility, focus, ...)     │
│  4. Observations batched → createEvidence() → Evidence                    │
│  5. Evidence submitted to VAE API → Pipeline validates & enriches         │
│  6. Session ends → createClaim() → Claim (ATTENTION_QUALIFIED)            │
│                                                                             │
│  VERIFICATION                                                              │
│  ──────────────                                                            │
│  7. Verification Engine evaluates Claim against Policy                    │
│  8. Outcome: PASS / FAIL / INCONCLUSIVE / REVIEW                          │
│  9. If PASS: generateProof() → UnsignedProof                              │
│ 10. HSM signs proof → Signed Proof (PUBLISHED)                            │
│                                                                             │
│  REWARDS                                                                   │
│  ────────                                                                 │
│ 11. Eligibility Engine checks Proof + Campaign rules                      │
│ 12. Qualified → Payout calculated via Pricing                             │
│ 13. Budget checked → Settlement queued                                    │
│ 14. Settlement reconciled → Ledger entries created                        │
│ 15. Payouts distributed to recipients                                     │
│                                                                             │
│  AUDIT & REPLAY                                                            │
│  ────────────────                                                         │
│ 16. Full audit trail in verification-audit store                          │
│ 17. Replay verification with new policies                                 │
│ 18. Settlement exports for finance reconciliation                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Evidence Types (VAP Section 4-5)

| Type | Description | Payload Example | Use Case |
|------|-------------|-----------------|----------|
| `SCROLL` | Scroll position & velocity | `{ y: 1200, velocity: 45, direction: 'down' }` | Reading depth |
| `CLICK` | Click/tap coordinates | `{ x: 340, y: 560, target: 'cta_button' }` | Engagement |
| `KEY_PRESS` | Keyboard interaction | `{ key: 'ArrowDown', count: 3 }` | Reading behavior |
| `VIEWPORT_VISIBILITY` | Element visibility in viewport | `{ visibleRatio: 0.85, durationMs: 8000 }` | Viewability |
| `FOCUS` | Page/element focus state | `{ hasFocus: true, durationMs: 45000 }` | Active attention |
| `DEVICE_MOTION` | Accelerometer/gyroscope | `{ alpha: 0.1, beta: 0.2, gamma: 0.05 }` | Mobile engagement |
| `PAGE_RESIZE` | Viewport size changes | `{ width: 1920, height: 1080 }` | Layout shifts |
| `CUSTOM` | Platform-specific signals | `{ event: 'video_quartile', quartile: 2 }` | Extensibility |

---

## Reward Economics

### Pricing Models

```typescript
// CPM (Cost Per Mille - per 1000 qualified attention units)
const cpmPricing = {
  model: 'CPM',
  rateMicros: 15000000,  // $15.00 CPM
  minAttentionMs: 5000,
  qualityMultiplier: 1.2  // Premium for high-quality attention
};

// CPC (Cost Per Click/Interaction)
const cpcPricing = {
  model: 'CPC',
  rateMicros: 500000,    // $0.50 per qualified interaction
  qualifiedInteractions: ['click', 'video_play', 'form_submit']
};

// CPA (Cost Per Action - conversion)
const cpaPricing = {
  model: 'CPA',
  rateMicros: 25000000,  // $25.00 per conversion
  conversionEvents: ['purchase', 'signup', 'subscription']
};
```

### Campaign Controls

- **Frequency caps**: Per viewer, per session, per day
- **Budget pacing**: EVEN, ASAP, FRONT_LOADED with rollover
- **Geo/device targeting**: Country, region, device type, OS
- **Quality floors**: Minimum attention score, fraud score threshold

---

## Security & Compliance

### Cryptographic Guarantees

| Property | Implementation |
|----------|----------------|
| **Evidence Integrity** | SHA-256 hash chaining, Merkle proofs |
| **Proof Non-repudiation** | Ed25519 signatures via HSM (AWS CloudHSM / Azure Dedicated HSM) |
| **Timestamp Trust** | RFC 3161 trusted timestamps |
| **Session Binding** | Viewer ID hashed with salt, never stored raw |

### Privacy by Design

- **Pseudonymization**: `viewerIdHash = HMAC(salt, userId)` — salt rotated per session
- **Consent Tracking**: Explicit consentId linked to every session
- **Data Minimization**: Only attention signals collected, no PII
- **Right to Deletion**: Session/evidence purge API (GDPR Art. 17)
- **Data Portability**: Full evidence export in VAP standard format

### Fraud Detection Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MULTI-LAYER FRAUD DEFENSE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LAYER 1: Client-Side (SDK)                                                │
│  ▸ Device fingerprinting (canvas, WebGL, audio, fonts)                   │
│  ▸ Behavioral biometrics (mouse dynamics, scroll patterns)               │
│  ▸ Browser automation detection (webdriver, phantomjs, puppeteer)        │
│  ▸ Integrity checks (code obfuscation, anti-tamper)                      │
│                                                                             │
│  LAYER 2: Ingestion Pipeline                                               │
│  ▸ Replay attack detection (nonce + timestamp validation)                │
│  ▸ Rate limiting per viewer/IP/device                                     │
│  ▸ Evidence consistency validation (physics, timing)                     │
│  ▸ Duplicate detection (content-addressable storage)                     │
│                                                                             │
│  LAYER 3: ML Inference (Real-time)                                        │
│  ▸ Isolation Forest anomaly scoring                                       │
│  ▸ LSTM behavioral sequence modeling                                      │
│  ▸ Graph neural nets for coordinated bot networks                        │
│  ▸ Feature store: 200+ behavioral features                               │
│                                                                             │
│  LAYER 4: Verification & Review                                           │
│  ▸ Policy-based rule engine (configurable)                               │
│  ▸ Human review queue for edge cases                                     │
│  ▸ Replay with updated policies                                          │
│  ▸ Audit log for regulatory compliance                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## API Reference

### Base URL
```
Production:  https://api.verified-attention.example.com/v1
Staging:     https://api-staging.verified-attention.example.com/v1
Local:       http://localhost:3000/v1
```

### Authentication

```bash
# API Key (server-to-server)
Authorization: Bearer vae_sk_live_abc123...

# Publisher JWT (client-side, short-lived)
Authorization: Bearer eyJhbGciOiJFZERTQSJ9...
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/sessions` | Create new attention session |
| `POST` | `/sessions/{id}/evidence` | Submit evidence batch |
| `POST` | `/sessions/{id}/claims` | Create attention claim |
| `GET` | `/proofs/{id}` | Retrieve proof by ID |
| `GET` | `/proofs/session/{sessionId}` | Get proofs for session |
| `POST` | `/verifications/replay` | Replay verification with new policy |
| `GET` | `/rewards/campaigns` | List active campaigns |
| `POST` | `/rewards/redeem` | Redeem proof for reward |
| `GET` | `/settlements/{id}` | Get settlement details |
| `GET` | `/settlements/{id}/export` | Export settlement (CSV/JSON) |

### Webhooks

```typescript
// Configure in dashboard or via API
interface WebhookConfig {
  url: 'https://your-app.com/webhooks/vae';
  events: [
    'session.created',
    'evidence.received',
    'claim.created',
    'proof.generated',
    'proof.published',
    'proof.revoked',
    'reward.qualified',
    'reward.paid',
    'settlement.completed'
  ];
  secret: 'whsec_abc123...';  // HMAC verification
  retryPolicy: { maxAttempts: 5, backoffMs: 1000 };
}
```

---

## Deployment Architecture

### Kubernetes (Production)

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vae-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vae-api
  template:
    spec:
      containers:
      - name: api
        image: vae-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: vae-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: vae-secrets
              key: redis-url
        - name: HSM_ENDPOINT
          valueFrom:
            secretKeyRef:
              name: vae-secrets
              key: hsm-endpoint
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
---
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vae-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vae-api
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Schema (PostgreSQL + TimescaleDB)

```sql
-- Core tables (auto-migrated on service start)
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Sessions (hypertable for time-series queries)
CREATE TABLE sessions (
  session_id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL,
  viewer_id_hash TEXT NOT NULL,
  consent_id TEXT,
  config JSONB NOT NULL,
  state TEXT NOT NULL,
  evidence_ids TEXT[] DEFAULT '{}',
  claim_ids TEXT[] DEFAULT '{}',
  proof_id TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  last_activity_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  certified_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);
SELECT create_hypertable('sessions', 'started_at');

-- Evidence (hypertable, high volume)
CREATE TABLE evidence (
  evidence_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(session_id),
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  provenance JSONB NOT NULL,
  hash TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
SELECT create_hypertable('evidence', 'created_at');
CREATE INDEX idx_evidence_session ON evidence(session_id);

-- Claims
CREATE TABLE claims (
  claim_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(session_id),
  evidence_ids TEXT[] NOT NULL,
  claim_type TEXT NOT NULL,
  state TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL,
  evaluated_at TIMESTAMPTZ,
  proof_id TEXT
);

-- Proofs
CREATE TABLE proofs (
  proof_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  claim_id TEXT NOT NULL,
  state TEXT NOT NULL,
  metadata JSONB NOT NULL,
  signature TEXT,
  public_key TEXT,
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT
);

-- Rewards & Settlement
CREATE TABLE campaigns (...);
CREATE TABLE budgets (...);
CREATE TABLE payouts (...);
CREATE TABLE settlements (...);
CREATE TABLE ledger_entries (...);
```

---

## Monitoring & Observability

### Key Metrics (Prometheus)

```promql
# Ingestion pipeline
rate(vae_evidence_received_total[5m])
rate(vae_evidence_validated_total[5m])
rate(vae_evidence_dlq_total[5m])
histogram_quantile(0.95, vae_evidence_processing_duration_seconds_bucket)

# Verification
rate(vae_verification_completed_total[5m])
rate(vae_verification_outcome_total[5m])  # by outcome: PASS/FAIL/REVIEW
histogram_quantile(0.99, vae_verification_duration_seconds_bucket)

# Proof generation
rate(vae_proof_generated_total[5m])
rate(vae_proof_signed_total[5m])
rate(vae_proof_failed_total[5m])

# Rewards
rate(vae_reward_qualified_total[5m])
rate(vae_reward_paid_total[5m])
rate(vae_budget_utilization_ratio)

# Fraud detection
rate(vae_fraud_score_high_total[5m])
rate(vae_fraud_blocked_total[5m])
```

### Grafana Dashboards

- **Ingestion Health**: Evidence throughput, validation rates, DLQ depth
- **Verification Pipeline**: Outcome distribution, latency, replay rates
- **Proof Generation**: Signing latency, HSM availability, queue depth
- **Reward Economics**: CPM trends, budget utilization, settlement reconciliation
- **Fraud Detection**: Score distributions, blocked traffic, model drift

### Alerting Rules

```yaml
groups:
- name: vae-critical
  rules:
  - alert: VAEIngestionDown
    expr: rate(vae_evidence_received_total[5m]) == 0
    for: 2m
    labels: { severity: critical }
    annotations:
      summary: "No evidence received for 2 minutes"

  - alert: VAEDLQBacklog
    expr: vae_dlq_size > 1000
    for: 5m
    labels: { severity: warning }
    annotations:
      summary: "DLQ backlog growing: {{ $value }} items"

  - alert: VAEProofSigningFailures
    expr: rate(vae_proof_sign_failed_total[5m]) > 0.1
    for: 1m
    labels: { severity: critical }
    annotations:
      summary: "HSM signing failures exceeding 10%"

  - alert: VAESettlementImbalance
    expr: vae_settlement_discrepancy_micros > 0
    for: 0m
    labels: { severity: critical }
    annotations:
      summary: "Settlement reconciliation failed: ${{ $value }} micros discrepancy"
```

---

## Testing

```bash
# Unit tests (all packages)
pnpm run test

# Integration tests (requires test DB)
pnpm run test:integration

# Conformance tests (VAP spec compliance)
pnpm run test:conformance

# Load testing
pnpm run test:load -- --vus 100 --duration 5m

# Contract testing (SDK ↔ API)
pnpm run test:contract
```

---

## Contributing

```bash
# 1. Fork & clone
# 2. Create feature branch
git checkout -b feat/amazing-feature

# 3. Make changes with tests
pnpm run test
pnpm run typecheck
pnpm run lint

# 4. Commit with conventional commits
git commit -m "feat: add new evidence type for video engagement"

# 5. Push & open PR
```

### Code Standards

- TypeScript strict mode
- Zod schemas for all external boundaries
- 100% test coverage for core protocol logic
- No breaking changes without major version bump
- All types/docs derived from VAP spec (docs/specs/0001-verified-attention-protocol.md)

---

## Roadmap

| Phase | Target | Deliverables |
|-------|--------|--------------|
| **v1.0** | Q2 2025 | Core protocol, ingestion, verification, basic rewards |
| **v1.1** | Q3 2025 | ML fraud detection, replay engine, settlement v2 |
| **v1.2** | Q4 2025 | Mobile SDKs, webhook reliability, multi-currency |
| **v2.0** | Q1 2026 | ZK-proofs for privacy, cross-chain settlement, decentralized verifiers |

---

## License

**Apache 2.0** — Free for commercial use, modification, and distribution.

---

## Support & Community

| Channel | Purpose |
|---------|---------|
| **GitHub Issues** | Bug reports, feature requests |
| **Discord** | Developer community, integration help |
| **Email** | security@verified-attention.example.com (security issues) |
| **Docs** | https://docs.verified-attention.example.com |

---

## Appendix: VAP Specification Compliance

VAE implements **VAP Specification v1.0** (see `docs/specs/0001-verified-attention-protocol.md`):

- ✅ Sections 1-3: Terminology, Architecture, Cryptographic Primitives
- ✅ Section 4: Observation Types & Schemas
- ✅ Section 5: Evidence Types, Provenance, Validation
- ✅ Section 6: Session Lifecycle & State Machine
- ✅ Section 7: Claims & Claim Validation
- ✅ Section 8: Verification Policies & Engine
- ✅ Section 9: Review Queue & Replay
- ✅ Section 10: Proof Generation, Signing, Lifecycle
- ✅ Section 11: Reward Economics (Pricing, Campaigns, Budgets)
- ✅ Section 12: Settlement, Ledger, Reconciliation
- ✅ Section 13: Protocol Messages & Transport

**Conformance**: Run `pnpm run test:conformance` — 141 tests validating spec compliance.