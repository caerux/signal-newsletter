"use client";

import { Search, Sparkles } from "lucide-react";

const TABS = [
  { id: "feed", label: "Feed", active: true },
  { id: "saved", label: "Saved" },
  { id: "drafts", label: "Drafts" },
  { id: "trending", label: "Trending" },
];

export function Navbar() {
  return (
    <header
      className="sticky top-0 z-20 border-b-[2.5px] border-ink bg-bg px-6 py-4"
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto 1fr auto",
        alignItems: "center",
        gap: 18,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="grid place-items-center font-display font-bold"
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--r-md)",
            background: "var(--lemon)",
            border: "var(--bw-3) solid var(--ink)",
            boxShadow: "var(--sh-sm)",
            fontSize: 18,
          }}
        >
          S
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="font-display font-bold text-[20px] leading-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            Signal
          </span>
          <span
            className="chip"
            style={{
              background: "var(--mint)",
              fontSize: 10,
              letterSpacing: "0.08em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            beta
          </span>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="tab"
            data-active={t.active ? "true" : "false"}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Search */}
      <label
        className="relative flex items-center gap-3 mx-2"
        style={{
          padding: "6px 10px 6px 6px",
          border: "var(--bw-3) solid var(--ink)",
          borderRadius: "var(--r-pill)",
          background: "#ffffff",
          boxShadow: "var(--sh-md)",
          transition:
            "transform var(--d-fast) var(--ease-swift), box-shadow var(--d-fast) var(--ease-swift), background-color var(--d-fast) var(--ease-swift)",
        }}
      >
        <span
          className="grid place-items-center"
          style={{
            width: 22,
            height: 22,
            borderRadius: "var(--r-sm)",
            background: "var(--mint)",
            border: "var(--bw-2) solid var(--ink)",
          }}
        >
          <Search size={12} strokeWidth={2.5} />
        </span>
        <input
          type="text"
          placeholder="Search signals, sources, drafts…"
          className="flex-1 min-w-[260px] bg-transparent outline-none text-[13px] font-medium placeholder:text-muted"
        />
        <kbd className="kbd">⌘K</kbd>
      </label>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-primary">
          <Sparkles size={14} strokeWidth={2.5} />
          New idea
        </button>
        <div
          className="grid place-items-center font-bold"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--lavender)",
            border: "var(--bw-3) solid var(--ink)",
            boxShadow: "var(--sh-sm)",
            fontSize: 15,
          }}
        >
          A
        </div>
      </div>
    </header>
  );
}
