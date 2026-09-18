/**
 * Sybil Detection
 * 
 * Detects Sybil attacks through:
 * - IP clustering (multiple sessions from same IP)
 * - Device correlation (same device fingerprint across sessions)
 * - Velocity checks (impossible travel, rapid session creation)
 * - Graph-based clustering of suspicious sessions
 * 
 * @module @verified-attention/ml-fraud-sybil
 */

import type { Evidence, Session } from '@verified-attention/core';

/**
 * Session with extracted features for Sybil detection
 */
export interface SessionFeatures {
  sessionId: string;
  ipAddress: string;
  deviceFingerprint: string;
  userAgent: string;
  timestamp: number;
  country?: string;
  asn?: string;
  subnet: string;
  evidenceCount: number;
  duration: number;
}

/**
 * Sybil cluster result
 */
export interface SybilCluster {
  clusterId: string;
  sessions: string[];
  confidence: number;
  reasons: string[];
  type: 'ip_cluster' | 'device_cluster' | 'velocity' | 'mixed';
}

/**
 * Sybil detection result
 */
export interface SybilDetectionResult {
  isSybil: boolean;
  clusters: SybilCluster[];
  riskScore: number;
  signals: SybilSignal[];
}

/**
 * Individual detection signal
 */
export interface SybilSignal {
  name: string;
  detected: boolean;
  confidence: number;
  details?: Record<string, unknown>;
}

/**
 * Configuration for Sybil detection
 */
export interface SybilConfig {
  ipClusterThreshold: number;      // Max sessions per IP before flagging
  deviceClusterThreshold: number;  // Max sessions per device before flagging
  velocityWindowMs: number;        // Time window for velocity checks
  maxVelocityPerWindow: number;    // Max sessions per window
  minClusterSize: number;          // Minimum cluster size to report
  similarityThreshold: number;     // Fingerprint similarity threshold (0-1)
}

export const DEFAULT_SYBIL_CONFIG: SybilConfig = {
  ipClusterThreshold: 10,
  deviceClusterThreshold: 5,
  velocityWindowMs: 3600000, // 1 hour
  maxVelocityPerWindow: 20,
  minClusterSize: 3,
  similarityThreshold: 0.85,
};

/**
 * Calculate subnet from IP (IPv4 /24, IPv6 /64)
 */
function getSubnet(ip: string): string {
  if (ip.includes(':')) {
    // IPv6 - take first 4 segments (64 bits)
    const parts = ip.split(':');
    return parts.slice(0, 4).join(':') + '::/64';
  } else {
    // IPv4 - take first 3 octets (/24)
    const parts = ip.split('.');
    if (parts.length === 4) {
      return parts.slice(0, 3).join('.') + '.0/24';
    }
    return ip;
  }
}

/**
 * Calculate fingerprint similarity (Jaccard index)
 */
function fingerprintSimilarity(fp1: string, fp2: string): number {
  if (fp1 === fp2) return 1;
  
  // Simple token-based similarity
  const tokens1 = new Set(fp1.split(/[|,;]/).filter(t => t.length > 2));
  const tokens2 = new Set(fp2.split(/[|,;]/).filter(t => t.length > 2));
  
  if (tokens1.size === 0 && tokens2.size === 0) return 1;
  if (tokens1.size === 0 || tokens2.size === 0) return 0;
  
  let intersection = 0;
  for (const t of tokens1) {
    if (tokens2.has(t)) intersection++;
  }
  
  return intersection / (tokens1.size + tokens2.size - intersection);
}

/**
 * Extract features from session and evidence
 */
export function extractSessionFeatures(
  session: Session,
  evidence: Evidence[]
): SessionFeatures {
  const meta = (session.metadata || {}) as Record<string, unknown>;
  const created = session.startedAt ? new Date(session.startedAt).getTime() : Date.now();
  const expires = session.expiredAt ? new Date(session.expiredAt).getTime() : created + 3600000;

  return {
    sessionId: session.sessionId,
    ipAddress: (meta.ipAddress as string) || 'unknown',
    deviceFingerprint: (meta.deviceFingerprint as string) || (meta.fingerprint as string) || 'unknown',
    userAgent: (meta.userAgent as string) || 'unknown',
    timestamp: created,
    country: meta.country as string,
    asn: meta.asn as string,
    subnet: getSubnet((meta.ipAddress as string) || 'unknown'),
    evidenceCount: evidence.filter(e => e.sessionId === session.sessionId).length,
    duration: expires - created,
  };
}

