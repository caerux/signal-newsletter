/**
 * Apply Supabase SQL migrations + seed to a remote project.
 * Requires DATABASE_URL in .env.local (Settings → Database → Connection string URI).
 *
 * Usage: node scripts/apply-migrations.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const val = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* .env.local optional if env already set */
  }
}

const FILES = [
  "supabase/migrations/0001_schema.sql",
  "supabase/migrations/0002_rls.sql",
  "supabase/seed.sql",
];

loadEnvLocal();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL. Add it to .env.local from Supabase → Settings → Database → Connection string (URI)."
  );
  process.exit(1);
}

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

for (const rel of FILES) {
  const sql = readFileSync(join(root, rel), "utf8");
  console.log(`Running ${rel}…`);
  await client.query(sql);
  console.log(`  ✓ ${rel}`);
}

const { rows } = await client.query(
  "select count(*)::int as n from public.sources where active = true"
);
console.log(`\nDone. Active sources: ${rows[0].n}`);

await client.end();
