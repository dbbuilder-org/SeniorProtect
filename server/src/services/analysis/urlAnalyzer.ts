import { ThreatSignal } from '@senior-protect/shared';

/**
 * Common legitimate domains to check for typosquatting
 */
const COMMON_DOMAINS = [
  'amazon.com',
  'paypal.com',
  'bankofamerica.com',
  'chase.com',
  'wellsfargo.com',
  'apple.com',
  'microsoft.com',
  'google.com',
  'facebook.com',
  'netflix.com',
  'walmart.com',
  'target.com',
  'costco.com',
  'usps.com',
  'fedex.com',
  'irs.gov',
  'ssa.gov',
  'medicare.gov',
  'capitalone.com',
  'citibank.com',
  'usbank.com',
  'tdbank.com',
  'americanexpress.com',
  'discover.com',
];

/**
 * Suspicious top-level domains often used in scams
 */
const SUSPICIOUS_TLDS = [
  '.tk',
  '.ml',
  '.ga',
  '.cf',
  '.gq',
  '.xyz',
  '.top',
  '.work',
  '.click',
  '.loan',
  '.racing',
  '.download',
  '.stream',
  '.bid',
];

/**
 * Common URL shortener domains
 */
const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'rebrand.ly',
];

/**
 * Calculate Levenshtein distance between two strings
 * @param str1 First string
 * @param str2 Second string
 * @returns The minimum number of edits needed to transform str1 into str2
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  // Create a 2D array for dynamic programming
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Initialize first column and row
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // Fill the dp table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Parse URL and extract components safely
 */
function parseUrl(url: string): URL | null {
  try {
    // Add protocol if missing
    const urlString = url.match(/^https?:\/\//) ? url : `https://${url}`;
    return new URL(urlString);
  } catch {
    return null;
  }
}

/**
 * Analyze URL structure for suspicious characteristics
 * @param url The URL to analyze
 * @returns Array of threat signals found
 */
export function analyzeUrlStructure(url: string): ThreatSignal[] {
  const signals: ThreatSignal[] = [];
  const parsedUrl = parseUrl(url);

  if (!parsedUrl) {
    signals.push({
      category: 'url-structure',
      pattern: 'invalid-url',
      description: 'The URL format is invalid or could not be parsed',
      severity: 'medium',
      matched: url,
    });
    return signals;
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname;
  const protocol = parsedUrl.protocol;
  const port = parsedUrl.port;

  // Check 1: IP address as hostname
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipPattern.test(hostname)) {
    signals.push({
      category: 'url-structure',
      pattern: 'ip-address-hostname',
      description: 'Using an IP address instead of a domain name is unusual for legitimate websites',
      severity: 'high',
      matched: hostname,
    });
  }

  // Check 2: Suspicious TLDs
  for (const tld of SUSPICIOUS_TLDS) {
    if (hostname.endsWith(tld)) {
      signals.push({
        category: 'url-structure',
        pattern: 'suspicious-tld',
        description: `The domain uses "${tld}" which is commonly associated with scam websites`,
        severity: 'high',
        matched: tld,
      });
      break;
    }
  }

  // Check 3: URL shorteners
  for (const shortener of URL_SHORTENERS) {
    if (hostname === shortener || hostname.endsWith(`.${shortener}`)) {
      signals.push({
        category: 'url-structure',
        pattern: 'url-shortener',
        description: 'URL shorteners hide the real destination. Use caution and verify before clicking',
        severity: 'medium',
        matched: shortener,
      });
      break;
    }
  }

  // Check 4: Non-HTTPS protocol
  if (protocol !== 'https:') {
    signals.push({
      category: 'url-structure',
      pattern: 'non-https',
      description: 'The link does not use secure HTTPS encryption. Your information could be intercepted',
      severity: 'medium',
      matched: protocol,
    });
  }

  // Check 5: Excessive subdomains (more than 3 dots)
  const dotCount = hostname.split('.').length - 1;
  if (dotCount > 3) {
    signals.push({
      category: 'url-structure',
      pattern: 'excessive-subdomains',
      description: 'The URL has an unusual number of subdomains, which is common in phishing sites',
      severity: 'medium',
      matched: hostname,
    });
  }

  // Check 6: Very long URLs
  if (url.length > 100) {
    signals.push({
      category: 'url-structure',
      pattern: 'long-url',
      description: `The URL is unusually long (${url.length} characters). Scammers often use long URLs to hide suspicious elements`,
      severity: 'low',
      matched: url.substring(0, 100) + '...',
    });
  }

  // Check 7: @ sign in URL (credential stuffing trick)
  if (url.includes('@')) {
    signals.push({
      category: 'url-structure',
      pattern: 'at-sign-trick',
      description: 'The URL contains an @ sign, which can be used to trick you about the real destination',
      severity: 'critical',
      matched: url.split('@')[0] + '@',
    });
  }

  // Check 8: Double slashes in path
  if (pathname.includes('//')) {
    signals.push({
      category: 'url-structure',
      pattern: 'double-slashes',
      description: 'The URL contains unusual double slashes in the path, which may indicate tampering',
      severity: 'medium',
      matched: pathname,
    });
  }

  // Check 9: Suspicious port numbers
  if (port && port !== '80' && port !== '443') {
    signals.push({
      category: 'url-structure',
      pattern: 'suspicious-port',
      description: `The URL uses an unusual port number (${port}). Legitimate websites typically use standard ports`,
      severity: 'medium',
      matched: port,
    });
  }

  // Check 10: Encoded characters that could be typosquatting
  const suspiciousEncodings = /%00|%01|%20%20|%252f|%2e%2e/i;
  if (suspiciousEncodings.test(url)) {
    signals.push({
      category: 'url-structure',
      pattern: 'suspicious-encoding',
      description: 'The URL contains suspicious encoded characters that may be used to disguise the real destination',
      severity: 'high',
      matched: url.match(suspiciousEncodings)?.[0] || 'encoded characters',
    });
  }

  return signals;
}

/**
 * Check if a domain is typosquatting a popular brand
 * @param domain The domain to check
 * @returns Array of threat signals if typosquatting detected
 */
export function checkTyposquatting(domain: string): ThreatSignal[] {
  const signals: ThreatSignal[] = [];

  // Normalize the domain (remove protocol, www, path, etc.)
  let normalizedDomain = domain.toLowerCase().trim();

  // Remove protocol if present
  normalizedDomain = normalizedDomain.replace(/^https?:\/\//, '');

  // Remove www. prefix
  normalizedDomain = normalizedDomain.replace(/^www\./, '');

  // Remove path and query string
  normalizedDomain = normalizedDomain.split('/')[0].split('?')[0];

  // Check against each common domain
  for (const trustedDomain of COMMON_DOMAINS) {
    // Skip if exact match (it's legitimate)
    if (normalizedDomain === trustedDomain) {
      continue;
    }

    const distance = levenshteinDistance(normalizedDomain, trustedDomain);

    // If distance is 1-2, it's very close but not exact - likely typosquatting
    if (distance >= 1 && distance <= 2) {
      signals.push({
        category: 'typosquatting',
        pattern: 'similar-domain',
        description: `This domain looks very similar to "${trustedDomain}" but is not the same. This is a common scam technique called typosquatting`,
        severity: 'critical',
        matched: `${normalizedDomain} (similar to ${trustedDomain})`,
      });
    }
  }

  return signals;
}
