# Signal — Roadmap

A phased build plan from MVP to v2+. Each phase has:
- **Goal** — what we're proving
- **Scope** — what ships
- **Out of scope** — what we deliberately don't build
- **Exit criteria** — what needs to be true to move on

Phases are **cumulative** — v1.1 includes everything from MVP, v1.2 includes everything from v1.1, etc.

---

## Phase 0 — Foundation (Day 0, done)

- Product doc (`docs/PRODUCT.md`)
- Design system (`docs/DESIGN_SYSTEM.md`)
- Roadmap (`docs/ROADMAP.md`)
- Design explorer with 5 direction mockups (`design-explorer/`)
- Direction locked: **Soft Neobrutalism**

---

## Phase 1 — MVP (Days 1-7)

**Goal:** Prove that a writer can go from "reading feed" to "exported Medium draft" in 15 minutes, daily, without friction.

### Day-by-day breakdown

#### Day 1 — Foundation
- Scaffold Next.js 15 App Router + TypeScript + Tailwind CSS
- Install shadcn/ui, `next-themes`, Framer Motion
- Port design tokens from [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) § 2-6 into `app/globals.css`
- Configure `tailwind.config.ts` to read from CSS variables
- Install and configure `@supabase/ssr`, create Supabase project
- Build 3-pane layout shell: `app/(app)/layout.tsx`
- Sticky navbar with logo + tab group placeholder

#### Day 2 — Core components
- Implement design primitives as React components:
  - `<Brick>`, `<Button>`, `<Chip>`, `<Sticker>`, `<Kbd>`, `<Avatar>`, `<Input>`
- Domain components: `<NewsCard>`, `<SignalChip>`, `<CategoryItem>`, `<RailCat>`, `<InsightBlock>`
- Motion primitives: `stampIn`, `slideInLeft/Right`, `buttonThump`, `popUp` via Framer Motion variants
- Build `/design-system` styleguide route (permanent reference page)
- Wire up sidebar + insight panel collapse behavior with `framer-motion` `layout` animations

#### Day 3 — Data model & ingestion
- Supabase schema:
  - `users` (from auth.users)
  - `categories` (id, slug, name, icon)
  - `sources` (id, name, rss_url, category_id, last_fetched_at, is_active)
  - `articles` (id, source_id, canonical_url, title, dek, body, published_at, author, signal_score, signal_type)
  - `bookmarks` (id, user_id, article_id, status, created_at)
  - `summaries` (id, article_id, bullets, why_it_matters, key_takeaway, model, created_at)
  - `ideas` (id, article_id, user_id, titles, angles, prompts, created_at)
  - `drafts` (id, user_id, article_id, idea_id, title, body_md, status, created_at, updated_at)
- Row Level Security (RLS) policies on all user-scoped tables
- Auth: Supabase magic link + GitHub OAuth
- Login / signup route: `/login`
- RSS ingestion worker: `/api/ingest` — parses ~20 curated feeds, dedupes by canonical URL, inserts into `articles`
- Vercel Cron config: run `/api/ingest` every 15 minutes

#### Day 4 — Feed UX
- `/api/feed` route handler with filters: category, signal, timeframe
- Feed page at `app/(app)/today/page.tsx` using RSC
- Infinite scroll via `react-intersection-observer`
- Category sidebar bound to Supabase data
- Search via `cmdk` command palette (client-side fuzzy first; Postgres FTS later)
- Empty, loading (skeleton), error states for feed
- Signal score computation: `v1 = normalize(sources_covering × publish_velocity / age_hours)`
  - Trending: score > 80
  - Rising: score 50-80
  - Cooling: score < 50

#### Day 5 — AI layer
- `lib/ai/client.ts` — OpenAI wrapper (default `gpt-5` or `gpt-4o` for launch)
- Zod schemas for structured outputs (`SummarySchema`, `IdeasSchema`, `DraftSchema`)
- `/api/summarize` — idempotent (cache by `article_id`), returns cached summary if present
- `/api/ideas` — tied to `user_id` + `article_id`, caches per-user (different users see different ideas based on preferences in future)
- `/api/draft` — generates full Medium-style markdown, saves to `drafts` table
- Stream responses into Insight panel using Server Actions + React `useOptimistic`
- Cost guardrails: per-user daily limits (free: 10 summaries, 3 drafts), DB cache before LLM call

