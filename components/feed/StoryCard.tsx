"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Bookmark, BookmarkCheck } from "lucide-react";
import { Button, Chip, Eyebrow, Sticker } from "@/components/ui";
import { useBookmarks } from "@/components/shell/bookmark-context";
import type { Fill, Signal } from "@/lib/tokens";

export type Story = {
  id: string;
  eyebrow: string;
  title: string;
  dek: string;
  source: string;
  time: string;
  signal: Signal;
  accent: Fill;
  url: string;
};

export function StoryCard({ story, index }: { story: Story; index: number }) {
  const { saved, toggle } = useBookmarks();
  const isSaved = saved.has(story.id);

  return (
      <motion.article
      data-article-card={story.id}
      className="brick p-5 cursor-pointer"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.42,
        ease: [0.34, 1.56, 0.64, 1],
        delay: Math.min(0.06 + index * 0.06, 0.6),
      }}
      whileHover={{
        y: -2,
        x: -2,
        transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] },
      }}
      whileTap={{ y: 1, x: 1 }}
    >
      <div className="flex items-center justify-between mb-2">
        <Eyebrow>{story.eyebrow}</Eyebrow>
        <Sticker kind={story.signal} />
      </div>
      <h2
        className="font-display font-bold leading-[1.15] mb-2"
        style={{ fontSize: 26, letterSpacing: "-0.015em" }}
      >
        {story.title}
      </h2>
      <p
        className="text-[14px] leading-[1.55] font-medium mb-4"
        style={{ color: "var(--ink-2)", maxWidth: "62ch" }}
      >
        {story.dek}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Chip fill={story.accent}>{story.source}</Chip>
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--muted)",
              letterSpacing: "0.08em",
            }}
          >
            {story.time.toUpperCase()} AGO
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => { e.stopPropagation(); toggle(story.id); }}
            variant={isSaved ? "accent" : "default"}
            title={isSaved ? "Remove bookmark (S)" : "Save article (S)"}
          >
            {isSaved
              ? <BookmarkCheck size={14} strokeWidth={2.5} />
              : <Bookmark size={14} strokeWidth={2.5} />}
          </Button>
          <Button onClick={() => window.open(story.url, "_blank", "noopener,noreferrer")}>
            Open
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
