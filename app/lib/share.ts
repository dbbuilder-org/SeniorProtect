import { Share } from 'react-native';

interface CheckResult {
  content_type: string;
  threat_level: 'safe' | 'caution' | 'danger';
  summary: string;
}

const LEVEL_EMOJI: Record<string, string> = {
  safe: '\u2705',
  caution: '\u26A0\uFE0F',
  danger: '\u{1F6A8}',
};

const TYPE_LABEL: Record<string, string> = {
  email: 'Email',
  url: 'Website',
  text: 'Text Message',
};

export async function shareCheckResult(check: CheckResult) {
  const emoji = LEVEL_EMOJI[check.threat_level] || '';
  const type = TYPE_LABEL[check.content_type] || check.content_type;
  const level = check.threat_level.charAt(0).toUpperCase() + check.threat_level.slice(1);

  await Share.share({
    message: `${emoji} SeniorProtect ${type} Check: ${level}\n\n${check.summary}\n\nStay safe online with SeniorProtect!`,
  });
}

export async function shareSafetyTip(tip: string) {
  await Share.share({
    message: `\u{1F6E1}\uFE0F Safety Tip from SeniorProtect:\n\n${tip}\n\nStay safe online!`,
  });
}
