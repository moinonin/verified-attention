import { SessionState$2 as SessionState, SessionStateSchema$3 as SessionStateSchema } from "./common-DCxousWR.mjs";
import { z } from "zod";

//#region src/session.d.ts

type SessionState$1 = z.infer<typeof SessionStateSchema>;
declare const SessionStateSchema$1: z.ZodNativeEnum<typeof SessionState>;
declare const SessionStateValue: {
  readonly CREATED: "CREATED";
  readonly ACTIVE: "ACTIVE";
  readonly EXPIRED: "EXPIRED";
  readonly VERIFIED: "VERIFIED";
  readonly CERTIFIED: "CERTIFIED";
  readonly CANCELLED: "CANCELLED";
};
/**
 * Session configuration / policy
 */
declare const SessionConfigSchema: z.ZodObject<{
  timeoutMs: z.ZodDefault<z.ZodNumber>;
  requiredEvidenceTypes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  minConfidence: z.ZodOptional<z.ZodNumber>;
  maxDurationMs: z.ZodOptional<z.ZodNumber>;
  allowedSources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
  timeoutMs: number;
  requiredEvidenceTypes?: string[] | undefined;
  minConfidence?: number | undefined;
  maxDurationMs?: number | undefined;
  allowedSources?: string[] | undefined;
}, {
  timeoutMs?: number | undefined;
  requiredEvidenceTypes?: string[] | undefined;
  minConfidence?: number | undefined;
  maxDurationMs?: number | undefined;
  allowedSources?: string[] | undefined;
}>;
type SessionConfig = z.infer<typeof SessionConfigSchema>;
/**
 * Session participant (viewer) - pseudonymized
 */
declare const SessionParticipantSchema: z.ZodObject<{
  viewerIdHash: z.ZodString;
  consentId: z.ZodOptional<z.ZodString>;
  preferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
  viewerIdHash: string;
  consentId?: string | undefined;
  preferences?: Record<string, unknown> | undefined;
}, {
  viewerIdHash: string;
  consentId?: string | undefined;
  preferences?: Record<string, unknown> | undefined;
}>;
type SessionParticipant = z.infer<typeof SessionParticipantSchema>;
/**
 * Complete Session object (VAP Section 6)
 */
declare const SessionSchema: z.ZodObject<{
  sessionId: z.ZodString;
  contentId: z.ZodString;
  participant: z.ZodObject<{
    viewerIdHash: z.ZodString;
    consentId: z.ZodOptional<z.ZodString>;
    preferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, "strip", z.ZodTypeAny, {
    viewerIdHash: string;
    consentId?: string | undefined;
    preferences?: Record<string, unknown> | undefined;
  }, {
    viewerIdHash: string;
    consentId?: string | undefined;
    preferences?: Record<string, unknown> | undefined;
  }>;
  config: z.ZodDefault<z.ZodObject<{
    timeoutMs: z.ZodDefault<z.ZodNumber>;
    requiredEvidenceTypes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    minConfidence: z.ZodOptional<z.ZodNumber>;
    maxDurationMs: z.ZodOptional<z.ZodNumber>;
    allowedSources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strip", z.ZodTypeAny, {
    timeoutMs: number;
    requiredEvidenceTypes?: string[] | undefined;
    minConfidence?: number | undefined;
    maxDurationMs?: number | undefined;
    allowedSources?: string[] | undefined;
  }, {
    timeoutMs?: number | undefined;
    requiredEvidenceTypes?: string[] | undefined;
    minConfidence?: number | undefined;
    maxDurationMs?: number | undefined;
    allowedSources?: string[] | undefined;
  }>>;
  state: z.ZodNativeEnum<typeof SessionState>;
  evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
  claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
  proofId: z.ZodOptional<z.ZodString>;
  startedAt: z.ZodString;
  lastActivityAt: z.ZodOptional<z.ZodString>;
  expiredAt: z.ZodOptional<z.ZodString>;
  verifiedAt: z.ZodOptional<z.ZodString>;
  certifiedAt: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
  sessionId: string;
  contentId: string;
  participant: {
    viewerIdHash: string;
    consentId?: string | undefined;
    preferences?: Record<string, unknown> | undefined;
  };
  config: {
    timeoutMs: number;
    requiredEvidenceTypes?: string[] | undefined;
    minConfidence?: number | undefined;
    maxDurationMs?: number | undefined;
    allowedSources?: string[] | undefined;
  };
  state: SessionState;
  evidenceIds: string[];
  claimIds: string[];
  startedAt: string;
  proofId?: string | undefined;
  lastActivityAt?: string | undefined;
  expiredAt?: string | undefined;
  verifiedAt?: string | undefined;
  certifiedAt?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
}, {
  sessionId: string;
  contentId: string;
  participant: {
    viewerIdHash: string;
    consentId?: string | undefined;
    preferences?: Record<string, unknown> | undefined;
  };
  state: SessionState;
  startedAt: string;
  config?: {
    timeoutMs?: number | undefined;
    requiredEvidenceTypes?: string[] | undefined;
    minConfidence?: number | undefined;
    maxDurationMs?: number | undefined;
    allowedSources?: string[] | undefined;
  } | undefined;
  evidenceIds?: string[] | undefined;
  claimIds?: string[] | undefined;
  proofId?: string | undefined;
  lastActivityAt?: string | undefined;
  expiredAt?: string | undefined;
  verifiedAt?: string | undefined;
  certifiedAt?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
}>;
type Session = z.infer<typeof SessionSchema>;
/**
 * Session lifecycle events
 */
declare enum SessionEventType {
  CREATED = "SESSION_CREATED",
  STARTED = "SESSION_STARTED",
  EVIDENCE_ADDED = "EVIDENCE_ADDED",
  STATE_CHANGED = "STATE_CHANGED",
  VERIFICATION_REQUESTED = "VERIFICATION_REQUESTED",
  VERIFICATION_COMPLETED = "VERIFICATION_COMPLETED",
  EXPIRED = "SESSION_EXPIRED",
  CERTIFIED = "SESSION_CERTIFIED",
  CANCELLED = "SESSION_CANCELLED",
}
/**
 * Create a new session
 */
declare function createSession(params: Omit<Session, 'sessionId' | 'startedAt' | 'state' | 'evidenceIds' | 'claimIds'>): Session;
/**
 * Add evidence to session
 */
declare function addEvidenceToSession(session: Session, evidenceId: string): Session;
/**
 * Transition session state
 */
declare function transitionSessionState(session: Session, newState: z.infer<typeof SessionStateSchema$1>): Session;
/**
 * Check if session is expired based on timeout
 */
declare function isSessionExpired(session: Session): boolean;
/**
 * Session heartbeat - updates last activity time
 */
declare function sessionHeartbeat(session: Session): Session;
//# sourceMappingURL=session.d.ts.map
//#endregion
export { Session, SessionConfig, SessionConfigSchema as SessionConfigSchema$1, SessionEventType as SessionEventType$1, SessionParticipant, SessionParticipantSchema as SessionParticipantSchema$1, SessionSchema as SessionSchema$1, SessionState$1, SessionStateSchema$1 as SessionStateSchema$2, SessionStateValue as SessionStateValue$1, addEvidenceToSession as addEvidenceToSession$1, createSession as createSession$1, isSessionExpired as isSessionExpired$1, sessionHeartbeat as sessionHeartbeat$1, transitionSessionState as transitionSessionState$1 };
//# sourceMappingURL=session-CLvx5U0v.d.mts.map