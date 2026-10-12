import { TIMELINE } from "@/data/curator";

/** Section 4: 7 points in time (year · place · summary). Horizontal on desktop, vertical on mobile. */
export function TravelTimeline() {
  return (
    <section aria-labelledby="about-timeline-title" className="bg-surface-soft">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section">
        <h2 id="about-timeline-title" className="text-title-lg text-ink">
          여행으로 쌓아 온 시간
        </h2>
        <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
          첫 자유여행부터 서른 번째 나라까지, 여행 방식을 바꾼 순간을 골랐습니다.
        </p>
        <ol className="mt-8 flex flex-col gap-6 border-l border-hairline pl-6 xl:grid xl:grid-cols-7 xl:gap-4 xl:border-l-0 xl:border-t xl:pl-0 xl:pt-6">
          {TIMELINE.map((item) => (
            <li key={item.year} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[29px] top-1.5 size-2.5 rounded-pill bg-ink xl:-top-[29px] xl:left-0"
              />
              <p className="text-title-sm text-ink">{item.year}</p>
              <p className="mt-1 text-body-sm font-semibold text-ink">{item.place}</p>
              <p className="mt-1 text-body-sm text-body">{item.summary}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
