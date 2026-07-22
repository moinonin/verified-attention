import { SignalType$1 as SignalType } from "./common-DCxousWR.mjs";
import { z } from "zod";

//#region src/observation.d.ts

/**
 * Raw observation payload - varies by signal type
 */
declare const ScrollPayloadSchema: z.ZodObject<{
  deltaX: z.ZodNumber;
  deltaY: z.ZodNumber;
  positionX: z.ZodNumber;
  positionY: z.ZodNumber;
  maxScrollX: z.ZodOptional<z.ZodNumber>;
  maxScrollY: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
  deltaX: number;
  deltaY: number;
  positionX: number;
  positionY: number;
  maxScrollX?: number | undefined;
  maxScrollY?: number | undefined;
}, {
  deltaX: number;
  deltaY: number;
  positionX: number;
  positionY: number;
  maxScrollX?: number | undefined;
  maxScrollY?: number | undefined;
}>;
declare const ClickPayloadSchema: z.ZodObject<{
  elementSelector: z.ZodOptional<z.ZodString>;
  elementTag: z.ZodOptional<z.ZodString>;
  clientX: z.ZodNumber;
  clientY: z.ZodNumber;
  screenX: z.ZodOptional<z.ZodNumber>;
  screenY: z.ZodOptional<z.ZodNumber>;
  button: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
  clientX: number;
  clientY: number;
  elementSelector?: string | undefined;
  elementTag?: string | undefined;
  screenX?: number | undefined;
  screenY?: number | undefined;
  button?: number | undefined;
}, {
  clientX: number;
  clientY: number;
  elementSelector?: string | undefined;
  elementTag?: string | undefined;
  screenX?: number | undefined;
  screenY?: number | undefined;
  button?: number | undefined;
}>;
declare const KeyPressPayloadSchema: z.ZodObject<{
  key: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
  location: z.ZodOptional<z.ZodNumber>;
  repeat: z.ZodOptional<z.ZodBoolean>;
  isPrintable: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
  key: string;
  code?: string | undefined;
  location?: number | undefined;
  repeat?: boolean | undefined;
  isPrintable?: boolean | undefined;
}, {
  key: string;
  code?: string | undefined;
  location?: number | undefined;
  repeat?: boolean | undefined;
  isPrintable?: boolean | undefined;
}>;
declare const ViewportVisibilityPayloadSchema: z.ZodObject<{
  visibilityRatio: z.ZodNumber;
  visibleArea: z.ZodOptional<z.ZodNumber>;
  totalArea: z.ZodOptional<z.ZodNumber>;
  boundingRect: z.ZodOptional<z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodNumber;
    height: z.ZodNumber;
  }, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    x: number;
    y: number;
  }, {
    width: number;
    height: number;
    x: number;
    y: number;
  }>>;
}, "strip", z.ZodTypeAny, {
  visibilityRatio: number;
  visibleArea?: number | undefined;
  totalArea?: number | undefined;
  boundingRect?: {
    width: number;
    height: number;
    x: number;
    y: number;
  } | undefined;
}, {
  visibilityRatio: number;
  visibleArea?: number | undefined;
  totalArea?: number | undefined;
  boundingRect?: {
    width: number;
    height: number;
    x: number;
    y: number;
  } | undefined;
}>;
declare const FocusPayloadSchema: z.ZodObject<{
  elementSelector: z.ZodOptional<z.ZodString>;
  elementTag: z.ZodOptional<z.ZodString>;
  focusType: z.ZodOptional<z.ZodEnum<["focus", "blur", "focusin", "focusout"]>>;
}, "strip", z.ZodTypeAny, {
  elementSelector?: string | undefined;
  elementTag?: string | undefined;
  focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
}, {
  elementSelector?: string | undefined;
  elementTag?: string | undefined;
  focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
}>;
declare const DeviceMotionPayloadSchema: z.ZodObject<{
  accelerationX: z.ZodOptional<z.ZodNumber>;
  accelerationY: z.ZodOptional<z.ZodNumber>;
  accelerationZ: z.ZodOptional<z.ZodNumber>;
  rotationAlpha: z.ZodOptional<z.ZodNumber>;
  rotationBeta: z.ZodOptional<z.ZodNumber>;
  rotationGamma: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
  accelerationX?: number | undefined;
  accelerationY?: number | undefined;
  accelerationZ?: number | undefined;
  rotationAlpha?: number | undefined;
  rotationBeta?: number | undefined;
  rotationGamma?: number | undefined;
}, {
  accelerationX?: number | undefined;
  accelerationY?: number | undefined;
  accelerationZ?: number | undefined;
  rotationAlpha?: number | undefined;
  rotationBeta?: number | undefined;
  rotationGamma?: number | undefined;
}>;
declare const PageResizePayloadSchema: z.ZodObject<{
  width: z.ZodNumber;
  height: z.ZodNumber;
  devicePixelRatio: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
  width: number;
  height: number;
  devicePixelRatio?: number | undefined;
}, {
  width: number;
  height: number;
  devicePixelRatio?: number | undefined;
}>;
declare const CustomPayloadSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
/**
 * Union of all known observation payloads
 */
