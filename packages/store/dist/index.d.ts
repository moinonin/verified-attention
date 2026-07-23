//#region src/evidence-store.d.ts
/**
 * Append-only evidence store (VAP Section 3)
 *
 * Evidence stores MUST be append-only. Once evidence is written, it cannot
 * be modified, deleted, or updated. Any correction takes the form of
 * additional supplementary evidence, not edits to existing evidence.
 *
 * VAP Section 5 also requires evidence stores to be indexed by session_id and EVID.
 */
/**
 * Minimal evidence shape required by the store
 * Avoids type identity issues with core package's Evidence type
 */
interface StoredEvidence {
  readonly evidenceId: string;
  readonly sessionId: string;
  readonly sourceId: string;
  readonly timestamp: string;
  readonly evidenceType: string;
  readonly confidence: number;
  readonly payload: unknown;
  readonly provenance: {
    observationIds: string[];
    observationHash: string;
    sourceId: string;
    collectionMethod?: string;
  };
  readonly signature: string;
  readonly metadata?: Record<string, unknown>;
  readonly baseMetadata?: {
    createdAt: string;
    updatedAt?: string;
    version: number;
    tags?: Record<string, string>;
  };
}
type EvidenceId = string;
type SessionId = string;
/**
 * Store options
 */
interface EvidenceStoreOptions {
  /** Maximum entries per session (overflow protection) */
  maxEntriesPerSession?: number;
  /** Whether to emit events on append */
  emitWrite?: boolean;
}
/**
 * Abstract evidence store interface
 */
interface EvidenceStore {
  /** Append evidence record (write-once, no update/delete) */
  append(evidence: StoredEvidence): Promise<void>;
  /** Get evidence by evidence ID (EVID) */
  getByEvidenceId(evidenceId: string): Promise<StoredEvidence | null>;
  /** Get all evidence belonging to a single session */
  getBySession(sessionId: string): Promise<StoredEvidence[]>;
  /** Get count of evidence in the store */
  count(): Promise<number>;
  /** Async iterator paging through evidence entries */
  iterate(pages: number, pageSize?: number): AsyncIterable<StoredEvidence>;
}
/**
 * In-memory evidence store for testing and local development
 */
declare class InMemoryEvidenceStore implements EvidenceStore {
  private readonly _records;
  private readonly _index;
  private readonly maxPerSession;
  constructor(options?: EvidenceStoreOptions);
  append(evidence: StoredEvidence): Promise<void>;
  getByEvidenceId(evidenceId: string): Promise<StoredEvidence | null>;
  getBySession(sessionId: string): Promise<StoredEvidence[]>;
  count(): Promise<number>;
  iterate(_pages?: number, pageSize?: number): AsyncIterable<StoredEvidence>;
}
/**
 * Evidence store specialized errors
 */
declare class EvidenceStoreError extends Error {
  readonly code: 'DUPLICATE' | 'OVERFLOW' | 'MISSING_SESSION';
  constructor(message: string, code: 'DUPLICATE' | 'OVERFLOW' | 'MISSING_SESSION');
}
/**
 * Create an in-memory evidence store with default options
 */
declare function createEvidenceStore(options?: EvidenceStoreOptions): EvidenceStore;
/**
 * Store options
 */
interface EvidenceStoreOptions {
  /** Maximum entries per session (overflow protection) */
  maxEntriesPerSession?: number;
  /** Whether to emit events on append */
  emitWrite?: boolean;
}
//# sourceMappingURL=evidence-store.d.ts.map
//#endregion
export { EvidenceId, EvidenceStore, EvidenceStoreError, EvidenceStoreOptions, InMemoryEvidenceStore, SessionId, StoredEvidence, createEvidenceStore };
//# sourceMappingURL=index.d.ts.map