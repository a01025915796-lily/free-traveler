import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  /** Element to render; use "li" inside lists. */
  as?: "article" | "div" | "li" | "section";
  /** Adds the single raised shadow on hover/focus-within. */
  interactive?: boolean;
  className?: string;
};

/** D-001 Card: white, 1px hairline, 14px radius, shadow only on hover. */
export function Card({ children, as: Tag = "article", interactive = false, className = "" }: CardProps) {
  const hover = interactive ? "transition-shadow hover:shadow-raised focus-within:shadow-raised" : "";
  return (
    <Tag className={`overflow-hidden rounded-card border border-hairline bg-white ${hover} ${className}`}>{children}</Tag>
  );
}

/** Tinted tile without border (e.g. Stat Tile). */
export function SoftCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-card bg-surface-soft p-6 ${className}`}>{children}</div>;
}
