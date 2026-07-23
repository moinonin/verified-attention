import { z } from "zod";
import { EvidenceSchema, EvidenceValidationResultSchema } from "@verified-attention/core";

//#region src/validation.ts
const DEFAULT_TIMESTAMP_CONSTRAINTS = {
	maxAgeMs: 24 * 60 * 60 * 1e3,
	maxFutureMs: 5 * 60 * 1e3,
	minIntervalMs: 10
};
/**
* Validation error codes following VAP conventions
*/
let ValidationErrorCode = /* @__PURE__ */ function(ValidationErrorCode$1) {
	ValidationErrorCode$1["SCHEMA_INVALID"] = "SCHEMA_INVALID";
	ValidationErrorCode$1["EVIDENCE_EXPIRED"] = "EVIDENCE_EXPIRED";
	ValidationErrorCode$1["FUTURE_TIMESTAMP"] = "FUTURE_TIMESTAMP";
	ValidationErrorCode$1["DUPLICATE_EVIDENCE"] = "DUPLICATE_EVIDENCE";
	ValidationErrorCode$1["INVALID_SESSION"] = "INVALID_SESSION";
	ValidationErrorCode$1["DUPLICATE_INTERVAL"] = "DUPLICATE_INTERVAL";
	ValidationErrorCode$1["MISSING_FIELD"] = "MISSING_FIELD";
	ValidationErrorCode$1["INVALID_SIGNATURE"] = "INVALID_SIGNATURE";
	ValidationErrorCode$1["MALFORMED_ID"] = "MALFORMED_ID";
	return ValidationErrorCode$1;
}({});
/**
* In-memory evidence store for replay protection
*/
var InMemoryReplayCache = class {
	cache = new Map();
	async has(id) {
		return this.cache.has(id);
	}
	async add(id, _ = true) {
		this.cache.set(id, true);
	}
	async prune(maxSize) {
		while (this.cache.size > maxSize) {
			const key = this.cache.keys().next().value;
			if (key) this.cache.delete(key);
		}
	}
	async size() {
		return this.cache.size;
	}
};
/**
* Evidence validation function - validates raw evidence object
*/
function validateEvidence(evidence, constraints) {
	const c = {
		...DEFAULT_TIMESTAMP_CONSTRAINTS,
		...constraints
	};
	const errors = [];
	const result = EvidenceSchema.safeParse(evidence);
	if (!result.success) return {
		valid: false,
		evidenceId: evidence?.evidenceId ?? "unknown",
		errors: result.error.issues.map((i) => ({
			code: i.code,
			message: i.message,
			path: i.path
		}))
	};
	const ev = result.data;
	if (ev.evidenceId === "unknown") errors.push({
		code: "MALFORMED_ID",
		message: "evidenceId is missing or invalid"
	});
	const now = Date.now();
	const evidenceTs = new Date(ev.timestamp).getTime();
	if (evidenceTs > now + c.maxFutureMs) errors.push({
		code: "FUTURE_TIME",
		message: `evidence timestamp is ${evidenceTs - now}ms in the future (max ${c.maxFutureMs}ms)`
	});
	if (now - evidenceTs > c.maxAgeMs) errors.push({
		code: "EVIDENCE_EXPIRED",
		message: `evidence timestamp is ${now - evidenceTs}ms old (max ${c.maxAgeMs}ms)`
	});
	return {
		valid: errors.length === 0,
		evidenceId: ev.evidenceId,
		errors: errors.length > 0 ? errors : void 0
	};
}
/**
* Advanced check: validate evidence against session state
*/
function validateAgainstSession(evidence, sessionState) {
	const result = {
		valid: evidence.valid,
		evidenceId: evidence.evidenceId,
		errors: evidence.errors?.map((e) => ({
			code: e.code,
			message: e.message,
			field: Array.isArray(e.path) ? e.path.join(".") : void 0
		})) || []
	};
	if (sessionState !== "ACTIVE" && sessionState !== "CREATED") {
		result.valid = false;
		result.errors.push({
			code: "INVALID_SESSION",
			message: `Session is in state '${sessionState}'; evidence only accepted for ACTIVE/CREATED`
		});
	}
	return result;
}

