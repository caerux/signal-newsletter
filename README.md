# Signal

> Where ideas start.

A thinking and writing tool for people who create content. Discover what matters, understand why, generate article ideas, and ship drafts — all from one keyboard-first dashboard.

---

## Status

Pre-MVP. Phase 0 done, Phase 1 in progress — Day 2 shipped.

- [x] Product brief, design system, roadmap
- [x] Design explorer with 5 directions explored, 1 chosen
- [x] Day 1 — Next.js app shell, tokens wired, 3-pane layout with collapsible sidebars
- [x] Day 2 — UI primitives, stateful tabs, command palette, framer-motion polish, `/design-system` styleguide
- [ ] Day 3 — Supabase schema + RSS ingestion
- [ ] Day 4-7 — feed on real data, AI layer, editor, deploy

Live task-level progress and upcoming work are tracked in **[`docs/CHECKLIST.md`](./docs/CHECKLIST.md)**.

---

## Repository layout

```
signal-newsletter/
├── app/                    → Next.js App Router (routes, layout, globals.css)
│   ├── (app)/              → Authenticated app shell routes
│   ├── design-system/      → Living styleguide for all primitives
│   └── globals.css         → Design tokens + Tailwind 4 @theme inline config
├── components/
│   ├── ui/                 → Primitives: Brick, Button, Chip, Sticker, Kbd, Avatar, Tab, Eyebrow
│   ├── shell/              → AppShell, Navbar, Sidebar, InsightPanel, CommandPalette, ViewContext
│   └── feed/               → FeedViews + per-view placeholder data
├── lib/                    → cn.ts (classnames), tokens.ts (CSS-var ↔ TS bridge)
├── docs/
│   ├── CHECKLIST.md        → ✅ Live checklist — read this first
│   ├── PRODUCT.md          → Vision, personas, features, expansion
│   ├── DESIGN_SYSTEM.md    → Design spec (tokens, components, motion, a11y)
│   └── ROADMAP.md          → Phased build plan (MVP → v2+)
├── design-explorer/        → Static HTML mockups of 5 design directions
│   ├── 04-soft-neobrutalism.html  ← CHOSEN (reference implementation)
│   └── …
├── AGENTS.md               → House rules for agents working on this repo
└── README.md (this file)
```

---

## Quick links

- **Checklist (what's done / what's next)** → [`docs/CHECKLIST.md`](./docs/CHECKLIST.md)
- **Product brief** → [`docs/PRODUCT.md`](./docs/PRODUCT.md)
- **Design system** → [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md)
- **Roadmap** → [`docs/ROADMAP.md`](./docs/ROADMAP.md)
- **Design reference** → [`design-explorer/04-soft-neobrutalism.html`](./design-explorer/04-soft-neobrutalism.html)

---

## View the design explorer

```bash
python3 -m http.server 4173 --directory design-explorer
# open http://localhost:4173
```

Or use any static file server. No build step needed — vanilla HTML + Tailwind CDN + Google Fonts.

---

## Tech stack

Shipped:

- **Framework** — Next.js 16.2 (App Router + RSC) + React 19 + TypeScript 5, Turbopack, pnpm
- **Styling** — Tailwind 4 CSS-first config (`@theme inline` in `app/globals.css`) + CSS variables for design tokens
- **UI** — in-house primitives over global CSS classes (no shadcn); every primitive lives in `components/ui/`
- **Motion** — Framer Motion for transitions + interaction, plus 8 custom `@keyframes` for reveal
- **Command palette** — `cmdk` on `⌘K`

Planned (not yet wired):

- **Backend** — Supabase (Auth + Postgres + RLS)
- **AI** — OpenAI, schema-validated with `zod`
- **Deployment** — Vercel (with Vercel Cron for RSS ingestion)
- **Analytics** — Plausible

---

## Design direction: Soft Neobrutalism

Chunky borders, hard drop shadows, pastel blocks, spring animations. Playful but disciplined. See [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) for the full spec.

Signature moves:
- Every surface is a "brick" — 2.5px black border, 5px hard drop shadow, rounded
- Shadows are always offset, never blurred
- Motion uses spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) — things overshoot and settle
- Pastels for category, signals, and emphasis. Black text only.
- Fraunces (serif) for display, Space Grotesk for UI, JetBrains Mono for metadata.

---

## Contributing (once the code is live)

Read [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) § 11 (Do's and Don'ts) before opening a PR. Design system violations will be rejected — the consistency is the product.