/**
 * Detect IP-based clustering
 */
function detectIpClusters(features: SessionFeatures[], config: SybilConfig): SybilCluster[] {
  const ipGroups = new Map<string, SessionFeatures[]>();
  
  for (const f of features) {
    if (!ipGroups.has(f.ipAddress)) {
      ipGroups.set(f.ipAddress, []);
    }
    ipGroups.get(f.ipAddress)!.push(f);
  }
  
  const clusters: SybilCluster[] = [];
  
  for (const [ip, sessions] of ipGroups) {
    if (sessions.length >= config.minClusterSize && sessions.length >= config.ipClusterThreshold) {
      clusters.push({
        clusterId: `ip-cluster-${ip.replace(/[.:/]/g, '-')}`,
        sessions: sessions.map(s => s.sessionId),
        confidence: Math.min(0.9, 0.4 + (sessions.length - config.ipClusterThreshold) * 0.05),
        reasons: [`${sessions.length} sessions from IP ${ip}`],
        type: 'ip_cluster',
      });
    }
  }
  
  return clusters;
}

/**
 * Detect subnet-based clustering
 */
function detectSubnetClusters(features: SessionFeatures[], config: SybilConfig): SybilCluster[] {
  const subnetGroups = new Map<string, SessionFeatures[]>();
  
  for (const f of features) {
    if (!subnetGroups.has(f.subnet)) {
      subnetGroups.set(f.subnet, []);
    }
    subnetGroups.get(f.subnet)!.push(f);
  }
  
  const clusters: SybilCluster[] = [];
  
  for (const [subnet, sessions] of subnetGroups) {
    if (sessions.length >= config.minClusterSize && sessions.length >= config.ipClusterThreshold * 0.5) {
      clusters.push({
        clusterId: `subnet-cluster-${subnet.replace(/[.:/]/g, '-')}`,
        sessions: sessions.map(s => s.sessionId),
        confidence: Math.min(0.8, 0.3 + (sessions.length - 2) * 0.05),
        reasons: [`${sessions.length} sessions from subnet ${subnet}`],
        type: 'ip_cluster',
      });
    }
  }
  
  return clusters;
}

/**
 * Detect device fingerprint clustering
 */
function detectDeviceClusters(features: SessionFeatures[], config: SybilConfig): SybilCluster[] {
  const deviceGroups = new Map<string, SessionFeatures[]>();
  
  for (const f of features) {
    if (!deviceGroups.has(f.deviceFingerprint)) {
      deviceGroups.set(f.deviceFingerprint, []);
    }
    deviceGroups.get(f.deviceFingerprint)!.push(f);
  }
  
  const clusters: SybilCluster[] = [];
  
  for (const [fp, sessions] of deviceGroups) {
    if (sessions.length >= config.minClusterSize && sessions.length >= config.deviceClusterThreshold) {
      clusters.push({
        clusterId: `device-cluster-${fp.slice(0, 16)}`,
        sessions: sessions.map(s => s.sessionId),
        confidence: Math.min(0.95, 0.5 + (sessions.length - config.deviceClusterThreshold) * 0.05),
        reasons: [`${sessions.length} sessions with identical device fingerprint`],
        type: 'device_cluster',
      });
    }
  }
  
  // Also check for similar (not identical) fingerprints
  const fps = Array.from(deviceGroups.keys());
  for (let i = 0; i < fps.length; i++) {
    for (let j = i + 1; j < fps.length; j++) {
      const sim = fingerprintSimilarity(fps[i], fps[j]);
      if (sim >= config.similarityThreshold) {
        const sessions1 = deviceGroups.get(fps[i]) || [];
        const sessions2 = deviceGroups.get(fps[j]) || [];
        const allSessions = [...sessions1, ...sessions2];
        
        if (allSessions.length >= config.minClusterSize) {
          clusters.push({
            clusterId: `device-similar-${fps[i].slice(0, 8)}-${fps[j].slice(0, 8)}`,
            sessions: allSessions.map(s => s.sessionId),
            confidence: Math.min(0.85, 0.4 + sim * 0.3),
            reasons: [`Device fingerprints ${Math.round(sim * 100)}% similar (${allSessions.length} sessions)`],
            type: 'device_cluster',
          });
        }
      }
    }
  }
  
  return clusters;
}

