/**
 * Reputation Scoring with Time Decay
 *
 * Tracks reputation for entities (device fingerprint, IP, subnet, ASN)
 * using exponential time decay. Positive events increase reputation;
 * negative events decrease it. Older events weigh less.
 *
 * @module @verified-attention/ml-fraud-reputation
 */

/**
 * Reputation event record
 */
export interface ReputationEvent {
  entityId: string;
  entityType: 'device' | 'ip' | 'subnet' | 'asn' | 'session';
  timestamp: number;
  outcome: 'pass' | 'fail' | 'challenge' | 'manual_review' | 'block';
  amount?: number;
  sessionId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Reputation record for an entity
 */
export interface ReputationRecord {
  entityId: string;
  entityType: ReputationEvent['entityType'];
  score: number;          // -1.0 (worst) to +1.0 (best), 0 = neutral
  totalEvents: number;
  passCount: number;
  failCount: number;
  challengeCount: number;
  blockCount: number;
  lastUpdated: number;
  firstSeen: number;
  weightedScore: number; // time-decayed score
}

/**
 * Reputation config
 */
export interface ReputationConfig {
  halfLifeMs: number;          // Half-life for time decay (events older than this weigh 50% less)
  initialScore: number;        // Initial score for new entities (default 0 = neutral)
  minEventsForScore: number;  // Minimum events before reputation is meaningful
  passWeight: number;          // Weight contribution for pass outcome
  failWeight: number;
  challengeWeight: number;
  blockWeight: number;
  manualReviewWeight: number;
  maxHistoryEvents: number;    // Cap stored events per entity
}

export const DEFAULT_REPUTATION_CONFIG: ReputationConfig = {
  halfLifeMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  initialScore: 0,
  minEventsForScore: 3,
  passWeight: 1,
  failWeight: -2,
  challengeWeight: -0.5,
  blockWeight: -3,
  manualReviewWeight: -0.3,
  maxHistoryEvents: 1000,
};

/**
 * Exponential time decay function
 * weight = 0.5^(age / halfLife)
 */
function timeDecay(timestamp: number, now: number, halfLifeMs: number): number {
  const age = now - timestamp;
  if (age < 0) return 1; // future events weigh full
  return Math.pow(0.5, age / halfLifeMs);
}

/**
 * Reputation store - in-memory, swappable with redis/db in production
 */
export class ReputationStore {
  private records = new Map<string, ReputationRecord>();
  private events = new Map<string, ReputationEvent[]>();
  private config: ReputationConfig;
  private nowFn: () => number;

  constructor(config: Partial<ReputationConfig> = {}, nowFn?: () => number) {
    this.config = { ...DEFAULT_REPUTATION_CONFIG, ...config };
    this.nowFn = nowFn || (() => Date.now());
  }

  /**
   * Record an event and update the entity reputation
   */
  recordEvent(event: ReputationEvent): ReputationRecord {
    const now = this.nowFn();
    const key = `${event.entityType}:${event.entityId}`;

    // Get or create record
    const existing = this.records.get(key);
    let record: ReputationRecord;
    if (!existing) {
      record = {
        entityId: event.entityId,
        entityType: event.entityType,
        score: this.config.initialScore,
        totalEvents: 0,
        passCount: 0,
        failCount: 0,
        challengeCount: 0,
        blockCount: 0,
        lastUpdated: now,
        firstSeen: event.timestamp,
        weightedScore: this.config.initialScore,
      };
      this.records.set(key, record);
    } else {
      record = existing;
    }

    // Store event
    if (!this.events.has(key)) {
      this.events.set(key, []);
    }
    const eventList = this.events.get(key)!;
    eventList.push(event);

    // Trim history if exceeding cap (keep most recent)
    if (eventList.length > this.config.maxHistoryEvents) {
      const trimmed = eventList.slice(eventList.length - this.config.maxHistoryEvents);
      this.events.set(key, trimmed);
    }

    // Update counts
    record.totalEvents++;
    switch (event.outcome) {
      case 'pass': record.passCount++; break;
      case 'fail': record.failCount++; break;
      case 'challenge': record.challengeCount++; break;
      case 'block': record.blockCount++; break;
      case 'manual_review': break; // count not separate
    }
    record.lastUpdated = now;
    record.firstSeen = Math.min(record.firstSeen, event.timestamp);

    // Recalculate weighted (time-decayed) score
    this.recalculateScore(key);

    return record;
  }

  /**
   * Batch record multiple events
   */
  recordEvents(events: ReputationEvent[]): ReputationRecord[] {
    const updated: ReputationRecord[] = [];
    for (const e of events) {
      updated.push(this.recordEvent(e));
    }
    return updated;
  }

