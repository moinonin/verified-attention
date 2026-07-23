import { z } from "zod";
import { EvidenceValidationResult, EvidenceValidationResultSchema, Observation } from "@verified-attention/core";

//#region src/validation.d.ts

/**
 * Timestamp validation constraints
 */
interface TimestampConstraints {
  maxAgeMs: number;
  maxFutureMs: number;
  minIntervalMs: number;
}
declare const DEFAULT_TIMESTAMP_CONSTRAINTS: TimestampConstraints;
/**
 * Validation error codes following VAP conventions
 */
declare enum ValidationErrorCode {
  SCHEMA_INVALID = "SCHEMA_INVALID",
  EVIDENCE_EXPIRED = "EVIDENCE_EXPIRED",
  FUTURE_TIMESTAMP = "FUTURE_TIMESTAMP",
  DUPLICATE_EVIDENCE = "DUPLICATE_EVIDENCE",
  INVALID_SESSION = "INVALID_SESSION",
  DUPLICATE_INTERVAL = "DUPLICATE_INTERVAL",
  MISSING_FIELD = "MISSING_FIELD",
  INVALID_SIGNATURE = "INVALID_SIGNATURE",
  MALFORMED_ID = "MALFORMED_ID",
}
/**
 * Validation result with structured errors
 */
interface ValidationResult {
  valid: boolean;
  evidenceId: string;
  errors: Array<{
    code: ValidationErrorCode;
    message: string;
    field?: string;
  }>;
}
/**
 * Replay cache interface
 */
interface ReplayCache {
  has(id: string): Promise<boolean>;
  add(id: string): Promise<void>;
  prune(maxSize: number): Promise<void>;
  size(): Promise<number>;
}
/**
 * In-memory evidence store for replay protection
 */
declare class InMemoryReplayCache implements ReplayCache {
  private cache;
  has(id: string): Promise<boolean>;
  add(id: string, _?: boolean): Promise<void>;
  prune(maxSize: number): Promise<void>;
  size(): Promise<number>;
}
/**
 * Evidence validation function - validates raw evidence object
 */
declare function validateEvidence(evidence: unknown, constraints?: Partial<TimestampConstraints>): z.infer<typeof EvidenceValidationResultSchema>;
/**
 * Advanced check: validate evidence against session state
 */
declare function validateAgainstSession(evidence: EvidenceValidationResult, sessionState: string): {
  valid: boolean;
  evidenceId: string;
  errors: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
};
//# sourceMappingURL=validation.d.ts.map
//#endregion
//#region src/normalization.d.ts
/**
 * Canonical timestamp normalized to RFC3339 with microsecond precision
 */
declare function normalizeTimestamp(raw: string | number): string;
/**
 * Platform type
 */
type Platform = 'browser' | 'mobile' | 'desktop' | 'server';
/**
 * Normalize browser scroll event
 */
declare function normalizeBrowserScroll(raw: Record<string, any>): Record<string, unknown>;
/**
 * Normalize browser click event
 */
declare function normalizeBrowserClick(raw: Record<string, any>): Record<string, unknown>;
/**
 * Normalize browser keypress
 */
declare function normalizeBrowserKeypress(raw: Record<string, any>): Record<string, unknown>;
/**
 * Normalize viewport visibility signal
 */
declare function normalizeViewportVisibility(ratio: number): Record<string, unknown>;
/**
 * Normalize browser focus change
 */
declare function normalizeBrowserFocus(focused: boolean, element?: string): Record<string, unknown>;
/**
 * Normalize device motion data
 */
declare function normalizeDeviceMotion(raw: Record<string, any>): Record<string, unknown>;
/**
 * Compute aggregate interaction evidence from a batch of observations
 */
declare function aggregateInteractionEvidence(observations: Observation[]): Record<string, unknown>;
/**
 * Compute aggregate visibility evidence from a batch of observations
 */
