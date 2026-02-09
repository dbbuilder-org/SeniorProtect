import { ThreatSignal, ContentType } from '@senior-protect/shared';

interface PatternMatch {
  category: string;
  pattern: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  matched: string;
}

interface PatternDefinition {
  regex: RegExp;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

// Brand to legitimate domain mapping for impersonation detection
const BRAND_DOMAINS: Record<string, string[]> = {
  amazon: ['amazon.com', 'amazon.co.uk', 'amazon.ca', 'amazon.de', 'amazon.fr'],
  paypal: ['paypal.com', 'paypal.co.uk'],
  apple: ['apple.com', 'icloud.com'],
  microsoft: ['microsoft.com', 'outlook.com', 'live.com', 'hotmail.com'],
  google: ['google.com', 'gmail.com'],
  facebook: ['facebook.com', 'fb.com'],
  netflix: ['netflix.com'],
  walmart: ['walmart.com'],
  'bank of america': ['bankofamerica.com', 'bofa.com'],
  'wells fargo': ['wellsfargo.com'],
  chase: ['chase.com', 'jpmorgan.com'],
  citibank: ['citi.com', 'citibank.com'],
  irs: ['irs.gov'],
  'social security': ['ssa.gov'],
  usps: ['usps.com', 'usps.gov'],
  fedex: ['fedex.com'],
  ups: ['ups.com'],
  ebay: ['ebay.com'],
  target: ['target.com'],
  costco: ['costco.com'],
  'american express': ['americanexpress.com', 'aexp.com'],
};

// Free email provider TLDs that shouldn't be used for business communications
const FREE_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'protonmail.com',
  'mail.com',
  'icloud.com',
  'zoho.com',
  'yandex.com',
];

