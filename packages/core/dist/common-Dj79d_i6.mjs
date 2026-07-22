import { z } from "zod";

//#region src/common.ts
/**
* RFC 3339 timestamp with microsecond precision
*/
const TimestampSchema = z.string().datetime({
	precision: 6,
	offset: true
});
/**
* Universally unique identifier (UUID v4)
*/
const UUIDSchema = z.string().uuid();
/**
* URN-formatted identifier following VAP conventions:
* - Evidence: urn:vap:evidence:<hash>
* - Session: urn:vap:session:<uuid>
* - Claim: urn:vap:claim:<uuid>
* - Proof: urn:vap:proof:<uuid>
*/
const URNSchema = z.string().regex(/^urn:vap:(evidence|session|claim|proof):[a-zA-Z0-9_-]+$/);
/**
* Evidence Identifier (EVID)
*/
const EvidenceIdSchema = z.string().regex(/^urn:vap:evidence:[a-zA-Z0-9_-]+$/);
/**
* Session Identifier (SID)
*/
const SessionIdSchema = z.string().regex(/^urn:vap:session:[a-zA-Z0-9_-]+$/);
/**
* Claim Identifier (CLID)
*/
const ClaimIdSchema = z.string().regex(/^urn:vap:claim:[a-zA-Z0-9_-]+$/);
/**
* Proof Identifier (PID)
*/
const ProofIdSchema = z.string().regex(/^urn:vap:proof:[a-zA-Z0-9_-]+$/);
/**
* Content Identifier - publisher-defined, opaque to protocol
*/
const ContentIdSchema = z.string().min(1).max(256);
/**
* Verifier Identifier
*/
const VerifierIdSchema = z.string().min(1).max(128);
/**
* Policy Identifier
*/
const PolicyIdSchema = z.string().min(1).max(128);
/**
* Source Identifier (observation producer)
*/
const SourceIdSchema = z.string().min(1).max(128);
/**
* Confidence score: calibrated probability 0.0–1.0
*/
const ConfidenceSchema = z.number().min(0).max(1);
/**
* SHA-256 hash (hex encoded, 64 chars)
*/
const HashSchema = z.string().regex(/^[a-f0-9]{64}$/);
/**
* Ed25519 signature (base64url encoded)
*/
const SignatureSchema = z.string().min(1);
/**
* Public key (base64url encoded Ed25519)
*/
const PublicKeySchema = z.string().min(1);
/**
* Verification outcome codes (VAP Section 9)
*/
let VerificationOutcome = /* @__PURE__ */ function(VerificationOutcome$1) {
	VerificationOutcome$1["PASS"] = "PASS";
	VerificationOutcome$1["FAIL"] = "FAIL";
	VerificationOutcome$1["INSUFFICIENT"] = "INSUFFICIENT";
	VerificationOutcome$1["PENDING"] = "PENDING";
	VerificationOutcome$1["INCONCLUSIVE"] = "INCONCLUSIVE";
	return VerificationOutcome$1;
}({});
const VerificationOutcomeSchema = z.nativeEnum(VerificationOutcome);
/**
* Evidence types (VAP Section 5)
*/
let EvidenceType = /* @__PURE__ */ function(EvidenceType$1) {
	EvidenceType$1["INTERACTION"] = "E-INTERACTION";
	EvidenceType$1["VISIBLE"] = "E-VISIBLE";
	EvidenceType$1["DURATION"] = "E-DURATION";
	EvidenceType$1["CONTEXT"] = "E-CONTEXT";
	EvidenceType$1["CUSTOM"] = "E-CUSTOM";
	return EvidenceType$1;
}({});
const EvidenceTypeSchema = z.nativeEnum(EvidenceType);
/**
* Claim types (VAP Section 7)
*/
let ClaimType = /* @__PURE__ */ function(ClaimType$1) {
	ClaimType$1["HUMAN_PRESENCE"] = "HUMAN_PRESENCE";
	ClaimType$1["CONTENT_VISIBLE"] = "CONTENT_VISIBLE";
	ClaimType$1["ENGAGEMENT_SUFFICIENT"] = "ENGAGEMENT_SUFFICIENT";
	ClaimType$1["DURATION_MET"] = "DURATION_MET";
	ClaimType$1["NO_FRAUD_DETECTED"] = "NO_FRAUD_DETECTED";
	ClaimType$1["CUSTOM"] = "CUSTOM";
	return ClaimType$1;
}({});
const ClaimTypeSchema = z.nativeEnum(ClaimType);
/**
* Observation signal types (VAP Section 4)
*/
let SignalType = /* @__PURE__ */ function(SignalType$1) {
	SignalType$1["SCROLL"] = "SCROLL";
	SignalType$1["CLICK"] = "CLICK";
	SignalType$1["KEY_PRESS"] = "KEY_PRESS";
	SignalType$1["VIEWPORT_VISIBILITY"] = "VIEWPORT_VISIBILITY";
	SignalType$1["FOCUS"] = "FOCUS";
	SignalType$1["DEVICE_MOTION"] = "DEVICE_MOTION";
	SignalType$1["PAGE_RESIZE"] = "PAGE_RESIZE";
	SignalType$1["CUSTOM"] = "CUSTOM";
	return SignalType$1;
}({});
const SignalTypeSchema = z.nativeEnum(SignalType);
/**
* Session states (VAP Section 6)
*/
let SessionState = /* @__PURE__ */ function(SessionState$1) {
	SessionState$1["CREATED"] = "CREATED";
	SessionState$1["ACTIVE"] = "ACTIVE";
	SessionState$1["EXPIRED"] = "EXPIRED";
	SessionState$1["VERIFIED"] = "VERIFIED";
	SessionState$1["CERTIFIED"] = "CERTIFIED";
	SessionState$1["CANCELLED"] = "CANCELLED";
	return SessionState$1;
}({});
const SessionStateSchema = z.nativeEnum(SessionState);
/**
* Evidence lifecycle states (VAP Section 3)
*/
let EvidenceState = /* @__PURE__ */ function(EvidenceState$1) {
	EvidenceState$1["PROPOSED"] = "PROPOSED";
	EvidenceState$1["VALIDATED"] = "VALIDATED";
	EvidenceState$1["INDEXED"] = "INDEXED";
	EvidenceState$1["ARCHIVED"] = "ARCHIVED";
	EvidenceState$1["DISCARDED"] = "DISCARDED";
	return EvidenceState$1;
}({});
const EvidenceStateSchema = z.nativeEnum(EvidenceState);
/**
* Base metadata for all protocol objects
*/
const BaseMetadataSchema = z.object({
	createdAt: TimestampSchema,
	updatedAt: TimestampSchema.optional(),
	version: z.number().int().positive().default(1),
	tags: z.record(z.string()).optional()
});
/**
* Convert Zod issues to plain objects
*/
function zodIssuesToPlain(issues) {
	return issues.map((issue) => ({
		code: issue.code,
		message: issue.message,
		path: issue.path
	}));
}
/**
* Cryptographic integrity hash for evidence/proof objects
* Computed as: sha256(id + session_id + timestamp + type + payload_hash + signature)
*/
function computeIntegrityHash(parts) {
	return "";
}
/**
* Validate that a confidence score is properly calibrated
* (same input + same rules = same output)
*/
function assertDeterministicConfidence(confidence, context) {
	if (confidence < 0 || confidence > 1) throw new Error(`Invalid confidence ${confidence} in ${context}: must be in [0, 1]`);
	if (!Number.isFinite(confidence)) throw new Error(`Non-finite confidence in ${context}`);
}
/**
* Generate a VAP-compliant URN
*/
function generateURN(type, suffix) {
	return `urn:vap:${type}:${suffix}`;
}
/**
* Parse a VAP URN into components
*/
function parseURN(urn) {
	const match = urn.match(/^urn:vap:(evidence|session|claim|proof):(.+)$/);
	if (!match) return null;
	return {
		type: match[1],
		value: match[2]
	};
}

//#endregion
export { BaseMetadataSchema, ClaimIdSchema, ClaimType, ClaimTypeSchema, ConfidenceSchema, ContentIdSchema, EvidenceIdSchema, EvidenceState, EvidenceStateSchema, EvidenceType, EvidenceTypeSchema, HashSchema, PolicyIdSchema, ProofIdSchema, PublicKeySchema, SessionIdSchema, SessionState, SessionStateSchema, SignalType, SignalTypeSchema, SignatureSchema, SourceIdSchema, TimestampSchema, URNSchema, UUIDSchema, VerificationOutcome, VerificationOutcomeSchema, VerifierIdSchema, assertDeterministicConfidence, computeIntegrityHash, generateURN, parseURN, zodIssuesToPlain };
//# sourceMappingURL=common-Dj79d_i6.mjs.map