declare function aggregateVisibilityEvidence(observations: Observation[]): Record<string, unknown>;
/**
 * Compute minimum viable observation window
 * Returns true if observations span at least signalled duration in milliseconds
 */
declare function meetsMinimumSpan(observations: Observation[], minSpanMs: number): boolean;
//# sourceMappingURL=normalization.d.ts.map
//#endregion
//#region src/pipeline.d.ts
/**
 * Pipeline stage interfaces
 */
interface Stage<TIn, TOut> {
  name: string;
  process(input: TIn, ctx: PipelineContext): Promise<TOut>;
}
interface PipelineContext {
  sessionId: string;
  sessionState: string;
  replayCache: ReplayCache;
  timestampConstraints?: Partial<TimestampConstraints>;
}
/**
 * Validation stage: schema + timestamp + session binding + replay protection
 */
declare class ValidationStage implements Stage<unknown, {
  ok: true;
  evidence: any;
} | {
  ok: false;
  errors: any[];
}> {
  readonly name = "ValidationStage";
  process(input: unknown, ctx: PipelineContext): Promise<{
    ok: boolean;
    errors: any;
    evidence?: undefined;
  } | {
    ok: true;
    evidence: unknown;
    errors?: undefined;
  }>;
}
/**
 * Normalization stage: platform-specific → canonical (pass-through for already canonical)
 */
declare class NormalizationStage implements Stage<{
  ok: true;
  evidence: any;
}, {
  ok: true;
  evidence: any;
} | {
  ok: false;
  errors: any[];
}> {
  readonly name = "NormalizationStage";
  process(input: {
    ok: true;
    evidence: any;
  }, _ctx: PipelineContext): Promise<{
    ok: true;
    evidence: any;
  }>;
}
/**
 * Store stage: persist to append-only store
 */
declare class StoreStage implements Stage<{
  ok: true;
  evidence: any;
}, {
  ok: true;
  stored: boolean;
} | {
  ok: false;
  errors: any[];
}> {
  private store;
  readonly name = "StoreStage";
  constructor(store: {
    append(e: any): Promise<void>;
  });
  process(input: {
    ok: true;
    evidence: any;
  }, _ctx: PipelineContext): Promise<{
    ok: true;
    stored: boolean;
    errors?: undefined;
  } | {
    ok: false;
    errors: {
      code: string;
      message: any;
    }[];
    stored?: undefined;
  }>;
}
/**
 * Full pipeline: validation → normalization → store
 */
declare class Pipeline {
  private readonly replayCache;
  private readonly timestampConstraints?;
  private readonly validation;
  private readonly normalization;
  private storeStage;
  constructor(replayCache?: ReplayCache, timestampConstraints?: Partial<TimestampConstraints> | undefined);
  attachStore(store: {
    append(e: any): Promise<void>;
  }): this;
  run(input: unknown, ctx: Pick<PipelineContext, 'sessionId' | 'sessionState'>): Promise<PipelineResult>;
}
interface PipelineResult {
  stage: 'validation' | 'normalization' | 'store';
  ok: boolean;
  errors?: any[];
  evidenceId?: string;
}
/**
 * Helpers re-exported for convenience
 */

//#endregion
export { DEFAULT_TIMESTAMP_CONSTRAINTS, InMemoryReplayCache, NormalizationStage, Pipeline, PipelineContext, PipelineResult, Platform, ReplayCache, Stage, StoreStage, TimestampConstraints, ValidationErrorCode, ValidationResult, ValidationStage, aggregateInteractionEvidence, aggregateVisibilityEvidence, meetsMinimumSpan, normalizeBrowserClick, normalizeBrowserFocus, normalizeBrowserKeypress, normalizeBrowserScroll, normalizeDeviceMotion, normalizeTimestamp, normalizeViewportVisibility, validateAgainstSession, validateEvidence };
//# sourceMappingURL=index.d.ts.map