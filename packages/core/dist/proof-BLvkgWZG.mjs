import { __require } from "./chunk-Duj1WY3L.mjs";
import { BaseMetadataSchema, ConfidenceSchema, ContentIdSchema, HashSchema, ProofIdSchema, SessionIdSchema, SignatureSchema, TimestampSchema, VerifierIdSchema, zodIssuesToPlain } from "./common-Dj79d_i6.mjs";
import { z } from "zod";

//#region src/proof.ts
/**
* Proof lifecycle states (VAP Section 10)
*/
let ProofState = /* @__PURE__ */ function(ProofState$1) {
	ProofState$1["UNSIGNED"] = "UNSIGNED";
	ProofState$1["SIGNED"] = "SIGNED";
	ProofState$1["PUBLISHED"] = "PUBLISHED";
	ProofState$1["REVOKED"] = "REVOKED";
	ProofState$1["EXPIRED"] = "EXPIRED";
	return ProofState$1;
}({});
const ProofStateSchema = z.nativeEnum(ProofState);
/**
* Proof metadata
*/
const ProofMetadataSchema = z.object({
	policyId: z.string().min(1),
	verificationModelVersion: z.string().optional(),
	fraudScore: z.number().min(0).max(1).optional(),
	evidenceCount: z.number().int().nonnegative().optional(),
	sessionDurationMs: z.number().int().nonnegative().optional(),
	claimIds: z.array(z.string()).optional()
});
/**
* Complete Proof of Attention object (VAP Section 10)
*
* Contains 7 mandatory fields:
* 1. proof_id (unique)
* 2. session_id (referenced)
* 3. content_id (referenced)
* 4. confidence (aggregated confidence)
* 5. evidence_hash (of all considered evidence)
* 6. verifier_id (identity of verifier)
* 7. signature (Ed25519/ECDSA over above fields)
*/
const ProofSchema = z.object({
	proofId: ProofIdSchema,
	sessionId: SessionIdSchema,
	contentId: ContentIdSchema,
	confidence: ConfidenceSchema,
	evidenceHash: HashSchema,
	verifierId: VerifierIdSchema,
	signature: SignatureSchema,
	state: ProofStateSchema,
	issuedAt: TimestampSchema,
	publishedAt: TimestampSchema.optional(),
	revokedAt: TimestampSchema.optional(),
	expiresAt: TimestampSchema.optional(),
	metadata: ProofMetadataSchema.optional(),
	baseMetadata: BaseMetadataSchema.optional()
});
/**
* Proof validation result
*/
const ProofValidationResultSchema = z.object({
	valid: z.boolean(),
	proofId: ProofIdSchema,
	errors: z.array(z.object({
		code: z.string(),
		message: z.string(),
		path: z.array(z.union([z.string(), z.number()])).optional()
	})).optional(),
	warnings: z.array(z.string()).optional()
});
/**
* Create an unsigned proof from verification result
*/
function createUnsignedProof(params) {
	const { randomUUID } = __require("crypto");
	return {
		...params,
		proofId: `urn:vap:proof:${randomUUID()}`,
		state: ProofState.UNSIGNED
	};
}
/**
* Sign a proof (transitions UNSIGNED → SIGNED)
*/
function signProof(unsigned, signature) {
	return {
		...unsigned,
		signature,
		state: ProofState.SIGNED,
		issuedAt: new Date().toISOString()
	};
}
/**
* Publish a signed proof (transitions SIGNED → PUBLISHED)
*/
function publishProof(proof) {
	if (proof.state !== ProofState.SIGNED) throw new Error(`Cannot publish proof in state ${proof.state}; must be SIGNED`);
	return {
		...proof,
		state: ProofState.PUBLISHED,
		publishedAt: new Date().toISOString()
	};
}
/**
* Revoke a proof (any state → REVOKED)
*/
function revokeProof(proof) {
	if (proof.state === ProofState.REVOKED) return proof;
	return {
		...proof,
		state: ProofState.REVOKED,
		revokedAt: new Date().toISOString()
	};
}
/**
* Transition proof state with validation
*/
function transitionProofState(proof, newState) {
	const validTransitions = {
		[ProofState.UNSIGNED]: [ProofState.SIGNED],
		[ProofState.SIGNED]: [ProofState.PUBLISHED, ProofState.REVOKED],
		[ProofState.PUBLISHED]: [ProofState.REVOKED, ProofState.EXPIRED],
		[ProofState.REVOKED]: [],
		[ProofState.EXPIRED]: []
	};
	if (!validTransitions[proof.state]?.includes(newState)) throw new Error(`Invalid proof state transition: ${proof.state} -> ${newState}`);
	switch (newState) {
		case ProofState.PUBLISHED: return publishProof(proof);
		case ProofState.REVOKED: return revokeProof(proof);
		default: return {
			...proof,
			state: newState
		};
	}
}
/**
* Validate proof structure, signature presence, and required fields
*/
function validateProof(proof) {
	const result = ProofSchema.safeParse(proof);
	if (!result.success) return {
		valid: false,
		proofId: proof?.proofId ?? "unknown",
		errors: zodIssuesToPlain(result.error.issues)
	};
	return {
		valid: true,
		proofId: result.data.proofId
	};
}
/**
* Check if proof is expired
*/
function isProofExpired(proof) {
	if (proof.state === ProofState.EXPIRED) return true;
	if (!proof.expiresAt) return false;
	return new Date(proof.expiresAt).getTime() < Date.now();
}
/**
* Check if proof is valid (published, not revoked, not expired)
*/
function isProofValid(proof) {
	return proof.state === ProofState.PUBLISHED && !isProofExpired(proof);
}

//#endregion
export { ProofMetadataSchema, ProofSchema, ProofState, ProofStateSchema, ProofValidationResultSchema, createUnsignedProof, isProofExpired, isProofValid, publishProof, revokeProof, signProof, transitionProofState, validateProof };
//# sourceMappingURL=proof-BLvkgWZG.mjs.map