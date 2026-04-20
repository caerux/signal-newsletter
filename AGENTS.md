<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Signal — working on this repo

**Read [`docs/CHECKLIST.md`](./docs/CHECKLIST.md) first.** It is the single source of truth for what is done, what is in progress, what is planned next, and every non-obvious decision made so far. Update it as you go.

Supporting docs:

- [`docs/PRODUCT.md`](./docs/PRODUCT.md) — vision, personas, feature scope
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) — Soft Neobrutalism spec (tokens, primitives, motion, a11y); treat it as the product
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — phased plan; the checklist is the short-horizon view of this

House rules:

- Design tokens change in `docs/DESIGN_SYSTEM.md` first, then in `app/globals.css`.
- New UI primitives live in `components/ui/` and must be showcased in `/design-system`.
- No `tailwind.config.ts` — Tailwind 4 config is CSS-first via `@theme inline` in `app/globals.css`.
- Body stays `h-screen overflow-hidden`; only the main column scrolls.
- Commit messages use conventional prefixes (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- After substantive changes: `pnpm build` + `ReadLints` before committing.
