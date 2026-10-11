import Link from "next/link";
import { getFeatured } from "@/data/destinations";
import { DestinationCard } from "./DestinationCard";

/** Section 2: free_traveler's 6 domestic picks (3×2 desktop, 1 column mobile). */
export function DestinationGrid() {
  const destinations = getFeatured("domestic");
  return (
    <section aria-labelledby="home-domestic-title" className="bg-surface-soft">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section-tight">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="home-domestic-title" className="text-title-lg text-ink">
              free_traveler가 고른 국내 여행지
            </h2>
            <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
              주말 이틀로도 충분한 도시부터 계절마다 다른 얼굴을 보여 주는 섬까지, 처음 가도 일정을 세우기 쉬운 곳을 골랐습니다.
            </p>
          </div>
          <Link href="/?scope=domestic" className="inline-flex min-h-11 shrink-0 items-center text-button text-ink underline underline-offset-4">
            국내 여행지 10곳 모두 보기
          </Link>
        </div>
        <ul className="mt-8 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {destinations.map((d) => (
            <li key={d.slug}>
              <DestinationCard destination={d} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
