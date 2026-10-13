"use client";

import { useCallback, useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { getOutboundSettings, type OutboundSettings } from "@/lib/db/settings";
import { resolveOutboundUrl, type OutboundCheck, type OutboundKind } from "@/lib/outbound";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { countryOptions, regionAfterCountryChange, regionsOf } from "@/lib/trip/regions";
import { minDate, validateFlight, validateHotel } from "@/lib/trip/validation";
import type { CountryCode } from "@/types/content";
import { NonTransferNotice } from "./NonTransferNotice";
import { OutboundButton, logBlocked } from "./OutboundButton";
import { TripSummaryCard, type TripValues } from "./TripSummaryCard";

/*
 * Flight / hotel condition form. PRIVACY: the inputs (country, city, dates) live only in this
 * component's React state. They are never put in the URL, cookies, localStorage, sent to
 * Supabase or any server, logged or tracked. The only network read here is app_settings
 * (the outbound URL), which carries no user input.
 */

type FieldKey = keyof TripValues;
type Errors = Partial<Record<FieldKey, string>>;

const COPY = {
  flight: {
    title: "어디로, 언제 떠나시나요?",
    description: "여행할 국가와 도시, 출발일과 귀국일을 입력하세요.",
    start: "출발일",
    end: "귀국일",
  },
  hotel: {
    title: "어디에서, 언제 머무시나요?",
    description: "머무를 국가와 도시, 체크인과 체크아웃 날짜를 입력하세요.",
    start: "체크인",
    end: "체크아웃",
  },
} as const;

const EMPTY: TripValues = { country: "", region: "", start: "", end: "" };

function validate(kind: OutboundKind, v: TripValues): Errors {
  if (kind === "flight") {
    const { errors } = validateFlight({ country: v.country, region: v.region, departDate: v.start, returnDate: v.end });
    return { country: errors.country, region: errors.region, start: errors.departDate, end: errors.returnDate };
  }
  const { errors } = validateHotel({ country: v.country, region: v.region, checkIn: v.start, checkOut: v.end });
  return { country: errors.country, region: errors.region, start: errors.checkIn, end: errors.checkOut };
}

const fieldClass =
  "h-12 w-full rounded-control border border-border-input bg-white px-4 text-body-md text-ink disabled:cursor-not-allowed disabled:bg-surface-soft disabled:text-muted aria-[invalid=true]:border-danger";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 flex items-center gap-1 text-body-sm text-danger">
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 6v4.5M10 13.5v.5" />
      </svg>
      {message}
    </p>
  );
}

type FormProps = {
  kind: OutboundKind;
  values: TripValues;
  errors: Errors;
  onChange: (next: TripValues) => void;
  onSubmit: () => void;
};

