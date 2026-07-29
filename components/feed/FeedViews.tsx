"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Flame,
  MoreHorizontal,
  Pencil,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Brick,
  Button,
  Chip,
  Eyebrow,
  Sticker,
} from "@/components/ui";
import { FILL_VAR, type Fill, type Signal } from "@/lib/tokens";
import { useView, VIEW_LABELS, type AppView } from "@/components/shell/view-context";
import { useBookmarks } from "@/components/shell/bookmark-context";
import { relativeTime } from "@/lib/relativeTime";
import { InfiniteFeed } from "./InfiniteFeed";
import { StoryCard, type Story } from "./StoryCard";
import type { FeedArticle } from "@/app/(app)/page";
import { useState, useEffect } from "react";

function articleToStory(a: FeedArticle): Story {
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


const SAVED: Story[] = [
  {
    id: "sv1",
    eyebrow: "AI · Research",
    title: "Chain-of-thought was never the point",
    dek: "Three researchers on why reasoning isn\u2019t an emergent property \u2014 it\u2019s a search strategy.",
    source: "lesswrong",
    time: "1d",
    signal: "cool",
    accent: "lavender",
    url: "#",
  },
  {
    id: "sv2",
    eyebrow: "Startups",
    title: "The solo-founder playbook for 2026",
    dek: "Team of one, revenue of a hundred. How the new tooling reshapes what it takes to start.",
    source: "every",
    time: "2d",
    signal: "rise",
    accent: "mint",
    url: "#",
  },
];

type Draft = {
  id: string;
  title: string;
  wordCount: number;
  updatedAt: string;
  status: "idea" | "outline" | "in-progress" | "ready";
};

const DRAFTS: Draft[] = [
  {
    id: "d1",
    title: "The quiet death of the monolith cloud",
    wordCount: 842,
    updatedAt: "Today · 11:42am",
    status: "in-progress",
  },
  {
    id: "d2",
    title: "Why every AI startup is really a distribution startup",
    wordCount: 412,
    updatedAt: "Yesterday",
    status: "outline",
  },
  {
    id: "d3",
    title: "Notes on the second wave of on-device inference",
    wordCount: 0,
    updatedAt: "3 days ago",
    status: "idea",
  },
];

type Trending = {
  id: string;
  title: string;
  source: string;
  delta: string;
  fill: Fill;
};

const TRENDING: Trending[] = [
  { id: "t1", title: "Anthropic's residency program goes permanent", source: "the-information", delta: "+38%", fill: "peach" },
  { id: "t2", title: "Every major cloud now ships their own silicon", source: "platformer", delta: "+24%", fill: "lemon" },
  { id: "t3", title: "Substack's new podcast tools launched quietly", source: "substack", delta: "+19%", fill: "mint" },
  { id: "t4", title: "Figma Sites is finally in general availability", source: "figma.com", delta: "+14%", fill: "sky" },
  { id: "t5", title: "The new RSS: protocol revival, explained", source: "ben-thompson", delta: "+11%", fill: "lavender" },
];

const viewTransition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export function FeedViews({ initialArticles = [] }: { initialArticles?: FeedArticle[] }) {
  const { view, activeCategory } = useView();
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [savedArticles, setSavedArticles] = useState<Story[]>([]);
  const { toggle } = useBookmarks();

  useEffect(() => {
    if (view === "drafts") {
      fetch("/api/drafts")
        .then((r) => r.json())
        .then((json) => {
          setDrafts(
            (json.drafts ?? []).map((d: {
              id: string; title: string; body_md: string;
              status: string; updated_at: string;
            }) => ({
              id: d.id,
              title: d.title,
              wordCount: d.body_md.trim() ? d.body_md.trim().split(/\s+/).length : 0,
              updatedAt: relativeTime(d.updated_at),
              status: (["idea", "outline", "in-progress", "ready"].includes(d.status)
                ? d.status : "idea") as Draft["status"],
            }))
          );
        })
        .catch(() => {});
    }
  }, [view]);

  useEffect(() => {
    if (view === "saved") {
      fetch("/api/bookmarks?full=true")
        .then((r) => r.json())
        .then((json) => {
          setSavedArticles(
            (json.articles ?? []).map((a: {
              id: string; title: string; description: string | null;
              canonical_url: string; published_at: string | null;
              signal: Signal; source: string; category: string | null; accent: Fill;
            }) => ({
              id: a.id,
              eyebrow: a.category ?? "Signal",
              title: a.title,
              dek: a.description ?? "",
              source: a.source,
              time: relativeTime(a.published_at),
              signal: a.signal,
              accent: a.accent,
              url: a.canonical_url,
            }))
          );
        })
        .catch(() => {});
    }
  }, [view]);

  async function createDraft(title = "Untitled", body = "") {
    const res = await fetch("/api/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body_md: body }),
    });
    const json = await res.json() as { id: string };
    if (json.id) router.push(`/drafts/${json.id}`);
  }

  function removeSaved(id: string) {
    toggle(id);
    setSavedArticles((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={viewTransition}
      >
        <ViewHeading view={view} onNewDraft={() => createDraft()} activeCategory={activeCategory} />
        {view === "feed" && <InfiniteFeed initialArticles={initialArticles} category={activeCategory} />}
        {view === "saved" && <SavedList stories={savedArticles} onRemove={removeSaved} onDraft={(s) => createDraft(s.title, `> From: ${s.url}\n\n## ${s.title}\n\n${s.dek}\n\n---\n\nWrite your take here…`)} />}
        {view === "drafts" && <DraftsList drafts={drafts} onNew={() => createDraft()} />}
        {view === "trending" && <TrendingList items={TRENDING} />}
      </motion.div>
    </AnimatePresence>
  );
}

function ViewHeading({ view, onNewDraft, activeCategory }: { view: AppView; onNewDraft: () => void; activeCategory?: string | null }) {
  const { setActiveCategory } = useView();
  if (view === "feed") {
    return (
      <Brick
        fill="lemon"
        className="p-6 mb-5"
        style={{ animation: "popUp var(--d-reveal) var(--ease-spring) both" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} strokeWidth={2.5} />
          <Eyebrow>Today · for you</Eyebrow>
          {activeCategory && (
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: "var(--r-pill)",
                background: "var(--ink)", color: "var(--bg)",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                border: "none", cursor: "pointer",
              }}
            >
              {activeCategory.toUpperCase()} ×
            </button>
          )}
        </div>
        <h1
          className="font-display font-bold leading-[1.02] mb-3"
          style={{ fontSize: 44, letterSpacing: "-0.02em" }}
        >
          Write from what&apos;s{" "}
          <span
            style={{
              fontStyle: "italic",
              background: "var(--ink)",
              color: "var(--bg)",
              padding: "0 10px",
              borderRadius: "var(--r-sm)",
              display: "inline-block",
              transform: "rotate(-1.2deg)",
            }}
          >
            moving
          </span>
          .
        </h1>
        <p
          className="max-w-[58ch] text-[15px] leading-[1.55] font-medium"
          style={{ color: "var(--ink-2)" }}
        >
          The feed surfaces the 8&ndash;12 stories that actually shifted
          discourse today &mdash; stripped of hype, scored by velocity, and
          ready to turn into a draft.
        </p>
      </Brick>
    );
  }

  const map: Record<Exclude<AppView, "feed">, { kicker: string; title: string; dek: string; fill: Fill }> = {
    saved: {
      kicker: "Your reading queue",
      title: "Saved for later",
      dek: "Everything you bookmarked. Turn the best ones into drafts.",
      fill: "sky",
    },
    drafts: {
      kicker: "Your workshop",
      title: "Drafts in flight",
      dek: "From scratch idea to ready-to-ship. Everything you\u2019re writing lives here.",
      fill: "pink",
    },
    trending: {
      kicker: "Across your sources",
      title: "What everyone is writing about",
      dek: "Ranked by velocity across the last 24 hours. Higher delta = faster pickup.",
      fill: "peach",
    },
  };

  const { kicker, title, dek, fill } = map[view as Exclude<AppView, "feed">];

  return (
    <Brick
      fill={fill}
      className="p-6 mb-5"
      style={{ animation: "popUp var(--d-reveal) var(--ease-spring) both" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow className="block mb-2">{kicker}</Eyebrow>
          <h1 className="font-display font-bold leading-[1.02] mb-2" style={{ fontSize: 38, letterSpacing: "-0.02em" }}>
            {title}
          </h1>
          <p className="max-w-[58ch] text-[14px] leading-[1.55] font-medium" style={{ color: "var(--ink-2)" }}>
            {dek}
          </p>
        </div>
        {view === "drafts" && (
          <Button variant="primary" onClick={onNewDraft} className="flex-shrink-0 mt-1">
            <Plus size={14} strokeWidth={2.5} />
            New draft
          </Button>
        )}
      </div>
    </Brick>
  );
}

/* ---------- Saved ---------- */

function SavedList({ stories, onRemove, onDraft }: { stories: Story[]; onRemove: (id: string) => void; onDraft: (s: Story) => void }) {
  if (stories.length === 0) {
    return (
      <Brick className="p-10 text-center">
        <p className="label-eyebrow mb-3">Nothing saved yet</p>
        <p className="text-[14px] font-medium" style={{ color: "var(--muted)" }}>
          Press <strong>S</strong> on any article in the feed to save it here.
        </p>
      </Brick>
    );
  }
  return (
    <section className="flex flex-col gap-4">
      {stories.map((s, i) => (
        <motion.article
          key={s.id}
          className="brick p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Eyebrow>{s.eyebrow}</Eyebrow>
            <div className="flex items-center gap-2">
              <Sticker kind={s.signal} />
              <Chip fill={s.accent}>saved · {s.time}</Chip>
            </div>
          </div>
          <h2 className="font-display font-bold text-[24px] leading-[1.2] mb-2"
              style={{ letterSpacing: "-0.015em" }}>
            {s.title}
          </h2>
          <p className="text-[14px] leading-[1.55] font-medium"
             style={{ color: "var(--ink-2)", maxWidth: "62ch" }}>
            {s.dek}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Button variant="primary" onClick={() => onDraft(s)}>
              <Pencil size={13} strokeWidth={2.5} />
              Draft from this
            </Button>
            <Button onClick={() => onRemove(s.id)}>
              <Bookmark size={13} strokeWidth={2.5} />
              Remove
            </Button>
          </div>
        </motion.article>
      ))}
    </section>
  );
}

/* ---------- Drafts ---------- */

const STATUS_FILL: Record<Draft["status"], Fill> = {
  idea: "pink",
  outline: "sky",
  "in-progress": "lemon",
  ready: "mint",
};

function DraftMenu({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setOpen(false);
    if (!confirm("Delete this draft? This can't be undone.")) return;
    await fetch(`/api/drafts/${id}`, { method: "DELETE" });
    onDeleted();
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid place-items-center"
        style={{ width: 30, height: 30, borderRadius: "var(--r-sm)", background: open ? "var(--ink)" : "#ffffff", color: open ? "var(--bg)" : "inherit", border: "var(--bw-2) solid var(--ink)", boxShadow: "var(--sh-xs)", cursor: "pointer" }}
        title="More options"
      >
        <MoreHorizontal size={14} strokeWidth={2.5} />
      </button>

      {open && (
        <>
          {/* Click-away overlay */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-8 z-20 flex flex-col overflow-hidden"
            style={{ minWidth: 150, background: "#fff", border: "2px solid var(--ink)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-md)" }}
          >
            {[
              { label: "Open", action: () => { setOpen(false); router.push(`/drafts/${id}`); } },
              { label: "Continue writing", action: () => { setOpen(false); router.push(`/drafts/${id}`); } },
              { label: "Delete", action: handleDelete, danger: true },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="flex items-center px-3 py-2 text-left text-[13px] font-semibold"
                style={{
                  color: item.danger ? "var(--hot)" : "var(--ink)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  borderTop: item.danger ? "2px dashed rgba(14,14,14,0.15)" : "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = item.danger ? "#fff0f0" : "var(--lemon)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DraftsList({ drafts: initialDrafts, onNew }: { drafts: Draft[]; onNew: () => void }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState(initialDrafts);

  // sync when parent re-fetches
  useEffect(() => { setDrafts(initialDrafts); }, [initialDrafts]);

  function removeDraft(id: string) {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  if (drafts.length === 0) {
    return (
      <Brick className="p-10 text-center">
        <p className="label-eyebrow mb-3">No drafts yet</p>
        <p className="text-[14px] font-medium mb-4" style={{ color: "var(--muted)" }}>
          Save articles and turn them into drafts.
        </p>
        <Button variant="primary" onClick={onNew}>
          <Plus size={13} strokeWidth={2.5} />
          Start a blank draft
        </Button>
      </Brick>
    );
  }
  return (
    <section className="flex flex-col gap-4">
      {drafts.map((d, i) => (
        <motion.article
          key={d.id}
          className="brick p-5 cursor-pointer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
          whileHover={{ y: -2, x: -2, transition: { duration: 0.12 } }}
          onClick={() => router.push(`/drafts/${d.id}`)}
        >
          <div className="flex items-center justify-between mb-3">
            <Chip fill={STATUS_FILL[d.status]} style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
              {d.status}
            </Chip>
            <DraftMenu id={d.id} onDeleted={() => removeDraft(d.id)} />
          </div>
          <h2 className="font-display font-bold text-[24px] leading-[1.2] mb-3" style={{ letterSpacing: "-0.015em" }}>
            {d.title}
          </h2>
          <div className="flex items-center gap-4">
            <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em" }}>{d.wordCount.toLocaleString()} WORDS</span>
            <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em" }}>· {d.updatedAt.toUpperCase()} AGO</span>
            <div className="ml-auto flex items-center gap-2">
              <Button onClick={(e) => { e.stopPropagation(); router.push(`/drafts/${d.id}`); }}>Open</Button>
              <Button variant="primary" onClick={(e) => { e.stopPropagation(); router.push(`/drafts/${d.id}`); }}>Continue writing</Button>
            </div>
          </div>
        </motion.article>
      ))}
    </section>
  );
}

/* ---------- Trending ---------- */

function TrendingList({ items }: { items: Trending[] }) {
  return (
    <Brick className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={14} strokeWidth={2.5} />
        <Eyebrow>Past 24 hours</Eyebrow>
      </div>
      <ol className="flex flex-col">
        {items.map((t, i) => (
          <motion.li
            key={t.id}
            className="flex items-center gap-4 py-3"
            style={i < items.length - 1 ? { borderBottom: "2px dashed rgba(14,14,14,0.15)" } : undefined}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
          >
            <span
              className="grid place-items-center font-mono"
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--r-sm)",
                background: FILL_VAR[t.fill],
                border: "var(--bw-2) solid var(--ink)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-[16px] leading-[1.25] truncate"
                 style={{ letterSpacing: "-0.01em" }}>
                {t.title}
              </p>
              <p
                className="font-mono mt-0.5"
                style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.06em" }}
              >
                {t.source}
              </p>
            </div>
            <span
              className="font-mono"
              style={{
                background: "var(--mint)",
                border: "var(--bw-2) solid var(--ink)",
                borderRadius: "var(--r-pill)",
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {t.delta}
            </span>
          </motion.li>
        ))}
      </ol>
    </Brick>
  );
}

/* ---------- Empty ---------- */

function Empty({ label }: { label: string }) {
  return (
    <Brick className="p-10 text-center">
      <p className="label-eyebrow mb-2">{label}</p>
      <p className="text-[14px] font-medium" style={{ color: "var(--muted)" }}>
        Nothing to show here yet.
      </p>
    </Brick>
  );
}

export function useCurrentViewLabel(): string {
  const { view } = useView();
  return VIEW_LABELS[view];
}
