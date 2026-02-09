import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { CheckResult, ContentType, ThreatSignal } from '@senior-protect/shared';
import { cache } from '../../config/redis.js';
import { CACHE_TTL } from '@senior-protect/shared';
import { matchPatterns } from './patternMatcher.js';
import { analyzeUrlStructure, checkTyposquatting } from './urlAnalyzer.js';
import { checkSafeBrowsing } from './safeBrowsing.js';
import { checkPhishTank } from './phishTank.js';
import { calculateScore } from './scoringAlgorithm.js';
import { generateThreeQuestions } from './threeQuestions.js';
import { THREAT_LABELS } from '@senior-protect/shared';

export async function analyzeContent(
  contentType: ContentType,
  content: string,
  metadata?: { sender?: string; subject?: string; source?: string }
): Promise<CheckResult> {
  // Hash content for caching and storage
  const contentHash = createHash('sha256').update(content).digest('hex');
  const cacheKey = `check:${contentType}:${contentHash}`;

  // Check cache
  const cached = await cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Run analyzers in parallel
  const signals = await runAnalyzers(contentType, content, metadata);

  // Score
  const { threatLevel, score, confidence } = calculateScore(signals);

  // Generate Three Questions
  const threeQuestions = generateThreeQuestions(contentType, threatLevel, signals, metadata);

  // Build result
  const result: CheckResult = {
    id: contentHash,
    contentType,
    threatLevel,
    score,
    confidence,
    threeQuestions,
    signals,
    summary: THREAT_LABELS[threatLevel].description,
    checkedAt: new Date().toISOString(),
  };

  // Cache result
  await cache.set(cacheKey, JSON.stringify(result), CACHE_TTL.CHECK_RESULT);

  return result;
}

async function runAnalyzers(
  contentType: ContentType,
  content: string,
  metadata?: { sender?: string; subject?: string; source?: string }
): Promise<ThreatSignal[]> {
  const allSignals: ThreatSignal[] = [];

  // Pattern matching (always runs)
  const patternSignals = matchPatterns(content, contentType, metadata);
  allSignals.push(...patternSignals);

  // URL-specific analysis
  if (contentType === ContentType.Url) {
    const [urlSignals, typoSignals, safeBrowsingSignals, phishTankSignals] = await Promise.all([
      Promise.resolve(analyzeUrlStructure(content)),
      Promise.resolve(checkTyposquatting(extractDomain(content))),
      checkSafeBrowsing(content),
      checkPhishTank(content),
    ]);
    allSignals.push(...urlSignals, ...typoSignals, ...safeBrowsingSignals, ...phishTankSignals);
  }

  // For email/text content, extract and check any URLs found inline
  if (contentType === ContentType.Email || contentType === ContentType.Text) {
    const urls = extractUrls(content);
    for (const url of urls.slice(0, 5)) { // Limit to 5 URLs
      const [urlSignals, typoSignals] = await Promise.all([
        Promise.resolve(analyzeUrlStructure(url)),
        Promise.resolve(checkTyposquatting(extractDomain(url))),
      ]);
      allSignals.push(...urlSignals, ...typoSignals);

      // Only call external APIs for the first URL to save quota
      if (url === urls[0]) {
        const [safeBrowsingSignals, phishTankSignals] = await Promise.all([
          checkSafeBrowsing(url),
          checkPhishTank(url),
        ]);
        allSignals.push(...safeBrowsingSignals, ...phishTankSignals);
      }
    }
  }

  // Deduplicate signals
  return deduplicateSignals(allSignals);
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url;
  }
}

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const matches = text.match(urlRegex) || [];
  return [...new Set(matches)];
}

function deduplicateSignals(signals: ThreatSignal[]): ThreatSignal[] {
  const seen = new Set<string>();
  return signals.filter((signal) => {
    const key = `${signal.category}:${signal.pattern}:${signal.matched}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
