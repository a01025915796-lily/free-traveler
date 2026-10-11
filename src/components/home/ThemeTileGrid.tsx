import Link from "next/link";
import { THEMES } from "@/data/destinations";
import type { ThemeId } from "@/types/content";

const ICON_PATHS: Record<ThemeId, string> = {
  beach: "M3 18c2 0 2-1.5 4-1.5S9 18 11 18s2-1.5 4-1.5S17 18 19 18M5 13a7 7 0 0 1 14 0M12 6V3",
  city: "M4 20V9l5-3v14M9 20V4l6 3v13M15 20v-9l5 2v7M3 20h18",
  history: "M4 20h16M6 20V10M10 20V10M14 20V10M18 20V10M3 10h18L12 4 3 10Z",
  food: "M7 3v8a2 2 0 0 0 4 0V3M9 11v10M16 3c-1.7 1.3-2.5 3.3-2.5 6 0 1.5 1 2.5 2.5 2.5V21",
  nature: "M12 3 4 17h16L12 3ZM12 17v4M8.5 11h7",
  weekend: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4",
};

/** Section 4: 6 theme tiles (3×2, no photos). Each tile opens search results for that theme. */
export function ThemeTileGrid() {
  return (
    <section aria-labelledby="home-theme-title" className="bg-surface-soft">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section">
        <h2 id="home-theme-title" className="text-title-lg text-ink">
          이번 여행에서 무엇을 하고 싶으세요?
        </h2>
        <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
          여행의 이유를 하나 고르면 그에 맞는 여행지를 바로 추려 드립니다.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {THEMES.map((theme) => (
            <li key={theme.id}>
              <Link
                href={`/?theme=${theme.id}`}
                className="flex h-full min-h-24 items-start gap-4 rounded-card border border-hairline bg-white p-5 transition-shadow hover:shadow-raised"
              >
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill bg-primary-tint text-primary-accent">
                  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICON_PATHS[theme.id]} />
                  </svg>
                </span>
                <span>
                  <span className="block text-title-sm text-ink">{theme.label}</span>
                  <span className="mt-1 block text-body-sm text-body">{theme.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
