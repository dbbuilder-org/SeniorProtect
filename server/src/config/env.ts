import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(import.meta.dirname, '../../.env') });

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/seniorprotect',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8081',
  googleSafeBrowsingKey: process.env.GOOGLE_SAFE_BROWSING_API_KEY || '',
  phishTankApiKey: process.env.PHISHTANK_API_KEY || '',
} as const;
