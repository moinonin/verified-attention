# MONETIZATION.md

## How the Verified Attention Protocol Sustains Itself as Open-Source Infrastructure

Version: 1.0 (Draft)

Status: Living Document

---

# 1. Philosophy

## The Paradox of Open-Source Infrastructure

Traditional infrastructure monetization relies on ownership: you build it, you gate it, you charge for access. This model fails for open protocols. A protocol is valuable precisely because it is open, interoperable, and implementable by anyone. Gatekeeping destroys the value.

Verified Attention is proposed as Internet infrastructure — comparable to DNS, TLS, or HTTP. No one "owns" HTTP. Yet the HTTP ecosystem sustains multi-billion-dollar businesses. The economic value does not accrue to the protocol author. It accrues to those who build the best implementations, services, and applications on top.

This document outlines how the Verified Attention ecosystem sustains itself financially while keeping the protocol (VAP) and reference implementation (VAE) open-source under Apache 2.0 and CC0 respectively.

## Core Principle

> The protocol is free. The protocol is open. The protocol is owned by no one. Value accrues to the services, data, and trust layers built on top of it.

This is the same model that sustains Linux (Red Hat), Kubernetes (vendor ecosystems), HTTP/CDN (Cloudflare, Fastly), and TLS/CAs (Let's Encrypt is free; DigiCert charges for premium validation). The infrastructure is open. The services are commercial.

---

# 2. Value Chain Analysis

## Where Value Accrues

The Verified Attention value chain has five layers. Each can be monetized independently by different entities. No single entity needs to own all layers.

```
Layer 1: Protocol (VAP)                → Free, open (CC0)
Layer 2: Reference Implementation (VAE) → Free, open (Apache 2.0)
Layer 3: Managed Services               → Commercial (SaaS, PaaS)
Layer 4: Data & Intelligence            → Commercial (premium data, ML models)
Layer 5: Applications                   → Commercial (marketplace, B2B SaaS)
```

### Layer 1: Protocol (Free)

VAP is published as CC0 (public domain). Anyone may implement it without licence, royalty, or permission. The protocol itself generates no direct revenue. This is intentional — a gated protocol is a proprietary protocol, and a proprietary protocol cannot become Internet infrastructure.

### Layer 2: Reference Implementation (Free)

VAE is published as Apache 2.0. Anyone may run their own verifier, deploy their own evidence pipeline, or build an alternative implementation. The reference implementation must be free to maximise adoption and prove feasibility. Adoption of the protocol is the foundation; monetization happens above it.

### Layer 3: Managed Services (Commercial)

This is the primary monetization vector. Running VAE at production scale requires infrastructure expertise: Kubernetes, Kafka, GPU inference, HSM key management, observability, security hardening. Most organisations would rather pay for managed verification than operate it themselves.

### Layer 4: Data & Intelligence (Commercial)

The ML models that power attention intelligence and fraud detection continuously improve through training data, adversarial research, and calibration. Premium models, benchmark datasets, and proprietary fraud intelligence represent a commercial layer above the open protocol.

### Layer 5: Applications (Commercial)

The attention marketplace, enterprise compliance dashboards, education verification platforms, and AI training data services are applications built on the protocol. These are fully commercial products.

---

# 3. Revenue Streams

## 3.1 Managed Verification as a Service (VaaS)

**What**: Hosted VAE instances that handle evidence ingestion, verification, and proof generation for publishers and platforms.

**Who pays**: Publishers, advertisers, platforms, enterprises.

**Pricing model**:

| Tier | Price | Includes | Limits |
|------|-------|----------|--------|
| Developer (Free) | $0 | Self-serve signup, sandbox environment | 1K sessions/month, community support |
| Starter | $499/month | Managed verifier, basic policies, webhooks | 50K sessions/month, email support |
| Growth | $2,499/month | Multiple policies, fraud intelligence, API keys | 500K sessions/month, priority support |
| Scale | $9,999/month | Dedicated infrastructure, custom policies, SLA | 5M sessions/month, 24/7 support, dedicated engineer |
| Enterprise | Custom | On-premise / VPC, HSM, custom ML models | Unlimited, SLA 99.99%, audit support |

**Why it works**: The protocol is free but operating it at scale is hard. This mirrors the Kubernetes model: k8s is free; GKE/EKS/AKS charge for managed control plane.

**Projected revenue** (illustrative):
- Year 1: 20 Growth customers × $2,499/month = $600K ARR
- Year 2: 50 Growth + 10 Scale × $9,999 = $2.25M ARR
- Year 3: 100 Growth + 25 Scale + 5 Enterprise = $5.5M+ ARR

## 3.2 Premium Fraud Intelligence

**What**: Advanced fraud detection models, real-time threat intelligence feeds, and adversarial research that go beyond the baseline fraud detection included in open-source VAE.

**Who pays**: Advertisers, ad platforms, compliance teams, anyone where fraud has direct financial impact.

**Pricing model**:

| Offering | Price | Description |
|----------|-------|-------------|
| Fraud Intelligence Feed | $1,000/month | Daily updates of known fraud signatures, IP reputation lists, emulator fingerprints, click farm patterns |
| Premium Fraud Models | $5,000/month | State-of-the-art detection models with higher accuracy than open-source baseline, updated quarterly |
| Custom Fraud Research | $25,000/engagement | Threat modelling and detection engineering for novel attack vectors specific to a customer's domain |
| Fraud API (per-call) | $0.001/call | Real-time fraud scoring API for ad platforms integrated with programmatic bidding |

**Why it works**: Fraud is an arms race. The open-source baseline provides good detection; premium models provide best-in-class detection. Advertisers losing 20-40% of spend to fraud will pay for accuracy. This mirrors the antivirus industry model: ClamAV is free; commercial AV products charge for better detection.

## 3.3 Conformance Certification

**What**: Official certification programme confirming that an implementation conforms to VAP. Certified implementations receive a badge, registry listing, and legal assurance.

**Who pays**: Third-party implementers, platform vendors, enterprise verification providers.

**Pricing model**:

| Offering | Price | Description |
|----------|-------|-------------|
| Self-Certification (Free) | $0 | Run conformance test suite, self-attest |
| Certified Conformance | $5,000/implementation | Independent audit of implementation, certificate valid 1 year |
| Premium Certification | $15,000/implementation | Audit + penetration test + privacy review + public registry badge |
| Re-Certification | $3,000/renewal | Annual re-certification for major versions |

**Why it works**: Consumers of verified attention need trust. A certification badge signals conformance. This mirrors the W3C/WAYF/CA model: the standard is free; certification is commercial.

## 3.4 Attention Marketplace

**What**: A commercial marketplace where publishers offer verified attention inventory and consumers (advertisers, educators, researchers) bid for verified attention.

**Who pays**: Consumers of verified attention (advertisers, brands, research orgs, AI platforms).

**Pricing model**: Transaction-based

| Revenue Stream | Rate | Description |
|----------------|------|-------------|
| Marketplace transaction fee | 2-5% of transaction | Fee on verified attention transactions cleared through marketplace |
| Listing fee (publishers) | $99/month | Verified publisher listing with analytics |
| Premium placement | $500/month | Featured inventory, priority matching |
| Settlement preparation | $0.01/proof | Batch settlement, reconciliation, ledger export |

**Projected revenue** (illustrative):
- Year 2 (launch): $500K GMV → $15K-25K/month fees
- Year 3: $5M GMV → $100K-250K/month fees
- Year 4: $50M GMV → $1M-2.5M/month fees

**Why it works**: The marketplace is a pure application on the protocol. Anyone could build one, but the official marketplace aggregates liquidity. Network effects make it the default. This mirrors app store models: the platform (protocol) is free; the marketplace takes a cut.

## 3.5 Enterprise SDK & Integration Licences

**What**: Commercial SDK licences with enterprise features not in the open-source SDK: SSO, audit logging, custom policy engines, on-premise deployment, SLA-covered updates.

**Who pays**: Enterprises with compliance, security, or scale requirements.

**Pricing model**:

| Offering | Price | Description |
|----------|-------|-------------|
| Community SDK (Free) | $0 | Apache 2.0, community support, standard features |
| Enterprise SDK | $10,000/year/organisation | SSO, audit logs, custom policies, on-prem option, SLA |
| Enterprise SDK + Premium Models | $25,000/year | Enterprise SDK + premium fraud and attention models bundled |
| Integration Engineering | $15,000/engagement | White-glove integration support, custom adapters, training |

**Why it works**: Enterprises need indemnification, SLAs, and features that open-source cannot provide. This is the classic open-core model (GitLab, MongoDB, Elasticsearch before licence change).

## 3.6 Research Data & Benchmarking

**What**: Anonymised, aggregated attention datasets, benchmark suites, and calibration tools for researchers and AI platforms.

**Who pays**: AI research labs, academic institutions, advertising research teams, ML teams training attention/engagement models.

**Pricing model**:

| Offering | Price | Description |
|----------|-------|-------------|
| Open Benchmark (Free) | $0 | Standard benchmark dataset, released annually for academic use |
| Research Dataset (Academic) | $500/grant | Aggregated, anonymised attention data for peer-reviewed research |
| Commercial Dataset | $10,000/dataset | Industry-grade attention datasets for model training, commercial licence |
| Custom Calibration Studies | $50,000/study | Commissioned calibration studies for specific domains or demographics |
| Benchmark as a Service | $2,000/month | Continuous benchmarking platform, access to online evaluation harness |

**Why it works**: Attention data is scarce and valuable for AI training. The protocol generates it as a byproduct. Aggregated, anonymised data respects privacy while creating a commercial asset. This mirrors the data-as-a-service model used by Nielsen, Comscore, and research data brokers.

---

# 4. Revenue Projection (5-Year Illustrative)

| Year | VaaS | Fraud Intel | Certification | Marketplace | Enterprise SDK | Research Data | Total ARR |
|------|------|-------------|---------------|-------------|----------------|---------------|-----------|
| 1 | $600K | $120K | $25K | $0 | $50K | $10K | $805K |
| 2 | $2.25M | $500K | $100K | $180K | $200K | $50K | $3.28M |
| 3 | $5.5M | $1.2M | $250K | $1.8M | $500K | $150K | $9.4M |
| 4 | $12M | $2.5M | $500K | $12M | $1.2M | $400K | $28.6M |
| 5 | $25M | $5M | $1M | $50M | $2.5M | $1M | $84.5M |

Assumptions:
- Year 1-2: VaaS growth dominates; marketplace nascent
- Year 3: Marketplace launches (Phase 5), transaction fees kick in
- Year 4-5: Marketplace GMV scales; ecosystem matures; certification volume grows
- Gross margin: 70-80% on SaaS; 85-90% on data/licensing; 95% on marketplace fees

---

# 5. Competitive Moats

Open-source does not mean defenceless. Multiple moats protect commercial revenue:

### 5.1 Model Advantage (Data Moat)

Every verification session generates evidence that improves the attention and fraud models. The more sessions flow through managed VAE instances, the better the models become. Open-source implementations start with baseline models but lack the data volume to match. This is the same moat as Google's PageRank: the algorithm is published, but the data advantage compounds.

### 5.2 Network Effects (Marketplace Moat)

The attention marketplace exhibits two-sided network effects: more publishers attract more consumers and vice versa. Once the official marketplace reaches liquidity, competing marketplaces face a cold-start problem. The protocol is open; liquidity is not.

### 5.3 Trust & Certification (Brand Moat)

Conformance certification creates a trust signal. Consumers prefer certified verifiers. The project's authority as protocol author and reference implementation maintainer confers brand trust that independent implementations must earn.

### 5.4 Integration Friction (Switching Moat)

Once a publisher integrates VAE SDKs and configures verification policies, switching to an alternative implementation requires re-integration, re-configuration, and re-certification. High integration friction creates retention.

### 5.5 Ecosystem Gravity (Developer Moat)

Developer tools, documentation, SDKs, community tutorials, and API client libraries create ecosystem gravity. The project that maintains the best developer experience attracts the most integrators, which attracts the most consumers, which attracts the most publishers.

---

# 6. What Stays Free vs What Costs Money

## Stays Free Forever

| Component | Licence | Rationale |
|-----------|---------|-----------|
| VAP Specification | CC0 | Protocol must be open to become infrastructure |
| VAE Reference Implementation | Apache 2.0 | Proves feasibility; enables adoption |
| Browser SDK | Apache 2.0 | Minimises integration friction |
| Mobile SDK | Apache 2.0 | Minimises integration friction |
| Desktop SDK | Apache 2.0 | Minimises integration friction |
| Conformance Test Suite | Apache 2.0 | Enables independent certification |
| Community Support | — | GitHub Issues, Discussions |
| Standard Documentation | CC-BY-SA | Enables ecosystem understanding |
| Sandbox Environment | — | Free tier for developers |

## Costs Money

| Component | Model | Rationale |
|-----------|-------|-----------|
| Managed VAE (VaaS) | SaaS subscription | Infrastructure costs, support, SLA |
| Premium Fraud Models | Subscription / per-call | R&D investment, arms race advantage |
| Premium Attention Models | Subscription | Higher accuracy, domain-specific calibration |
| Conformance Certification | Per-implementation fee | Audit labour, legal assurance |
| Marketplace Transactions | Transaction fee | Liquidity aggregation, settlement |
| Enterprise SDK Features | Annual licence | Enterprise features (SSO, audit, on-prem) |
| Research Datasets (Commercial) | Per-dataset | Data curation, privacy compliance, licensing |
| Custom Integration Engineering | Engagement fee | Professional services |

---

# 7. Open-Source Sustainability

## Contributor Compensation

Open-source projects fail when maintainers burn out. The project addresses this through:

### 7.1 Core Team Employment

The founding organisation employs core maintainers full-time. Revenue from managed services and enterprise licences funds salaries. This mirrors the Red Hat / Kubernetes model: the core team is paid; the software is free.

### 7.2 Contribution Bounties

Funded bounties for specific protocol extensions, SDK features, and research contributions. Sponsored by the project from commercial revenue. Enables part-time and external contributors to earn from meaningful work.

| Bounty Type | Range | Examples |
|-------------|-------|----------|
| Protocol Extension | $2,000-$5,000 | New evidence type, ZK proof extension |
| SDK Feature | $500-$2,000 | New observer, platform adapter, performance optimisation |
| Research Contribution | $1,000-$10,000 | Calibration study, fraud analysis, benchmark dataset |
| Documentation | $200-$1,000 | Integration guide, tutorial, translation |

### 7.3 Grants Programme

Annual grants for academic researchers studying attention verification, privacy-preserving verification, and fraud detection. Funded from commercial revenue. $50,000-$200,000/year programme.

### 7.4 Security Bug Bounties

Funded security bug bounty programme for vulnerabilities in VAE, SDKs, or protocol design. $500-$25,000 per finding based on severity.

## Licence Policy

All project-authored protocol specifications: **CC0** (public domain dedication).
All project-authored reference implementations: **Apache 2.0**.
All project-authored documentation: **CC-BY-SA 4.0**.
Commercial products (premium models, enterprise SDK, marketplace): **Proprietary**.

Contributors retain copyright on their contributions, licensed to the project under Apache 2.0 via a Contributor Licence Agreement (CLA) that grants the project rights to relicense derivative works commercially while keeping the open-source components free.

---

# 8. Pricing Philosophy

## Principles

1. **Never charge for the protocol.** The protocol is the foundation. Charging for it kills adoption.
2. **Always offer a free tier.** Developers must be able to build and test without a credit card. The free tier is generous enough for prototyping and small-scale production.
3. **Price on value, not on cost.** Fraud intelligence that saves an advertiser $100K/year charges $5K/month, not $50/month.
4. **Price on usage, not on seats.** Per-session, per-proof, per-transaction pricing scales with customer value. Seat licences create perverse incentives.
5. **Be transparent.** Public pricing page. No "contact sales" for standard tiers. Enterprise is the exception, not the rule.
6. **Never hold data hostage.** Customers own their evidence and proofs. Premium services add intelligence, not gatekeeping.

## Price Sensitivity by Segment

| Segment | Budget | Sensitivity | Key Value Driver |
|---------|--------|-------------|-------------------|
| Individual Developer | $0-$50/month | Extreme | Free tier, ease of use |
| Startup Publisher | $100-$1,000/month | High | Growth-stage pricing, clear upgrade path |
| Mid-market Publisher | $1,000-$10,000/month | Medium | ROI vs fraud waste, verified CPM premium |
| Enterprise Platform | $10,000-$100,000/month | Low | SLA, security, compliance, customisation |
| Advertiser/Brand | $1,000-$50,000/month | Medium | Fraud reduction, verified ROI |
| Research Org | $500-$5,000/grant | High | Academic pricing, data quality |
| AI Platform | $10,000-$100,000/month | Low | Training data quality, model accuracy |

---

# 9. Revenue Allocation Model

Commercial revenue is allocated as follows (illustrative — actual allocation governed by the founding organisation):

| Category | % of Revenue | Description |
|----------|-------------|-------------|
| Core Team Salaries | 50% | Full-time maintainers, engineers, researchers |
| Infrastructure | 15% | Cloud, GPU, HSM, Kafka, bandwidth |
| Research Programme | 10% | Calibration studies, benchmarks, publications, grants |
| Community & Bounties | 10% | Contributor bounties, conference sponsorship, community programmes |
| Security & Audits | 5% | Third-party security audits, penetration testing, bug bounties |
| Legal & Compliance | 5% | GDPR/CCPA compliance, IP protection, CLA management |
| Reserve / Reinvestment | 5% | Contingency, strategic investments, ecosystem grants |

---

# 10. Long-Term Vision: From Company to Foundation

The founding organisation commercialises the ecosystem to prove viability. Long-term (Year 5+), governance and commercial interest transition to a neutral foundation (see [Charter §15 Governance](docs/specs/0000-project-charter.md#15-governance)).

### Transition Model

| Phase | Governance | Commercial |
|-------|-----------|------------|
| Year 1-2 | Founding organisation | Single company provides managed services |
| Year 3-4 | Technical steering committee forms | Multiple companies offer managed VAE; marketplace launches |
| Year 5+ | Independent foundation (like Linux Foundation) | Multiple commercial providers; foundation manages protocol, certification, and research funding |

At maturity, the ecosystem looks like the Kubernetes ecosystem: a foundation owns the protocol and reference implementation; multiple companies (cloud providers, startups, consultancies) offer commercial services; certification is available through foundation-accredited auditors.

The founding organisation's competitive advantage at that point is not protocol ownership (which it has given to the foundation) but operational excellence, model quality, marketplace liquidity, and brand trust — the same advantages Red Hat holds in the Linux ecosystem.

---

# 11. Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cloud provider builds free managed VAE, undercutting commercial pricing | Medium | High | Model advantage and marketplace liquidity are defensible; cloud providers lack fraud intelligence edge |
| Open-source implementation becomes "good enough", eroding premium demand | Medium | Medium | Arms race model: baseline improves, premium advances further; commercial R&D invests ahead |
| Marketplace fails to reach liquidity | Medium | High | Seed with launch partners; focus on high-value verticals first (compliance, education) |
| Enterprise customers refuse open-core, demand fully proprietary | Low | Medium | Offer private/on-prem deployment with enterprise licence; protocol remains open regardless |
| Competing protocol emerges with commercial backing | Low | High | First-mover advantage; conformance certification creates switching cost; ecosystem gravity compounds |
| Regulatory action classifies marketplace as financial service | Low | Very High | Legal counsel from marketplace design phase; structure as data service not financial instrument |
| Insufficient free-tier adoption to drive commercial pipeline | Low | Medium | Generous free tier; developer-first approach; open-source community building |

---

# 12. Comparison to Established Open-Source Monetization Models

| Project | Open Layer | Commercial Layer | Lesson for VAE |
|---------|-----------|------------------|----------------|
| **Linux / Red Hat** | Kernel (GPL) | Support, consulting, certification (RHEL) | Core team is paid; software is free; enterprise value is in support + certification |
| **Kubernetes / GKE/EKS** | k8s (Apache 2.0) | Managed control plane, integrated cloud services | Managed convenience beats self-hosting at scale; cloud margins are the moat |
| **Elasticsearch (pre-licence change)** | ES (Apache 2.0) | Cloud hosting, security features, ML (X-Pack) | Open-core works until cloud provider forks; premium features defend revenue |
| **MongoDB** | Driver, tools (Apache 2.0) | Server (SSPL) | Licence change to prevent cloud re-commercialisation; consider SSPL for VAE if needed |
| **Cloudflare / CDN** | HTTP, TLS (open standards) | Edge network, managed DNS, DDoS protection | Infrastructure standards are free; managed delivery at scale is the business |
| **Let's Encrypt / DigiCert** | ACME protocol (open) | CA validation, premium certs, enterprise PKI | Free baseline creates market; premium services serve those who need more |
| **ClamAV / commercial AV** | Engine (GPL) | Signatures, heuristics, support | Free baseline good; premium detection better; arms race funds the gap |

**Conclusion**: The Verified Attention ecosystem follows the proven pattern: open protocol + open reference implementation + commercial managed services + commercial premium intelligence + commercial marketplace. The protocol generates adoption. The services generate revenue.

---

# 13. Appendix A: Pricing Detail — VaaS Tiers

### Developer (Free)
- 1,000 sessions/month
- 10,000 evidence events/month
- Community support (GitHub Issues)
- Standard policies only
- Proof webhook delivery
- Rate limited: 100 req/min

### Starter — $499/month
- 50,000 sessions/month
- 500,000 evidence events/month
- Email support (48h SLA)
- Custom policies (up to 5)
- Basic fraud detection
- 10 API keys
- Proof webhook + REST retrieval
- Rate limited: 1,000 req/min

### Growth — $2,499/month
- 500,000 sessions/month
- 5M evidence events/month
- Priority support (24h SLA)
- Custom policies (unlimited)
- Premium fraud detection (baseline)
- 50 API keys
- Real-time evidence streaming (WebSocket)
- Rate limited: 10,000 req/min
- Analytics dashboard access

### Scale — $9,999/month
- 5M sessions/month
- 50M evidence events/month
- 24/7 support (4h SLA)
- Dedicated verifier instance
- Premium fraud intelligence feed
- Unlimited API keys
- Dedicated infrastructure (isolated)
- Rate limited: 100,000 req/min
- Custom SLA
- Dedicated support engineer

### Enterprise — Custom
- Unlimited sessions
- On-premise or VPC deployment
- HSM key management
- Custom ML models (domain-specific)
- Security audit support
- 99.99% uptime SLA
- Custom integration engineering
- Annual concurrence certification included

---

# 14. Appendix B: Marketplace Fee Structure

### Transaction Types

| Transaction | Fee Model | Example |
|-------------|-----------|---------|
| Verified Impression (advertising) | 3% of transaction value | Advertiser pays publisher $10 CPM for 1,000 verified impressions; marketplace fee = $0.30 |
| Verified Completion (education) | $0.01 per verified proof | Online course pays $0.01 per proof of completion for students who pass verification |
| Verified Engagement (research) | $0.05 per verified proof | Research org pays $0.05 per proof for survey responses with verified attention |
| Verified Reading (compliance) | $0.02 per verified proof | Enterprise pays $0.02 per proof for compliance training verified completion |
| Bulk Verified Attention (AI training) | $0.001 per verified proof | AI platform pays $1,000 for 1M verified human attention signals |

### Settlement

- Daily batch settlement
- Net-30 payment terms (default)
- Minimum payout: $100
- Currency: USD (multi-currency roadmap)
- Dispute window: 7 days
- Reconciliation: CSV/JSON/Parquet export via API

---

# 15. Appendix C: Glossary (Monetization-Specific)

| Term | Definition |
|------|------------|
| VaaS | Verification as a Service — managed VAE hosting |
| ARR | Annual Recurring Revenue |
| GMV | Gross Marketplace Value — total transaction value through marketplace |
| Open-core | Business model where core is open-source, premium features are proprietary |
| CLA | Contributor Licence Agreement — grants project rights to relicense contributions |
| CC0 | Creative Commons Zero — public domain dedication, no copyright reserved |
| Take Rate | Percentage fee on marketplace transactions |
| Managed Control Plane | Provider-operated infrastructure (cf. GKE, EKS, AKS) |

---

## References

- [Venture Thesis §13: The Attention Economy](docs/VENTURE_THESIS.md#13-the-attention-economy)
- [Project Charter §12: Phase 5 — Marketplace](docs/specs/0000-project-charter.md#phase-5-marketplace)
- [Project Charter §15: Governance](docs/specs/0000-project-charter.md#15-governance)
- [SPRINTS.md: Sprint 22-24 — Marketplace](SPRINTS.md)
- [AI Authoring Guide](docs/AI_AUTHORING_GUIDE.md)

---

*This document is a living draft. It will evolve as the project moves through the sprint phases and validates pricing assumptions with customer discovery.*

*End of MONETIZATION.md v1.0*