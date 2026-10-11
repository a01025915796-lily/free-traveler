import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { StaticChip } from "@/components/ui/Chip";
import { COUNTRIES } from "@/data/countries";
import { getDestination } from "@/data/destinations";
import type { MatePostWithOwner } from "@/lib/db/mates";
import { AGE_BAND_LABEL } from "@/lib/db/profiles";
import { POST_STATUS_LABEL, effectivePostStatus } from "@/lib/mates/state";

function countryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.nameKo ?? code;
}

/** Region label: destination name when the slug matches one, otherwise the slug itself. */
export function regionName(slug: string): string {
  return getDestination(slug)?.name ?? slug;
}

export function formatPeriod(start: string, end: string): string {
  const f = (d: string) => d.slice(5).replace("-", ".");
  return start === end ? f(start) : `${f(start)} ~ ${f(end)}`;
}

/**
 * Mate card (no photo): status badge → title → country·region · period · capacity → travel
 * styles (read-only) → author nickname · age band. Only public profile fields are shown.
 * User text is rendered as text (never HTML).
 */
export function MateCard({ post, href, now }: { post: MatePostWithOwner; href?: string; now?: Date }) {
  const status = effectivePostStatus(post, now);
  const link = href ?? `/mates?post=${post.id}`;
  return (
    <article className="relative flex h-full flex-col gap-2 rounded-card border border-hairline bg-white p-5 transition-shadow hover:shadow-raised focus-within:shadow-raised">
      <div>
        <Badge tone={status === "OPEN" ? "success" : "neutral"}>{POST_STATUS_LABEL[status]}</Badge>
      </div>
      <h3 className="text-title-sm text-ink">
        <Link href={link} className="after:absolute after:inset-0 after:content-['']">
          {post.title}
        </Link>
      </h3>
      <p className="text-body-sm text-body">
        {countryName(post.country_code)}·{regionName(post.region_slug)} · {formatPeriod(post.start_date, post.end_date)} · {post.capacity}명 모집
      </p>
      {post.travel_styles.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5" aria-label="여행 스타일">
          {post.travel_styles.slice(0, 4).map((style) => (
            <li key={style}>
              <StaticChip>{style}</StaticChip>
            </li>
          ))}
        </ul>
      ) : null}
      {post.owner ? (
        <p className="mt-auto pt-2 text-caption text-muted">
          {post.owner.nickname} · {AGE_BAND_LABEL[post.owner.age_band]}
        </p>
      ) : null}
    </article>
  );
}