declare const ObservationPayloadSchema: z.ZodDiscriminatedUnion<"signalType", [z.ZodObject<{
  signalType: z.ZodLiteral<"SCROLL">;
  payload: z.ZodObject<{
    deltaX: z.ZodNumber;
    deltaY: z.ZodNumber;
    positionX: z.ZodNumber;
    positionY: z.ZodNumber;
    maxScrollX: z.ZodOptional<z.ZodNumber>;
    maxScrollY: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  }, {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  }>;
}, "strip", z.ZodTypeAny, {
  payload: {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  };
  signalType: "SCROLL";
}, {
  payload: {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  };
  signalType: "SCROLL";
}>, z.ZodObject<{
  signalType: z.ZodLiteral<"CLICK">;
  payload: z.ZodObject<{
    elementSelector: z.ZodOptional<z.ZodString>;
    elementTag: z.ZodOptional<z.ZodString>;
    clientX: z.ZodNumber;
    clientY: z.ZodNumber;
    screenX: z.ZodOptional<z.ZodNumber>;
    screenY: z.ZodOptional<z.ZodNumber>;
    button: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  }, {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  }>;
}, "strip", z.ZodTypeAny, {
  payload: {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  };
  signalType: "CLICK";
}, {
  payload: {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  };
  signalType: "CLICK";
}>, z.ZodObject<{
  signalType: z.ZodLiteral<"KEY_PRESS">;
  payload: z.ZodObject<{
    key: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodNumber>;
    repeat: z.ZodOptional<z.ZodBoolean>;
    isPrintable: z.ZodOptional<z.ZodBoolean>;
  }, "strip", z.ZodTypeAny, {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  }, {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  }>;
}, "strip", z.ZodTypeAny, {
  payload: {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  };
  signalType: "KEY_PRESS";
}, {
  payload: {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  };
  signalType: "KEY_PRESS";
}>, z.ZodObject<{
  signalType: z.ZodLiteral<"VIEWPORT_VISIBILITY">;
  payload: z.ZodObject<{
    visibilityRatio: z.ZodNumber;
    visibleArea: z.ZodOptional<z.ZodNumber>;
    totalArea: z.ZodOptional<z.ZodNumber>;
    boundingRect: z.ZodOptional<z.ZodObject<{
      x: z.ZodNumber;
      y: z.ZodNumber;
      width: z.ZodNumber;
      height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
      width: number;
      height: number;
      x: number;
      y: number;
    }, {
      width: number;
      height: number;
      x: number;
      y: number;
    }>>;
  }, "strip", z.ZodTypeAny, {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  }, {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  }>;
}, "strip", z.ZodTypeAny, {
  payload: {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  };
  signalType: "VIEWPORT_VISIBILITY";
}, {
  payload: {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  };
  signalType: "VIEWPORT_VISIBILITY";
}>, z.ZodObject<{
  signalType: z.ZodLiteral<"FOCUS">;
  payload: z.ZodObject<{
    elementSelector: z.ZodOptional<z.ZodString>;
    elementTag: z.ZodOptional<z.ZodString>;
    focusType: z.ZodOptional<z.ZodEnum<["focus", "blur", "focusin", "focusout"]>>;
  }, "strip", z.ZodTypeAny, {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  }, {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  }>;
}, "strip", z.ZodTypeAny, {
  payload: {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  };
  signalType: "FOCUS";
}, {
  payload: {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  };
  signalType: "FOCUS";
}>, z.ZodObject<{
  signalType: z.ZodLiteral<"DEVICE_MOTION">;
  payload: z.ZodObject<{
    accelerationX: z.ZodOptional<z.ZodNumber>;
    accelerationY: z.ZodOptional<z.ZodNumber>;
    accelerationZ: z.ZodOptional<z.ZodNumber>;
    rotationAlpha: z.ZodOptional<z.ZodNumber>;
    rotationBeta: z.ZodOptional<z.ZodNumber>;
    rotationGamma: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  }, {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  }>;
}, "strip", z.ZodTypeAny, {
  payload: {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  };
  signalType: "DEVICE_MOTION";
}, {
  payload: {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  };
  signalType: "DEVICE_MOTION";
}>, z.ZodObject<{
  signalType: z.ZodLiteral<"PAGE_RESIZE">;
  payload: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    devicePixelRatio: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  }, {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  }>;
}, "strip", z.ZodTypeAny, {
  payload: {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  };
  signalType: "PAGE_RESIZE";
}, {
  payload: {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  };
  signalType: "PAGE_RESIZE";
}>, z.ZodObject<{
  signalType: z.ZodLiteral<"CUSTOM">;
  payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  payload: Record<string, unknown>;
  signalType: "CUSTOM";
}, {
  payload: Record<string, unknown>;
  signalType: "CUSTOM";
}>]>;
type ObservationPayload = z.infer<typeof ObservationPayloadSchema>;
/**
 * Observation metadata (required for all observations)
 * VAP Section 4: MUST capture observation_id, source, timestamp, signal_type, payload
 */
