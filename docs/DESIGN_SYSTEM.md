# Signal — Design System

**System name:** Signal UI
**Direction:** Soft Neobrutalism
**Inspiration:** Gumroad, Are.na, Vercel fun-mode, zine culture
**Principle:** Every surface is a physical object. It has weight, edges, and a shadow. It reacts when you touch it.

This document is the single source of truth for visual and interaction design. If you're implementing a component and the answer isn't here, add it here first, then implement.

---

## 1. Core Principles

1. **Every container is a "brick"** — thick black border, hard drop shadow, rounded corners, solid background color. No blurs, no gradients, no translucency on content surfaces.
2. **Shadows are offset, never blurred.** The shadow defines the style's personality. Use `X Y 0 0 var(--ink)` — never a soft shadow.
3. **Color is bold, restrained.** One pastel fill + black ink + one accent. Never three pastels fighting on the same card.
4. **Motion is physical.** Springs, not eases. Things overshoot and settle. Buttons thump when pressed.
5. **Typography has two voices.** Fraunces (serif, display) for emotion. Space Grotesk (sans, UI) for clarity. JetBrains Mono for metadata. Never mix three on one element.
6. **Functional over decorative.** Every chip, every border, every color means something. If a color doesn't signal state or category, remove it.

---

## 2. Color Tokens

All tokens live as CSS custom properties in `app/globals.css`. Tailwind config reads from them.

### Light mode (default)

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#fff8ee` | Page background (warm off-white) |
| `--bg-2` | `#fff3e0` | Secondary surfaces, recessed areas |
| `--ink` | `#0e0e0e` | Text, borders, shadows — the workhorse |
| `--ink-2` | `#2a2a2a` | Secondary text |
| `--muted` | `#5a5a5a` | Tertiary text, metadata, timestamps |

### Pastel fills (surfaces, categories, emphasis)

| Token | Hex | Use for |
|---|---|---|
| `--peach` | `#ffb99a` | CTA accents, "New" badges |
| `--lemon` | `#fde871` | Active states, highlights, focus bg |
| `--mint` | `#baf7c9` | "Rising" signal, success |
| `--sky` | `#aee3ff` | Info, "Cooling" signal, shortcuts bg |
| `--lavender` | `#d6c7ff` | Insight panel header, AI-related surfaces |
| `--pink` | `#ffc2d9` | Idea numbering, playful accents |

### Semantic / signal tokens

| Token | Hex | Use for |
|---|---|---|
| `--hot` | `#ff5a5f` | "Trending" signal, destructive CTA |
| `--rise` | `#22c55e` | "Rising" signal, success states |
| `--cool` | `#5b8def` | "Cooling" signal, neutral info |

### Rules

- **Text on pastel fills must be `--ink`.** No white text on pastels ever. Pastels are chosen specifically to be AA-accessible with black text.
- **Text on `--ink` must be `--bg`.** The inverted pair.
- **Semantic colors (`--hot`, `--rise`, `--cool`) are for chips and stickers only.** Never for headlines or body text.
- **Max 1 pastel per card.** The pastel signals function (mint = rising, lemon = active). Multiple pastels on one card = visual noise.

### Dark mode (Phase 2, not MVP)

Design tokens will flip:
- `--bg` → `#1a1512` (warm deep brown-black)
- `--ink` → `#fff8ee` (cream stays warm)
- Pastels darken to ~40% saturation, still named the same

Every component must use tokens, never raw hex. This is how dark mode ships with zero component changes.

---

## 3. Typography

### Font stack

```css
--font-display: "Fraunces", Georgia, serif;
--font-ui: "Space Grotesk", system-ui, -apple-system, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```

Load via Google Fonts:
```
family=Fraunces:ital,opsz,wght@0,9..144,400..800;1,9..144,400..800
family=Space+Grotesk:wght@400;500;600;700
family=JetBrains+Mono:wght@500;700
```

### Roles

