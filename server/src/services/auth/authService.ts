import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../config/database.js';
import { env } from '../../config/env.js';
import type { User, AuthTokens } from '@senior-protect/shared';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const BCRYPT_ROUNDS = 12;

interface TokenPayload {
  userId: string;
  email: string;
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<{ user: User; tokens: AuthTokens }> {
  const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const result = await query<{ id: string; email: string; display_name: string; created_at: string }>(
    `INSERT INTO users (email, password_hash, display_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, display_name, created_at`,
    [email.toLowerCase(), passwordHash, displayName]
  );

  const row = result.rows[0];
  const user: User = {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    createdAt: row.created_at,
  };

  const tokens = await generateTokens(user);
  return { user, tokens };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; tokens: AuthTokens }> {
  const result = await query<{
    id: string; email: string; display_name: string;
    password_hash: string; created_at: string;
  }>(
    'SELECT id, email, display_name, password_hash, created_at FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const row = result.rows[0];
  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) {
    throw new AppError('Invalid email or password', 401);
  }

  const user: User = {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    createdAt: row.created_at,
  };

  const tokens = await generateTokens(user);
  return { user, tokens };
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  let payload: TokenPayload;
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as TokenPayload;
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const tokenHash = hashToken(refreshToken);
  const result = await query(
    'SELECT id, user_id FROM refresh_tokens WHERE token_hash = $1 AND revoked = FALSE AND expires_at > NOW()',
    [tokenHash]
  );

  if (result.rows.length === 0) {
    throw new AppError('Refresh token not found or revoked', 401);
  }

  // Revoke old token (rotation)
  await query('UPDATE refresh_tokens SET revoked = TRUE WHERE id = $1', [result.rows[0].id]);

  const userResult = await query<{ id: string; email: string; display_name: string; created_at: string }>(
    'SELECT id, email, display_name, created_at FROM users WHERE id = $1',
    [payload.userId]
  );

  if (userResult.rows.length === 0) {
    throw new AppError('User not found', 401);
  }

  const row = userResult.rows[0];
  const user: User = {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    createdAt: row.created_at,
  };

  return generateTokens(user);
}

export async function logoutUser(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  await query('UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1', [tokenHash]);
}

async function generateTokens(user: User): Promise<AuthTokens> {
  const payload: TokenPayload = { userId: user.id, email: user.email };

  const accessToken = jwt.sign(payload, env.jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: REFRESH_TOKEN_EXPIRY });

  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [user.id, tokenHash, expiresAt]
  );

  return { accessToken, refreshToken };
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}
