import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(import.meta.dirname, '../../.env') });

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/seniorprotect',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8081',
  googleSafeBrowsingKey: process.env.GOOGLE_SAFE_BROWSING_API_KEY || '',
  phishTankApiKey: process.env.PHISHTANK_API_KEY || '',
} as const;
