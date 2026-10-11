import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/*
 * Browser client: used by Client Components for queries and ALL writes, with the user's
 * session and the publishable key, so every request goes through RLS.
 * Never use a Service Role Key here (or anywhere in the app).
 */

let browserClient: SupabaseClient | undefined;

export function supabaseEnv(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }
  return { url, key };
}

/** Singleton browser client for the current tab. */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    const { url, key } = supabaseEnv();
    browserClient = createBrowserClient(url, key, {
      cookieOptions: { sameSite: "lax", path: "/" },
    });
  }
  return browserClient;
}
