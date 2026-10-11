import { COUNTRIES, isCountryCode } from "@/data/countries";
import { DESTINATIONS, THEMES } from "@/data/destinations";
import { SAFETY, type CountrySafety } from "@/data/safety";
import type { CountryCode, Destination, Season, ThemeId, TripLength } from "@/types/content";

/*
 * Destination search, filters and URL state for SCR-001 (pure functions over static data).
 * Only the contract query keys (UI_CONTRACT §2: q, scope, kind, country, city, season, theme,
 * days, fav) are read or written; unknown keys and invalid values are ignored.
 * Drawer keys (?dest, ?safety) are handled by the page, not here.
 */

export type ScopeFilter = "all" | "domestic" | "overseas";
/** Result type filter (contract query `kind`). */
export type KindFilter = "all" | "destination" | "safety";

export type SearchFilters = {
  q: string;
  scope: ScopeFilter;
  kind: KindFilter;
  country: CountryCode | null;
  city: string | null;
  season: Season | null;
  theme: ThemeId | null;
  duration: TripLength | null;
  /** "즐겨찾기만" — favorites come from localStorage, so the slug list is passed in separately. */
  favoritesOnly: boolean;
};

export const EMPTY_FILTERS: SearchFilters = {
  q: "",
  scope: "all",
  kind: "all",
  country: null,
  city: null,
  season: null,
  theme: null,
  duration: null,
  favoritesOnly: false,
};

export const FILTER_KEYS = ["q", "scope", "kind", "country", "city", "season", "theme", "days", "fav"] as const;

const SCOPES: readonly ScopeFilter[] = ["all", "domestic", "overseas"];
const KINDS: readonly KindFilter[] = ["all", "destination", "safety"];
const SEASONS: readonly Season[] = ["spring", "summer", "autumn", "winter"];
const DURATIONS: readonly TripLength[] = ["1-2days", "3-4days", "5plus"];
const THEME_IDS: readonly ThemeId[] = THEMES.map((t) => t.id);
const CITY_SLUGS = new Set(DESTINATIONS.map((d) => d.slug));
const MAX_QUERY_LENGTH = 50;

export const SEASON_LABEL: Record<Season, string> = { spring: "봄", summer: "여름", autumn: "가을", winter: "겨울" };
export const DURATION_LABEL: Record<TripLength, string> = { "1-2days": "1~2일", "3-4days": "3~4일", "5plus": "5일 이상" };
export const SCOPE_LABEL: Record<ScopeFilter, string> = { all: "전체", domestic: "국내", overseas: "해외" };
export const KIND_LABEL: Record<KindFilter, string> = { all: "전체", destination: "여행지", safety: "안전정보" };

type QueryInput = URLSearchParams | Record<string, string | string[] | undefined>;

function read(input: QueryInput, key: string): string | null {
  if (input instanceof URLSearchParams) return input.get(key);
  const value = input[key];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

/** Reads filters from a URL query (page searchParams or URLSearchParams). Invalid values are dropped. */
export function parseFilters(input: QueryInput): SearchFilters {
  const q = (read(input, "q") ?? "").trim().slice(0, MAX_QUERY_LENGTH);
  const country = read(input, "country");
  const city = read(input, "city");
  return {
    q,
    scope: oneOf(read(input, "scope"), SCOPES) ?? "all",
    kind: oneOf(read(input, "kind"), KINDS) ?? "all",
    country: isCountryCode(country) ? country : null,
    city: city !== null && CITY_SLUGS.has(city) ? city : null,
    season: oneOf(read(input, "season"), SEASONS),
    theme: oneOf(read(input, "theme"), THEME_IDS),
    duration: oneOf(read(input, "days"), DURATIONS),
    favoritesOnly: read(input, "fav") === "1",
  };
}

/** Serializes only allowed, non-default filters, in a stable key order. */
export function serializeFilters(filters: SearchFilters): string {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim().slice(0, MAX_QUERY_LENGTH));
  if (filters.scope !== "all") params.set("scope", filters.scope);
  if (filters.kind !== "all") params.set("kind", filters.kind);
  if (filters.country) params.set("country", filters.country);
  if (filters.city) params.set("city", filters.city);
  if (filters.season) params.set("season", filters.season);
  if (filters.theme) params.set("theme", filters.theme);
  if (filters.duration) params.set("days", filters.duration);
  if (filters.favoritesOnly) params.set("fav", "1");
  return params.toString();
}

/**
 * Search result mode is on when any filter key is present in the URL — including an explicit
 * `scope=all` ("여행지 둘러보기") — even if the value is the default.
 */
export function isSearchMode(input: QueryInput): boolean {
  return FILTER_KEYS.some((key) => {
    const value = read(input, key);
    return value !== null && value !== "";
  });
}

export function hasNarrowingFilters(filters: SearchFilters): boolean {
  return (
    filters.q !== "" ||
    filters.scope !== "all" ||
    filters.kind !== "all" ||
    filters.country !== null ||
    filters.city !== null ||
    filters.season !== null ||
    filters.theme !== null ||
    filters.duration !== null ||
    filters.favoritesOnly
  );
}

// Keyword matching ------------------------------------------------------------------------

function normalize(text: string): string {
  return text.normalize("NFC").toLocaleLowerCase("ko-KR").replace(/\s+/g, "");
}

const countryNameKo = (code: CountryCode) => COUNTRIES.find((c) => c.code === code)?.nameKo ?? "";

