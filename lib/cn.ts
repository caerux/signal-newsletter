/**
 * Tiny, dependency-free className joiner.
 * Filters out falsy values and joins the rest with a space.
 */
export function cn(
  ...parts: Array<string | number | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
