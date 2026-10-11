"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { Chip } from "@/components/ui/Chip";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/data/destinations";
import {
  DURATION_LABEL,
  EMPTY_FILTERS,
  KIND_LABEL,
  SCOPE_LABEL,
  SEASON_LABEL,
  filterOptions,
  serializeFilters,
  type KindFilter,
  type ScopeFilter,
  type SearchFilters,
} from "@/lib/destinations/search";
import type { CountryCode, Season, ThemeId, TripLength } from "@/types/content";

/** Home URL for a filter set. Drawer keys (?dest, ?safety) are dropped on purpose. */
export function homeHref(filters: SearchFilters): string {
  const query = serializeFilters(filters);
  return query ? `/?${query}` : "/?scope=all";
}

const SCOPES: ScopeFilter[] = ["all", "domestic", "overseas"];
const KINDS: KindFilter[] = ["all", "destination", "safety"];

const selectClass =
  "h-11 w-full appearance-none rounded-pill border border-hairline bg-white px-4 pr-9 text-body-sm text-ink hover:border-ink";

function Select({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-w-36 flex-1 md:flex-none">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} value={value} onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)} className={selectClass}>
        {children}
      </select>
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="m4 6 4 4 4-4" />
      </svg>
    </div>
  );
}

function FilterControls({ filters, apply }: { filters: SearchFilters; apply: (next: SearchFilters) => void }) {
  const options = filterOptions(filters.scope);
  const cities = options.cities.filter((c) => filters.country === null || c.country === filters.country);

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="구분과 결과 유형" className="flex flex-wrap gap-2">
        {SCOPES.map((scope) => (
          <Chip key={scope} selected={filters.scope === scope} onToggle={() => apply({ ...filters, scope, country: null, city: null })}>
            {SCOPE_LABEL[scope]}
          </Chip>
        ))}
        <span aria-hidden="true" className="mx-1 hidden w-px self-stretch bg-hairline md:block" />
        {KINDS.map((kind) => (
          <Chip key={kind} selected={filters.kind === kind} onToggle={() => apply({ ...filters, kind })}>
            {kind === "all" ? "모든 결과" : KIND_LABEL[kind]}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Select
          id="filter-country"
          label="국가"
          value={filters.country ?? ""}
          onChange={(v) => apply({ ...filters, country: (v || null) as CountryCode | null, city: null })}
        >
          <option value="">국가 전체</option>
          {options.countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select id="filter-city" label="도시" value={filters.city ?? ""} onChange={(v) => apply({ ...filters, city: v || null })}>
          <option value="">도시 전체</option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select id="filter-season" label="계절" value={filters.season ?? ""} onChange={(v) => apply({ ...filters, season: (v || null) as Season | null })}>
          <option value="">계절 전체</option>
          {(Object.keys(SEASON_LABEL) as Season[]).map((s) => (
            <option key={s} value={s}>
              {SEASON_LABEL[s]}
            </option>
          ))}
        </Select>
        <Select id="filter-theme" label="테마" value={filters.theme ?? ""} onChange={(v) => apply({ ...filters, theme: (v || null) as ThemeId | null })}>
          <option value="">테마 전체</option>
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </Select>
        <Select
          id="filter-days"
          label="권장 기간"
          value={filters.duration ?? ""}
          onChange={(v) => apply({ ...filters, duration: (v || null) as TripLength | null })}
        >
          <option value="">기간 전체</option>
          {(Object.keys(DURATION_LABEL) as TripLength[]).map((d) => (
            <option key={d} value={d}>
              {DURATION_LABEL[d]}
            </option>
          ))}
        </Select>
        <Chip selected={filters.favoritesOnly} onToggle={() => apply({ ...filters, favoritesOnly: !filters.favoritesOnly })}>
          즐겨찾기만
        </Chip>
        <button
          type="button"
          onClick={() => apply({ ...EMPTY_FILTERS })}
          className="inline-flex min-h-11 items-center px-2 text-body-sm text-ink underline underline-offset-4"
        >
          필터 초기화
        </button>
      </div>
    </div>
  );
}

/**
 * Result-mode filter bar: scope, result type, country, city, season, theme, days, favorites,
 * reset. Desktop shows the controls inline; mobile opens them in a sheet. Every change
 * replaces the URL query (only allowed keys), so the result is linkable.
 */
export function FilterBar({ filters, resultCount }: { filters: SearchFilters; resultCount: number }) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const apply = (next: SearchFilters) => router.replace(homeHref(next), { scroll: false });

  return (
    <div>
      <div className="hidden md:block">
        <FilterControls filters={filters} apply={apply} />
      </div>
      <div className="md:hidden">
        <Button variant="secondary" onClick={() => setSheetOpen(true)} fullWidth aria-haspopup="dialog">
          필터
        </Button>
        <Drawer open={sheetOpen} onClose={() => setSheetOpen(false)} title="필터">
          <FilterControls filters={filters} apply={apply} />
          <div className="mt-8">
            <Button onClick={() => setSheetOpen(false)} fullWidth>
              {`결과 ${resultCount}개 보기`}
            </Button>
          </div>
        </Drawer>
      </div>
    </div>
  );
}