//#endregion
//#region src/normalization.ts
/**
* Canonical timestamp normalized to RFC3339 with microsecond precision
*/
function normalizeTimestamp(raw) {
	if (typeof raw === "number") return new Date(raw).toISOString();
	return raw.endsWith("Z") ? raw : raw + "Z";
}
/**
* Normalize browser scroll event
*/
function normalizeBrowserScroll(raw) {
	return {
		signalType: "SCROLL",
		payload: {
			deltaX: Number(raw.deltaX ?? raw.wheelDeltaX ?? 0),
			deltaY: Number(raw.deltaY ?? raw.wheelDeltaY ?? 0),
			positionX: Number(raw.scrollX ?? 0),
			positionY: Number(raw.scrollY ?? 0)
		}
	};
}
/**
* Normalize browser click event
*/
function normalizeBrowserClick(raw) {
	return {
		signalType: "CLICK",
		payload: {
			elementSelector: raw.target?.localName,
			clientX: Number(raw.pageX ?? raw.screenX ?? 0),
			clientY: Number(raw.pageY ?? raw.screenY ?? 0)
		}
	};
}
/**
* Normalize browser keypress
*/
function normalizeBrowserKeypress(raw) {
	return {
		signalType: "KEY_PRESS",
		payload: {
			key: String(raw.key ?? ""),
			code: raw.code ? String(raw.code) : void 0,
			repeat: Boolean(raw.repeat)
		}
	};
}
/**
* Normalize viewport visibility signal
*/
function normalizeViewportVisibility(ratio) {
	return {
		signalType: "VIEWPORT_VISIBILITY",
		payload: { visibilityRatio: Math.max(0, Math.min(1, ratio)) }
	};
}
/**
* Normalize browser focus change
*/
function normalizeBrowserFocus(focused, element) {
	return {
		signalType: "FOCUS",
		payload: {
			focusType: focused ? "focus" : "blur",
			elementSelector: element
		}
	};
}
/**
* Normalize device motion data
*/
function normalizeDeviceMotion(raw) {
	return {
		signalType: "DEVICE_MOTION",
		payload: {
			accelerationX: raw.accelerationX,
			accelerationY: raw.accelerationY,
			accelerationZ: raw.accelerationZ,
			rotationAlpha: raw.rotationRate?.["alpha"],
			rotationBeta: raw.rotationRate?.["beta"],
			rotationGamma: raw.rotationRate?.["gamma"]
		}
	};
}
/**
* Compute aggregate interaction evidence from a batch of observations
*/
function aggregateInteractionEvidence(observations) {
	const clicks = observations.filter((o) => o.signalType === "CLICK").length;
	const keys = observations.filter((o) => o.signalType === "KEY_PRESS").length;
	const scrolls = observations.filter((o) => o.signalType === "SCROLL").length;
	return {
		clickCount: clicks,
		keyPressCount: keys,
		scrollDirectionChanges: Math.min(scrolls, 1),
		engagementScore: Math.min(1, clicks * .05 + keys * .02 + scrolls * .005)
	};
}
/**
* Compute aggregate visibility evidence from a batch of observations
*/
function aggregateVisibilityEvidence(observations) {
	const visibility = observations.filter((o) => o.signalType === "VIEWPORT_VISIBILITY");
	if (visibility.length === 0) return {
		visibleDurationMs: 0,
		maxVisibilityRatio: 0,
		avgVisibilityRatio: 0
	};
	const ratios = [];
	for (const o of visibility) if (typeof o.payload === "object" && o.payload !== null) {
		const r = o.payload.visibilityRatio;
		if (r != null) ratios.push(r);
	}
	const maxRatio = ratios.length ? Math.max(...ratios) : 0;
	const avgRatio = ratios.length ? ratios.reduce((s, v) => s + v, 0) / ratios.length : 0;
	return {
		visibleDurationMs: visibility.length * 1e3,
		maxVisibilityRatio: maxRatio,
		avgVisibilityRatio: avgRatio
	};
}
/**
* Compute minimum viable observation window
* Returns true if observations span at least signalled duration in milliseconds
*/
function meetsMinimumSpan(observations, minSpanMs) {
	if (observations.length < 2) return false;
	const start = new Date(observations[0].timestamp).getTime();
	const end = new Date(observations[observations.length - 1].timestamp).getTime();
	return end - start >= minSpanMs;
}

