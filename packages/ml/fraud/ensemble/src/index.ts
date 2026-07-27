/**
 * Fraud Ensemble Model
 *
 * Combines inputs from all fraud detection sub-models into a single
 * calibrated fraud probability score via weighted logistic regression.
 *
 * Target: AUC >= 0.98 on synthetic fraud benchmark.
 *
 * @module @verified-attention/ml-fraud-ensemble
 */

/**
 * Feature vector from all sub-models
 */
export interface FraudFeatures {
  // Biometrics
  biometricAnomalyScore: number;      // 0-1, higher = more anomalous
  biometricConfidence: number;          // 0-1

  // Device fingerprint
  fingerprintEntropy: number;           // bits, target >= 18
  fingerprintKnown: boolean;             // seen before?
  fingerprintMatchScore: number;        // 0-1 similarity to known bot fingerprints

  // Automation
  automationScore: number;              // 0-1, higher = more likely automated
  automationConfidence: number;          // 0-1
  isAutomated: boolean;

  // Sybil
  sybilRiskScore: number;               // 0-1
  sybilClusterSize: number;             // sessions in the cluster
  inSybilCluster: boolean;

  // Reputation
  deviceReputation: number;              // -1 to +1
  ipReputation: number;                  // -1 to +1
  reputationRiskScore: number;           // 0-1, derived

  // Contextual
  evidenceCount: number;
  sessionDuration: number;               // ms
  velocityScore: number;                 // 0-1
}

/**
 * Ensemble model configuration - feature weights for logistic regression
 */
export interface EnsembleConfig {
  weights: Record<keyof FraudFeatures, number>;
  bias: number;
  calibrationA: number;   // Platt scaling param A
  calibrationB: number;   // Platt scaling param B
  threshold: number;      // decision threshold for isFraud
}

/**
 * Default weights - tuned heuristically, should be calibrated on real data
 * Weights reflect relative importance: automation and sybil are strongest signals
 */
export const DEFAULT_CONFIG: EnsembleConfig = {
  weights: {
    biometricAnomalyScore: 1.2,
    biometricConfidence: -0.3,
    fingerprintEntropy: -0.05,
    fingerprintKnown: 0.2,
    fingerprintMatchScore: 1.5,
    automationScore: 2.5,
    automationConfidence: 0.5,
    isAutomated: 2.0,
    sybilRiskScore: 1.8,
    sybilClusterSize: 0.02,
    inSybilCluster: 1.5,
    deviceReputation: -1.0,
    ipReputation: -0.8,
    reputationRiskScore: 1.0,
    evidenceCount: -0.001,
    sessionDuration: -0.000001,
    velocityScore: 1.2,
  },
  bias: -1.5,
  calibrationA: 0.8,
  calibrationB: -0.2,
  threshold: 0.5,
};

/**
 * Sigmoid function
 */
function sigmoid(x: number): number {
  if (x < -709) return 0;  // avoid overflow
  if (x > 709) return 1;
  return 1 / (1 + Math.exp(-x));
}

/**
 * Compute raw logit (linear combination)
 */
function computeLogit(features: FraudFeatures, config: EnsembleConfig): number {
  let logit = config.bias;
  for (const key of Object.keys(config.weights) as (keyof FraudFeatures)[]) {
    const value = features[key];
    const weight = config.weights[key];
    // boolean -> 0/1
    const numeric = typeof value === 'boolean' ? (value ? 1 : 0) : value;
    logit += weight * numeric;
  }
  return logit;
}

/**
 * Predict fraud probability from features
 */
export function predictFraud(features: FraudFeatures, config: EnsembleConfig = DEFAULT_CONFIG): FraudPrediction {
  const logit = computeLogit(features, config);
  const rawProb = sigmoid(logit);

  // Platt calibration: P(fraud) = sigmoid(A * logit + B)
  const calibratedLogit = config.calibrationA * logit + config.calibrationB;
  const calibratedProb = sigmoid(calibratedLogit);

  const riskLevel = classifyRisk(calibratedProb);
  const topSignals = identifyTopSignals(features, config);

  return {
    fraudScore: calibratedProb,
    isFraud: calibratedProb >= config.threshold,
    riskLevel,
    logit,
    topSignals,
    features,
  };
}

/**
 * Output prediction
 */
