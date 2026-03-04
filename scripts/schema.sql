-- ============================================================
-- Subscribly — Supabase PostgreSQL Schema
-- Run this ONCE in your Supabase project's SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── PLANS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL CHECK (name IN ('Free', 'Pro', 'Premium')),
  price       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  duration    INTEGER NOT NULL DEFAULT 30,   -- days
  daily_limit INTEGER NOT NULL DEFAULT 50,   -- -1 = unlimited
  features    TEXT[] DEFAULT '{}',
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── USERS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  api_key     TEXT UNIQUE,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── SUBSCRIPTIONS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id     UUID NOT NULL REFERENCES plans(id),
  start_date  TIMESTAMPTZ DEFAULT now(),
  expiry_date TIMESTAMPTZ NOT NULL,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── USAGE LOGS ───────────────────────────────────────────────────────────
-- One row per user per day; UNIQUE ensures no duplicates
CREATE TABLE IF NOT EXISTS usage_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  request_count   INTEGER DEFAULT 0,
  last_request_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ─── INDEXES for performance ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status  ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_date  ON usage_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_users_api_key         ON users(api_key);

-- ─── ROW LEVEL SECURITY (optional, for direct client access) ─────────────
-- We use service role key server-side, so RLS is not strictly needed,
-- but enable it as a safety net
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs    ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically — no policies needed for server use
