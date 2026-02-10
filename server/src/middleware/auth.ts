import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { query } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { sendWelcomeEmail } from '../services/email/emailService.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(new AppError('Authentication required', 401));
  }

  req.userId = userId;

  // Sync user to local DB in background (non-blocking for the request)
  syncUser(req).catch((err) => {
    console.error('User sync failed:', err);
  });

  next();
}

async function syncUser(req: Request) {
  const { userId } = getAuth(req);
  if (!userId) return;

  const result = await query('SELECT id FROM users WHERE id = $1', [userId]);

  if (result.rows.length === 0) {
    // First time seeing this Clerk user — create local row
    // Extract email and name from Clerk session claims
    const { sessionClaims } = getAuth(req);
    const email = (sessionClaims as any)?.email || '';
    const displayName = (sessionClaims as any)?.name || '';

    await query(
      `INSERT INTO users (id, email, display_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [userId, email, displayName]
    );

    req.userEmail = email;

    // Send welcome email (fire-and-forget)
    if (email) {
      sendWelcomeEmail(email, displayName || 'there').catch((err) => {
        console.error('Welcome email failed:', err);
      });
    }
  } else {
    // User already exists, grab email for request context
    const userResult = await query('SELECT email FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length > 0) {
      req.userEmail = userResult.rows[0].email;
    }
  }
}
