import Link from "next/link";
import { getCountry } from "@/data/countries";
import type { CountrySafety } from "@/data/safety";
import { summarizeSafety } from "@/lib/safety/stale";
import { AdvisoryBadge, FreshnessBadge } from "./AdvisoryBadge";

/**
 * Safety card (no photo): country → advisory badge → one-line summary → last checked date →
 * "재확인 권장" when stale. Opens the country safety drawer (?safety=<code>).
 */
export function SafetyCard({ safety, now }: { safety: CountrySafety; now?: Date }) {
  const summary = summarizeSafety(safety, now);
  const country = getCountry(safety.countryCode);
  return (
    <article className="relative flex h-full flex-col gap-2 rounded-card border border-hairline bg-white p-5 transition-shadow hover:shadow-raised focus-within:shadow-raised">
      <h3 className="text-title-sm text-ink">
        <Link href={`/?safety=${safety.countryCode}`} scroll={false} className="after:absolute after:inset-0 after:content-['']">
          {country.nameKo}
        </Link>
      </h3>
      <div className="flex flex-wrap gap-2">
        <AdvisoryBadge level={summary.highest} />
        <FreshnessBadge stale={summary.stale} />
      </div>
      <p className="text-body-sm text-body">{safety.summary}</p>
      <p className="mt-auto text-caption text-muted">최종 확인 {summary.verifiedLabel}</p>
    </article>
  );
}
