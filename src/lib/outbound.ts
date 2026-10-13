import type { OutboundSettings, SettingKey } from "@/lib/db/settings";

/*
 * Outbound links for the flight / hotel tabs (REQ-FUNC-016/018/024/026/077).
 * Only https: URLs on allowed hosts pass, always without query or fragment, so no user input
 * (country, city, dates) can ever be attached. Links open in a new tab with noopener,noreferrer.
 */

export type OutboundKind = "flight" | "hotel";

/** Default general landing pages when no admin setting exists. */
export const DEFAULT_OUTBOUND_URL: Record<OutboundKind, string> = {
  flight: "https://www.google.com/travel/flights",
  hotel: "https://www.booking.com/",
};

export const ALLOWED_HOSTS: readonly string[] = ["www.google.com", "www.booking.com"];

export const SETTING_KEY: Record<OutboundKind, SettingKey> = {
  flight: "flight_outbound_url",
  hotel: "hotel_outbound_url",
};

export type OutboundError = "missing" | "invalid" | "not_https" | "host_not_allowed" | "has_query";

export type OutboundCheck = { ok: true; url: string } | { ok: false; error: OutboundError };

export const OUTBOUND_ERROR_MESSAGE: Record<OutboundError, string> = {
  missing: "연결할 외부 사이트 주소가 없어요.",
  invalid: "외부 사이트 주소 형식이 올바르지 않아요.",
  not_https: "외부 사이트 주소는 https:// 로 시작해야 해요.",
  host_not_allowed: "허용되지 않은 외부 사이트예요.",
  has_query: "외부 사이트 주소에는 ?나 #를 붙일 수 없어요.",
};

/** Validates a candidate outbound URL (also used before an admin saves a setting). */
export function checkOutboundUrl(value: string | null | undefined): OutboundCheck {
  const raw = value?.trim();
  if (!raw) return { ok: false, error: "missing" };
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, error: "invalid" };
  }
  if (url.protocol !== "https:") return { ok: false, error: "not_https" };
  if (url.username || url.password || url.port) return { ok: false, error: "invalid" };
  if (!ALLOWED_HOSTS.includes(url.hostname)) return { ok: false, error: "host_not_allowed" };
  if (url.search || url.hash || raw.includes("?") || raw.includes("#")) return { ok: false, error: "has_query" };
  return { ok: true, url: url.toString() };
}

/**
 * The URL to open: the admin setting when present (must pass the check — no silent fallback
 * for a broken setting), otherwise the default constant.
 */
export function resolveOutboundUrl(kind: OutboundKind, settings?: OutboundSettings | null): OutboundCheck {
  const configured = settings?.[SETTING_KEY[kind]];
  return checkOutboundUrl(configured ?? DEFAULT_OUTBOUND_URL[kind]);
}

/** Anchor attributes for an outbound link: new tab, no opener, no referrer. */
export const OUTBOUND_LINK_PROPS = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Opens a checked URL in a new tab (noopener,noreferrer). Never appends anything to the URL. */
export function openOutbound(check: OutboundCheck): boolean {
  if (!check.ok || typeof window === "undefined") return false;
  window.open(check.url, "_blank", "noopener,noreferrer");
  return true;
}

/**
 * Records an outbound failure without user data (only kind and reason — never the inputs or
 * the URL), as required by REQ-FUNC-018/026.
 */
export function reportOutboundError(kind: OutboundKind, error: OutboundError): void {
  console.error(`[outbound] ${kind} link blocked: ${error}`);
}
