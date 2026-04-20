/**
 * Bridge between TypeScript and the CSS custom properties defined in
 * app/globals.css. Keep these in sync with docs/DESIGN_SYSTEM.md.
 */

export type Fill =
  | "white"
  | "bg"
  | "bg-2"
  | "peach"
  | "lemon"
  | "mint"
  | "sky"
  | "lavender"
  | "pink";

export const FILL_VAR: Record<Fill, string> = {
  white: "#ffffff",
  bg: "var(--bg)",
  "bg-2": "var(--bg-2)",
  peach: "var(--peach)",
  lemon: "var(--lemon)",
  mint: "var(--mint)",
  sky: "var(--sky)",
  lavender: "var(--lavender)",
  pink: "var(--pink)",
};

export type Signal = "hot" | "rise" | "cool";

export const SIGNAL_LABEL: Record<Signal, string> = {
  hot: "\uD83D\uDD25 trending",
  rise: "\u2197 rising",
  cool: "\u2744 cooling",
};
