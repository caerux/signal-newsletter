"use client";

import {
  ChevronsLeft,
  Flame,
  Globe,
  Bookmark,
  Pencil,
  Cpu,
  Database,
  Palette,
  TrendingUp,
} from "lucide-react";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

const CATEGORIES = [
  { id: "trending", label: "Trending", icon: Flame, count: 24, accent: "var(--peach)" },
  { id: "world",    label: "World",    icon: Globe,      count: 18, accent: "var(--sky)" },
  { id: "ai",       label: "AI",       icon: Cpu,        count: 42, accent: "var(--lavender)" },
  { id: "data",     label: "Data",     icon: Database,   count: 11, accent: "var(--mint)" },
  { id: "design",   label: "Design",   icon: Palette,    count: 9,  accent: "var(--pink)" },
  { id: "markets",  label: "Markets",  icon: TrendingUp, count: 15, accent: "var(--lemon)" },
];

const COLLECTIONS = [
  { id: "saved",  label: "Saved",  icon: Bookmark, count: 8 },
  { id: "drafts", label: "Drafts", icon: Pencil,   count: 3 },
];

export function Sidebar({ collapsed, onToggle }: Props) {
  if (collapsed) {
    return (
      <aside
        className="brick relative flex flex-col items-center gap-3 py-4"
        style={{
          animation: "slideInLeft var(--d-reveal) var(--ease-spring) both",
        }}
      >
        <CollapseButton collapsed={collapsed} onToggle={onToggle} />
        {CATEGORIES.map((c, i) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              type="button"
              title={`${c.label} · ${c.count}`}
              className="grid place-items-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--r-md)",
                background: c.accent,
                border: "var(--bw-2) solid var(--ink)",
                boxShadow: "var(--sh-xs)",
                animation: `stampIn var(--d-reveal) var(--ease-spring) both`,
                animationDelay: `${80 + i * 60}ms`,
              }}
            >
              <Icon size={16} strokeWidth={2.5} />
            </button>
          );
        })}
      </aside>
    );
  }

  return (
    <aside
      className="brick p-5"
      style={{
        animation: "slideInLeft var(--d-reveal) var(--ease-spring) both",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="label-eyebrow">Categories</span>
        <CollapseButton collapsed={collapsed} onToggle={onToggle} />
      </div>

      <ul className="flex flex-col gap-1.5">
        {CATEGORIES.map((c, i) => {
          const Icon = c.icon;
          return (
            <li
              key={c.id}
              style={{
                animation: "popUp var(--d-reveal) var(--ease-spring) both",
                animationDelay: `${60 + i * 50}ms`,
              }}
            >
              <button
                type="button"
                className="group flex w-full items-center gap-3 px-2.5 py-2 text-left"
                style={{
                  borderRadius: "var(--r-md)",
                  transition:
                    "background-color var(--d-fast) var(--ease-swift), transform var(--d-instant) var(--ease-swift)",
                }}
              >
                <span
                  className="grid place-items-center"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "var(--r-sm)",
                    background: c.accent,
                    border: "var(--bw-2) solid var(--ink)",
                  }}
                >
                  <Icon size={13} strokeWidth={2.5} />
                </span>
                <span className="flex-1 text-[13.5px] font-semibold">
                  {c.label}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "var(--muted)",
                  }}
                >
                  {c.count.toString().padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        className="my-5"
        style={{
          borderTop: "2px dashed rgba(14,14,14,0.2)",
        }}
      />

      <div className="mb-2">
        <span className="label-eyebrow">Library</span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {COLLECTIONS.map((c, i) => {
          const Icon = c.icon;
          return (
            <li
              key={c.id}
              style={{
                animation: "popUp var(--d-reveal) var(--ease-spring) both",
                animationDelay: `${260 + i * 50}ms`,
              }}
            >
              <button
                type="button"
                className="flex w-full items-center gap-3 px-2.5 py-2 text-left"
                style={{ borderRadius: "var(--r-md)" }}
              >
                <span
                  className="grid place-items-center"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "var(--r-sm)",
                    background: "#ffffff",
                    border: "var(--bw-2) solid var(--ink)",
                  }}
                >
                  <Icon size={13} strokeWidth={2.5} />
                </span>
                <span className="flex-1 text-[13.5px] font-semibold">
                  {c.label}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--muted)",
                  }}
                >
                  {c.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function CollapseButton({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={collapsed ? "Expand sidebar ([)" : "Collapse sidebar ([)"}
      className="grid place-items-center"
      style={{
        width: 32,
        height: 32,
        borderRadius: "var(--r-sm)",
        background: "#ffffff",
        border: "var(--bw-2) solid var(--ink)",
        boxShadow: "var(--sh-xs)",
        cursor: "pointer",
        transition:
          "transform var(--d-instant) var(--ease-swift), box-shadow var(--d-instant) var(--ease-swift)",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform var(--d-base) var(--ease-spring)",
        }}
      >
        <ChevronsLeft size={14} strokeWidth={2.5} />
      </span>
    </button>
  );
}
