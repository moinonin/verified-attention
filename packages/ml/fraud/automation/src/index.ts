/**
 * Automation Detection
 * 
 * Detects browser automation tools: headless Chrome, Puppeteer, Selenium, Playwright
 * Target: ≥ 99% detection rate on known tools
 * 
 * @module @verified-attention/ml-fraud-automation
 */

import type { Evidence } from '@verified-attention/core';

/**
 * Automation detection result
 */
export interface AutomationDetectionResult {
  isAutomated: boolean;
  confidence: number;
  detectedTools: string[];
  signals: AutomationSignal[];
}

/**
 * Individual automation signal
 */
export interface AutomationSignal {
  name: string;
  detected: boolean;
  confidence: number;
  details?: Record<string, unknown>;
}

/**
 * Extended Window interface for automation detection properties
 */
interface AutomationWindow extends Window {
  chrome?: Record<string, unknown>;
  __playwright?: Record<string, unknown>;
  __selenium?: Record<string, unknown>;
  __webdriver?: Record<string, unknown>;
  __puppeteer?: Record<string, unknown>;
  __driver_evaluate?: (...args: unknown[]) => unknown;
  __webdriver_evaluate?: (...args: unknown[]) => unknown;
  __selenium_evaluate?: (...args: unknown[]) => unknown;
  __fxdriver_evaluate?: (...args: unknown[]) => unknown;
  __driver_unwrapped?: boolean;
  _pageBinding?: Record<string, unknown>;
  callPhantom?: (...args: unknown[]) => unknown;
  _phantom?: Record<string, unknown>;
  domAutomation?: boolean;
  domAutomationController?: boolean;
  webdriver?: boolean;
}

/**
 * Extended Navigator interface
 */
type AutomationNavigator = Navigator & {
  webdriver?: boolean;
};

/**
 * Extended Document interface
 */
interface AutomationDocument extends Document {
  documentElement: HTMLElement & {
    getAttribute?(name: string): string | null;
    webdriver?: boolean;
    driverName?: string;
    __selenium_evaluate?: (...args: unknown[]) => unknown;
    __webdriver_evaluate?: (...args: unknown[]) => unknown;
    __fxdriver_evaluate?: (...args: unknown[]) => unknown;
  };
  $cdc_asdjflasutopfhvcZLmcfl_?: unknown;
  $wdc_?: unknown;
}

/**
 * Client data for automation detection
 * Extracted from E-CONTEXT or E-INTERACTION evidence
 */
export interface ClientData {
  userAgent: string;
  navigator: {
    webdriver?: boolean;
    plugins?: string[];
    mimeTypes?: string[];
    languages?: string[];
    platform?: string;
    hardwareConcurrency?: number;
    deviceMemory?: number;
    maxTouchPoints?: number;
    permissions?: {
      query?: (descriptor: { name: string }) => Promise<{ state: string }>;
    };
    mediaDevices?: {
      enumerateDevices?: () => Promise<MediaDeviceInfo[]>;
    };
  };
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    availWidth?: number;
    availHeight?: number;
  };
  window: {
    outerWidth: number;
    outerHeight: number;
    innerWidth: number;
    innerHeight: number;
    devicePixelRatio: number;
    chrome?: Record<string, unknown>;
    __playwright?: Record<string, unknown>;
    __selenium?: Record<string, unknown>;
    __webdriver?: Record<string, unknown>;
    __puppeteer?: Record<string, unknown>;
    callPhantom?: (...args: unknown[]) => unknown;
    _phantom?: Record<string, unknown>;
    domAutomation?: boolean;
    domAutomationController?: boolean;
  };
  document: {
    readyState: string;
    documentElement?: {
      getAttribute?: (name: string) => string | null;
    };
  };
  console: {
    debug?: (...args: unknown[]) => unknown;
    info?: (...args: unknown[]) => unknown;
    log?: (...args: unknown[]) => unknown;
    warn?: (...args: unknown[]) => unknown;
    error?: (...args: unknown[]) => unknown;
  };
  performance: {
    timing?: {
      navigationStart?: number;
      loadEventEnd?: number;
    };
  };
  battery?: {
    charging?: boolean;
    level?: number;
  };
}

/**
 * Extract client data from evidence
 */
