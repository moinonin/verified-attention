/**
 * Verification Replay (VAE Sprint 10)
 *
 * Re-runs verification decisions on the same evidence with new/updated policies.
 * Used for audit, policy migration, and what-if analysis.
 */

import { z } from 'zod';
import type { PolicyConfig } from '@verified-attention/verification';
import type { PolicyEvaluationInput, ExtendedPolicyEvaluationResult } from '@verified-attention/verification';
import { evaluatePolicy as evaluateExtendedPolicy } from '@verified-attention/verification';
import type { AuditEntry } from '@verified-attention/store-verification-audit';
import { getAuditLog } from '@verified-attention/store-verification-audit';

// ─── Replay Types ────────────────────────────────────────────────────────────

export const ReplayRequestSchema = z.object({
  sessionId: z.string().min(1),
  originalPolicyId: z.string().min(1),
  newPolicyId: z.string().min(1),
  useOriginalInput: z.boolean().default(true),
  // Optional: provide new input to override
  newInput: z
    .object({
      evidenceTypes: z.array(z.string()),
      evidenceCounts: z.record(z.number()),
      sessionDurationMs: z.number().int().nonnegative(),
      fraudScore: z.number().min(0).max(1),
      fraudVectorScores: z.record(z.number()),
    })
    .optional(),
});

export type ReplayRequest = z.infer<typeof ReplayRequestSchema>;

export const ReplayResultSchema = z.object({
  replayId: z.string().min(1),
  sessionId: z.string().min(1),
  originalPolicyId: z.string().min(1),
  newPolicyId: z.string().min(1),
  originalOutcome: z.enum(['PASS', 'FAIL', 'INCONCLUSIVE', 'REVIEW', 'ERROR']),
  newOutcome: z.enum(['PASS', 'FAIL', 'INCONCLUSIVE', 'REVIEW', 'ERROR']),
  originalConfidence: z.number().min(0).max(1),
  newConfidence: z.number().min(0).max(1),
  outcomeChanged: z.boolean(),
  confidenceDelta: z.number(),
  originalEvaluation: z.object({
    passed: z.boolean(),
    outcome: z.enum(['PASS', 'FAIL', 'INCONCLUSIVE', 'REVIEW']),
    confidence: z.number(),
    reasons: z.array(z.string()),
    failures: z.array(z.string()),
    warnings: z.array(z.string()),
    evidenceGaps: z.array(z.string()),
  }),
  newEvaluation: z.object({
    passed: z.boolean(),
    outcome: z.enum(['PASS', 'FAIL', 'INCONCLUSIVE', 'REVIEW']),
    confidence: z.number(),
    reasons: z.array(z.string()),
    failures: z.array(z.string()),
    warnings: z.array(z.string()),
    evidenceGaps: z.array(z.string()),
  }),
  timestamp: z.string().datetime(),
});

export type ReplayResult = z.infer<typeof ReplayResultSchema>;

export type ReplayService = {
  replay(request: ReplayRequest): ReplayResult;
  replayBatch(requests: ReplayRequest[]): ReplayResult[];
  getReplayHistory(sessionId: string): ReplayResult[];
};

// ─── In-Memory Replay Service ────────────────────────────────────────────────

export class InMemoryReplayService implements ReplayService {
  private policyStore: Map<string, PolicyConfig> = new Map();
  private auditLog = getAuditLog();
  private replayHistory: Map<string, ReplayResult[]> = new Map();
  private replayCounter = 0;

  constructor() {
    // In production, this would load from a persistent policy store
  }

  setPolicyStore(policies: Map<string, PolicyConfig>): void {
    this.policyStore = new Map(policies);
  }

  addPolicy(policy: PolicyConfig): void {
    this.policyStore.set(policy.policyId, policy);
  }

