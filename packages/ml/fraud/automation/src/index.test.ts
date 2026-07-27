import { describe, it, expect } from 'vitest';
import { 
  detectAutomation, 
  detectAutomationFromClientData,
  type ClientData,
  type AutomationDetectionResult
} from './index.js';
import type { Evidence } from '@verified-attention/core';
import { EvidenceType } from '@verified-attention/core';

function createBaseClientData(overrides: Partial<ClientData> = {}): ClientData {
  return {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    navigator: {
      webdriver: false,
      plugins: ['Plugin1', 'Plugin2'],
      mimeTypes: ['type1', 'type2'],
      languages: ['en-US', 'en'],
      platform: 'MacIntel',
      hardwareConcurrency: 8,
      deviceMemory: 8,
      maxTouchPoints: 0,
    },
    screen: {
      width: 1920,
      height: 1080,
      colorDepth: 24,
      availWidth: 1920,
      availHeight: 1055,  // Different from height (taskbar takes space)
    },
    window: {
      outerWidth: 1920,
      outerHeight: 1080,
      innerWidth: 1920,
      innerHeight: 1080,
      devicePixelRatio: 1,
      chrome: { runtime: {} },
    } as any,
    document: {
      readyState: 'complete',
      documentElement: {},
    },
    console: {
      debug: () => {},
      info: () => {},
      log: () => {},
      warn: () => {},
      error: () => {},
    },
    performance: {
      timing: {
        navigationStart: Date.now() - 5000,
        loadEventEnd: Date.now(),
      },
    },
    battery: {
      charging: false,
      level: 0.85,
    },
    ...overrides,
  };
}

