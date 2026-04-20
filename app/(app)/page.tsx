import { Flame, ArrowUpRight } from "lucide-react";

type Story = {
  id: string;
  eyebrow: string;
  title: string;
  dek: string;
  source: string;
  time: string;
  signal: "hot" | "rise" | "cool";
  accent: string;
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
    accent: "var(--peach)",
  },
  {
    id: "s2",
    eyebrow: "Markets · Energy",
    title: "Grid inertia is the new oil reserve",
    dek: "Utilities quietly bought 40GW of battery capacity this year. The trade isn\u2019t solar \u2014 it\u2019s smoothing.",
    source: "the-information",
    time: "5h",
    signal: "rise",
    accent: "var(--mint)",
  },
  {
    id: "s3",
    eyebrow: "Design · Tools",
    title: "Why every design tool is turning into a notebook",
    dek: "Figma, Linear, Notion \u2014 they\u2019re all chasing the same surface: a canvas you can query.",
    source: "a16z",
    time: "9h",
    signal: "cool",
    accent: "var(--sky)",
  },
];

export default function FeedPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Hero */}
      <section
        className="brick p-6"
        style={{
          background: "var(--lemon)",
          animation: "popUp var(--d-reveal) var(--ease-spring) both",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} strokeWidth={2.5} />
          <span className="label-eyebrow">Today · for you</span>
        </div>
        <h1
          className="font-display font-bold leading-[1.02] mb-3"
          style={{ fontSize: 44, letterSpacing: "-0.02em" }}
        >
          Write from what&apos;s{" "}
          <em
            className="not-italic"
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
          </em>
          .
        </h1>
        <p
          className="max-w-[58ch] text-[15px] leading-[1.55] font-medium"
          style={{ color: "var(--ink-2)" }}
        >
          The feed surfaces the 8&ndash;12 stories that actually shifted discourse
          today &mdash; stripped of hype, scored by velocity, and ready to turn
          into a draft.
        </p>
      </section>

      {/* Stories */}
      <section className="flex flex-col gap-4">
        {STORIES.map((s, i) => (
          <article
            key={s.id}
            className="brick p-5 cursor-pointer"
            style={{
              transition:
                "transform var(--d-instant) var(--ease-swift), box-shadow var(--d-instant) var(--ease-swift)",
              animation: "popUp var(--d-reveal) var(--ease-spring) both",
              animationDelay: `${120 + i * 80}ms`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="label-eyebrow">{s.eyebrow}</span>
              <span
                className={`sticker sticker-${s.signal}`}
                title={s.signal}
              >
                {s.signal === "hot" && "\uD83D\uDD25 trending"}
                {s.signal === "rise" && "\u2197 rising"}
                {s.signal === "cool" && "\u2744 cooling"}
              </span>
            </div>
            <h2
              className="font-display font-bold leading-[1.15] mb-2"
              style={{ fontSize: 26, letterSpacing: "-0.015em" }}
            >
              {s.title}
            </h2>
            <p
              className="text-[14px] leading-[1.55] font-medium mb-4"
              style={{ color: "var(--ink-2)", maxWidth: "62ch" }}
            >
              {s.dek}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="chip"
                  style={{ background: s.accent }}
                >
                  {s.source}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--muted)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.time.toUpperCase()} AGO
                </span>
              </div>
              <button type="button" className="btn">
                Open
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