function extractClientData(evidence: Evidence[]): ClientData {
  const clientData: ClientData = {
    userAgent: 'unknown',
    navigator: {},
    screen: { width: 0, height: 0, colorDepth: 24 },
    window: { outerWidth: 0, outerHeight: 0, innerWidth: 0, innerHeight: 0, devicePixelRatio: 1 },
    document: { readyState: 'complete' },
    console: {},
    performance: {},
  };

  for (const e of evidence) {
    const payload = e.payload as Record<string, unknown>;

    if (e.evidenceType === 'E-CONTEXT' || e.evidenceType === 'E-INTERACTION') {
      // User agent
      if (payload.userAgent && typeof payload.userAgent === 'string') {
        clientData.userAgent = payload.userAgent;
      } else if (e.metadata && typeof e.metadata === 'object' && 'userAgent' in e.metadata && typeof (e.metadata as Record<string, unknown>).userAgent === 'string') {
        clientData.userAgent = (e.metadata as Record<string, unknown>).userAgent as string;
      }
      
      if (e.metadata && typeof e.metadata === 'object') {
        const meta = e.metadata as Record<string, unknown>;
        // Navigator properties
        if (meta.navigator && typeof meta.navigator === 'object') {
          const nav = meta.navigator as Record<string, unknown>;
          if (typeof nav.webdriver === 'boolean') clientData.navigator.webdriver = nav.webdriver;
          if (Array.isArray(nav.plugins)) clientData.navigator.plugins = nav.plugins as string[];
          if (Array.isArray(nav.mimeTypes)) clientData.navigator.mimeTypes = nav.mimeTypes as string[];
          if (Array.isArray(nav.languages)) clientData.navigator.languages = nav.languages as string[];
          if (typeof nav.platform === 'string') clientData.navigator.platform = nav.platform;
          if (typeof nav.hardwareConcurrency === 'number') clientData.navigator.hardwareConcurrency = nav.hardwareConcurrency;
          if (typeof nav.deviceMemory === 'number') clientData.navigator.deviceMemory = nav.deviceMemory;
          if (typeof nav.maxTouchPoints === 'number') clientData.navigator.maxTouchPoints = nav.maxTouchPoints;
          if (nav.permissions) clientData.navigator.permissions = nav.permissions as ClientData['navigator']['permissions'];
          if (nav.mediaDevices) clientData.navigator.mediaDevices = nav.mediaDevices as ClientData['navigator']['mediaDevices'];
        }
      }

      // Screen properties
      if (payload.screen && typeof payload.screen === 'object') {
        const screen = payload.screen as Record<string, unknown>;
        if (typeof screen.width === 'number') clientData.screen.width = screen.width;
        if (typeof screen.height === 'number') clientData.screen.height = screen.height;
        if (typeof screen.colorDepth === 'number') clientData.screen.colorDepth = screen.colorDepth;
        if (typeof screen.availWidth === 'number') clientData.screen.availWidth = screen.availWidth;
        if (typeof screen.availHeight === 'number') clientData.screen.availHeight = screen.availHeight;
      }

      // Window properties
      if (payload.window && typeof payload.window === 'object') {
        const win = payload.window as Record<string, unknown>;
        if (typeof win.outerWidth === 'number') clientData.window.outerWidth = win.outerWidth;
        if (typeof win.outerHeight === 'number') clientData.window.outerHeight = win.outerHeight;
        if (typeof win.innerWidth === 'number') clientData.window.innerWidth = win.innerWidth;
        if (typeof win.innerHeight === 'number') clientData.window.innerHeight = win.innerHeight;
        if (typeof win.devicePixelRatio === 'number') clientData.window.devicePixelRatio = win.devicePixelRatio;
        if (win.chrome) clientData.window.chrome = win.chrome as Record<string, unknown>;
        if (win.__playwright) clientData.window.__playwright = win.__playwright as Record<string, unknown>;
        if (win.__selenium) clientData.window.__selenium = win.__selenium as Record<string, unknown>;
        if (win.__webdriver) clientData.window.__webdriver = win.__webdriver as Record<string, unknown>;
        if (win.__puppeteer) clientData.window.__puppeteer = win.__puppeteer as Record<string, unknown>;
        if (typeof win.callPhantom === 'function') clientData.window.callPhantom = win.callPhantom as (...args: unknown[]) => unknown;
        if (win._phantom) clientData.window._phantom = win._phantom as Record<string, unknown>;
        if (typeof win.domAutomation === 'boolean') clientData.window.domAutomation = win.domAutomation;
        if (typeof win.domAutomationController === 'boolean') clientData.window.domAutomationController = win.domAutomationController;
      }

      // Document properties
      if (payload.document && typeof payload.document === 'object') {
        const doc = payload.document as Record<string, unknown>;
        if (typeof doc.readyState === 'string') clientData.document.readyState = doc.readyState;
        if (doc.documentElement) clientData.document.documentElement = doc.documentElement as ClientData['document']['documentElement'];
      }

      // Console
      if (payload.console && typeof payload.console === 'object') {
        clientData.console = payload.console as ClientData['console'];
      }

      // Performance
      if (payload.performance && typeof payload.performance === 'object') {
        clientData.performance = payload.performance as ClientData['performance'];
      }

      // Battery
      if (payload.battery && typeof payload.battery === 'object') {
        clientData.battery = payload.battery as ClientData['battery'];
      }
    }
  }

  return clientData;
}

