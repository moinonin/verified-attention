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
export { EvidenceStoreError, InMemoryEvidenceStore, createEvidenceStore };
//# sourceMappingURL=index.js.map