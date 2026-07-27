/**
 * Public entrypoint for @verified-attention/api (Sprint 3).
 */

export { createServer, type ApiServer } from './app';
export { SessionController, type HttpResponse } from './sessions/controller';
export { SessionStore, SessionNotFoundError, InvalidTransitionError } from './sessions/store';
export { matchSessionRoute, type RouteRequest, type HttpMethod } from './sessions/router';
