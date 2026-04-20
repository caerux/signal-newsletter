import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import Parser from "rss-parser";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerEnv } from "@/lib/env.server";
import { canonicalizeUrl } from "@/lib/url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type SourceRow = {
  id: string;
  name: string;
  feed_url: string;
  category_id: string | null;
};

type ArticleInsert = {
  source_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  canonical_url: string;
  author: string | null;
  published_at: string | null;
  image_url: string | null;
  raw: unknown;
};

function extractImage(item: Parser.Item): string | null {
  const enclosure = item.enclosure;
  if (
    enclosure?.url &&
    (enclosure.type ? enclosure.type.startsWith("image/") : true)
  ) {
    return enclosure.url;
  }
  const content =
    (item as Record<string, unknown>)["content:encoded"] ??
    item.content ??
    null;
  if (typeof content === "string") {
    const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match) return match[1];
  }
  return null;
}

function isAuthorized(req: NextRequest, secret: string | undefined): boolean {
  if (!secret) return true;
  const ua = req.headers.get("user-agent") ?? "";
  if (ua.toLowerCase().includes("vercel-cron")) return true;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function runIngest(req: NextRequest) {
  const env = getServerEnv();
  if (!isAuthorized(req, env.INGEST_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: sources, error: sourcesError } = await supabase
    .from("sources")
    .select("id, name, feed_url, category_id")
    .eq("active", true);

  if (sourcesError) {
    return NextResponse.json(
      { error: sourcesError.message },
      { status: 500 }
    );
  }

  const parser = new Parser({
    timeout: 15_000,
    headers: {
      "User-Agent":
        "SignalBot/0.1 (+https://github.com/caerux/signal-newsletter)",
    },
  });

  const started = Date.now();
  const stats = {
    sources_total: sources?.length ?? 0,
    sources_ok: 0,
    sources_failed: 0,
    items_seen: 0,
    items_written: 0,
    errors: [] as Array<{ source: string; error: string }>,
  };

  for (const source of (sources ?? []) as SourceRow[]) {
    try {
      const feed = await parser.parseURL(source.feed_url);
      const rows: ArticleInsert[] = [];
      for (const item of feed.items ?? []) {
        stats.items_seen += 1;
        const canonical = canonicalizeUrl(item.link ?? null);
        if (!canonical || !item.title) continue;
        rows.push({
          source_id: source.id,
          category_id: source.category_id,
          title: item.title.trim(),
          description:
            (item.contentSnippet ?? item.summary ?? "").slice(0, 2000) || null,
          canonical_url: canonical,
          author:
            item.creator ??
            ((item as Record<string, unknown>).author as string | undefined) ??
            null,
          published_at: item.isoDate
            ? new Date(item.isoDate).toISOString()
            : null,
          image_url: extractImage(item),
          raw: item,
        });
      }

      if (rows.length > 0) {
        const { error: upsertError, count } = await supabase
          .from("articles")
          .upsert(rows, {
            onConflict: "canonical_url",
            ignoreDuplicates: true,
            count: "exact",
          });
        if (upsertError) throw upsertError;
        stats.items_written += count ?? 0;
      }

      stats.sources_ok += 1;
      await supabase
        .from("sources")
        .update({
          last_fetched_at: new Date().toISOString(),
          last_fetch_status: "ok",
        })
        .eq("id", source.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      stats.sources_failed += 1;
      stats.errors.push({ source: source.name, error: message });
      await supabase
        .from("sources")
        .update({
          last_fetched_at: new Date().toISOString(),
          last_fetch_status: `error: ${message.slice(0, 200)}`,
        })
        .eq("id", source.id);
    }
  }

  return NextResponse.json({
    ok: true,
    duration_ms: Date.now() - started,
    ...stats,
  });
}

export async function POST(req: NextRequest) {
  return runIngest(req);
}

export async function GET(req: NextRequest) {
  // Vercel Cron hits GET by default; keep parity with POST.
  return runIngest(req);
}
