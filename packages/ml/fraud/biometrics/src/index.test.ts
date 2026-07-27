import { describe, it, expect } from 'vitest';
import { 
  extractBiometricFeatures, 
  BIOMETRIC_FEATURE_NAMES 
} from './index.js';
import type { Evidence } from '@verified-attention/core';
import { EvidenceType } from '@verified-attention/core';

describe('extractBiometricFeatures', () => {
  it('should return 12-dimensional feature vector', () => {
    const evidence: Evidence[] = [
      {
        evidenceId: 'urn:vap:evidence:test-1',
        sessionId: 'urn:vap:session:test-1',
        sourceId: 'urn:vap:source:browser-extension-v1',
        timestamp: new Date().toISOString(),
        evidenceType: EvidenceType.INTERACTION,
        confidence: 0.9,
        payload: {
          mousePoints: [
            { x: 100, y: 100, t: 1000 },
            { x: 150, y: 120, t: 1050 },
            { x: 200, y: 130, t: 1100 },
            { x: 250, y: 135, t: 1150 },
          ],
          keyHoldTime: 100,
          keyInterval: 200,
          pressure: 0.5,
        },
        provenance: {
          observationIds: ['obs-1'],
          observationHash: 'abc123',
          sourceId: 'urn:vap:source:browser-extension-v1',
        },
        signature: 'test-sig',
      },
    ];
    
    const features = extractBiometricFeatures(evidence);
    expect(features).toHaveLength(12);
  });

  it('should return all values in [0, 1] range', () => {
    const evidence: Evidence[] = [
      {
        evidenceId: 'urn:vap:evidence:test-1',
        sessionId: 'urn:vap:session:test-1',
        sourceId: 'urn:vap:source:browser-extension-v1',
        timestamp: new Date().toISOString(),
        evidenceType: EvidenceType.INTERACTION,
        confidence: 0.9,
        payload: {
          mousePoints: [
            { x: 100, y: 100, t: 1000 },
            { x: 150, y: 120, t: 1050 },
            { x: 200, y: 130, t: 1100 },
            { x: 250, y: 135, t: 1150 },
          ],
          keyHoldTime: 100,
          keyInterval: 200,
          pressure: 0.5,
        },
        provenance: {
          observationIds: ['obs-1'],
          observationHash: 'abc123',
          sourceId: 'urn:vap:source:browser-extension-v1',
        },
        signature: 'test-sig',
      },
    ];
    
    const features = extractBiometricFeatures(evidence);
    for (const f of features) {
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThanOrEqual(1);
    }
  });

  it('should handle empty evidence array', () => {
    const features = extractBiometricFeatures([]);
    expect(features).toHaveLength(12);
    // All features should be 0 for empty evidence
    for (const f of features) {
      expect(f).toBe(0);
    }
  });

  it('should handle evidence without biometric data', () => {
    const evidence: Evidence[] = [
      {
        evidenceId: 'urn:vap:evidence:test-1',
        sessionId: 'urn:vap:session:test-1',
        sourceId: 'urn:vap:source:browser-extension-v1',
        timestamp: new Date().toISOString(),
        evidenceType: EvidenceType.INTERACTION,
        confidence: 0.9,
        payload: {
          avgScrollVelocity: 150,
          scrollDirectionChanges: 3,
        },
        provenance: {
          observationIds: ['obs-1'],
          observationHash: 'abc123',
          sourceId: 'urn:vap:source:browser-extension-v1',
        },
        signature: 'test-sig',
      },
    ];
    
    const features = extractBiometricFeatures(evidence);
    expect(features).toHaveLength(12);
    // All biometric features should be 0 when no biometric data provided
    for (const f of features) {
      expect(f).toBe(0);
    }
  });

  it('should compute mouse velocity from mousePoints', () => {
    const evidence: Evidence[] = [
      {
        evidenceId: 'urn:vap:evidence:test-1',
        sessionId: 'urn:vap:session:test-1',
        sourceId: 'urn:vap:source:browser-extension-v1',
        timestamp: new Date().toISOString(),
        evidenceType: EvidenceType.INTERACTION,
        confidence: 0.9,
        payload: {
          mousePoints: [
            { x: 0, y: 0, t: 0 },
            { x: 100, y: 0, t: 50 }, // 100px in 50ms = 2000 px/s
            { x: 200, y: 0, t: 100 }, // 100px in 50ms = 2000 px/s
          ],
        },
        provenance: {
          observationIds: ['obs-1'],
          observationHash: 'abc123',
          sourceId: 'urn:vap:source:browser-extension-v1',
        },
        signature: 'test-sig',
      },
    ];
    
    const features = extractBiometricFeatures(evidence);
    // mouse_velocity_mean is index 0
    expect(features[0]).toBeGreaterThan(0);
  });

  it('should compute keystroke dynamics', () => {
    const evidence: Evidence[] = [
      {
        evidenceId: 'urn:vap:evidence:test-1',
        sessionId: 'urn:vap:session:test-1',
        sourceId: 'urn:vap:source:browser-extension-v1',
        timestamp: new Date().toISOString(),
        evidenceType: EvidenceType.INTERACTION,
        confidence: 0.9,
        payload: {
          keyHoldTime: 120,
          keyInterval: 250,
          keyTimestamp: 1000,
        },
        provenance: {
          observationIds: ['obs-1'],
          observationHash: 'abc123',
          sourceId: 'urn:vap:source:browser-extension-v1',
        },
        signature: 'test-sig',
      },
    ];
    
    const features = extractBiometricFeatures(evidence);
    // key_hold_time_mean is index 5
    // key_interval_mean is index 7
    expect(features[5]).toBeGreaterThan(0);
    expect(features[7]).toBeGreaterThan(0);
  });

  it('should compute pressure dynamics', () => {
    const evidence: Evidence[] = [
      {
        evidenceId: 'urn:vap:evidence:test-1',
        sessionId: 'urn:vap:session:test-1',
        sourceId: 'urn:vap:source:browser-extension-v1',
        timestamp: new Date().toISOString(),
        evidenceType: EvidenceType.INTERACTION,
        confidence: 0.9,
        payload: {
          pressures: [0.3, 0.5, 0.7, 0.6, 0.4],
        },
        provenance: {
          observationIds: ['obs-1'],
          observationHash: 'abc123',
          sourceId: 'urn:vap:source:browser-extension-v1',
        },
        signature: 'test-sig',
      },
    ];
    
    const features = extractBiometricFeatures(evidence);
    // pressure_mean is index 9
    // pressure_std is index 10
    // pressure_change_rate is index 11
    expect(features[9]).toBeGreaterThan(0);
    expect(features[10]).toBeGreaterThan(0);
    expect(features[11]).toBeGreaterThan(0);
  });

  it('should compute mouse curvature', () => {
    // Straight line (low curvature)
    const straightEvidence: Evidence[] = [
      {
        evidenceId: 'urn:vap:evidence:test-1',
        sessionId: 'urn:vap:session:test-1',
        sourceId: 'urn:vap:source:browser-extension-v1',
        timestamp: new Date().toISOString(),
        evidenceType: EvidenceType.INTERACTION,
        confidence: 0.9,
        payload: {
          mousePoints: [
            { x: 0, y: 0, t: 0 },
            { x: 100, y: 0, t: 50 },
            { x: 200, y: 0, t: 100 },
            { x: 300, y: 0, t: 150 },
          ],
        },
        provenance: {
          observationIds: ['obs-1'],
          observationHash: 'abc123',
          sourceId: 'urn:vap:source:browser-extension-v1',
        },
        signature: 'test-sig',
      },
    ];
    
    // Curved path (higher curvature)
    const curvedEvidence: Evidence[] = [
      {
        evidenceId: 'urn:vap:evidence:test-2',
        sessionId: 'urn:vap:session:test-2',
        sourceId: 'urn:vap:source:browser-extension-v1',
        timestamp: new Date().toISOString(),
        evidenceType: EvidenceType.INTERACTION,
        confidence: 0.9,
        payload: {
          mousePoints: [
            { x: 0, y: 0, t: 0 },
            { x: 50, y: 50, t: 50 },
            { x: 100, y: 0, t: 100 },
            { x: 150, y: -50, t: 150 },
          ],
        },
        provenance: {
          observationIds: ['obs-2'],
          observationHash: 'def456',
          sourceId: 'urn:vap:source:browser-extension-v1',
        },
        signature: 'test-sig',
      },
    ];
    
    const straightFeatures = extractBiometricFeatures(straightEvidence);
    const curvedFeatures = extractBiometricFeatures(curvedEvidence);
    
    // mouse_curvature is index 4
    expect(curvedFeatures[4]).toBeGreaterThanOrEqual(straightFeatures[4]);
  });
});

describe('BIOMETRIC_FEATURE_NAMES', () => {
  it('should have 12 feature names', () => {
    expect(BIOMETRIC_FEATURE_NAMES).toHaveLength(12);
  });

  it('should match expected order', () => {
    expect(BIOMETRIC_FEATURE_NAMES[0]).toBe('mouse_velocity_mean');
    expect(BIOMETRIC_FEATURE_NAMES[4]).toBe('mouse_curvature');
    expect(BIOMETRIC_FEATURE_NAMES[5]).toBe('key_hold_time_mean');
    expect(BIOMETRIC_FEATURE_NAMES[9]).toBe('pressure_mean');
    expect(BIOMETRIC_FEATURE_NAMES[11]).toBe('pressure_change_rate');
  });
});