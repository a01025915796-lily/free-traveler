"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { usePolicyDialog } from "@/components/policy/PolicyDialog";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { listReceivedApplications } from "@/lib/db/applications";
import { createMatePost, getMatePost, updateMatePost, validateMatePostInput, type MatePostInput } from "@/lib/db/mates";
import { contactGuidance, detectContacts } from "@/lib/mates/contact-detection";
import { needsDateChangeWarning } from "@/lib/mates/state";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { countryOptions, regionAfterCountryChange, regionsOf } from "@/lib/trip/regions";
import { minDate, validateMateDates } from "@/lib/trip/validation";
import type { CountryCode } from "@/types/content";
import { MateAuthGate } from "./MateAuthGate";
import { SafetyGuideCard } from "./SafetyGuideCard";

export const STYLE_OPTIONS = ["도시 산책", "맛집 탐방", "카페", "사진", "자연", "트레킹", "드라이브", "휴양", "역사·문화", "쇼핑", "액티비티", "야경"] as const;

type Values = {
  title: string;
  country: string;
  region: string;
  start: string;
  end: string;
  capacity: string;
  preferences: string;
  styles: string[];
  description: string;
  agreed: boolean;
};
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { title: "", country: "", region: "", start: "", end: "", capacity: "2", preferences: "", styles: [], description: "", agreed: false };

const LABELS: Record<Field, string> = {
  title: "제목",
  country: "국가",
  region: "지역",
  start: "시작일",
  end: "종료일",
  capacity: "모집 인원",
  preferences: "선호 조건",
  styles: "여행 스타일",
  description: "상세 설명",
  agreed: "안전수칙 동의",
};

function toInput(v: Values): MatePostInput {
  return {
    country_code: v.country,
    region_slug: v.region,
    start_date: v.start,
    end_date: v.end,
    capacity: Number(v.capacity),
    preferences: v.preferences.trim() || null,
    travel_styles: v.styles,
    title: v.title,
    description: v.description,
  };
}

function validate(v: Values, editing: boolean): Errors {
  const errors: Errors = {};
  if (!v.title.trim()) errors.title = "제목을 입력해 주세요.";
  else if (v.title.trim().length > 100) errors.title = "제목은 100자 이내로 입력해 주세요.";
  const dates = validateMateDates({ country: v.country, region: v.region, startDate: v.start, endDate: v.end });
  Object.assign(errors, { country: dates.errors.country, region: dates.errors.region, start: dates.errors.startDate, end: dates.errors.endDate });
  const cap = Number(v.capacity);
  if (!Number.isInteger(cap) || cap < 1 || cap > 10) errors.capacity = "모집 인원은 1~10명으로 정해 주세요.";
  if (v.preferences.length > 300) errors.preferences = "선호 조건은 300자 이내로 입력해 주세요.";
  if (v.styles.length === 0) errors.styles = "여행 스타일을 하나 이상 골라 주세요.";
  if (!v.description.trim()) errors.description = "상세 설명을 입력해 주세요.";
  else if (v.description.length > 3000) errors.description = "상세 설명은 3000자 이내로 입력해 주세요.";
  if (!editing && !v.agreed) errors.agreed = "동행 안전수칙에 동의해 주세요.";
  return Object.fromEntries(Object.entries(errors).filter(([, m]) => m)) as Errors;
}

const inputClass =
  "mt-1 h-12 w-full rounded-control border border-border-input bg-white px-4 text-body-md text-ink disabled:bg-surface-soft disabled:text-muted aria-[invalid=true]:border-danger";

function ErrorText({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-1 text-body-sm text-danger">
      {message}
    </p>
  ) : null;
}

type FormState = { status: "loading" } | { status: "forbidden" } | { status: "ready"; acceptedCount: number; original: Values | null };

