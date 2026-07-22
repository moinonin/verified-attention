import { z } from "zod";

//#region src/proof.d.ts

/**
 * Proof lifecycle states (VAP Section 10)
 */
declare enum ProofState {
  UNSIGNED = "UNSIGNED",
  SIGNED = "SIGNED",
  PUBLISHED = "PUBLISHED",
  REVOKED = "REVOKED",
  EXPIRED = "EXPIRED",
}
declare const ProofStateSchema: z.ZodNativeEnum<typeof ProofState>;
/**
 * Proof metadata
 */
declare const ProofMetadataSchema: z.ZodObject<{
  policyId: z.ZodString;
  verificationModelVersion: z.ZodOptional<z.ZodString>;
  fraudScore: z.ZodOptional<z.ZodNumber>;
  evidenceCount: z.ZodOptional<z.ZodNumber>;
  sessionDurationMs: z.ZodOptional<z.ZodNumber>;
  claimIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
  policyId: string;
  claimIds?: string[] | undefined;
  verificationModelVersion?: string | undefined;
  fraudScore?: number | undefined;
  evidenceCount?: number | undefined;
  sessionDurationMs?: number | undefined;
}, {
  policyId: string;
  claimIds?: string[] | undefined;
  verificationModelVersion?: string | undefined;
  fraudScore?: number | undefined;
  evidenceCount?: number | undefined;
  sessionDurationMs?: number | undefined;
}>;
type ProofMetadata = z.infer<typeof ProofMetadataSchema>;
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
declare const ProofSchema: z.ZodObject<{
  proofId: z.ZodString;
  sessionId: z.ZodString;
  contentId: z.ZodString;
  confidence: z.ZodNumber;
  evidenceHash: z.ZodString;
  verifierId: z.ZodString;
  signature: z.ZodString;
  state: z.ZodNativeEnum<typeof ProofState>;
  issuedAt: z.ZodString;
  publishedAt: z.ZodOptional<z.ZodString>;
  revokedAt: z.ZodOptional<z.ZodString>;
  expiresAt: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodObject<{
    policyId: z.ZodString;
    verificationModelVersion: z.ZodOptional<z.ZodString>;
    fraudScore: z.ZodOptional<z.ZodNumber>;
    evidenceCount: z.ZodOptional<z.ZodNumber>;
    sessionDurationMs: z.ZodOptional<z.ZodNumber>;
    claimIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strip", z.ZodTypeAny, {
    policyId: string;
    claimIds?: string[] | undefined;
    verificationModelVersion?: string | undefined;
    fraudScore?: number | undefined;
    evidenceCount?: number | undefined;
    sessionDurationMs?: number | undefined;
  }, {
    policyId: string;
    claimIds?: string[] | undefined;
    verificationModelVersion?: string | undefined;
    fraudScore?: number | undefined;
    evidenceCount?: number | undefined;
    sessionDurationMs?: number | undefined;
  }>>;
  baseMetadata: z.ZodOptional<z.ZodObject<{
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
  }>>;
}, "strip", z.ZodTypeAny, {
  sessionId: string;
  contentId: string;
  state: ProofState;
  proofId: string;
  confidence: number;
  signature: string;
  evidenceHash: string;
  verifierId: string;
  issuedAt: string;
  metadata?: {
    policyId: string;
    claimIds?: string[] | undefined;
    verificationModelVersion?: string | undefined;
    fraudScore?: number | undefined;
    evidenceCount?: number | undefined;
    sessionDurationMs?: number | undefined;
  } | undefined;
  baseMetadata?: {
    createdAt: string;
    version: number;
    updatedAt?: string | undefined;
    tags?: Record<string, string> | undefined;
  } | undefined;
  publishedAt?: string | undefined;
  revokedAt?: string | undefined;
  expiresAt?: string | undefined;
}, {
  sessionId: string;
  contentId: string;
  state: ProofState;
  proofId: string;
  confidence: number;
  signature: string;
  evidenceHash: string;
  verifierId: string;
  issuedAt: string;
  metadata?: {
    policyId: string;
    claimIds?: string[] | undefined;
    verificationModelVersion?: string | undefined;
    fraudScore?: number | undefined;
    evidenceCount?: number | undefined;
    sessionDurationMs?: number | undefined;
  } | undefined;
  baseMetadata?: {
    createdAt: string;
    updatedAt?: string | undefined;
    version?: number | undefined;
    tags?: Record<string, string> | undefined;
  } | undefined;
  publishedAt?: string | undefined;
  revokedAt?: string | undefined;
  expiresAt?: string | undefined;
}>;
type Proof = z.infer<typeof ProofSchema>;
/**
 * Proof validation result
 */
declare const ProofValidationResultSchema: z.ZodObject<{
  valid: z.ZodBoolean;
  proofId: z.ZodString;
  errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    path: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">>;
  }, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    path?: (string | number)[] | undefined;
  }, {
    code: string;
    message: string;
    path?: (string | number)[] | undefined;
  }>, "many">>;
  warnings: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
  valid: boolean;
  proofId: string;
  errors?: {
    code: string;
    message: string;
    path?: (string | number)[] | undefined;
  }[] | undefined;
  warnings?: string[] | undefined;
}, {
  valid: boolean;
  proofId: string;
  errors?: {
    code: string;
    message: string;
    path?: (string | number)[] | undefined;
  }[] | undefined;
  warnings?: string[] | undefined;
}>;
type ProofValidationResult = z.infer<typeof ProofValidationResultSchema>;
/**
 * Unsigned proof (before signature is applied)
 */
type UnsignedProof = Omit<Proof, 'signature' | 'state' | 'issuedAt'> & {
  state: typeof ProofState.UNSIGNED;
};
/**
 * Create an unsigned proof from verification result
 */
declare function createUnsignedProof(params: Omit<Proof, 'proofId' | 'signature' | 'state' | 'issuedAt'>): UnsignedProof;
/**
 * Sign a proof (transitions UNSIGNED → SIGNED)
 */
declare function signProof(unsigned: UnsignedProof, signature: string): Proof;
/**
 * Publish a signed proof (transitions SIGNED → PUBLISHED)
 */
declare function publishProof(proof: Proof): Proof;
/**
 * Revoke a proof (any state → REVOKED)
 */
declare function revokeProof(proof: Proof): Proof;
/**
 * Transition proof state with validation
 */
declare function transitionProofState(proof: Proof, newState: ProofState): Proof;
/**
 * Validate proof structure, signature presence, and required fields
 */
declare function validateProof(proof: unknown): ProofValidationResult;
/**
 * Check if proof is expired
 */
declare function isProofExpired(proof: Proof): boolean;
/**
 * Check if proof is valid (published, not revoked, not expired)
 */
declare function isProofValid(proof: Proof): boolean;
//# sourceMappingURL=proof.d.ts.map
//#endregion
export { Proof, ProofMetadata, ProofMetadataSchema as ProofMetadataSchema$1, ProofSchema as ProofSchema$1, ProofState as ProofState$1, ProofStateSchema as ProofStateSchema$1, ProofValidationResult, ProofValidationResultSchema as ProofValidationResultSchema$1, UnsignedProof, createUnsignedProof as createUnsignedProof$1, isProofExpired as isProofExpired$1, isProofValid as isProofValid$1, publishProof as publishProof$1, revokeProof as revokeProof$1, signProof as signProof$1, transitionProofState as transitionProofState$1, validateProof as validateProof$1 };
//# sourceMappingURL=proof-CBNTXapR.d.mts.map