/**
 * Check navigator.webdriver property
 */
function checkWebdriverProperty(data: ClientData): AutomationSignal {
  const detected = data.navigator.webdriver === true;
  return {
    name: 'navigator.webdriver',
    detected,
    confidence: detected ? 0.95 : 0,
    details: detected ? { value: true, tool: 'Selenium/WebDriver' } : undefined,
  };
}

/**
 * Check window properties for automation tools
 */
function checkWindowProperties(data: ClientData): AutomationSignal[] {
  const signals: AutomationSignal[] = [];
  const win = data.window;

  // Chrome DevTools Protocol / Puppeteer
  if (win.chrome && typeof win.chrome === 'object' && Object.keys(win.chrome).length === 0) {
    signals.push({
      name: 'window.chrome empty object',
      detected: true,
      confidence: 0.7,
      details: { tool: 'Puppeteer/Chrome headless' },
    });
  }

  // Playwright
  if (win.__playwright) {
    signals.push({
      name: 'window.__playwright',
      detected: true,
      confidence: 0.99,
      details: { tool: 'Playwright' },
    });
  }

  // Selenium
  if ('__selenium' in win || '__webdriver' in win || '__driver_evaluate' in win || '__webdriver_evaluate' in win || '__selenium_evaluate' in win || '__fxdriver_evaluate' in win) {
    signals.push({
      name: 'window.__selenium / __webdriver',
      detected: true,
      confidence: 0.99,
      details: { tool: 'Selenium' },
    });
  }

  // Puppeteer
  if ('__puppeteer' in win) {
    signals.push({
      name: 'window.__puppeteer',
      detected: true,
      confidence: 0.95,
      details: { tool: 'Puppeteer' },
    });
  }

  // PhantomJS
  if (typeof win.callPhantom === 'function' || '_phantom' in win) {
    signals.push({
      name: 'window.callPhantom / _phantom',
      detected: true,
      confidence: 0.9,
      details: { tool: 'PhantomJS' },
    });
  }

  // Generic webdriver
  if ('_pageBinding' in win || '__driver_unwrapped' in win) {
    signals.push({
      name: 'window._pageBinding / __driver_unwrapped',
      detected: true,
      confidence: 0.85,
      details: { tool: 'Generic WebDriver' },
    });
  }

  // domAutomation (older Chrome headless)
  if (win.domAutomation || win.domAutomationController) {
    signals.push({
      name: 'window.domAutomation',
      detected: true,
      confidence: 0.8,
      details: { tool: 'Chrome headless (legacy)' },
    });
  }

  // If no signals detected, add a negative signal
  if (signals.length === 0) {
    signals.push({
      name: 'window.automation_properties',
      detected: false,
      confidence: 0,
    });
  }

  return signals;
}

/**
 * Check user agent for automation indicators
 */
function checkUserAgent(data: ClientData): AutomationSignal {
  const ua = data.userAgent.toLowerCase();
  let detected = false;
  let confidence = 0;
  let tool = 'Unknown';

  // Headless Chrome
  if (ua.includes('headless') || ua.includes('headlesschrome')) {
    detected = true;
    confidence = 0.9;
    tool = 'Chrome Headless';
  }
  // PhantomJS
  else if (ua.includes('phantomjs')) {
    detected = true;
    confidence = 0.95;
    tool = 'PhantomJS';
  }
  // Selenium standalone server
  else if (ua.includes('selenium') || ua.includes('webdriver')) {
    detected = true;
    confidence = 0.85;
    tool = 'Selenium';
  }

  return {
    name: 'userAgent automation indicators',
    detected,
    confidence,
    details: detected ? { tool, userAgent: data.userAgent } : undefined,
  };
}

