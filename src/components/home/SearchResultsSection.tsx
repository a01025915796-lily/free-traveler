"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LinkChip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { SafeImage } from "@/components/ui/SafeImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { getCountry } from "@/data/countries";
import { getTheme } from "@/data/destinations";
import {
  EMPTY_FILTERS,
  RESULT_KIND_LABEL,
  SCOPE_LABEL,
  highlight,
  parseFilters,
  search,
  type SearchFilters,
  type SearchResult,
} from "@/lib/destinations/search";
import { favoritesServerSnapshot, favoritesSnapshot, parseFavorites, subscribeFavorites } from "@/lib/favorites";
import { advisoryLabel, advisoryTone, summarizeSafety } from "@/lib/safety/stale";
import type { ThemeId } from "@/types/content";
import { FilterBar, homeHref } from "./FilterBar";

const RECOMMENDED_THEMES: ThemeId[] = ["city", "food", "nature"];

function Highlighted({ text, q }: { text: string; q: string }) {
  return (
    <>
      {highlight(text, q).map((part, i) => (part.match ? <strong key={i} className="font-bold text-ink">{part.text}</strong> : <span key={i}>{part.text}</span>))}
    </>
  );
}

/** Link that keeps the current filters and opens a drawer key (dest or safety). */
function drawerHref(filters: SearchFilters, key: "dest" | "safety", value: string): string {
  const base = homeHref(filters);
  return `${base}&${key}=${encodeURIComponent(value)}`;
}

function KindLabel({ kind }: { kind: SearchResult["kind"] }) {
  return <span className="text-caption font-semibold text-muted">{RESULT_KIND_LABEL[kind]}</span>;
}

function ResultCard({ result, filters }: { result: SearchResult; filters: SearchFilters }) {
  if (result.kind === "destination") {
    const d = result.destination;
    return (
      <Card as="li" interactive>
        <Link href={drawerHref(filters, "dest", d.slug)} scroll={false} className="block h-full">
          <SafeImage src={d.image.src} alt={d.image.alt} placeName={d.name} sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw" />
          <div className="p-4">
            <KindLabel kind="destination" />
            <h3 className="mt-1 text-title-sm text-ink">
              <Highlighted text={d.name} q={filters.q} />
            </h3>
            <p className="mt-1 text-body-sm text-muted">
              <Highlighted text={`${getCountry(d.countryCode).nameKo} · ${d.region}`} q={filters.q} />
            </p>
            <p className="mt-2 text-caption text-body">{d.themes.slice(0, 2).map((t) => getTheme(t).label).join(" · ")}</p>
          </div>
        </Link>
      </Card>
    );
  }

  const s = result.safety;
  const summary = summarizeSafety(s);
  return (
    <Card as="li" interactive>
      <Link href={drawerHref(filters, "safety", s.countryCode)} scroll={false} className="flex h-full flex-col gap-2 p-4">
        <KindLabel kind="safety" />
        <h3 className="text-title-sm text-ink">
          <Highlighted text={`${result.countryName} 주의사항`} q={filters.q} />
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge tone={advisoryTone(summary.highest)}>{advisoryLabel(summary.highest)}</Badge>
          {summary.stale ? <Badge tone="warning">재확인 권장</Badge> : null}
        </div>
        <p className="text-body-sm text-body">{s.summary}</p>
        <p className="text-caption text-muted">최종 확인 {summary.verifiedLabel}</p>
      </Link>
    </Card>
  );
}

function resultTitle(filters: SearchFilters, count: number): string {
  if (filters.q) return `‘${filters.q}’ 검색 결과 ${count}곳`;
  if (filters.kind === "safety") return `국가별 주의사항 ${count}개국`;
  if (filters.favoritesOnly) return `즐겨찾기한 여행지 ${count}곳`;
  const scope = filters.scope === "all" ? "" : `${SCOPE_LABEL[filters.scope]} `;
  return `${scope}여행지 ${count}곳`;
}

function Results() {
  const params = useSearchParams();
  const filters = useMemo(() => parseFilters(params), [params]);
  const favoritesRaw = useSyncExternalStore(subscribeFavorites, favoritesSnapshot, favoritesServerSnapshot);
  const favorites = useMemo(() => parseFavorites(favoritesRaw), [favoritesRaw]);
  const results = useMemo(() => search(filters, favorites), [filters, favorites]);
  const noFavorites = filters.favoritesOnly && favorites.length === 0;

  return (
    <section aria-labelledby="search-results-title" className="bg-surface-soft">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section">
        <h2 id="search-results-title" className="text-title-lg text-ink" aria-live="polite">
          {resultTitle(filters, results.length)}
        </h2>
        <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
          선택한 조건을 모두 만족하는 여행지와 안전정보입니다. 조건을 바꾸면 결과가 바로 바뀝니다.
        </p>
        <div className="mt-6">
          <FilterBar filters={filters} resultCount={results.length} />
        </div>

        <div className="mt-8">
          {noFavorites ? (
            <EmptyState
              title="아직 저장한 여행지가 없어요"
              description="여행지 Card의 하트를 누르면 이 브라우저에 저장되고, 여기에서 모아 볼 수 있어요."
              primary={{ label: "전체 여행지 보기", href: "/?scope=all" }}
              secondary={{ label: "필터 초기화", href: homeHref({ ...EMPTY_FILTERS }) }}
            />
          ) : results.length === 0 ? (
            <EmptyState
              title="조건에 맞는 여행지를 찾지 못했어요"
              description="조건을 하나씩 줄이거나 다른 키워드로 검색해 보세요. 계절이나 기간 조건을 빼면 더 많은 여행지를 볼 수 있어요."
              primary={{ label: "필터 초기화", href: homeHref({ ...EMPTY_FILTERS }) }}
              secondary={{ label: "전체 여행지 보기", href: "/?scope=all" }}
            >
              <ul className="flex flex-wrap justify-center gap-2" aria-label="추천 테마">
                {RECOMMENDED_THEMES.map((id) => (
                  <li key={id}>
                    <LinkChip href={homeHref({ ...EMPTY_FILTERS, theme: id })}>{getTheme(id).label}</LinkChip>
                  </li>
                ))}
              </ul>
            </EmptyState>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {results.map((result) => (
                <ResultCard key={result.key} result={result} filters={filters} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Search result mode (replaces sections 2·3 when filter keys are in the URL). Reads the query
 * with useSearchParams inside its own Suspense boundary; favorites come from localStorage.
 */
export function SearchResultsSection() {
  return (
    <Suspense
      fallback={
        <section aria-label="검색 결과를 불러오는 중" className="bg-surface-soft">
          <div className="mx-auto grid max-w-content gap-6 px-page-x py-section-mobile md:grid-cols-3 md:py-section">
            <Skeleton className="h-72 w-full" count={3} label="검색 결과를 불러오는 중" />
          </div>
        </section>
      }
    >
      <Results />
    </Suspense>
  );
}
