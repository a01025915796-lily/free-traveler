"use client";

import { useEffect, useState } from "react";

const DELAY_MS = 300;

type SkeletonProps = {
  /** Size classes that match the real card (e.g. "h-48 w-full"). */
  className?: string;
  /** Number of blocks to render. */
  count?: number;
  /** Announced once for the whole group. */
  label?: string;
};

/**
 * Loading placeholder: surface-strong blocks the same size as the real content.
 * Hidden for the first 300ms so fast responses never flash a skeleton.
 */
export function Skeleton({ className = "h-24 w-full", count = 1, label = "불러오는 중" }: SkeletonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div role="status" aria-busy="true" className="contents">
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`rounded-card bg-surface-strong ${visible ? "opacity-100" : "opacity-0"} ${className}`}
        />
      ))}
    </div>
  );
}