/**
 * Check navigator properties
 */
function checkNavigatorProperties(data: ClientData): AutomationSignal[] {
  const signals: AutomationSignal[] = [];
  const nav = data.navigator;

  // No plugins (common in headless)
  if (nav.plugins && nav.plugins.length === 0) {
    signals.push({
      name: 'navigator.plugins empty',
      detected: true,
      confidence: 0.4,
      details: { tool: 'Possible headless' },
    });
  }

  // No mime types
  if (nav.mimeTypes && nav.mimeTypes.length === 0) {
    signals.push({
      name: 'navigator.mimeTypes empty',
      detected: true,
      confidence: 0.3,
      details: { tool: 'Possible headless' },
    });
  }

  // Single language (headless often has minimal language config)
  if (nav.languages && nav.languages.length === 1 && nav.languages[0] === 'en-US') {
    signals.push({
      name: 'navigator.languages minimal',
      detected: true,
      confidence: 0.25,
      details: { tool: 'Possible headless' },
    });
  }

  // No hardware concurrency reported
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 1) {
    signals.push({
      name: 'navigator.hardwareConcurrency low',
      detected: true,
      confidence: 0.2,
      details: { tool: 'Possible headless/CI' },
    });
  }

  // No device memory
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 1) {
    signals.push({
      name: 'navigator.deviceMemory low',
      detected: true,
      confidence: 0.15,
      details: { tool: 'Possible headless/CI' },
    });
  }

  // No touch points on mobile UA
  if (nav.maxTouchPoints !== undefined && nav.maxTouchPoints === 0) {
    const ua = data.userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      signals.push({
        name: 'navigator.maxTouchPoints zero on mobile UA',
        detected: true,
        confidence: 0.6,
        details: { tool: 'Possible emulator/headless mobile' },
      });
    }
  }

  if (signals.length === 0) {
    signals.push({
      name: 'navigator.properties',
      detected: false,
      confidence: 0,
    });
  }

  return signals;
}

/**
 * Check screen properties
 */
function checkScreenProperties(data: ClientData): AutomationSignal[] {
  const signals: AutomationSignal[] = [];
  const screen = data.screen;

  // Zero dimensions (headless without virtual display)
  if (screen.width === 0 && screen.height === 0) {
    signals.push({
      name: 'screen dimensions zero',
      detected: true,
      confidence: 0.85,
      details: { tool: 'Headless without virtual display' },
    });
  }

  // Very small dimensions (CI environments)
  if (screen.width > 0 && screen.width < 400 && screen.height > 0 && screen.height < 300) {
    signals.push({
      name: 'screen dimensions very small',
      detected: true,
      confidence: 0.6,
      details: { tool: 'Possible CI/headless' },
    });
  }

  // Color depth too low
  if (screen.colorDepth < 16) {
    signals.push({
      name: 'screen colorDepth too low',
      detected: true,
      confidence: 0.4,
      details: { tool: 'Possible headless' },
    });
  }

  // Available screen equals actual screen (no OS chrome)
  if (screen.availWidth !== undefined && screen.availHeight !== undefined &&
      screen.availWidth === screen.width && screen.availHeight === screen.height) {
    signals.push({
      name: 'screen.avail equals screen (no OS chrome)',
      detected: true,
      confidence: 0.3,
      details: { tool: 'Possible headless/VM' },
    });
  }

  if (signals.length === 0) {
    signals.push({
      name: 'screen.properties',
      detected: false,
      confidence: 0,
    });
  }

  return signals;
}

/**
 * Check document properties
 */
