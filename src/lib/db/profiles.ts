import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

/*
 * Typed data access for Supabase (no ORM, no own API). Every function takes the client for
 * the current environment: the browser client for writes (RLS with the user's session) or the
 * read-only server client for reads in Server Components.
 *
 * This file also holds the result type and error mapping shared by src/lib/db/*.
 */

// Shared result helpers -----------------------------------------------------------------------

export type DbErrorCode = "duplicate" | "forbidden" | "invalid" | "not_found" | "not_signed_in" | "unknown";

export type DbResult<T> = { ok: true; data: T } | { ok: false; error: DbErrorCode; message: string };

const MESSAGES: Record<DbErrorCode, string> = {
  duplicate: "이미 처리된 요청이에요.",
  forbidden: "이 작업을 할 수 있는 권한이 없어요.",
  invalid: "입력한 내용을 다시 확인해 주세요.",
  not_found: "찾는 내용이 없거나 볼 수 없어요.",
  not_signed_in: "로그인한 뒤 이용할 수 있어요.",
  unknown: "일시적인 문제가 생겼어요. 잠시 후 다시 시도해 주세요.",
};

export function ok<T>(data: T): DbResult<T> {
  return { ok: true, data };
}

export function fail<T>(error: DbErrorCode, message?: string): DbResult<T> {
  return { ok: false, error, message: message ?? MESSAGES[error] };
}

/** Maps Postgres / PostgREST errors to UI-level codes. Never exposes raw error text to users. */
export function fromPostgrest<T>(error: PostgrestError, duplicateMessage?: string): DbResult<T> {
  if (error.code === "23505") return fail("duplicate", duplicateMessage);
  if (error.code === "42501" || error.code === "PGRST301") return fail("forbidden");
  if (error.code === "23514" || error.code === "23502" || error.code === "22P02" || error.code === "23503") return fail("invalid");
  if (error.code === "PGRST116") return fail("not_found");
  return fail("unknown");
}

export async function currentUserId(supabase: SupabaseClient): Promise<string | null> {
  const { data } = await supabase.auth.getClaims();
  return data?.claims?.sub ?? null;
}

// Profiles ------------------------------------------------------------------------------------

export const AGE_BANDS = ["20s", "30s", "40s", "50s", "60plus"] as const;
export type AgeBand = (typeof AGE_BANDS)[number];
export const AGE_BAND_LABEL: Record<AgeBand, string> = {
  "20s": "20대",
  "30s": "30대",
  "40s": "40대",
  "50s": "50대",
  "60plus": "60대 이상",
};

export const GENDERS = ["female", "male", "other"] as const;
export type Gender = (typeof GENDERS)[number];
export const GENDER_LABEL: Record<Gender, string> = { female: "여성", male: "남성", other: "기타" };

export const MAX_STYLE_TAGS = 8;
export const MAX_STYLE_TAG_LENGTH = 20;

/** Only these columns are readable for other users (no email, adult flag or role). */
export const PUBLIC_PROFILE_COLUMNS = "user_id, nickname, age_band, gender, travel_styles, bio" as const;

export type PublicProfile = {
  user_id: string;
  nickname: string;
  age_band: AgeBand;
  gender: Gender | null;
  travel_styles: string[];
  bio: string | null;
};

export type ProfileInput = {
  nickname: string;
  age_band: AgeBand;
  gender: Gender | null;
  travel_styles: string[];
  bio: string | null;
};

export function validateStyleTags(tags: readonly string[]): boolean {
  return tags.length <= MAX_STYLE_TAGS && tags.every((t) => t.trim().length >= 1 && t.trim().length <= MAX_STYLE_TAG_LENGTH);
}

export function validateProfileInput(input: ProfileInput): string | null {
  const nickname = input.nickname.trim();
  if (nickname.length < 2 || nickname.length > 20) return "닉네임은 2~20자로 입력해 주세요.";
  if (!AGE_BANDS.includes(input.age_band)) return "연령대를 선택해 주세요.";
  if (input.gender !== null && !GENDERS.includes(input.gender)) return "성별 값을 확인해 주세요.";
  if (input.travel_styles.length === 0) return "여행 스타일을 하나 이상 골라 주세요.";
  if (!validateStyleTags(input.travel_styles)) return `여행 스타일은 최대 ${MAX_STYLE_TAGS}개, 각 ${MAX_STYLE_TAG_LENGTH}자 이내로 골라 주세요.`;
  if (input.bio !== null && input.bio.length > 500) return "자기소개는 500자 이내로 입력해 주세요.";
  return null;
}

export async function getPublicProfile(supabase: SupabaseClient, userId: string): Promise<DbResult<PublicProfile>> {
  const { data, error } = await supabase.from("profiles").select(PUBLIC_PROFILE_COLUMNS).eq("user_id", userId).maybeSingle();
  if (error) return fromPostgrest(error);
  if (!data) return fail("not_found");
  return ok(data as PublicProfile);
}

/** Creates or updates the signed-in user's profile. Role and adult time are set by the database. */
export async function saveMyProfile(supabase: SupabaseClient, input: ProfileInput): Promise<DbResult<PublicProfile>> {
  const userId = await currentUserId(supabase);
  if (!userId) return fail("not_signed_in");
  const invalid = validateProfileInput(input);
  if (invalid) return fail("invalid", invalid);

  const row = {
    user_id: userId,
    nickname: input.nickname.trim(),
    age_band: input.age_band,
    gender: input.gender,
    travel_styles: input.travel_styles.map((t) => t.trim()),
    bio: input.bio?.trim() || null,
  };
  const { data, error } = await supabase
    .from("profiles")
    .upsert(row, { onConflict: "user_id" })
    .select(PUBLIC_PROFILE_COLUMNS)
    .single();
  if (error) return fromPostgrest(error, "이미 사용 중인 닉네임이에요. 다른 닉네임을 입력해 주세요.");
  return ok(data as PublicProfile);
}

/** "저는 만 19세 이상입니다" — stores only is_adult; the confirmation time is set by the database. */
export async function confirmAdult(supabase: SupabaseClient): Promise<DbResult<true>> {
  const userId = await currentUserId(supabase);
  if (!userId) return fail("not_signed_in");
  const { error, count } = await supabase.from("profiles").update({ is_adult: true }, { count: "exact" }).eq("user_id", userId);
  if (error) return fromPostgrest(error);
  if (count === 0) return fail("not_found", "프로필을 먼저 저장해 주세요.");
  return ok(true);
}
