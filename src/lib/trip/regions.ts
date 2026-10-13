import { COUNTRIES } from "@/data/countries";
import { DESTINATIONS } from "@/data/destinations";
import type { CountryCode } from "@/types/content";

/*
 * Country → region choices for the flight, hotel and mate forms (REQ-FUNC-012/020).
 * Regions are the destination cities in src/data, so a region slug is the same value used by
 * /?dest=<slug> and stored in mate_posts.region_slug.
 */

export type Region = { slug: string; name: string };
export type CountryOption = { code: CountryCode; name: string };

/** Countries that have at least one region, domestic first, in COUNTRIES order. */
export function countryOptions(): CountryOption[] {
  return COUNTRIES.filter((c) => DESTINATIONS.some((d) => d.countryCode === c.code)).map((c) => ({ code: c.code, name: c.nameKo }));
}

export function regionsOf(country: CountryCode | "" | null | undefined): Region[] {
  if (!country) return [];
  return DESTINATIONS.filter((d) => d.countryCode === country).map((d) => ({ slug: d.slug, name: d.name }));
}

export function isRegionOf(country: CountryCode | "" | null | undefined, slug: string | null | undefined): boolean {
  return Boolean(slug) && regionsOf(country).some((r) => r.slug === slug);
}

/** When the country changes, keep the region only if it still belongs to the new country. */
export function regionAfterCountryChange(country: CountryCode | "" | null, currentRegion: string | null): string | null {
  return currentRegion && isRegionOf(country, currentRegion) ? currentRegion : null;
}

export function regionName(slug: string): string {
  return DESTINATIONS.find((d) => d.slug === slug)?.name ?? slug;
}

export function countryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.nameKo ?? code;
}
