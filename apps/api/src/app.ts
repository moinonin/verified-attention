/**
 * HTTP application entrypoint for the VAE API service (Sprint 3 skeleton).
 *
 * Sprint 3 wires only the Session routes; later sprints add Evidence,
 * Proof, Verification, Policy. The Node http server is a thin adapter
 * around matchSessionRoute.
 */

import http, { type IncomingMessage, type ServerResponse } from 'node:http';
import { matchSessionRoute, type HttpMethod } from './sessions/router';
import { SessionController } from './sessions/controller';

export interface ApiServer {
  listen(port: number, host?: string): void;
  close(): Promise<void>;
}

export function createServer(controller: SessionController = new SessionController()): ApiServer {
  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url ?? '/';
    const method = (req.method ?? 'GET').toUpperCase() as HttpMethod;

    let body: unknown = undefined;
    if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      const raw = Buffer.concat(chunks).toString('utf8');
      if (raw) {
        try { body = JSON.parse(raw); } catch { body = undefined; }
      }
    }

    const response = matchSessionRoute({ method, path: url, body }, controller);
    res.statusCode = response.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response.body));
  });

  return {
    listen(port, host = '0.0.0.0') {
      server.listen(port, host);
    },
    close() {
      return new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    }
  };
}
