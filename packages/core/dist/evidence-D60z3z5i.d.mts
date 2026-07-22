import { EvidenceType$1 as EvidenceType, Hash } from "./common-DCxousWR.mjs";
import { z } from "zod";

//#region src/evidence.d.ts

/**
 * Evidence payload varies by evidence type
 */
declare const InteractionEvidencePayloadSchema: z.ZodObject<{
  avgScrollVelocity: z.ZodOptional<z.ZodNumber>;
  scrollDirectionChanges: z.ZodOptional<z.ZodNumber>;
  clickCount: z.ZodOptional<z.ZodNumber>;
  keyPressCount: z.ZodOptional<z.ZodNumber>;
  interactionDurationMs: z.ZodOptional<z.ZodNumber>;
  readingPauses: z.ZodOptional<z.ZodArray<z.ZodObject<{
    startTime: z.ZodNumber;
    durationMs: z.ZodNumber;
    position: z.ZodNumber;
  }, "strip", z.ZodTypeAny, {
    startTime: number;
    durationMs: number;
    position: number;
  }, {
    startTime: number;
    durationMs: number;
    position: number;
  }>, "many">>;
  engagementScore: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
  avgScrollVelocity?: number | undefined;
  scrollDirectionChanges?: number | undefined;
  clickCount?: number | undefined;
  keyPressCount?: number | undefined;
  interactionDurationMs?: number | undefined;
  readingPauses?: {
    startTime: number;
    durationMs: number;
    position: number;
  }[] | undefined;
  engagementScore?: number | undefined;
}, {
  avgScrollVelocity?: number | undefined;
  scrollDirectionChanges?: number | undefined;
  clickCount?: number | undefined;
  keyPressCount?: number | undefined;
  interactionDurationMs?: number | undefined;
  readingPauses?: {
    startTime: number;
    durationMs: number;
    position: number;
  }[] | undefined;
  engagementScore?: number | undefined;
}>;
declare const VisibilityEvidencePayloadSchema: z.ZodObject<{
  visibleDurationMs: z.ZodNumber;
  maxVisibilityRatio: z.ZodNumber;
  avgVisibilityRatio: z.ZodNumber;
  viewportIntersections: z.ZodOptional<z.ZodArray<z.ZodObject<{
    timestamp: z.ZodNumber;
    ratio: z.ZodNumber;
  }, "strip", z.ZodTypeAny, {
    timestamp: number;
    ratio: number;
  }, {
    timestamp: number;
    ratio: number;
  }>, "many">>;
}, "strip", z.ZodTypeAny, {
  visibleDurationMs: number;
  maxVisibilityRatio: number;
  avgVisibilityRatio: number;
  viewportIntersections?: {
    timestamp: number;
    ratio: number;
  }[] | undefined;
}, {
  visibleDurationMs: number;
  maxVisibilityRatio: number;
  avgVisibilityRatio: number;
  viewportIntersections?: {
    timestamp: number;
    ratio: number;
  }[] | undefined;
}>;
declare const DurationEvidencePayloadSchema: z.ZodObject<{
  sessionStartTime: z.ZodNumber;
  sessionEndTime: z.ZodOptional<z.ZodNumber>;
  activeDurationMs: z.ZodNumber;
  idleDurationMs: z.ZodOptional<z.ZodNumber>;
  heartbeatCount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
  sessionStartTime: number;
  activeDurationMs: number;
  sessionEndTime?: number | undefined;
  idleDurationMs?: number | undefined;
  heartbeatCount?: number | undefined;
}, {
  sessionStartTime: number;
  activeDurationMs: number;
  sessionEndTime?: number | undefined;
  idleDurationMs?: number | undefined;
  heartbeatCount?: number | undefined;
}>;
declare const ContextEvidencePayloadSchema: z.ZodObject<{
  platform: z.ZodEnum<["browser", "mobile", "desktop", "server"]>;
  userAgent: z.ZodOptional<z.ZodString>;
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
  devicePixelRatio: z.ZodOptional<z.ZodNumber>;
  timezone: z.ZodOptional<z.ZodString>;
  language: z.ZodOptional<z.ZodString>;
  connectionType: z.ZodOptional<z.ZodString>;
  effectiveType: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
  platform: "browser" | "mobile" | "desktop" | "server";
  userAgent?: string | undefined;
  viewportSize?: {
    width: number;
    height: number;
  } | undefined;
  devicePixelRatio?: number | undefined;
  timezone?: string | undefined;
  language?: string | undefined;
  connectionType?: string | undefined;
  effectiveType?: string | undefined;
}, {
  platform: "browser" | "mobile" | "desktop" | "server";
  userAgent?: string | undefined;
  viewportSize?: {
    width: number;
    height: number;
  } | undefined;
  devicePixelRatio?: number | undefined;
  timezone?: string | undefined;
  language?: string | undefined;
  connectionType?: string | undefined;
  effectiveType?: string | undefined;
}>;
declare const CustomEvidencePayloadSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
/**
 * Evidence payload union type - using discriminated union on evidenceType
 */
