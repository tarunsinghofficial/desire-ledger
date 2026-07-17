# Desire Ledger

A personal bucket-list PWA for travel, tech, lifestyle, and more — track why you want something, when to buy it, and how it helps you.

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

## Categories

Travel & places · Tech & products · Lifestyle · Health & fitness · Learning · Home · Experiences · Other

## Scripts

- `npm run dev` — development (webpack, for PWA plugin)
- `npm run build` — production build
- `npm start` — serve production build
