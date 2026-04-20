"use client";

import { ChevronsRight, Sparkles, Lightbulb, ListChecks } from "lucide-react";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export function InsightPanel({ collapsed, onToggle }: Props) {
  if (collapsed) {
    return (
      <aside
        className="brick flex flex-col items-center justify-between py-4"
        style={{
          background: "var(--lavender)",
          animation: "slideInRight var(--d-reveal) var(--ease-spring) both",
        }}
      >
        <CollapseButton collapsed={collapsed} onToggle={onToggle} />
        <div
          className="font-display font-bold"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            letterSpacing: "0.18em",
            fontSize: 11,
            textTransform: "uppercase",
            fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
            color: "var(--ink)",
          }}
        >
          AI · Insight
        </div>
        <Sparkles size={18} strokeWidth={2.5} />
      </aside>
    );
  }

  return (
    <aside
      className="brick p-5"
      style={{
        background: "var(--lavender)",
        animation: "slideInRight var(--d-reveal) var(--ease-spring) both",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} strokeWidth={2.5} />
          <span className="label-eyebrow" style={{ color: "var(--ink)" }}>
            AI Insight
          </span>
        </div>
        <CollapseButton collapsed={collapsed} onToggle={onToggle} />
      </div>

      <h2
        className="font-display font-bold leading-tight mb-4"
        style={{ fontSize: 22, letterSpacing: "-0.015em" }}
      >
        What&apos;s moving in your feed right now
      </h2>

      {/* Key takeaway */}
      <div
        className="mb-4"
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          border: "var(--bw-3) solid var(--ink)",
          borderRadius: "var(--r-md)",
          boxShadow: "var(--sh-sm)",
          padding: "14px 16px",
          animation: "popUp var(--d-reveal) var(--ease-spring) both",
          animationDelay: "120ms",
        }}
      >
        <div
          className="label-eyebrow mb-1.5"
          style={{ color: "var(--lemon)" }}
        >
          Key takeaway
        </div>
        <p className="text-[13px] leading-[1.55] font-medium">
          Pick a story to surface its bias, timeline, and 3 angles you haven&apos;t
          thought of yet.
        </p>
      </div>

      {/* Suggested angles */}
      <div
        className="mb-4"
        style={{
          background: "#ffffff",
          border: "var(--bw-3) solid var(--ink)",
          borderRadius: "var(--r-md)",
          boxShadow: "var(--sh-sm)",
          padding: "14px 16px",
          animation: "popUp var(--d-reveal) var(--ease-spring) both",
          animationDelay: "200ms",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={14} strokeWidth={2.5} />
          <span className="label-eyebrow">Angles</span>
        </div>
        <ul className="flex flex-col gap-2.5">
          {[
            "What if the hype is masking the real shift?",
            "Who benefits — and who quietly loses?",
            "Five weeks from now, what will look obvious?",
          ].map((angle, i) => (
            <li key={i} className="flex gap-3 text-[13px] leading-[1.5]">
              <span
                className="grid place-items-center shrink-0 font-mono"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "var(--r-sm)",
                  background: "var(--pink)",
                  border: "var(--bw-2) solid var(--ink)",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-medium">{angle}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Draft actions */}
      <div
        style={{
          background: "var(--mint)",
          border: "var(--bw-3) solid var(--ink)",
          borderRadius: "var(--r-md)",
          boxShadow: "var(--sh-sm)",
          padding: "14px 16px",
          animation: "popUp var(--d-reveal) var(--ease-spring) both",
          animationDelay: "280ms",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <ListChecks size={14} strokeWidth={2.5} />
          <span className="label-eyebrow">Next actions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn">Draft outline</button>
          <button type="button" className="btn">Fact check</button>
        </div>
      </div>
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
      title={collapsed ? "Expand insight (])" : "Collapse insight (])"}
      className="grid place-items-center"
      style={{
        width: 32,
        height: 32,
        borderRadius: "var(--r-sm)",
        background: "#ffffff",
        border: "var(--bw-2) solid var(--ink)",
        boxShadow: "var(--sh-xs)",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform var(--d-base) var(--ease-spring)",
        }}
      >
        <ChevronsRight size={14} strokeWidth={2.5} />
      </span>
    </button>
  );
}
