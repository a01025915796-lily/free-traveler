import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { getDestination } from "@/data/destinations";
import type { ScopeFilter } from "@/lib/destinations/search";
import { SearchBar } from "./SearchBar";

const HERO_SLUG = "jeju";

/**
 * Section 1: search hero (7:5 split, max 520px). Mobile order: title → search → button → photo (16:10).
 * The hero photo is the first-screen (LCP) image, so it is loaded with priority.
 */
export function SearchHero({ initialQuery, initialScope }: { initialQuery?: string; initialScope?: ScopeFilter }) {
  const hero = getDestination(HERO_SLUG);

  return (
    <section aria-labelledby="home-hero-title" className="bg-white">
      <div className="mx-auto grid max-w-content items-center gap-8 px-page-x pt-8 pb-section-mobile md:grid-cols-12 md:gap-6 md:pt-12 md:pb-section-tight">
        <div className="md:col-span-7">
          <h1 id="home-hero-title" className="text-display text-ink">
            어디로 떠날지, 여기서 차근차근 정해 보세요
          </h1>
          <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
            국내 10곳과 해외 15개국 30개 도시의 일정·예산·교통·안전정보를 한곳에 모았습니다. 마음에 드는 곳을 찾았다면
            항공권과 숙소 조건도 바로 정리할 수 있어요.
          </p>
          <div className="mt-8">
            <SearchBar initialQuery={initialQuery} initialScope={initialScope} />
          </div>
          <div className="mt-4">
            <Button href="/travel-tools" variant="secondary">
              항공·숙소 조건 정리하기
            </Button>
          </div>
        </div>
        {hero ? (
          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-card md:max-h-[480px]">
              <div className="md:hidden">
                <SafeImage src={hero.image.src} alt={hero.image.alt} placeName={hero.name} width={16} height={10} sizes="100vw" priority />
              </div>
              <div className="hidden md:block">
                <SafeImage
                  src={hero.image.src}
                  alt={hero.image.alt}
                  placeName={hero.name}
                  width={4}
                  height={5}
                  sizes="(min-width: 1280px) 500px, 40vw"
                  priority
                  className="max-h-[480px]"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
