import { z } from "zod";

//#region src/common.d.ts

/**
 * RFC 3339 timestamp with microsecond precision
 */
declare const TimestampSchema: z.ZodString;
type Timestamp = z.infer<typeof TimestampSchema>;
/**
 * Universally unique identifier (UUID v4)
 */
declare const UUIDSchema: z.ZodString;
type UUID = z.infer<typeof UUIDSchema>;
/**
 * URN-formatted identifier following VAP conventions:
 * - Evidence: urn:vap:evidence:<hash>
 * - Session: urn:vap:session:<uuid>
 * - Claim: urn:vap:claim:<uuid>
 * - Proof: urn:vap:proof:<uuid>
 */
declare const URNSchema: z.ZodString;
type URN = z.infer<typeof URNSchema>;
/**
 * Evidence Identifier (EVID)
 */
declare const EvidenceIdSchema: z.ZodString;
type EvidenceId = z.infer<typeof EvidenceIdSchema>;
/**
 * Session Identifier (SID)
 */
declare const SessionIdSchema: z.ZodString;
type SessionId = z.infer<typeof SessionIdSchema>;
/**
 * Claim Identifier (CLID)
 */
declare const ClaimIdSchema: z.ZodString;
type ClaimId = z.infer<typeof ClaimIdSchema>;
/**
 * Proof Identifier (PID)
 */
declare const ProofIdSchema: z.ZodString;
type ProofId = z.infer<typeof ProofIdSchema>;
/**
 * Content Identifier - publisher-defined, opaque to protocol
 */
declare const ContentIdSchema: z.ZodString;
type ContentId = z.infer<typeof ContentIdSchema>;
/**
 * Verifier Identifier
 */
declare const VerifierIdSchema: z.ZodString;
type VerifierId = z.infer<typeof VerifierIdSchema>;
/**
 * Policy Identifier
 */
declare const PolicyIdSchema: z.ZodString;
type PolicyId = z.infer<typeof PolicyIdSchema>;
/**
 * Source Identifier (observation producer)
 */
declare const SourceIdSchema: z.ZodString;
type SourceId = z.infer<typeof SourceIdSchema>;
/**
 * Confidence score: calibrated probability 0.0–1.0
 */
declare const ConfidenceSchema: z.ZodNumber;
type Confidence = z.infer<typeof ConfidenceSchema>;
/**
 * SHA-256 hash (hex encoded, 64 chars)
 */
declare const HashSchema: z.ZodString;
type Hash = z.infer<typeof HashSchema>;
/**
 * Ed25519 signature (base64url encoded)
 */
declare const SignatureSchema: z.ZodString;
type Signature = z.infer<typeof SignatureSchema>;
/**
 * Public key (base64url encoded Ed25519)
 */
declare const PublicKeySchema: z.ZodString;
type PublicKey = z.infer<typeof PublicKeySchema>;
/**
 * Verification outcome codes (VAP Section 9)
 */
declare enum VerificationOutcome {
  PASS = "PASS",
  FAIL = "FAIL",
  INSUFFICIENT = "INSUFFICIENT",
  PENDING = "PENDING",
  INCONCLUSIVE = "INCONCLUSIVE",
}
declare const VerificationOutcomeSchema: z.ZodNativeEnum<typeof VerificationOutcome>;
/**
 * Evidence types (VAP Section 5)
 */
declare enum EvidenceType {
  INTERACTION = "E-INTERACTION",
  VISIBLE = "E-VISIBLE",
  DURATION = "E-DURATION",
  CONTEXT = "E-CONTEXT",
  CUSTOM = "E-CUSTOM",
}
declare const EvidenceTypeSchema: z.ZodNativeEnum<typeof EvidenceType>;
/**
 * Claim types (VAP Section 7)
 */
declare enum ClaimType {
  HUMAN_PRESENCE = "HUMAN_PRESENCE",
  CONTENT_VISIBLE = "CONTENT_VISIBLE",
  ENGAGEMENT_SUFFICIENT = "ENGAGEMENT_SUFFICIENT",
  DURATION_MET = "DURATION_MET",
  NO_FRAUD_DETECTED = "NO_FRAUD_DETECTED",
  CUSTOM = "CUSTOM",
}
declare const ClaimTypeSchema: z.ZodNativeEnum<typeof ClaimType>;
/**
 * Observation signal types (VAP Section 4)
 */
