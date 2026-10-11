import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FEATURED_SAFETY, getSafety, type CountrySafety } from "@/data/safety";
import { SafetyCard } from "./SafetyCard";

const MOFA_URL = "https://www.0404.go.kr/";

/** Section 5: country safety notes — 4:8 split, 6 cards (2×3), 1 column on mobile. */
export function SafetyCardGrid() {
  const featured = FEATURED_SAFETY.map((code) => getSafety(code)).filter((s): s is CountrySafety => s !== undefined);

  return (
    <section aria-labelledby="home-safety-title" className="bg-white">
      <div className="mx-auto grid max-w-content gap-8 px-page-x py-section-mobile md:grid-cols-12 md:gap-6 md:py-section">
        <div className="md:col-span-4">
          <h2 id="home-safety-title" className="text-title-lg text-ink">
            떠나기 전에 국가별 주의사항을 확인하세요
          </h2>
          <p className="mt-3 text-body-md text-body">
            외교부 해외안전여행 등 공식 출처를 바탕으로 치안·법규·보건·긴급연락처를 정리했습니다. 모든 안내에는 최종 확인일을 함께 표시합니다.
          </p>
          <div className="mt-6 flex flex-col items-start gap-3">
            <Button href={MOFA_URL} external variant="secondary">
              외교부 해외안전여행 바로가기
            </Button>
            <Link href="/?kind=safety" className="inline-flex min-h-11 items-center text-button text-ink underline underline-offset-4">
              15개국 주의사항 모두 보기
            </Link>
          </div>
        </div>
        <ul className="grid gap-4 md:col-span-8 md:grid-cols-2 md:gap-6">
          {featured.map((s) => (
            <li key={s.countryCode}>
              <SafetyCard safety={s} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
