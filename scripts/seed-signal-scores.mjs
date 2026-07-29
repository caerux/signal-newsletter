import pg from "pg";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = readFileSync(join(root, ".env.local"), "utf8");
for (const line of raw.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq === -1) continue;
  const k = t.slice(0, eq), v = t.slice(eq + 1);
  if (!process.env[k]) process.env[k] = v;
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();

const sql = readFileSync(join(root, "supabase/migrations/0003_signal_score.sql"), "utf8");
await client.query(sql);
console.log("Function created. Running...");
await client.query("SELECT public.refresh_signal_scores()");

const { rows } = await client.query(
  "SELECT signal_tier, count(*)::int as n FROM public.articles GROUP BY signal_tier ORDER BY signal_tier"
);
console.log("Score distribution:", rows);
await client.end();