function destinationHaystack(d: Destination): string[] {
  const themeLabels = d.themes.map((id) => THEMES.find((t) => t.id === id)?.label ?? "");
  return [d.name, d.nameEn, countryNameKo(d.countryCode), d.region, ...themeLabels];
}

function matchesKeyword(fields: readonly string[], q: string): boolean {
  if (!q) return true;
  const needle = normalize(q);
  return fields.some((field) => normalize(field).includes(needle));
}

export type HighlightPart = { text: string; match: boolean };

/** Splits text into parts so the matching substring can be shown in bold. Case-insensitive. */
export function highlight(text: string, q: string): HighlightPart[] {
  const needle = q.trim();
  if (!needle) return [{ text, match: false }];
  const lower = text.toLocaleLowerCase("ko-KR");
  const target = needle.toLocaleLowerCase("ko-KR");
  const parts: HighlightPart[] = [];
  let from = 0;
  for (let i = lower.indexOf(target); i !== -1; i = lower.indexOf(target, from)) {
    if (i > from) parts.push({ text: text.slice(from, i), match: false });
    parts.push({ text: text.slice(i, i + target.length), match: true });
    from = i + target.length;
  }
  if (from < text.length) parts.push({ text: text.slice(from), match: false });
  return parts.length > 0 ? parts : [{ text, match: false }];
}

// Filtering ---------------------------------------------------------------------------------

/** Destinations matching all filters (AND). `favoriteSlugs` is required when favoritesOnly is on. */
export function filterDestinations(
  filters: SearchFilters,
  favoriteSlugs: readonly string[] = [],
  source: readonly Destination[] = DESTINATIONS,
): Destination[] {
  const favorites = new Set(favoriteSlugs);
  return source.filter(
    (d) =>
      (filters.scope === "all" || d.scope === filters.scope) &&
      (filters.country === null || d.countryCode === filters.country) &&
      (filters.city === null || d.slug === filters.city) &&
      (filters.season === null || d.seasons.includes(filters.season)) &&
      (filters.theme === null || d.themes.includes(filters.theme)) &&
      (filters.duration === null || d.duration === filters.duration) &&
      (!filters.favoritesOnly || favorites.has(d.slug)) &&
      matchesKeyword(destinationHaystack(d), filters.q),
  );
}

export type SearchResult =
  | { kind: "destination"; key: string; destination: Destination }
  | { kind: "safety"; key: string; safety: CountrySafety; countryName: string };

export const RESULT_KIND_LABEL: Record<SearchResult["kind"], string> = {
  destination: "여행지",
  safety: "안전정보",
};

/**
 * Combined search: destinations plus country safety notes, narrowed by `kind`.
 * - kind=destination: destinations only.
 * - kind=safety: safety notes only (all 15 countries unless q/country/scope narrow them).
 * - kind=all: safety notes are added for keyword/country searches only, and not when
 *   destination-only filters (city, season, theme, days, favorites) are set.
 * The domestic scope never returns safety notes (they cover overseas countries).
 */
export function search(filters: SearchFilters, favoriteSlugs: readonly string[] = []): SearchResult[] {
  const destinations: SearchResult[] =
    filters.kind === "safety"
      ? []
      : filterDestinations(filters, favoriteSlugs).map((d) => ({ kind: "destination", key: `dest-${d.slug}`, destination: d }));

  const destinationOnly =
    filters.city !== null || filters.season !== null || filters.theme !== null || filters.duration !== null || filters.favoritesOnly;
  const wantsSafety =
    filters.scope !== "domestic" &&
    (filters.kind === "safety" || (filters.kind === "all" && !destinationOnly && (filters.q !== "" || filters.country !== null)));
  if (!wantsSafety) return destinations;

  const safety: SearchResult[] = SAFETY.filter((s) => {
    const name = countryNameKo(s.countryCode);
    return (filters.country === null || s.countryCode === filters.country) && matchesKeyword([name, s.countryCode], filters.q);
  }).map((s) => ({ kind: "safety", key: `safety-${s.countryCode}`, safety: s, countryName: countryNameKo(s.countryCode) }));

  return [...destinations, ...safety];
}

/** Related destinations: same country first, then shared theme; excludes the current one; max 6. */
export function relatedDestinations(slug: string, limit = 6, source: readonly Destination[] = DESTINATIONS): Destination[] {
  const current = source.find((d) => d.slug === slug);
  if (!current) return [];
  const others = source.filter((d) => d.slug !== slug);
  const sameCountry = others.filter((d) => d.countryCode === current.countryCode);
  const sharedTheme = others.filter(
    (d) => d.countryCode !== current.countryCode && d.themes.some((t) => current.themes.includes(t)),
  );
  return [...sameCountry, ...sharedTheme].slice(0, Math.max(0, Math.min(limit, 6)));
}

/** Countries and cities available for the filter dropdowns, respecting the scope filter. */
export function filterOptions(scope: ScopeFilter): { countries: { code: CountryCode; name: string }[]; cities: { slug: string; name: string; country: CountryCode }[] } {
  const inScope = DESTINATIONS.filter((d) => scope === "all" || d.scope === scope);
  const codes = [...new Set(inScope.map((d) => d.countryCode))];
  return {
    countries: codes.map((code) => ({ code, name: countryNameKo(code) })),
    cities: inScope.map((d) => ({ slug: d.slug, name: d.name, country: d.countryCode })),
  };
}
