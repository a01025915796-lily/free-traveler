"use client";

import { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { GALLERY } from "@/data/curator";

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d={dir === "prev" ? "M12 4 6 10l6 6" : "m8 4 6 6-6 6"} />
    </svg>
  );
}

/**
 * Section 6: 8 photos from different places with captions. Desktop 4×2 grid; mobile shows one
 * photo at a time with 44px 이전/다음 buttons and an "n / 8" position label.
 */
export function PhotoGallery() {
  const [index, setIndex] = useState(0);
  const count = GALLERY.length;
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);
  const current = GALLERY[index];

  return (
    <section aria-labelledby="about-gallery-title" className="bg-surface-soft">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section">
        <h2 id="about-gallery-title" className="text-title-lg text-ink">
          길 위에서 담은 장면들
        </h2>
        <p className="mt-3 max-w-(--container-prose) text-body-md text-body">서로 다른 여덟 곳에서 만난 풍경입니다. 사진 아래에 장소를 적었습니다.</p>

        <ul className="mt-8 hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
          {GALLERY.map((photo) => (
            <li key={photo.place}>
              <figure>
                <SafeImage src={photo.image.src} alt={photo.image.alt} placeName={photo.place} sizes="(min-width: 1280px) 300px, 50vw" className="rounded-card" />
                <figcaption className="mt-2 text-caption text-muted">{photo.place}</figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="mt-8 md:hidden" role="group" aria-roledescription="carousel" aria-label="여행 사진">
          <figure aria-live="polite">
            <SafeImage src={current.image.src} alt={current.image.alt} placeName={current.place} sizes="100vw" className="rounded-card" />
            <figcaption className="mt-2 text-caption text-muted">{current.place}</figcaption>
          </figure>
          <div className="mt-3 flex items-center justify-between">
            <button type="button" onClick={() => go(-1)} aria-label="이전 사진" className="inline-flex size-11 items-center justify-center rounded-pill border border-hairline bg-white text-ink">
              <Arrow dir="prev" />
            </button>
            <span className="text-body-sm text-body">
              {index + 1} / {count}
            </span>
            <button type="button" onClick={() => go(1)} aria-label="다음 사진" className="inline-flex size-11 items-center justify-center rounded-pill border border-hairline bg-white text-ink">
              <Arrow dir="next" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