| Role | Font | Weight | When |
|---|---|---|---|
| **Display** (hero, story titles) | Fraunces | 700 | Anything > 22px that needs emotion |
| **Italic display** (emphasis) | Fraunces italic | 700 | Quoted words, emphasis within headlines |
| **UI** (body, buttons, labels) | Space Grotesk | 500 / 600 | Interface chrome, story dek, nav |
| **Mono** (metadata, code, kbd) | JetBrains Mono | 700 | Timestamps, counts, keyboard shortcuts, source names |

### Type scale

| Name | Size | Line-height | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| `display-xl` | 48px | 1.0 | 700 | -0.02em | Hero title |
| `display-lg` | 36px | 1.05 | 700 | -0.02em | Section hero |
| `display-md` | 26px | 1.15 | 700 | -0.015em | Story card title |
| `display-sm` | 22px | 1.15 | 700 | -0.015em | Insight title |
| `body-lg` | 15px | 1.55 | 500 | 0 | Story dek, primary body |
| `body` | 14px | 1.55 | 500 | 0 | Default UI body |
| `body-sm` | 13px | 1.5 | 500 | 0 | Sidebar items, captions |
| `label` | 10-11px | 1.2 | 700 | 0.18em uppercase | Eyebrows, section labels |
| `mono-sm` | 10-11px | 1.3 | 700 | 0.08em | Timestamps, counts, kbd |

### Rules

- **Never mix Fraunces and Space Grotesk in the same word.** They're two voices.
- **Italic Fraunces = emphasis only.** Do not use italic Fraunces for entire paragraphs.
- **Mono uppercase + letter-spacing is a pattern.** Used for `CATEGORIES`, `SAVED`, timestamps. It signals "metadata, not content."
- **Tabular numerals for counts.** Use `font-feature-settings: "tnum"` on count badges.

---

## 4. Spacing & Layout

### Spacing scale (Tailwind-compatible)

Base unit: **4px**. Use multiples: `1 = 4px`, `2 = 8px`, `3 = 12px`, `4 = 16px`, `5 = 20px`, `6 = 24px`, `8 = 32px`, `10 = 40px`, `12 = 48px`, `16 = 64px`.

### Layout primitives

| Region | Default | Collapsed |
|---|---|---|
| App top navbar | 68px height, sticky | — |
| Sidebar | 280px wide | 68px rail |
| Feed | flex-1 (flexible) | — |
| Insight panel | 420px wide | 60px rail |
| Layout padding | 24px all sides | — |
| Gap between regions | 24px | — |

### Grid

- Main layout: `grid-template-columns: 280px 1fr 420px` with `gap: 24px`.
- Transitions between collapsed states use `420ms var(--spring)`.
- Feed hero and stories stack vertically with `gap: 22px`.

### Responsive breakpoints (Phase 2)

MVP is desktop-only (1280px+). Responsive strategy for later:

| Breakpoint | Behavior |
|---|---|
| `< 1024px` | Insight panel auto-collapses to rail |
| `< 768px` | Sidebar auto-collapses to rail |
| `< 640px` | Sidebar and insight both become bottom drawer sheets |

---

## 5. Borders & Radii

### Border widths

| Weight | Use |
|---|---|
| `2.5px` | Primary surfaces (brick, tab, button, search) |
| `2px` | Secondary (rail icons, filter chips, stickers, kbd) |
| `1.5px` | Signal chips (sticker variant) |

### Border color

Always `var(--ink)`. Never a grey or colored border. The black line is the grammar.

### Radii

| Token | Value | Use |
|---|---|---|
| `--r-sm` | 6px | Kbd, tiny buttons |
| `--r-md` | 10px | Tabs, rail icons, small buttons |
| `--r-lg` | 14px | Brick cards, sidebar panels |
| `--r-xl` | 18px | Feature cards (rare) |
| `--r-pill` | 999px | Stickers, pills, search bar, avatar |

### Rules

- **Nested containers: inner radius = outer radius − 4px.** Prevents the "growing rings" look.
- **Borders never change color on hover.** Only shadow and transform respond to hover.
- **Dashed borders** use `2px dashed rgba(14,14,14,0.2)` — for dividers inside cards.

---

## 6. Shadow System (Signature)

The drop shadow is the identity of the style. Always offset, always sharp, always black.

### Shadow scale

