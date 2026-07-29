"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ArrowUpRight, BookmarkX } from "lucide-react";
import { motion } from "framer-motion";
import { Brick, Button, Chip, Eyebrow, Sticker } from "@/components/ui";
import { useBookmarks } from "@/components/shell/bookmark-context";
import { relativeTime } from "@/lib/relativeTime";
import type { FeedArticle } from "@/app/(app)/page";

function SortableCard({ article }: { article: FeedArticle }) {
  const { toggle } = useBookmarks();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: article.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="brick p-4 flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="mt-1 text-muted cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical size={16} strokeWidth={2} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Eyebrow>{article.category ?? "Signal"}</Eyebrow>
            <Sticker kind={article.signal} />
          </div>
          <h3
            className="font-display font-bold leading-[1.2] mb-1 truncate"
            style={{ fontSize: 18, letterSpacing: "-0.01em" }}
          >
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <Chip fill={article.accent}>{article.source}</Chip>
            <span
              className="font-mono"
              style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em" }}
            >
              {relativeTime(article.published_at).toUpperCase()} AGO
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={() => toggle(article.id)}
            title="Remove bookmark"
          >
            <BookmarkX size={14} strokeWidth={2.5} />
          </Button>
          <Button onClick={() => window.open(article.canonical_url, "_blank", "noopener,noreferrer")}>
            Open
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function QueueClient({ initialArticles }: { initialArticles: FeedArticle[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const { saved } = useBookmarks();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setArticles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // Keep list in sync with bookmark removals
  const visible = articles.filter((a) => saved.has(a.id));

  return (
    <div>
      <Brick fill="sky" className="p-6 mb-5" style={{ animation: "popUp var(--d-reveal) var(--ease-spring) both" }}>
        <Eyebrow className="block mb-2">Your reading queue</Eyebrow>
        <h1 className="font-display font-bold leading-[1.02] mb-2" style={{ fontSize: 38, letterSpacing: "-0.02em" }}>
          Saved for later
        </h1>
        <p className="max-w-[58ch] text-[14px] leading-[1.55] font-medium" style={{ color: "var(--ink-2)" }}>
          Everything you bookmarked. Drag to reorder. Turn the best ones into drafts.
        </p>
      </Brick>

      {visible.length === 0 ? (
        <Brick className="p-10 text-center">
          <p className="label-eyebrow mb-2">Nothing saved yet</p>
          <p className="text-[14px] font-medium" style={{ color: "var(--muted)" }}>
            Hit <kbd className="font-mono font-bold">S</kbd> on any article to save it here.
          </p>
        </Brick>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visible.map((a) => a.id)} strategy={verticalListSortingStrategy}>
            <motion.div className="flex flex-col gap-3">
              {visible.map((a) => (
                <SortableCard key={a.id} article={a} />
              ))}
            </motion.div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
