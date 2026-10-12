import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LinkChip } from "@/components/ui/Chip";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { SafeImage } from "@/components/ui/SafeImage";
import { MEMORY_PLACES, RECOMMENDED_SLUGS, type MemoryPlace } from "@/data/curator";
import { getDestination } from "@/data/destinations";

/** Large memory card: photo + place + 1–2 sentence memory + "여행지 정보 보기" (/?dest=<slug>). */
export function MemoryCard({ memory }: { memory: MemoryPlace }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-white">
      <SafeImage src={memory.image.src} alt={memory.image.alt} placeName={memory.place} sizes="(min-width: 768px) 600px, 100vw" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-title-md text-ink">{memory.place}</h3>
        <p className="mt-2 text-body-md text-body">{memory.memory}</p>
        <Link href={`/?dest=${memory.slug}`} className="mt-auto inline-flex min-h-11 items-center pt-3 text-button text-ink underline underline-offset-4">
          여행지 정보 보기
        </Link>
      </div>
    </article>
  );
}

/** Section 7: 4 memory cards (2×2) + 6 recommended destination chips + CTA banner. */
export function MemorySection() {
  const recommended = RECOMMENDED_SLUGS.map((slug) => getDestination(slug)).filter((d) => d !== undefined);
  return (
    <section aria-labelledby="about-memory-title" className="bg-white">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section">
        <h2 id="about-memory-title" className="text-title-lg text-ink">
          다시 가고 싶은 네 곳
        </h2>
        <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
          일정이 빠듯했지만 오래 남은 곳, 다시 간다면 더 천천히 걷고 싶은 곳입니다.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
          {MEMORY_PLACES.map((m) => (
            <li key={m.slug}>
              <MemoryCard memory={m} />
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <h3 className="text-title-sm text-ink">free_traveler 추천 여행지 6곳</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {recommended.map((d) => (
              <li key={d.slug}>
                <LinkChip href={`/?dest=${d.slug}`}>{d.name}</LinkChip>
              </li>
            ))}
          </ul>
        </div>
        <CtaBanner
          className="mt-section-mobile md:mt-section-tight"
          title="이제 당신의 여행을 준비할 차례입니다"
          description="마음에 드는 여행지를 골랐다면 항공·숙소 조건을 정리하고, 함께 떠날 동행도 찾아보세요."
          actions={
            <>
              <Button href="/travel-tools">여행 준비 시작하기</Button>
              <Button href="/mates" variant="secondary">
                동행 찾아보기
              </Button>
            </>
          }
        />
      </div>
    </section>
  );
}
