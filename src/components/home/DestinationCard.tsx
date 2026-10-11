"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { useToast } from "@/components/ui/Toast";
import { getCountry } from "@/data/countries";
import { getTheme } from "@/data/destinations";
import { favoritesServerSnapshot, favoritesSnapshot, parseFavorites, subscribeFavorites, toggleFavorite } from "@/lib/favorites";
import type { Destination } from "@/types/content";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" className={filled ? "text-primary-accent" : "text-ink"}>
      <path
        d="M10 17s-6.5-3.9-6.5-8.6A3.6 3.6 0 0 1 10 6.3a3.6 3.6 0 0 1 6.5 2.1C16.5 13.1 10 17 10 17Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Favorite toggle (44px, aria-pressed). Saved in this browser only (localStorage). */
export function FavoriteButton({ slug, name }: { slug: string; name: string }) {
  const toast = useToast();
  const raw = useSyncExternalStore(subscribeFavorites, favoritesSnapshot, favoritesServerSnapshot);
  const isFav = useMemo(() => parseFavorites(raw).includes(slug), [raw, slug]);

  const onClick = () => {
    const result = toggleFavorite(slug);
    if (!result.saved) {
      toast("이 브라우저에서는 즐겨찾기를 저장할 수 없어요.", "warning");
      return;
    }
    toast(result.added ? `${name}을(를) 즐겨찾기에 저장했어요.` : `${name}을(를) 즐겨찾기에서 뺐어요.`, "success");
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isFav}
      aria-label={`${name} 즐겨찾기`}
      className="on-photo inline-flex size-11 items-center justify-center rounded-pill bg-white shadow-raised hover:bg-surface-soft"
    >
      <HeartIcon filled={isFav} />
    </button>
  );
}

type DestinationCardProps = {
  destination: Destination;
  /** Responsive sizes hint for the photo. */
  sizes?: string;
  /** Larger title for Bento hero cards. */
  size?: "default" | "large";
  headingLevel?: "h3" | "h4";
};

/**
 * Destination card: 4:3 photo (14px radius) → name → country·region → 2 themes, with a
 * favorite button on the photo. The whole card opens the detail drawer (?dest=<slug>).
 */
export function DestinationCard({
  destination: d,
  sizes = "(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw",
  size = "default",
  headingLevel: Heading = "h3",
}: DestinationCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-white transition-shadow hover:shadow-raised focus-within:shadow-raised">
      <SafeImage src={d.image.src} alt={d.image.alt} placeName={d.name} sizes={sizes} />
      <div className="flex flex-1 flex-col p-4">
        <Heading className={size === "large" ? "text-title-md text-ink" : "text-title-sm text-ink"}>
          {/* Stretched link: the whole card is one link; the favorite button sits above it. */}
          <Link href={`/?dest=${d.slug}`} scroll={false} className="after:absolute after:inset-0 after:content-['']">
            {d.name}
          </Link>
        </Heading>
        <p className="mt-1 text-body-sm text-muted">
          {getCountry(d.countryCode).nameKo} · {d.region}
        </p>
        {size === "large" ? <p className="mt-2 text-body-sm text-body">{d.summary}</p> : null}
        <p className="mt-2 text-caption text-body">{d.themes.slice(0, 2).map((t) => getTheme(t).label).join(" · ")}</p>
      </div>
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton slug={d.slug} name={d.name} />
      </div>
    </article>
  );
}
