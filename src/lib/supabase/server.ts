import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/*
 * Server client for Server Components: READ ONLY (session and role checks, public reads).
 * Writes happen in Client Components through the browser client under RLS; there are no
 * Route Handlers or Server Actions. Cookie refresh is done by src/proxy.ts, so setAll here
 * is a no-op (Server Components cannot set cookies).
 *
 * Note (Cache Components): reading cookies makes the caller dynamic; wrap such UI in <Suspense>.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookieOptions: { sameSite: "lax", path: "/" },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Read-only: session cookies are refreshed in src/proxy.ts.
      },
    },
  });
}
