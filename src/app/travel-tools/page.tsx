import type { Metadata } from "next";
import { HotelPanel } from "@/components/tools/HotelPanel";
import { MatePostForm } from "@/components/tools/MatePostForm";
import { BeforeYouGoSection } from "@/components/tools/NonTransferNotice";
import { FlightPanel } from "@/components/tools/TripConditionForm";
import { ToolsIntro } from "@/components/tools/ToolsIntro";
import { ToolsTabs } from "@/components/tools/ToolsTabs";

/*
 * SCR-003 통합 여행 준비 (Page Owner). UI_CONTRACT §4.1 order:
 *   ① intro → ② tabs (?tab=flight|hotel|mate, default flight)
 *   flight / hotel: ③ condition-form → ④ summary-outbound → ⑤ notice-tips
 *   mate: ⑥ mate-compose (?edit=<id> for editing)
 * All three tab panels stay mounted (hidden when inactive) so each tab keeps its own input,
 * validation and completion state. PRIVACY: flight/hotel inputs live only in client component
 * state — never in the URL (only ?tab), storage, cookies, logs or any server/API. This page has
 * no server API.
 */

export const metadata: Metadata = {
  title: "여행 준비 — 항공·숙소 조건 정리, 동행 구하기",
  description:
    "국가·도시·날짜를 정리해 항공권과 숙소 외부 사이트로 이동하고, 함께 떠날 동행을 모집하세요. 입력값은 외부 사이트로 전달되지 않습니다.",
  alternates: { canonical: "/travel-tools" },
  openGraph: {
    title: "여행 준비 — 항공·숙소 조건 정리, 동행 구하기 | Free Traveler",
    description: "항공·숙소 조건을 먼저 정리하고, 함께 떠날 동행을 모집하세요.",
    url: "/travel-tools",
  },
};

export default function TravelToolsPage() {
  return (
    <>
      <div id="intro">
        <ToolsIntro />
      </div>
      <div id="tabs">
        <ToolsTabs
          panels={{
            flight: (
              <>
                <FlightPanel sectionIds={{ form: "condition-form", summary: "summary-outbound" }} />
                <div id="notice-tips">
                  <BeforeYouGoSection kind="flight" />
                </div>
              </>
            ),
            hotel: (
              <>
                <HotelPanel sectionIds={{ form: "condition-form-hotel", summary: "summary-outbound-hotel" }} />
                <div id="notice-tips-hotel">
                  <BeforeYouGoSection kind="hotel" />
                </div>
              </>
            ),
            mate: (
              <div id="mate-compose">
                <MatePostForm />
              </div>
            ),
          }}
        />
      </div>
    </>
  );
}
