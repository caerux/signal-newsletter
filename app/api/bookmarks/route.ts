import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — return all article_ids the current user has bookmarked
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ bookmarks: [] });

  const { data, error } = await supabase
    .from("bookmarks")
    .select("article_id")
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookmarks: (data ?? []).map((b) => b.article_id) });
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
