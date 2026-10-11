"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button, IconButton } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { useToast } from "@/components/ui/Toast";
import { getCountry } from "@/data/countries";
import { getDestination } from "@/data/destinations";
import { ADVISORY_LABELS, SAFETY_CATEGORIES, getSafety, type CountrySafety, type EmergencyContact } from "@/data/safety";
import { summarizeSafety } from "@/lib/safety/stale";
import { SHARE_MESSAGE, absoluteUrl, shareLink } from "@/lib/share";
import { AdvisoryBadge, FreshnessBadge } from "./AdvisoryBadge";

const MOFA_URL = "https://www.0404.go.kr/";

function withParams(pathname: string, params: URLSearchParams, changes: Record<string, string | null>): string {
  const next = new URLSearchParams(params);
  for (const [key, value] of Object.entries(changes)) {
    if (value === null) next.delete(key);
    else next.set(key, value);
  }
  const query = next.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 3v10M6 7l4-4 4 4M4 11v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-5" />
    </svg>
  );
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function Contact({ contact }: { contact: EmergencyContact }) {
  return (
    <li className="flex flex-col">
      <span className="text-body-sm text-muted">{contact.label}</span>
      {contact.phone ? (
        <a href={telHref(contact.phone)} className="inline-flex min-h-11 items-center text-title-sm text-ink underline underline-offset-4">
          {contact.phone}
        </a>
      ) : null}
      {contact.url ? (
        <a href={contact.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-body-sm text-ink underline underline-offset-4">
          홈페이지 열기<span className="sr-only">(새 탭에서 열림)</span>
        </a>
      ) : null}
    </li>
  );
}

function SafetyBody({ safety }: { safety: CountrySafety }) {
  const summary = summarizeSafety(safety);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <AdvisoryBadge level={summary.highest} />
        <FreshnessBadge stale={summary.stale} />
        <span className="text-caption text-muted">최종 확인 {summary.verifiedLabel}</span>
      </div>

      {summary.critical.map((a, i) => (
        <Alert key={i} tone="danger" role="alert" title={`${ADVISORY_LABELS[a.level]}${a.scopeType === "REGION" ? " (일부 지역)" : ""}`}>
          {a.scopeText ? <p>적용 범위: {a.scopeText}</p> : null}
          <p className="mt-1">해당 지역 방문은 피하고, 이미 머물고 있다면 외교부 안내에 따라 안전한 지역으로 이동하세요.</p>
        </Alert>
      ))}

      {summary.stale ? (
        <Alert
          tone="warning"
          title="최신 정보 재확인 필요"
          action={
            <Button href={MOFA_URL} external variant="secondary">
              외교부 해외안전여행 원문 보기
            </Button>
          }
        >
          마지막 확인 후 7일이 지났습니다. 출국 전 외교부 원문을 먼저 확인하세요.
        </Alert>
      ) : null}

      <Alert tone="info" title="이 정보는 공식 판단을 대신하지 않습니다">
        출국 직전 외교부 해외안전여행 원문을 다시 확인하세요.
      </Alert>

      <section>
        <h3 className="text-title-sm text-ink">경보 범위</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {safety.advisories.map((a, i) => (
            <li key={i} className="flex flex-wrap items-center gap-2 text-body-md text-body">
              <span className="font-semibold text-ink">{a.scopeType === "COUNTRY" ? "국가 전체" : "특정 지역"}</span>
              <AdvisoryBadge level={a.level} />
              {a.scopeText ? <span className="text-body-sm">{a.scopeText}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      {SAFETY_CATEGORIES.filter((c) => c.id !== "emergency").map((category) => (
        <section key={category.id} className="border-t border-hairline-soft pt-6">
          <h3 className="text-title-sm text-ink">{category.label}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-body-md text-body">
            {safety.categories[category.id as Exclude<typeof category.id, "emergency">].map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="border-t border-hairline-soft pt-6">
        <h3 className="text-title-sm text-ink">긴급연락처</h3>
        <ul className="mt-3 grid gap-4 sm:grid-cols-2">
          {safety.emergency.localEmergency.map((c) => (
            <Contact key={c.label} contact={c} />
          ))}
          <Contact contact={safety.emergency.embassy} />
          <Contact contact={safety.emergency.consularCallCenter} />
        </ul>
        <p className="mt-2 text-caption text-muted">
          출처 {safety.source.name} · 최종 확인 {summary.verifiedLabel}
        </p>
      </section>

      <section className="border-t border-hairline-soft pt-6">
        <h3 className="text-title-sm text-ink">출처</h3>
        <dl className="mt-3 grid gap-2 text-body-md text-body sm:grid-cols-2">
          <div>
            <dt className="text-caption text-muted">출처</dt>
            <dd>
              <a href={safety.source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {safety.source.name}
                <span className="sr-only">(새 탭에서 열림)</span>
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted">최종 확인일 · 편집자</dt>
            <dd>
              {summary.verifiedLabel} · {safety.editor}
            </dd>
          </div>
        </dl>
        <div className="mt-4">
          <Button href={MOFA_URL} external>
            외교부 해외안전여행 원문 보기
          </Button>
        </div>
      </section>
    </div>
  );
}

function SafetyDrawerInner() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const toast = useToast();
  const code = params.get("safety");
  const safety = code ? getSafety(code) : undefined;
  const invalid = code !== null && safety === undefined;
  const fromDestination = params.get("dest");
  const destination = fromDestination ? getDestination(fromDestination) : undefined;

  useEffect(() => {
    if (!invalid) return;
    toast("이 국가의 주의사항은 아직 없어요.", "warning");
    router.replace(withParams(pathname, params, { safety: null }), { scroll: false });
  }, [invalid, params, pathname, router, toast]);

  // Closing leaves both drawers; "돌아가기" removes only ?safety to show the destination again.
  const close = () => router.replace(withParams(pathname, params, { safety: null, dest: null }), { scroll: false });

  const share = async () => {
    if (!safety) return;
    const outcome = await shareLink({ title: `${getCountry(safety.countryCode).nameKo} 여행 주의사항 | Free Traveler`, url: absoluteUrl(`/?safety=${safety.countryCode}`) });
    if (outcome !== "cancelled") toast(SHARE_MESSAGE[outcome], outcome === "failed" ? "warning" : "success");
  };

  return (
    <Drawer
      open={safety !== undefined}
      onClose={close}
      title={safety ? `${getCountry(safety.countryCode).nameKo} 여행 주의사항` : "국가별 주의사항"}
      actions={safety ? <IconButton label="공유하기" icon={<ShareIcon />} onClick={share} /> : null}
    >
      {destination ? (
        <Link
          href={withParams(pathname, params, { safety: null })}
          scroll={false}
          className="mb-4 inline-flex min-h-11 items-center gap-1 text-button text-ink underline underline-offset-4"
        >
          <span aria-hidden="true">←</span> {destination.name} 상세로 돌아가기
        </Link>
      ) : null}
      {safety ? <SafetyBody safety={safety} /> : null}
    </Drawer>
  );
}

/** Country safety drawer driven by ?safety=<countryCode>. Back closes it (URL state). */
export function SafetyDrawer() {
  return (
    <Suspense fallback={null}>
      <SafetyDrawerInner />
    </Suspense>
  );
}
