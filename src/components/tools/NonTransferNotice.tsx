import { Alert } from "@/components/ui/Alert";
import { TIPS, TipCard } from "./TipCard";

/** One-line info notice shown above the flight/hotel form. */
export function NonTransferNotice() {
  return <Alert tone="info" title="입력값은 외부 사이트로 전달되지 않습니다." />;
}

/**
 * Section 5: "이동하기 전에 알아 두세요" — non-transfer notice + 3 tips for the tab
 * (3 columns → 1 on mobile).
 */
export function BeforeYouGoSection({ kind }: { kind: "flight" | "hotel" }) {
  const headingId = `tools-tips-${kind}`;
  return (
    <section aria-labelledby={headingId} className="bg-white">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section-tight">
        <h2 id={headingId} className="text-title-lg text-ink">
          이동하기 전에 알아 두세요
        </h2>
        <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
          외부 사이트에는 아무 값도 넘어가지 않으니, 이동한 사이트에서 같은 조건을 다시 입력해 주세요.
        </p>
        <Alert
          tone="info"
          title="입력값은 외부 사이트로 전달되지 않습니다."
          className="mt-6"
        >
          국가·도시·날짜는 이 화면에서만 쓰이고 저장되지 않아요. 새 탭에서 같은 조건으로 직접 검색해 주세요.
        </Alert>
        <ul className="mt-6 grid gap-4 md:grid-cols-3 md:gap-6">
          {TIPS[kind].map((tip) => (
            <li key={tip}>
              <TipCard tip={tip} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