declare const ObservationMetaSchema: z.ZodObject<{
  observationId: z.ZodString;
  sourceId: z.ZodString;
  sessionId: z.ZodString;
  contentId: z.ZodString;
  timestamp: z.ZodString;
  signalType: z.ZodNativeEnum<typeof SignalType>;
  reliabilityWeight: z.ZodOptional<z.ZodNumber>;
  deviceTrust: z.ZodOptional<z.ZodNumber>;
  platform: z.ZodOptional<z.ZodEnum<["browser", "mobile", "desktop", "server"]>>;
  userAgentHash: z.ZodOptional<z.ZodString>;
  viewportSize: z.ZodOptional<z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
  }, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
  }, {
    width: number;
    height: number;
  }>>;
}, "strip", z.ZodTypeAny, {
  sessionId: string;
  contentId: string;
  timestamp: string;
  sourceId: string;
  signalType: SignalType;
  observationId: string;
  platform?: "browser" | "mobile" | "desktop" | "server" | undefined;
  viewportSize?: {
    width: number;
    height: number;
  } | undefined;
  reliabilityWeight?: number | undefined;
  deviceTrust?: number | undefined;
  userAgentHash?: string | undefined;
}, {
  sessionId: string;
  contentId: string;
  timestamp: string;
  sourceId: string;
  signalType: SignalType;
  observationId: string;
  platform?: "browser" | "mobile" | "desktop" | "server" | undefined;
  viewportSize?: {
    width: number;
    height: number;
  } | undefined;
  reliabilityWeight?: number | undefined;
  deviceTrust?: number | undefined;
  userAgentHash?: string | undefined;
}>;
type ObservationMeta = z.infer<typeof ObservationMetaSchema>;
/**
 * Complete observation object
 */
