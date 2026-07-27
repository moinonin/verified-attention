import { describe, it, expect } from 'vitest';
import { fingerprintDevice, getFingerprintFeatureNames, validateFingerprintResult, type FingerprintResult } from './index.js';
import type { Evidence } from '@verified-attention/core';
import { EvidenceType } from '@verified-attention/core';

function createContextEvidence(overrides: Partial<Evidence> = {}): Evidence {
  return {
    evidenceId: 'urn:vap:evidence:test-context',
    sessionId: 'urn:vap:session:test-1',
    sourceId: 'urn:vap:source:browser-extension-v1',
    timestamp: new Date().toISOString(),
    evidenceType: EvidenceType.CONTEXT,
    confidence: 0.9,
    payload: {
      platform: 'Win32',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      viewportSize: { width: 1920, height: 1080 },
      deviceMemory: 8,
      hardwareConcurrency: 8,
      colorDepth: 24,
      timezone: 'America/Los_Angeles',
      ...overrides.payload,
    },
    provenance: {
      observationIds: ['obs-1'],
      observationHash: 'abc123',
      sourceId: 'urn:vap:source:browser-extension-v1',
    },
    signature: 'test-sig',
    ...overrides,
  };
}

describe('fingerprintDevice', () => {
  it('should produce fingerprint and entropy', () => {
    const evidence = [createContextEvidence()];
    const result = fingerprintDevice(evidence);
    
    expect(result).toHaveProperty('fingerprint');
    expect(result).toHaveProperty('entropy');
    expect(result).toHaveProperty('components');
    expect(result.entropy).toBeGreaterThanOrEqual(0);
  });

  it('should produce entropy >= 18 bits for rich client data', () => {
    const evidence = [createContextEvidence()];
    const result = fingerprintDevice(evidence);
    
    // With full client data, entropy should be >= 18 bits
    expect(result.entropy).toBeGreaterThanOrEqual(18);
  });

  it('should produce same fingerprint for same input (deterministic)', () => {
    const evidence = [createContextEvidence()];
    const result1 = fingerprintDevice(evidence);
    const result2 = fingerprintDevice(evidence);
    
    expect(result1.fingerprint).toBe(result2.fingerprint);
    expect(result1.entropy).toBe(result2.entropy);
  });

  it('should produce different fingerprints for different devices', () => {
    const evidence1 = [createContextEvidence({ payload: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })];
    const evidence2 = [createContextEvidence({ payload: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)' } })];
    
    const result1 = fingerprintDevice(evidence1);
    const result2 = fingerprintDevice(evidence2);
    
    expect(result1.fingerprint).not.toBe(result2.fingerprint);
  });

  it('should handle empty evidence array', () => {
    const result = fingerprintDevice([]);
    
    expect(result).toHaveProperty('fingerprint');
    expect(result).toHaveProperty('entropy');
    expect(result.entropy).toBeGreaterThanOrEqual(0);
  });

  it('should handle evidence without device context', () => {
    const evidence: Evidence = {
      evidenceId: 'urn:vap:evidence:test-interaction-1',
      sessionId: 'urn:vap:session:test-1',
      sourceId: 'urn:vap:source:browser-extension-v1',
      timestamp: new Date().toISOString(),
      evidenceType: EvidenceType.INTERACTION,
      confidence: 0.9,
      payload: {
        avgScrollVelocity: 150,
        scrollDirectionChanges: 3,
        clickCount: 2,
        keyPressCount: 10,
        interactionDurationMs: 120000,
        engagementScore: 0.85,
      },
      provenance: {
        observationIds: ['obs-1'],
        observationHash: 'abc123',
        sourceId: 'urn:vap:source:browser-extension-v1',
      },
      signature: 'test-sig',
    };
    
    const result = fingerprintDevice([evidence]);
    
    expect(result).toHaveProperty('fingerprint');
    expect(result).toHaveProperty('entropy');
    // Should still generate a fingerprint, just with lower entropy
  });
});

describe('getFingerprintFeatureNames', () => {
  it('should return array of feature names', () => {
    const names = getFingerprintFeatureNames();
    
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(0);
  });

  it('should include expected component names', () => {
    const names = getFingerprintFeatureNames();
    
    expect(names).toContain('userAgent');
    expect(names).toContain('screenResolution');
    expect(names).toContain('canvasHash');
    expect(names).toContain('webglHash');
    expect(names).toContain('audioHash');
    expect(names).toContain('batteryInfo');
  });
});

describe('validateFingerprintResult', () => {
  it('should return true for valid result', () => {
    const validResult: FingerprintResult = {
      fingerprint: 'abc123',
      entropy: 20.5,
      components: {
        userAgent: 'test',
        screenResolution: '1920x1080',
        colorDepth: 24,
        timezone: 'UTC',
        language: 'en-US',
        platform: 'Win32',
        hardwareConcurrency: 8,
        deviceMemory: 8,
        canvasHash: 'canvas123',
        webglHash: 'webgl123',
        audioHash: 'audio123',
        batteryInfo: 'level:0.8_charging:false',
        plugins: 'none',
        fonts: 'Arial',
        touchSupport: false,
        cookieEnabled: true,
        doNotTrack: 'unspecified',
      },
    };
    
    expect(validateFingerprintResult(validResult)).toBe(true);
  });

  it('should return false for missing fingerprint', () => {
    const invalidResult = {
      entropy: 20.5,
      components: {},
    } as unknown as FingerprintResult;
    
    expect(validateFingerprintResult(invalidResult)).toBe(false);
  });

  it('should return false for empty fingerprint', () => {
    const invalidResult: FingerprintResult = {
      fingerprint: '',
      entropy: 20.5,
      components: {
        userAgent: 'test',
        screenResolution: '1920x1080',
        colorDepth: 24,
        timezone: 'UTC',
        language: 'en-US',
        platform: 'Win32',
        hardwareConcurrency: 8,
        deviceMemory: 8,
        canvasHash: 'canvas123',
        webglHash: 'webgl123',
        audioHash: 'audio123',
        batteryInfo: 'level:0.8_charging:false',
        plugins: 'none',
        fonts: 'Arial',
        touchSupport: false,
        cookieEnabled: true,
        doNotTrack: 'unspecified',
      },
    };
    
    expect(validateFingerprintResult(invalidResult)).toBe(false);
  });

  it('should return false for negative entropy', () => {
    const invalidResult: FingerprintResult = {
      fingerprint: 'abc123',
      entropy: -5,
      components: {
        userAgent: 'test',
        screenResolution: '1920x1080',
        colorDepth: 24,
        timezone: 'UTC',
        language: 'en-US',
        platform: 'Win32',
        hardwareConcurrency: 8,
        deviceMemory: 8,
        canvasHash: 'canvas123',
        webglHash: 'webgl123',
        audioHash: 'audio123',
        batteryInfo: 'level:0.8_charging:false',
        plugins: 'none',
        fonts: 'Arial',
        touchSupport: false,
        cookieEnabled: true,
        doNotTrack: 'unspecified',
      },
    };
    
    expect(validateFingerprintResult(invalidResult)).toBe(false);
  });
});
