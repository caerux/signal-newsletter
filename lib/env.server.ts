import "server-only";
import { z } from "zod";

/**
 * Server-only env vars. Importing this file from a client component will fail
 * at build time thanks to `server-only`.
 */
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  INGEST_SECRET: z.string().min(16).optional(),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((i) => i.path.join("."))
      .join(", ");
    throw new Error(
      `Missing or invalid server env vars: ${missing}. See .env.example.`
    );
  }
  cached = parsed.data;
  return cached;
}