declare const ObservationSchema: z.ZodObject<{
  observationId: z.ZodString;
  sourceId: z.ZodString;
  sessionId: z.ZodString;
  contentId: z.ZodString;
  timestamp: z.ZodString;
  signalType: z.ZodNativeEnum<typeof SignalType>;
  reliabilityWeight: z.ZodOptional<z.ZodNumber>;
  deviceTrust: z.ZodOptional<z.ZodNumber>;
  platform: z.ZodOptional<z.ZodEnum<["browser", "mobile", "desktop", "server"]>>;
  userAgentHash: z.ZodOptional<z.ZodString>;
  viewportSize: z.ZodOptional<z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
  }, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
  }, {
    width: number;
    height: number;
  }>>;
} & {
  payload: z.ZodUnion<[z.ZodObject<{
    deltaX: z.ZodNumber;
    deltaY: z.ZodNumber;
    positionX: z.ZodNumber;
    positionY: z.ZodNumber;
    maxScrollX: z.ZodOptional<z.ZodNumber>;
    maxScrollY: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  }, {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  }>, z.ZodObject<{
    elementSelector: z.ZodOptional<z.ZodString>;
    elementTag: z.ZodOptional<z.ZodString>;
    clientX: z.ZodNumber;
    clientY: z.ZodNumber;
    screenX: z.ZodOptional<z.ZodNumber>;
    screenY: z.ZodOptional<z.ZodNumber>;
    button: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  }, {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  }>, z.ZodObject<{
    key: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodNumber>;
    repeat: z.ZodOptional<z.ZodBoolean>;
    isPrintable: z.ZodOptional<z.ZodBoolean>;
  }, "strip", z.ZodTypeAny, {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  }, {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  }>, z.ZodObject<{
    visibilityRatio: z.ZodNumber;
    visibleArea: z.ZodOptional<z.ZodNumber>;
    totalArea: z.ZodOptional<z.ZodNumber>;
    boundingRect: z.ZodOptional<z.ZodObject<{
      x: z.ZodNumber;
      y: z.ZodNumber;
      width: z.ZodNumber;
      height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
      width: number;
      height: number;
      x: number;
      y: number;
    }, {
      width: number;
      height: number;
      x: number;
      y: number;
    }>>;
  }, "strip", z.ZodTypeAny, {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  }, {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  }>, z.ZodObject<{
    elementSelector: z.ZodOptional<z.ZodString>;
    elementTag: z.ZodOptional<z.ZodString>;
    focusType: z.ZodOptional<z.ZodEnum<["focus", "blur", "focusin", "focusout"]>>;
  }, "strip", z.ZodTypeAny, {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  }, {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  }>, z.ZodObject<{
    accelerationX: z.ZodOptional<z.ZodNumber>;
    accelerationY: z.ZodOptional<z.ZodNumber>;
    accelerationZ: z.ZodOptional<z.ZodNumber>;
    rotationAlpha: z.ZodOptional<z.ZodNumber>;
    rotationBeta: z.ZodOptional<z.ZodNumber>;
    rotationGamma: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  }, {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  }>, z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    devicePixelRatio: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  }, {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  }>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>;
}, "strip", z.ZodTypeAny, {
  sessionId: string;
  contentId: string;
  timestamp: string;
  payload: Record<string, unknown> | {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  } | {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  } | {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  } | {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  } | {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  } | {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  } | {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  };
  sourceId: string;
  signalType: SignalType;
  observationId: string;
  platform?: "browser" | "mobile" | "desktop" | "server" | undefined;
  viewportSize?: {
    width: number;
    height: number;
  } | undefined;
  reliabilityWeight?: number | undefined;
  deviceTrust?: number | undefined;
  userAgentHash?: string | undefined;
}, {
  sessionId: string;
  contentId: string;
  timestamp: string;
  payload: Record<string, unknown> | {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  } | {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  } | {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  } | {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  } | {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  } | {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  } | {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  };
  sourceId: string;
  signalType: SignalType;
  observationId: string;
  platform?: "browser" | "mobile" | "desktop" | "server" | undefined;
  viewportSize?: {
    width: number;
    height: number;
  } | undefined;
  reliabilityWeight?: number | undefined;
  deviceTrust?: number | undefined;
  userAgentHash?: string | undefined;
}>;
type Observation = z.infer<typeof ObservationSchema>;
/**
 * Observation lifecycle states (VAP Section 4)
 */
declare enum ObservationState {
  CAPTURED = "captured",
  VERIFIED = "verified",
  ATTRIBUTED = "attributed",
  EMBEDDABLE = "embeddable",
}
declare const ObservationStateSchema: z.ZodNativeEnum<typeof ObservationState>;
/**
 * Observation with lifecycle state
 */
