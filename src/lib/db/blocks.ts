import type { SupabaseClient } from "@supabase/supabase-js";
import { currentUserId, fail, fromPostgrest, ok, type DbResult } from "./profiles";

/*
 * User blocks. Once blocked, both users stop seeing each other's posts, profiles and requests
 * (RLS via private.is_blocked). Because profiles are hidden too, the block list cannot show the
 * other user's nickname — the UI shows the block date and an unblock button.
 */

export type MyBlock = { blocked_id: string; created_at: string };

export async function blockUser(supabase: SupabaseClient, userId: string): Promise<DbResult<true>> {
  const me = await currentUserId(supabase);
  if (!me) return fail("not_signed_in");
  if (me === userId) return fail("invalid", "자기 자신은 차단할 수 없어요.");
  const { error } = await supabase.from("user_blocks").insert({ blocker_id: me, blocked_id: userId });
  if (error) {
    // Already blocked counts as success for the UI.
    if (error.code === "23505") return ok(true);
    return fromPostgrest(error);
  }
  return ok(true);
}

export async function unblockUser(supabase: SupabaseClient, userId: string): Promise<DbResult<true>> {
  const me = await currentUserId(supabase);
  if (!me) return fail("not_signed_in");
  const { error } = await supabase.from("user_blocks").delete().eq("blocker_id", me).eq("blocked_id", userId);
  if (error) return fromPostgrest(error);
  return ok(true);
}

export async function listMyBlocks(supabase: SupabaseClient): Promise<DbResult<MyBlock[]>> {
  const me = await currentUserId(supabase);
  if (!me) return fail("not_signed_in");
  const { data, error } = await supabase
    .from("user_blocks")
    .select("blocked_id, created_at")
    .eq("blocker_id", me)
    .order("created_at", { ascending: false });
  if (error) return fromPostgrest(error);
  return ok((data ?? []) as MyBlock[]);
}
