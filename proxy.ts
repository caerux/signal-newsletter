import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 renamed the `middleware` file convention to `proxy`.
// The helper name stays `middleware` inside lib/supabase/ to match
// Supabase's own SSR docs, so only the entrypoint is renamed.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every request except:
     * - Next internals (_next/static, _next/image)
     * - favicon
     * - static image files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
