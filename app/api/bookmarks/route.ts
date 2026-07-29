import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Signal, Fill } from "@/lib/tokens";

export const dynamic = "force-dynamic";

function pickFirst<T>(v: T | T[] | null | undefined): T | null {
  if (v == null) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

// GET — return article_ids, or full articles when ?full=true
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ bookmarks: [] });

  const full = new URL(req.url).searchParams.get("full") === "true";

  if (!full) {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("article_id")
      .eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ bookmarks: (data ?? []).map((b) => b.article_id) });
  }

  // Return full article objects for the Saved view
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`
      article_id,
      articles (
        id, title, description, canonical_url, published_at, signal_tier,
        sources ( name ),
        categories ( name, fill )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const articles = (data ?? []).map((row) => {
    const a = pickFirst(row.articles) as {
      id: string; title: string; description: string | null;
      canonical_url: string; published_at: string | null; signal_tier: string;
      sources: { name: string } | { name: string }[] | null;
      categories: { name: string; fill: string } | { name: string; fill: string }[] | null;
    } | null;
    if (!a) return null;
    const src = pickFirst(a.sources);
    const cat = pickFirst(a.categories);
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      canonical_url: a.canonical_url,
      published_at: a.published_at,
      signal: (a.signal_tier ?? "cool") as Signal,
      source: src?.name ?? "Unknown",
      category: cat?.name ?? null,
      accent: (cat?.fill ?? "sky") as Fill,
    };
  }).filter(Boolean);

  return NextResponse.json({ articles });
}

// POST — save an article
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { article_id } = (await req.json()) as { article_id: string };
  if (!article_id) return NextResponse.json({ error: "article_id required" }, { status: 400 });

  const { error } = await supabase
    .from("bookmarks")
    .insert({ user_id: user.id, article_id });

  if (error && error.code !== "23505") { // ignore duplicate key
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

// DELETE — remove a bookmark
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const article_id = searchParams.get("article_id");
  if (!article_id) return NextResponse.json({ error: "article_id required" }, { status: 400 });

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("article_id", article_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
