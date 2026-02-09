export enum ThreatLevel {
  Safe = 'safe',
  Caution = 'caution',
  Danger = 'danger',
}

export enum ContentType {
  Email = 'email',
  Text = 'text',
  Url = 'url',
}

export interface ThreeQuestions {
  whoIsThisFrom: {
    summary: string;
    detail: string;
    trustIndicator: ThreatLevel;
  };
  whatDoTheyWant: {
    summary: string;
    detail: string;
    trustIndicator: ThreatLevel;
  };
  shouldITrust: {
    summary: string;
    detail: string;
    trustIndicator: ThreatLevel;
  };
}

export interface ThreatSignal {
  category: string;
  pattern: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  matched: string;
}

export interface CheckResult {
  id: string;
  contentType: ContentType;
  threatLevel: ThreatLevel;
  score: number;
  confidence: number;
  threeQuestions: ThreeQuestions;
  signals: ThreatSignal[];
  summary: string;
  checkedAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface TrustedSite {
  id: string;
  name: string;
  domain: string;
  category: TrustedSiteCategory;
  description: string;
  verified: boolean;
}

export enum TrustedSiteCategory {
  Banking = 'banking',
  Government = 'government',
  Healthcare = 'healthcare',
  Shopping = 'shopping',
  Social = 'social',
  Email = 'email',
  Utilities = 'utilities',
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface CheckRequest {
  content: string;
  contentType: ContentType;
  metadata?: {
    sender?: string;
    subject?: string;
    source?: string;
  };
}

export interface EmergencyAction {
  id: string;
  title: string;
  description: string;
  steps: string[];
  urgency: 'immediate' | 'soon' | 'when-possible';
  contacts?: { name: string; phone?: string; url?: string }[];
}
