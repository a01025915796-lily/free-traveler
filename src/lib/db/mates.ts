import type { SupabaseClient } from "@supabase/supabase-js";
import { POLICY_VERSION } from "@/data/policies";
import { canCreateOpenPost, todayInSeoul, type PostStatus } from "@/lib/mates/state";
import {
  currentUserId,
  fail,
  fromPostgrest,
  ok,
  PUBLIC_PROFILE_COLUMNS,
  validateStyleTags,
  type AgeBand,
  type DbResult,
  type Gender,
  type PublicProfile,
} from "./profiles";

/*
 * Mate posts. Blocked authors are already removed by RLS. "Recruiting" means status OPEN and
 * end_date >= today in Asia/Seoul — closing by end date is computed at read time (no cron).
 */

const POST_COLUMNS =
  "id, owner_id, country_code, region_slug, start_date, end_date, capacity, preferences, travel_styles, title, description, status, created_at, updated_at";

export type MatePost = {
  id: string;
  owner_id: string;
  country_code: string;
  region_slug: string;
  start_date: string;
  end_date: string;
  capacity: number;
  preferences: string | null;
  travel_styles: string[];
  title: string;
  description: string;
  status: PostStatus;
  created_at: string;
  updated_at: string;
};

export type MatePostWithOwner = MatePost & { owner: PublicProfile | null };

export type MatePostFilter = {
  country?: string;
  region?: string;
  /** Overlap: posts whose dates touch [from, to] by at least one day. */
  from?: string;
  to?: string;
  ageBand?: AgeBand;
  gender?: Gender;
  styles?: string[];
  /** "open" (default): recruiting only. "all": also closed (never deleted). */
  status?: "open" | "all";
};

export type MatePostPage = { posts: MatePostWithOwner[]; total: number };

export type MatePostInput = {
  country_code: string;
  region_slug: string;
  start_date: string;
  end_date: string;
  capacity: number;
  preferences: string | null;
  travel_styles: string[];
  title: string;
  description: string;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateMatePostInput(input: MatePostInput, now: Date = new Date()): string | null {
  if (!/^[A-Z]{2}$/.test(input.country_code)) return "국가를 선택해 주세요.";
  if (!/^[a-z0-9-]{1,40}$/.test(input.region_slug)) return "지역을 선택해 주세요.";
  if (!DATE_RE.test(input.start_date) || !DATE_RE.test(input.end_date)) return "여행 기간을 입력해 주세요.";
  if (input.start_date > input.end_date) return "종료일은 시작일과 같거나 뒤여야 해요.";
  if (!canCreateOpenPost(input.start_date, input.end_date, now)) return "종료일이 이미 지났어요. 날짜를 다시 골라 주세요.";
  if (!Number.isInteger(input.capacity) || input.capacity < 1 || input.capacity > 10) return "모집 인원은 1~10명으로 정해 주세요.";
  const title = input.title.trim();
  if (title.length < 1 || title.length > 100) return "제목은 1~100자로 입력해 주세요.";
  const description = input.description.trim();
  if (description.length < 1 || description.length > 3000) return "상세 설명은 1~3000자로 입력해 주세요.";
  if (input.preferences !== null && input.preferences.length > 300) return "선호 조건은 300자 이내로 입력해 주세요.";
  if (!validateStyleTags(input.travel_styles)) return "여행 스타일은 최대 8개까지 고를 수 있어요.";
  return null;
}

function ownerEmbed(filtered: boolean) {
  // Embed the author's public columns only. !inner lets age/gender filters apply to the author.
  return `owner:profiles!mate_posts_owner_id_fkey${filtered ? "!inner" : ""}(${PUBLIC_PROFILE_COLUMNS})`;
}

/** List posts with filters and paging (Supabase query; RLS removes blocked authors). */
export async function listMatePosts(
  supabase: SupabaseClient,
  filter: MatePostFilter = {},
  page: { offset?: number; limit?: number } = {},
  now: Date = new Date(),
): Promise<DbResult<MatePostPage>> {
  const offset = page.offset ?? 0;
  const limit = page.limit ?? 8;
  const authorFilter = Boolean(filter.ageBand || filter.gender);

  let query = supabase
    .from("mate_posts")
    .select(`${POST_COLUMNS}, ${ownerEmbed(authorFilter)}`, { count: "exact" })
    .neq("status", "DELETED");

  if ((filter.status ?? "open") === "open") {
    query = query.eq("status", "OPEN").gte("end_date", todayInSeoul(now));
  }
  if (filter.country) query = query.eq("country_code", filter.country);
  if (filter.region) query = query.eq("region_slug", filter.region);
  if (filter.from) query = query.gte("end_date", filter.from);
  if (filter.to) query = query.lte("start_date", filter.to);
  if (filter.styles && filter.styles.length > 0) query = query.overlaps("travel_styles", filter.styles);
  if (filter.ageBand) query = query.eq("owner.age_band", filter.ageBand);
  if (filter.gender) query = query.eq("owner.gender", filter.gender);

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) return fromPostgrest(error);
  return ok({ posts: (data ?? []) as unknown as MatePostWithOwner[], total: count ?? 0 });
}

