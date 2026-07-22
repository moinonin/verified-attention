import { ContentIdSchema, SessionIdSchema, SignalTypeSchema, SourceIdSchema, TimestampSchema, UUIDSchema } from "./common-Dj79d_i6.mjs";
import { z } from "zod";
import { randomUUID } from "crypto";

//#region src/observation.ts
/**
* Raw observation payload - varies by signal type
*/
const ScrollPayloadSchema = z.object({
	deltaX: z.number(),
	deltaY: z.number(),
	positionX: z.number(),
	positionY: z.number(),
	maxScrollX: z.number().optional(),
	maxScrollY: z.number().optional()
});
const ClickPayloadSchema = z.object({
	elementSelector: z.string().optional(),
	elementTag: z.string().optional(),
	clientX: z.number(),
	clientY: z.number(),
	screenX: z.number().optional(),
	screenY: z.number().optional(),
	button: z.number().optional()
});
const KeyPressPayloadSchema = z.object({
	key: z.string(),
	code: z.string().optional(),
	location: z.number().optional(),
	repeat: z.boolean().optional(),
	isPrintable: z.boolean().optional()
});
const ViewportVisibilityPayloadSchema = z.object({
	visibilityRatio: z.number().min(0).max(1),
	visibleArea: z.number().optional(),
	totalArea: z.number().optional(),
	boundingRect: z.object({
		x: z.number(),
		y: z.number(),
		width: z.number(),
		height: z.number()
	}).optional()
});
const FocusPayloadSchema = z.object({
	elementSelector: z.string().optional(),
	elementTag: z.string().optional(),
	focusType: z.enum([
		"focus",
		"blur",
		"focusin",
		"focusout"
	]).optional()
});
const DeviceMotionPayloadSchema = z.object({
	accelerationX: z.number().optional(),
	accelerationY: z.number().optional(),
	accelerationZ: z.number().optional(),
	rotationAlpha: z.number().optional(),
	rotationBeta: z.number().optional(),
	rotationGamma: z.number().optional()
});
const PageResizePayloadSchema = z.object({
	width: z.number(),
	height: z.number(),
	devicePixelRatio: z.number().optional()
});
const CustomPayloadSchema = z.record(z.unknown());
/**
* Union of all known observation payloads
*/
const ObservationPayloadSchema = z.discriminatedUnion("signalType", [
	z.object({
		signalType: z.literal("SCROLL"),
		payload: ScrollPayloadSchema
	}),
	z.object({
		signalType: z.literal("CLICK"),
		payload: ClickPayloadSchema
	}),
	z.object({
		signalType: z.literal("KEY_PRESS"),
		payload: KeyPressPayloadSchema
	}),
	z.object({
		signalType: z.literal("VIEWPORT_VISIBILITY"),
		payload: ViewportVisibilityPayloadSchema
	}),
	z.object({
		signalType: z.literal("FOCUS"),
		payload: FocusPayloadSchema
	}),
	z.object({
		signalType: z.literal("DEVICE_MOTION"),
		payload: DeviceMotionPayloadSchema
	}),
	z.object({
		signalType: z.literal("PAGE_RESIZE"),
		payload: PageResizePayloadSchema
	}),
	z.object({
		signalType: z.literal("CUSTOM"),
		payload: CustomPayloadSchema
	})
]);
/**
* Observation metadata (required for all observations)
* VAP Section 4: MUST capture observation_id, source, timestamp, signal_type, payload
*/
const ObservationMetaSchema = z.object({
	observationId: UUIDSchema,
	sourceId: SourceIdSchema,
	sessionId: SessionIdSchema,
	contentId: ContentIdSchema,
	timestamp: TimestampSchema,
	signalType: SignalTypeSchema,
	reliabilityWeight: z.number().min(0).max(1).optional(),
	deviceTrust: z.number().min(0).max(1).optional(),
	platform: z.enum([
		"browser",
		"mobile",
		"desktop",
		"server"
	]).optional(),
	userAgentHash: z.string().optional(),
	viewportSize: z.object({
		width: z.number(),
		height: z.number()
	}).optional()
});
/**
* Complete observation object
*/
const ObservationSchema = ObservationMetaSchema.extend({ payload: z.union([
	ScrollPayloadSchema,
	ClickPayloadSchema,
	KeyPressPayloadSchema,
	ViewportVisibilityPayloadSchema,
	FocusPayloadSchema,
	DeviceMotionPayloadSchema,
	PageResizePayloadSchema,
	CustomPayloadSchema
]) });
/**
* Observation lifecycle states (VAP Section 4)
*/
let ObservationState = /* @__PURE__ */ function(ObservationState$1) {
	ObservationState$1["CAPTURED"] = "captured";
	ObservationState$1["VERIFIED"] = "verified";
	ObservationState$1["ATTRIBUTED"] = "attributed";
	ObservationState$1["EMBEDDABLE"] = "embeddable";
	return ObservationState$1;
}({});
const ObservationStateSchema = z.nativeEnum(ObservationState);
/**
* Observation with lifecycle state
*/
const ObservationWithStateSchema = ObservationSchema.extend({
	state: ObservationStateSchema,
	validatedAt: TimestampSchema.optional(),
	attributedAt: TimestampSchema.optional()
});
/**
* Create a new observation with generated ID and timestamp
*/
function createObservation(params) {
	return {
		...params,
		observationId: randomUUID(),
		timestamp: params.timestamp ?? new Date().toISOString()
	};
}
/**
* Normalize observation from platform-specific format to canonical VAP format
* Implementations MUST define this mapping for each platform
*/
function normalizeObservation(platformObservation, platform) {
	throw new Error("normalizeObservation must be implemented per platform");
}
/**
* Observation batch for efficient transport
*/
const ObservationBatchSchema = z.object({
	batchId: UUIDSchema,
	sessionId: SessionIdSchema,
	sourceId: SourceIdSchema,
	observations: z.array(ObservationSchema),
	sentAt: TimestampSchema
});

//#endregion
export { ClickPayloadSchema, CustomPayloadSchema, DeviceMotionPayloadSchema, FocusPayloadSchema, KeyPressPayloadSchema, ObservationBatchSchema, ObservationMetaSchema, ObservationPayloadSchema, ObservationSchema, ObservationState, ObservationStateSchema, ObservationWithStateSchema, PageResizePayloadSchema, ScrollPayloadSchema, ViewportVisibilityPayloadSchema, createObservation, normalizeObservation };
//# sourceMappingURL=observation-DpMkoh1S.mjs.map