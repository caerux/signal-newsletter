import pg from "pg";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// load .env.local
const raw = readFileSync(join(root, ".env.local"), "utf8");
for (const line of raw.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq === -1) continue;
  const key = t.slice(0, eq);
  const val = t.slice(eq + 1);
  if (!process.env[key]) process.env[key] = val;
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
const del = await client.query(
  "DELETE FROM public.articles WHERE published_at < $1",
  [cutoff]
);
console.log(`Deleted ${del.rowCount} articles older than 30 days.`);

const { rows } = await client.query(
  "SELECT count(*)::int AS n FROM public.articles"
);
console.log(`Remaining: ${rows[0].n} articles.`);

await client.end();
