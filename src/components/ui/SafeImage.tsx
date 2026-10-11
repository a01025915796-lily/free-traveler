"use client";

import Image from "next/image";
import { useState } from "react";

type SafeImageProps = {
  src: string;
  /** Describes the actual place in the photo. Required and must not be empty. */
  alt: string;
  /** Place name shown on the placeholder when the image fails to load. */
  placeName: string;
  /** Intrinsic ratio used to reserve space (prevents layout shift). Default 4:3. */
  width?: number;
  height?: number;
  /** Responsive sizes hint for next/image, e.g. "(min-width: 1280px) 400px, 100vw". */
  sizes: string;
  /** Only for the first-screen (LCP) image; everything else lazy loads. */
  priority?: boolean;
  className?: string;
};

/**
 * next/image wrapper with fixed aspect ratio, required alt text and a text placeholder
 * (surface-soft + place name) when loading fails. Allowed hosts are set in next.config.ts.
 */
export function SafeImage({
  src,
  alt,
  placeName,
  width = 4,
  height = 3,
  sizes,
  priority = false,
  className = "",
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (process.env.NODE_ENV !== "production" && alt.trim() === "") {
    throw new Error(`SafeImage: alt is required (${placeName})`);
  }

  return (
    <div className={`relative w-full overflow-hidden bg-surface-soft ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      {failed ? (
        <div role="img" aria-label={alt} className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <span className="text-caption text-muted">{placeName}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
