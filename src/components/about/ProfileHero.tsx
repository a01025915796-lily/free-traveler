import { SafeImage } from "@/components/ui/SafeImage";
import { StatTile } from "@/components/ui/StatTile";
import { CURATOR, STATS } from "@/data/curator";
import { ContactLinks } from "./ContactLinks";

/** Section 1: profile hero (6:6). Name, headline, tagline, contact links, travel photo (face not identifiable, 4:5). */
export function ProfileHero() {
  return (
    <section aria-labelledby="about-hero-title" className="bg-white">
      <div className="mx-auto grid max-w-content items-center gap-8 px-page-x pt-8 pb-section-mobile md:grid-cols-2 md:gap-6 md:pt-12 md:pb-section-tight">
        <div>
          <p className="text-button text-primary">{CURATOR.name}</p>
          <h1 id="about-hero-title" className="mt-2 text-display text-ink">
            {CURATOR.headline}
          </h1>
          <p className="mt-4 max-w-(--container-prose) text-body-md text-body">{CURATOR.tagline}</p>
          <div className="mt-6">
            <ContactLinks />
          </div>
        </div>
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-card">
          <SafeImage
            src={CURATOR.heroImage.src}
            alt={CURATOR.heroImage.alt}
            placeName="여행 중인 free_traveler"
            width={4}
            height={5}
            sizes="(min-width: 768px) 448px, 100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}

/** Section 2: four travel stats (shared values with SCR-001 via curator.ts). 4 columns → 1 on mobile. */
export function TravelStats() {
  return (
    <section aria-labelledby="about-stats-title" className="bg-surface-soft">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section-tight">
        <h2 id="about-stats-title" className="text-title-lg text-ink">
          숫자로 보는 여행 이력
        </h2>
        <p className="mt-3 text-body-md text-body">지금까지의 여행을 네 가지 숫자로 정리했습니다.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {STATS.map((s) => (
            <li key={s.value}>
              <StatTile value={s.value} label={s.label} description={s.description} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
