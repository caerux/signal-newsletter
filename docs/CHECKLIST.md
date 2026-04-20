# Signal — Build Checklist

> The single source of truth for _what is done_ and _what is next_.
> Short-horizon counterpart to [`ROADMAP.md`](./ROADMAP.md).

**Last updated:** 2026-04-20 · end of Day 2
**Current phase:** Phase 1 (MVP, Day 3 up next)

---

## How to use this file

- **Agents & humans, read this first** before picking up work. It reflects the real state of `main`, which is often ahead of (or behind) the roadmap's aspirational plan.
- Check items off the moment they land on `main`. Don't mark in-flight work as done.
- Add new tasks under **Planned next** as they're identified. Move tasks into **Backlog** if explicitly deferred.
- Capture any non-obvious choice in **Key decisions** so we don't re-litigate it next week.
- When a phase completes, add a compact recap line at the top of its section.

---

## Shipped

### Phase 0 · Foundation _(Day 0)_

- [x] Product brief — [`docs/PRODUCT.md`](./PRODUCT.md)
- [x] Design system spec — [`docs/DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)
- [x] Phased roadmap — [`docs/ROADMAP.md`](./ROADMAP.md)
- [x] Five HTML design-direction mockups under `design-explorer/`
- [x] Direction locked: **Soft Neobrutalism**

### Phase 1 · Day 1 — Foundation & shell

- [x] Scaffold Next.js 16.2 + React 19 + TypeScript + Tailwind 4 + Turbopack (pnpm)
- [x] Install runtime deps: `framer-motion`, `next-themes`, `cmdk`, `zod`, `lucide-react`, `@supabase/ssr`, `@supabase/supabase-js`
- [x] Wire Fraunces / Space Grotesk / JetBrains Mono via `next/font`
- [x] Port design tokens into `app/globals.css` (colors, shadow scale, radii, easings, 8 keyframes, `@theme inline` bridge for Tailwind 4)
- [x] Root layout locked to `h-screen overflow-hidden` so only the main column scrolls
- [x] `AppShell` with 3-column grid (sidebar · main · insight)
- [x] Collapsible sidebar + insight panel with `localStorage` persistence
- [x] Keyboard shortcuts: `[` toggles sidebar, `]` toggles insight
- [x] Custom `.pane-scroll` chunky black scrollbar
- [x] Sticky navbar (logo, search field, avatar, "New idea" CTA)
- [x] Placeholder feed page: hero brick + 3 signal-tagged stories
- [x] Git repo init → `github.com/caerux/signal-newsletter`
- [x] Keychain set up for dual GitHub accounts via `caerux@...` URL pattern

### Phase 1 · Day 2 — Core components & polish

- [x] `lib/cn.ts` — zero-dep classname helper
- [x] `lib/tokens.ts` — TS ↔ CSS var bridge (`Fill`, `Signal` types, `FILL_VAR`, `SIGNAL_LABEL`)
- [x] UI primitives in `components/ui/`: `Brick`, `Button`, `Chip`, `Sticker`, `Kbd`, `Avatar`, `Tab`, `Eyebrow`
- [x] `Navbar`, `Sidebar`, `InsightPanel`, feed rebuilt on top of primitives
- [x] `ViewContext` + interactive tabs (Feed / Saved / Drafts / Trending)
- [x] Per-view layouts: Feed cards, Saved list, Drafts with status chips, Trending rail with `+%` deltas
- [x] `cmdk` command palette on `⌘K` (Navigate / Actions / Categories groups, shortcut hints); clicking the search bar dispatches the shortcut
- [x] `framer-motion`: `AnimatePresence` for view transitions, reveal stagger per card, hover lift, tap sink
- [x] `/design-system` living styleguide route (palette, typography, primitives, shadows, keyframes, example composition)

---

## In progress

_Nothing is actively in flight right now._

---

## Planned next — pick one to start

A near-term shortlist. Each item is self-contained enough to be one session of work.

1. **Vercel deploy** — import `caerux/signal-newsletter` in the Vercel dashboard. No env vars needed yet, static pages will prerender. Outcome: a live URL to share.
2. **Supabase + real data (Day 3 start)** — create the project, apply schema + RLS, stand up the RSS ingestion worker, hook Vercel Cron.
3. **Polish pass** — focus-visible rings on primitives, skeleton loaders for feed states, proper `prefers-reduced-motion` handling for `framer-motion`, responsive collapse breakpoints.
4. **Shortcut expansion** — wire `J`/`K` feed navigation, `S` to save focused story, `E` to expand insight panel, `D` to generate draft (stubbed until Day 5).

Move an item here into **In progress** before starting it.

---

## Upcoming MVP work _(Phase 1, Days 3-7)_

### Day 3 — Data model, auth, ingestion

- [ ] Create Supabase project _(needs user action)_
- [ ] Schema: `users`, `categories`, `sources`, `articles`, `bookmarks`, `summaries`, `ideas`, `drafts`
- [ ] Row-Level Security policies on all user-scoped tables
- [ ] `@supabase/ssr` server + browser client helpers
- [ ] Supabase magic-link auth + GitHub OAuth
- [ ] `/login` route with neobrutalist form
- [ ] RSS ingestion worker at `/api/ingest` (parse ~20 curated feeds, dedupe by canonical URL)
- [ ] Vercel Cron: run `/api/ingest` every 15 minutes

### Day 4 — Feed UX on real data

- [ ] `/api/feed` route with filters (category, signal, timeframe)
- [ ] Convert feed page to RSC reading Supabase
- [ ] Infinite scroll via `react-intersection-observer`
- [ ] Sidebar categories bound to real counts
- [ ] Replace placeholder palette categories/sources with DB-fetched values
- [ ] Empty / loading (skeleton) / error states
- [ ] Signal score v1: `normalize(sources_covering × publish_velocity / age_hours)`
  - `hot` > 80, `rise` 50-80, `cool` < 50

### Day 5 — AI layer

- [ ] `lib/ai/client.ts` — OpenAI wrapper, model configurable via env
- [ ] Zod schemas: `SummarySchema`, `IdeasSchema`, `DraftSchema`
- [ ] `/api/summarize` (idempotent, cache by `article_id`)
- [ ] `/api/ideas` (cache per `user_id × article_id`)
- [ ] `/api/draft` (writes to `drafts` table)
- [ ] Stream responses into Insight panel via Server Actions + `useOptimistic`
- [ ] Cost guardrails: free tier = 10 summaries + 3 drafts / day; DB cache before any LLM call

### Day 6 — Bookmarks, queue, shortcuts

- [ ] Save article → bookmark (optimistic UI)
- [ ] `/queue` route with drag-reorder via `dnd-kit`
- [ ] `/dashboard` stats view (saved count, drafts, trending in user's categories)
- [ ] End-to-end keyboard shortcuts wired: `⌘K`, `J`/`K`, `S`, `E`, `D`, `[` / `]`

### Day 7 — Editor, landing, ship

- [ ] `/drafts/[id]` markdown editor (textarea for MVP, Tiptap in v1.1)
- [ ] Copy-to-clipboard + export `.md`
- [ ] Public landing page under `app/(marketing)/page.tsx`
- [ ] Production deploy to Vercel with env vars
- [ ] Plausible analytics snippet
- [ ] Basic error tracking (Sentry free tier or simple log flushing)
- [ ] Root README: real quick-start (dev command, env vars, contribution notes)

### MVP exit criteria _(from ROADMAP.md)_

- [ ] New user signs up → populated feed in < 60 seconds
- [ ] Save 5 articles → generate summaries → generate 1 draft → export `.md`
- [ ] All 4 tab views usable on real data
- [ ] Keyboard shortcuts navigate end-to-end
- [ ] 95%+ fidelity to `docs/DESIGN_SYSTEM.md` (measured against `/design-system`)
- [ ] Deployed to custom subdomain
- [ ] ≥ 3 external users through the loop unassisted

---

## Backlog — post-MVP _(from ROADMAP.md)_

Deferred intentionally. Don't start without a proven MVP first.

### Phase 1.1 · Weeks 2-4

- [ ] Sources: HackerNews, Product Hunt, Reddit, GitHub Trending, Twitter/X lists
- [ ] Outputs: Substack md, LinkedIn article, X thread generator, Dev.to md
- [ ] Editor upgrade: Tiptap with split-view preview
- [ ] Responsive: tablet rail collapse, mobile drawer
- [ ] Dark mode: token flip + `next-themes` toggle

### Phase 1.2 · Month 2

- [ ] 6 vertical packs (tech, startups, design, finance, climate, crypto)
- [ ] AI upgrades: style transfer, counterpoint mode, outline-first, research mode
- [ ] Trending analytics: rising sources, quiet signals, "what you missed" digest
- [ ] User-added RSS + shareable source bundles
- [ ] YouTube / podcast transcription ingest

### Phase 2 · Months 3-4

- [ ] Direct publishing: Medium, Substack, LinkedIn, Ghost, Buffer/Typefully
- [ ] Hosted newsletter at `signal.so/u/username`
- [ ] Teams (B2B) workspace with roles + editorial calendar
- [ ] Chrome extension (save-from-anywhere)
- [ ] Audio (TTS) / audiograms / AI-generated header images

### Phase 3 · Month 6+

- [ ] Public Signal API + TS/Python SDKs
- [ ] Vertical spin-offs: Investors, Journalism, Research
- [ ] Marketplace (source packs, prompt templates)
- [ ] Personal knowledge base + Notion/Obsidian sync
- [ ] Mobile apps (iOS + Android)
- [ ] Trend-prediction ML layer

---

## Key decisions

_Capture anything a future contributor (including future-me) might otherwise waste time re-deciding._

- **Design direction** locked to Soft Neobrutalism (2026-04-20). The four alternatives in `design-explorer/` were explicitly ruled out.
- **Stack:** Next.js 16.2 (App Router + RSC), React 19, TypeScript 5.9, Tailwind 4, Turbopack, pnpm.
- **Tailwind 4 uses CSS-first config** via `@theme inline` in `app/globals.css`. **No `tailwind.config.ts`.** Tokens are declared once as CSS variables and surfaced to Tailwind.
- **Body is `h-screen overflow-hidden`.** Only the main column has `overflow-y-auto`. Navbar + sidebars never scroll with content.
- **Tab state is client-side (`ViewContext`).** URLs stay at `/` across view changes. Revisit when we want shareable view links (probably Phase 1.1).
- **Command palette shortcut: `⌘K`.** The navbar search input is visual — clicking it dispatches a synthetic `keydown` for `⌘K` to open the palette.
- **Motion split:** simple CSS `@keyframes` handle initial reveals; `framer-motion` handles view transitions and interactive hover/tap feedback.
- **Fonts:** Fraunces has variable opsz + italic, but Next 16 rejects combining `axes` with a `weight` array. We enumerate weights and add `style: ["normal", "italic"]`.
- **Git auth:** personal repos use `https://caerux@github.com/...` URL so `git-credential-osxkeychain` stores the token under `(github.com, caerux)` — separate slot from the `walmart-user` entry. Any other remote URL keeps hitting the walmart slot.
- **Scrollbar styling** ships at the CSS level via `.pane-scroll` (webkit + `scrollbar-color`). Only opt-in scrollable panes apply it, so Vercel system pages etc. keep defaults.

---

## Open questions / blockers

Tracks work that needs a human decision before it can start.

- [ ] **Supabase project** — who owns it, which region? Needed for Day 3.
- [ ] **OpenAI / LLM provider** — OpenAI vs. Anthropic for MVP? Day 5 dependency.
- [ ] **Vercel account** — personal account for deploy + Cron. Day 7 dependency (Day 1 for optional preview deploy).
- [ ] **Production domain** — is `signal.so` the intent, or a placeholder? Influences OAuth redirect URLs.
- [ ] **Free-tier quotas** — 10 summaries / 3 drafts per day as starting point. Revisit after first 100 active users.

---

## Conventions

- Commit messages use conventional prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`.
- Design tokens change in `docs/DESIGN_SYSTEM.md` first, then `app/globals.css` — never the other way around.
- New UI primitives go in `components/ui/`, must be showcased in `/design-system`, and must be imported via `@/components/ui`.
- Domain components live alongside features: `components/shell/`, `components/feed/`, etc.
- Shared non-component helpers and types go under `lib/`.
- Never hard-code colors, shadows, or easings in components — use CSS vars.
- After any substantive change, run `pnpm build` and `ReadLints` before committing.
