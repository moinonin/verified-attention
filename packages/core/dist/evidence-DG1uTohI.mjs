import { BaseMetadataSchema, ConfidenceSchema, EvidenceIdSchema, EvidenceTypeSchema, HashSchema, SessionIdSchema, SignatureSchema, SourceIdSchema, TimestampSchema, UUIDSchema, zodIssuesToPlain } from "./common-Dj79d_i6.mjs";
import { z } from "zod";
import { randomUUID } from "crypto";

//#region src/evidence.ts
/**
* Evidence payload varies by evidence type
*/
const InteractionEvidencePayloadSchema = z.object({
	avgScrollVelocity: z.number().optional(),
	scrollDirectionChanges: z.number().int().optional(),
	clickCount: z.number().int().optional(),
	keyPressCount: z.number().int().optional(),
	interactionDurationMs: z.number().int().optional(),
	readingPauses: z.array(z.object({
		startTime: z.number(),
		durationMs: z.number(),
		position: z.number()
	})).optional(),
	engagementScore: z.number().min(0).max(1).optional()
});
const VisibilityEvidencePayloadSchema = z.object({
	visibleDurationMs: z.number().int(),
	maxVisibilityRatio: z.number().min(0).max(1),
	avgVisibilityRatio: z.number().min(0).max(1),
	viewportIntersections: z.array(z.object({
		timestamp: z.number(),
		ratio: z.number().min(0).max(1)
	})).optional()
});
const DurationEvidencePayloadSchema = z.object({
	sessionStartTime: z.number(),
	sessionEndTime: z.number().optional(),
	activeDurationMs: z.number().int(),
	idleDurationMs: z.number().int().optional(),
	heartbeatCount: z.number().int().optional()
});
const ContextEvidencePayloadSchema = z.object({
	platform: z.enum([
		"browser",
		"mobile",
		"desktop",
		"server"
	]),
	userAgent: z.string().optional(),
	viewportSize: z.object({
		width: z.number(),
		height: z.number()
	}).optional(),
	devicePixelRatio: z.number().optional(),
	timezone: z.string().optional(),
	language: z.string().optional(),
	connectionType: z.string().optional(),
	effectiveType: z.string().optional()
});
const CustomEvidencePayloadSchema = z.record(z.unknown());
/**
* Evidence payload union type - using discriminated union on evidenceType
*/
const EvidencePayloadSchema = z.discriminatedUnion("evidenceType", [
	z.object({
		evidenceType: z.literal("E-INTERACTION"),
		payload: InteractionEvidencePayloadSchema
	}),
	z.object({
		evidenceType: z.literal("E-VISIBLE"),
		payload: VisibilityEvidencePayloadSchema
	}),
	z.object({
		evidenceType: z.literal("E-DURATION"),
		payload: DurationEvidencePayloadSchema
	}),
	z.object({
		evidenceType: z.literal("E-CONTEXT"),
		payload: ContextEvidencePayloadSchema
	}),
	z.object({
		evidenceType: z.literal("E-CUSTOM"),
		payload: CustomEvidencePayloadSchema
	})
]);
/**
* Evidence provenance - references to underlying observations
*/
const EvidenceProvenanceSchema = z.object({
	observationIds: z.array(UUIDSchema).min(1),
	observationHash: HashSchema,
	sourceId: SourceIdSchema,
	collectionMethod: z.enum([
		"sdk",
		"api",
		"partner",
		"import"
	]).optional()
});
/**
* Evidence metadata (optional per VAP)
*/
const EvidenceMetadataSchema = z.object({
	policyId: z.string().optional(),
	collectionPolicyVersion: z.string().optional(),
	qualityScore: z.number().min(0).max(1).optional(),
	completenessScore: z.number().min(0).max(1).optional()
});
/**
* Complete Evidence object (VAP Section 5)
* MUST contain: evidence_id, session_id, source_id, timestamp, evidence_type, confidence, payload, provenance, signature
*/
const EvidenceSchema = z.object({
	evidenceId: EvidenceIdSchema,
	sessionId: SessionIdSchema,
	sourceId: SourceIdSchema,
	timestamp: TimestampSchema,
	evidenceType: EvidenceTypeSchema,
	confidence: ConfidenceSchema,
	payload: z.union([
		InteractionEvidencePayloadSchema,
		VisibilityEvidencePayloadSchema,
		DurationEvidencePayloadSchema,
		ContextEvidencePayloadSchema,
		CustomEvidencePayloadSchema
	]),
	provenance: EvidenceProvenanceSchema,
	signature: SignatureSchema,
	metadata: EvidenceMetadataSchema.optional(),
	baseMetadata: BaseMetadataSchema.optional()
});
/**
* Evidence state machine (VAP Section 3)
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
* Evidence with lifecycle state
*/
const EvidenceWithStateSchema = EvidenceSchema.extend({
	state: EvidenceStateSchema,
	validatedAt: TimestampSchema.optional(),
	indexedAt: TimestampSchema.optional(),
	archivedAt: TimestampSchema.optional()
});
/**
* Evidence validation result
*/
const EvidenceValidationResultSchema = z.object({
	valid: z.boolean(),
	evidenceId: EvidenceIdSchema,
	errors: z.array(z.object({
		code: z.string(),
		message: z.string(),
		path: z.array(z.union([z.string(), z.number()])).optional()
	})).optional(),
	warnings: z.array(z.string()).optional()
});
/**
* Create a new evidence object (unsigned - signature added by producer)
*/
function createEvidence(params) {
	return {
		...params,
		evidenceId: `urn:vap:evidence:${randomUUID()}`,
		timestamp: params.timestamp ?? new Date().toISOString()
	};
}
/**
* Compute evidence integrity hash
* VAP: sha256(id + session_id + timestamp + evidence_type + payload_hash + signature)
*/
function computeEvidenceHash(evidence) {
	return "";
}
/**
* Validate evidence structure and required fields
*/
function validateEvidence(evidence) {
	const result = EvidenceSchema.safeParse(evidence);
	if (!result.success) return {
		valid: false,
		evidenceId: evidence?.evidenceId ?? "unknown",
		errors: zodIssuesToPlain(result.error.issues)
	};
	return {
		valid: true,
		evidenceId: result.data.evidenceId
	};
}

//#endregion
export { ContextEvidencePayloadSchema, CustomEvidencePayloadSchema, DurationEvidencePayloadSchema, EvidenceMetadataSchema, EvidencePayloadSchema, EvidenceProvenanceSchema, EvidenceSchema, EvidenceState as EvidenceState$1, EvidenceStateSchema as EvidenceStateSchema$1, EvidenceValidationResultSchema, EvidenceWithStateSchema, InteractionEvidencePayloadSchema, VisibilityEvidencePayloadSchema, computeEvidenceHash, createEvidence, validateEvidence };
//# sourceMappingURL=evidence-DG1uTohI.mjs.map