declare const ObservationWithStateSchema: z.ZodObject<{
  observationId: z.ZodString;
  sourceId: z.ZodString;
  sessionId: z.ZodString;
  contentId: z.ZodString;
  timestamp: z.ZodString;
  signalType: z.ZodNativeEnum<typeof SignalType>;
  reliabilityWeight: z.ZodOptional<z.ZodNumber>;
  deviceTrust: z.ZodOptional<z.ZodNumber>;
  platform: z.ZodOptional<z.ZodEnum<["browser", "mobile", "desktop", "server"]>>;
  userAgentHash: z.ZodOptional<z.ZodString>;
  viewportSize: z.ZodOptional<z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
  }, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
  }, {
    width: number;
    height: number;
  }>>;
} & {
  payload: z.ZodUnion<[z.ZodObject<{
    deltaX: z.ZodNumber;
    deltaY: z.ZodNumber;
    positionX: z.ZodNumber;
    positionY: z.ZodNumber;
    maxScrollX: z.ZodOptional<z.ZodNumber>;
    maxScrollY: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  }, {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  }>, z.ZodObject<{
    elementSelector: z.ZodOptional<z.ZodString>;
    elementTag: z.ZodOptional<z.ZodString>;
    clientX: z.ZodNumber;
    clientY: z.ZodNumber;
    screenX: z.ZodOptional<z.ZodNumber>;
    screenY: z.ZodOptional<z.ZodNumber>;
    button: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  }, {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  }>, z.ZodObject<{
    key: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodNumber>;
    repeat: z.ZodOptional<z.ZodBoolean>;
    isPrintable: z.ZodOptional<z.ZodBoolean>;
  }, "strip", z.ZodTypeAny, {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  }, {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  }>, z.ZodObject<{
    visibilityRatio: z.ZodNumber;
    visibleArea: z.ZodOptional<z.ZodNumber>;
    totalArea: z.ZodOptional<z.ZodNumber>;
    boundingRect: z.ZodOptional<z.ZodObject<{
      x: z.ZodNumber;
      y: z.ZodNumber;
      width: z.ZodNumber;
      height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
      width: number;
      height: number;
      x: number;
      y: number;
    }, {
      width: number;
      height: number;
      x: number;
      y: number;
    }>>;
  }, "strip", z.ZodTypeAny, {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  }, {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  }>, z.ZodObject<{
    elementSelector: z.ZodOptional<z.ZodString>;
    elementTag: z.ZodOptional<z.ZodString>;
    focusType: z.ZodOptional<z.ZodEnum<["focus", "blur", "focusin", "focusout"]>>;
  }, "strip", z.ZodTypeAny, {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  }, {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  }>, z.ZodObject<{
    accelerationX: z.ZodOptional<z.ZodNumber>;
    accelerationY: z.ZodOptional<z.ZodNumber>;
    accelerationZ: z.ZodOptional<z.ZodNumber>;
    rotationAlpha: z.ZodOptional<z.ZodNumber>;
    rotationBeta: z.ZodOptional<z.ZodNumber>;
    rotationGamma: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  }, {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  }>, z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    devicePixelRatio: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  }, {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  }>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>;
} & {
  state: z.ZodNativeEnum<typeof ObservationState>;
  validatedAt: z.ZodOptional<z.ZodString>;
  attributedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
  sessionId: string;
  contentId: string;
  state: ObservationState;
  timestamp: string;
  payload: Record<string, unknown> | {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  } | {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  } | {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  } | {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  } | {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  } | {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  } | {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  };
  sourceId: string;
  signalType: SignalType;
  observationId: string;
  platform?: "browser" | "mobile" | "desktop" | "server" | undefined;
  viewportSize?: {
    width: number;
    height: number;
  } | undefined;
  validatedAt?: string | undefined;
  reliabilityWeight?: number | undefined;
  deviceTrust?: number | undefined;
  userAgentHash?: string | undefined;
  attributedAt?: string | undefined;
}, {
  sessionId: string;
  contentId: string;
  state: ObservationState;
  timestamp: string;
  payload: Record<string, unknown> | {
    deltaX: number;
    deltaY: number;
    positionX: number;
    positionY: number;
    maxScrollX?: number | undefined;
    maxScrollY?: number | undefined;
  } | {
    clientX: number;
    clientY: number;
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    screenX?: number | undefined;
    screenY?: number | undefined;
    button?: number | undefined;
  } | {
    key: string;
    code?: string | undefined;
    location?: number | undefined;
    repeat?: boolean | undefined;
    isPrintable?: boolean | undefined;
  } | {
    visibilityRatio: number;
    visibleArea?: number | undefined;
    totalArea?: number | undefined;
    boundingRect?: {
      width: number;
      height: number;
      x: number;
      y: number;
    } | undefined;
  } | {
    elementSelector?: string | undefined;
    elementTag?: string | undefined;
    focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
  } | {
    accelerationX?: number | undefined;
    accelerationY?: number | undefined;
    accelerationZ?: number | undefined;
    rotationAlpha?: number | undefined;
    rotationBeta?: number | undefined;
    rotationGamma?: number | undefined;
  } | {
    width: number;
    height: number;
    devicePixelRatio?: number | undefined;
  };
  sourceId: string;
  signalType: SignalType;
  observationId: string;
  platform?: "browser" | "mobile" | "desktop" | "server" | undefined;
  viewportSize?: {
    width: number;
    height: number;
  } | undefined;
  validatedAt?: string | undefined;
  reliabilityWeight?: number | undefined;
  deviceTrust?: number | undefined;
  userAgentHash?: string | undefined;
  attributedAt?: string | undefined;
}>;
type ObservationWithState = z.infer<typeof ObservationWithStateSchema>;
/**
 * Create a new observation with generated ID and timestamp
 */
