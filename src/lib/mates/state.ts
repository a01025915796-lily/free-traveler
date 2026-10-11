/*
 * Mate post / application state rules (pure functions, no I/O).
 * The UI uses these to decide what to show; RLS in supabase/migrations/0002_rls.sql is the
 * final authority on who may change what. Closing by end date is computed at read time
 * in Asia/Seoul (no cron job, REQ-FUNC-037).
 */

export type PostStatus = "OPEN" | "CLOSED" | "DELETED";
export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

/** YYYY-MM-DD */
export type DateString = string;

const SEOUL_TZ = "Asia/Seoul";

/** Today's date in Asia/Seoul as YYYY-MM-DD. `now` is injectable for tests. */
export function todayInSeoul(now: Date = new Date()): DateString {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: SEOUL_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** A post whose end date is before today (Asia/Seoul) is over. The end date itself is still open. */
export function isEnded(endDate: DateString, now: Date = new Date()): boolean {
  return endDate < todayInSeoul(now);
}

/**
 * Status shown to users. A stored OPEN post becomes CLOSED once its end date has passed;
 * CLOSED and DELETED are returned as stored.
 */
export function effectivePostStatus(post: { status: PostStatus; end_date: DateString }, now: Date = new Date()): PostStatus {
  if (post.status === "OPEN" && isEnded(post.end_date, now)) return "CLOSED";
  return post.status;
}

/** Shown in the "recruiting" list and accepts applications. */
export function isRecruiting(post: { status: PostStatus; end_date: DateString }, now: Date = new Date()): boolean {
  return effectivePostStatus(post, now) === "OPEN";
}

/** A new post can be created as OPEN only when dates are ordered and the end date is not in the past. */
export function canCreateOpenPost(startDate: DateString, endDate: DateString, now: Date = new Date()): boolean {
  return startDate <= endDate && !isEnded(endDate, now);
}

/** Allowed author transitions: OPEN -> CLOSED / DELETED, CLOSED -> DELETED. DELETED is final. */
const POST_TRANSITIONS: Record<PostStatus, readonly PostStatus[]> = {
  OPEN: ["CLOSED", "DELETED"],
  CLOSED: ["DELETED"],
  DELETED: [],
};

export function canTransitionPost(from: PostStatus, to: PostStatus): boolean {
  return POST_TRANSITIONS[from].includes(to);
}

/** Only the post owner decides: PENDING -> ACCEPTED / REJECTED. No cancellation (WITHDRAWN). */
const APPLICATION_TRANSITIONS: Record<ApplicationStatus, readonly ApplicationStatus[]> = {
  PENDING: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
};

export function canTransitionApplication(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return APPLICATION_TRANSITIONS[from].includes(to);
}

/** Active requests block a duplicate request on the same post (mirrors the partial unique index). */
export function isActiveApplication(status: ApplicationStatus): boolean {
  return status === "PENDING" || status === "ACCEPTED";
}

export function hasActiveApplication(
  applications: readonly { post_id: string; applicant_id: string; status: ApplicationStatus }[],
  postId: string,
  applicantId: string,
): boolean {
  return applications.some((a) => a.post_id === postId && a.applicant_id === applicantId && isActiveApplication(a.status));
}

/**
 * Editing dates of a post that already has accepted participants needs an in-page confirmation
 * modal ("승인된 참가자에게 일정 변경을 알려 주세요").
 */
export function needsDateChangeWarning(
  original: { start_date: DateString; end_date: DateString },
  next: { start_date: DateString; end_date: DateString },
  acceptedCount: number,
): boolean {
  const changed = original.start_date !== next.start_date || original.end_date !== next.end_date;
  return changed && acceptedCount > 0;
}

/** Korean status labels for badges (text is always shown with the color). */
export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  OPEN: "모집중",
  CLOSED: "마감",
  DELETED: "삭제됨",
};

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: "대기 중",
  ACCEPTED: "승인됨",
  REJECTED: "거절됨",
};