function checkDocumentProperties(data: ClientData): AutomationSignal[] {
  const signals: AutomationSignal[] = [];
  const doc = data.document;

  // document.readyState
  if (doc.readyState !== 'complete' && doc.readyState !== 'interactive') {
    signals.push({
      name: 'document.readyState abnormal',
      detected: true,
      confidence: 0.2,
      details: { value: doc.readyState },
    });
  }

  // document.documentElement attributes
  if (doc.documentElement) {
    const el = doc.documentElement;
    if (typeof el.getAttribute === 'function') {
      // Selenium sets these attributes
      const webdriver = el.getAttribute('webdriver');
      if (webdriver) {
        signals.push({
          name: 'document.documentElement.webdriver attribute',
          detected: true,
          confidence: 0.9,
          details: { tool: 'Selenium', attribute: 'webdriver' },
        });
      }

      const driverName = el.getAttribute('driverName');
      if (driverName) {
        signals.push({
          name: 'document.documentElement.driverName attribute',
          detected: true,
          confidence: 0.85,
          details: { tool: 'Selenium', attribute: 'driverName' },
        });
      }
    }

    // Check for special properties
    const specialProps = ['__selenium_evaluate', '__webdriver_evaluate', '__fxdriver_evaluate'];
    for (const prop of specialProps) {
      if (prop in el) {
        signals.push({
          name: `document.documentElement.${prop}`,
          detected: true,
          confidence: 0.9,
          details: { tool: 'Selenium/FirefoxDriver' },
        });
      }
    }
  }

  // Document variables used by automation tools
  const docVars = ['$cdc_asdjflasutopfhvcZLmcfl_', '$wdc_'];
  for (const v of docVars) {
    if (v in (globalThis as Record<string, unknown>)) {
      signals.push({
        name: `globalThis.${v}`,
        detected: true,
        confidence: 0.75,
        details: { tool: 'Selenium/ChromeDriver' },
      });
    }
  }

  if (signals.length === 0) {
    signals.push({
      name: 'document.properties',
      detected: false,
      confidence: 0,
    });
  }

  return signals;
}

/**
 * Check console for automation indicators
 */
function checkConsole(data: ClientData): AutomationSignal {
  const console = data.console;
  // Some automation tools override console methods
  const hasOverrides = 
    (typeof console.debug === 'function' && console.debug.toString().includes('native code') === false) ||
    (typeof console.log === 'function' && console.log.toString().includes('native code') === false);

  return {
    name: 'console method overrides',
    detected: hasOverrides,
    confidence: hasOverrides ? 0.3 : 0,
    details: hasOverrides ? { tool: 'Possible automation framework' } : undefined,
  };
}

/**
 * Check performance timing
 */
function checkPerformanceTiming(data: ClientData): AutomationSignal {
  const timing = data.performance.timing;
  
  if (!timing || !timing.navigationStart || !timing.loadEventEnd) {
    return {
      name: 'performance.timing',
      detected: false,
      confidence: 0,
    };
  }

  const loadTime = timing.loadEventEnd - timing.navigationStart;
  
  // Extremely fast load (possible prerendering/automation)
  if (loadTime > 0 && loadTime < 50) {
    return {
      name: 'performance.timing extremely fast',
      detected: true,
      confidence: 0.4,
      details: { loadTimeMs: loadTime, tool: 'Possible prerender/automation' },
    };
  }

  // Zero or negative load time
  if (loadTime <= 0) {
    return {
      name: 'performance.timing zero/negative',
      detected: true,
      confidence: 0.5,
      details: { loadTimeMs: loadTime, tool: 'Possible headless/prerender' },
    };
  }

  return {
    name: 'performance.timing',
    detected: false,
    confidence: 0,
  };
}

/**
 * Check battery API
 */
function checkBattery(data: ClientData): AutomationSignal {
  const battery = data.battery;
  
  if (!battery) {
    return {
      name: 'battery API unavailable',
      detected: false,
      confidence: 0,
    };
  }

  // Battery at exactly 100% and charging (common in VMs/headless)
  if (battery.level === 1 && battery.charging === true) {
    return {
      name: 'battery at 100% and charging',
      detected: true,
      confidence: 0.3,
      details: { tool: 'Possible VM/headless', level: battery.level, charging: battery.charging },
    };
  }

  // No battery (desktop) but battery API present
  if (battery.level === 0 && battery.charging === false) {
    return {
      name: 'battery missing (desktop)',
      detected: false,
      confidence: 0,
    };
  }

  return {
    name: 'battery API',
    detected: false,
    confidence: 0,
  };
}

/**
 * Check permissions API
 */