/**
 * Detect velocity anomalies (too many sessions in time window)
 */
function detectVelocityAnomalies(features: SessionFeatures[], config: SybilConfig): SybilCluster[] {
  const clusters: SybilCluster[] = [];
  const sorted = [...features].sort((a, b) => a.timestamp - b.timestamp);
  
  // Sliding window check
  for (let i = 0; i < sorted.length; i++) {
    const windowStart = sorted[i].timestamp;
    const windowEnd = windowStart + config.velocityWindowMs;
    
    const windowSessions = sorted.filter(s => 
      s.timestamp >= windowStart && s.timestamp <= windowEnd
    );
    
    if (windowSessions.length >= config.maxVelocityPerWindow) {
      clusters.push({
        clusterId: `velocity-${windowStart}-${windowEnd}`,
        sessions: windowSessions.map(s => s.sessionId),
        confidence: Math.min(0.9, 0.4 + (windowSessions.length - config.maxVelocityPerWindow) * 0.02),
        reasons: [`${windowSessions.length} sessions in ${config.velocityWindowMs / 60000} minutes`],
        type: 'velocity',
      });
    }
  }
  
  return clusters;
}

/**
 * Detect impossible travel (same device/IP in distant locations quickly)
 */
function detectImpossibleTravel(features: SessionFeatures[]): SybilCluster[] {
  const clusters: SybilCluster[] = [];
  const byDevice = new Map<string, SessionFeatures[]>();
  
  for (const f of features) {
    if (!byDevice.has(f.deviceFingerprint)) {
      byDevice.set(f.deviceFingerprint, []);
    }
    byDevice.get(f.deviceFingerprint)!.push(f);
  }
  
  for (const [fp, sessions] of byDevice) {
    if (sessions.length < 2) continue;
    
    const sorted = sessions.sort((a, b) => a.timestamp - b.timestamp);
    
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      
      if (prev.country && curr.country && prev.country !== curr.country) {
        const timeDiff = curr.timestamp - prev.timestamp;
        // Assume max travel speed ~1000 km/h, rough estimate
        const maxDistKm = (timeDiff / 3600000) * 1000;
        
        // Very rough - if countries differ and time < 12 hours, suspicious
        if (timeDiff < 12 * 3600000) {
          clusters.push({
            clusterId: `travel-${fp.slice(0, 8)}-${prev.timestamp}`,
            sessions: [prev.sessionId, curr.sessionId],
            confidence: 0.7,
            reasons: [`Impossible travel: ${prev.country} -> ${curr.country} in ${Math.round(timeDiff / 3600000)}h`],
            type: 'velocity',
          });
        }
      }
    }
  }
  
  return clusters;
}

/**
 * Main Sybil detection function
 */