//#endregion
//#region src/pipeline.ts
/**
* Validation stage: schema + timestamp + session binding + replay protection
*/
var ValidationStage = class {
	name = "ValidationStage";
	async process(input, ctx) {
		const evidenceId = input?.evidenceId;
		if (evidenceId && await ctx.replayCache.has(evidenceId)) return {
			ok: false,
			errors: [{
				code: "DUPLICATE_EVIDENCE",
				message: `Duplicate evidence: ${evidenceId}`
			}]
		};
		const result = validateEvidence(input, ctx.timestampConstraints);
		if (!result.valid) return {
			ok: false,
			errors: result.errors || []
		};
		const sessionResult = validateAgainstSession(result, ctx.sessionState);
		if (!sessionResult.valid) return {
			ok: false,
			errors: sessionResult.errors
		};
		if (evidenceId) await ctx.replayCache.add(evidenceId);
		return {
			ok: true,
			value: input
		};
	}
};
/**
* Normalization stage: platform-specific → canonical (pass-through for already canonical)
*/
var NormalizationStage = class {
	name = "NormalizationStage";
	async process(input, _ctx) {
		if (!input.ok) return input;
		const evidence = input.value;
		const normalizedEvidence = typeof evidence.timestamp === "number" ? {
			...evidence,
			timestamp: normalizeTimestamp(evidence.timestamp)
		} : evidence;
		return {
			ok: true,
			value: normalizedEvidence
		};
	}
};
/**
* Store stage: persist to append-only store
*/
var StoreStage = class {
	name = "StoreStage";
	constructor(store) {
		this.store = store;
	}
	async process(input, _ctx) {
		if (!input.ok) return input;
		try {
			await this.store.append(input.value);
			return {
				ok: true,
				value: true
			};
		} catch (err) {
			return {
				ok: false,
				errors: [{
					code: "STORE_ERROR",
					message: err.message
				}]
			};
		}
	}
};
/**
* Full pipeline: validation → normalization → store
*/
var Pipeline = class {
	validation = new ValidationStage();
	normalization = new NormalizationStage();
	storeStage = null;
	constructor(replayCache = new InMemoryReplayCache(), timestampConstraints) {
		this.replayCache = replayCache;
		this.timestampConstraints = timestampConstraints;
	}
	attachStore(store) {
		this.storeStage = new StoreStage(store);
		return this;
	}
	async run(input, ctx) {
		const fullCtx = {
			...ctx,
			replayCache: this.replayCache,
			timestampConstraints: this.timestampConstraints
		};
		const vResult = await this.validation.process(input, fullCtx);
		if (!vResult.ok) return {
			stage: "validation",
			ok: false,
			errors: vResult.errors
		};
		const nResult = await this.normalization.process(vResult, fullCtx);
		if (!nResult.ok) return {
			stage: "normalization",
			ok: false,
			errors: nResult.errors
		};
		if (this.storeStage) {
			const sResult = await this.storeStage.process(nResult, fullCtx);
			if (!sResult.ok) return {
				stage: "store",
				ok: false,
				errors: sResult.errors
			};
			return {
				stage: "store",
				ok: true,
				evidenceId: input.evidenceId
			};
		}
		return {
			stage: "normalization",
			ok: true,
			evidenceId: input.evidenceId
		};
	}
};

//#endregion
export { DEFAULT_TIMESTAMP_CONSTRAINTS, InMemoryReplayCache, NormalizationStage, Pipeline, StoreStage, ValidationErrorCode, ValidationStage, aggregateInteractionEvidence, aggregateVisibilityEvidence, meetsMinimumSpan, normalizeBrowserClick, normalizeBrowserFocus, normalizeBrowserKeypress, normalizeBrowserScroll, normalizeDeviceMotion, normalizeTimestamp, normalizeViewportVisibility, validateAgainstSession, validateEvidence };
//# sourceMappingURL=index.js.map