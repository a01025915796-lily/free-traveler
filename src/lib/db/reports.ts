import type { SupabaseClient } from "@supabase/supabase-js";
import { currentUserId, fail, fromPostgrest, ok, type DbResult } from "./profiles";

/*
 * Reports. Members file reports and see their own (receipt number + time). Admins list all
 * reports and change only the status; handler and time are recorded by the database.
 * No sanctions, no audit log (EXCLUDED).
 */

export const REPORT_TARGETS = ["post", "user", "application"] as const;
export type ReportTarget = (typeof REPORT_TARGETS)[number];

export const REPORT_REASONS = ["spam", "harassment", "fraud", "contact_info", "inappropriate", "other"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];
export const REPORT_REASON_LABEL: Record<ReportReason, string> = {
  spam: "광고·스팸",
  harassment: "괴롭힘·불쾌한 표현",
  fraud: "사기·금전 요구",
  contact_info: "공개 연락처 게시",
  inappropriate: "부적절한 내용",
  other: "기타",
};

export const REPORT_STATUSES = ["OPEN", "REVIEWING", "RESOLVED", "DISMISSED"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];
export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  OPEN: "접수",
  REVIEWING: "검토 중",
  RESOLVED: "처리 완료",
  DISMISSED: "기각",
};

export const MAX_REPORT_DESCRIPTION = 1000;

export type ReportReceipt = { id: string; created_at: string };

export type Report = {
  id: string;
  reporter_id: string;
  target_type: ReportTarget;
  target_id: string;
  reason_code: ReportReason;
  description: string | null;
  status: ReportStatus;
  handled_at: string | null;
  created_at: string;
};

/** Short receipt number shown to the reporter (first 8 characters of the id, upper case). */
export function receiptNumber(id: string): string {
  return id.replaceAll("-", "").slice(0, 8).toUpperCase();
}

export async function createReport(
  supabase: SupabaseClient,
  input: { target_type: ReportTarget; target_id: string; reason_code: ReportReason; description: string | null },
): Promise<DbResult<ReportReceipt>> {
  const me = await currentUserId(supabase);
  if (!me) return fail("not_signed_in");
  if (!REPORT_TARGETS.includes(input.target_type) || !REPORT_REASONS.includes(input.reason_code)) return fail("invalid", "신고 사유를 골라 주세요.");
  const description = input.description?.trim() || null;
  if (description && description.length > MAX_REPORT_DESCRIPTION) return fail("invalid", `설명은 ${MAX_REPORT_DESCRIPTION}자 이내로 입력해 주세요.`);

  const { data, error } = await supabase
    .from("reports")
    .insert({ reporter_id: me, target_type: input.target_type, target_id: input.target_id, reason_code: input.reason_code, description })
    .select("id, created_at")
    .single();
  if (error) return fromPostgrest(error);
  return ok(data as ReportReceipt);
}

export async function listMyReports(supabase: SupabaseClient): Promise<DbResult<Report[]>> {
  const me = await currentUserId(supabase);
  if (!me) return fail("not_signed_in");
  const { data, error } = await supabase
    .from("reports")
    .select("id, reporter_id, target_type, target_id, reason_code, description, status, handled_at, created_at")
    .eq("reporter_id", me)
    .order("created_at", { ascending: false });
  if (error) return fromPostgrest(error);
  return ok((data ?? []) as Report[]);
}

/** Admin report queue with an optional status filter (RLS returns all rows only to admins). */
export async function listReportsForAdmin(supabase: SupabaseClient, status?: ReportStatus): Promise<DbResult<Report[]>> {
  let query = supabase
    .from("reports")
    .select("id, reporter_id, target_type, target_id, reason_code, description, status, handled_at, created_at");
  if (status) query = query.eq("status", status);
  const { data, error } = await query.order("created_at", { ascending: true });
  if (error) return fromPostgrest(error);
  return ok((data ?? []) as Report[]);
}

export async function updateReportStatus(supabase: SupabaseClient, id: string, status: ReportStatus): Promise<DbResult<true>> {
  if (!REPORT_STATUSES.includes(status)) return fail("invalid");
  const { error, count } = await supabase.from("reports").update({ status }, { count: "exact" }).eq("id", id);
  if (error) return fromPostgrest(error);
  if (count === 0) return fail("forbidden");
  return ok(true);
}
