import type { SupabaseClient } from "@supabase/supabase-js";
import { fail, fromPostgrest, ok, type DbResult } from "./profiles";

/*
 * Outbound URL settings (app_settings). Public read; admin-only write (RLS).
 * This layer checks the basic shape (https, no query/fragment, length) like the DB CHECK.
 * The allowed-host list is applied by src/lib/outbound.ts (LOGIC-OUTBOUND-URL) before saving
 * and before opening a link.
 */

export const SETTING_KEYS = ["flight_outbound_url", "hotel_outbound_url"] as const;
export type SettingKey = (typeof SETTING_KEYS)[number];

export type OutboundSettings = Partial<Record<SettingKey, string>>;

export function isWellFormedOutboundUrl(value: string): boolean {
  if (value.length > 300) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.search === "" && url.hash === "" && url.username === "" && url.password === "";
  } catch {
    return false;
  }
}

export async function getOutboundSettings(supabase: SupabaseClient): Promise<DbResult<OutboundSettings>> {
  const { data, error } = await supabase.from("app_settings").select("key, value");
  if (error) return fromPostgrest(error);
  const settings: OutboundSettings = {};
  for (const row of (data ?? []) as { key: string; value: string }[]) {
    if ((SETTING_KEYS as readonly string[]).includes(row.key)) settings[row.key as SettingKey] = row.value;
  }
  return ok(settings);
}

/** Admin saves an outbound URL. Callers must also pass the host allowlist check first. */
export async function saveOutboundUrl(supabase: SupabaseClient, key: SettingKey, value: string): Promise<DbResult<true>> {
  const trimmed = value.trim();
  if (!SETTING_KEYS.includes(key)) return fail("invalid");
  if (!isWellFormedOutboundUrl(trimmed)) return fail("invalid", "https:// 로 시작하고 물음표(?)·# 없이 입력해 주세요.");
  const { error } = await supabase.from("app_settings").upsert({ key, value: trimmed }, { onConflict: "key" });
  if (error) return fromPostgrest(error);
  return ok(true);
}
