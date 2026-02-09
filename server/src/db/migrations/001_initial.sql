-- SeniorProtect initial schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  font_size_preference VARCHAR(20) DEFAULT 'large',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

CREATE TABLE threat_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content_type VARCHAR(20) NOT NULL,
  content_hash VARCHAR(64) NOT NULL,
  threat_level VARCHAR(20) NOT NULL,
  score DECIMAL(5,4) NOT NULL,
  confidence DECIMAL(5,4) NOT NULL,
  signals JSONB DEFAULT '[]',
  three_questions JSONB,
  summary TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_threat_checks_user ON threat_checks(user_id);
CREATE INDEX idx_threat_checks_hash ON threat_checks(content_hash);
CREATE INDEX idx_threat_checks_created ON threat_checks(created_at);

CREATE TABLE known_scams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_type VARCHAR(50) NOT NULL,
  pattern TEXT NOT NULL,
  description TEXT,
  severity VARCHAR(20) NOT NULL,
  category VARCHAR(50),
  source VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE trusted_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trusted_sites_category ON trusted_sites(category);
CREATE INDEX idx_trusted_sites_domain ON trusted_sites(domain);