async function checkPermissions(data: ClientData): Promise<AutomationSignal> {
  if (!data.navigator.permissions?.query) {
    return {
      name: 'permissions API',
      detected: false,
      confidence: 0,
    };
  }

  try {
    // Automation often denies notifications permission by default
    const result = await data.navigator.permissions.query({ name: 'notifications' });
    if (result.state === 'denied') {
      return {
        name: 'permissions.notifications denied',
        detected: true,
        confidence: 0.25,
        details: { tool: 'Possible automation/CI' },
      };
    }
  } catch {
    // Ignore errors
  }

  return {
    name: 'permissions API',
    detected: false,
    confidence: 0,
  };
}

/**
 * Check media devices
 */
async function checkMediaDevices(data: ClientData): Promise<AutomationSignal> {
  if (!data.navigator.mediaDevices?.enumerateDevices) {
    return {
      name: 'mediaDevices API',
      detected: false,
      confidence: 0,
    };
  }

  try {
    const devices = await data.navigator.mediaDevices.enumerateDevices();
    // Headless often has no media devices
    if (devices.length === 0) {
      return {
        name: 'mediaDevices empty',
        detected: true,
        confidence: 0.4,
        details: { tool: 'Possible headless', deviceCount: 0 },
      };
    }
  } catch {
    // Ignore errors
  }

  return {
    name: 'mediaDevices API',
    detected: false,
    confidence: 0,
  };
}

/**
 * Main automation detection function
 * Extracts client data from evidence and runs all detection checks
 */
export async function detectAutomation(evidence: Evidence[]): Promise<AutomationDetectionResult> {
  const clientData = extractClientData(evidence);
  return detectAutomationFromClientData(clientData);
}

/**
 * Quick detection from pre-extracted client data (for testing)
 */
export async function detectAutomationFromClientData(clientData: ClientData): Promise<AutomationDetectionResult> {
  const allSignals: AutomationSignal[] = [];
  const detectedTools: string[] = [];

  // Synchronous checks
  allSignals.push(checkWebdriverProperty(clientData));
  allSignals.push(...checkWindowProperties(clientData));
  allSignals.push(checkUserAgent(clientData));
  allSignals.push(...checkNavigatorProperties(clientData));
  allSignals.push(...checkScreenProperties(clientData));
  allSignals.push(...checkDocumentProperties(clientData));
  allSignals.push(checkConsole(clientData));
  allSignals.push(checkPerformanceTiming(clientData));
  allSignals.push(checkBattery(clientData));

  // Asynchronous checks
  const permissionsSignal = await checkPermissions(clientData);
  allSignals.push(permissionsSignal);

  const mediaSignal = await checkMediaDevices(clientData);
  allSignals.push(mediaSignal);

  // Filter detected signals
  const detectedSignals = allSignals.filter(s => s.detected);
  
  // Calculate confidence
  const highConfidenceSignals = detectedSignals.filter(s => s.confidence >= 0.7);
  const mediumConfidenceSignals = detectedSignals.filter(s => s.confidence >= 0.4 && s.confidence < 0.7);
  const lowConfidenceSignals = detectedSignals.filter(s => s.confidence > 0 && s.confidence < 0.4);

  // Determine if automated
  // High confidence signal = automated
  // 2+ medium confidence = automated  
  // 4+ low confidence = automated
  const isAutomated = highConfidenceSignals.length > 0 ||
                      mediumConfidenceSignals.length >= 2 ||
                      lowConfidenceSignals.length >= 4 ||
                      detectedSignals.length >= 5;

  // Overall confidence
  let confidence: number;
  if (isAutomated) {
    const maxConf = Math.max(...detectedSignals.map(s => s.confidence));
    const avgConf = detectedSignals.reduce((sum, s) => sum + s.confidence, 0) / detectedSignals.length;
    confidence = Math.min(0.99, (maxConf + avgConf) / 2 + 0.1);
  } else {
    // Confidence in NOT being automated
    const maxConf = allSignals.length > 0 ? Math.max(...allSignals.map(s => s.confidence)) : 0;
    confidence = 1 - maxConf * 0.5;
  }

  // Collect detected tools
  for (const signal of detectedSignals) {
    if (signal.details?.tool) {
      detectedTools.push(signal.details.tool as string);
    }
    if (signal.details?.detectedTools) {
      detectedTools.push(...(signal.details.detectedTools as string[]));
    }
  }

  return {
    isAutomated,
    confidence: Math.min(1, Math.max(0, confidence)),
    detectedTools: [...new Set(detectedTools)],
    signals: allSignals,
  };
}

export default {
  detectAutomation,
  detectAutomationFromClientData,
};