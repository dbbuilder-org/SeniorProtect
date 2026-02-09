import { ThreatSignal } from '@senior-protect/shared';
import { env } from '../../config/env.js';

const PHISHTANK_URL = 'https://checkurl.phishtank.com/checkurl/';

export async function checkPhishTank(url: string): Promise<ThreatSignal[]> {
  if (!env.phishTankApiKey) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      url,
      format: 'json',
      app_key: env.phishTankApiKey,
    });

    const response = await fetch(PHISHTANK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`PhishTank API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data.results?.in_database && data.results?.valid) {
      return [{
        category: 'external_api',
        pattern: 'phishtank',
        description: 'This URL is in the PhishTank database as a known phishing site',
        severity: 'critical',
        matched: url,
      }];
    }

    return [];
  } catch (err) {
    console.warn('PhishTank check failed:', err);
    return [];
  }
}
