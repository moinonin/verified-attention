/**
 * L9 Integration Test: Fraud Score -> Verification Engine -> FAIL Outcome
 * 
 * Tests the complete pipeline: fraud detection feeds into verification
 * and triggers a FAIL outcome when fraud is detected.
 */

import { describe, it, expect } from 'vitest';
import { predictFraud, type FraudFeatures } from '@verified-attention/ml-fraud-ensemble';
import { VerificationEngine, VerificationOutcome } from '@verified-attention/verification';
import { EvidenceType } from '@verified-attention/core';

describe('L9: Fraud -> Verification Engine Integration', () => {
  const engine = new VerificationEngine();
  
  // Create fraud features that will trigger high fraud score
  function makeFraudFeatures(): FraudFeatures {
    return {
      biometricAnomalyScore: 0.95,
      biometricConfidence: 0.2,
      fingerprintEntropy: 12,
      fingerprintKnown: true,
      fingerprintMatchScore: 0.9,
      automationScore: 0.98,
      automationConfidence: 0.99,
      isAutomated: true,
      sybilRiskScore: 0.9,
      sybilClusterSize: 50,
      inSybilCluster: true,
      deviceReputation: -0.9,
      ipReputation: -0.85,
      reputationRiskScore: 0.95,
      evidenceCount: 2,
      sessionDuration: 5000,
      velocityScore: 0.95,
    };
  }

  // Create legitimate features
  function makeLegitimateFeatures(): FraudFeatures {
    return {
      biometricAnomalyScore: 0.05,
      biometricConfidence: 0.9,
      fingerprintEntropy: 22,
      fingerprintKnown: false,
      fingerprintMatchScore: 0.05,
      automationScore: 0.02,
      automationConfidence: 0.95,
      isAutomated: false,
      sybilRiskScore: 0.05,
      sybilClusterSize: 1,
      inSybilCluster: false,
      deviceReputation: 0.6,
      ipReputation: 0.5,
      reputationRiskScore: 0.1,
      evidenceCount: 15,
      sessionDuration: 300000,
      velocityScore: 0.05,
    };
  }

  it('should produce FAIL outcome when fraud is detected', async () => {
    const fraudFeatures = makeFraudFeatures();
    const fraudPrediction = predictFraud(fraudFeatures);
    
    expect(fraudPrediction.isFraud).toBe(true);
    expect(fraudPrediction.fraudScore).toBeGreaterThan(0.8);

    // Build verification input with fraud signal
    const verificationInput = {
      session: {
        sessionId: 'urn:vap:session:fraud-test-1',
        contentId: 'urn:vap:content:test',
        viewerIdHash: 'hash-123',
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
      },
      canReceiveMoreEvidence: false,
      evidence: [
        {
          evidenceId: 'urn:vap:evidence:fraud-1',
          sessionId: 'urn:vap:session:fraud-test-1',
          sourceId: 'urn:vap:source:fraud-detector',
          timestamp: new Date().toISOString(),
          evidenceType: EvidenceType.CUSTOM,
          confidence: 0.9,
          payload: { fraudScore: fraudPrediction.fraudScore, isFraud: true },
          provenance: {
            observationIds: ['obs-1'],
            observationHash: 'abc123',
            sourceId: 'urn:vap:source:fraud-detector',
          },
          signature: 'sig-1',
        }
      ],
      policy: {
        policyId: 'default-fraud-policy',
        name: 'Fraud Detection Policy',
        version: 1,
        passThreshold: 0.7,
        failThreshold: 0.3,
        minEvidenceCount: 1,
        requiredEvidenceTypes: ['E-CUSTOM'],
        maxSessionDurationMs: 86400000,
        minSessionDurationMs: 0,
        contradictionMultiplier: 1.0,
        fraudMultiplier: 2.0,
        allowManualReview: true,
        fraudScoreThreshold: 0.5, // Catch fraud
      },
      canReceiveMoreEvidence: false,
    };

    const result = await engine.verify(verificationInput);
    
    // Should FAIL due to fraud detection
    expect(result.outcome).toBe(VerificationOutcome.FAIL);
    expect(result.policyEvaluation.failures.some(f => f.includes('Fraud'))).toBe(true);
  });

  it('should produce PASS outcome for legitimate sessions', async () => {
    const legitFeatures = makeLegitimateFeatures();
    const legitPrediction = predictFraud(legitFeatures);
    
    expect(legitPrediction.isFraud).toBe(false);
    expect(legitPrediction.fraudScore).toBeLessThan(0.3);

    const verificationInput = {
      session: {
        sessionId: 'urn:vap:session:legit-test-1',
        contentId: 'urn:vap:content:test',
        viewerIdHash: 'hash-456',
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
      },
      canReceiveMoreEvidence: false,
      evidence: [
        {
          evidenceId: 'urn:vap:evidence:legit-1',
          sessionId: 'urn:vap:session:legit-test-1',
          sourceId: 'urn:vap:source:fraud-detector',
          timestamp: new Date().toISOString(),
          evidenceType: EvidenceType.CUSTOM,
          confidence: 0.9,
          payload: { fraudScore: legitPrediction.fraudScore, isFraud: false },
          provenance: {
            observationIds: ['obs-1'],
            observationHash: 'def456',
            sourceId: 'urn:vap:source:fraud-detector',
          },
          signature: 'sig-2',
        },
        {
          evidenceId: 'urn:vap:evidence:legit-2',
          sessionId: 'urn:vap:session:legit-test-1',
          sourceId: 'urn:vap:source:browser-extension-v1',
          timestamp: new Date().toISOString(),
          evidenceType: EvidenceType.INTERACTION,
          confidence: 0.9,
          payload: {
            avgScrollVelocity: 150,
            scrollDirectionChanges: 3,
            clickCount: 5,
            keyPressCount: 20,
            interactionDurationMs: 300000,
            engagementScore: 0.85,
          },
          provenance: {
            observationIds: ['obs-2'],
            observationHash: 'ghi789',
            sourceId: 'urn:vap:source:browser-extension-v1',
          },
          signature: 'sig-3',
        }
      ],
      policy: {
        policyId: 'default-fraud-policy',
        name: 'Fraud Detection Policy',
        version: 1,
        passThreshold: 0.7,
        failThreshold: 0.3,
        minEvidenceCount: 2,
        requiredEvidenceTypes: ['E-CUSTOM', 'E-INTERACTION'],
        maxSessionDurationMs: 86400000,
        minSessionDurationMs: 0,
        contradictionMultiplier: 1.0,
        fraudMultiplier: 2.0,
        allowManualReview: true,
        fraudScoreThreshold: 0.7,
      },
    };

    const result = await engine.verify(verificationInput);
    
    // Should PASS for legitimate sessions
    expect(result.outcome).toBe(VerificationOutcome.PASS);
  });

  it('should produce INCONCLUSIVE when evidence is insufficient', async () => {
    const legitFeatures = makeLegitimateFeatures();
    const legitPrediction = predictFraud(legitFeatures);
    
    const verificationInput = {
      session: {
        sessionId: 'urn:vap:session:insufficient-1',
        contentId: 'urn:vap:content:test',
        viewerIdHash: 'hash-789',
        startedAt: new Date().toISOString(),
      },
      canReceiveMoreEvidence: true,
      evidence: [
        // Only 1 evidence, policy requires 2
        {
          evidenceId: 'urn:vap:evidence:insuff-1',
          sessionId: 'urn:vap:session:insufficient-1',
          sourceId: 'urn:vap:source:browser-extension-v1',
          timestamp: new Date().toISOString(),
          evidenceType: EvidenceType.INTERACTION,
          confidence: 0.9,
          payload: {
            avgScrollVelocity: 150,
            clickCount: 2,
            keyPressCount: 10,
            interactionDurationMs: 120000,
            engagementScore: 0.8,
          },
          provenance: {
            observationIds: ['obs-1'],
            observationHash: 'jkl012',
            sourceId: 'urn:vap:source:browser-extension-v1',
          },
          signature: 'sig-4',
        }
      ],
      policy: {
        policyId: 'default-fraud-policy',
        name: 'Fraud Detection Policy',
        version: 1,
        passThreshold: 0.7,
        failThreshold: 0.3,
        minEvidenceCount: 2,
        requiredEvidenceTypes: ['E-CUSTOM', 'E-INTERACTION'],
        maxSessionDurationMs: 86400000,
        minSessionDurationMs: 0,
        contradictionMultiplier: 1.0,
        fraudMultiplier: 2.0,
        allowManualReview: true,
        fraudScoreThreshold: 0.7,
      },
    };

    const result = await engine.verify(verificationInput);
    
    // Should be PENDING (can receive more evidence)
    expect(result.outcome).toBe(VerificationOutcome.PENDING);
  });

  it('should produce FAIL when fraud score is passed via evidence', async () => {
    // Test that the fraud score in evidence is actually used by the engine
    const fraudFeatures = makeFraudFeatures();
    const fraudPrediction = predictFraud(fraudFeatures);
    
    const verificationInput = {
      session: {
        sessionId: 'urn:vap:session:fraud-evidence-1',
        contentId: 'urn:vap:content:test',
        viewerIdHash: 'hash-fraud',
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
      },
      canReceiveMoreEvidence: false,
      evidence: [
        {
          evidenceId: 'urn:vap:evidence:fraud-evidence-1',
          sessionId: 'urn:vap:session:fraud-evidence-1',
          sourceId: 'urn:vap:source:fraud-detector',
          timestamp: new Date().toISOString(),
          evidenceType: EvidenceType.CUSTOM,
          confidence: 0.95,
          payload: { 
            fraudScore: fraudPrediction.fraudScore, 
            isFraud: true,
            details: fraudPrediction.topSignals 
          },
          provenance: {
            observationIds: ['obs-fraud'],
            observationHash: 'fraud-hash',
            sourceId: 'urn:vap:source:fraud-detector',
          },
          signature: 'sig-fraud',
        }
      ],
      policy: {
        policyId: 'fraud-strict-policy',
        name: 'Fraud Strict Policy',
        version: 1,
        passThreshold: 0.7,
        failThreshold: 0.3,
        minEvidenceCount: 1,
        requiredEvidenceTypes: ['E-CUSTOM'],
        maxSessionDurationMs: 86400000,
        minSessionDurationMs: 0,
        contradictionMultiplier: 1.0,
        fraudMultiplier: 2.0,
        allowManualReview: true,
        fraudScoreThreshold: 0.5, // Lower threshold to catch fraud
      },
    };

    const result = await engine.verify(verificationInput);
    
    // Engine should detect fraud via the evidence payload
    expect(result.outcome).toBe(VerificationOutcome.FAIL);
  });
});

export default {};