| Token | Value | Use |
|---|---|---|
| `--sh-xs` | `2px 2px 0 0 var(--ink)` | Keyboard keys, small stickers |
| `--sh-sm` | `3px 3px 0 0 var(--ink)` | Buttons, small pills, rail icons |
| `--sh-md` | `4px 4px 0 0 var(--ink)` | Search bar, elevated small cards |
| `--sh-lg` | `5px 5px 0 0 var(--ink)` | Brick cards (default) |
| `--sh-xl` | `7px 7px 0 0 var(--ink)` | Hover state for cards |
| `--sh-2xl` | `10px 10px 0 0 var(--ink)` | Shadow pulse peak |

### Rules

- **Shadows always offset down-right.** `+X, +Y`. Never up or left.
- **On hover, shadow grows AND element lifts.** `transform: translate(-1px, -1px)` + shadow + 2px each axis.
- **On active/press, shadow shrinks and element sinks.** `transform: translate(1px, 1px)` + shadow − 2px each axis.
- **Never soften the shadow.** No blur radius. Not `5px 5px 10px 0` — always `5px 5px 0 0`.

---

## 7. Motion System

### Easing curves

```css
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Overshoots ~8%, then settles */
--ease-swift:  cubic-bezier(0.22, 1, 0.36, 1);     /* Fast out, gentle in */
--ease-linear: linear;                              /* For non-UX like shadow pulse */
```

### Duration scale

| Token | Value | Use |
|---|---|---|
| `--d-instant` | 80ms | Hover feedback, color flips |
| `--d-fast` | 140ms | Small transforms, color transitions |
| `--d-base` | 260ms | Standard transitions |
| `--d-slow` | 420ms | Layout shifts, panel collapse |
| `--d-reveal` | 520ms | Stamp-in animations with stagger |
| `--d-showcase` | 600ms | Shadow pulse, emphasis |

### Keyframe library

These live in `app/globals.css` and are reusable.

- **`stampIn`** — Rail items, toast notifications, any small element entering. Starts at `translateY(-14px) scale(0.65) rotate(-8deg)`, overshoots to `scale(1.08)`, settles.
- **`slideInLeft` / `slideInRight`** — Panel contents entering from their side of the layout.
- **`popUp`** — Cards entering on page load.
- **`buttonThump`** — Click feedback. Scale down + rotate + scale up + settle.
- **`shadowPulse`** — Post-settle emphasis. Shadow grows `5 → 10 → 5` over 600ms.
- **`wobble`** — Attention-grabber, ±1.2deg rotation. Use sparingly (error toast, drag-rejected).
- **`chevronFlip`** — 180° rotation with scale dip. For toggle buttons.

### Stagger rules

When multiple items enter together:

- **Stagger gap: 50-90ms** between items
- **Max stagger chain: 6 items.** Beyond that, the last item feels broken.
- **First item delay: 40-80ms.** Gives the user time to see where to look.

### Accessibility

**Every animation-heavy stylesheet MUST include:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Users with vestibular disorders disable motion. Non-negotiable.

---

## 8. Component Inventory

The design system is a **closed set** of primitives. New components must be composed from these.

### 8.1 Brick (the foundational container)

```
border: 2.5px solid --ink
border-radius: 14px (--r-lg)
background: white (or pastel token)
box-shadow: 5px 5px 0 0 --ink (--sh-lg)
padding: 18-24px
```

**Variants:**
- `brick.solid` — white background, default
- `brick.pastel` — any pastel token as background
- `brick.inverted` — `--ink` bg, `--bg` text (for Key Takeaway card)
- `brick.flat` — no shadow (for disabled or background elements)

### 8.2 Button

```
padding: 8-14px horizontal, 8-10px vertical
border: 2.5px solid --ink
border-radius: 10px (or 999px for pill)
box-shadow: 3px 3px 0 0 --ink
font: Space Grotesk 600, 13px
transition: transform + shadow on hover
```

**Variants:**
- `btn.primary` — `--peach` bg, ink text — primary CTA
- `btn.accent` — `--hot` bg, white text — destructive or strong emphasis
- `btn.ghost` — transparent bg, no shadow, just border
- `btn.icon` — 32×32px square, centered glyph
- `btn.tab` — white bg, active state = ink bg + bg text