  replay(request: ReplayRequest): ReplayResult {
    const originalPolicy = this.policyStore.get(request.originalPolicyId);
    const newPolicy = this.policyStore.get(request.newPolicyId);

    if (!originalPolicy) {
      throw new Error(`Original policy not found: ${request.originalPolicyId}`);
    }
    if (!newPolicy) {
      throw new Error(`New policy not found: ${request.newPolicyId}`);
    }

    // Get original input from audit log if using original input
    let input: PolicyEvaluationInput;
    if (request.useOriginalInput && !request.newInput) {
      const auditEntries = this.auditLog.query({ sessionId: request.sessionId });
      const originalEntry = auditEntries.find(
        (e) => e.policyId === request.originalPolicyId
      );

      if (!originalEntry || !originalEntry.inputSnapshot) {
        throw new Error(
          `Original audit entry not found for session ${request.sessionId} with policy ${request.originalPolicyId}`
        );
      }

      input = originalEntry.inputSnapshot as PolicyEvaluationInput;
    } else if (request.newInput) {
      input = request.newInput;
    } else {
      throw new Error('Either useOriginalInput must be true or newInput must be provided');
    }

    // Run evaluations
    const originalEvaluation = evaluateExtendedPolicy(originalPolicy, input);
    const newEvaluation = evaluateExtendedPolicy(newPolicy, input);

    const replayId = `replay_${Date.now()}_${++this.replayCounter}`;
    const timestamp = new Date().toISOString();

    const result: ReplayResult = {
      replayId,
      sessionId: request.sessionId,
      originalPolicyId: request.originalPolicyId,
      newPolicyId: request.newPolicyId,
      originalOutcome: originalEvaluation.outcome,
      newOutcome: newEvaluation.outcome,
      originalConfidence: originalEvaluation.confidence,
      newConfidence: newEvaluation.confidence,
      outcomeChanged: originalEvaluation.outcome !== newEvaluation.outcome,
      confidenceDelta: newEvaluation.confidence - originalEvaluation.confidence,
      originalEvaluation: {
        passed: originalEvaluation.passed,
        outcome: originalEvaluation.outcome,
        confidence: originalEvaluation.confidence,
        reasons: originalEvaluation.reasons,
        failures: originalEvaluation.failures,
        warnings: originalEvaluation.warnings,
        evidenceGaps: originalEvaluation.evidenceGaps,
      },
      newEvaluation: {
        passed: newEvaluation.passed,
        outcome: newEvaluation.outcome,
        confidence: newEvaluation.confidence,
        reasons: newEvaluation.reasons,
        failures: newEvaluation.failures,
        warnings: newEvaluation.warnings,
        evidenceGaps: newEvaluation.evidenceGaps,
      },
      timestamp,
    };

    // Store in history
    const history = this.replayHistory.get(request.sessionId) || [];
    history.push(result);
    this.replayHistory.set(request.sessionId, history);

    return result;
  }

  replayBatch(requests: ReplayRequest[]): ReplayResult[] {
    return requests.map((req) => this.replay(req));
  }

  getReplayHistory(sessionId: string): ReplayResult[] {
    return this.replayHistory.get(sessionId) || [];
  }
}

// ─── Replay Service Factory ──────────────────────────────────────────────────

export class ReplayServiceFactory {
  static getInstance(): ReplayService {
    if (!_replayService) {
      _replayService = new InMemoryReplayService();
    }
    return _replayService;
  }

  static setInstance(service: ReplayService): void {
    _replayService = service;
  }
}

let _replayService: ReplayService | null = null;

export function getReplayService(): ReplayService {
  return ReplayServiceFactory.getInstance();
}

export function setReplayService(service: ReplayService): void {
  ReplayServiceFactory.setInstance(service);
}

// ─── Convenience Function ────────────────────────────────────────────────────

/**
 * Replay a verification decision with a new policy.
 * This is the main entry point used by external callers.
 */
export function replayVerification(
  sessionId: string,
  originalPolicyId: string,
  newPolicyId: string,
  options?: { newInput?: PolicyEvaluationInput }
): ReplayResult {
  const service = getReplayService();

  // If we have a policy store, use it
  if (service instanceof InMemoryReplayService) {
    // Add policies from the verification module if not already present
  }

  return service.replay({
    sessionId,
    originalPolicyId,
    newPolicyId,
    useOriginalInput: !options?.newInput,
    newInput: options?.newInput,
  });
}