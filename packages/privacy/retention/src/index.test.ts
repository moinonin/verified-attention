/**
 * Retention Policy Tests (VAE Sprint 15)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getRetentionPolicyEngine, type RetentionPolicyEngine } from './index';
import type { DataClassification, RetentionPolicy, RetentionRequest } from './index';

describe('Retention Policies', () => {
  let engine: RetentionPolicyEngine;

  beforeEach(() => {
    vi.resetModules();
    engine = getRetentionPolicyEngine();
  });

  it('has default policies loaded', () => {
    const policies = engine.listPolicies();
    expect(policies.length).toBeGreaterThan(0);
    expect(policies.some(p => p.name === 'evidence-standard')).toBe(true);
    expect(policies.some(p => p.name === 'proof-standard')).toBe(true);
  });

  it('creates a custom policy', () => {
    const policy = engine.createPolicy({
      name: 'custom-policy',
      classification: 'EVIDENCE' as DataClassification,
      retentionPeriod: { type: 'FIXED', days: 30 },
      expiryAction: 'DELETE',
      description: 'Custom 30-day retention',
      jurisdiction: ['GDPR'],
    });

    expect(policy.id).toMatch(/^pol_/);
    expect(policy.name).toBe('custom-policy');
    expect(policy.retentionPeriod.days).toBe(30);
    expect(policy.createdAt).toBeDefined();
  });

  it('gets policy by ID', () => {
    const created = engine.createPolicy({
      name: 'get-test',
      classification: 'SESSION' as DataClassification,
      retentionPeriod: { type: 'FIXED', days: 7 },
      expiryAction: 'DELETE',
      jurisdiction: ['GDPR'],
    });

    const retrieved = engine.getPolicy(created.id);
    expect(retrieved?.name).toBe('get-test');
    expect(retrieved?.retentionPeriod.days).toBe(7);
  });

  it('gets policy for classification', () => {
    const policy = engine.getPolicyForClassification('EVIDENCE');
    expect(policy).toBeDefined();
    expect(policy?.name).toBe('evidence-standard');
  });

  it('updates a policy', () => {
    const created = engine.createPolicy({
      name: 'update-test',
      classification: 'EVIDENCE' as DataClassification,
      retentionPeriod: { type: 'FIXED', days: 30 },
      expiryAction: 'DELETE',
      jurisdiction: ['GDPR'],
    });

    const updated = engine.updatePolicy(created.id, {
      retentionPeriod: { type: 'FIXED', days: 60 },
      description: 'Updated to 60 days',
    });

    expect(updated?.retentionPeriod.days).toBe(60);
    expect(updated?.description).toBe('Updated to 60 days');
  });

  it('deletes a policy', () => {
    const created = engine.createPolicy({
      name: 'delete-test',
      classification: 'EVIDENCE' as DataClassification,
      retentionPeriod: { type: 'FIXED', days: 1 },
      expiryAction: 'DELETE',
      jurisdiction: ['GDPR'],
    });

    expect(engine.deletePolicy(created.id)).toBe(true);
    expect(engine.getPolicy(created.id)).toBeUndefined();
  });

  it('schedules retention for evidence', () => {
    const request: RetentionRequest = {
      dataId: 'evidence-123',
      classification: 'EVIDENCE' as DataClassification,
      createdAt: new Date().toISOString(),
      dataSource: 'test-source',
    };

    const result = engine.scheduleRetention(request);
    expect(result.dataId).toBe('evidence-123');
    expect(result.status).toBe('SCHEDULED');
    expect(result.scheduledForDeletion).toBeDefined();
  });

  it('schedules retention for proof (7 years)', () => {
    const request: RetentionRequest = {
      dataId: 'proof-456',
      classification: 'PROOF' as DataClassification,
      createdAt: new Date().toISOString(),
    };

    const result = engine.scheduleRetention(request);
    expect(result.status).toBe('SCHEDULED');
    const scheduledDate = new Date(result.scheduledForDeletion!);
    const now = new Date();
    const yearsDiff = (scheduledDate.getFullYear() - now.getFullYear());
    expect(yearsDiff).toBeGreaterThanOrEqual(7);
  });

  it('places legal hold', () => {
    const request: RetentionRequest = {
      dataId: 'evidence-hold-1',
      classification: 'EVIDENCE' as DataClassification,
      createdAt: new Date().toISOString(),
    };

    engine.scheduleRetention(request);
    const result = engine.placeLegalHold('evidence-hold-1', 'Ongoing investigation');
    expect(result).toBeDefined();
    expect(result?.status).toBe('LEGAL_HOLD');
    expect(result?.legalHoldReason).toBe('Ongoing investigation');
  });

  it('releases legal hold', () => {
    const request: RetentionRequest = {
      dataId: 'evidence-hold-2',
      classification: 'EVIDENCE' as DataClassification,
      createdAt: new Date().toISOString(),
    };

    engine.scheduleRetention(request);
    engine.placeLegalHold('evidence-hold-2', 'Investigation');
    const result = engine.releaseLegalHold('evidence-hold-2');
    expect(result?.status).toBe('RETAINED');
  });

  it('gets retention schedule', () => {
    const request: RetentionRequest = {
      dataId: 'schedule-test-1',
      classification: 'EVIDENCE' as DataClassification,
      createdAt: new Date().toISOString(),
    };

    engine.scheduleRetention(request);
    const schedule = engine.getRetentionSchedule('schedule-test-1');
    expect(schedule).toBeDefined();
    expect(schedule?.classification).toBe('EVIDENCE');
    expect(schedule?.policyId).toBeDefined();
    expect(schedule?.retentionUntil).toBeDefined();
  });

  it('gets expiring data', () => {
    // Create a policy with 1 day retention
    engine.createPolicy({
      name: 'expiring-test-policy',
      classification: 'EVIDENCE' as DataClassification,
      retentionPeriod: { type: 'FIXED', days: 1 },
      expiryAction: 'DELETE',
      jurisdiction: ['GDPR'],
    });

    // Override schedule to use this policy
    const request: RetentionRequest = {
      dataId: 'expiring-data-1',
      classification: 'EVIDENCE' as DataClassification,
      createdAt: new Date().toISOString(),
      scheduleOverride: 'expiring-test-policy',
    };

    engine.scheduleRetention(request);
    const expiring = engine.getExpiringData(2);
    expect(expiring.length).toBeGreaterThanOrEqual(1);
  });

  it('gets retention stats', () => {
    engine.scheduleRetention({
      dataId: 'stat-test-1',
      classification: 'EVIDENCE' as DataClassification,
      createdAt: new Date().toISOString(),
    });

    const stats = engine.getRetentionStats();
    expect(stats.totalRecords).toBeGreaterThan(0);
    expect(stats.byClassification.EVIDENCE).toBeDefined();
    expect(stats.byClassification.EVIDENCE.retained).toBeGreaterThan(0);
  });

  it('processes expiries', () => {
    // Create a policy with 0 days retention
    engine.createPolicy({
      name: 'instant-expire',
      classification: 'EVIDENCE' as DataClassification,
      retentionPeriod: { type: 'FIXED', days: 0 },
      expiryAction: 'DELETE',
      jurisdiction: ['GDPR'],
    });

    const request: RetentionRequest = {
      dataId: 'instant-data-1',
      classification: 'EVIDENCE' as DataClassification,
      createdAt: new Date().toISOString(),
      scheduleOverride: 'instant-expire',
    };

    engine.scheduleRetention(request);
    const results = engine.processExpiries();
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].status).toBe('DELETED');
  });

  it('listPolicies returns all policies', () => {
    const policies = engine.listPolicies();
    expect(policies.length).toBeGreaterThan(0);
    // Should include default policies
    const names = policies.map(p => p.name);
    expect(names).toContain('evidence-standard');
    expect(names).toContain('proof-standard');
    expect(names).toContain('session-standard');
  });
});

describe('Retention Policies - Legal Hold', () => {
  it('prevents expiry when legal hold is active', () => {
    // Use a policy that would expire immediately
    engine.createPolicy({
      name: 'no-retention',
      classification: 'EVIDENCE' as DataClassification,
      retentionPeriod: { type: 'FIXED', days: 0 },
      expiryAction: 'DELETE',
      jurisdiction: ['GDPR'],
    });

    const request: RetentionRequest = {
      dataId: 'legal-hold-data',
      classification: 'EVIDENCE' as DataClassification,
      createdAt: new Date().toISOString(),
      scheduleOverride: 'no-retention',
    };

    engine.scheduleRetention(request);
    engine.placeLegalHold('legal-hold-data', 'Hold for investigation');

    const results = engine.processExpiries();
    // Should not be processed because of legal hold
    const stillScheduled = engine.getRetentionSchedule('legal-hold-data');
    expect(stillScheduled).toBeDefined();
    expect(stillScheduled?.legalHold).toBe(true);
  });
});