export interface FraudPrediction {
  fraudScore: number;        // 0-1 probability
  isFraud: boolean;          // true if score >= threshold
  riskLevel: RiskLevel;
  logit: number;
  topSignals: string[];
  features: FraudFeatures;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Classify the risk level from the probability
 */
function classifyRisk(prob: number): RiskLevel {
  if (prob >= 0.85) return 'critical';
  if (prob >= 0.6) return 'high';
  if (prob >= 0.3) return 'medium';
  return 'low';
}

/**
 * Identify top contributing signals (feature importance for this prediction)
 */
function identifyTopSignals(features: FraudFeatures, config: EnsembleConfig): string[] {
  const contributions: { name: string; contribution: number }[] = [];

  for (const key of Object.keys(config.weights) as (keyof FraudFeatures)[]) {
    const value = features[key];
    const numeric = typeof value === 'boolean' ? (value ? 1 : 0) : value;
    const contribution = config.weights[key] * numeric;
    if (Math.abs(contribution) > 0.1) {
      contributions.push({ name: key, contribution });
    }
  }

  // Sort by absolute contribution descending
  contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return contributions.slice(0, 5).map(c => `${c.name} (${c.contribution > 0 ? '+' : ''}${c.contribution.toFixed(2)})`);
}

/**
 * Batch predict multiple feature sets
 */
export function predictBatch(features: FraudFeatures[], config: EnsembleConfig = DEFAULT_CONFIG): FraudPrediction[] {
  return features.map(f => predictFraud(f, config));
}

/**
 * Evaluate predictions against ground truth labels
 * Computes AUC (Area Under ROC Curve)
 */
export function evaluateAUC(
  predictions: { fraudScore: number; isFraud: boolean }[],
  labels: boolean[]
): { auc: number; precision: number; recall: number; f1: number; accuracy: number } {
  if (predictions.length !== labels.length || predictions.length === 0) {
    return { auc: 0, precision: 0, recall: 0, f1: 0, accuracy: 0 };
  }

  // Sort by score descending
  const pairs = predictions.map((p, i) => ({ score: p.fraudScore, label: labels[i] }))
    .sort((a, b) => b.score - a.score);

  // Calculate AUC using trapezoidal rule on ROC curve
  let tp = 0, fp = 0;
  const totalPos = labels.filter(l => l).length;
  const totalNeg = labels.length - totalPos;
  let prevTpr = 0, prevFpr = 0;
  let auc = 0;

  for (const { label } of pairs) {
    if (label) tp++;
    else fp++;

    const tpr = tp / Math.max(totalPos, 1);
    const fpr = fp / Math.max(totalNeg, 1);
    auc += (fpr - prevFpr) * (tpr + prevTpr) / 2;
    prevTpr = tpr;
    prevFpr = fpr;
  }

  // Compute precision/recall/f1 at threshold=0.5
  const tpAtThreshold = pairs.filter(p => p.score >= 0.5 && p.label).length;
  const fpAtThreshold = pairs.filter(p => p.score >= 0.5 && !p.label).length;
  const fnAtThreshold = pairs.filter(p => p.score < 0.5 && p.label).length;
  const tnAtThreshold = pairs.filter(p => p.score < 0.5 && !p.label).length;

  const precision = tpAtThreshold / Math.max(tpAtThreshold + fpAtThreshold, 1);
  const recall = tpAtThreshold / Math.max(tpAtThreshold + fnAtThreshold, 1);
  const f1 = 2 * (precision * recall) / Math.max(precision + recall, 1e-10);
  const accuracy = (tpAtThreshold + tnAtThreshold) / pairs.length;

  return { auc, precision, recall, f1, accuracy };
}

/**
 * Generate synthetic test data with controlled fraud patterns
 * for evaluating model AUC against the >= 0.98 target
 */
export function generateSyntheticBenchmark(): { features: FraudFeatures[]; labels: boolean[] } {
  const features: FraudFeatures[] = [];
  const labels: boolean[] = [];

  // Generate 1000 legitimate sessions
  for (let i = 0; i < 1000; i++) {
    features.push({
      biometricAnomalyScore: Math.random() * 0.15,
      biometricConfidence: 0.8 + Math.random() * 0.2,
      fingerprintEntropy: 18 + Math.random() * 10,
      fingerprintKnown: Math.random() < 0.3,
      fingerprintMatchScore: Math.random() * 0.1,
      automationScore: Math.random() * 0.05,
      automationConfidence: 0.9 + Math.random() * 0.1,
      isAutomated: false,
      sybilRiskScore: Math.random() * 0.1,
      sybilClusterSize: Math.floor(Math.random() * 3),
      inSybilCluster: false,
      deviceReputation: 0.3 + Math.random() * 0.7,
      ipReputation: 0.2 + Math.random() * 0.8,
      reputationRiskScore: Math.random() * 0.15,
      evidenceCount: 5 + Math.floor(Math.random() * 20),
      sessionDuration: 60000 + Math.random() * 600000,
      velocityScore: Math.random() * 0.1,
    });
    labels.push(false);
  }

  // Generate 500 fraud sessions
  for (let i = 0; i < 500; i++) {
    const fraudType = i % 4;
    const f: FraudFeatures = {
      biometricAnomalyScore: 0,
      biometricConfidence: 0.5,
      fingerprintEntropy: 20,
      fingerprintKnown: false,
      fingerprintMatchScore: 0,
      automationScore: 0,
      automationConfidence: 0.5,
      isAutomated: false,
      sybilRiskScore: 0,
      sybilClusterSize: 1,
      inSybilCluster: false,
      deviceReputation: 0,
      ipReputation: 0,
      reputationRiskScore: 0.5,
      evidenceCount: 5,
      sessionDuration: 300000,
      velocityScore: 0.3,
    };

    if (fraudType === 0) {
      // Bot
      f.isAutomated = true;
      f.automationScore = 0.9 + Math.random() * 0.1;
      f.automationConfidence = 0.95;
      f.fingerprintMatchScore = 0.8 + Math.random() * 0.2;
    } else if (fraudType === 1) {
      // Sybil
      f.inSybilCluster = true;
      f.sybilRiskScore = 0.85 + Math.random() * 0.15;
      f.sybilClusterSize = 20 + Math.floor(Math.random() * 80);
    } else if (fraudType === 2) {
      // Botnet / automation
      f.biometricAnomalyScore = 0.8 + Math.random() * 0.2;
      f.biometricConfidence = 0.3;
      f.isAutomated = true;
      f.automationScore = 0.7;
    } else {
      // Bad reputation
      f.deviceReputation = -0.8 - Math.random() * 0.2;
      f.ipReputation = -0.7 - Math.random() * 0.3;
      f.reputationRiskScore = 0.8 + Math.random() * 0.2;
    }

    features.push(f);
    labels.push(true);
  }

  return { features, labels };
}

export default {
  predictFraud,
  predictBatch,
  evaluateAUC,
  generateSyntheticBenchmark,
  DEFAULT_CONFIG,
};
