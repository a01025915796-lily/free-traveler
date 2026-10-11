import Link from "next/link";
import { getFeatured } from "@/data/destinations";
import { DestinationCard } from "./DestinationCard";

/** Large Bento cards (04 §6.1 Section 3). The rest of the overseas picks are small cards. */
const LARGE = ["tokyo", "da-nang"];

/** Section 3: 6 overseas picks — 2 large cards on top, 4 small cards below (1 column on mobile). */
export function DestinationBento() {
  const featured = getFeatured("overseas");
  const large = featured.filter((d) => LARGE.includes(d.slug));
  const small = featured.filter((d) => !LARGE.includes(d.slug));

  return (
    <section aria-labelledby="home-overseas-title" className="bg-white">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="home-overseas-title" className="text-title-lg text-ink">
              free_traveler가 고른 해외 여행지
            </h2>
            <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
              비행 시간과 예산, 처음 가는 사람의 동선까지 따져 시작하기 좋은 도시를 모았습니다.
            </p>
          </div>
          <Link href="/?scope=overseas" className="inline-flex min-h-11 shrink-0 items-center text-button text-ink underline underline-offset-4">
            해외 30개 도시 모두 보기
          </Link>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {large.map((d) => (
            <li key={d.slug} className="xl:col-span-2">
              <DestinationCard destination={d} size="large" sizes="(min-width: 1280px) 620px, (min-width: 768px) 50vw, 100vw" />
            </li>
          ))}
          {small.map((d) => (
            <li key={d.slug}>
              <DestinationCard destination={d} sizes="(min-width: 1280px) 300px, (min-width: 768px) 50vw, 100vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
