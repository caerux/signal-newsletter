# Signal

> Where ideas start.

A thinking and writing tool for people who create content. Discover what's moving, understand why, generate drafts — all from one keyboard-first dashboard.

**Live status:** MVP shipped. Days 1–7 complete.

---

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ (21+ recommended)
- [pnpm](https://pnpm.io/) — `npm i -g pnpm`
- A [Supabase](https://supabase.com/) project (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/your-org/signal-newsletter
cd signal-newsletter
pnpm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role secret |
| `INGEST_SECRET` | Any random 32-byte string — run `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `DATABASE_URL` | Supabase → Project Settings → Database → URI (use the pooler URI for serverless) |

### 3. Apply database migrations

```bash
node scripts/apply-migrations.mjs
```

This runs all SQL files in `supabase/migrations/` against your database in order.

### 4. Seed categories and RSS sources

Paste the contents of `supabase/seed.sql` into the Supabase SQL editor and run.

### 5. Start dev server

```bash
pnpm dev
# → http://localhost:3000
```

The app opens at the landing page (`/home`). Sign up or log in at `/login` (magic link or GitHub OAuth). The main feed is at `/`.

### 6. Ingest articles

Hit the ingest route once to populate the feed:

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "x-ingest-secret: YOUR_INGEST_SECRET"
```

In production this runs automatically every 6 hours via a Vercel Cron.

---

## Repository layout

```
signal-newsletter/
├── app/
│   ├── (app)/              → Authenticated app routes (feed, queue, dashboard, drafts/[id])
│   ├── (auth)/             → Login page + OAuth callback
│   ├── (marketing)/home/   → Public landing page (/home)
│   ├── api/                → feed, ingest, bookmarks, drafts routes
│   ├── design-system/      → Living styleguide for all primitives
│   └── globals.css         → Design tokens + Tailwind 4 @theme inline config
├── components/
│   ├── ui/                 → Primitives: Brick, Button, Chip, Sticker, Kbd, Avatar, Tab, Eyebrow
│   ├── shell/              → AppShell, Navbar, Sidebar, KeyboardShortcuts, CommandPalette, contexts
│   ├── feed/               → InfiniteFeed, StoryCard, FeedViews, QueueClient, FeedStates
│   └── drafts/             → DraftEditor (textarea + auto-save + export)
├── lib/
│   ├── supabase/           → createClient (client + server + middleware)
│   ├── env.ts              → Zod-validated public env vars
│   ├── env.server.ts       → Zod-validated server-only env vars
│   ├── relativeTime.ts     → "2h ago" helper
│   └── tokens.ts           → CSS-var ↔ TS bridge (Fill, Signal types)
├── supabase/
│   ├── migrations/         → 0001_schema, 0002_rls, 0003_signal_score
│   └── seed.sql            → Categories + 22 RSS sources
├── scripts/                → apply-migrations.mjs, seed-signal-scores.mjs
└── docs/
    ├── CHECKLIST.md        → ✅ Live progress tracker — read this first
    ├── PRODUCT.md          → Vision, personas, features
    ├── DESIGN_SYSTEM.md    → Soft Neobrutalism spec (tokens, motion, a11y)
    └── ROADMAP.md          → Phased plan (MVP → v2+)
```

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js App Router + RSC, React 19, TypeScript 5, Turbopack, pnpm |
| Styling | Tailwind 4 CSS-first (`@theme inline`), CSS variables for all design tokens |
| UI primitives | In-house over global CSS (no shadcn) — `components/ui/` |
| Animation | Framer Motion — spring easing, reveal keyframes |
| Command palette | `cmdk` on `⌘K` |
| Database + Auth | Supabase (Postgres + Auth + RLS + Storage) |
| Deployment | Vercel (Vercel Cron for RSS ingestion every 6h) |
| Analytics | Plausible (snippet in `app/layout.tsx`) |

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `J` | Next article |
| `K` | Previous article |
| `S` | Bookmark / un-bookmark focused article |
| `[` | Toggle left sidebar |
| `]` | Toggle right insight panel |
| `⌘K` | Open command palette |

---

## Design direction: Soft Neobrutalism

Chunky borders, hard drop shadows, pastel blocks, spring animations. Playful but disciplined.

- Every surface is a **brick** — 2.5px black border, 5px hard drop shadow, rounded corners
- Shadows are always offset, never blurred
- Motion uses spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) — things overshoot and settle
- Pastels for category, signal badges, and emphasis. Black text only.
- Fonts: **Fraunces** (display), **Space Grotesk** (UI), **JetBrains Mono** (metadata)

See [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) for the full token spec.

---

## Deploy to Vercel

1. Push to GitHub.
2. Import project in [Vercel](https://vercel.com/new).
3. Add all env vars from `.env.local` to Vercel → Settings → Environment Variables.
4. Add a Cron Job in `vercel.json` to call `/api/ingest` every 6 hours:

```json
{
  "crons": [{ "path": "/api/ingest", "schedule": "0 */6 * * *" }]
}
```

5. Deploy. Done.

---

## Contributing

Read [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) § 11 (Do's and Don'ts) before opening a PR. Design system violations will be rejected — the consistency is the product.

Commit messages use conventional prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
