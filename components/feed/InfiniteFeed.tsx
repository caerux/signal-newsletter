"use client";

import { useState, useCallback, useEffect } from "react";
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
  const [articles, setArticles] = useState<(FeedArticle | ApiArticle)[]>(
    category ? [] : initialArticles
  );
  const [offset, setOffset] = useState(category ? 0 : initialArticles.length);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // When category changes, reset and re-fetch from scratch
  useEffect(() => {
    if (category === undefined) return; // initial mount handled above
    setArticles([]);
    setOffset(0);
    setHasMore(true);
  }, [category]);

  const loadMore = useCallback(async (currentOffset: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(currentOffset),
      });
      if (category) params.set("category", category);
      const res = await fetch(`/api/feed?${params}`);
      const json = (await res.json()) as { articles: ApiArticle[]; total: number };
      if (!json.articles?.length) {
        setHasMore(false);
        return;
      }
      setArticles((prev) => (currentOffset === 0 ? json.articles : [...prev, ...json.articles]));
      setOffset(currentOffset + json.articles.length);
      if (json.articles.length < PAGE_SIZE) setHasMore(false);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, category]);

  // Trigger initial load when category is set and articles are empty
  useEffect(() => {
    if (articles.length === 0 && hasMore && !loading) {
      loadMore(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles.length, hasMore]);

  const { ref } = useInView({
    threshold: 0,
    rootMargin: "200px",
    onChange: (inView) => { if (inView && articles.length > 0) loadMore(offset); },
  });

  const stories = articles.map(toStory);

  return (
    <section className="flex flex-col gap-4">
      {stories.map((s, i) => (
        <StoryCard key={s.id} story={s} index={i} />
      ))}

      {/* Sentinel */}
      <div ref={ref} className="h-2" />

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-6"
        >
          <Loader2 size={20} className="animate-spin text-muted" />
        </motion.div>
      )}

      {!hasMore && articles.length > PAGE_SIZE && (
        <p className="text-center font-mono text-[11px] font-bold tracking-widest text-muted py-6">
          YOU&apos;VE REACHED THE END
        </p>
      )}
    </section>
  );
}