**States:**
- `:hover` — translate(-1px, -1px), shadow +2px
- `:active` — translate(1px, 1px), shadow -2px
- `:focus-visible` — 2px offset outline in `--hot`
- `:disabled` — 50% opacity, no shadow, cursor not-allowed

### 8.3 Chip / Sticker

Two related but distinct primitives.

**`chip` — simple metadata label**
- 4px × 10px padding, pill shape
- 2px border, no shadow
- Used for: categories, tags, filters

**`sticker` — signal / status label**
- 4px × 10px padding, pill shape
- 2px border, 2px shadow
- **Rotated -1.2deg** for playful tilt
- Used for: Trending, Rising, Cooling, status badges

Sticker color map:
- `sticker.hot` → `--hot` bg, white text, fire emoji prefix
- `sticker.rise` → `--mint` bg, ink text, chart emoji prefix
- `sticker.cool` → `--sky` bg, ink text, ice emoji prefix

### 8.4 Keyboard key (`.kbd`)

```
padding: 2-3px × 7-9px
border: 2px solid --ink
border-radius: 6-7px
box-shadow: 2px 2px 0 0 --ink
background: --bg-2
font: JetBrains Mono 700, 10-11px
```

Used inline for shortcut hints (`<kbd>⌘K</kbd>`).

### 8.5 Input / Search

The search bar is the hero input. Other inputs inherit:

```
pill shape (border-radius: 999px)
padding: 10px 16px
border: 2.5px
shadow: 4px 4px
on :focus-within — lift, shadow grows, background flips to --lemon
```

Inline elements allowed inside search:
- Icon square (left)
- Filter chip group (with dashed divider)
- Text input (flex)
- Kbd (right)

### 8.6 Avatar

```
width/height: 34-40px
border-radius: 50%
border: 2.5px
shadow: 3px 3px
background: --lavender (default)
font: Space Grotesk 700, 14-16px
letter: first initial, uppercase
```

Users without avatars get a deterministically-colored pastel bg based on name hash.

### 8.7 Story card

The atomic unit of the feed.

```
brick.solid
padding: 22px 24px
flex column, gap 14px
hover: translate(-2px, -2px), shadow grows to 7px
```

Structure:
1. Head row: source avatar + name + timestamp, sticker (right)
2. Title (Fraunces 700, 26px)
3. Dek (Space Grotesk, 14.5px, muted)
4. Foot row: tag chips (left), icon action buttons (right), dashed-top-border separator

### 8.8 Nav tab

Button variant with grouped active state.

```
padding: 8px 14px
border: 2.5px
border-radius: 10px
bg: white
active: bg --ink, text --bg, no shadow shift
```

Only **one tab active per group.** Enforced via state logic, not style.

### 8.9 Sidebar category item

```
padding: 10px 12px
border-radius: 10px
flex justify-between
font: Space Grotesk 500, 14px
active state: --lemon bg, 2px border, 3px shadow, weight 700
hover (non-active): --bg-2 bg
trailing count: JetBrains Mono 700, 11px, --muted
```

### 8.10 Rail icon (collapsed sidebar)

```
40×40px square
border: 2px
border-radius: 10px
font: JetBrains Mono 700, 12px
letter pair (Ai, St, Dv, Pr, Dn) or symbol (◇, ◈)
count badge: absolute top-right, --peach bg, 2px border
hover: tilt -2deg, --lemon bg, shadow appears
active: --lemon bg, shadow
```

### 8.11 Insight block types

- `block.summary` — white bg, bulleted list with square markers
- `block.why` — `--mint` bg, Fraunces italic pull quote
- `block.takeaway` — `--ink` bg, `--peach` label, white body
- `block.ideas` — white bg, grid of idea items
- `idea` — 2px border, pink numbered square + title + arrow

---

## 9. Iconography

**Primary approach:** Unicode glyphs and text characters. Aligns with neobrutalist "hand-drawn zine" feel.

