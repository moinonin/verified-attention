import { describe, it, expect, afterEach } from 'vitest';
import { createPredictionServer, startServer, stopServer, DEFAULT_SERVING_CONFIG, type PredictRequest } from './index.js';
import type { FraudFeatures } from '@verified-attention/ml-fraud-ensemble';
import type { Server } from 'node:http';

function fetchLocal(port: number, path: string, options: { method?: string; body?: unknown } = {}): Promise<{ status: number; body: unknown }> {
  const { method = 'GET', body } = options;
  return new Promise((resolve, reject) => {
    const req = httpModule.request(
      { host: '127.0.0.1', port, path, method, headers: { 'Content-Type': 'application/json' } },
      (res) => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          try { resolve({ status: res.statusCode || 0, body: JSON.parse(data) }); } catch { resolve({ status: res.statusCode || 0, body: data }); }
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

import * as httpModule from 'node:http';

const legitimateFeatures: FraudFeatures = {
  biometricAnomalyScore: 0.05, biometricConfidence: 0.9, fingerprintEntropy: 22, fingerprintKnown: false,
  fingerprintMatchScore: 0.05, automationScore: 0.02, automationConfidence: 0.95, isAutomated: false,
  sybilRiskScore: 0.05, sybilClusterSize: 1, inSybilCluster: false, deviceReputation: 0.6,
  ipReputation: 0.5, reputationRiskScore: 0.1, evidenceCount: 15, sessionDuration: 300000, velocityScore: 0.05,
};

const fraudFeatures: FraudFeatures = {
  biometricAnomalyScore: 0.9, biometricConfidence: 0.3, fingerprintEntropy: 15, fingerprintKnown: true,
  fingerprintMatchScore: 0.85, automationScore: 0.92, automationConfidence: 0.98, isAutomated: true,
  sybilRiskScore: 0.9, sybilClusterSize: 50, inSybilCluster: true, deviceReputation: -0.85,
  ipReputation: -0.75, reputationRiskScore: 0.9, evidenceCount: 2, sessionDuration: 5000, velocityScore: 0.9,
};

let testServer: Server | null = null;

afterEach(async () => {
  if (testServer) {
    await stopServer(testServer);
    testServer = null;
  }
});

describe('Fraud Serving App', () => {
  it('should respond to /health', async () => {
    const { server, port } = await startServer({ port: 0, host: '127.0.0.1' });
    testServer = server;
    // Get actual port listened
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : port;
    const res = await fetchLocal(actualPort, '/health');
    expect(res.status).toBe(200);
    expect((res.body as { status: string }).status).toBe('healthy');
  });

  it('should serve /predict for legitimate session', async () => {
    const { server, port } = await startServer({ port: 0, host: '127.0.0.1' });
    testServer = server;
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : port;
    const req: PredictRequest = { features: legitimateFeatures };
    const res = await fetchLocal(actualPort, '/predict', { method: 'POST', body: req });
    expect(res.status).toBe(200);
    const pred = res.body as { fraudScore: number; isFraud: boolean };
    expect(pred.fraudScore).toBeGreaterThanOrEqual(0);
    expect(pred.fraudScore).toBeLessThanOrEqual(1);
    expect(pred.isFraud).toBe(false);
  });

  it('should serve /predict for fraud session', async () => {
    const { server, port } = await startServer({ port: 0, host: '127.0.0.1' });
    testServer = server;
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : port;
    const req: PredictRequest = { features: fraudFeatures };
    const res = await fetchLocal(actualPort, '/predict', { method: 'POST', body: req });
    expect(res.status).toBe(200);
    const pred = res.body as { fraudScore: number; isFraud: boolean };
    expect(pred.isFraud).toBe(true);
    expect(pred.fraudScore).toBeGreaterThan(0.5);
  });

  it('should serve /predict/batch', async () => {
    const { server, port } = await startServer({ port: 0, host: '127.0.0.1' });
    testServer = server;
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : port;
    const res = await fetchLocal(actualPort, '/predict/batch', { method: 'POST', body: { features: [legitimateFeatures, fraudFeatures] } });
    expect(res.status).toBe(200);
    const body = res.body as { predictions: { isFraud: boolean }[] };
    expect(body.predictions).toHaveLength(2);
    expect(body.predictions[0].isFraud).toBe(false);
    expect(body.predictions[1].isFraud).toBe(true);
  });

  it('should return 400 on missing features', async () => {
    const { server, port } = await startServer({ port: 0, host: '127.0.0.1' });
    testServer = server;
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : port;
    const res = await fetchLocal(actualPort, '/predict', { method: 'POST', body: {} });
    expect(res.status).toBe(400);
  });

  it('should return model version in response', async () => {
    const { server, port } = await startServer({ port: 0, host: '127.0.0.1', modelVersion: 'test-v1' });
    testServer = server;
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : port;
    const res = await fetchLocal(actualPort, '/predict', { method: 'POST', body: { features: legitimateFeatures } });
    expect((res.body as { modelVersion: string }).modelVersion).toBe('test-v1');
  });

  it('should be deterministic (same input -> same score)', async () => {
    const req: PredictRequest = { features: legitimateFeatures };
    const { server, port } = await startServer({ port: 0, host: '127.0.0.1' });
    testServer = server;
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : port;
    const res1 = await fetchLocal(actualPort, '/predict', { method: 'POST', body: req });
    const res2 = await fetchLocal(actualPort, '/predict', { method: 'POST', body: req });
    const score1 = (res1.body as { fraudScore: number }).fraudScore;
    const score2 = (res2.body as { fraudScore: number }).fraudScore;
    expect(score1).toBe(score2);
  });
});
