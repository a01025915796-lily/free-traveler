"use client";

import type { ReactNode } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import type { OutboundKind } from "@/lib/outbound";
import { countryName, regionName } from "@/lib/trip/regions";
import { nightsBetween } from "@/lib/trip/validation";

export type TripValues = { country: string; region: string; start: string; end: string };

type TripSummaryCardProps = {
  kind: OutboundKind;
  values: TripValues;
  /** "editing": checklist; "invalid": validation summary; "summary": confirmed values. */
  phase: "editing" | "invalid" | "summary";
  onEdit: () => void;
  /** The outbound button (rendered only in the summary phase). */
  outbound: ReactNode;
};

function CheckItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-body-sm">
      <span
        aria-hidden="true"
        className={`inline-flex size-5 items-center justify-center rounded-pill border ${done ? "border-success bg-success-bg text-success" : "border-hairline text-muted"}`}
      >
        {done ? "✓" : ""}
      </span>
      <span className={done ? "text-ink" : "text-muted"}>
        {label}
        <span className="sr-only">{done ? " (완료)" : " (남음)"}</span>
      </span>
    </li>
  );
}

function formatDate(value: string): string {
  return value.replaceAll("-", ".");
}

/**
 * Section 4: sticky action card. Before confirmation it lists the remaining items and keeps the
 * outbound button disabled; after confirmation it shows country · city · dates · nights with the
 * non-transfer notice (and, for flights, the "not an official judgement" notice).
 */
export function TripSummaryCard({ kind, values, phase, onEdit, outbound }: TripSummaryCardProps) {
  const nights = values.start && values.end ? nightsBetween(values.start, values.end) : 0;
  const dateLabels = kind === "flight" ? (["출발일", "귀국일"] as const) : (["체크인", "체크아웃"] as const);

  return (
    <aside aria-labelledby={`summary-${kind}-title`} className="rounded-card border border-hairline bg-white p-6 shadow-raised">
      <h2 id={`summary-${kind}-title`} className="text-title-md text-ink">
        입력 요약
      </h2>

      {phase === "summary" ? (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-body-md">
            <div>
              <dt className="text-caption text-muted">국가</dt>
              <dd className="font-semibold text-ink">{countryName(values.country)}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">도시</dt>
              <dd className="font-semibold text-ink">{regionName(values.region)}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">{dateLabels[0]}</dt>
              <dd className="font-semibold text-ink">{formatDate(values.start)}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">{dateLabels[1]}</dt>
              <dd className="font-semibold text-ink">{formatDate(values.end)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-caption text-muted">기간</dt>
              <dd className="font-semibold text-ink">{nights === 0 ? "당일" : `${nights}박 ${nights + 1}일`}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-col gap-3">
            <Alert tone="info" title="입력값은 외부 사이트로 전달되지 않습니다.">
              이동한 사이트에서 같은 조건을 다시 입력해 주세요.
            </Alert>
            {kind === "flight" ? (
              <p className="text-body-sm text-body">항공편 운항·입국 가능 여부는 항공사와 정부 기관의 공식 안내를 따르세요.</p>
            ) : null}
            {outbound}
            <Button variant="secondary" onClick={onEdit} fullWidth>
              수정하기
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-body-sm text-body">입력을 마치면 여기에서 조건을 확인하고 외부 사이트로 이동할 수 있어요.</p>
          {phase === "invalid" ? (
            <Alert tone="danger" role="alert" title="입력을 확인해 주세요" className="mt-4">
              표시된 항목을 고친 뒤 다시 요약을 확인해 주세요.
            </Alert>
          ) : null}
          <ul className="mt-4 flex flex-col gap-2" aria-label="남은 입력 항목">
            <CheckItem done={Boolean(values.country)} label="국가 선택" />
            <CheckItem done={Boolean(values.region)} label="도시 선택" />
            <CheckItem done={Boolean(values.start && values.end)} label="날짜 선택" />
          </ul>
          <div className="mt-4">{outbound}</div>
        </>
      )}
    </aside>
  );
}
