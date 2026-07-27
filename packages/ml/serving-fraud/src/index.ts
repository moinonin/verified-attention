/**
 * Fraud Model Serving App
 *
 * Provides HTTP and gRPC-style predict endpoints for the fraud ensemble model.
 * Uses Node.js built-in http for zero external dependencies.
 *
 * @module @verified-attention/ml-serving-fraud
 */

import type { Server } from 'node:http';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { predictFraud, type FraudFeatures, type FraudPrediction } from '@verified-attention/ml-fraud-ensemble';

/**
 * Predict request payload
 */
export interface PredictRequest {
  features: FraudFeatures;
  modelVersion?: string;
}

/**
 * Predict response payload
 */
export interface PredictResponse {
  fraudScore: number;
  isFraud: boolean;
  riskLevel: string;
  logit: number;
  topSignals: string[];
  modelVersion: string;
  timestamp: string;
}

/**
 * Server config
 */
export interface ServingConfig {
  port: number;
  host: string;
  modelVersion: string;
}

export const DEFAULT_SERVING_CONFIG: ServingConfig = {
  port: 8080,
  host: '0.0.0.0',
  modelVersion: '0.1.0-dev',
};

/**
 * Convert FraudPrediction to PredictResponse
 */
function toPredictResponse(pred: FraudPrediction, modelVersion: string): PredictResponse {
  return {
    fraudScore: pred.fraudScore,
    isFraud: pred.isFraud,
    riskLevel: pred.riskLevel,
    logit: pred.logit,
    topSignals: pred.topSignals,
    modelVersion,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Parse JSON body from request
 */
function parseJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1024 * 1024) { // 1MB limit
        reject(new Error('Body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

/**
 * Handle /predict endpoint
 */
async function handlePredict(
  req: IncomingMessage,
  res: ServerResponse,
  config: ServingConfig
): Promise<void> {
  try {
    const body = await parseJsonBody(req) as PredictRequest;
    if (!body.features) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing features field' }));
      return;
    }

    const prediction = predictFraud(body.features);
    const response = toPredictResponse(prediction, config.modelVersion);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }));
  }
}

/**
 * Handle /predict/batch endpoint
 */
async function handlePredictBatch(
  req: IncomingMessage,
  res: ServerResponse,
  config: ServingConfig
): Promise<void> {
  try {
    const body = await parseJsonBody(req) as { features: FraudFeatures[] };
    if (!body.features || !Array.isArray(body.features)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing features array' }));
      return;
    }

    const predictions = body.features.map(f => toPredictResponse(predictFraud(f), config.modelVersion));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ predictions }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }));
  }
}

/**
 * Handle /health endpoint
 */
function handleHealth(res: ServerResponse, config: ServingConfig): void {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'healthy',
    model: 'fraud-ensemble',
    version: config.modelVersion,
    uptime: process.uptime(),
  }));
}

/**
 * Create and return the prediction server (without starting it)
 */
export function createPredictionServer(config: Partial<ServingConfig> = {}) {
  const cfg = { ...DEFAULT_SERVING_CONFIG, ...config };

  const server = createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'POST' && url.pathname === '/predict') {
      await handlePredict(req, res, cfg);
    } else if (req.method === 'POST' && url.pathname === '/predict/batch') {
      await handlePredictBatch(req, res, cfg);
    } else if (req.method === 'GET' && url.pathname === '/health') {
      handleHealth(res, cfg);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found', path: url.pathname }));
    }
  });

  return { server, config: cfg };
}

/**
 * Start the serving server
 */
export function startServer(config: Partial<ServingConfig> = {}): Promise<{ server: Server; port: number }> {
  const { server, config: cfg } = createPredictionServer(config);

  return new Promise((resolve) => {
    server.listen(cfg.port, cfg.host, () => {
      resolve({ server, port: cfg.port });
    });
  });
}

/**
 * Stop the serving server
 */
export function stopServer(server: Server): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

export default {
  createPredictionServer,
  startServer,
  stopServer,
  DEFAULT_SERVING_CONFIG,
};
