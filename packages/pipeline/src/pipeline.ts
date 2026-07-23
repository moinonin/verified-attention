/**
 * Pipeline integration — wires validation → normalization → store
 *
 * Provides a Pipeline class that accepts raw evidence, validates it,
 * optionally normalizes platform observations, and persists to the store.
 */

import {
  validateEvidence,
  validateAgainstSession,
  InMemoryReplayCache,
  type TimestampConstraints,
  type ValidationResult,
  type ReplayCache,
} from './validation';
import {
  normalizeTimestamp,
  aggregateInteractionEvidence,
  aggregateVisibilityEvidence,
  meetsMinimumSpan,
} from './normalization';

/**
 * Pipeline stage interfaces
 */
export interface Stage<TIn, TOut> {
  name: string;
  process(input: TIn, ctx: PipelineContext): Promise<TOut>;
}

export interface PipelineContext {
  sessionId: string;
  sessionState: string;
  replayCache: ReplayCache;
  timestampConstraints?: Partial<TimestampConstraints>;
}

/**
 * Validation stage: schema + timestamp + session binding + replay protection
 */
export class ValidationStage implements Stage<unknown, { ok: true; evidence: any } | { ok: false; errors: any[] }> {
  readonly name = 'ValidationStage';

  async process(input: unknown, ctx: PipelineContext) {
    // Replay check
    const evidenceId = (input as any)?.evidenceId;
    if (evidenceId && await ctx.replayCache.has(evidenceId)) {
      return { ok: false, errors: [{ code: 'DUPLICATE_EVIDENCE', message: `Duplicate evidence: ${evidenceId}` }] };
    }

    // Schema + timestamp validation
    const result = validateEvidence(input, ctx.timestampConstraints);
    if (!result.valid) {
      return { ok: false, errors: result.errors || [] };
    }

    // Session binding
    const sessionResult = validateAgainstSession(result as any, ctx.sessionState);
    if (!sessionResult.valid) {
      return { ok: false, errors: sessionResult.errors };
    }

    // Mark as seen
    if (evidenceId) await ctx.replayCache.add(evidenceId);

    return { ok: true as const, evidence: input };
  }
}

/**
 * Normalization stage: platform-specific → canonical (pass-through for already canonical)
 */
export class NormalizationStage implements Stage<{ ok: true; evidence: any }, { ok: true; evidence: any } | { ok: false; errors: any[] }> {
  readonly name = 'NormalizationStage';

  async process(input: { ok: true; evidence: any }, _ctx: PipelineContext) {
    const evidence = input.evidence;
    // Normalize timestamp if numeric
    if (typeof evidence.timestamp === 'number') {
      evidence.timestamp = normalizeTimestamp(evidence.timestamp);
    }
    return { ok: true as const, evidence };
  }
}

/**
 * Store stage: persist to append-only store
 */
export class StoreStage implements Stage<{ ok: true; evidence: any }, { ok: true; stored: boolean } | { ok: false; errors: any[] }> {
  readonly name = 'StoreStage';

  constructor(private store: { append(e: any): Promise<void> }) {}

  async process(input: { ok: true; evidence: any }, _ctx: PipelineContext) {
    try {
      await this.store.append(input.evidence);
      return { ok: true as const, stored: true };
    } catch (err: any) {
      return { ok: false as const, errors: [{ code: 'STORE_ERROR', message: err.message }] };
    }
  }
}

/**
 * Full pipeline: validation → normalization → store
 */
export class Pipeline {
  private readonly validation = new ValidationStage();
  private readonly normalization = new NormalizationStage();
  private storeStage: StoreStage | null = null;

  constructor(
    private readonly replayCache: ReplayCache = new InMemoryReplayCache(),
    private readonly timestampConstraints?: Partial<TimestampConstraints>,
  ) {}

  attachStore(store: { append(e: any): Promise<void> }): this {
    this.storeStage = new StoreStage(store);
    return this;
  }

  async run(
    input: unknown,
    ctx: Pick<PipelineContext, 'sessionId' | 'sessionState'>,
  ): Promise<PipelineResult> {
    const fullCtx: PipelineContext = {
      ...ctx,
      replayCache: this.replayCache,
      timestampConstraints: this.timestampConstraints,
    };

    // Stage 1: validation
    const vResult = await this.validation.process(input, fullCtx);
    if (!vResult.ok) {
      return { stage: 'validation', ok: false, errors: (vResult as any).errors };
    }

    // Stage 2: normalization
    const nResult = await this.normalization.process(vResult as any, fullCtx);
    if (!nResult.ok) {
      return { stage: 'normalization', ok: false, errors: (nResult as any).errors };
    }

    // Stage 3: store (optional)
    if (this.storeStage) {
      const sResult = await this.storeStage.process(nResult as any, fullCtx);
      if (!sResult.ok) {
        return { stage: 'store', ok: false, errors: (sResult as any).errors };
      }
      return { stage: 'store', ok: true, evidenceId: (input as any).evidenceId };
    }

    return { stage: 'normalization', ok: true, evidenceId: (input as any).evidenceId };
  }
}

export interface PipelineResult {
  stage: 'validation' | 'normalization' | 'store';
  ok: boolean;
  errors?: any[];
  evidenceId?: string;
}

/**
 * Helpers re-exported for convenience
 */
export { aggregateInteractionEvidence, aggregateVisibilityEvidence, meetsMinimumSpan };
