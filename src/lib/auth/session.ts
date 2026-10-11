import type { SupabaseClient } from "@supabase/supabase-js";

/*
 * Session and profile helpers shared by server (read-only) and browser code.
 * Pass the client for the current environment: getSupabaseServerClient() in Server
 * Components, getSupabaseBrowserClient() in Client Components.
 */

export type Role = "member" | "admin";

/** The signed-in user's own profile, including private fields (via rpc get_my_profile). */
export type MyProfile = {
  user_id: string;
  nickname: string;
  is_adult: boolean;
  adult_verified_at: string | null;
  age_band: string;
  gender: string | null;
  travel_styles: string[];
  bio: string | null;
  role: Role;
};

export type SessionState =
  | { status: "guest" }
  /** Signed in but no profile saved yet (must complete the profile tab before mate writes). */
  | { status: "member"; userId: string; emailConfirmed: boolean; profile: null }
  | { status: "member" | "admin"; userId: string; emailConfirmed: boolean; profile: MyProfile };

/**
 * Current session: guest, member or admin. Uses getClaims() (verified JWT) for identity and
 * reads the role from the database — role is never taken from client state.
 */
export async function getSessionState(supabase: SupabaseClient): Promise<SessionState> {
  const { data: claimsData, error } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (error || !claims?.sub) return { status: "guest" };

  const userId = claims.sub;
  const emailConfirmed = Boolean((claims as { email_verified?: boolean }).email_verified ?? claims.user_metadata?.email_verified);
  const profile = await getMyProfile(supabase);
  if (!profile) return { status: "member", userId, emailConfirmed, profile: null };
  return { status: profile.role === "admin" ? "admin" : "member", userId, emailConfirmed, profile };
}

export async function getMyProfile(supabase: SupabaseClient): Promise<MyProfile | null> {
  const { data, error } = await supabase.rpc("get_my_profile");
  if (error || !Array.isArray(data) || data.length === 0) return null;
  return data[0] as MyProfile;
}

/** Mate writes (posts, applications) require a profile with the adult check done. */
export function canWriteMates(state: SessionState): boolean {
  return state.status !== "guest" && state.profile !== null && state.profile.is_adult;
}

/**
 * Safe post-login redirect target. Only same-site absolute paths are allowed:
 * must start with a single "/", no "//" or "/\" (protocol-relative), no scheme, no control chars.
 * Anything else falls back to the given default.
 */
export function safeNextPath(next: string | null | undefined, fallback = "/account?tab=activity"): string {
  if (!next) return fallback;
  let value: string;
  try {
    value = decodeURIComponent(next);
  } catch {
    return fallback;
  }
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(value) || /^\/[a-z][a-z0-9+.-]*:/i.test(value)) return fallback;
  return value;
}

/** Login page URL that returns to `path` afterwards (used for guest write attempts). */
export function loginHref(path: string): string {
  return `/account?tab=login&next=${encodeURIComponent(safeNextPath(path, "/"))}`;
}
