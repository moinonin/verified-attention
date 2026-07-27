import { describe, it, expect } from 'vitest';
import {
  predictFraud,
  predictBatch,
  evaluateAUC,
  generateSyntheticBenchmark,
  DEFAULT_CONFIG,
  type FraudFeatures,
} from './index.js';

function makeLegitimateFeatures(overrides: Partial<FraudFeatures> = {}): FraudFeatures {
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
    ...overrides,
  };
}

function makeFraudFeatures(overrides: Partial<FraudFeatures> = {}): FraudFeatures {
  return {
    biometricAnomalyScore: 0.9,
    biometricConfidence: 0.3,
    fingerprintEntropy: 15,
    fingerprintKnown: true,
    fingerprintMatchScore: 0.85,
    automationScore: 0.92,
    automationConfidence: 0.98,
    isAutomated: true,
    sybilRiskScore: 0.09,
    sybilClusterSize: 50,
    inSybilCluster: true,
    deviceReputation: -0.85,
    ipReputation: -0.75,
    reputationRiskScore: 0.9,
    evidenceCount: 2,
    sessionDuration: 5000,
    velocityScore: 0.9,
    ...overrides,
  };
}

describe('predictFraud', () => {
  it('should return low score for legitimate features', () => {
    const pred = predictFraud(makeLegitimateFeatures());
    expect(pred.fraudScore).toBeLessThan(0.3);
    expect(pred.isFraud).toBe(false);
    expect(pred.riskLevel).toBe('low');
  });

  it('should return high score for fraud features', () => {
    const pred = predictFraud(makeFraudFeatures());
    expect(pred.fraudScore).toBeGreaterThan(0.7);
    expect(pred.isFraud).toBe(true);
  });

  it('should produce probability in [0,1]', () => {
    for (let i = 0; i < 100; i++) {
      const f: FraudFeatures = {
        biometricAnomalyScore: Math.random(),
        biometricConfidence: Math.random(),
        fingerprintEntropy: Math.random() * 30,
        fingerprintKnown: Math.random() < 0.5,
        fingerprintMatchScore: Math.random(),
        automationScore: Math.random(),
        automationConfidence: Math.random(),
        isAutomated: Math.random() < 0.5,
        sybilRiskScore: Math.random(),
        sybilClusterSize: Math.floor(Math.random() * 100),
        inSybilCluster: Math.random() < 0.5,
        deviceReputation: Math.random() * 2 - 1,
        ipReputation: Math.random() * 2 - 1,
        reputationRiskScore: Math.random(),
        evidenceCount: Math.floor(Math.random() * 50),
        sessionDuration: Math.random() * 1000000,
        velocityScore: Math.random(),
      };
      const p = predictFraud(f);
      expect(p.fraudScore).toBeGreaterThanOrEqual(0);
      expect(p.fraudScore).toBeLessThanOrEqual(1);
    }
  });

  it('should identify top contributing signals', () => {
    const pred = predictFraud(makeFraudFeatures());
    expect(pred.topSignals.length).toBeGreaterThan(0);
    expect(pred.topSignals.length).toBeLessThanOrEqual(5);
  });

  it('should classify risk level correctly', () => {
    expect(predictFraud(makeLegitimateFeatures()).riskLevel).toBe('low');
    const pred = predictFraud(makeFraudFeatures({ isAutomated: true, automationScore: 1.0 }));
    expect(['high', 'critical']).toContain(pred.riskLevel);
  });
});

describe('predictBatch', () => {
  it('should produce one prediction per input', () => {
    const batch = [makeLegitimateFeatures(), makeFraudFeatures(), makeLegitimateFeatures()];
    const preds = predictBatch(batch);
    expect(preds).toHaveLength(3);
    expect(preds[0].isFraud).toBe(false);
    expect(preds[1].isFraud).toBe(true);
  });
});

describe('evaluateAUC', () => {
  it('should achieve AUC >= 0.98 on synthetic benchmark (sprint target)', () => {
    const { features, labels } = generateSyntheticBenchmark();
    const preds = features.map(f => ({ fraudScore: predictFraud(f).fraudScore, isFraud: false }));
    const metrics = evaluateAUC(preds, labels);
    expect(metrics.auc).toBeGreaterThanOrEqual(0.98);
  });

  it('should return AUC=1 for perfect separation', () => {
    const preds = [
      { fraudScore: 0.9, isFraud: true },
      { fraudScore: 0.1, isFraud: false },
    ];
    const labels = [true, false];
    expect(evaluateAUC(preds, labels).auc).toBe(1);
  });

  it('should return AUC=0 for perfectly inverted predictions', () => {
    const preds = [
      { fraudScore: 0.1, isFraud: true },
      { fraudScore: 0.9, isFraud: false },
    ];
    const labels = [true, false];
    expect(evaluateAUC(preds, labels).auc).toBe(0);
  });
});
