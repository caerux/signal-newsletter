import { z } from "zod";

/**
 * Public env vars — safe to read from both server and client.
 * `NEXT_PUBLIC_*` values are inlined into the client bundle by Next at build time.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

type PublicEnv = z.infer<typeof publicEnvSchema>;

let cached: PublicEnv | null = null;

/**
 * Lazy-validating accessor so that importing this module never crashes at
 * build time (e.g. when Vercel prerenders pages before env vars are wired).
 * Call sites that actually depend on Supabase will hit this function at
 * request time and get a clear error if env is misconfigured.
 */
export function getPublicEnv(): PublicEnv {
  if (cached) return cached;
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((i) => i.path.join("."))
      .join(", ");
    throw new Error(
      `Missing or invalid public env vars: ${missing}. Copy .env.example to .env.local and fill in the values.`
    );
  }
  cached = parsed.data;
  return cached;
}