function MateFormInner({ userId }: { userId: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const { open: openPolicy } = usePolicyDialog();
  const id = useId();
  const editId = params.get("edit");
  const editing = editId !== null;

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [contactError, setContactError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState<FormState>(editing ? { status: "loading" } : { status: "ready", acceptedCount: 0, original: null });

  // Edit mode: load the post, check ownership, count accepted participants.
  useEffect(() => {
    if (!editId) return;
    let active = true;
    (async () => {
      const supabase = getSupabaseBrowserClient();
      const post = await getMatePost(supabase, editId);
      if (!active) return;
      if (!post.ok || post.data.owner_id !== userId) {
        setForm({ status: "forbidden" });
        return;
      }
      const received = await listReceivedApplications(supabase);
      const accepted = received.ok ? received.data.filter((a) => a.post_id === editId && a.status === "ACCEPTED").length : 0;
      const loaded: Values = {
        title: post.data.title,
        country: post.data.country_code,
        region: post.data.region_slug,
        start: post.data.start_date,
        end: post.data.end_date,
        capacity: String(post.data.capacity),
        preferences: post.data.preferences ?? "",
        styles: post.data.travel_styles,
        description: post.data.description,
        agreed: true,
      };
      if (!active) return;
      setValues(loaded);
      setForm({ status: "ready", acceptedCount: accepted, original: loaded });
    })().catch(() => {
      if (active) setForm({ status: "forbidden" });
    });
    return () => {
      active = false;
    };
  }, [editId, userId]);

  const regions = useMemo(() => regionsOf(values.country as CountryCode | ""), [values.country]);
  const set = <K extends Field>(key: K, value: Values[K]) => setValues((v) => ({ ...v, [key]: value }));
  const describedBy = (key: Field) => (errors[key] ? `${id}-${key}-error` : undefined);

  const save = async () => {
    setSubmitting(true);
    setSubmitError(false);
    const supabase = getSupabaseBrowserClient();
    const result = editId ? await updateMatePost(supabase, editId, toInput(values)) : await createMatePost(supabase, toInput(values), values.agreed);
    setSubmitting(false);
    if (!result.ok) {
      setSubmitError(true);
      return;
    }
    const postId = editId ?? (result.data as { id: string }).id;
    toast(editId ? "동행글을 수정했어요." : "동행글을 올렸어요.", "success");
    router.push(`/mates?post=${postId}`);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values, editing);
    const extra = validateMateDates({ country: values.country, region: values.region, startDate: values.start, endDate: values.end });
    if (Object.keys(found).length === 0 && extra.ok) {
      const dbMessage = validateMatePostInput(toInput(values));
      if (dbMessage) found.description = dbMessage;
    }
    setErrors(found);
    const contacts = detectContacts([values.title, values.preferences, values.description].join("\n"));
    setContactError(contactGuidance(contacts));
    if (Object.keys(found).length > 0 || contacts.length > 0) return;
    if (form.status === "ready" && form.original && needsDateChangeWarning(
      { start_date: form.original.start, end_date: form.original.end },
      { start_date: values.start, end_date: values.end },
      form.acceptedCount,
    )) {
      setConfirmOpen(true);
      return;
    }
    void save();
  };

  if (form.status === "loading") {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <Skeleton className="h-12 w-full" count={6} label="동행글을 불러오는 중" />
      </div>
    );
  }

  if (form.status === "forbidden") {
    return (
      <div className="rounded-card border border-hairline bg-white p-6 md:p-8">
        <h3 className="text-title-md text-ink">이 글을 수정할 수 없어요</h3>
        <p className="mt-2 text-body-md text-body">글이 없거나 내가 쓴 글이 아니에요. 동행 찾기에서 다른 글을 확인해 보세요.</p>
        <div className="mt-6">
          <Button href="/mates">동행 찾기로 돌아가기</Button>
        </div>
      </div>
    );
  }

  const errorList = Object.entries(errors) as [Field, string][];

  return (
    <>
      <form onSubmit={submit} noValidate aria-labelledby={`${id}-title`} className="flex flex-col gap-5 rounded-card border border-hairline bg-white p-6 md:p-8">
        <h3 id={`${id}-title`} className="text-title-md text-ink">
          {editing ? "동행글 수정" : "동행글 쓰기"}
        </h3>

        {errorList.length > 0 ? (
          <div role="alert" className="rounded-control border border-danger-border bg-danger-bg p-4">
            <p className="text-body-md font-semibold text-danger">입력을 확인해 주세요 ({errorList.length}개)</p>
            <ul className="mt-2 list-disc pl-5 text-body-sm text-body">
              {errorList.map(([key, message]) => (
                <li key={key}>
                  <a href={`#${id}-${key === "title" ? "title-input" : key}`} className="underline underline-offset-2">
                    {LABELS[key]}: {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {contactError ? (
          <Alert tone="danger" role="alert" title="전화번호·이메일·메신저 ID처럼 보이는 내용이 있어요.">
            {contactError}
          </Alert>
        ) : null}
        {submitError ? (
          <Alert tone="danger" role="alert" title="글을 올리지 못했어요.">
            입력한 내용은 그대로 있으니 다시 시도해 주세요.
          </Alert>
        ) : null}

        <div>
          <label htmlFor={`${id}-title-input`} className="text-caption font-semibold text-ink">
            제목 <span className="text-muted">(필수)</span>
          </label>
          <input id={`${id}-title-input`} value={values.title} maxLength={100} onChange={(e) => set("title", e.target.value)} aria-invalid={Boolean(errors.title)} aria-describedby={describedBy("title")} className={inputClass} />
          <ErrorText id={`${id}-title-error`} message={errors.title} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-country`} className="text-caption font-semibold text-ink">
              국가 <span className="text-muted">(필수)</span>
            </label>
            <select id={`${id}-country`} value={values.country} onChange={(e) => setValues((v) => ({ ...v, country: e.target.value, region: regionAfterCountryChange(e.target.value as CountryCode, v.region) ?? "" }))} aria-invalid={Boolean(errors.country)} aria-describedby={describedBy("country")} className={inputClass}>
              <option value="">국가를 선택하세요</option>
              {countryOptions().map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <ErrorText id={`${id}-country-error`} message={errors.country} />
          </div>
          <div>
            <label htmlFor={`${id}-region`} className="text-caption font-semibold text-ink">
              지역 <span className="text-muted">(필수)</span>
            </label>
            <select id={`${id}-region`} value={values.region} disabled={!values.country} onChange={(e) => set("region", e.target.value)} aria-invalid={Boolean(errors.region)} aria-describedby={describedBy("region")} className={inputClass}>
              <option value="">{values.country ? "지역을 선택하세요" : "국가를 먼저 선택하세요"}</option>
              {regions.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
            <ErrorText id={`${id}-region-error`} message={errors.region} />
          </div>
          <div>
            <label htmlFor={`${id}-start`} className="text-caption font-semibold text-ink">
              시작일 <span className="text-muted">(필수)</span>
            </label>
            <input id={`${id}-start`} type="date" min={editing ? undefined : minDate()} value={values.start} onChange={(e) => set("start", e.target.value)} aria-invalid={Boolean(errors.start)} aria-describedby={describedBy("start")} className={inputClass} />
            <ErrorText id={`${id}-start-error`} message={errors.start} />
          </div>
          <div>
            <label htmlFor={`${id}-end`} className="text-caption font-semibold text-ink">
              종료일 <span className="text-muted">(필수)</span>
            </label>
            <input id={`${id}-end`} type="date" min={values.start || minDate()} value={values.end} onChange={(e) => set("end", e.target.value)} aria-invalid={Boolean(errors.end)} aria-describedby={describedBy("end")} className={inputClass} />
            <ErrorText id={`${id}-end-error`} message={errors.end} />
          </div>
          <div>
            <label htmlFor={`${id}-capacity`} className="text-caption font-semibold text-ink">
              모집 인원 <span className="text-muted">(필수)</span>
            </label>
            <select id={`${id}-capacity`} value={values.capacity} onChange={(e) => set("capacity", e.target.value)} aria-invalid={Boolean(errors.capacity)} aria-describedby={describedBy("capacity")} className={inputClass}>
              {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((n) => (
                <option key={n} value={n}>
                  {n}명
                </option>
              ))}
            </select>
            <ErrorText id={`${id}-capacity-error`} message={errors.capacity} />
          </div>
        </div>

        <div>
          <label htmlFor={`${id}-preferences`} className="text-caption font-semibold text-ink">
            선호 조건
          </label>
          <input id={`${id}-preferences`} value={values.preferences} maxLength={300} placeholder="예: 아침 일찍 움직이는 분이면 좋겠어요." onChange={(e) => set("preferences", e.target.value)} aria-invalid={Boolean(errors.preferences)} aria-describedby={describedBy("preferences")} className={inputClass} />
          <ErrorText id={`${id}-preferences-error`} message={errors.preferences} />
        </div>

        <fieldset aria-describedby={describedBy("styles")}>
          <legend id={`${id}-styles`} className="text-caption font-semibold text-ink">
            여행 스타일 <span className="text-muted">(필수, 여러 개 선택)</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {STYLE_OPTIONS.map((style) => (
              <Chip key={style} selected={values.styles.includes(style)} onToggle={() => set("styles", values.styles.includes(style) ? values.styles.filter((s) => s !== style) : [...values.styles, style].slice(0, 8))}>
                {style}
              </Chip>
            ))}
          </div>
          <ErrorText id={`${id}-styles-error`} message={errors.styles} />
        </fieldset>

        <div>
          <label htmlFor={`${id}-description`} className="text-caption font-semibold text-ink">
            상세 설명 <span className="text-muted">(필수)</span>
          </label>
          <textarea id={`${id}-description`} value={values.description} maxLength={3000} rows={8} onChange={(e) => set("description", e.target.value)} aria-invalid={Boolean(errors.description)} aria-describedby={[describedBy("description"), `${id}-description-count`].filter(Boolean).join(" ")} className="mt-1 w-full rounded-control border border-border-input bg-white p-4 text-body-md text-ink aria-[invalid=true]:border-danger" />
          <p id={`${id}-description-count`} className="mt-1 text-right text-caption text-muted">
            {values.description.length} / 3000
          </p>
          <ErrorText id={`${id}-description-error`} message={errors.description} />
        </div>

        {!editing ? (
          <div>
            <label htmlFor={`${id}-agreed`} className="flex min-h-11 cursor-pointer items-start gap-3">
              <input id={`${id}-agreed`} type="checkbox" checked={values.agreed} onChange={(e) => set("agreed", e.target.checked)} aria-invalid={Boolean(errors.agreed)} aria-describedby={describedBy("agreed")} className="mt-1 size-5 accent-[var(--color-ink)]" />
              <span className="text-body-md text-ink">동행 안전수칙을 읽었고 지키겠습니다. (필수)</span>
            </label>
            <button type="button" onClick={() => openPolicy("mate-safety")} className="ml-8 inline-flex min-h-11 items-center text-body-sm text-ink underline underline-offset-4">
              안전수칙 전문 보기
            </button>
            <ErrorText id={`${id}-agreed-error`} message={errors.agreed} />
          </div>
        ) : null}

        <div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "올리는 중…" : editing ? "수정 내용 저장하기" : "동행글 올리기"}
          </Button>
        </div>
      </form>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="일정을 바꿀까요?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                void save();
              }}
            >
              그래도 수정하기
            </Button>
          </>
        }
      >
        <Alert tone="warning" title="승인된 참가자에게 일정 변경을 알려 주세요.">
          이미 승인한 참가자가 있어요. 그래도 수정할까요?
        </Alert>
      </Modal>
    </>
  );
}

/**
 * Mate tab (section 6): permission gate → post form (create, or edit with ?edit=<id>) on the
 * left (8 cols) and the safety guide card on the right (4 cols). Contact details are blocked
 * before submit; user text is rendered as text only.
 */
export function MatePostForm() {
  return (
    <section aria-labelledby="mate-compose-title" className="bg-surface-soft">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section-tight">
        <h2 id="mate-compose-title" className="text-title-lg text-ink">
          함께 떠날 동행을 모집해 보세요
        </h2>
        <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
          국가·기간·여행 스타일을 적으면 조건이 맞는 회원이 참가를 요청합니다. 연락처는 쓰지 않고, 승인한 뒤에 대화를 이어 가세요.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-8">
            <MateAuthGate>
              {(userId) => (
                <Suspense fallback={<Skeleton className="h-12 w-full" count={6} label="작성 화면을 준비하는 중" />}>
                  <MateFormInner userId={userId} />
                </Suspense>
              )}
            </MateAuthGate>
          </div>
          <div className="md:col-span-4">
            <SafetyGuideCard />
          </div>
        </div>
      </div>
    </section>
  );
}