// Comprehensive pattern definitions
const PATTERNS: PatternDefinition[] = [
  // URGENCY patterns
  {
    regex: /account\s+(has\s+been\s+)?suspended/i,
    description: 'Claims your account has been suspended',
    severity: 'high',
    category: 'urgency',
  },
  {
    regex: /act\s+now/i,
    description: 'Pressures you to act immediately',
    severity: 'medium',
    category: 'urgency',
  },
  {
    regex: /urgent\s+action\s+required/i,
    description: 'Creates false urgency',
    severity: 'high',
    category: 'urgency',
  },
  {
    regex: /within\s+\d+\s+(hours?|minutes?)/i,
    description: 'Sets artificial time pressure',
    severity: 'high',
    category: 'urgency',
  },
  {
    regex: /verify\s+your\s+account/i,
    description: 'Requests account verification (common phishing tactic)',
    severity: 'high',
    category: 'urgency',
  },
  {
    regex: /expire[sd]?\s+(soon|today|tomorrow|in)/i,
    description: 'Claims something is about to expire',
    severity: 'medium',
    category: 'urgency',
  },
  {
    regex: /limited\s+time/i,
    description: 'Creates false scarcity',
    severity: 'medium',
    category: 'urgency',
  },
  {
    regex: /deadline/i,
    description: 'Pressures with artificial deadlines',
    severity: 'medium',
    category: 'urgency',
  },
  {
    regex: /immediately/i,
    description: 'Demands immediate action',
    severity: 'medium',
    category: 'urgency',
  },
  {
    regex: /final\s+(notice|warning|reminder)/i,
    description: 'Claims this is your last chance',
    severity: 'high',
    category: 'urgency',
  },

  // CREDENTIAL REQUEST patterns
  {
    regex: /\b(enter|provide|confirm|verify|update)\s+(your\s+)?(password|login)/i,
    description: 'Requests your password',
    severity: 'critical',
    category: 'credential_request',
  },
  {
    regex: /\bssn\b|social\s+security\s+number/i,
    description: 'Requests your Social Security Number',
    severity: 'critical',
    category: 'credential_request',
  },
  {
    regex: /credit\s+card\s+number/i,
    description: 'Requests your credit card number',
    severity: 'critical',
    category: 'credential_request',
  },
  {
    regex: /bank\s+account\s+(number|details)/i,
    description: 'Requests your bank account information',
    severity: 'critical',
    category: 'credential_request',
  },
  {
    regex: /\bPIN\b|personal\s+identification\s+number/i,
    description: 'Requests your PIN',
    severity: 'critical',
    category: 'credential_request',
  },
  {
    regex: /login\s+credentials/i,
    description: 'Requests your login credentials',
    severity: 'critical',
    category: 'credential_request',
  },
  {
    regex: /verify\s+your\s+identity/i,
    description: 'Requests identity verification (often a phishing tactic)',
    severity: 'high',
    category: 'credential_request',
  },
  {
    regex: /(cvv|security\s+code)/i,
    description: 'Requests your card security code',
    severity: 'critical',
    category: 'credential_request',
  },
  {
    regex: /routing\s+number/i,
    description: 'Requests your bank routing number',
    severity: 'critical',
    category: 'credential_request',
  },

  // FINANCIAL PRESSURE patterns
  {
    regex: /you'?ve\s+won/i,
    description: 'Claims you won something you didn\'t enter',
    severity: 'high',
    category: 'financial_pressure',
  },
  {
    regex: /congratulations!?\s+(you|on)/i,
    description: 'Unexpected congratulatory message',
    severity: 'medium',
    category: 'financial_pressure',
  },
  {
    regex: /\b(prize|reward|sweepstakes)\b/i,
    description: 'Mentions prizes or rewards',
    severity: 'medium',
    category: 'financial_pressure',
  },
  {
    regex: /wire\s+transfer/i,
    description: 'Requests wire transfer (irreversible payment method)',
    severity: 'critical',
    category: 'financial_pressure',
  },
  {
    regex: /gift\s+card/i,
    description: 'Requests payment via gift cards (common scam)',
    severity: 'critical',
    category: 'financial_pressure',
  },
  {
    regex: /\b(western\s+union|moneygram)\b/i,
    description: 'Requests untraceable money transfer',
    severity: 'critical',
    category: 'financial_pressure',
  },
  {
    regex: /\b(bitcoin|cryptocurrency|crypto|btc|eth)\b/i,
    description: 'Requests cryptocurrency payment',
    severity: 'high',
    category: 'financial_pressure',
  },
  {
    regex: /inheritance/i,
    description: 'Mentions unexpected inheritance',
    severity: 'high',
    category: 'financial_pressure',
  },
  {
    regex: /\d+\s+million\s+(dollars?|USD)/i,
    description: 'Mentions unrealistic large sums of money',
    severity: 'high',
    category: 'financial_pressure',
  },
  {
    regex: /claim\s+your\s+(money|prize|reward)/i,
    description: 'Pressures you to claim unexpected money',
    severity: 'high',
    category: 'financial_pressure',
  },
  {
    regex: /refund\s+(of|for)\s+\$?\d+/i,
    description: 'Claims you are owed a refund',
    severity: 'medium',
    category: 'financial_pressure',
  },

  // IMPERSONATION patterns (generic greetings)
  {
    regex: /^dear\s+(customer|user|member|account\s+holder)/i,
    description: 'Generic greeting (legitimate companies use your name)',
    severity: 'medium',
    category: 'impersonation',
  },
  {
    regex: /valued\s+(customer|member|user)/i,
    description: 'Generic greeting instead of your name',
    severity: 'medium',
    category: 'impersonation',
  },
  {
    regex: /dear\s+sir\/madam/i,
    description: 'Generic formal greeting (sign of phishing)',
    severity: 'medium',
    category: 'impersonation',
  },

  // THREAT LANGUAGE patterns
  {
    regex: /legal\s+action/i,
    description: 'Threatens legal action',
    severity: 'high',
    category: 'threat_language',
  },
  {
    regex: /arrest\s+warrant/i,
    description: 'Threatens arrest (legitimate agencies don\'t do this via email)',
    severity: 'critical',
    category: 'threat_language',
  },
  {
    regex: /law\s+enforcement/i,
    description: 'Mentions law enforcement to intimidate',
    severity: 'high',
    category: 'threat_language',
  },
  {
    regex: /criminal\s+charges/i,
    description: 'Threatens criminal charges',
    severity: 'high',
    category: 'threat_language',
  },
  {
    regex: /\blawsuit\b/i,
    description: 'Threatens lawsuit',
    severity: 'high',
    category: 'threat_language',
  },
  {
    regex: /tax\s+(fraud|evasion)/i,
    description: 'Accuses you of tax crimes',
    severity: 'high',
    category: 'threat_language',
  },

  // TOO GOOD TO BE TRUE patterns
  {
    regex: /risk\s+free/i,
    description: 'Claims risk-free investment (red flag)',
    severity: 'medium',
    category: 'too_good_to_be_true',
  },
  {
    regex: /\bguaranteed\b/i,
    description: 'Makes unrealistic guarantees',
    severity: 'medium',
    category: 'too_good_to_be_true',
  },
  {
    regex: /no\s+(cost|obligation|risk)/i,
    description: 'Claims no cost or obligation',
    severity: 'low',
    category: 'too_good_to_be_true',
  },
  {
    regex: /free\s+money/i,
    description: 'Promises free money',
    severity: 'high',
    category: 'too_good_to_be_true',
  },
  {
    regex: /double\s+your/i,
    description: 'Promises to double your money',
    severity: 'high',
    category: 'too_good_to_be_true',
  },
  {
    regex: /100%\s+(satisfied|guaranteed|success)/i,
    description: 'Makes unrealistic promises',
    severity: 'medium',
    category: 'too_good_to_be_true',
  },
  {
    regex: /make\s+\$?\d+\s+(per|a)\s+(day|week|month)\s+from\s+home/i,
    description: 'Work-from-home money promise',
    severity: 'medium',
    category: 'too_good_to_be_true',
  },
  {
    regex: /once\s+in\s+a\s+lifetime/i,
    description: 'Claims rare opportunity',
    severity: 'low',
    category: 'too_good_to_be_true',
  },
];