#### Day 6 — Bookmarks, queue, dashboard
- Save article → bookmark (optimistic UI)
- `/queue` route — list bookmarked items, filter by status
- Drag-reorder with `dnd-kit`
- `/dashboard` — your stats (saved count, drafts generated, trending in your categories)
- Keyboard shortcuts wired up end-to-end:
  - `⌘K` → command palette
  - `J/K` → navigate feed
  - `S` → save focused story
  - `E` → expand focused story's insight panel
  - `D` → generate draft
  - `[` / `]` → toggle sidebar / insight panel

#### Day 7 — Draft editor, landing, ship
- `/drafts/[id]` route with editable markdown editor (textarea for MVP, Tiptap in v1.1)
- Copy-to-clipboard + export as `.md`
- Public landing page (`app/(marketing)/page.tsx`) — hero, feature highlights, signup CTA
- Deploy to Vercel, configure env vars
- Set up Vercel Cron for ingest
- Plausible analytics snippet
- Basic error tracking (Sentry free tier or simple log flushing)
- Root README with quick-start

### MVP Exit criteria
- ✓ A new user can sign up, see a populated feed within 60 seconds
- ✓ Can save 5 articles, generate summaries for each, generate 1 draft, export to markdown
- ✓ All 4 tabs (Today / Queue / Drafts / Archive) work
- ✓ Keyboard shortcuts for navigation work
- ✓ Design matches Soft Neobrutalism spec at 95%+ fidelity
- ✓ Deployed and accessible on a custom subdomain
- ✓ At least 3 external users have used it end-to-end without needing handholding

### MVP Out of scope
- Dark mode (Phase 2)
- Any source beyond RSS
- Any vertical beyond tech
- Publishing integrations (user still copy-pastes into Medium)
- Collaboration / team accounts
- Image generation
- Mobile / responsive (desktop-only)
- Custom source addition by users

---

## Phase 1.1 — Broadening Sources & Outputs (Weeks 2-4)

**Goal:** Prove the core engine works beyond RSS and beyond Medium. Expand the "possible" surface.

### Scope
- **Sources**
  - HackerNews top-posts integration
  - Product Hunt daily launches
  - Reddit top posts from curated subreddits (`/r/MachineLearning`, `/r/programming`, `/r/startups`, `/r/webdev`)
  - GitHub Trending daily digest
  - Twitter/X: import public lists (via Twitter API v2 if available, otherwise Nitter-style scraping)
- **Outputs**
  - Substack draft format (markdown, works)
  - LinkedIn article format (long-form, slightly different tone prompt)
  - Twitter/X thread generator (numbered, respects 280-char limits)
  - Dev.to markdown with proper frontmatter
- **Editor upgrade**
  - Replace textarea with Tiptap (rich editor, markdown-compatible)
  - Split view: edit on left, preview on right
- **Responsive**
  - Tablet (sidebar auto-collapses to rail)
  - Mobile (bottom drawer for sidebar + insight)
- **Dark mode**
  - Token flip (`--bg` / `--ink` etc.)
  - Mode toggle in navbar
  - Persist via `next-themes`

### Exit criteria
- ✓ 5 source types working, users can toggle which sources feed them
- ✓ 4 output formats, each with demonstrably different prompt tuning
- ✓ Works on iPad and iPhone (not just desktop)
- ✓ Dark mode parity with light — every pastel has a dark equivalent

---

## Phase 1.2 — Verticals & Intelligence (Month 2)

**Goal:** Prove Signal is not just a tech tool. Validate the vertical-packs hypothesis.

### Scope
- **Vertical Packs** (user toggles which they want)
  - Tech (existing)
  - Startups / VC
  - Design / Creator
  - Finance / Markets
  - Climate / Sustainability
  - Crypto / Web3
- **AI upgrades**
  - **Style transfer** — "Write in my voice." User pastes 3+ past articles; we analyze tone, vocab, sentence length, and prompt future drafts with this as context.
  - **Counterpoint mode** — one-click "write the opposite argument"
  - **Outline-first** — generates outline, user expands inline
  - **Research mode** — deep dive across 5-10 sources on a topic, produces mini-brief
- **Trending analytics**
  - "Rising sources" — which sources' scores are climbing
  - "Quiet signals" — stories with high quality but low current attention
  - "What you missed" — weekly digest of saved-but-not-drafted stories
- **Custom source bundles**
  - Users can add any RSS URL
  - Community: browse others' bundles, clone them
- **YouTube + podcast transcription**
  - Add a YouTube channel as a source → we fetch transcripts → treat as articles
  - Same for podcasts (via Apple Podcasts RSS + Whisper API)

### Exit criteria
- ✓ 6 vertical packs with real sources + tuned prompts
- ✓ Style transfer demonstrably produces drafts closer to user's voice
- ✓ Research mode outputs a usable 500-word brief in under 90 seconds
- ✓ At least 3 non-tech vertical users actively using product