declare const EvidencePayloadSchema: z.ZodDiscriminatedUnion<"evidenceType", [z.ZodObject<{
  evidenceType: z.ZodLiteral<"E-INTERACTION">;
  payload: z.ZodObject<{
    avgScrollVelocity: z.ZodOptional<z.ZodNumber>;
    scrollDirectionChanges: z.ZodOptional<z.ZodNumber>;
    clickCount: z.ZodOptional<z.ZodNumber>;
    keyPressCount: z.ZodOptional<z.ZodNumber>;
    interactionDurationMs: z.ZodOptional<z.ZodNumber>;
    readingPauses: z.ZodOptional<z.ZodArray<z.ZodObject<{
      startTime: z.ZodNumber;
      durationMs: z.ZodNumber;
      position: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
      startTime: number;
      durationMs: number;
      position: number;
    }, {
      startTime: number;
      durationMs: number;
      position: number;
    }>, "many">>;
    engagementScore: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  }, {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  }>;
}, "strip", z.ZodTypeAny, {
  evidenceType: "E-INTERACTION";
  payload: {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  };
}, {
  evidenceType: "E-INTERACTION";
  payload: {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  };
}>, z.ZodObject<{
  evidenceType: z.ZodLiteral<"E-VISIBLE">;
  payload: z.ZodObject<{
    visibleDurationMs: z.ZodNumber;
    maxVisibilityRatio: z.ZodNumber;
    avgVisibilityRatio: z.ZodNumber;
    viewportIntersections: z.ZodOptional<z.ZodArray<z.ZodObject<{
      timestamp: z.ZodNumber;
      ratio: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
      timestamp: number;
      ratio: number;
    }, {
      timestamp: number;
      ratio: number;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  }, {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  }>;
}, "strip", z.ZodTypeAny, {
  evidenceType: "E-VISIBLE";
  payload: {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  };
}, {
  evidenceType: "E-VISIBLE";
  payload: {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  };
}>, z.ZodObject<{
  evidenceType: z.ZodLiteral<"E-DURATION">;
  payload: z.ZodObject<{
    sessionStartTime: z.ZodNumber;
    sessionEndTime: z.ZodOptional<z.ZodNumber>;
    activeDurationMs: z.ZodNumber;
    idleDurationMs: z.ZodOptional<z.ZodNumber>;
    heartbeatCount: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  }, {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  }>;
}, "strip", z.ZodTypeAny, {
  evidenceType: "E-DURATION";
  payload: {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  };
}, {
  evidenceType: "E-DURATION";
  payload: {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  };
}>, z.ZodObject<{
  evidenceType: z.ZodLiteral<"E-CONTEXT">;
  payload: z.ZodObject<{
    platform: z.ZodEnum<["browser", "mobile", "desktop", "server"]>;
    userAgent: z.ZodOptional<z.ZodString>;
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
    devicePixelRatio: z.ZodOptional<z.ZodNumber>;
    timezone: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    connectionType: z.ZodOptional<z.ZodString>;
    effectiveType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  }, {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  }>;
}, "strip", z.ZodTypeAny, {
  evidenceType: "E-CONTEXT";
  payload: {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  };
}, {
  evidenceType: "E-CONTEXT";
  payload: {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  };
}>, z.ZodObject<{
  evidenceType: z.ZodLiteral<"E-CUSTOM">;
  payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  evidenceType: "E-CUSTOM";
  payload: Record<string, unknown>;
}, {
  evidenceType: "E-CUSTOM";
  payload: Record<string, unknown>;
}>]>;
type EvidencePayload = z.infer<typeof EvidencePayloadSchema>;
/**
 * Evidence provenance - references to underlying observations
 */
declare const EvidenceProvenanceSchema: z.ZodObject<{
  observationIds: z.ZodArray<z.ZodString, "many">;
  observationHash: z.ZodString;
  sourceId: z.ZodString;
  collectionMethod: z.ZodOptional<z.ZodEnum<["sdk", "api", "partner", "import"]>>;
}, "strip", z.ZodTypeAny, {
  observationIds: string[];
  observationHash: string;
  sourceId: string;
  collectionMethod?: "sdk" | "api" | "partner" | "import" | undefined;
}, {
  observationIds: string[];
  observationHash: string;
  sourceId: string;
  collectionMethod?: "sdk" | "api" | "partner" | "import" | undefined;
}>;
type EvidenceProvenance = z.infer<typeof EvidenceProvenanceSchema>;
/**
 * Evidence metadata (optional per VAP)
 */
declare const EvidenceMetadataSchema: z.ZodObject<{
  policyId: z.ZodOptional<z.ZodString>;
  collectionPolicyVersion: z.ZodOptional<z.ZodString>;
  qualityScore: z.ZodOptional<z.ZodNumber>;
  completenessScore: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
  policyId?: string | undefined;
  collectionPolicyVersion?: string | undefined;
  qualityScore?: number | undefined;
  completenessScore?: number | undefined;
}, {
  policyId?: string | undefined;
  collectionPolicyVersion?: string | undefined;
  qualityScore?: number | undefined;
  completenessScore?: number | undefined;
}>;
type EvidenceMetadata = z.infer<typeof EvidenceMetadataSchema>;
/**
 * Complete Evidence object (VAP Section 5)
 * MUST contain: evidence_id, session_id, source_id, timestamp, evidence_type, confidence, payload, provenance, signature
 */
declare const EvidenceSchema: z.ZodObject<{
  evidenceId: z.ZodString;
  sessionId: z.ZodString;
  sourceId: z.ZodString;
  timestamp: z.ZodString;
  evidenceType: z.ZodNativeEnum<typeof EvidenceType>;
  confidence: z.ZodNumber;
  payload: z.ZodUnion<[z.ZodObject<{
    avgScrollVelocity: z.ZodOptional<z.ZodNumber>;
    scrollDirectionChanges: z.ZodOptional<z.ZodNumber>;
    clickCount: z.ZodOptional<z.ZodNumber>;
    keyPressCount: z.ZodOptional<z.ZodNumber>;
    interactionDurationMs: z.ZodOptional<z.ZodNumber>;
    readingPauses: z.ZodOptional<z.ZodArray<z.ZodObject<{
      startTime: z.ZodNumber;
      durationMs: z.ZodNumber;
      position: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
      startTime: number;
      durationMs: number;
      position: number;
    }, {
      startTime: number;
      durationMs: number;
      position: number;
    }>, "many">>;
    engagementScore: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  }, {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  }>, z.ZodObject<{
    visibleDurationMs: z.ZodNumber;
    maxVisibilityRatio: z.ZodNumber;
    avgVisibilityRatio: z.ZodNumber;
    viewportIntersections: z.ZodOptional<z.ZodArray<z.ZodObject<{
      timestamp: z.ZodNumber;
      ratio: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
      timestamp: number;
      ratio: number;
    }, {
      timestamp: number;
      ratio: number;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  }, {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  }>, z.ZodObject<{
    sessionStartTime: z.ZodNumber;
    sessionEndTime: z.ZodOptional<z.ZodNumber>;
    activeDurationMs: z.ZodNumber;
    idleDurationMs: z.ZodOptional<z.ZodNumber>;
    heartbeatCount: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  }, {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  }>, z.ZodObject<{
    platform: z.ZodEnum<["browser", "mobile", "desktop", "server"]>;
    userAgent: z.ZodOptional<z.ZodString>;
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
    devicePixelRatio: z.ZodOptional<z.ZodNumber>;
    timezone: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    connectionType: z.ZodOptional<z.ZodString>;
    effectiveType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  }, {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  }>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>;
  provenance: z.ZodObject<{
    observationIds: z.ZodArray<z.ZodString, "many">;
    observationHash: z.ZodString;
    sourceId: z.ZodString;
    collectionMethod: z.ZodOptional<z.ZodEnum<["sdk", "api", "partner", "import"]>>;
  }, "strip", z.ZodTypeAny, {
    observationIds: string[];
    observationHash: string;
    sourceId: string;
    collectionMethod?: "sdk" | "api" | "partner" | "import" | undefined;
  }, {
    observationIds: string[];
    observationHash: string;
    sourceId: string;
    collectionMethod?: "sdk" | "api" | "partner" | "import" | undefined;
  }>;
  signature: z.ZodString;
  metadata: z.ZodOptional<z.ZodObject<{
    policyId: z.ZodOptional<z.ZodString>;
    collectionPolicyVersion: z.ZodOptional<z.ZodString>;
    qualityScore: z.ZodOptional<z.ZodNumber>;
    completenessScore: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    policyId?: string | undefined;
    collectionPolicyVersion?: string | undefined;
    qualityScore?: number | undefined;
    completenessScore?: number | undefined;
  }, {
    policyId?: string | undefined;
    collectionPolicyVersion?: string | undefined;
    qualityScore?: number | undefined;
    completenessScore?: number | undefined;
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
  timestamp: string;
  evidenceType: EvidenceType;
  payload: Record<string, unknown> | {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  } | {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  } | {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  } | {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  };
  sourceId: string;
  evidenceId: string;
  confidence: number;
  provenance: {
    observationIds: string[];
    observationHash: string;
    sourceId: string;
    collectionMethod?: "sdk" | "api" | "partner" | "import" | undefined;
  };
  signature: string;
  metadata?: {
    policyId?: string | undefined;
    collectionPolicyVersion?: string | undefined;
    qualityScore?: number | undefined;
    completenessScore?: number | undefined;
  } | undefined;
  baseMetadata?: {
    createdAt: string;
    version: number;
    updatedAt?: string | undefined;
    tags?: Record<string, string> | undefined;
  } | undefined;
}, {
  sessionId: string;
  timestamp: string;
  evidenceType: EvidenceType;
  payload: Record<string, unknown> | {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  } | {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  } | {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  } | {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  };
  sourceId: string;
  evidenceId: string;
  confidence: number;
  provenance: {
    observationIds: string[];
    observationHash: string;
    sourceId: string;
    collectionMethod?: "sdk" | "api" | "partner" | "import" | undefined;
  };
  signature: string;
  metadata?: {
    policyId?: string | undefined;
    collectionPolicyVersion?: string | undefined;
    qualityScore?: number | undefined;
    completenessScore?: number | undefined;
  } | undefined;
  baseMetadata?: {
    createdAt: string;
    updatedAt?: string | undefined;
    version?: number | undefined;
    tags?: Record<string, string> | undefined;
  } | undefined;
}>;
type Evidence = z.infer<typeof EvidenceSchema>;
/**
 * Evidence state machine (VAP Section 3)
 */
declare enum EvidenceState {
  PROPOSED = "PROPOSED",
  VALIDATED = "VALIDATED",
  INDEXED = "INDEXED",
  ARCHIVED = "ARCHIVED",
  DISCARDED = "DISCARDED",
}
declare const EvidenceStateSchema: z.ZodNativeEnum<typeof EvidenceState>;
/**
 * Evidence with lifecycle state
 */
declare const EvidenceWithStateSchema: z.ZodObject<{
  evidenceId: z.ZodString;
  sessionId: z.ZodString;
  sourceId: z.ZodString;
  timestamp: z.ZodString;
  evidenceType: z.ZodNativeEnum<typeof EvidenceType>;
  confidence: z.ZodNumber;
  payload: z.ZodUnion<[z.ZodObject<{
    avgScrollVelocity: z.ZodOptional<z.ZodNumber>;
    scrollDirectionChanges: z.ZodOptional<z.ZodNumber>;
    clickCount: z.ZodOptional<z.ZodNumber>;
    keyPressCount: z.ZodOptional<z.ZodNumber>;
    interactionDurationMs: z.ZodOptional<z.ZodNumber>;
    readingPauses: z.ZodOptional<z.ZodArray<z.ZodObject<{
      startTime: z.ZodNumber;
      durationMs: z.ZodNumber;
      position: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
      startTime: number;
      durationMs: number;
      position: number;
    }, {
      startTime: number;
      durationMs: number;
      position: number;
    }>, "many">>;
    engagementScore: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  }, {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  }>, z.ZodObject<{
    visibleDurationMs: z.ZodNumber;
    maxVisibilityRatio: z.ZodNumber;
    avgVisibilityRatio: z.ZodNumber;
    viewportIntersections: z.ZodOptional<z.ZodArray<z.ZodObject<{
      timestamp: z.ZodNumber;
      ratio: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
      timestamp: number;
      ratio: number;
    }, {
      timestamp: number;
      ratio: number;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  }, {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  }>, z.ZodObject<{
    sessionStartTime: z.ZodNumber;
    sessionEndTime: z.ZodOptional<z.ZodNumber>;
    activeDurationMs: z.ZodNumber;
    idleDurationMs: z.ZodOptional<z.ZodNumber>;
    heartbeatCount: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  }, {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  }>, z.ZodObject<{
    platform: z.ZodEnum<["browser", "mobile", "desktop", "server"]>;
    userAgent: z.ZodOptional<z.ZodString>;
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
    devicePixelRatio: z.ZodOptional<z.ZodNumber>;
    timezone: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    connectionType: z.ZodOptional<z.ZodString>;
    effectiveType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  }, {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  }>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>;
  provenance: z.ZodObject<{
    observationIds: z.ZodArray<z.ZodString, "many">;
    observationHash: z.ZodString;
    sourceId: z.ZodString;
    collectionMethod: z.ZodOptional<z.ZodEnum<["sdk", "api", "partner", "import"]>>;
  }, "strip", z.ZodTypeAny, {
    observationIds: string[];
    observationHash: string;
    sourceId: string;
    collectionMethod?: "sdk" | "api" | "partner" | "import" | undefined;
  }, {
    observationIds: string[];
    observationHash: string;
    sourceId: string;
    collectionMethod?: "sdk" | "api" | "partner" | "import" | undefined;
  }>;
  signature: z.ZodString;
  metadata: z.ZodOptional<z.ZodObject<{
    policyId: z.ZodOptional<z.ZodString>;
    collectionPolicyVersion: z.ZodOptional<z.ZodString>;
    qualityScore: z.ZodOptional<z.ZodNumber>;
    completenessScore: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    policyId?: string | undefined;
    collectionPolicyVersion?: string | undefined;
    qualityScore?: number | undefined;
    completenessScore?: number | undefined;
  }, {
    policyId?: string | undefined;
    collectionPolicyVersion?: string | undefined;
    qualityScore?: number | undefined;
    completenessScore?: number | undefined;
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
} & {
  state: z.ZodNativeEnum<typeof EvidenceState>;
  validatedAt: z.ZodOptional<z.ZodString>;
  indexedAt: z.ZodOptional<z.ZodString>;
  archivedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
  sessionId: string;
  state: EvidenceState;
  timestamp: string;
  evidenceType: EvidenceType;
  payload: Record<string, unknown> | {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  } | {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  } | {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  } | {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  };
  sourceId: string;
  evidenceId: string;
  confidence: number;
  provenance: {
    observationIds: string[];
    observationHash: string;
    sourceId: string;
    collectionMethod?: "sdk" | "api" | "partner" | "import" | undefined;
  };
  signature: string;
  metadata?: {
    policyId?: string | undefined;
    collectionPolicyVersion?: string | undefined;
    qualityScore?: number | undefined;
    completenessScore?: number | undefined;
  } | undefined;
  baseMetadata?: {
    createdAt: string;
    version: number;
    updatedAt?: string | undefined;
    tags?: Record<string, string> | undefined;
  } | undefined;
  validatedAt?: string | undefined;
  indexedAt?: string | undefined;
  archivedAt?: string | undefined;
}, {
  sessionId: string;
  state: EvidenceState;
  timestamp: string;
  evidenceType: EvidenceType;
  payload: Record<string, unknown> | {
    avgScrollVelocity?: number | undefined;
    scrollDirectionChanges?: number | undefined;
    clickCount?: number | undefined;
    keyPressCount?: number | undefined;
    interactionDurationMs?: number | undefined;
    readingPauses?: {
      startTime: number;
      durationMs: number;
      position: number;
    }[] | undefined;
    engagementScore?: number | undefined;
  } | {
    visibleDurationMs: number;
    maxVisibilityRatio: number;
    avgVisibilityRatio: number;
    viewportIntersections?: {
      timestamp: number;
      ratio: number;
    }[] | undefined;
  } | {
    sessionStartTime: number;
    activeDurationMs: number;
    sessionEndTime?: number | undefined;
    idleDurationMs?: number | undefined;
    heartbeatCount?: number | undefined;
  } | {
    platform: "browser" | "mobile" | "desktop" | "server";
    userAgent?: string | undefined;
    viewportSize?: {
      width: number;
      height: number;
    } | undefined;
    devicePixelRatio?: number | undefined;
    timezone?: string | undefined;
    language?: string | undefined;
    connectionType?: string | undefined;
    effectiveType?: string | undefined;
  };
  sourceId: string;
  evidenceId: string;
  confidence: number;
  provenance: {
    observationIds: string[];
    observationHash: string;
    sourceId: string;
    collectionMethod?: "sdk" | "api" | "partner" | "import" | undefined;
  };
  signature: string;
  metadata?: {
    policyId?: string | undefined;
    collectionPolicyVersion?: string | undefined;
    qualityScore?: number | undefined;
    completenessScore?: number | undefined;
  } | undefined;
  baseMetadata?: {
    createdAt: string;
    updatedAt?: string | undefined;
    version?: number | undefined;
    tags?: Record<string, string> | undefined;
  } | undefined;
  validatedAt?: string | undefined;
  indexedAt?: string | undefined;
  archivedAt?: string | undefined;
}>;
type EvidenceWithState = z.infer<typeof EvidenceWithStateSchema>;
/**
 * Evidence validation result
 */
declare const EvidenceValidationResultSchema: z.ZodObject<{
  valid: z.ZodBoolean;
  evidenceId: z.ZodString;
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
  evidenceId: string;
  errors?: {
    code: string;
    message: string;
    path?: (string | number)[] | undefined;
  }[] | undefined;
  warnings?: string[] | undefined;
}, {
  valid: boolean;
  evidenceId: string;
  errors?: {
    code: string;
    message: string;
    path?: (string | number)[] | undefined;
  }[] | undefined;
  warnings?: string[] | undefined;
}>;
type EvidenceValidationResult = z.infer<typeof EvidenceValidationResultSchema>;
/**
 * Create a new evidence object (unsigned - signature added by producer)
 */
declare function createEvidence(params: Omit<Evidence, 'evidenceId' | 'timestamp' | 'signature'> & {
  timestamp?: string;
}): Omit<Evidence, 'signature'>;
/**
 * Compute evidence integrity hash
 * VAP: sha256(id + session_id + timestamp + evidence_type + payload_hash + signature)
 */
declare function computeEvidenceHash(evidence: Evidence): Hash;
/**
 * Validate evidence structure and required fields
 */
declare function validateEvidence(evidence: unknown): EvidenceValidationResult;
//# sourceMappingURL=evidence.d.ts.map
//#endregion
export { ContextEvidencePayloadSchema as ContextEvidencePayloadSchema$1, CustomEvidencePayloadSchema as CustomEvidencePayloadSchema$1, DurationEvidencePayloadSchema as DurationEvidencePayloadSchema$1, Evidence, EvidenceMetadata, EvidenceMetadataSchema as EvidenceMetadataSchema$1, EvidencePayload, EvidencePayloadSchema as EvidencePayloadSchema$1, EvidenceProvenance, EvidenceProvenanceSchema as EvidenceProvenanceSchema$1, EvidenceSchema as EvidenceSchema$1, EvidenceState as EvidenceState$2, EvidenceStateSchema as EvidenceStateSchema$2, EvidenceValidationResult, EvidenceValidationResultSchema as EvidenceValidationResultSchema$1, EvidenceWithState, EvidenceWithStateSchema as EvidenceWithStateSchema$1, InteractionEvidencePayloadSchema as InteractionEvidencePayloadSchema$1, VisibilityEvidencePayloadSchema as VisibilityEvidencePayloadSchema$1, computeEvidenceHash as computeEvidenceHash$1, createEvidence as createEvidence$1, validateEvidence as validateEvidence$1 };
//# sourceMappingURL=evidence-D60z3z5i.d.mts.map