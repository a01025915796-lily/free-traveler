import { LinkChip, StaticChip } from "@/components/ui/Chip";
import { VISITED_REGIONS } from "@/data/curator";

/**
 * Section 5: 30 visited countries in 4 regions (4 columns → 1 on mobile). Countries that have
 * Free Traveler safety notes link to the country safety drawer (/?safety=<code>).
 */
export function CountryChipGroup() {
  const total = VISITED_REGIONS.reduce((n, r) => n + r.countries.length, 0);
  return (
    <section aria-labelledby="about-countries-title" className="bg-white">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section">
        <h2 id="about-countries-title" className="text-title-lg text-ink">
          다녀온 {total}개 나라
        </h2>
        <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
          권역별로 묶었습니다. 화살표가 있는 나라는 Free Traveler에서 여행지와 주의사항을 볼 수 있어요.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {VISITED_REGIONS.map((region) => (
            <div key={region.region}>
              <h3 className="text-title-sm text-ink">
                {region.region} <span className="text-body-sm font-normal text-muted">({region.countries.length})</span>
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {region.countries.map((c) => (
                  <li key={c.nameKo}>
                    {c.code ? <LinkChip href={`/?safety=${c.code}`}>{c.nameKo}</LinkChip> : <StaticChip className="h-11 px-4 text-body-sm">{c.nameKo}</StaticChip>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
