import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Signal, Fill } from "@/lib/tokens";

export const dynamic = "force-dynamic";

const VALID_SIGNALS: Signal[] = ["hot", "rise", "cool"];
const VALID_FILLS: Fill[] = ["peach", "lemon", "mint", "sky", "lavender", "pink", "white", "bg", "bg-2"];

function toSignal(v: unknown): Signal {
  return VALID_SIGNALS.includes(v as Signal) ? (v as Signal) : "cool";
}

function toFill(v: unknown): Fill {
  return VALID_FILLS.includes(v as Fill) ? (v as Fill) : "sky";
}

type JoinedSource = { name: string };
type JoinedCategory = { name: string; fill: string; slug: string };

function pickFirst<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const signal = searchParams.get("signal") as Signal | null;
  const limit = Math.min(Number(searchParams.get("limit") ?? "30"), 100);
  const offset = Number(searchParams.get("offset") ?? "0");

  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select(
      `id, title, description, canonical_url, published_at, signal_tier,
       sources(name),
       categories(name, fill, slug)`,
      { count: "exact" }
    )
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    // Resolve slug → id first; Supabase JS can't filter on joined columns
    const { data: catRow } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();
    if (catRow) {
      query = query.eq("category_id", catRow.id);
    } else {
      // Unknown slug — return empty
      return NextResponse.json({ articles: [], total: 0 });
    }
  }
  if (signal && VALID_SIGNALS.includes(signal)) {
    query = query.eq("signal_tier", signal);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const articles = (data ?? []).map((a) => {
    const src = pickFirst(a.sources as JoinedSource | JoinedSource[] | null);
    const cat = pickFirst(a.categories as JoinedCategory | JoinedCategory[] | null);
    return {
      id: a.id as string,
      title: a.title as string,
      description: (a.description as string | null) ?? null,
      canonical_url: a.canonical_url as string,
      published_at: (a.published_at as string | null) ?? null,
      signal: toSignal(a.signal_tier as string | null),
      source: src?.name ?? "Unknown",
      category: cat?.name ?? null,
      accent: toFill(cat?.fill),
    };
  });

  return NextResponse.json({ articles, total: count ?? 0 });
}
