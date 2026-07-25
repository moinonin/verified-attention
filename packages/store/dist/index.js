//#region src/evidence-store.ts
/**
* In-memory evidence store for testing and local development
*/
var InMemoryEvidenceStore = class {
	_records = new Map();
	_index = new Map();
	maxPerSession;
	constructor(options) {
		this.maxPerSession = options?.maxEntriesPerSession ?? 1e5;
	}
	async append(evidence) {
		if (this._records.has(evidence.evidenceId)) throw new EvidenceStoreError(`Evidence already exists: ${evidence.evidenceId}`, "DUPLICATE");
		const sessionRecords = this._index.get(evidence.sessionId);
		if (sessionRecords !== void 0 && sessionRecords.size + 1 > this.maxPerSession) throw new EvidenceStoreError(`Session ${evidence.sessionId} exceeds max entries ${this.maxPerSession}`, "OVERFLOW");
		this._records.set(evidence.evidenceId, evidence);
		const sessionIds = this._index.get(evidence.sessionId) || new Set();
		sessionIds.add(evidence.evidenceId);
		if (!this._index.has(evidence.sessionId)) this._index.set(evidence.sessionId, sessionIds);
	}
	async getByEvidenceId(evidenceId) {
		const record = this._records.get(evidenceId);
		return record !== void 0 ? record : null;
	}
	async getBySession(sessionId) {
		const set = this._index.get(sessionId);
		if (!set) return [];
		const results = [];
		for (const id of set) {
			const record = this._records.get(id);
			if (record !== void 0) results.push(record);
		}
		results.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
		return results;
	}
	async count() {
		return this._records.size;
	}
	async *iterate(_pages = 100, pageSize) {
		const entries = Array.from(this._records.values());
		const limit = pageSize ?? entries.length;
		for (let i = 0; i < Math.min(entries.length, limit); i++) {
			const entry = entries[i];
			if (entry !== void 0) yield entry;
		}
	}
};
/**
* Evidence store specialized errors
*/
var EvidenceStoreError = class extends Error {
	code;
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "EvidenceStoreError";
	}
};
/**
* Create an in-memory evidence store with default options
*/
function createEvidenceStore(options) {
	return new InMemoryEvidenceStore(options);
}

//#endregion
//#region src/proof-store.ts
/**
* In-memory append-only proof store.
* Replace with persistent storage (Prisma, SQLite, etc.) in production.
*/
const proofStore = new Map();
const sessionIndex = new Map();
const contentIndex = new Map();
let monotonicCounter = 0;
/**
* Store a signed proof. Append-only — rejects duplicate proofId.
*
* @throws Error if a proof with the same proofId already exists
*/
function storeProof(proof) {
	if (proofStore.has(proof.proofId)) throw new Error(`PROOF_EXISTS: proof with id ${proof.proofId} already stored (append-only)`);
	const stored = Object.freeze({
		proof: Object.freeze({ ...proof }),
		storedAt: new Date().toISOString(),
		storageIndex: monotonicCounter++
	});
	proofStore.set(proof.proofId, stored);
	const sessionProofs = sessionIndex.get(proof.sessionId) ?? [];
	sessionProofs.push(proof.proofId);
	sessionIndex.set(proof.sessionId, sessionProofs);
	const contentProofs = contentIndex.get(proof.contentId) ?? [];
	contentProofs.push(proof.proofId);
	contentIndex.set(proof.contentId, contentProofs);
	return stored;
}
/**
* Retrieve a proof by its proofId.
*
* @returns the stored proof with metadata, or undefined if not found
*/
function getProofById(proofId) {
	return proofStore.get(proofId);
}
/**
* List all proofs for a given sessionId, ordered by issuedAt descending.
*
* @returns array of stored proofs for the session
*/
function listProofsBySession(sessionId) {
	const proofIds = sessionIndex.get(sessionId) ?? [];
	return proofIds.map((id) => proofStore.get(id)).filter((p) => p !== void 0).sort((a, b) => {
		const timeA = new Date(a.proof.issuedAt).getTime();
		const timeB = new Date(b.proof.issuedAt).getTime();
		return timeB - timeA;
	});
}
/**
* List all proofs for a given contentId.
*
* @returns array of stored proofs for the content
*/
function listProofsByContent(contentId) {
	const proofIds = contentIndex.get(contentId) ?? [];
	return proofIds.map((id) => proofStore.get(id)).filter((p) => p !== void 0).sort((a, b) => {
		const timeA = new Date(a.proof.issuedAt).getTime();
		const timeB = new Date(b.proof.issuedAt).getTime();
		return timeB - timeA;
	});
}
/**
* Get the total count of stored proofs.
*/
function getProofCount() {
	return proofStore.size;
}
/**
* Clear the store (for testing only — never expose in production).
*/
function _clearStore() {
	proofStore.clear();
	sessionIndex.clear();
	contentIndex.clear();
	monotonicCounter = 0;
}

//#endregion
export { EvidenceStoreError, InMemoryEvidenceStore, _clearStore, createEvidenceStore, getProofById, getProofCount, listProofsByContent, listProofsBySession, storeProof };
//# sourceMappingURL=index.js.map