declare function createObservation(params: Omit<Observation, 'observationId' | 'timestamp'> & {
  timestamp?: string;
}): Observation;
/**
 * Normalize observation from platform-specific format to canonical VAP format
 * Implementations MUST define this mapping for each platform
 */
declare function normalizeObservation(platformObservation: unknown, platform: 'browser' | 'mobile' | 'desktop' | 'server'): Observation;
/**
 * Observation batch for efficient transport
 */
declare const ObservationBatchSchema: z.ZodObject<{
  batchId: z.ZodString;
  sessionId: z.ZodString;
  sourceId: z.ZodString;
  observations: z.ZodArray<z.ZodObject<{
    observationId: z.ZodString;
    sourceId: z.ZodString;
    sessionId: z.ZodString;
    contentId: z.ZodString;
    timestamp: z.ZodString;
    signalType: z.ZodNativeEnum<typeof SignalType>;
    reliabilityWeight: z.ZodOptional<z.ZodNumber>;
    deviceTrust: z.ZodOptional<z.ZodNumber>;
    platform: z.ZodOptional<z.ZodEnum<["browser", "mobile", "desktop", "server"]>>;
    userAgentHash: z.ZodOptional<z.ZodString>;
    viewportSize: z.ZodOptional<z.ZodObject<{
      width: z.ZodNumber;
      height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
      width: number;
      height: number;
    }, {
      width: number;
      height: number;
    }>>;
  } & {
    payload: z.ZodUnion<[z.ZodObject<{
      deltaX: z.ZodNumber;
      deltaY: z.ZodNumber;
      positionX: z.ZodNumber;
      positionY: z.ZodNumber;
      maxScrollX: z.ZodOptional<z.ZodNumber>;
      maxScrollY: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
      deltaX: number;
      deltaY: number;
      positionX: number;
      positionY: number;
      maxScrollX?: number | undefined;
      maxScrollY?: number | undefined;
    }, {
      deltaX: number;
      deltaY: number;
      positionX: number;
      positionY: number;
      maxScrollX?: number | undefined;
      maxScrollY?: number | undefined;
    }>, z.ZodObject<{
      elementSelector: z.ZodOptional<z.ZodString>;
      elementTag: z.ZodOptional<z.ZodString>;
      clientX: z.ZodNumber;
      clientY: z.ZodNumber;
      screenX: z.ZodOptional<z.ZodNumber>;
      screenY: z.ZodOptional<z.ZodNumber>;
      button: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
      clientX: number;
      clientY: number;
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      screenX?: number | undefined;
      screenY?: number | undefined;
      button?: number | undefined;
    }, {
      clientX: number;
      clientY: number;
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      screenX?: number | undefined;
      screenY?: number | undefined;
      button?: number | undefined;
    }>, z.ZodObject<{
      key: z.ZodString;
      code: z.ZodOptional<z.ZodString>;
      location: z.ZodOptional<z.ZodNumber>;
      repeat: z.ZodOptional<z.ZodBoolean>;
      isPrintable: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
      key: string;
      code?: string | undefined;
      location?: number | undefined;
      repeat?: boolean | undefined;
      isPrintable?: boolean | undefined;
    }, {
      key: string;
      code?: string | undefined;
      location?: number | undefined;
      repeat?: boolean | undefined;
      isPrintable?: boolean | undefined;
    }>, z.ZodObject<{
      visibilityRatio: z.ZodNumber;
      visibleArea: z.ZodOptional<z.ZodNumber>;
      totalArea: z.ZodOptional<z.ZodNumber>;
      boundingRect: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
      }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        x: number;
        y: number;
      }, {
        width: number;
        height: number;
        x: number;
        y: number;
      }>>;
    }, "strip", z.ZodTypeAny, {
      visibilityRatio: number;
      visibleArea?: number | undefined;
      totalArea?: number | undefined;
      boundingRect?: {
        width: number;
        height: number;
        x: number;
        y: number;
      } | undefined;
    }, {
      visibilityRatio: number;
      visibleArea?: number | undefined;
      totalArea?: number | undefined;
      boundingRect?: {
        width: number;
        height: number;
        x: number;
        y: number;
      } | undefined;
    }>, z.ZodObject<{
      elementSelector: z.ZodOptional<z.ZodString>;
      elementTag: z.ZodOptional<z.ZodString>;
      focusType: z.ZodOptional<z.ZodEnum<["focus", "blur", "focusin", "focusout"]>>;
    }, "strip", z.ZodTypeAny, {
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
    }, {
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
    }>, z.ZodObject<{
      accelerationX: z.ZodOptional<z.ZodNumber>;
      accelerationY: z.ZodOptional<z.ZodNumber>;
      accelerationZ: z.ZodOptional<z.ZodNumber>;
      rotationAlpha: z.ZodOptional<z.ZodNumber>;
      rotationBeta: z.ZodOptional<z.ZodNumber>;
      rotationGamma: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
      accelerationX?: number | undefined;
      accelerationY?: number | undefined;
      accelerationZ?: number | undefined;
      rotationAlpha?: number | undefined;
      rotationBeta?: number | undefined;
      rotationGamma?: number | undefined;
    }, {
      accelerationX?: number | undefined;
      accelerationY?: number | undefined;
      accelerationZ?: number | undefined;
      rotationAlpha?: number | undefined;
      rotationBeta?: number | undefined;
      rotationGamma?: number | undefined;
    }>, z.ZodObject<{
      width: z.ZodNumber;
      height: z.ZodNumber;
      devicePixelRatio: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
      width: number;
      height: number;
      devicePixelRatio?: number | undefined;
    }, {
      width: number;
      height: number;
      devicePixelRatio?: number | undefined;
    }>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>;
  }, "strip", z.ZodTypeAny, {
    sessionId: string;
    contentId: string;
    timestamp: string;
    payload: Record<string, unknown> | {
      deltaX: number;
      deltaY: number;
      positionX: number;
      positionY: number;
      maxScrollX?: number | undefined;
      maxScrollY?: number | undefined;
    } | {
      clientX: number;
      clientY: number;
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      screenX?: number | undefined;
      screenY?: number | undefined;
      button?: number | undefined;
    } | {
      key: string;
      code?: string | undefined;
      location?: number | undefined;
      repeat?: boolean | undefined;
      isPrintable?: boolean | undefined;
    } | {
      visibilityRatio: number;
      visibleArea?: number | undefined;
      totalArea?: number | undefined;
      boundingRect?: {
        width: number;
        height: number;
        x: number;
        y: number;
      } | undefined;
    } | {
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
    } | {
      accelerationX?: number | undefined;
      accelerationY?: number | undefined;
      accelerationZ?: number | undefined;
      rotationAlpha?: number | undefined;
      rotationBeta?: number | undefined;
      rotationGamma?: number | undefined;
    } | {
      width: number;
      height: number;
      devicePixelRatio?: number | undefined;
    };
    sourceId: string;
    signalType: SignalType;
    observationId: string;
    platform?: "browser" | "mobile" | "desktop" | "server" | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    reliabilityWeight?: number | undefined;
    deviceTrust?: number | undefined;
    userAgentHash?: string | undefined;
  }, {
    sessionId: string;
    contentId: string;
    timestamp: string;
    payload: Record<string, unknown> | {
      deltaX: number;
      deltaY: number;
      positionX: number;
      positionY: number;
      maxScrollX?: number | undefined;
      maxScrollY?: number | undefined;
    } | {
      clientX: number;
      clientY: number;
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      screenX?: number | undefined;
      screenY?: number | undefined;
      button?: number | undefined;
    } | {
      key: string;
      code?: string | undefined;
      location?: number | undefined;
      repeat?: boolean | undefined;
      isPrintable?: boolean | undefined;
    } | {
      visibilityRatio: number;
      visibleArea?: number | undefined;
      totalArea?: number | undefined;
      boundingRect?: {
        width: number;
        height: number;
        x: number;
        y: number;
      } | undefined;
    } | {
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
    } | {
      accelerationX?: number | undefined;
      accelerationY?: number | undefined;
      accelerationZ?: number | undefined;
      rotationAlpha?: number | undefined;
      rotationBeta?: number | undefined;
      rotationGamma?: number | undefined;
    } | {
      width: number;
      height: number;
      devicePixelRatio?: number | undefined;
    };
    sourceId: string;
    signalType: SignalType;
    observationId: string;
    platform?: "browser" | "mobile" | "desktop" | "server" | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    reliabilityWeight?: number | undefined;
    deviceTrust?: number | undefined;
    userAgentHash?: string | undefined;
  }>, "many">;
  sentAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
  sessionId: string;
  sourceId: string;
  batchId: string;
  observations: {
    sessionId: string;
    contentId: string;
    timestamp: string;
    payload: Record<string, unknown> | {
      deltaX: number;
      deltaY: number;
      positionX: number;
      positionY: number;
      maxScrollX?: number | undefined;
      maxScrollY?: number | undefined;
    } | {
      clientX: number;
      clientY: number;
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      screenX?: number | undefined;
      screenY?: number | undefined;
      button?: number | undefined;
    } | {
      key: string;
      code?: string | undefined;
      location?: number | undefined;
      repeat?: boolean | undefined;
      isPrintable?: boolean | undefined;
    } | {
      visibilityRatio: number;
      visibleArea?: number | undefined;
      totalArea?: number | undefined;
      boundingRect?: {
        width: number;
        height: number;
        x: number;
        y: number;
      } | undefined;
    } | {
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
    } | {
      accelerationX?: number | undefined;
      accelerationY?: number | undefined;
      accelerationZ?: number | undefined;
      rotationAlpha?: number | undefined;
      rotationBeta?: number | undefined;
      rotationGamma?: number | undefined;
    } | {
      width: number;
      height: number;
      devicePixelRatio?: number | undefined;
    };
    sourceId: string;
    signalType: SignalType;
    observationId: string;
    platform?: "browser" | "mobile" | "desktop" | "server" | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    reliabilityWeight?: number | undefined;
    deviceTrust?: number | undefined;
    userAgentHash?: string | undefined;
  }[];
  sentAt: string;
}, {
  sessionId: string;
  sourceId: string;
  batchId: string;
  observations: {
    sessionId: string;
    contentId: string;
    timestamp: string;
    payload: Record<string, unknown> | {
      deltaX: number;
      deltaY: number;
      positionX: number;
      positionY: number;
      maxScrollX?: number | undefined;
      maxScrollY?: number | undefined;
    } | {
      clientX: number;
      clientY: number;
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      screenX?: number | undefined;
      screenY?: number | undefined;
      button?: number | undefined;
    } | {
      key: string;
      code?: string | undefined;
      location?: number | undefined;
      repeat?: boolean | undefined;
      isPrintable?: boolean | undefined;
    } | {
      visibilityRatio: number;
      visibleArea?: number | undefined;
      totalArea?: number | undefined;
      boundingRect?: {
        width: number;
        height: number;
        x: number;
        y: number;
      } | undefined;
    } | {
      elementSelector?: string | undefined;
      elementTag?: string | undefined;
      focusType?: "focus" | "blur" | "focusin" | "focusout" | undefined;
    } | {
      accelerationX?: number | undefined;
      accelerationY?: number | undefined;
      accelerationZ?: number | undefined;
      rotationAlpha?: number | undefined;
      rotationBeta?: number | undefined;
      rotationGamma?: number | undefined;
    } | {
      width: number;
      height: number;
      devicePixelRatio?: number | undefined;
    };
    sourceId: string;
    signalType: SignalType;
    observationId: string;
    platform?: "browser" | "mobile" | "desktop" | "server" | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    reliabilityWeight?: number | undefined;
    deviceTrust?: number | undefined;
    userAgentHash?: string | undefined;
  }[];
  sentAt: string;
}>;
type ObservationBatch = z.infer<typeof ObservationBatchSchema>;
//# sourceMappingURL=observation.d.ts.map
//#endregion
export { ClickPayloadSchema as ClickPayloadSchema$1, CustomPayloadSchema as CustomPayloadSchema$1, DeviceMotionPayloadSchema as DeviceMotionPayloadSchema$1, FocusPayloadSchema as FocusPayloadSchema$1, KeyPressPayloadSchema as KeyPressPayloadSchema$1, Observation, ObservationBatch, ObservationBatchSchema as ObservationBatchSchema$1, ObservationMeta, ObservationMetaSchema as ObservationMetaSchema$1, ObservationPayload, ObservationPayloadSchema as ObservationPayloadSchema$1, ObservationSchema as ObservationSchema$1, ObservationState as ObservationState$1, ObservationStateSchema as ObservationStateSchema$1, ObservationWithState, ObservationWithStateSchema as ObservationWithStateSchema$1, PageResizePayloadSchema as PageResizePayloadSchema$1, ScrollPayloadSchema as ScrollPayloadSchema$1, ViewportVisibilityPayloadSchema as ViewportVisibilityPayloadSchema$1, createObservation as createObservation$1, normalizeObservation as normalizeObservation$1 };
//# sourceMappingURL=observation-CGqUSMoz.d.mts.map