import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { clerkMiddleware } from '@clerk/express';
import { env } from './config/env.js';
import { initRedis } from './config/redis.js';
import { errorHandler } from './middleware/errorHandler.js';
import sitesRoutes from './routes/sites.js';
import checkRoutes from './routes/check.js';
import userRoutes from './routes/user.js';

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// Clerk auth middleware (populates auth state on all requests)
app.use(clerkMiddleware());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'TooManyRequests', message: 'Please try again later.', statusCode: 429 },
});
app.use(limiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/sites', sitesRoutes);
app.use('/api/v1/check', checkRoutes);
app.use('/api/v1/user', userRoutes);

// Error handler
app.use(errorHandler);

async function start() {
  await initRedis();
  app.listen(env.port, () => {
    console.log(`SeniorProtect server running on port ${env.port} (${env.nodeEnv})`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
