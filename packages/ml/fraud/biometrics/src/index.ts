/**
 * Behavioural Biometrics Features
 * 
 * Extracts biometric features from VAP evidence for fraud detection.
 * Features include mouse curvature, keystroke dynamics, pressure patterns.
 * 
 * @module @verified-attention/ml-fraud-biometrics
 */

import type { Evidence } from '@verified-attention/core';

/**
 * Feature vector dimension: 12 features
 * Corresponds to biometric features from fraud prototype
 */
export const BIOMETRIC_FEATURE_NAMES = [
  // Mouse dynamics (5 features)
  'mouse_velocity_mean',
  'mouse_velocity_std',
  'mouse_acceleration_mean',
  'mouse_acceleration_std',
  'mouse_curvature',
  
  // Keystroke dynamics (4 features)
  'key_hold_time_mean',
  'key_hold_time_std',
  'key_interval_mean',
  'key_interval_std',
  
  // Pressure/touch dynamics (3 features)
  'pressure_mean',
  'pressure_std',
  'pressure_change_rate',
] as const;

export type BiometricFeatureName = typeof BIOMETRIC_FEATURE_NAMES[number];

/**
 * Normalization bounds for each feature (min, max) from research data
 */
const FEATURE_BOUNDS: Record<BiometricFeatureName, [number, number]> = {
  // Mouse dynamics
  mouse_velocity_mean: [0, 5000],
  mouse_velocity_std: [0, 2000],
  mouse_acceleration_mean: [0, 10000],
  mouse_acceleration_std: [0, 5000],
  mouse_curvature: [0, 1],
  
  // Keystroke dynamics
  key_hold_time_mean: [0, 500],
  key_hold_time_std: [0, 200],
  key_interval_mean: [0, 1000],
  key_interval_std: [0, 500],
  
  // Pressure/touch
  pressure_mean: [0, 1],
  pressure_std: [0, 0.5],
  pressure_change_rate: [0, 10],
};

/**
 * Clamp value to [min, max] range
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Min-max normalize value to [0, 1] using predefined bounds
 */
