import { createClient } from "@/lib/supabase/server";
import { QueueClient } from "@/components/feed/QueueClient";
import type { Fill, Signal } from "@/lib/tokens";
import type { FeedArticle } from "@/app/(app)/page";

type JoinedSource = { name: string };
type JoinedCategory = { name: string; fill: string; slug: string };
function pickFirst<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}
const VALID_SIGNALS: Signal[] = ["hot", "rise", "cool"];
const VALID_FILLS: Fill[] = ["peach", "lemon", "mint", "sky", "lavender", "pink"];
function toSignal(v: unknown): Signal {
  return VALID_SIGNALS.includes(v as Signal) ? (v as Signal) : "cool";
}
function toFill(v: unknown): Fill {
  return VALID_FILLS.includes(v as Fill) ? (v as Fill) : "sky";
}

export default async function QueuePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("bookmarks")
    .select(`
      article_id,
      created_at,
      articles(id, title, description, canonical_url, published_at, signal_tier,
        sources(name), categories(name, fill, slug))
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const articles: FeedArticle[] = (data ?? [])
    .map((b) => {
      const a = pickFirst(b.articles as Record<string, unknown> | Record<string, unknown>[] | null);
      if (!a) return null;
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
      } satisfies FeedArticle;
    })
    .filter(Boolean) as FeedArticle[];

  return <QueueClient initialArticles={articles} />;
}
