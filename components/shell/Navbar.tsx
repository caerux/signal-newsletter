"use client";

import { Search, Sparkles } from "lucide-react";
import { Avatar, Button, Chip, Kbd, Tab } from "@/components/ui";
import { useView, VIEW_LABELS, type AppView } from "./view-context";

const TAB_ORDER: AppView[] = ["feed", "saved", "drafts", "trending"];

export function Navbar() {
  const { view, setView } = useView();

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
          <Chip
            fill="mint"
            style={{
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            beta
          </Chip>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-2">
        {TAB_ORDER.map((id) => (
          <Tab
            key={id}
            active={view === id}
            onClick={() => setView(id)}
          >
            {VIEW_LABELS[id]}
          </Tab>
        ))}
      </nav>

      {/* Search — opens command palette on click or ⌘K */}
      <button
        type="button"
        onClick={() => {
          const e = new KeyboardEvent("keydown", {
            key: "k",
            metaKey: true,
            bubbles: true,
          });
          window.dispatchEvent(e);
        }}
        className="relative flex w-full items-center gap-3 text-left mx-2"
        style={{
          padding: "6px 10px 6px 6px",
          border: "var(--bw-3) solid var(--ink)",
          borderRadius: "var(--r-pill)",
          background: "#ffffff",
          boxShadow: "var(--sh-md)",
          cursor: "text",
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
        <span className="flex-1 min-w-[260px] text-[13px] font-medium text-muted">
          Search signals, sources, drafts…
        </span>
        <Kbd>⌘K</Kbd>
      </button>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        <Button variant="primary">
          <Sparkles size={14} strokeWidth={2.5} />
          New idea
        </Button>
        <Avatar initial="A" />
      </div>
    </header>
  );
}