- Navigation/chevrons: `« » ↗ ↘ ← → ↑ ↓`
- Status: `◇ ◈ ● ○ ▸ ▾`
- Actions: `🔖 ✍️ 💡 ✨ 🔔 ◐` (emoji allowed for action icons — they fit the playful tone)
- Signals: `🔥 📈 🧊`

**When custom icons are needed** (Phase 2+):
- Use [Phosphor Icons](https://phosphoricons.com/) "Bold" weight
- Size: 16px, 20px, 24px
- Always black `--ink`, never colored

---

## 10. Accessibility

### Contrast (WCAG AA minimum)

- Body text on `--bg`: `--ink` (21:1) ✓
- Body text on any pastel: must be `--ink` (manually verified 4.5:1 minimum on each pastel) ✓
- Interactive text on `--ink`: `--bg` cream, not pure white, for warmth (still 18:1) ✓

### Focus states

Every interactive element must have a visible focus state:

```css
:focus-visible {
  outline: 2px solid var(--hot);
  outline-offset: 3px;
  border-radius: inherit;
}
```

### Keyboard

- All primary actions must be reachable via keyboard
- Global shortcuts: `⌘K` (search), `[` (collapse sidebar), `]` (collapse insight), `J/K` (navigate feed), `S` (save), `E` (expand story), `D` (draft)
- No shortcut should require modifier keys other than `⌘/Ctrl`

### Screen readers

- All icon-only buttons have `aria-label`
- Stickers/chips use `role="status"` when indicating signal
- Layout regions use semantic elements: `<header>`, `<nav>`, `<main>`, `<aside>`

### Motion

- `prefers-reduced-motion: reduce` globally drops all animation and transition durations to 0.01ms

---

## 11. Do's and Don'ts

### DO

- Use tokens for every color, space, radius, shadow
- Combine max 2 pastel fills per view
- Animate entries with spring easing
- Give every interactive surface a hover-lift + shadow-grow
- Pair Fraunces with Space Grotesk — never replace with another sans
- Let the shadow define the style

### DON'T

- ❌ Use soft blurred shadows (`0 4px 12px rgba(0,0,0,0.1)`)
- ❌ Use gradients on content surfaces
- ❌ Use frosted glass / backdrop-blur
- ❌ Use pastel text on pastel background
- ❌ Use three pastels in one component
- ❌ Animate opacity-only fades for big layout moves
- ❌ Build a new component without adding it to Section 8 first

---

## 12. Implementation Checklist

When building a new component in the Next.js app, verify:

- [ ] All colors use CSS variables, not raw hex
- [ ] All spacing uses Tailwind scale (multiples of 4px)
- [ ] Border is 2.5px or 2px (never 1px)
- [ ] Shadow is offset-only, no blur
- [ ] Radii match the scale (6 / 10 / 14 / 18 / 999)
- [ ] Hover + focus-visible + active states defined
- [ ] Uses one of the three font families, appropriate role
- [ ] Motion uses `--ease-spring` or `--ease-swift` from tokens
- [ ] Reduced-motion media query respected
- [ ] Keyboard accessible with visible focus ring
- [ ] Dark mode considered (even if not yet implemented — use tokens)

---

## 13. Reference Implementation

The live mockup is at [`design-explorer/04-soft-neobrutalism.html`](../design-explorer/04-soft-neobrutalism.html). It contains:

- Full navbar with collapsible search
- Two-rail layout (sidebar + insight)
- Three story card examples
- Full insight panel with all block types
- All animations (stampIn, slideIn, buttonThump, shadowPulse, chevronFlip)
- Keyboard shortcuts (`[`, `]` toggle panels)
- localStorage persistence of layout state

Treat this HTML as the pixel-exact target. When porting to React components, match the visual fidelity 1:1, then extract into tokens.

---

## 14. Versioning

This document is v0.1. Changes follow SemVer:

- **Patch (0.1.x)** — Typo, clarification, added example
- **Minor (0.x.0)** — New token added, new component spec, non-breaking
- **Major (x.0.0)** — Token renamed, component spec changed breaking, color system overhaul

Every PR that touches tokens or visual rules must bump the version here and document the change in `docs/CHANGELOG.md` (TBD).
