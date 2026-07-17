# Desire Ledger

A personal bucket-list PWA for travel, tech, lifestyle, and more — track why you want something, when to buy it, and how it helps you.

**Source:** [github.com/tarunsinghofficial/desire-ledger](https://github.com/tarunsinghofficial/desire-ledger)

## Stack

- Next.js + TypeScript + Tailwind
- Clerk auth (any user can sign up)
- Local-first IndexedDB (Dexie), scoped per user
- Supabase Free cloud sync via `/api/sync`
- Gemini or Groq AI (`USE_GROQ` / `USE_GEMINI`)
- Installable PWA (Serwist)

## Brand colors

- White `#ffffff` — base
- Deep Fir `#163300` — text / dark surfaces
- Sulu `#9fe870` — accents & buttons
- Mist `#f2f5f7` — soft panels

## Setup

```bash
cp .env.example .env.local
# or edit .env
npm install
npm run dev
```

### Clerk

1. Create an app at [clerk.com](https://clerk.com)
2. Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
3. Set sign-in/up URLs to `/sign-in` and `/sign-up`

### Supabase (optional cloud sync)

1. Create a free project
2. Run [`supabase/schema.sql`](supabase/schema.sql)
3. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`

### AI

```bash
USE_GROQ=true
USE_GEMINI=false
GROQ_API_KEY=...
```

### Owner allowlist (`DEMO_OWNER_USER_IDS`)

Cloud sync and AI on a given deploy are limited to Clerk user ids listed in `DEMO_OWNER_USER_IDS` (comma-separated). Empty means nobody can use sync/AI on that deploy.

Find your id in the Clerk Dashboard → Users, then:

```bash
DEMO_OWNER_USER_IDS=user_xxxxxxxx
```

Everyone else can still sign up and use the app local-only (IndexedDB on their device), with file backup/export.

## Public demo

A public Vercel deploy typically sets `DEMO_OWNER_USER_IDS` to the owner's Clerk id so random signups do not write to the owner's Supabase or spend their AI credits.

To run your own (sync + AI for you):

1. Fork or clone [tarunsinghofficial/desire-ledger](https://github.com/tarunsinghofficial/desire-ledger)
2. Create your own Clerk, Supabase, and Groq/Gemini projects
3. Copy `.env.example` → set your keys and `DEMO_OWNER_USER_IDS` to your Clerk user id
4. Deploy to Vercel (or run locally)

## Categories

Travel & places · Tech & products · Lifestyle · Health & fitness · Learning · Home · Experiences · Other

## Scripts

- `npm run dev` — development (webpack, for PWA plugin)
- `npm run build` — production build
- `npm start` — serve production build
