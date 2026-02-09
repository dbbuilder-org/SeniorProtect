import { ThreatLevel, TrustedSiteCategory } from './types';

// API Routes
export const API_VERSION = 'v1';
export const API_BASE = `/api/${API_VERSION}`;

export const ROUTES = {
  AUTH: {
    REGISTER: `${API_BASE}/auth/register`,
    LOGIN: `${API_BASE}/auth/login`,
    REFRESH: `${API_BASE}/auth/refresh`,
    LOGOUT: `${API_BASE}/auth/logout`,
  },
  CHECK: {
    EMAIL: `${API_BASE}/check/email`,
    TEXT: `${API_BASE}/check/text`,
    URL: `${API_BASE}/check/url`,
  },
  SITES: {
    LIST: `${API_BASE}/sites`,
    SEARCH: `${API_BASE}/sites/search`,
  },
  USER: {
    PROFILE: `${API_BASE}/user/profile`,
    SETTINGS: `${API_BASE}/user/settings`,
    STATS: `${API_BASE}/user/statistics`,
  },
  HEALTH: '/health',
} as const;

// Design tokens
export const COLORS = {
  safe: {
    bg: '#E8F5E9',
    text: '#1B5E20',
    icon: '#2E7D32',
  },
  caution: {
    bg: '#FFF3E0',
    text: '#BF360C',
    icon: '#E65100',
  },
  danger: {
    bg: '#FFEBEE',
    text: '#B71C1C',
    icon: '#C62828',
  },
  primary: {
    bg: '#1565C0',
    text: '#FFFFFF',
    light: '#E3F2FD',
  },
  neutral: {
    bg: '#FFFFFF',
    text: '#212121',
    secondary: '#616161',
    border: '#E0E0E0',
    surface: '#F5F5F5',
  },
} as const;

export const TYPOGRAPHY = {
  body: 18,
  bodyLarge: 20,
  h1: 32,
  h2: 26,
  h3: 22,
  caption: 16,
  button: 20,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const TOUCH_TARGET = 60;

export const THREAT_LABELS: Record<ThreatLevel, { title: string; description: string }> = {
  [ThreatLevel.Safe]: {
    title: 'Looks Safe',
    description: 'This appears to be legitimate. No warning signs detected.',
  },
  [ThreatLevel.Caution]: {
    title: 'Be Careful',
    description: 'Some warning signs were found. Please review the details below.',
  },
  [ThreatLevel.Danger]: {
    title: 'Warning — Likely a Scam',
    description: 'Multiple serious warning signs detected. Do not respond or click any links.',
  },
};

export const CATEGORY_LABELS: Record<TrustedSiteCategory, string> = {
  [TrustedSiteCategory.Banking]: 'Banking & Finance',
  [TrustedSiteCategory.Government]: 'Government',
  [TrustedSiteCategory.Healthcare]: 'Healthcare',
  [TrustedSiteCategory.Shopping]: 'Shopping',
  [TrustedSiteCategory.Social]: 'Social Media',
  [TrustedSiteCategory.Email]: 'Email & Communication',
  [TrustedSiteCategory.Utilities]: 'Utilities & Services',
};

// Rate limits
export const RATE_LIMITS = {
  CHECKS_PER_HOUR: 100,
  CHECKS_PER_DAY: 500,
  UNAUTH_CHECKS_PER_HOUR: 10,
} as const;

// Cache
export const CACHE_TTL = {
  CHECK_RESULT: 3600, // 1 hour in seconds
  TRUSTED_SITES: 86400, // 24 hours
  USER_SESSION: 900, // 15 minutes
} as const;
