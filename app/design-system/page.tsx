import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Flame,
  Sparkles,
} from "lucide-react";
import {
  Avatar,
  Brick,
  Button,
  Chip,
  Eyebrow,
  Kbd,
  Sticker,
  Tab,
} from "@/components/ui";
import { FILL_VAR, type Fill, type Signal } from "@/lib/tokens";

const PASTELS: Fill[] = ["peach", "lemon", "mint", "sky", "lavender", "pink"];
const SIGNALS: Signal[] = ["hot", "rise", "cool"];

export default function DesignSystemPage() {
  return (
    <div className="h-full w-full overflow-y-auto pane-scroll">
      <div className="mx-auto max-w-5xl px-10 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Eyebrow className="block mb-3">Living reference</Eyebrow>
            <h1
              className="font-display font-bold"
              style={{ fontSize: 56, letterSpacing: "-0.025em", lineHeight: 1 }}
            >
              Signal UI{" "}
              <span
                style={{
                  fontStyle: "italic",
                  background: "var(--lemon)",
                  padding: "0 12px",
                  borderRadius: "var(--r-sm)",
                  display: "inline-block",
                  transform: "rotate(-1.2deg)",
                }}
              >
                styleguide
              </span>
            </h1>
            <p
              className="mt-4 max-w-[58ch] text-[15px] font-medium"
              style={{ color: "var(--ink-2)" }}
            >
              Every primitive in one place. If a component isn&apos;t here,
              it either needs extracting or documenting. Keep this in sync
              with <code className="font-mono">docs/DESIGN_SYSTEM.md</code>.
            </p>
          </div>
          <Link href="/">
            <Button>
              <ArrowLeft size={14} strokeWidth={2.5} />
              Back to app
            </Button>
          </Link>
        </div>

        <Section title="Color · Pastel fills">
          <div className="grid grid-cols-3 gap-4">
            {PASTELS.map((p) => (
              <Swatch key={p} fill={p} name={p} />
            ))}
          </div>
        </Section>

        <Section title="Color · Ink & surfaces">
          <div className="grid grid-cols-4 gap-4">
            <Swatch fill="bg" name="bg" />
            <Swatch fill="bg-2" name="bg-2" />
            <InkSwatch />
            <SemanticSwatches />
          </div>
        </Section>

        <Section title="Typography">
          <Brick className="p-6 space-y-5">
            <TypeSample
              label="display-xl · Fraunces 700 · 48/1.0"
              className="font-display"
              style={{ fontSize: 48, letterSpacing: "-0.02em", lineHeight: 1 }}
            >
              News that moves.
            </TypeSample>
            <TypeSample
              label="display-md · Fraunces 700 · 26/1.15"
              className="font-display"
              style={{ fontSize: 26, letterSpacing: "-0.015em", lineHeight: 1.15 }}
            >
              The model isn&rsquo;t the moat anymore.
            </TypeSample>
            <TypeSample
              label="body · Space Grotesk 500 · 14/1.55"
              style={{ fontSize: 14, lineHeight: 1.55 }}
            >
              Signal surfaces the 8&ndash;12 stories that actually shifted
              discourse today.
            </TypeSample>
            <TypeSample
              label="mono-sm · JetBrains Mono 700 · 11/1.3"
              className="font-mono"
              style={{
                fontSize: 11,
                lineHeight: 1.3,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              STRATECHERY · 2H AGO
            </TypeSample>
          </Brick>
        </Section>

        <Section title="Brick · the foundational container">
          <div className="grid grid-cols-3 gap-4">
            <Brick className="p-5">
              <Eyebrow>brick.solid</Eyebrow>
              <p className="mt-2 text-[13px] font-medium">
                White bg, 2.5px border, 5px offset shadow. The default.
              </p>
            </Brick>
            <Brick variant="inverted" className="p-5">
              <Eyebrow style={{ color: "var(--lemon)" }}>brick.inverted</Eyebrow>
              <p className="mt-2 text-[13px] font-medium">
                Ink background, cream text. Used for Key Takeaway card.
              </p>
            </Brick>
            <Brick fill="mint" className="p-5">
              <Eyebrow>brick.pastel · mint</Eyebrow>
              <p className="mt-2 text-[13px] font-medium">
                Any pastel token works. 1 pastel per card.
              </p>
            </Brick>
          </div>
        </Section>

        <Section title="Buttons">
          <Brick className="p-6 flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="primary">
              <Sparkles size={14} strokeWidth={2.5} />
              Primary
            </Button>
            <Button variant="accent">Accent</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
            <Button>
              Open
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </Button>
          </Brick>
        </Section>

        <Section title="Tabs">
          <Brick className="p-6 flex flex-wrap items-center gap-2">
            <Tab active>Feed</Tab>
            <Tab>Saved</Tab>
            <Tab>Drafts</Tab>
            <Tab>Trending</Tab>
          </Brick>
        </Section>

        <Section title="Chips">
          <Brick className="p-6 flex flex-wrap items-center gap-2">
            <Chip>default</Chip>
            {PASTELS.map((p) => (
              <Chip key={p} fill={p}>
                {p}
              </Chip>
            ))}
          </Brick>
        </Section>

        <Section title="Stickers · signal states">
          <Brick className="p-6 flex flex-wrap items-center gap-3">
            {SIGNALS.map((s) => (
              <Sticker key={s} kind={s} />
            ))}
          </Brick>
        </Section>

        <Section title="Keyboard keys">
          <Brick className="p-6 flex flex-wrap items-center gap-2">
            <Kbd>⌘K</Kbd>
            <Kbd>esc</Kbd>
            <Kbd>[</Kbd>
            <Kbd>]</Kbd>
            <Kbd>J</Kbd>
            <Kbd>K</Kbd>
            <Kbd>⏎</Kbd>
          </Brick>
        </Section>

        <Section title="Avatars">
          <Brick className="p-6 flex flex-wrap items-center gap-4">
            <Avatar initial="A" />
            <Avatar initial="S" fill="peach" />
            <Avatar initial="M" fill="mint" size={48} />
            <Avatar initial="K" fill="sky" size={56} />
          </Brick>
        </Section>

        <Section title="Shadows">
          <div className="grid grid-cols-3 gap-4">
            {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
              <div
                key={s}
                className="p-5"
                style={{
                  background: "#ffffff",
                  border: "var(--bw-3) solid var(--ink)",
                  borderRadius: "var(--r-lg)",
                  boxShadow: `var(--sh-${s})`,
                }}
              >
                <Eyebrow>sh-{s}</Eyebrow>
                <p className="mt-2 font-mono text-[11px]" style={{ color: "var(--muted)" }}>
                  box-shadow: var(--sh-{s})
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Motion keyframes">
          <Brick className="p-6">
            <div className="flex flex-wrap gap-4">
              {(["popUp", "slideInLeft", "slideInRight", "stampIn", "shadowPulse"] as const).map(
                (kf, i) => (
                  <div
                    key={kf}
                    className="p-4"
                    style={{
                      background: "#ffffff",
                      border: "var(--bw-3) solid var(--ink)",
                      borderRadius: "var(--r-md)",
                      boxShadow: "var(--sh-sm)",
                      animation: `${kf} var(--d-reveal) var(--ease-spring) both`,
                      animationDelay: `${i * 120}ms`,
                      minWidth: 180,
                    }}
                  >
                    <Eyebrow>{kf}</Eyebrow>
                    <p
                      className="mt-1 font-mono text-[11px]"
                      style={{ color: "var(--muted)" }}
                    >
                      reload page to replay
                    </p>
                  </div>
                )
              )}
            </div>
          </Brick>
        </Section>

        <Section title="Example composition">
          <Brick className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Eyebrow>AI · Infrastructure</Eyebrow>
              <Sticker kind="hot" />
            </div>
            <h3
              className="font-display font-bold leading-[1.15] mb-2"
              style={{ fontSize: 26, letterSpacing: "-0.015em" }}
            >
              The model isn&rsquo;t the moat anymore
            </h3>
            <p
              className="text-[14px] leading-[1.55] font-medium mb-4"
              style={{ color: "var(--ink-2)", maxWidth: "62ch" }}
            >
              Everything on this card is a primitive. Brick, Eyebrow,
              Sticker, Chip, Button.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Chip fill="peach">stratechery</Chip>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--muted)",
                    letterSpacing: "0.08em",
                  }}
                >
                  2H AGO
                </span>
              </div>
              <div className="flex gap-2">
                <Button>
                  <Bookmark size={13} strokeWidth={2.5} />
                  Save
                </Button>
                <Button variant="primary">
                  <Flame size={13} strokeWidth={2.5} />
                  Draft it
                </Button>
              </div>
            </div>
          </Brick>
        </Section>

        <p
          className="mt-16 mb-10 text-center font-mono"
          style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.12em" }}
        >
          END · SIGNAL UI v0.1
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="mb-4 flex items-baseline justify-between">
        <h2
          className="font-display font-bold"
          style={{ fontSize: 24, letterSpacing: "-0.015em" }}
        >
          {title}
        </h2>
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            fontWeight: 700,
            color: "var(--muted)",
            textTransform: "uppercase",
          }}
        >
          {title.split(" · ")[0]}
        </span>
      </div>
      {children}
    </section>
  );
}

