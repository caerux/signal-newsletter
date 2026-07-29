import Link from "next/link";
import { Brick } from "@/components/ui/Brick";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Chip } from "@/components/ui/Chip";
import { Sticker } from "@/components/ui/Sticker";

export const metadata = {
  title: "Signal — Where ideas start",
  description:
    "Signal compresses what's moving in your niche into signals you can act on. From reading to published draft in 15 minutes.",
};

const FEATURES = [
  {
    fill: "lemon" as const,
    eyebrow: "Ingestion",
    title: "22 curated feeds, zero noise",
    body: "Signal pulls from the highest-signal RSS sources in tech, AI, startups, design, and engineering — deduped, scored by velocity, and ready to read.",
  },
  {
    fill: "lavender" as const,
    eyebrow: "AI Insight",
    title: "3-bullet summaries on demand",
    body: "Click any story. Get a crisp summary, a 'why it matters' sentence, and the key takeaway. No ChatGPT tab-switching.",
  },
  {
    fill: "mint" as const,
    eyebrow: "Draft generator",
    title: "From article to draft in one click",
    body: "Signal generates a Medium-style markdown draft from any story. Edit inline, copy, export — or push straight to Substack.",
  },
  {
    fill: "peach" as const,
    eyebrow: "Keyboard-first",
    title: "J/K to navigate. S to save. D to draft.",
    body: "Designed for writers who live in the keyboard. Every action has a shortcut. No mouse required.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b-[2.5px] border-ink bg-bg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="grid place-items-center font-display font-bold"
            style={{ width: 36, height: 36, borderRadius: 10, background: "var(--lemon)", border: "2.5px solid var(--ink)", boxShadow: "3px 3px 0 0 var(--ink)", fontSize: 18 }}
          >
            S
          </div>
          <span className="font-display font-bold text-[20px]" style={{ letterSpacing: "-0.02em" }}>Signal</span>
          <Chip fill="mint" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>beta</Chip>
        </div>
        <Link href="/login">
          <Button variant="primary">Get started free →</Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex mb-6">
          <Chip fill="peach" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            🔥 Now in beta
          </Chip>
        </div>
        <h1
          className="font-display font-bold mb-6 leading-[1.02]"
          style={{ fontSize: "clamp(44px, 7vw, 80px)", letterSpacing: "-0.03em" }}
        >
          Where{" "}
          <span
            style={{
              fontStyle: "italic",
              background: "var(--ink)",
              color: "var(--bg)",
              padding: "0 16px",
              borderRadius: 6,
              display: "inline-block",
              transform: "rotate(-1.5deg)",
            }}
          >
            ideas
          </span>{" "}
          start.
        </h1>
        <p className="text-[18px] leading-[1.6] font-medium max-w-[52ch] mx-auto mb-10" style={{ color: "var(--ink-2)" }}>
          Signal is an intelligence layer for writers. It compresses what&apos;s moving in your niche into signals you can act on — from reading to published draft in 15 minutes.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/login">
            <Button variant="primary" style={{ fontSize: 16, padding: "12px 28px" }}>
              Start writing free →
            </Button>
          </Link>
          <Link href="/login">
            <Button style={{ fontSize: 16, padding: "12px 28px" }}>
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Signal chips demo */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <Brick className="p-6 flex flex-wrap items-center gap-4">
          <Eyebrow>Live right now</Eyebrow>
          <div className="flex items-center gap-2 flex-wrap">
            {(["hot", "rise", "cool"] as const).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <Sticker kind={s} />
                <span className="text-[13px] font-medium" style={{ color: "var(--ink-2)" }}>
                  {s === "hot" ? "Trending < 10h" : s === "rise" ? "Rising 10–25h" : "Cooling > 25h"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-[200px] text-right font-mono text-[11px] font-bold tracking-widest text-muted">
            SCORED EVERY 6H AUTOMATICALLY
          </div>
        </Brick>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Brick key={f.eyebrow} fill={f.fill} className="p-6">
              <Eyebrow className="block mb-2">{f.eyebrow}</Eyebrow>
              <h3 className="font-display font-bold text-[22px] leading-[1.2] mb-3" style={{ letterSpacing: "-0.015em" }}>
                {f.title}
              </h3>
              <p className="text-[14px] leading-[1.6] font-medium" style={{ color: "var(--ink-2)" }}>
                {f.body}
              </p>
            </Brick>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <Brick fill="lemon" className="p-10 text-center">
          <h2 className="font-display font-bold mb-4 leading-[1.1]" style={{ fontSize: 38, letterSpacing: "-0.02em" }}>
            Ready to write faster?
          </h2>
          <p className="text-[16px] font-medium mb-8 max-w-[42ch] mx-auto" style={{ color: "var(--ink-2)" }}>
            Free to start. No credit card. Just a feed full of ideas waiting to become drafts.
          </p>
          <Link href="/login">
            <Button variant="primary" style={{ fontSize: 16, padding: "12px 32px" }}>
              Get started free →
            </Button>
          </Link>
        </Brick>
      </section>

      {/* Footer */}
      <footer className="border-t-[2px] border-ink/20 px-6 py-6 text-center font-mono text-[11px] font-bold tracking-widest text-muted">
        SIGNAL · BUILT FOR WRITERS · BETA
      </footer>
    </div>
  );
}