/**
 * Extract domain from email address or URL
 */
function extractDomain(input: string): string | null {
  // Email format
  const emailMatch = input.match(/@([^>\s]+)/);
  if (emailMatch) {
    return emailMatch[1].toLowerCase();
  }

  // URL format
  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    return url.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Check if sender domain matches mentioned brands
 */
function checkBrandImpersonation(
  content: string,
  senderDomain: string | null
): PatternMatch[] {
  if (!senderDomain) return [];

  const matches: PatternMatch[] = [];

  // Check for brand mentions in content
  for (const [brand, legitimateDomains] of Object.entries(BRAND_DOMAINS)) {
    const brandRegex = new RegExp(`\\b${brand}\\b`, 'i');
    if (brandRegex.test(content)) {
      // Brand is mentioned, check if sender domain is legitimate
      const isLegitimate = legitimateDomains.some((domain) =>
        senderDomain.endsWith(domain)
      );

      if (!isLegitimate) {
        matches.push({
          category: 'impersonation',
          pattern: `brand_mismatch_${brand}`,
          description: `Claims to be from ${brand} but sender domain (${senderDomain}) doesn't match`,
          severity: 'critical',
          matched: brand,
        });
      }
    }
  }

  return matches;
}

/**
 * Check if business email is sent from free email provider
 */
function checkSuspiciousSender(
  content: string,
  senderDomain: string | null
): PatternMatch[] {
  if (!senderDomain) return [];

  const matches: PatternMatch[] = [];

  // Check if sender is from free email provider
  const isFreeEmail = FREE_EMAIL_DOMAINS.some((domain) =>
    senderDomain.endsWith(domain)
  );

  if (isFreeEmail) {
    // Look for business-related keywords that shouldn't come from free email
    const businessKeywords = [
      /\b(invoice|billing|payment|account|subscription|refund)\b/i,
      /\b(support|customer\s+service|help\s+desk)\b/i,
      /\b(bank|financial|tax|irs)\b/i,
      /\b(security|verification|authentication)\b/i,
    ];

    for (const keyword of businessKeywords) {
      if (keyword.test(content)) {
        matches.push({
          category: 'suspicious_sender',
          pattern: 'business_from_free_email',
          description: `Business-related message sent from free email provider (${senderDomain})`,
          severity: 'high',
          matched: senderDomain,
        });
        break; // Only report once per sender
      }
    }
  }

  return matches;
}

/**
 * Match all scam patterns in content
 */
export function matchPatterns(
  content: string,
  contentType: ContentType,
  metadata?: { sender?: string }
): ThreatSignal[] {
  const allMatches: PatternMatch[] = [];

  // Run pattern matching
  for (const pattern of PATTERNS) {
    const match = content.match(pattern.regex);
    if (match) {
      allMatches.push({
        category: pattern.category,
        pattern: pattern.regex.source,
        description: pattern.description,
        severity: pattern.severity,
        matched: match[0],
      });
    }
  }

  // Check for brand impersonation if sender is provided
  if (metadata?.sender) {
    const senderDomain = extractDomain(metadata.sender);
    allMatches.push(...checkBrandImpersonation(content, senderDomain));
    allMatches.push(...checkSuspiciousSender(content, senderDomain));
  }

  // Convert PatternMatch[] to ThreatSignal[]
  return allMatches;
}