describe('detectAutomationFromClientData', () => {
  it('should return not automated for normal browser', async () => {
    const clientData = createBaseClientData();
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.isAutomated).toBe(false);
    expect(result.confidence).toBeGreaterThan(0.5);
    // Normal browser may have low-confidence signals but should not be classified as automated
  });

  it('should detect navigator.webdriver = true', async () => {
    const clientData = createBaseClientData({
      navigator: {
        ...createBaseClientData().navigator,
        webdriver: true,
      },
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.isAutomated).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it('should detect selenium window properties', async () => {
    const clientData = createBaseClientData({
      window: {
        ...createBaseClientData().window,
        __webdriver: {},
        __selenium: {},
      },
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.isAutomated).toBe(true);
    expect(result.detectedTools).toContain('Selenium');
  });

  it('should detect puppeteer window properties', async () => {
    const clientData = createBaseClientData({
      window: {
        ...createBaseClientData().window,
        __puppeteer: {},
      },
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.isAutomated).toBe(true);
    expect(result.detectedTools).toContain('Puppeteer');
  });

  it('should detect playwright window properties', async () => {
    const clientData = createBaseClientData({
      window: {
        ...createBaseClientData().window,
        __playwright: {},
      },
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.isAutomated).toBe(true);
    expect(result.detectedTools).toContain('Playwright');
  });

  it('should detect phantomjs window properties', async () => {
    const clientData = createBaseClientData({
      window: {
        ...createBaseClientData().window,
        callPhantom: () => {},
        _phantom: {},
      },
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.isAutomated).toBe(true);
    expect(result.detectedTools).toContain('PhantomJS');
  });

  it('should detect headless chrome via user agent', async () => {
    const clientData = createBaseClientData({
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0.0.0 Safari/537.36',
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.isAutomated).toBe(true);
    expect(result.detectedTools).toContain('Chrome Headless');
  });

  it('should detect empty plugins array', async () => {
    const clientData = createBaseClientData({
      navigator: {
        ...createBaseClientData().navigator,
        plugins: [],
      },
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.signals.some(s => s.name === 'navigator.plugins empty' && s.detected)).toBe(true);
  });

  it('should detect minimal languages', async () => {
    const clientData = createBaseClientData({
      navigator: {
        ...createBaseClientData().navigator,
        languages: ['en-US'],
      },
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.signals.some(s => s.name === 'navigator.languages minimal' && s.detected)).toBe(true);
  });

  it('should detect low hardware concurrency', async () => {
    const clientData = createBaseClientData({
      navigator: {
        ...createBaseClientData().navigator,
        hardwareConcurrency: 1,
      },
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.signals.some(s => s.name === 'navigator.hardwareConcurrency low' && s.detected)).toBe(true);
  });

  it('should detect screen/window dimension match', async () => {
    const clientData = createBaseClientData({
      screen: { width: 1920, height: 1080, colorDepth: 24, availWidth: 1920, availHeight: 1080 },
      window: { 
        ...createBaseClientData().window,
        innerWidth: 1920,
        innerHeight: 1080,
      },
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.signals.some(s => s.name === 'screen.avail equals screen (no OS chrome)' && s.detected)).toBe(true);
  });

  it('should detect console non-native methods', async () => {
    const clientData = createBaseClientData({
      console: {
        debug: function() { return 'custom'; },
        info: function() { return 'custom'; },
        log: function() { return 'custom'; },
        warn: function() { return 'custom'; },
        error: function() { return 'custom'; },
      },
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.signals.some(s => s.name === 'console method overrides' && s.detected)).toBe(true);
  });

  it('should detect perfect battery (suspicious)', async () => {
    const clientData = createBaseClientData({
      battery: {
        charging: true,
        level: 1,
      },
    });
    const result = await detectAutomationFromClientData(clientData);
    
    expect(result.signals.some(s => s.name === 'battery at 100% and charging' && s.detected)).toBe(true);
  });
});

describe('detectAutomation (from evidence)', () => {
  it('should extract client data from E-CONTEXT evidence', async () => {
    const evidence: Evidence[] = [
      {
        evidenceId: 'urn:vap:evidence:test-1',
        sessionId: 'urn:vap:session:test-1',
        sourceId: 'urn:vap:source:browser-extension-v1',
        timestamp: new Date().toISOString(),
        evidenceType: EvidenceType.CONTEXT,
        confidence: 0.9,
        payload: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          navigator: {
            webdriver: false,
            plugins: ['Plugin1'],
            languages: ['en-US'],
            platform: 'Win32',
            hardwareConcurrency: 4,
            deviceMemory: 8,
            maxTouchPoints: 0,
          },
          screen: { width: 1920, height: 1080, colorDepth: 24 },
          window: { 
            outerWidth: 1920, outerHeight: 1080, innerWidth: 1920, innerHeight: 1080, 
            devicePixelRatio: 1, chrome: { runtime: {} } 
          },
          document: { readyState: 'complete', documentElement: {} },
          console: { log: () => {} },
          performance: { timing: { navigationStart: Date.now(), loadEventEnd: Date.now() } },
          battery: { charging: false, level: 0.5 },
        },
        provenance: {
          observationIds: ['obs-1'],
          observationHash: 'hash1',
          sourceId: 'urn:vap:source:browser-extension-v1',
        },
        signature: 'sig1',
      },
    ];
    
    const result = await detectAutomation(evidence);
    
    expect(result).toHaveProperty('isAutomated');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('detectedTools');
    expect(result).toHaveProperty('signals');
    expect(Array.isArray(result.signals)).toBe(true);
  });

  it('should detect automation from E-CONTEXT evidence with webdriver', async () => {
    const evidence: Evidence[] = [
      {
        evidenceId: 'urn:vap:evidence:test-2',
        sessionId: 'urn:vap:session:test-2',
        sourceId: 'urn:vap:source:browser-extension-v1',
        timestamp: new Date().toISOString(),
        evidenceType: EvidenceType.CONTEXT,
        confidence: 0.9,
        payload: {
          navigator: {
            webdriver: true,
          },
        },
        provenance: {
          observationIds: ['obs-1'],
          observationHash: 'hash1',
          sourceId: 'urn:vap:source:browser-extension-v1',
        },
        signature: 'sig1',
      },
    ];
    
    const result = await detectAutomation(evidence);
    
    expect(result.isAutomated).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.8);
  });
});