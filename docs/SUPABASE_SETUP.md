# Supabase setup — Day 3 handoff

This is the ~10-minute browser-side setup that unblocks Day 3 (real data + auth + ingestion). Everything code-side is already in place; once you finish this, the `/api/ingest` worker can run end-to-end.

## 1. Create the project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. Click **New project**.
3. Settings:
   - **Name:** `signal` (or whatever)
   - **Database password:** generate a strong one and save it in a password manager — we won't need it for the app, but Supabase requires it.
   - **Region:** pick the one closest to where you'll deploy on Vercel (probably `us-east-1` or `eu-central-1`).
   - **Plan:** Free is fine for MVP.
4. Wait ~2 minutes for it to provision.

## 2. Apply the schema + seed

1. In the project, open the **SQL Editor** (left sidebar, `</>` icon).
2. Run each of these files **in order**. Open the file, copy everything, paste into a new SQL snippet, click **Run**.
   1. [`supabase/migrations/0001_schema.sql`](../supabase/migrations/0001_schema.sql) — tables, triggers, indexes
   2. [`supabase/migrations/0002_rls.sql`](../supabase/migrations/0002_rls.sql) — RLS policies
   3. [`supabase/seed.sql`](../supabase/seed.sql) — 7 categories + 22 RSS sources
3. Sanity-check: open **Table Editor** → `sources`. You should see 22 rows, all with `active = true`.

## 3. Grab the keys

In the dashboard:

- **Settings → Data API**
  - Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - Copy the **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Settings → API Keys**
  - Reveal the **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
  - ⚠️ This key bypasses RLS. Never put it in `NEXT_PUBLIC_*` or commit it.

## 4. Wire into the app

From the repo root:

```bash
cp .env.example .env.local
```

Open `.env.local` and paste the three values from step 3. Generate an ingest secret:

```bash
openssl rand -base64 32
```

Put that into `INGEST_SECRET` in `.env.local`. This protects `/api/ingest` from being hammered by anyone who finds the URL.

## 5. (Later) Configure auth providers

Not needed until Phase B of Day 3, but while you're in the dashboard:

- **Authentication → URL Configuration**
  - **Site URL:** `http://localhost:3000` for now (we'll change it to the Vercel URL later).
  - **Redirect URLs:** add `http://localhost:3000/**` and the eventual Vercel URL.
- **Authentication → Providers**
  - **Email (magic link)** — already on by default. Leave it.
  - **GitHub** — enable later, requires a GitHub OAuth app (docs link appears in the dashboard when you toggle it on).

## 6. Smoke-test ingestion locally

```bash
pnpm dev
# in another terminal:
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer $(grep INGEST_SECRET .env.local | cut -d= -f2)"
```

Expected response (trimmed):

```json
{
  "ok": true,
  "duration_ms": 12345,
  "sources_total": 22,
  "sources_ok": 20,
  "sources_failed": 2,
  "items_seen": 400,
  "items_written": 380,
  "errors": [{ "source": "…", "error": "…" }]
}
```

Some feeds 404 or rate-limit — that's fine. Any source that fails shows up in the `errors` array and in the `sources.last_fetch_status` column. Re-run ingest later to retry.

## 7. Verify in Supabase

- **Table Editor → articles**: should now have a few hundred rows.
- **Table Editor → sources**: `last_fetched_at` is populated for every active source; `last_fetch_status` is `ok` or an error message.

Once all three steps above pass, ping me and we'll:

- Build the `/login` route and wire magic-link auth.
- Convert the feed page to an RSC that reads from Supabase.
- Deploy to Vercel so the cron actually runs.

## Troubleshooting

**`relation "public.articles" does not exist`** — migration 0001 didn't finish. Re-run it; the `create table if not exists` statements are idempotent.

**Every source errors with `timeout`** — some ISPs rate-limit RSS fetches. Try running from a different network, or mark problematic sources as `active = false` in the Table Editor.

**`unauthorized`** from `/api/ingest`** — `INGEST_SECRET` mismatch between `.env.local` and the `Authorization` header. Easiest fix: temporarily unset `INGEST_SECRET` in `.env.local` while you iterate locally.

**`Missing or invalid public env vars`** — you forgot to restart `pnpm dev` after editing `.env.local`. Next only reads env on boot.
