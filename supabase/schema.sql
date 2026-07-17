-- Desire Ledger — Supabase schema (Clerk auth)
-- Run in the Supabase SQL editor.
-- Sync goes through Next.js /api/sync with SUPABASE_SERVICE_ROLE_KEY.

create extension if not exists "pgcrypto";

create table if not exists public.desires (
  id uuid primary key,
  clerk_user_id text not null,
  title text not null default '',
  essence text not null default '',
  category text not null default 'other',
  tags text[] not null default '{}',
  cover_mood text not null default 'forest',
  stage text not null default 'spark',
  why text not null default '',
  growth_thesis text not null default '',
  life_areas text[] not null default '{}',
  buy_window_start date,
  buy_window_end date,
  not_before date,
  urgency int not null default 3,
  blockers text not null default '',
  est_cost numeric,
  currency text not null default 'INR',
  budget_source text not null default '',
  wait_vs_buy text not null default '',
  purchased_at timestamptz,
  channel text not null default '',
  price_paid numeric,
  receipt_notes text not null default '',
  usage_now text not null default '',
  usage_frequency text not null default '',
  rituals text not null default '',
  friction text not null default '',
  unlocks_next text not null default '',
  dependent_desire_ids uuid[] not null default '{}',
  sunset_criteria text not null default '',
  focus boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key,
  clerk_user_id text not null,
  desire_id uuid not null,
  body text not null default '',
  prompt text not null default '',
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.decisions (
  id uuid primary key,
  clerk_user_id text not null,
  desire_id uuid not null,
  kind text not null,
  note text not null default '',
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists desires_clerk_updated on public.desires (clerk_user_id, updated_at);
create index if not exists desires_clerk_category on public.desires (clerk_user_id, category);
create index if not exists journal_clerk_updated on public.journal_entries (clerk_user_id, updated_at);
create index if not exists decisions_clerk_updated on public.decisions (clerk_user_id, updated_at);

-- If you previously used user_id / auth.users, migrate with:
-- alter table public.desires add column if not exists clerk_user_id text;
-- alter table public.journal_entries add column if not exists clerk_user_id text;
-- alter table public.decisions add column if not exists clerk_user_id text;
-- alter table public.desires add column if not exists category text default 'other';
