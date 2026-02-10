import { ThreatSignal } from '@senior-protect/shared';
import { env } from '../../config/env.js';

const SAFE_BROWSING_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

interface SafeBrowsingResponse {
  matches?: Array<{
    threatType: string;
    platformType: string;
    threat: { url: string };
  }>;
}

export async function checkSafeBrowsing(url: string): Promise<ThreatSignal[]> {
  if (!env.googleSafeBrowsingKey) {
    return [];
  }

  try {
    const response = await fetch(`${SAFE_BROWSING_URL}?key=${env.googleSafeBrowsingKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: {
          clientId: 'seniorprotect',
          clientVersion: '1.0.0',
        },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION',
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`Safe Browsing API error: ${response.status}`);
      return [];
    }

    const data = await response.json() as SafeBrowsingResponse;

    if (!data.matches || data.matches.length === 0) {
      return [];
    }

    return data.matches.map((match) => ({
      category: 'external_api',
      pattern: 'google_safe_browsing',
      description: `Google Safe Browsing flagged this URL as ${formatThreatType(match.threatType)}`,
      severity: 'critical' as const,
      matched: url,
    }));
  } catch (err) {
    console.warn('Safe Browsing check failed:', err);
    return [];
  }
}

function formatThreatType(type: string): string {
  const labels: Record<string, string> = {
    MALWARE: 'containing malware',
    SOCIAL_ENGINEERING: 'a phishing/social engineering site',
    UNWANTED_SOFTWARE: 'distributing unwanted software',
    POTENTIALLY_HARMFUL_APPLICATION: 'potentially harmful',
  };
  return labels[type] || 'potentially dangerous';
}
