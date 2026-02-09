import { ThreeQuestions, ThreatLevel, ThreatSignal, ContentType } from '@senior-protect/shared';

export function generateThreeQuestions(
  contentType: ContentType,
  threatLevel: ThreatLevel,
  signals: ThreatSignal[],
  metadata?: { sender?: string; subject?: string }
): ThreeQuestions {
  return {
    whoIsThisFrom: generateWho(contentType, threatLevel, signals, metadata),
    whatDoTheyWant: generateWhat(contentType, threatLevel, signals),
    shouldITrust: generateTrust(threatLevel, signals),
  };
}

function generateWho(
  contentType: ContentType,
  threatLevel: ThreatLevel,
  signals: ThreatSignal[],
  metadata?: { sender?: string; subject?: string }
) {
  const hasImpersonation = signals.some((s) => s.category === 'impersonation' || s.category === 'brand_mismatch');
  const hasSuspiciousSender = signals.some((s) => s.category === 'suspicious_sender');

  if (threatLevel === ThreatLevel.Danger) {
    const senderInfo = metadata?.sender ? `"${metadata.sender}"` : 'The sender';
    return {
      summary: hasImpersonation
        ? 'Likely someone pretending to be a trusted company'
        : 'Unknown or suspicious sender',
      detail: hasImpersonation
        ? `${senderInfo} appears to be impersonating a well-known company. Real companies don't usually ask for personal information this way.`
        : `${senderInfo} shows signs of being a scammer. Be very cautious about who this really is.`,
      trustIndicator: ThreatLevel.Danger,
    };
  }

  if (threatLevel === ThreatLevel.Caution) {
    return {
      summary: hasSuspiciousSender ? 'Sender may not be who they claim' : 'Could not fully verify the sender',
      detail: 'We found some things that suggest the sender might not be who they say they are. It\'s worth double-checking before taking action.',
      trustIndicator: ThreatLevel.Caution,
    };
  }

  return {
    summary: contentType === ContentType.Url ? 'This appears to be a legitimate website' : 'The sender appears legitimate',
    detail: contentType === ContentType.Url
      ? 'This website doesn\'t show obvious signs of being fake or dangerous.'
      : 'We didn\'t find warning signs about who sent this. It appears to come from who it says it does.',
    trustIndicator: ThreatLevel.Safe,
  };
}

function generateWhat(
  contentType: ContentType,
  threatLevel: ThreatLevel,
  signals: ThreatSignal[]
) {
  const hasCredentialRequest = signals.some((s) => s.category === 'credential_request');
  const hasFinancialPressure = signals.some((s) => s.category === 'financial_pressure');
  const hasUrgency = signals.some((s) => s.category === 'urgency');
  const hasTooGood = signals.some((s) => s.category === 'too_good_to_be_true');

  if (threatLevel === ThreatLevel.Danger) {
    if (hasCredentialRequest) {
      return {
        summary: 'They want your personal information',
        detail: 'This message is asking for sensitive information like passwords, account numbers, or identity details. Legitimate companies will never ask for this through email or text.',
        trustIndicator: ThreatLevel.Danger,
      };
    }
    if (hasFinancialPressure) {
      return {
        summary: 'They want your money',
        detail: 'This message involves financial requests or promises that are typical of scams. Be especially cautious of requests for wire transfers, gift cards, or cryptocurrency.',
        trustIndicator: ThreatLevel.Danger,
      };
    }
    return {
      summary: 'They want to trick you into acting quickly',
      detail: 'Scammers use urgency and fear to make you act before thinking. Take a deep breath — legitimate organizations give you time to respond.',
      trustIndicator: ThreatLevel.Danger,
    };
  }

  if (threatLevel === ThreatLevel.Caution) {
    if (hasUrgency) {
      return {
        summary: 'They seem to want you to act quickly',
        detail: 'The message has some urgency language. While this isn\'t always a scam, take your time and verify before responding.',
        trustIndicator: ThreatLevel.Caution,
      };
    }
    if (hasTooGood) {
      return {
        summary: 'The offer seems unusually good',
        detail: 'If something sounds too good to be true, it often is. Verify this offer through the company\'s official website.',
        trustIndicator: ThreatLevel.Caution,
      };
    }
    return {
      summary: 'Some elements of this message seem unusual',
      detail: 'We found a few things that don\'t quite add up. It\'s worth taking a closer look before responding.',
      trustIndicator: ThreatLevel.Caution,
    };
  }

  return {
    summary: contentType === ContentType.Url ? 'This website appears to have a normal purpose' : 'This message appears normal',
    detail: contentType === ContentType.Url
      ? 'The website doesn\'t appear to be trying to trick you or steal information.'
      : 'The content of this message doesn\'t show common scam patterns. It appears to be a normal communication.',
    trustIndicator: ThreatLevel.Safe,
  };
}

function generateTrust(threatLevel: ThreatLevel, signals: ThreatSignal[]) {
  const signalCount = signals.length;

  if (threatLevel === ThreatLevel.Danger) {
    return {
      summary: 'No — do not respond or click any links',
      detail: `We found ${signalCount} warning sign${signalCount !== 1 ? 's' : ''}. This has strong characteristics of a scam. Do not reply, click links, or share any information. If you're unsure, contact the company directly using a phone number you find yourself (not one from this message).`,
      trustIndicator: ThreatLevel.Danger,
    };
  }

  if (threatLevel === ThreatLevel.Caution) {
    return {
      summary: 'Be careful — verify before you act',
      detail: `We found ${signalCount} thing${signalCount !== 1 ? 's' : ''} to be cautious about. Before responding, try to verify this is real by contacting the company directly through their official website or phone number.`,
      trustIndicator: ThreatLevel.Caution,
    };
  }

  return {
    summary: 'This appears trustworthy',
    detail: 'We didn\'t find warning signs, but always be cautious with unexpected messages. If something feels off, trust your instincts and verify directly with the sender.',
    trustIndicator: ThreatLevel.Safe,
  };
}
