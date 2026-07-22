import { __require } from "./chunk-Duj1WY3L.mjs";
import { BaseMetadataSchema, ClaimIdSchema, ClaimTypeSchema, ConfidenceSchema, EvidenceIdSchema, PolicyIdSchema, SessionIdSchema, TimestampSchema, zodIssuesToPlain } from "./common-Dj79d_i6.mjs";
import { z } from "zod";

//#region src/claim.ts
/**
* Claim lifecycle states (VAP Section 7)
*/
let ClaimState = /* @__PURE__ */ function(ClaimState$1) {
	ClaimState$1["PROPOSED"] = "PROPOSED";
	ClaimState$1["EVALUATED"] = "EVALUATED";
	ClaimState$1["ISSUED"] = "ISSUED";
	ClaimState$1["REVOKED"] = "REVOKED";
	return ClaimState$1;
}({});
const ClaimStateSchema = z.nativeEnum(ClaimState);
/**
* Claim metadata
*/
const ClaimMetadataSchema = z.object({
	policyId: PolicyIdSchema.optional(),
	evaluationModel: z.string().optional(),
	modelVersion: z.string().optional(),
	evidenceCount: z.number().int().nonnegative().optional(),
	evidenceQualityScore: z.number().min(0).max(1).optional(),
	contradictionScore: z.number().min(0).max(1).optional()
});
/**
* Complete Claim object (VAP Section 7)
*/
const ClaimSchema = z.object({
	claimId: ClaimIdSchema,
	sessionId: SessionIdSchema,
	claimType: ClaimTypeSchema,
	evidenceIds: z.array(EvidenceIdSchema).min(1),
	evidenceHash: z.string().min(1),
	confidence: ConfidenceSchema,
	state: ClaimStateSchema,
	proposedAt: TimestampSchema,
	evaluatedAt: TimestampSchema.optional(),
	issuedAt: TimestampSchema.optional(),
	revokedAt: TimestampSchema.optional(),
	expiration: TimestampSchema.optional(),
	metadata: ClaimMetadataSchema.optional(),
	baseMetadata: BaseMetadataSchema.optional()
});
/**
* Claim validation result
*/
const ClaimValidationResultSchema = z.object({
	valid: z.boolean(),
	claimId: ClaimIdSchema,
	errors: z.array(z.object({
		code: z.string(),
		message: z.string(),
		path: z.array(z.union([z.string(), z.number()])).optional()
	})).optional(),
	warnings: z.array(z.string()).optional()
});
/**
* Create a new claim (in PROPOSED state, awaiting evaluation)
*/
function createClaim(params) {
	const { randomUUID } = __require("crypto");
	return {
		...params,
		claimId: `urn:vap:claim:${randomUUID()}`,
		state: "PROPOSED",
		proposedAt: params.proposedAt ?? new Date().toISOString()
	};
}
/**
* Transition claim state
*/
function transitionClaimState(claim, newState) {
	const validTransitions = {
		[ClaimState.PROPOSED]: [ClaimState.EVALUATED, ClaimState.REVOKED],
		[ClaimState.EVALUATED]: [ClaimState.ISSUED, ClaimState.REVOKED],
		[ClaimState.ISSUED]: [ClaimState.REVOKED],
		[ClaimState.REVOKED]: []
	};
	if (!validTransitions[claim.state]?.includes(newState)) throw new Error(`Invalid claim state transition: ${claim.state} -> ${newState}`);
	const now = new Date().toISOString();
	return {
		...claim,
		state: newState,
		...newState === ClaimState.EVALUATED && { evaluatedAt: now },
		...newState === ClaimState.ISSUED && { issuedAt: now },
		...newState === ClaimState.REVOKED && { revokedAt: now }
	};
}
/**
* Validate claim structure and required fields
*/
function validateClaim(claim) {
	const result = ClaimSchema.safeParse(claim);
	if (!result.success) return {
		valid: false,
		claimId: claim?.claimId ?? "unknown",
		errors: zodIssuesToPlain(result.error.issues)
	};
	return {
		valid: true,
		claimId: result.data.claimId
	};
}
/**
* Check if claim is expired
*/
function isClaimExpired(claim) {
	if (!claim.expiration) return false;
	return new Date(claim.expiration).getTime() < Date.now();
}
/**
* Check if claim is active (issued and not revoked or expired)
*/
function isClaimActive(claim) {
	return claim.state === "ISSUED" && !isClaimExpired(claim);
}

//#endregion
export { ClaimMetadataSchema, ClaimSchema, ClaimState, ClaimStateSchema, ClaimValidationResultSchema, createClaim, isClaimActive, isClaimExpired, transitionClaimState, validateClaim };
//# sourceMappingURL=claim-BIrl5CE_.mjs.map