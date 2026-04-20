import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv } from "@/lib/env";
import { getServerEnv } from "@/lib/env.server";

/**
 * Service-role Supabase client. Bypasses RLS — use only in trusted server
 * code (ingestion worker, admin scripts, webhooks). Never surface to clients.
 */
export function createAdminClient() {
  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();

  return createSupabaseClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
