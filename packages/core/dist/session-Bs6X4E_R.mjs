import { __require } from "./chunk-Duj1WY3L.mjs";
import { ContentIdSchema, EvidenceIdSchema, SessionIdSchema, SessionStateSchema, TimestampSchema } from "./common-Dj79d_i6.mjs";
import { z } from "zod";

//#region src/session.ts
const SessionStateSchema$1 = SessionStateSchema;
const SessionStateValue = {
	CREATED: "CREATED",
	ACTIVE: "ACTIVE",
	EXPIRED: "EXPIRED",
	VERIFIED: "VERIFIED",
	CERTIFIED: "CERTIFIED",
	CANCELLED: "CANCELLED"
};
/**
* Session configuration / policy
*/
const SessionConfigSchema = z.object({
	timeoutMs: z.number().int().positive().default(30 * 60 * 1e3),
	requiredEvidenceTypes: z.array(z.string()).optional(),
	minConfidence: z.number().min(0).max(1).optional(),
	maxDurationMs: z.number().int().positive().optional(),
	allowedSources: z.array(z.string()).optional()
});
/**
* Session participant (viewer) - pseudonymized
*/
const SessionParticipantSchema = z.object({
	viewerIdHash: z.string().min(1),
	consentId: z.string().optional(),
	preferences: z.record(z.unknown()).optional()
});
/**
* Complete Session object (VAP Section 6)
*/
const SessionSchema = z.object({
	sessionId: SessionIdSchema,
	contentId: ContentIdSchema,
	participant: SessionParticipantSchema,
	config: SessionConfigSchema.default({}),
	state: SessionStateSchema,
	evidenceIds: z.array(EvidenceIdSchema).default([]),
	claimIds: z.array(z.string()).default([]),
	proofId: z.string().optional(),
	startedAt: TimestampSchema,
	lastActivityAt: TimestampSchema.optional(),
	expiredAt: TimestampSchema.optional(),
	verifiedAt: TimestampSchema.optional(),
	certifiedAt: TimestampSchema.optional(),
	metadata: z.record(z.unknown()).optional()
});
/**
* Session lifecycle events
*/
let SessionEventType = /* @__PURE__ */ function(SessionEventType$1) {
	SessionEventType$1["CREATED"] = "SESSION_CREATED";
	SessionEventType$1["STARTED"] = "SESSION_STARTED";
	SessionEventType$1["EVIDENCE_ADDED"] = "EVIDENCE_ADDED";
	SessionEventType$1["STATE_CHANGED"] = "STATE_CHANGED";
	SessionEventType$1["VERIFICATION_REQUESTED"] = "VERIFICATION_REQUESTED";
	SessionEventType$1["VERIFICATION_COMPLETED"] = "VERIFICATION_COMPLETED";
	SessionEventType$1["EXPIRED"] = "SESSION_EXPIRED";
	SessionEventType$1["CERTIFIED"] = "SESSION_CERTIFIED";
	SessionEventType$1["CANCELLED"] = "SESSION_CANCELLED";
	return SessionEventType$1;
}({});
/**
* Create a new session
*/
function createSession(params) {
	const now = new Date().toISOString();
	const { randomUUID } = __require("crypto");
	return {
		...params,
		sessionId: `urn:vap:session:${randomUUID()}`,
		startedAt: now,
		state: "CREATED",
		evidenceIds: [],
		claimIds: [],
		lastActivityAt: now
	};
}
/**
* Add evidence to session
*/
function addEvidenceToSession(session, evidenceId) {
	if (session.evidenceIds.includes(evidenceId)) return session;
	return {
		...session,
		evidenceIds: [...session.evidenceIds, evidenceId],
		lastActivityAt: new Date().toISOString()
	};
}
/**
* Transition session state
*/
function transitionSessionState(session, newState) {
	const validTransitions = {
		CREATED: ["ACTIVE", "CANCELLED"],
		ACTIVE: [
			"EXPIRED",
			"VERIFIED",
			"CANCELLED"
		],
		VERIFIED: ["CERTIFIED", "EXPIRED"],
		CERTIFIED: [],
		EXPIRED: [],
		CANCELLED: []
	};
	if (!validTransitions[session.state]?.includes(newState)) throw new Error(`Invalid state transition: ${session.state} -> ${newState}`);
	return {
		...session,
		state: newState,
		lastActivityAt: new Date().toISOString(),
		...newState === "VERIFIED" && { verifiedAt: new Date().toISOString() },
		...newState === "CERTIFIED" && { certifiedAt: new Date().toISOString() },
		...newState === "EXPIRED" && { expiredAt: new Date().toISOString() }
	};
}
/**
* Check if session is expired based on timeout
*/
function isSessionExpired(session) {
	if ([
		"EXPIRED",
		"CERTIFIED",
		"CANCELLED"
	].includes(session.state)) return true;
	const lastActivity = session.lastActivityAt ? new Date(session.lastActivityAt).getTime() : new Date(session.startedAt).getTime();
	const timeout = session.config.timeoutMs;
	return Date.now() - lastActivity > timeout;
}
/**
* Session heartbeat - updates last activity time
*/
function sessionHeartbeat(session) {
	return {
		...session,
		lastActivityAt: new Date().toISOString()
	};
}

//#endregion
export { SessionConfigSchema, SessionEventType, SessionParticipantSchema, SessionSchema, SessionStateSchema$1, SessionStateValue, addEvidenceToSession, createSession, isSessionExpired, sessionHeartbeat, transitionSessionState };
//# sourceMappingURL=session-Bs6X4E_R.mjs.map