/** The 4-field form: country → city (disabled until a country is chosen) → start → end. */
export function TripConditionForm({ kind, values, errors, onChange, onSubmit }: FormProps) {
  const id = useId();
  const copy = COPY[kind];
  const regions = regionsOf(values.country as CountryCode | "");
  const today = minDate();
  const describedBy = (key: FieldKey, help?: string) => [errors[key] ? `${id}-${key}-error` : "", help ?? ""].filter(Boolean).join(" ") || undefined;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={submit} noValidate aria-labelledby={`${id}-title`} className="flex flex-col gap-5">
      <div>
        <h2 id={`${id}-title`} className="text-title-lg text-ink">
          {copy.title}
        </h2>
        <p className="mt-2 text-body-md text-body">{copy.description}</p>
      </div>
      <NonTransferNotice />

      <div>
        <label htmlFor={`${id}-country`} className="text-caption font-semibold text-ink">
          국가 <span className="text-muted">(필수)</span>
        </label>
        <select
          id={`${id}-country`}
          value={values.country}
          aria-invalid={Boolean(errors.country)}
          aria-describedby={describedBy("country")}
          onChange={(e) => onChange({ ...values, country: e.target.value, region: regionAfterCountryChange(e.target.value as CountryCode, values.region) ?? "" })}
          className={`mt-1 ${fieldClass}`}
        >
          <option value="">국가를 선택하세요</option>
          {countryOptions().map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        <FieldError id={`${id}-country-error`} message={errors.country} />
      </div>

      <div>
        <label htmlFor={`${id}-region`} className="text-caption font-semibold text-ink">
          지역·도시 <span className="text-muted">(필수)</span>
        </label>
        <select
          id={`${id}-region`}
          value={values.region}
          disabled={!values.country}
          aria-invalid={Boolean(errors.region)}
          aria-describedby={describedBy("region", values.country ? undefined : `${id}-region-help`)}
          onChange={(e) => onChange({ ...values, region: e.target.value })}
          className={`mt-1 ${fieldClass}`}
        >
          <option value="">도시를 선택하세요</option>
          {regions.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>
        {!values.country ? (
          <p id={`${id}-region-help`} className="mt-1 text-body-sm text-muted">
            국가를 먼저 선택하세요.
          </p>
        ) : null}
        <FieldError id={`${id}-region-error`} message={errors.region} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {(["start", "end"] as const).map((key) => (
          <div key={key}>
            <label htmlFor={`${id}-${key}`} className="text-caption font-semibold text-ink">
              {copy[key]} <span className="text-muted">(필수)</span>
            </label>
            <input
              id={`${id}-${key}`}
              type="date"
              value={values[key]}
              min={key === "end" && values.start ? values.start : today}
              aria-invalid={Boolean(errors[key])}
              aria-describedby={describedBy(key)}
              onChange={(e) => onChange({ ...values, [key]: e.target.value })}
              className={`mt-1 ${fieldClass}`}
            />
            <FieldError id={`${id}-${key}-error`} message={errors[key]} />
          </div>
        ))}
      </div>

      <div>
        <Button type="submit">요약 확인하기</Button>
      </div>
    </form>
  );
}

/**
 * Flight or hotel planner: owns the input state for one tab (kept while switching tabs because
 * the tab panels stay mounted), shows the form (7 cols) and the sticky summary card (5 cols).
 */
export function TripPlanner({
  kind,
  sectionIds,
}: {
  kind: OutboundKind;
  /** Optional DOM ids for the contract sections (form, summary); unique per page. */
  sectionIds?: { form: string; summary: string };
}) {
  const [values, setValues] = useState<TripValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<"editing" | "invalid" | "summary">("editing");
  const [settings, setSettings] = useState<OutboundSettings | null | undefined>(undefined);

  const loadSettings = useCallback(async () => {
    try {
      const result = await getOutboundSettings(getSupabaseBrowserClient());
      setSettings(result.ok ? result.data : null);
    } catch {
      setSettings(null);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getOutboundSettings(getSupabaseBrowserClient())
      .then((result) => {
        if (active) setSettings(result.ok ? result.data : null);
      })
      .catch(() => {
        if (active) setSettings(null);
      });
    return () => {
      active = false;
    };
  }, []);

  // settings === undefined while loading; null when unavailable → default constant is used.
  const check: OutboundCheck | null = useMemo(
    () => (settings === undefined ? null : resolveOutboundUrl(kind, settings)),
    [kind, settings],
  );

  useEffect(() => {
    if (phase === "summary") logBlocked(kind, check);
  }, [phase, kind, check]);

  const change = (next: TripValues) => {
    setValues(next);
    if (phase === "summary") setPhase("editing");
    if (Object.keys(errors).length > 0) setErrors(Object.fromEntries(Object.entries(validate(kind, next)).filter(([, m]) => m)) as Errors);
  };

  const submit = () => {
    const found = Object.fromEntries(Object.entries(validate(kind, values)).filter(([, m]) => m)) as Errors;
    setErrors(found);
    setPhase(Object.keys(found).length === 0 ? "summary" : "invalid");
  };

  return (
    <section className="bg-surface-soft">
      <div className="mx-auto grid max-w-content gap-8 px-page-x py-section-mobile md:grid-cols-12 md:gap-6 md:py-section-tight">
        <div id={sectionIds?.form} className="md:col-span-7">
          <TripConditionForm kind={kind} values={values} errors={errors} onChange={change} onSubmit={submit} />
        </div>
        <div id={sectionIds?.summary} className="md:col-span-5">
          <div className="md:sticky md:top-36">
            <TripSummaryCard
              kind={kind}
              values={values}
              phase={phase}
              onEdit={() => setPhase("editing")}
              outbound={<OutboundButton kind={kind} check={check} disabled={phase !== "summary"} onRetry={loadSettings} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Flight tab content (sections 3–4). */
export function FlightPanel({ sectionIds }: { sectionIds?: { form: string; summary: string } }) {
  return <TripPlanner kind="flight" sectionIds={sectionIds} />;
}
