function LightIcon() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M8 16h6M9 19h4M11 3a5.5 5.5 0 0 0-3 10.1V14h6v-.9A5.5 5.5 0 0 0 11 3Z" />
    </svg>
  );
}

/** One tip per card (one sentence). */
export function TipCard({ tip }: { tip: string }) {
  return (
    <div className="flex h-full items-start gap-3 rounded-card border border-hairline bg-white p-5">
      <span className="text-primary-accent">
        <LightIcon />
      </span>
      <p className="text-body-md text-ink">{tip}</p>
    </div>
  );
}

export const TIPS: Record<"flight" | "hotel", readonly [string, string, string]> = {
  flight: ["출발·도착을 도시 단위로 넓혀 검색해 보세요.", "귀국일을 하루 앞뒤로 바꿔 비교해 보세요.", "결제 전에 수하물 포함 여부를 확인하세요."],
  hotel: ["이동 동선 가까이에 숙소를 잡아 보세요.", "무료 취소 마감일을 먼저 확인하세요.", "도착 시각과 체크인 시간을 맞춰 보세요."],
};
