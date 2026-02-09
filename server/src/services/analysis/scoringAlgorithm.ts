import { ThreatLevel, ThreatSignal } from '@senior-protect/shared';

const SEVERITY_WEIGHTS: Record<string, number> = {
  low: 0.1,
  medium: 0.25,
  high: 0.5,
  critical: 1.0,
};

const CAUTION_THRESHOLD = 0.3;
const DANGER_THRESHOLD = 0.6;

export interface ScoringResult {
  threatLevel: ThreatLevel;
  score: number;
  confidence: number;
}

export function calculateScore(signals: ThreatSignal[]): ScoringResult {
  if (signals.length === 0) {
    return {
      threatLevel: ThreatLevel.Safe,
      score: 0,
      confidence: 0.5, // Low confidence with no signals
    };
  }

  // Check for critical signals — immediate danger override
  const hasCritical = signals.some((s) => s.severity === 'critical');
  if (hasCritical) {
    return {
      threatLevel: ThreatLevel.Danger,
      score: Math.min(0.95, 0.7 + signals.length * 0.05),
      confidence: Math.min(0.95, 0.7 + signals.length * 0.03),
    };
  }

  // Weighted score calculation
  let totalWeight = 0;
  const categories = new Set<string>();

  for (const signal of signals) {
    totalWeight += SEVERITY_WEIGHTS[signal.severity] || 0.1;
    categories.add(signal.category);
  }

  // Normalize score: more signals and more categories increase score
  const categoryBonus = (categories.size - 1) * 0.05;
  const rawScore = Math.min(1.0, totalWeight / 2 + categoryBonus);

  // Confidence increases with more signals and category diversity
  const signalCountFactor = Math.min(1.0, signals.length / 10);
  const categoryFactor = Math.min(1.0, categories.size / 4);
  const confidence = Math.min(0.95, 0.4 + signalCountFactor * 0.3 + categoryFactor * 0.25);

  let threatLevel: ThreatLevel;
  if (rawScore >= DANGER_THRESHOLD) {
    threatLevel = ThreatLevel.Danger;
  } else if (rawScore >= CAUTION_THRESHOLD) {
    threatLevel = ThreatLevel.Caution;
  } else {
    threatLevel = ThreatLevel.Safe;
  }

  return {
    threatLevel,
    score: Math.round(rawScore * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
  };
}
