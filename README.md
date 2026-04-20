# Signal

> Where ideas start.

A thinking and writing tool for people who create content. Discover what matters, understand why, generate article ideas, and ship drafts — all from one keyboard-first dashboard.

---

## Status

Pre-MVP. Phase 0 (foundation) complete. Phase 1 (7-day MVP build) is next.

- [x] Product brief
- [x] Design system (Soft Neobrutalism)
- [x] Design explorer with 5 directions explored, 1 chosen
- [x] Roadmap
- [ ] Day 1-7 MVP build

---

## Repository layout

```
signal-newsletter/
├── docs/
│   ├── PRODUCT.md          → Vision, personas, features, expansion
│   ├── DESIGN_SYSTEM.md    → Design spec (tokens, components, motion, a11y)
│   └── ROADMAP.md          → Phased build plan (MVP → v2+)
├── design-explorer/        → Static HTML mockups of 5 design directions
│   ├── index.html          → Picker / landing
│   ├── 01-editorial-brutalist.html
│   ├── 02-terminal-cyber.html
│   ├── 03-neo-print-magazine.html
│   ├── 04-soft-neobrutalism.html  ← CHOSEN
│   └── 05-bento-glass-dark.html
└── README.md (this file)
```

The Next.js app will be added under this root during Phase 1 (Day 1).

---

## Quick links

- **Product brief** → [`docs/PRODUCT.md`](./docs/PRODUCT.md)
- **Design system** → [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md)
- **Roadmap** → [`docs/ROADMAP.md`](./docs/ROADMAP.md)
- **Reference implementation** → [`design-explorer/04-soft-neobrutalism.html`](./design-explorer/04-soft-neobrutalism.html)

---

## View the design explorer

```bash
python3 -m http.server 4173 --directory design-explorer
# open http://localhost:4173
```

Or use any static file server. No build step needed — vanilla HTML + Tailwind CDN + Google Fonts.

---

## Tech stack (planned for MVP)

- **Framework** — Next.js 15 (App Router) + TypeScript
- **Styling** — Tailwind CSS + CSS variables (tokens from design system)
- **UI library** — shadcn/ui as component base, customized to Soft Neobrutalism
- **Motion** — Framer Motion
- **Command palette** — `cmdk`
- **Backend** — Supabase (Auth + Postgres + RLS)
- **AI** — OpenAI (GPT-4o / GPT-5 at launch)
- **Deployment** — Vercel (with Vercel Cron for ingestion)
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
