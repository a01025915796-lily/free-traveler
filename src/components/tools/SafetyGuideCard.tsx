"use client";

import { usePolicyDialog } from "@/components/policy/PolicyDialog";

const RULES = [
  "모집글과 요청에 전화번호·메신저 아이디 같은 공개 연락처를 쓰지 않아요.",
  "첫 만남은 사람이 많은 공개된 장소에서 해요.",
  "돈을 미리 보내 달라는 요청에는 응하지 않아요.",
  "불편하면 바로 신고하고 차단할 수 있어요.",
] as const;

/** Right column of the mate tab: safety rules + link to the full rules (policy dialog). */
export function SafetyGuideCard() {
  const { open } = usePolicyDialog();
  return (
    <aside aria-labelledby="mate-safety-guide-title" className="rounded-card border border-hairline bg-white p-6">
      <h3 id="mate-safety-guide-title" className="text-title-md text-ink">
        안전한 동행을 위해
      </h3>
      <ul className="mt-4 flex flex-col gap-3">
        {RULES.map((rule) => (
          <li key={rule} className="flex gap-2 text-body-sm text-body">
            <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-ink" />
            {rule}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => open("mate-safety")}
        className="mt-4 inline-flex min-h-11 items-center text-button text-ink underline underline-offset-4"
      >
        동행 안전수칙 전문 보기
      </button>
    </aside>
  );
}
