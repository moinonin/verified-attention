import { describe, it, expect } from 'vitest';
import { detectSybil, extractSessionFeatures, isSessionInSybilCluster, type SybilConfig } from './index.js';
import type { Session, Evidence } from '@verified-attention/core';

const T0 = 1700000000000;

function makeSession(sessionId: string, metadata?: Record<string, unknown>, overrides: Partial<Session> = {}): Session {
  const base: Session = {
    sessionId,
    contentId: 'urn:vap:content:test',
    participant: { participantId: 'p1', role: 'viewer' },
    config: {},
    state: 'ACTIVE' as never,
    evidenceIds: [],
    claimIds: [],
    startedAt: new Date(T0).toISOString(),
    lastActivityAt: new Date(T0).toISOString(),
    expiredAt: new Date(T0 + 3600000).toISOString(),
    metadata,
  } as unknown as Session;
  return { ...base, ...overrides };
}

function makeEvidence(sessionId: string): Evidence {
  return {
    evidenceId: `urn:vap:evidence:${sessionId}-ev1`,
    sessionId,
    sourceId: 'urn:vap:source:browser-extension-v1',
    timestamp: new Date(T0).toISOString(),
    type: 'E-INTERACTION' as never,
    payload: {},
    state: 'SUBMITTED' as never,
  } as unknown as Evidence;
}

describe('extractSessionFeatures', () => {
  it('should extract IP, fingerprint, subnet from session metadata', () => {
    const s = makeSession('urn:vap:session:s1', { ipAddress: '192.168.1.10', deviceFingerprint: 'fp-abcd-1234' });
    const f = extractSessionFeatures(s, []);
    expect(f.ipAddress).toBe('192.168.1.10');
    expect(f.deviceFingerprint).toBe('fp-abcd-1234');
    expect(f.subnet).toBe('192.168.1.0/24');
  });

  it('should default unknown fields', () => {
    const s = makeSession('urn:vap:session:s2');
    const f = extractSessionFeatures(s, []);
    expect(f.ipAddress).toBe('unknown');
  });
});

describe('detectSybil', () => {
  it('should flag IP cluster when many sessions share an IP', () => {
    const sessions: Session[] = [];
    for (let i = 0; i < 15; i++) {
      sessions.push(makeSession(`urn:vap:session:ip${i}`, { ipAddress: '10.0.0.1', deviceFingerprint: `fp-${i}` }, { startedAt: new Date(T0 + i * 1000).toISOString() }));
    }
    const result = detectSybil(sessions, [], { ipClusterThreshold: 10, minClusterSize: 3 });
    expect(result.isSybil).toBe(true);
    expect(result.clusters.length).toBeGreaterThan(0);
  });

  it('should flag device cluster when same fingerprint appears for many sessions', () => {
    const sessions: Session[] = [];
    for (let i = 0; i < 8; i++) {
      sessions.push(makeSession(`urn:vap:session:dev${i}`, { ipAddress: `10.0.0.${i}`, deviceFingerprint: 'fp-same-token' }));
    }
    const result = detectSybil(sessions, [], { deviceClusterThreshold: 5, minClusterSize: 3 });
    expect(result.clusters.length).toBeGreaterThan(0);
    // Cluster may be merged with subnet cluster, check for either type
    const deviceCluster = result.clusters.find(c => c.type === 'device_cluster' || c.type === 'ip_cluster');
    expect(deviceCluster).toBeDefined();
    // Should include all 8 sessions
    expect(deviceCluster!.sessions.length).toBe(8);
  });

  it('should flag velocity anomalies when too many sessions appear in time window', () => {
    const sessions: Session[] = [];
    for (let i = 0; i < 30; i++) {
      sessions.push(makeSession(`urn:vap:session:vel${i}`, { ipAddress: `10.1.2.${i % 256}`, deviceFingerprint: `fp-vel-${i}` }, { startedAt: new Date(T0 + i * 1000).toISOString() }));
    }
    const result = detectSybil(sessions, [], { velocityWindowMs: 60000, maxVelocityPerWindow: 10, minClusterSize: 3, ipClusterThreshold: 100, deviceClusterThreshold: 100 });
    expect(result.signals.find(s => s.name === 'velocity_anomalies')?.detected).toBe(true);
  });

  it('should flag impossible travel', () => {
    const sessions: Session[] = [
      makeSession('urn:vap:session:t1', { ipAddress: '8.8.8.8', deviceFingerprint: 'fp-travel', country: 'US' }, { startedAt: new Date(T0).toISOString() }),
      makeSession('urn:vap:session:t2', { ipAddress: '8.8.4.4', deviceFingerprint: 'fp-travel', country: 'RU' }, { startedAt: new Date(T0 + 3600000).toISOString() }),
    ];
    const result = detectSybil(sessions, [], { ipClusterThreshold: 100, deviceClusterThreshold: 100, minClusterSize: 2 });
    expect(result.signals.find(s => s.name === 'impossible_travel')?.detected).toBe(true);
  });

  it('should return no sybil for diverse session set', () => {
    const sessions: Session[] = [];
    for (let i = 0; i < 5; i++) {
      sessions.push(makeSession(`urn:vap:session:div${i}`, { ipAddress: `10.${i}.${i}.${i}`, deviceFingerprint: `fp-unique-${i}` }, { startedAt: new Date(T0 + i * 86400000).toISOString() }));
    }
    const result = detectSybil(sessions, [], { ipClusterThreshold: 10, deviceClusterThreshold: 5, minClusterSize: 3, velocityWindowMs: 3600000, maxVelocityPerWindow: 20 });
    expect(result.isSybil).toBe(false);
    expect(result.clusters).toHaveLength(0);
  });

  it('should return zero risk score on empty input', () => {
    const result = detectSybil([], [], {});
    expect(result.isSybil).toBe(false);
    expect(result.riskScore).toBe(0);
  });
});

describe('isSessionInSybilCluster', () => {
  it('should identify sessions in cluster', () => {
    const sessions: Session[] = [];
    for (let i = 0; i < 15; i++) {
      sessions.push(makeSession(`urn:vap:session:chk${i}`, { ipAddress: '10.0.0.1', deviceFingerprint: `fp-${i}` }));
    }
    const result = detectSybil(sessions, [], { ipClusterThreshold: 10, minClusterSize: 3 });
    const inCluster = isSessionInSybilCluster('urn:vap:session:chk0', result);
    expect(inCluster.inCluster).toBe(true);
    expect(inCluster.clusters.length).toBeGreaterThan(0);
  });
});
