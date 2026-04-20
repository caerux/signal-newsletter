"use client";

import { ChevronsRight, Sparkles, Lightbulb, ListChecks } from "lucide-react";
import { Brick, Button, Eyebrow } from "@/components/ui";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export function InsightPanel({ collapsed, onToggle }: Props) {
  if (collapsed) {
    return (
      <Brick
        fill="lavender"
        className="flex flex-col items-center justify-between py-4"
        style={{
          animation: "slideInRight var(--d-reveal) var(--ease-spring) both",
        }}
      >
        <CollapseButton collapsed={collapsed} onToggle={onToggle} />
        <div
          className="font-bold"
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
      </Brick>
    );
  }

  return (
    <Brick
      fill="lavender"
      className="p-5"
      style={{
        animation: "slideInRight var(--d-reveal) var(--ease-spring) both",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} strokeWidth={2.5} />
          <Eyebrow style={{ color: "var(--ink)" }}>AI Insight</Eyebrow>
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
      <Brick
        variant="inverted"
        className="mb-4 p-4"
        style={{
          animation: "popUp var(--d-reveal) var(--ease-spring) both",
          animationDelay: "120ms",
        }}
      >
        <Eyebrow
          className="mb-1.5 block"
          style={{ color: "var(--lemon)" }}
        >
          Key takeaway
        </Eyebrow>
        <p className="text-[13px] leading-[1.55] font-medium">
          Pick a story to surface its bias, timeline, and 3 angles you
          haven&apos;t thought of yet.
        </p>
      </Brick>

      {/* Suggested angles */}
      <Brick
        className="mb-4 p-4"
        style={{
          animation: "popUp var(--d-reveal) var(--ease-spring) both",
          animationDelay: "200ms",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={14} strokeWidth={2.5} />
          <Eyebrow>Angles</Eyebrow>
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
      </Brick>

      {/* Draft actions */}
      <Brick
        fill="mint"
        className="p-4"
        style={{
          animation: "popUp var(--d-reveal) var(--ease-spring) both",
          animationDelay: "280ms",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <ListChecks size={14} strokeWidth={2.5} />
          <Eyebrow>Next actions</Eyebrow>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button>Draft outline</Button>
          <Button>Fact check</Button>
        </div>
      </Brick>
    </Brick>
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