declare enum SignalType {
  SCROLL = "SCROLL",
  CLICK = "CLICK",
  KEY_PRESS = "KEY_PRESS",
  VIEWPORT_VISIBILITY = "VIEWPORT_VISIBILITY",
  FOCUS = "FOCUS",
  DEVICE_MOTION = "DEVICE_MOTION",
  PAGE_RESIZE = "PAGE_RESIZE",
  CUSTOM = "CUSTOM",
}
declare const SignalTypeSchema: z.ZodNativeEnum<typeof SignalType>;
/**
 * Session states (VAP Section 6)
 */
declare enum SessionState {
  CREATED = "CREATED",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  VERIFIED = "VERIFIED",
  CERTIFIED = "CERTIFIED",
  CANCELLED = "CANCELLED",
}
declare const SessionStateSchema: z.ZodNativeEnum<typeof SessionState>;
/**
 * Evidence lifecycle states (VAP Section 3)
 */
declare enum EvidenceState {
  PROPOSED = "PROPOSED",
  VALIDATED = "VALIDATED",
  INDEXED = "INDEXED",
  ARCHIVED = "ARCHIVED",
  DISCARDED = "DISCARDED",
}
declare const EvidenceStateSchema: z.ZodNativeEnum<typeof EvidenceState>;
/**
 * Base metadata for all protocol objects
 */
declare const BaseMetadataSchema: z.ZodObject<{
  createdAt: z.ZodString;
  updatedAt: z.ZodOptional<z.ZodString>;
  version: z.ZodDefault<z.ZodNumber>;
  tags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
  createdAt: string;
  version: number;
  updatedAt?: string | undefined;
  tags?: Record<string, string> | undefined;
}, {
  createdAt: string;
  updatedAt?: string | undefined;
  version?: number | undefined;
  tags?: Record<string, string> | undefined;
}>;
type BaseMetadata = z.infer<typeof BaseMetadataSchema>;
/**
 * Zod issue type for validation errors
 */
interface ZodIssue {
  code: string;
  message: string;
  path: (string | number)[];
}
/**
 * Convert Zod issues to plain objects
 */
declare function zodIssuesToPlain(issues: z.ZodIssue[]): ZodIssue[];
/**
 * Cryptographic integrity hash for evidence/proof objects
 * Computed as: sha256(id + session_id + timestamp + type + payload_hash + signature)
 */
declare function computeIntegrityHash(parts: string[]): Hash;
/**
 * Validate that a confidence score is properly calibrated
 * (same input + same rules = same output)
 */
declare function assertDeterministicConfidence(confidence: Confidence, context: string): void;
/**
 * Generate a VAP-compliant URN
 */
declare function generateURN(type: 'evidence' | 'session' | 'claim' | 'proof', suffix: string): URN;
/**
 * Parse a VAP URN into components
 */
declare function parseURN(urn: URN): {
  type: string;
  value: string;
} | null;
//# sourceMappingURL=common.d.ts.map
//#endregion
export { BaseMetadata, BaseMetadataSchema as BaseMetadataSchema$1, ClaimId, ClaimIdSchema as ClaimIdSchema$1, ClaimType as ClaimType$1, ClaimTypeSchema as ClaimTypeSchema$1, Confidence, ConfidenceSchema as ConfidenceSchema$1, ContentId, ContentIdSchema as ContentIdSchema$1, EvidenceId, EvidenceIdSchema as EvidenceIdSchema$1, EvidenceState as EvidenceState$3, EvidenceStateSchema as EvidenceStateSchema$3, EvidenceType as EvidenceType$1, EvidenceTypeSchema as EvidenceTypeSchema$1, Hash, HashSchema as HashSchema$1, PolicyId, PolicyIdSchema as PolicyIdSchema$1, ProofId, ProofIdSchema as ProofIdSchema$1, PublicKey, PublicKeySchema as PublicKeySchema$1, SessionId, SessionIdSchema as SessionIdSchema$1, SessionState as SessionState$2, SessionStateSchema as SessionStateSchema$3, SignalType as SignalType$1, SignalTypeSchema as SignalTypeSchema$1, Signature, SignatureSchema as SignatureSchema$1, SourceId, SourceIdSchema as SourceIdSchema$1, Timestamp, TimestampSchema as TimestampSchema$1, URN, URNSchema as URNSchema$1, UUID, UUIDSchema as UUIDSchema$1, VerificationOutcome as VerificationOutcome$1, VerificationOutcomeSchema as VerificationOutcomeSchema$1, VerifierId, VerifierIdSchema as VerifierIdSchema$1, ZodIssue, assertDeterministicConfidence as assertDeterministicConfidence$1, computeIntegrityHash as computeIntegrityHash$1, generateURN as generateURN$1, parseURN as parseURN$1, zodIssuesToPlain as zodIssuesToPlain$1 };
//# sourceMappingURL=common-DCxousWR.d.mts.map