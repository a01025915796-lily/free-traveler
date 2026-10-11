import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApplicationStatus } from "@/lib/mates/state";
import { currentUserId, fail, fromPostgrest, ok, type AgeBand, type DbResult } from "./profiles";

/*
 * Join requests. Only the applicant and the post owner can read them (RLS). Only the post
 * owner changes PENDING to ACCEPTED/REJECTED. Results are shown with Toast and status badges
 * on the account activity tab — no e-mail.
 */

export const MAX_MESSAGE_LENGTH = 500;

export type SentApplication = {
  id: string;
  post_id: string;
  status: ApplicationStatus;
  created_at: string;
  post: { id: string; title: string } | null;
};

export type ReceivedApplication = {
  id: string;
  post_id: string;
  applicant_id: string;
  message: string;
  status: ApplicationStatus;
  created_at: string;
  applicant: { nickname: string; age_band: AgeBand } | null;
  post: { id: string; title: string } | null;
};

/** Sends a request (PENDING). A second active request on the same post returns "duplicate". */
export async function createApplication(supabase: SupabaseClient, postId: string, message: string): Promise<DbResult<{ id: string }>> {
  const applicantId = await currentUserId(supabase);
  if (!applicantId) return fail("not_signed_in");
  const text = message.trim();
  if (text.length < 1 || text.length > MAX_MESSAGE_LENGTH) return fail("invalid", `메시지는 1~${MAX_MESSAGE_LENGTH}자로 입력해 주세요.`);

  const { data, error } = await supabase
    .from("mate_applications")
    .insert({ post_id: postId, applicant_id: applicantId, message: text })
    .select("id")
    .single();
  if (error) {
    if (error.code === "42501") return fail("forbidden", "모집 중인 글에만 요청할 수 있어요. 성인 확인과 프로필도 확인해 주세요.");
    return fromPostgrest(error, "이미 이 글에 참가를 요청했어요. 내 활동에서 진행 상태를 확인해 주세요.");
  }
  return ok({ id: data.id as string });
}

/** The signed-in user's active request on a post, if any (to show "이미 요청함" badges). */
export async function getMyApplicationForPost(
  supabase: SupabaseClient,
  postId: string,
): Promise<DbResult<{ id: string; status: ApplicationStatus } | null>> {
  const userId = await currentUserId(supabase);
  if (!userId) return ok(null);
  const { data, error } = await supabase
    .from("mate_applications")
    .select("id, status")
    .eq("post_id", postId)
    .eq("applicant_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return fromPostgrest(error);
  return ok((data as { id: string; status: ApplicationStatus } | null) ?? null);
}

export async function listSentApplications(supabase: SupabaseClient): Promise<DbResult<SentApplication[]>> {
  const userId = await currentUserId(supabase);
  if (!userId) return fail("not_signed_in");
  const { data, error } = await supabase
    .from("mate_applications")
    .select("id, post_id, status, created_at, post:mate_posts(id, title)")
    .eq("applicant_id", userId)
    .order("created_at", { ascending: false });
  if (error) return fromPostgrest(error);
  return ok((data ?? []) as unknown as SentApplication[]);
}

/** Requests on the signed-in user's posts (RLS returns only those). */
export async function listReceivedApplications(supabase: SupabaseClient): Promise<DbResult<ReceivedApplication[]>> {
  const userId = await currentUserId(supabase);
  if (!userId) return fail("not_signed_in");
  const { data, error } = await supabase
    .from("mate_applications")
    .select(
      "id, post_id, applicant_id, message, status, created_at, applicant:profiles!mate_applications_applicant_id_fkey(nickname, age_band), post:mate_posts!inner(id, title, owner_id)",
    )
    .eq("post.owner_id", userId)
    .order("created_at", { ascending: false });
  if (error) return fromPostgrest(error);
  return ok((data ?? []) as unknown as ReceivedApplication[]);
}

/** Post owner accepts or rejects a pending request. */
export async function decideApplication(
  supabase: SupabaseClient,
  id: string,
  decision: Extract<ApplicationStatus, "ACCEPTED" | "REJECTED">,
): Promise<DbResult<true>> {
  const { error, count } = await supabase
    .from("mate_applications")
    .update({ status: decision }, { count: "exact" })
    .eq("id", id)
    .eq("status", "PENDING");
  if (error) return fromPostgrest(error);
  if (count === 0) return fail("forbidden", "이미 처리했거나 처리할 수 없는 요청이에요.");
  return ok(true);
}
