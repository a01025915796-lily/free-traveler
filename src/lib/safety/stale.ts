import { ADVISORY_LABELS, CRITICAL_LEVELS, type AdvisoryLevel, type AdvisoryScope, type CountrySafety } from "@/data/safety";

/*
 * Safety freshness and critical advisories, computed at render time (no batch job).
 * verifiedAt is a calendar date in Korea; it counts from 00:00 KST of that day.
 */

export const STALE_AFTER_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Start of the verified day in KST as an instant. */
function verifiedInstant(verifiedAt: string): number {
  return Date.parse(`${verifiedAt}T00:00:00+09:00`);
}

/** Stale when verifiedAt + 7 days < now. Exactly 7 days later is still fresh. Invalid dates count as stale. */
export function isStale(verifiedAt: string, now: Date = new Date()): boolean {
  const start = verifiedInstant(verifiedAt);
  if (Number.isNaN(start)) return true;
  return start + STALE_AFTER_DAYS * DAY_MS < now.getTime();
}

/** Whole days since verification (0 on the verified day), for "N일 전 확인" style text. */
export function daysSinceVerified(verifiedAt: string, now: Date = new Date()): number {
  const start = verifiedInstant(verifiedAt);
  if (Number.isNaN(start)) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor((now.getTime() - start) / DAY_MS));
}

/** "2026.10.11" display format. */
export function formatVerifiedDate(verifiedAt: string): string {
  return verifiedAt.replaceAll("-", ".");
}

const SEVERITY: Record<AdvisoryLevel, number> = { none: 0, level1: 1, level2: 2, special: 3, level3: 4, level4: 5 };

export function isCriticalLevel(level: AdvisoryLevel): boolean {
  return CRITICAL_LEVELS.includes(level);
}

/** Critical advisories (특별여행주의보·출국권고·여행금지), most severe first, for the top danger alert. */
export function criticalAdvisories(safety: CountrySafety): AdvisoryScope[] {
  return safety.advisories.filter((a) => isCriticalLevel(a.level)).sort((a, b) => SEVERITY[b.level] - SEVERITY[a.level]);
}

/** Most severe level anywhere in the country (falls back to headlineLevel). */
export function highestLevel(safety: CountrySafety): AdvisoryLevel {
  return safety.advisories.reduce<AdvisoryLevel>((max, a) => (SEVERITY[a.level] > SEVERITY[max] ? a.level : max), safety.headlineLevel);
}

/** Badge tone for an advisory level (color is secondary; the label text is always shown). */
export function advisoryTone(level: AdvisoryLevel): "danger" | "warning" | "info" | "neutral" {
  if (isCriticalLevel(level)) return "danger";
  if (level === "level2") return "warning";
  if (level === "level1") return "info";
  return "neutral";
}

export function advisoryLabel(level: AdvisoryLevel): string {
  return ADVISORY_LABELS[level];
}

export type FreshnessSummary = {
  stale: boolean;
  verifiedLabel: string;
  daysSince: number;
  critical: AdvisoryScope[];
  highest: AdvisoryLevel;
};

/** Everything a safety card or drawer needs to decide badges and alerts. */
export function summarizeSafety(safety: CountrySafety, now: Date = new Date()): FreshnessSummary {
  return {
    stale: isStale(safety.verifiedAt, now),
    verifiedLabel: formatVerifiedDate(safety.verifiedAt),
    daysSince: daysSinceVerified(safety.verifiedAt, now),
    critical: criticalAdvisories(safety),
    highest: highestLevel(safety),
  };
}