/** Most recent recruiting posts (SCR-001 recent mates section). */
export async function listRecentMatePosts(supabase: SupabaseClient, limit = 3): Promise<DbResult<MatePostWithOwner[]>> {
  const result = await listMatePosts(supabase, { status: "open" }, { limit });
  return result.ok ? ok(result.data.posts) : result;
}

/** One post for the detail panel (?post=<id>). Missing, deleted or blocked → not_found. */
export async function getMatePost(supabase: SupabaseClient, id: string): Promise<DbResult<MatePostWithOwner>> {
  const { data, error } = await supabase
    .from("mate_posts")
    .select(`${POST_COLUMNS}, ${ownerEmbed(false)}`)
    .eq("id", id)
    .neq("status", "DELETED")
    .maybeSingle();
  if (error) return fromPostgrest(error);
  if (!data) return fail("not_found", "이 글은 볼 수 없어요.");
  return ok(data as unknown as MatePostWithOwner);
}

export async function listMyMatePosts(supabase: SupabaseClient): Promise<DbResult<MatePost[]>> {
  const userId = await currentUserId(supabase);
  if (!userId) return fail("not_signed_in");
  const { data, error } = await supabase
    .from("mate_posts")
    .select(POST_COLUMNS)
    .eq("owner_id", userId)
    .neq("status", "DELETED")
    .order("created_at", { ascending: false });
  if (error) return fromPostgrest(error);
  return ok((data ?? []) as MatePost[]);
}

/** Creates an OPEN post with the safety-rules agreement time and current policy version. */
export async function createMatePost(
  supabase: SupabaseClient,
  input: MatePostInput,
  safetyAgreed: boolean,
): Promise<DbResult<{ id: string }>> {
  const userId = await currentUserId(supabase);
  if (!userId) return fail("not_signed_in");
  if (!safetyAgreed) return fail("invalid", "동행 안전수칙에 동의해 주세요.");
  const invalid = validateMatePostInput(input);
  if (invalid) return fail("invalid", invalid);

  const { data, error } = await supabase
    .from("mate_posts")
    .insert({
      owner_id: userId,
      ...trimInput(input),
      safety_agreed_at: new Date().toISOString(),
      policy_version: POLICY_VERSION,
    })
    .select("id")
    .single();
  if (error) return fromPostgrest(error);
  return ok({ id: data.id as string });
}

export async function updateMatePost(supabase: SupabaseClient, id: string, input: MatePostInput): Promise<DbResult<true>> {
  const invalid = validateMatePostInput(input);
  if (invalid) return fail("invalid", invalid);
  const { error, count } = await supabase.from("mate_posts").update(trimInput(input), { count: "exact" }).eq("id", id);
  if (error) return fromPostgrest(error);
  if (count === 0) return fail("forbidden", "이 글을 수정할 수 없어요.");
  return ok(true);
}

/** Author closes (CLOSED) or deletes (DELETED, soft delete) a post. */
export async function setMatePostStatus(
  supabase: SupabaseClient,
  id: string,
  status: Exclude<PostStatus, "OPEN">,
): Promise<DbResult<true>> {
  const { error, count } = await supabase.from("mate_posts").update({ status }, { count: "exact" }).eq("id", id);
  if (error) return fromPostgrest(error);
  if (count === 0) return fail("forbidden");
  return ok(true);
}

function trimInput(input: MatePostInput): MatePostInput {
  return {
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    preferences: input.preferences?.trim() || null,
    travel_styles: input.travel_styles.map((t) => t.trim()),
  };
}
