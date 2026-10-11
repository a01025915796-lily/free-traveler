"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button, IconButton } from "@/components/ui/Button";
import { StaticChip } from "@/components/ui/Chip";
import { Drawer } from "@/components/ui/Drawer";
import { SafeImage } from "@/components/ui/SafeImage";
import { TabPanel, Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { getCountry } from "@/data/countries";
import { getDestination, getTheme } from "@/data/destinations";
import { getSafety } from "@/data/safety";
import { relatedDestinations } from "@/lib/destinations/search";
import { advisoryLabel, advisoryTone, summarizeSafety } from "@/lib/safety/stale";
import { SHARE_MESSAGE, absoluteUrl, shareLink } from "@/lib/share";
import type { Destination } from "@/types/content";
import { FavoriteButton } from "./DestinationCard";

function ShareIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 3v10M6 7l4-4 4 4M4 11v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-5" />
    </svg>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline-soft pt-6">
      <h3 className="text-title-sm text-ink">{title}</h3>
      <div className="mt-3 text-body-md text-body">{children}</div>
    </section>
  );
}

/** Builds the current URL with one query key changed (null removes it). */
function withParam(pathname: string, params: URLSearchParams, key: string, value: string | null): string {
  const next = new URLSearchParams(params);
  if (value === null) next.delete(key);
  else next.set(key, value);
  const query = next.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function DestinationBody({ d, safetyHref }: { d: Destination; safetyHref: string }) {
  const [plan, setPlan] = useState<"one" | "three">("one");
  const country = getCountry(d.countryCode);
  const safety = d.scope === "overseas" ? getSafety(d.countryCode) : undefined;
  const summary = safety ? summarizeSafety(safety) : null;
  const related = relatedDestinations(d.slug);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-body-sm text-muted">
          {country.nameKo} · {d.region}
        </p>
        <ul className="mt-2 flex flex-wrap gap-2" aria-label="테마">
          {d.themes.map((t) => (
            <li key={t}>
              <StaticChip>{getTheme(t).label}</StaticChip>
            </li>
          ))}
        </ul>
      </div>

      <SafeImage src={d.image.src} alt={d.image.alt} placeName={d.name} width={16} height={9} sizes="(min-width: 1280px) 600px, 100vw" className="rounded-card" />

      <section>
        <h3 className="text-title-sm text-ink">한눈에 보기</h3>
        <p className="mt-3 text-body-md text-body">{d.intro}</p>
        <p className="mt-3 text-body-sm text-body">
          <strong className="font-semibold text-ink">이런 분께 추천해요 </strong>
          {d.recommendedFor}
        </p>
      </section>

      <Block title="추천 시기">
        <p className="flex flex-wrap items-center gap-2">
          <Badge tone="success">추천</Badge>
          <span>{d.bestTime}</span>
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-2">
          <Badge tone="neutral">피하면 좋은 때</Badge>
          <span>{d.avoidTime}</span>
        </p>
      </Block>

      <Block title="핵심 명소·체험">
        <ul className="flex flex-col gap-3">
          {d.attractions.map((a) => (
            <li key={a.name}>
              <strong className="font-semibold text-ink">{a.name}</strong>
              <span className="block text-body-sm">{a.description}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="추천 일정">
        <Tabs
          idBase={`plan-${d.slug}`}
          label="추천 일정"
          value={plan}
          onChange={setPlan}
          items={[
            { id: "one", label: "1일 일정" },
            { id: "three", label: "3일 일정" },
          ]}
        />
        <TabPanel idBase={`plan-${d.slug}`} id={plan} className="pt-4">
          {plan === "one" ? (
            <ol className="flex flex-col gap-2">
              {d.itinerary.oneDay.map((stop) => (
                <li key={stop.time} className="flex gap-3">
                  <span className="w-14 shrink-0 text-caption text-muted">{stop.time}</span>
                  <span>{stop.plan}</span>
                </li>
              ))}
            </ol>
          ) : (
            <ol className="flex flex-col gap-3">
              {d.itinerary.threeDay.map((day, i) => (
                <li key={day.title}>
                  <strong className="font-semibold text-ink">{`${i + 1}일차 · ${day.title}`}</strong>
                  <span className="block text-body-sm">{day.plan}</span>
                </li>
              ))}
            </ol>
          )}
        </TabPanel>
      </Block>

      <Block title="예상 예산 (1인 1일)">
        <dl className="grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-caption text-muted">숙박 제외</dt>
            <dd className="font-semibold text-ink">{d.budget.withoutLodging}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">숙박 포함</dt>
            <dd className="font-semibold text-ink">{d.budget.withLodging}</dd>
          </div>
        </dl>
        <p className="mt-2 text-body-sm">{d.budget.note}</p>
      </Block>

      <Block title="현지 교통">
        <dl className="flex flex-col gap-2">
          {(
            [
              ["도착", d.transport.arrival],
              ["시내 이동", d.transport.local],
              ["결제", d.transport.payment],
            ] as const
          ).map(([label, text]) => (
            <div key={label}>
              <dt className="text-caption text-muted">{label}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block title="음식">
        <ul className="flex flex-col gap-3">
          {d.foods.map((f) => (
            <li key={f.name}>
              <strong className="font-semibold text-ink">{f.name}</strong>
              <span className="block text-body-sm">{f.description}</span>
              {f.caution ? <span className="block text-body-sm text-warning">주의: {f.caution}</span> : null}
            </li>
          ))}
        </ul>
      </Block>

      <Block title="문화·에티켓">
        <ul className="list-disc space-y-1 pl-5">
          {d.etiquette.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </Block>

      {safety && summary ? (
        <Block title="안전정보 요약">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={advisoryTone(summary.highest)}>{advisoryLabel(summary.highest)}</Badge>
            {summary.stale ? <Badge tone="warning">재확인 권장</Badge> : null}
            <span className="text-caption text-muted">최종 확인 {summary.verifiedLabel}</span>
          </div>
          <p className="mt-2 text-body-sm">{safety.summary}</p>
          <div className="mt-3">
            <Button href={safetyHref} variant="secondary">
              국가별 주의사항 보기
            </Button>
          </div>
        </Block>
      ) : null}

      <Block title="다음 행동">
        {/* Links carry only the tab name — no country, city or dates (inputs stay on SCR-003). */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/travel-tools?tab=flight">항공권 조건 정리하기</Button>
          <Button href="/travel-tools?tab=hotel" variant="secondary">
            숙소 조건 정리하기
          </Button>
        </div>
        <Link href={`/mates?country=${d.countryCode}`} className="mt-3 inline-flex min-h-11 items-center text-button text-ink underline underline-offset-4">
          이 지역 동행 찾기
        </Link>
      </Block>

      <Block title="출처·수정일">
        <ul className="flex flex-col gap-1">
          {d.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">
                {s.label}
                <span className="sr-only">(새 탭에서 열림)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-1 text-caption text-muted">최종 수정 {d.updatedAt.replaceAll("-", ".")}</p>
      </Block>

      {related.length > 0 ? (
        <Block title="관련 여행지">
          <ul className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
            {related.map((r) => (
              <li key={r.slug} className="w-40 shrink-0 snap-start">
                <Link href={`/?dest=${r.slug}`} scroll={false} className="block overflow-hidden rounded-card border border-hairline bg-white hover:shadow-raised">
                  <SafeImage src={r.image.src} alt={r.image.alt} placeName={r.name} sizes="160px" />
                  <span className="block p-2 text-body-sm font-semibold text-ink">{r.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}
    </div>
  );
}

function DestinationDrawerInner() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const toast = useToast();
  const slug = params.get("dest");
  const safetyOpen = params.has("safety");
  const destination = slug ? getDestination(slug) : undefined;
  const invalid = slug !== null && destination === undefined;

  // Unknown slug: do not open the drawer; tell the user and clean the URL.
  useEffect(() => {
    if (!invalid) return;
    toast("찾는 여행지가 없어요. 목록에서 다시 골라 주세요.", "warning");
    router.replace(withParam(pathname, params, "dest", null), { scroll: false });
  }, [invalid, params, pathname, router, toast]);

  const close = () => router.replace(withParam(pathname, params, "dest", null), { scroll: false });

  const share = async () => {
    if (!destination) return;
    const outcome = await shareLink({ title: `${destination.name} 여행 정보 | Free Traveler`, url: absoluteUrl(`/?dest=${destination.slug}`) });
    if (outcome !== "cancelled") toast(SHARE_MESSAGE[outcome], outcome === "failed" ? "warning" : "success");
  };

  return (
    <Drawer
      open={destination !== undefined && !safetyOpen}
      onClose={close}
      title={destination?.name ?? "여행지 상세"}
      actions={
        destination ? (
          <>
            <IconButton label="공유하기" icon={<ShareIcon />} onClick={share} />
            <FavoriteButton slug={destination.slug} name={destination.name} />
          </>
        ) : null
      }
    >
      {destination ? (
        <DestinationBody key={destination.slug} d={destination} safetyHref={withParam(pathname, params, "safety", destination.countryCode)} />
      ) : (
        <Alert tone="info" title="여행지를 불러오는 중이에요" />
      )}
    </Drawer>
  );
}

/**
 * Destination detail drawer driven by ?dest=<slug>. Opening is a URL change (Back closes it).
 * When the country safety drawer (?safety) is opened from here, this drawer hides and the
 * safety drawer shows a "back to destination" button (same flow, one drawer visible).
 */
export function DestinationDrawer() {
  return (
    <Suspense fallback={null}>
      <DestinationDrawerInner />
    </Suspense>
  );
}