export function detectSybil(
  sessions: Session[],
  evidence: Evidence[],
  config: Partial<SybilConfig> = {}
): SybilDetectionResult {
  const cfg = { ...DEFAULT_SYBIL_CONFIG, ...config };
  const allSignals: SybilSignal[] = [];
  const allClusters: SybilCluster[] = [];
  
  // Extract features from sessions and evidence
  const features = sessions.map(s => extractSessionFeatures(s, evidence));
  
  if (features.length === 0) {
    return {
      isSybil: false,
      clusters: [],
      riskScore: 0,
      signals: [{
        name: 'no_sessions',
        detected: true,
        confidence: 1,
        details: { message: 'No sessions to analyze' }
      }],
    };
  }
  
  // Run all detection methods
  const ipClusters = detectIpClusters(features, cfg);
  const subnetClusters = detectSubnetClusters(features, cfg);
  const deviceClusters = detectDeviceClusters(features, cfg);
  const velocityClusters = detectVelocityAnomalies(features, cfg);
  const travelClusters = detectImpossibleTravel(features);
  
  allClusters.push(...ipClusters, ...subnetClusters, ...deviceClusters, ...velocityClusters, ...travelClusters);
  
  // Deduplicate clusters (merge overlapping)
  const mergedClusters = mergeOverlappingClusters(allClusters);
  
  // Generate signals summary
  allSignals.push({
    name: 'ip_clustering',
    detected: ipClusters.length > 0,
    confidence: ipClusters.length > 0 ? Math.max(...ipClusters.map(c => c.confidence)) : 0,
    details: { clusters: ipClusters.length, totalSessions: ipClusters.reduce((sum, c) => sum + c.sessions.length, 0) }
  });
  
  allSignals.push({
    name: 'subnet_clustering',
    detected: subnetClusters.length > 0,
    confidence: subnetClusters.length > 0 ? Math.max(...subnetClusters.map(c => c.confidence)) : 0,
    details: { clusters: subnetClusters.length }
  });
  
  allSignals.push({
    name: 'device_clustering',
    detected: deviceClusters.length > 0,
    confidence: deviceClusters.length > 0 ? Math.max(...deviceClusters.map(c => c.confidence)) : 0,
    details: { clusters: deviceClusters.length }
  });
  
  allSignals.push({
    name: 'velocity_anomalies',
    detected: velocityClusters.length > 0,
    confidence: velocityClusters.length > 0 ? Math.max(...velocityClusters.map(c => c.confidence)) : 0,
    details: { clusters: velocityClusters.length }
  });
  
  allSignals.push({
    name: 'impossible_travel',
    detected: travelClusters.length > 0,
    confidence: travelClusters.length > 0 ? Math.max(...travelClusters.map(c => c.confidence)) : 0,
    details: { clusters: travelClusters.length }
  });
  
  // Calculate overall risk score
  const maxConfidence = mergedClusters.length > 0 
    ? Math.max(...mergedClusters.map(c => c.confidence))
    : 0;
  
  const clusterCount = mergedClusters.length;
  const totalClusteredSessions = new Set(mergedClusters.flatMap(c => c.sessions)).size;
  const clusterRatio = features.length > 0 ? totalClusteredSessions / features.length : 0;
  
  const riskScore = Math.min(1, maxConfidence * 0.6 + clusterRatio * 0.3 + Math.min(clusterCount / 10, 1) * 0.1);
  
  return {
    isSybil: riskScore > 0.5 && mergedClusters.length > 0,
    clusters: mergedClusters,
    riskScore,
    signals: allSignals,
  };
}

/**
 * Merge overlapping clusters
 */
function mergeOverlappingClusters(clusters: SybilCluster[]): SybilCluster[] {
  if (clusters.length <= 1) return clusters;
  
  const merged: SybilCluster[] = [];
  const used = new Set<number>();
  
  for (let i = 0; i < clusters.length; i++) {
    if (used.has(i)) continue;
    
    const current = { ...clusters[i] };
    const currentSessions = new Set(current.sessions);
    
    for (let j = i + 1; j < clusters.length; j++) {
      if (used.has(j)) continue;
      
      const otherSessions = new Set(clusters[j].sessions);
      const intersection = new Set([...currentSessions].filter(x => otherSessions.has(x)));
      
      // If overlap > 50% of smaller cluster, merge
      if (intersection.size > Math.min(currentSessions.size, otherSessions.size) * 0.5) {
        current.sessions = [...new Set([...current.sessions, ...clusters[j].sessions])];
        current.reasons = [...current.reasons, ...clusters[j].reasons];
        current.confidence = Math.max(current.confidence, clusters[j].confidence);
        used.add(j);
      }
    }
    
    merged.push(current);
    used.add(i);
  }
  
  return merged;
}

/**
 * Quick check if a session is part of a Sybil cluster
 */
export function isSessionInSybilCluster(
  sessionId: string,
  result: SybilDetectionResult
): { inCluster: boolean; clusters: SybilCluster[] } {
  const clusters = result.clusters.filter(c => c.sessions.includes(sessionId));
  return {
    inCluster: clusters.length > 0,
    clusters,
  };
}

export default {
  detectSybil,
  extractSessionFeatures,
  isSessionInSybilCluster,
  DEFAULT_SYBIL_CONFIG,
};