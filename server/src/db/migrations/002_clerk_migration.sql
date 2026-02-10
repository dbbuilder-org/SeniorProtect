-- Migration: Switch from DIY JWT auth to Clerk
-- Clerk manages sessions/tokens, user IDs are strings like 'user_2abc...'

-- Drop refresh_tokens table (Clerk manages sessions)
DROP TABLE IF EXISTS refresh_tokens;

-- Change users.id from UUID to VARCHAR for Clerk user IDs
ALTER TABLE threat_checks DROP CONSTRAINT IF EXISTS threat_checks_user_id_fkey;

ALTER TABLE users
  ALTER COLUMN id TYPE VARCHAR(255) USING id::text,
  ALTER COLUMN id DROP DEFAULT,
  DROP COLUMN IF EXISTS password_hash;

ALTER TABLE threat_checks
  ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::text;

-- Re-add foreign key
ALTER TABLE threat_checks
  ADD CONSTRAINT threat_checks_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