---

## Phase 2 — Social, Publishing, Teams (Month 3-4)

**Goal:** Turn Signal from a solo tool into a social + commercial product.

### Scope
- **Direct publishing**
  - Medium API — one-click publish
  - Substack API — draft + publish
  - LinkedIn API — post
  - Ghost API — publish to self-hosted
  - Buffer / Typefully — queue thread
- **Own newsletter**
  - Every Signal user gets a micro-newsletter hosted at `signal.so/u/username`
  - Publish articles → they email to subscribers automatically
  - Ghost-like simple publishing
- **Teams (B2B)**
  - Shared workspace
  - Role assignments (editor / writer / viewer)
  - Editorial calendar (drag-and-drop articles to dates)
  - Comments on drafts
  - Usage analytics per seat
- **Chrome extension**
  - Save-from-anywhere (right-click → Send to Signal)
  - Highlights sync with Signal
- **Audio / Video**
  - TTS audio versions of articles (OpenAI / ElevenLabs)
  - Audiogram generator for social sharing
  - AI-generated header images (Flux / DALL-E)

### Exit criteria
- ✓ 80% of drafts end up published directly from Signal (not copy-paste)
- ✓ 50+ teams paying on Team plan
- ✓ Chrome extension has 1,000+ installs
- ✓ Signal-hosted newsletters have 10k+ combined subscribers

---

## Phase 3 — API, Verticals-as-Products, Moat (Month 6+)

**Goal:** Become infrastructure, not just a product.

### Scope
- **Signal API (public)**
  - Developers can query: feeds, signals, summaries, ideas, drafts
  - Pricing: per-call (see `PRODUCT.md` § 11)
  - SDKs: TypeScript, Python
- **Vertical spin-offs**
  - **Signal for Investors** — tuned prompts, earnings calls, SEC filings, portfolio view
  - **Signal for Journalism** — source tracking, tip ingestion, story development
  - **Signal for Research** — arxiv, citation graph, scholarly voice
  - Each is a separate product page / pricing / marketing, same core engine
- **Marketplace**
  - Users publish "source packs" (curated RSS bundles)
  - Prompt templates (idea generators tuned for specific niches)
  - Some paid, some free, Signal takes a rev share
- **Personal knowledge base**
  - Every saved highlight, every draft, every idea becomes queryable
  - "What did I save last year about X?"
  - Notion / Obsidian sync
- **Mobile apps**
  - iOS + Android native
  - Optimized for reading (on the go) + idea capture (voice memo → idea)
- **Trend prediction**
  - ML model on top of historical signal data
  - Flag "what's rising that isn't trending yet" — early signals

### Exit criteria
- ✓ Signal API has 100+ paying developers
- ✓ At least one vertical spin-off is profitable on its own
- ✓ Marketplace has 500+ community-contributed source packs
- ✓ Mobile apps have 10k+ combined DAU

---

## Decision gates

At the end of each phase, evaluate before starting the next:

1. **Are we retaining users?** If W4 retention is below 20%, pause and fix retention before expanding.
2. **Are we generating revenue?** Need at least 1:1 LTV/CAC before Phase 2 (teams / publishing).
3. **Is the AI cost sustainable?** LLM costs must be < 30% of gross revenue to move forward.
4. **Is there pull, not push?** Users asking for features (organic) vs. us guessing. If we're pushing too much, rethink.

---

## What not to build (ever, unless proven wrong)

These are explicit "no" calls — they look tempting but don't fit the core loop:

- ❌ **Full social feed** — comments, likes, followers. Signal is a tool, not a network.
- ❌ **Public consumer-facing content** — we're not competing with Medium. Don't host public articles.
- ❌ **Generic AI chatbot** — no "ask Signal anything." Stay feed-grounded.
- ❌ **Built-in payment / paywall for user newsletters** — integrate with Substack/Ghost instead.
- ❌ **Editor as a replacement for Medium/Notion** — draft is the output, not the home.
- ❌ **Freemium with zero AI** — AI is the product. If free tier has none, users can't evaluate.

---

## Meta: How this roadmap gets updated

- Phase-level plans get revisited **at the start of each phase** with real usage data
- Feature priority within a phase can shift weekly based on user feedback
- Adding a new phase requires updating `PRODUCT.md` § expansion sections to stay consistent
- Big pivots (e.g., shifting primary persona) require explicit sign-off and a rewrite of `PRODUCT.md` § 2

**Last updated:** Day 0 — Phase 0 complete, Phase 1 ready to start.
