import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { CuratorTeaser } from "@/components/home/CuratorTeaser";
import { DestinationBento } from "@/components/home/DestinationBento";
import { DestinationDrawer } from "@/components/home/DestinationDrawer";
import { DestinationGrid } from "@/components/home/DestinationGrid";
import { RecentMatesSection } from "@/components/home/RecentMatesSection";
import { SearchHero } from "@/components/home/SearchHero";
import { SearchResultsSection } from "@/components/home/SearchResultsSection";
import { ThemeTileGrid } from "@/components/home/ThemeTileGrid";
import { SafetyCardGrid } from "@/components/safety/SafetyCardGrid";
import { SafetyDrawer } from "@/components/safety/SafetyDrawer";
import { Skeleton } from "@/components/ui/Skeleton";
import { getDestination } from "@/data/destinations";
import { isSearchMode, parseFilters } from "@/lib/destinations/search";

/*
 * SCR-001 메인 (Page Owner). Assembles the component tasks in UI_CONTRACT §2.1 order:
 *   ① search-hero → ② domestic-picks → ③ overseas-picks → ④ themes → ⑤ country-safety
 *   → ⑥ recent-mates → ⑦ curator-teaser
 * With filter keys in the URL (q, scope, kind, country, city, season, theme, days, fav) the
 * search result section replaces ②③. ?dest / ?safety open the drawers (invalid → Toast).
 */

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const SITE_TITLE = "Free Traveler — 여행지·안전정보·동행을 한곳에서";
const SITE_DESCRIPTION =
  "국내 10곳과 해외 15개국 30개 도시의 일정·예산·교통·안전정보를 한곳에 모았습니다. 항공·숙소 조건 정리와 안전한 동행 찾기까지 이어집니다.";

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const destination = getDestination(first(params.dest) ?? "");
  if (destination) {
    const title = `${destination.name} 여행 정보 — 일정·예산·교통 | Free Traveler`;
    return {
      title: { absolute: title },
      description: destination.summary,
      alternates: { canonical: `/?dest=${destination.slug}` },
      openGraph: {
        title,
        description: destination.summary,
        url: `/?dest=${destination.slug}`,
        images: [{ url: destination.image.src, alt: destination.image.alt }],
      },
    };
  }
  return {
    // The root layout's title template does not apply to the root page (same segment).
    title: { absolute: SITE_TITLE },
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
    openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, url: "/" },
  };
}

/** WebSite JSON-LD. Static values only; "<" is escaped so the text cannot close the script. */
function WebsiteJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Free Traveler",
    url: siteUrl,
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }).replace(/</g, "\\u003c");
  return <script type="application/ld+json">{json}</script>;
}

function DefaultPicks() {
  return (
    <>
      <div id="domestic-picks">
        <DestinationGrid />
      </div>
      <div id="overseas-picks">
        <DestinationBento />
      </div>
    </>
  );
}

/** Reads the query (Promise) and decides between search-result mode and the default picks. */
async function TopSections({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const searchMode = isSearchMode(params);
  const filters = parseFilters(params);

  return (
    <>
      <div id="search-hero">
        <SearchHero initialQuery={filters.q} initialScope={filters.scope} />
      </div>
      {searchMode ? (
        <div id="search-results">
          <SearchResultsSection />
        </div>
      ) : (
        <DefaultPicks />
      )}
    </>
  );
}

/**
 * Safety freshness ("재확인 권장") depends on the current time, so this section renders per
 * request instead of being frozen at build time (Cache Components prerendering).
 */
async function RequestTimeSafety() {
  await connection();
  return <SafetyCardGrid />;
}

function SafetyFallback() {
  return (
    <section aria-label="국가별 주의사항을 불러오는 중" className="bg-white">
      <div className="mx-auto grid max-w-content gap-4 px-page-x py-section-mobile md:grid-cols-2 md:gap-6 md:py-section">
        <Skeleton className="h-44 w-full" count={6} label="국가별 주의사항을 불러오는 중" />
      </div>
    </section>
  );
}

export default function HomePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <WebsiteJsonLd />
      <Suspense
        fallback={
          <>
            <div id="search-hero">
              <SearchHero />
            </div>
            <DefaultPicks />
          </>
        }
      >
        <TopSections searchParams={searchParams} />
      </Suspense>
      <div id="themes">
        <ThemeTileGrid />
      </div>
      <div id="country-safety">
        <Suspense fallback={<SafetyFallback />}>
          <RequestTimeSafety />
        </Suspense>
      </div>
      <div id="recent-mates">
        <RecentMatesSection />
      </div>
      <div id="curator-teaser">
        <CuratorTeaser />
      </div>
      {/* Drawers read ?dest / ?safety with useSearchParams inside their own Suspense boundaries. */}
      <DestinationDrawer />
      <SafetyDrawer />
    </>
  );
}
