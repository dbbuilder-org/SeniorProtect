import { z } from 'zod';
import { ContentType, ThreatLevel, TrustedSiteCategory } from './types.js';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1, 'Please enter your name').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// Check schemas
export const checkEmailSchema = z.object({
  content: z.string().min(1, 'Please paste the email content').max(50000),
  metadata: z.object({
    sender: z.string().optional(),
    subject: z.string().optional(),
    source: z.string().optional(),
  }).optional(),
});

export const checkTextSchema = z.object({
  content: z.string().min(1, 'Please paste the text message').max(5000),
  metadata: z.object({
    sender: z.string().optional(),
    source: z.string().optional(),
  }).optional(),
});

export const checkUrlSchema = z.object({
  content: z.string().url('Please enter a valid URL').max(2048),
  metadata: z.object({
    source: z.string().optional(),
  }).optional(),
});

// Response schemas (for documentation/client-side validation)
export const threeQuestionsSchema = z.object({
  whoIsThisFrom: z.object({
    summary: z.string(),
    detail: z.string(),
    trustIndicator: z.nativeEnum(ThreatLevel),
  }),
  whatDoTheyWant: z.object({
    summary: z.string(),
    detail: z.string(),
    trustIndicator: z.nativeEnum(ThreatLevel),
  }),
  shouldITrust: z.object({
    summary: z.string(),
    detail: z.string(),
    trustIndicator: z.nativeEnum(ThreatLevel),
  }),
});

export const checkResultSchema = z.object({
  id: z.string(),
  contentType: z.nativeEnum(ContentType),
  threatLevel: z.nativeEnum(ThreatLevel),
  score: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  threeQuestions: threeQuestionsSchema,
  signals: z.array(z.object({
    category: z.string(),
    pattern: z.string(),
    description: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    matched: z.string(),
  })),
  summary: z.string(),
  checkedAt: z.string(),
});

// Trusted sites
export const trustedSiteSearchSchema = z.object({
  query: z.string().optional(),
  category: z.nativeEnum(TrustedSiteCategory).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type CheckEmailInput = z.infer<typeof checkEmailSchema>;
export type CheckTextInput = z.infer<typeof checkTextSchema>;
export type CheckUrlInput = z.infer<typeof checkUrlSchema>;
