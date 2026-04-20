"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bookmark,
  Flame,
  MoreHorizontal,
  Pencil,
  TrendingUp,
} from "lucide-react";
import {
  Brick,
  Button,
  Chip,
  Eyebrow,
  Sticker,
} from "@/components/ui";
import { FILL_VAR, type Fill, type Signal } from "@/lib/tokens";
import { useView, VIEW_LABELS, type AppView } from "@/components/shell/view-context";

type Story = {
  id: string;
  eyebrow: string;
  title: string;
  dek: string;
  source: string;
  time: string;
  signal: Signal;
  accent: Fill;
};

const STORIES: Story[] = [
  {
    id: "s1",
    eyebrow: "AI · Infrastructure",
    title: "The model isn\u2019t the moat anymore",
    dek: "As weights commoditize, distribution and distribution alone decides who wins. A field guide for builders who missed the memo.",
    source: "stratechery",
    time: "2h",
    signal: "hot",
    accent: "peach",
  },
  {
    id: "s2",
    eyebrow: "Markets · Energy",
    title: "Grid inertia is the new oil reserve",
    dek: "Utilities quietly bought 40GW of battery capacity this year. The trade isn\u2019t solar \u2014 it\u2019s smoothing.",
    source: "the-information",
    time: "5h",
    signal: "rise",
    accent: "mint",
  },
  {
    id: "s3",
    eyebrow: "Design · Tools",
    title: "Why every design tool is turning into a notebook",
    dek: "Figma, Linear, Notion \u2014 they\u2019re all chasing the same surface: a canvas you can query.",
    source: "a16z",
    time: "9h",
    signal: "cool",
    accent: "sky",
  },
];

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

export function FeedViews() {
  const { view } = useView();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={viewTransition}
      >
        <ViewHeading view={view} />
        {view === "feed" && <FeedList stories={STORIES} />}
        {view === "saved" && <SavedList stories={SAVED} />}
        {view === "drafts" && <DraftsList drafts={DRAFTS} />}
        {view === "trending" && <TrendingList items={TRENDING} />}
      </motion.div>
    </AnimatePresence>
  );
}

function ViewHeading({ view }: { view: AppView }) {
  if (view === "feed") {
    return (
      <Brick
        fill="lemon"
        className="p-6 mb-5"
        style={{
          animation: "popUp var(--d-reveal) var(--ease-spring) both",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} strokeWidth={2.5} />
          <Eyebrow>Today · for you</Eyebrow>
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
      style={{
        animation: "popUp var(--d-reveal) var(--ease-spring) both",
      }}
    >
      <Eyebrow className="block mb-2">{kicker}</Eyebrow>
      <h1
        className="font-display font-bold leading-[1.02] mb-2"
        style={{ fontSize: 38, letterSpacing: "-0.02em" }}
      >
        {title}
      </h1>
      <p
        className="max-w-[58ch] text-[14px] leading-[1.55] font-medium"
        style={{ color: "var(--ink-2)" }}
      >
        {dek}
      </p>
    </Brick>
  );
}

/* ---------- Feed ---------- */

function FeedList({ stories }: { stories: Story[] }) {
  return (
    <section className="flex flex-col gap-4">
      {stories.map((s, i) => (
        <StoryCard key={s.id} story={s} index={i} />
      ))}
    </section>
  );
}

function StoryCard({ story, index }: { story: Story; index: number }) {
  return (
    <motion.article
      className="brick p-5 cursor-pointer"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.42,
        ease: [0.34, 1.56, 0.64, 1],
        delay: 0.06 + index * 0.06,
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
        <Button>
          Open
          <ArrowUpRight size={14} strokeWidth={2.5} />
        </Button>
      </div>
    </motion.article>
  );
}

/* ---------- Saved ---------- */

function SavedList({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return <Empty label="Nothing saved yet" />;
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
            <Button variant="primary">
              <Pencil size={13} strokeWidth={2.5} />
              Draft from this
            </Button>
            <Button>
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

function DraftsList({ drafts }: { drafts: Draft[] }) {
  if (drafts.length === 0) return <Empty label="No drafts yet" />;
  return (
    <section className="flex flex-col gap-4">
      {drafts.map((d, i) => (
        <motion.article
          key={d.id}
          className="brick p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
        >
          <div className="flex items-center justify-between mb-3">
            <Chip
              fill={STATUS_FILL[d.status]}
              style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}
            >
              {d.status}
            </Chip>
            <button
              type="button"
              className="grid place-items-center"
              style={{
                width: 30,
                height: 30,
                borderRadius: "var(--r-sm)",
                background: "#ffffff",
                border: "var(--bw-2) solid var(--ink)",
                boxShadow: "var(--sh-xs)",
              }}
              title="More"
            >
              <MoreHorizontal size={14} strokeWidth={2.5} />
            </button>
          </div>
          <h2 className="font-display font-bold text-[24px] leading-[1.2] mb-3"
              style={{ letterSpacing: "-0.015em" }}>
            {d.title}
          </h2>
          <div className="flex items-center gap-4">
            <span
              className="font-mono"
              style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em" }}
            >
              {d.wordCount.toLocaleString()} WORDS
            </span>
            <span
              className="font-mono"
              style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em" }}
            >
              · {d.updatedAt.toUpperCase()}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button>Open</Button>
              <Button variant="primary">Continue writing</Button>
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