  /**
   * Get the reputation record for an entity
   */
  getReputation(entityId: string, entityType: ReputationEvent['entityType']): ReputationRecord | undefined {
    const key = `${entityType}:${entityId}`;
    return this.records.get(key);
  }

  /**
   * Get all reputation records
   */
  getAllReputations(): ReputationRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Recalculate the weighted score using time decay
   */
  private recalculateScore(key: string): void {
    const record = this.records.get(key);
    if (!record) return;
    const events = this.events.get(key);
    if (!events || events.length === 0) return;

    const now = this.nowFn();
    let weightedSum = 0;
    let totalWeight = 0;

    for (const e of events) {
      const decay = timeDecay(e.timestamp, now, this.config.halfLifeMs);
      let outcomeWeight = 0;
      switch (e.outcome) {
        case 'pass': outcomeWeight = this.config.passWeight; break;
        case 'fail': outcomeWeight = this.config.failWeight; break;
        case 'challenge': outcomeWeight = this.config.challengeWeight; break;
        case 'block': outcomeWeight = this.config.blockWeight; break;
        case 'manual_review': outcomeWeight = this.config.manualReviewWeight; break;
      }
      weightedSum += outcomeWeight * decay;
      totalWeight += decay;
    }

    if (totalWeight > 0) {
      // Normalize to [-1, +1]
      const lengthFactor = Math.min(1, events.length / this.config.minEventsForScore);
      const normalized = weightedSum / Math.max(totalWeight, 1);
      // Blend with initial score if we have few events
      const blend = lengthFactor;
      record.weightedScore = this.config.initialScore * (1 - blend) + normalized * blend;
      record.score = normalized;
    } else {
      record.weightedScore = this.config.initialScore;
      record.score = this.config.initialScore;
    }

    // Clamp
    record.weightedScore = Math.max(-1, Math.min(1, record.weightedScore));
    record.score = Math.max(-1, Math.min(1, record.score));
  }

  /**
   * Get entities with reputation below a threshold (high-risk)
   */
  getHighRiskEntities(minScore: number = -0.5): ReputationRecord[] {
    return this.getAllReputations().filter(r => r.weightedScore < minScore);
  }

  /**
   * Get entities with reputation above a threshold (trusted)
   */
  getTrustedEntities(minScore: number = 0.5): ReputationRecord[] {
    return this.getAllReputations().filter(r => r.weightedScore >= minScore);
  }

  /**
   * Clear all history for an entity
   */
  clearEntity(entityId: string, entityType: ReputationEvent['entityType']): boolean {
    const key = `${entityType}:${entityId}`;
    const had = this.records.delete(key);
    this.events.delete(key);
    return had;
  }

  /**
   * Reset the store
   */
  clearAll(): void {
    this.records.clear();
    this.events.clear();
  }
}

/**
 * Classify an entity based on its weighted score
 */
export function classifyReputation(score: number): 'trusted' | 'neutral' | 'suspicious' | 'high_risk' {
  if (score >= 0.5) return 'trusted';
  if (score >= -0.2) return 'neutral';
  if (score >= -0.5) return 'suspicious';
  return 'high_risk';
}

/**
 * Calculate a combined risk score from multiple entity reputations
 * (e.g. device + IP + subnet for a session)
 */
export function calculateCombinedRisk(
  records: (ReputationRecord | undefined)[],
  weights?: Record<string, number>
): { combinedRisk: number; components: { entity: string; score: number; weight: number }[] } {
  const defaultWeights: Record<string, number> = {
    device: 0.4,
    ip: 0.3,
    subnet: 0.2,
    asn: 0.1,
    session: 0.5,
  };
  const w = weights || defaultWeights;

  let weightedSum = 0;
  let totalWeight = 0;
  const components: { entity: string; score: number; weight: number }[] = [];

  for (const r of records) {
    if (!r) continue;
    const weight = w[r.entityType] ?? 0.1;
    // Convert reputation score to risk (1 - reputation)
    const riskScore = 1 - (r.weightedScore + 1) / 2; // score [-1,1] -> risk [1,0]
    // Invert: high reputation -> low risk
    const entityRisk = 1 - (r.weightedScore + 1) / 2;
    weightedSum += entityRisk * weight;
    totalWeight += weight;
    components.push({ entity: r.entityId, score: r.weightedScore, weight });
  }

  const combinedRisk = totalWeight > 0 ? weightedSum / totalWeight : 0.5;
  return { combinedRisk, components };
}

export default {
  ReputationStore,
  DEFAULT_REPUTATION_CONFIG,
  classifyReputation,
  calculateCombinedRisk,
};