function normalize(value: number, featureName: BiometricFeatureName): number {
  const [min, max] = FEATURE_BOUNDS[featureName];
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

/**
 * Calculate mean of array
 */
function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Calculate standard deviation
 */
function std(arr: number[], m?: number): number {
  if (arr.length <= 1) return 0;
  const m_val = m ?? mean(arr);
  const variance = arr.reduce((sum, v) => sum + Math.pow(v - m_val, 2), 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

/**
 * Calculate curvature from mouse path points
 * Higher curvature = more human-like natural movement
 */
function calcCurvature(points: { x: number; y: number; t: number }[]): number {
  if (points.length < 3) return 0;
  
  let totalAngle = 0;
  let segmentCount = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const p1 = points[i - 1];
    const p2 = points[i];
    const p3 = points[i + 1];
    
    // Vectors
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    const mag1 = Math.hypot(v1.x, v1.y);
    const mag2 = Math.hypot(v2.x, v2.y);
    
    if (mag1 === 0 || mag2 === 0) continue;
    
    // Angle between vectors
    const dot = (v1.x * v2.x + v1.y * v2.y) / (mag1 * mag2);
    const angle = Math.acos(clamp(dot, -1, 1));
    totalAngle += angle;
    segmentCount++;
  }
  
  return segmentCount > 0 ? totalAngle / segmentCount : 0;
}

/**
 * Extract biometric features from evidence
 * Expects E-INTERACTION evidence with mouse/keyboard/touch payload data
 */
export function extractBiometricFeatures(evidence: Evidence[]): number[] {
  // Accumulators
  const mousePoints: { x: number; y: number; t: number }[] = [];
  const keyHoldTimes: number[] = [];
  const keyIntervals: number[] = [];
  const pressures: number[] = [];
  
  let lastKeyTime = 0;
  
  // Process each evidence item
  for (const e of evidence) {
    const payload = e.payload as Record<string, unknown>;
    
    switch (e.evidenceType) {
      case 'E-INTERACTION': {
        // Mouse movement data
        if (payload.mousePoints && Array.isArray(payload.mousePoints)) {
          const points = payload.mousePoints as { x: number; y: number; t: number }[];
          mousePoints.push(...points);
        }
        
        // Individual mouse events
        if (typeof payload.mouseX === 'number' && typeof payload.mouseY === 'number' && typeof payload.timestamp === 'number') {
          mousePoints.push({ x: payload.mouseX, y: payload.mouseY, t: payload.timestamp });
        }
        
        // Keystroke data
        if (typeof payload.keyHoldTime === 'number') {
          keyHoldTimes.push(payload.keyHoldTime);
        }
        if (typeof payload.keyInterval === 'number') {
          keyIntervals.push(payload.keyInterval);
        }
        if (typeof payload.keyTimestamp === 'number' && lastKeyTime > 0) {
          keyIntervals.push(payload.keyTimestamp - lastKeyTime);
        }
        if (typeof payload.keyTimestamp === 'number') {
          lastKeyTime = payload.keyTimestamp;
        }
        
        // Pressure/touch data
        if (typeof payload.pressure === 'number') {
          pressures.push(payload.pressure);
        }
        if (payload.pressures && Array.isArray(payload.pressures)) {
          pressures.push(...(payload.pressures as number[]));
        }
        break;
      }
    }
  }
  
  // Calculate mouse dynamics
  let mouseVelocityMean = 0;
  let mouseVelocityStd = 0;
  let mouseAccelerationMean = 0;
  let mouseAccelerationStd = 0;
  let mouseCurvature = 0;
  
  if (mousePoints.length >= 2) {
    // Sort by time
    mousePoints.sort((a, b) => a.t - b.t);
    
    // Velocity and acceleration
    const velocities: number[] = [];
    const accelerations: number[] = [];
    
    for (let i = 1; i < mousePoints.length; i++) {
      const dt = mousePoints[i].t - mousePoints[i - 1].t;
      if (dt <= 0) continue;
      
      const dx = mousePoints[i].x - mousePoints[i - 1].x;
      const dy = mousePoints[i].y - mousePoints[i - 1].y;
      const dist = Math.hypot(dx, dy);
      
      const velocity = dist / dt * 1000; // pixels/sec
      velocities.push(velocity);
      
      if (i >= 2) {
        const prevDt = mousePoints[i - 1].t - mousePoints[i - 2].t;
        if (prevDt > 0) {
          const prevDx = mousePoints[i - 1].x - mousePoints[i - 2].x;
          const prevDy = mousePoints[i - 1].y - mousePoints[i - 2].y;
          const prevDist = Math.hypot(prevDx, prevDy);
          const prevVelocity = prevDist / prevDt * 1000;
          const acceleration = (velocity - prevVelocity) / dt * 1000; // pixels/sec²
          accelerations.push(acceleration);
        }
      }
    }
    
    mouseVelocityMean = mean(velocities);
    mouseVelocityStd = std(velocities, mouseVelocityMean);
    mouseAccelerationMean = mean(accelerations);
    mouseAccelerationStd = std(accelerations, mouseAccelerationMean);
    
    // Curvature
    mouseCurvature = calcCurvature(mousePoints);
  }
  
  // Keystroke dynamics
  const keyHoldTimeMean = mean(keyHoldTimes);
  const keyHoldTimeStd = std(keyHoldTimes, keyHoldTimeMean);
  const keyIntervalMean = mean(keyIntervals);
  const keyIntervalStd = std(keyIntervals, keyIntervalMean);
  
  // Pressure dynamics
  const pressureMean = mean(pressures);
  const pressureStd = std(pressures, pressureMean);
  
  // Pressure change rate (how quickly pressure changes)
  let pressureChangeRate = 0;
  if (pressures.length >= 2) {
    let totalChange = 0;
    for (let i = 1; i < pressures.length; i++) {
      totalChange += Math.abs(pressures[i] - pressures[i - 1]);
    }
    pressureChangeRate = totalChange / (pressures.length - 1);
  }
  
  // Build raw feature vector
  const rawFeatures: Record<BiometricFeatureName, number> = {
    mouse_velocity_mean: mouseVelocityMean,
    mouse_velocity_std: mouseVelocityStd,
    mouse_acceleration_mean: mouseAccelerationMean,
    mouse_acceleration_std: mouseAccelerationStd,
    mouse_curvature: mouseCurvature,
    key_hold_time_mean: keyHoldTimeMean,
    key_hold_time_std: keyHoldTimeStd,
    key_interval_mean: keyIntervalMean,
    key_interval_std: keyIntervalStd,
    pressure_mean: pressureMean,
    pressure_std: pressureStd,
    pressure_change_rate: pressureChangeRate,
  };
  
  // Normalize each feature
  return BIOMETRIC_FEATURE_NAMES.map(name => normalize(rawFeatures[name], name));
}

/**
 * Get feature names for model input/output mapping
 */
export function getBiometricFeatureNames(): readonly string[] {
  return BIOMETRIC_FEATURE_NAMES;
}

/**
 * Validate feature vector dimension
 */
export function validateBiometricFeatureVector(features: number[]): boolean {
  return features.length === BIOMETRIC_FEATURE_NAMES.length &&
         features.every(f => typeof f === 'number' && isFinite(f));
}

export default {
  extractBiometricFeatures,
  getBiometricFeatureNames,
  validateBiometricFeatureVector,
  BIOMETRIC_FEATURE_NAMES,
};