"use client";

import { useState, useCallback } from "react";
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
};

export function InfiniteFeed({ initialArticles }: Props) {
  const [articles, setArticles] = useState<(FeedArticle | ApiArticle)[]>(initialArticles);
  const [offset, setOffset] = useState(initialArticles.length);
  const [hasMore, setHasMore] = useState(initialArticles.length >= PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/feed?limit=${PAGE_SIZE}&offset=${offset}`);
      const json = (await res.json()) as { articles: ApiArticle[]; total: number };
      if (!json.articles?.length) {
        setHasMore(false);
        return;
      }
      setArticles((prev) => [...prev, ...json.articles]);
      setOffset((o) => o + json.articles.length);
      if (json.articles.length < PAGE_SIZE) setHasMore(false);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset]);

  const { ref } = useInView({
    threshold: 0,
    rootMargin: "200px",
    onChange: (inView) => { if (inView) loadMore(); },
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
