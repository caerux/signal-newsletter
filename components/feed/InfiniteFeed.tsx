"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { StoryCard } from "./StoryCard";
import type { FeedArticle } from "@/app/(app)/page";
import type { Signal, Fill } from "@/lib/tokens";
import { relativeTime } from "@/lib/relativeTime";

type ApiArticle = {
  id: string;
  title: string;
  description: string | null;
  canonical_url: string;
  published_at: string | null;
  signal: Signal;
  source: string;
  category: string | null;
  accent: Fill;
};

function toStory(a: FeedArticle | ApiArticle) {
  return {
    id: a.id,
    eyebrow: a.category ?? "Signal",
    title: a.title,
    dek: a.description ?? "",
    source: a.source,
    time: relativeTime(a.published_at),
    signal: a.signal,
    accent: a.accent,
    url: a.canonical_url,
  };
}

const PAGE_SIZE = 30;

type Props = {
  initialArticles: FeedArticle[];
  category?: string | null;
};

export function InfiniteFeed({ initialArticles, category }: Props) {
  const [articles, setArticles] = useState<(FeedArticle | ApiArticle)[]>(initialArticles);
  const [offset, setOffset] = useState(initialArticles.length);
  const [hasMore, setHasMore] = useState(initialArticles.length >= PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  // Use refs to avoid stale closures in async fetch
  const loadingRef = useRef(false);
  const categoryRef = useRef(category);
  const isFirstRender = useRef(true);

  async function fetchPage(pageOffset: number, cat: string | null | undefined) {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(pageOffset),
      });
      if (cat) params.set("category", cat);
      const res = await fetch(`/api/feed?${params}`);
      const json = (await res.json()) as { articles: ApiArticle[] };
      const next = json.articles ?? [];
      setArticles((prev) => (pageOffset === 0 ? next : [...prev, ...next]));
      setOffset(pageOffset + next.length);
      setHasMore(next.length >= PAGE_SIZE);
    } catch {
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  // When category filter changes, reset and re-fetch
  useEffect(() => {
    categoryRef.current = category;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // On first mount with no category, we already have SSR initialArticles
      if (!category) return;
    }

    // Category changed — reset list and fetch page 0
    setArticles([]);
    setOffset(0);
    setHasMore(true);
    fetchPage(0, category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const { ref } = useInView({
    threshold: 0,
    rootMargin: "300px",
    onChange: (inView) => {
      if (inView && !loadingRef.current && hasMore) {
        fetchPage(offset, categoryRef.current);
      }
    },
  });

  const stories = articles.map(toStory);

  return (
    <section className="flex flex-col gap-4">
      {stories.map((s, i) => (
        <StoryCard key={s.id} story={s} index={i} />
      ))}

      <div ref={ref} className="h-2" />

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-6">
          <Loader2 size={20} className="animate-spin text-muted" />
        </motion.div>
      )}

      {!hasMore && articles.length > 0 && !loading && (
        <p className="text-center font-mono text-[11px] font-bold tracking-widest text-muted py-6">
          {articles.length} ARTICLES · END OF FEED
        </p>
      )}
    </section>
  );
}
