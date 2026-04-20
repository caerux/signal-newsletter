/**
 * Normalize a URL for deduplication.
 *
 * - lowercase hostname, strip `www.` prefix
 * - strip hash fragment
 * - strip known tracking query params (utm_*, fbclid, gclid, ref, source, …)
 * - remove trailing slashes on the path (except root)
 * - force https protocol
 *
 * Returns `null` if the input cannot be parsed.
 */
const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_name",
  "utm_id",
  "fbclid",
  "gclid",
  "dclid",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
  "source",
  "igshid",
  "spm",
]);

export function canonicalizeUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw.trim());
    u.hash = "";
    for (const key of Array.from(u.searchParams.keys())) {
      if (TRACKING_PARAMS.has(key.toLowerCase())) {
        u.searchParams.delete(key);
      }
    }
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    u.hostname = host;
    u.pathname = u.pathname.replace(/\/+$/, "") || "/";
    u.protocol = "https:";
    return u.toString();
  } catch {
    return null;
  }
}
