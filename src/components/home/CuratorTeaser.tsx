import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { StatTile } from "@/components/ui/StatTile";
import { CURATOR_NAME, GALLERY, STATS } from "@/data/curator";

/** Section 7: free_traveler intro — 5:7 split, landscape photo, 50+ Trips / 30+ Countries, → /about. */
export function CuratorTeaser() {
  const photo = GALLERY.find((g) => g.place === "퀸스타운") ?? GALLERY[0];
  const stats = STATS.slice(0, 2);

  return (
    <section aria-labelledby="home-curator-title" className="bg-white">
      <div className="mx-auto grid max-w-content items-center gap-8 px-page-x py-section-mobile md:grid-cols-12 md:gap-6 md:py-section">
        <div className="overflow-hidden rounded-card md:col-span-5">
          <SafeImage src={photo.image.src} alt={photo.image.alt} placeName={photo.place} sizes="(min-width: 1280px) 500px, (min-width: 768px) 40vw, 100vw" />
        </div>
        <div className="md:col-span-7">
          <h2 id="home-curator-title" className="text-title-lg text-ink">
            여행지를 고르는 사람, {CURATOR_NAME}
          </h2>
          <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
            50번 넘는 자유여행으로 30개국 이상을 다녀온 여행 큐레이터가 이동 동선과 체력, 예산과 안전까지 함께 살펴 여행지를 고릅니다.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {stats.map((s) => (
              <StatTile key={s.value} value={s.value} label={s.label} description={s.description} />
            ))}
          </div>
          <div className="mt-6">
            <Button href="/about">free_traveler 이야기 보기</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
