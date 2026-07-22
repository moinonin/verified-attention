import { ClaimType$1 as ClaimType } from "./common-DCxousWR.mjs";
import { z } from "zod";

//#region src/claim.d.ts

/**
 * Claim lifecycle states (VAP Section 7)
 */
declare enum ClaimState {
  PROPOSED = "PROPOSED",
  EVALUATED = "EVALUATED",
  ISSUED = "ISSUED",
  REVOKED = "REVOKED",
}
declare const ClaimStateSchema: z.ZodNativeEnum<typeof ClaimState>;
/**
 * Claim metadata
 */
declare const ClaimMetadataSchema: z.ZodObject<{
  policyId: z.ZodOptional<z.ZodString>;
  evaluationModel: z.ZodOptional<z.ZodString>;
  modelVersion: z.ZodOptional<z.ZodString>;
  evidenceCount: z.ZodOptional<z.ZodNumber>;
  evidenceQualityScore: z.ZodOptional<z.ZodNumber>;
  contradictionScore: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
  policyId?: string | undefined;
  evidenceCount?: number | undefined;
  evaluationModel?: string | undefined;
  modelVersion?: string | undefined;
  evidenceQualityScore?: number | undefined;
  contradictionScore?: number | undefined;
}, {
  policyId?: string | undefined;
  evidenceCount?: number | undefined;
  evaluationModel?: string | undefined;
  modelVersion?: string | undefined;
  evidenceQualityScore?: number | undefined;
  contradictionScore?: number | undefined;
}>;
type ClaimMetadata = z.infer<typeof ClaimMetadataSchema>;
/**
 * Complete Claim object (VAP Section 7)
 */
declare const ClaimSchema: z.ZodObject<{
  claimId: z.ZodString;
  sessionId: z.ZodString;
  claimType: z.ZodNativeEnum<typeof ClaimType>;
  evidenceIds: z.ZodArray<z.ZodString, "many">;
  evidenceHash: z.ZodString;
  confidence: z.ZodNumber;
  state: z.ZodNativeEnum<typeof ClaimState>;
  proposedAt: z.ZodString;
  evaluatedAt: z.ZodOptional<z.ZodString>;
  issuedAt: z.ZodOptional<z.ZodString>;
  revokedAt: z.ZodOptional<z.ZodString>;
  expiration: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodObject<{
    policyId: z.ZodOptional<z.ZodString>;
    evaluationModel: z.ZodOptional<z.ZodString>;
    modelVersion: z.ZodOptional<z.ZodString>;
    evidenceCount: z.ZodOptional<z.ZodNumber>;
    evidenceQualityScore: z.ZodOptional<z.ZodNumber>;
    contradictionScore: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    policyId?: string | undefined;
    evidenceCount?: number | undefined;
    evaluationModel?: string | undefined;
    modelVersion?: string | undefined;
    evidenceQualityScore?: number | undefined;
    contradictionScore?: number | undefined;
  }, {
    policyId?: string | undefined;
    evidenceCount?: number | undefined;
    evaluationModel?: string | undefined;
    modelVersion?: string | undefined;
    evidenceQualityScore?: number | undefined;
    contradictionScore?: number | undefined;
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
  state: ClaimState;
  evidenceIds: string[];
  confidence: number;
  evidenceHash: string;
  claimId: string;
  claimType: ClaimType;
  proposedAt: string;
  metadata?: {
    policyId?: string | undefined;
    evidenceCount?: number | undefined;
    evaluationModel?: string | undefined;
    modelVersion?: string | undefined;
    evidenceQualityScore?: number | undefined;
    contradictionScore?: number | undefined;
  } | undefined;
  baseMetadata?: {
    createdAt: string;
    version: number;
    updatedAt?: string | undefined;
    tags?: Record<string, string> | undefined;
  } | undefined;
  issuedAt?: string | undefined;
  revokedAt?: string | undefined;
  evaluatedAt?: string | undefined;
  expiration?: string | undefined;
}, {
  sessionId: string;
  state: ClaimState;
  evidenceIds: string[];
  confidence: number;
  evidenceHash: string;
  claimId: string;
  claimType: ClaimType;
  proposedAt: string;
  metadata?: {
    policyId?: string | undefined;
    evidenceCount?: number | undefined;
    evaluationModel?: string | undefined;
    modelVersion?: string | undefined;
    evidenceQualityScore?: number | undefined;
    contradictionScore?: number | undefined;
  } | undefined;
  baseMetadata?: {
    createdAt: string;
    updatedAt?: string | undefined;
    version?: number | undefined;
    tags?: Record<string, string> | undefined;
  } | undefined;
  issuedAt?: string | undefined;
  revokedAt?: string | undefined;
  evaluatedAt?: string | undefined;
  expiration?: string | undefined;
}>;
type Claim = z.infer<typeof ClaimSchema>;
/**
 * Claim validation result
 */
declare const ClaimValidationResultSchema: z.ZodObject<{
  valid: z.ZodBoolean;
  claimId: z.ZodString;
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
  claimId: string;
  errors?: {
    code: string;
    message: string;
    path?: (string | number)[] | undefined;
  }[] | undefined;
  warnings?: string[] | undefined;
}, {
  valid: boolean;
  claimId: string;
  errors?: {
    code: string;
    message: string;
    path?: (string | number)[] | undefined;
  }[] | undefined;
  warnings?: string[] | undefined;
}>;
type ClaimValidationResult = z.infer<typeof ClaimValidationResultSchema>;
/**
 * Create a new claim (in PROPOSED state, awaiting evaluation)
 */
declare function createClaim(params: Omit<Claim, 'claimId' | 'state' | 'proposedAt'> & {
  proposedAt?: string;
}): Claim;
/**
 * Transition claim state
 */
declare function transitionClaimState(claim: Claim, newState: ClaimState): Claim;
/**
 * Validate claim structure and required fields
 */
declare function validateClaim(claim: unknown): ClaimValidationResult;
/**
 * Check if claim is expired
 */
declare function isClaimExpired(claim: Claim): boolean;
/**
 * Check if claim is active (issued and not revoked or expired)
 */
declare function isClaimActive(claim: Claim): boolean;
//# sourceMappingURL=claim.d.ts.map
//#endregion
export { Claim, ClaimMetadata, ClaimMetadataSchema as ClaimMetadataSchema$1, ClaimSchema as ClaimSchema$1, ClaimState as ClaimState$1, ClaimStateSchema as ClaimStateSchema$1, ClaimValidationResult, ClaimValidationResultSchema as ClaimValidationResultSchema$1, createClaim as createClaim$1, isClaimActive as isClaimActive$1, isClaimExpired as isClaimExpired$1, transitionClaimState as transitionClaimState$1, validateClaim as validateClaim$1 };
//# sourceMappingURL=claim-CoDJPMtW.d.mts.map