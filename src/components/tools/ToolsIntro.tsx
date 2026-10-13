import { StepGuide } from "@/components/ui/StepGuide";

const STEPS = [
  { title: "조건 입력", description: "여행할 국가와 도시, 날짜를 입력해요." },
  { title: "요약 확인", description: "입력한 조건을 한눈에 확인해요." },
  { title: "외부 사이트에서 직접 검색", description: "새 탭에서 같은 조건으로 직접 찾아요." },
] as const;

/** Section 1: intro + 3 steps. No search results or prices are shown on this site. */
export function ToolsIntro() {
  return (
    <section aria-labelledby="tools-intro-title" className="bg-white">
      <div className="mx-auto max-w-content px-page-x pt-8 pb-8 md:pt-12">
        <h1 id="tools-intro-title" className="text-display text-ink">
          여행 조건을 먼저 정리하고 떠나세요
        </h1>
        <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
          항공권과 숙소를 찾기 전에 국가·지역·날짜를 정리해 두면 예약 사이트에서 헤매는 시간이 줄어듭니다. 이곳은 검색 결과나
          가격을 보여 주지 않으며, 조건을 확인한 뒤 외부 사이트로 안내합니다.
        </p>
        <StepGuide steps={STEPS} label="여행 준비 3단계" className="mt-8" />
      </div>
    </section>
  );
}
