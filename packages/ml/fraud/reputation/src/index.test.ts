import { describe, it, expect, beforeEach } from 'vitest';
import { ReputationStore, classifyReputation, calculateCombinedRisk, DEFAULT_REPUTATION_CONFIG, type ReputationEvent } from './index.js';

const BASE_TIME = 1700000000000; // fixed reference time for deterministic tests

function makeEvent(overrides: Partial<ReputationEvent>): ReputationEvent {
  return {
    entityId: 'device-1',
    entityType: 'device',
    timestamp: BASE_TIME,
    outcome: 'pass',
    sessionId: 'sess-1',
    ...overrides,
  };
}

describe('ReputationStore', () => {
  it('should create a new record on first event', () => {
    const store = new ReputationStore({}, () => BASE_TIME);
    const record = store.recordEvent(makeEvent({}));

    expect(record).toBeDefined();
    expect(record.entityId).toBe('device-1');
    expect(record.totalEvents).toBe(1);
    expect(record.passCount).toBe(1);
    expect(record.firstSeen).toBe(BASE_TIME);
  });

  it('should accumulate counts across events', () => {
    const store = new ReputationStore({}, () => BASE_TIME);
    store.recordEvent(makeEvent({ outcome: 'pass', sessionId: 's1' }));
    store.recordEvent(makeEvent({ outcome: 'pass', sessionId: 's2' }));
    store.recordEvent(makeEvent({ outcome: 'fail', sessionId: 's3' }));

    const record = store.getReputation('device-1', 'device')!;
    expect(record.totalEvents).toBe(3);
    expect(record.passCount).toBe(2);
    expect(record.failCount).toBe(1);
  });

  it('should apply time decay to weighted score', () => {
    const store = new ReputationStore({ halfLifeMs: 1000 }, () => BASE_TIME);

    // Old pass event (half life ago = 50% weight)
    store.recordEvent(makeEvent({ timestamp: BASE_TIME - 1000, outcome: 'pass' }));
    // Recent fail event (full weight)
    store.recordEvent(makeEvent({ timestamp: BASE_TIME, outcome: 'fail' }));

    const record = store.getReputation('device-1', 'device')!;
    // Old: pass weight = 1 * 0.5 = 0.5; Recent: fail weight = -2 * 1.0 = -2
    // normalized = (-2 + 0.5) / (1 + 0.5) = -1.5/1.5 = -1
    expect(record.weightedScore).toBeLessThan(0);
    expect(record.weightedScore).toBeGreaterThan(-1);
  });

  it('should classify high-risk entities correctly', () => {
    const store = new ReputationStore({}, () => BASE_TIME);
    for (let i = 0; i < 10; i++) {
      store.recordEvent(makeEvent({ outcome: 'fail', sessionId: `s${i}`, timestamp: BASE_TIME - i * 1000 }));
    }
    const highRisk = store.getHighRiskEntities(-0.5);
    expect(highRisk.length).toBeGreaterThanOrEqual(1);
    expect(highRisk[0].failCount).toBe(10);
  });

  it('should classify trusted entities correctly', () => {
    const store = new ReputationStore({}, () => BASE_TIME);
    for (let i = 0; i < 10; i++) {
      store.recordEvent(makeEvent({ outcome: 'pass', sessionId: `s${i}`, timestamp: BASE_TIME - i * 1000 }));
    }
    const trusted = store.getTrustedEntities(0.3);
    expect(trusted.length).toBeGreaterThanOrEqual(1);
    expect(trusted[0].passCount).toBe(10);
  });

  it('should clear entity history', () => {
    const store = new ReputationStore({}, () => BASE_TIME);
    store.recordEvent(makeEvent({}));
    expect(store.getReputation('device-1', 'device')).toBeDefined();

    const cleared = store.clearEntity('device-1', 'device');
    expect(cleared).toBe(true);
    expect(store.getReputation('device-1', 'device')).toBeUndefined();
  });

  it('should trim history when exceeding max', () => {
    const store = new ReputationStore({ maxHistoryEvents: 5 }, () => BASE_TIME);
    for (let i = 0; i < 10; i++) {
      store.recordEvent(makeEvent({ sessionId: `s${i}`, timestamp: BASE_TIME + i }));
    }
    const record = store.getReputation('device-1', 'device')!;
    expect(record.totalEvents).toBe(10);
    // Score should still be calculable
    expect(record.weightedScore).toBeGreaterThanOrEqual(-1);
    expect(record.weightedScore).toBeLessThanOrEqual(1);
  });

  it('should handle manual_review outcome', () => {
    const store = new ReputationStore({}, () => BASE_TIME);
    store.recordEvent(makeEvent({ outcome: 'manual_review' }));
    const record = store.getReputation('device-1', 'device')!;
    expect(record.totalEvents).toBe(1);
  });
});

describe('classifyReputation', () => {
  it('should classify trusted', () => {
    expect(classifyReputation(0.8)).toBe('trusted');
    expect(classifyReputation(0.5)).toBe('trusted');
  });

  it('should classify neutral', () => {
    expect(classifyReputation(0.0)).toBe('neutral');
    expect(classifyReputation(-0.2)).toBe('neutral');
  });

  it('should classify suspicious', () => {
    expect(classifyReputation(-0.3)).toBe('suspicious');
    expect(classifyReputation(-0.5)).toBe('suspicious');
  });

  it('should classify high_risk', () => {
    expect(classifyReputation(-0.7)).toBe('high_risk');
    expect(classifyReputation(-1.0)).toBe('high_risk');
  });
});

describe('calculateCombinedRisk', () => {
  it('should combine multiple entity reputations', () => {
    const store = new ReputationStore({}, () => BASE_TIME);
    for (let i = 0; i < 5; i++) {
      store.recordEvent({ entityId: 'device-1', entityType: 'device', timestamp: BASE_TIME - i*1000, outcome: 'pass', sessionId: `s${i}` });
      store.recordEvent({ entityId: 'ip-1', entityType: 'ip', timestamp: BASE_TIME - i*1000, outcome: 'fail', sessionId: `s${i}` });
    }
    const deviceRec = store.getReputation('device-1', 'device');
    const ipRec = store.getReputation('ip-1', 'ip');
    const result = calculateCombinedRisk([deviceRec, ipRec]);

    expect(result.combinedRisk).toBeGreaterThanOrEqual(0);
    expect(result.combinedRisk).toBeLessThanOrEqual(1);
    expect(result.components).toHaveLength(2);
  });

  it('should handle undefined records', () => {
    const result = calculateCombinedRisk([undefined, undefined]);
    expect(result.combinedRisk).toBe(0.5);
    expect(result.components).toHaveLength(0);
  });
});