function Swatch({ fill, name }: { fill: Fill; name: string }) {
  return (
    <div
      className="p-4"
      style={{
        background: FILL_VAR[fill],
        border: "var(--bw-3) solid var(--ink)",
        borderRadius: "var(--r-lg)",
        boxShadow: "var(--sh-sm)",
      }}
    >
      <Eyebrow style={{ color: "var(--ink)" }}>{name}</Eyebrow>
      <p
        className="font-mono mt-1"
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--ink-2)",
          letterSpacing: "0.06em",
        }}
      >
        var(--{fill})
      </p>
    </div>
  );
}

function InkSwatch() {
  return (
    <div
      className="p-4"
      style={{
        background: "var(--ink)",
        color: "var(--bg)",
        border: "var(--bw-3) solid var(--ink)",
        borderRadius: "var(--r-lg)",
        boxShadow: "var(--sh-sm)",
      }}
    >
      <span className="label-eyebrow" style={{ color: "var(--lemon)" }}>ink</span>
      <p
        className="font-mono mt-1"
        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}
      >
        var(--ink)
      </p>
    </div>
  );
}

function SemanticSwatches() {
  const rows: { name: string; token: string; color: string }[] = [
    { name: "hot", token: "--hot", color: "var(--hot)" },
    { name: "rise", token: "--rise", color: "var(--rise)" },
    { name: "cool", token: "--cool", color: "var(--cool)" },
  ];
  return (
    <div className="grid grid-cols-1 gap-2">
      {rows.map((r) => (
        <div
          key={r.name}
          className="flex items-center gap-3 p-2"
          style={{
            background: "#ffffff",
            border: "var(--bw-2) solid var(--ink)",
            borderRadius: "var(--r-md)",
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              background: r.color,
              border: "var(--bw-2) solid var(--ink)",
              borderRadius: "var(--r-sm)",
              display: "inline-block",
            }}
          />
          <span
            className="font-mono"
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}
          >
            {r.token}
          </span>
        </div>
      ))}
    </div>
  );
}

function TypeSample({
  label,
  children,
  className,
  style,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div>
      <div
        className={className}
        style={style}
      >
        {children}
      </div>
      <Eyebrow className="block mt-2">{label}</Eyebrow>
    </div>
  );
}
