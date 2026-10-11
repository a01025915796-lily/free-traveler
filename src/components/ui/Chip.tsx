import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex min-h-11 items-center gap-2 rounded-pill border px-4 text-body-sm font-medium text-ink transition-colors";

function CheckIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

type ToggleChipProps = {
  children: ReactNode;
  /** Selected state; exposed as aria-pressed. */
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
};

/** Filter/selection chip: 44px pill, selected = primary-tint + primary-accent border + check icon. */
export function Chip({ children, selected, onToggle, disabled, className = "" }: ToggleChipProps) {
  const state = selected
    ? "border-primary-accent bg-primary-tint"
    : "border-hairline bg-white hover:border-ink";
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-disabled={disabled ? true : undefined}
      onClick={disabled ? undefined : onToggle}
      className={`${base} ${state} ${disabled ? "cursor-not-allowed text-muted" : ""} ${className}`}
    >
      {selected ? <CheckIcon /> : null}
      {children}
    </button>
  );
}

type LinkChipProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/** Navigation chip with a trailing arrow. */
export function LinkChip({ href, children, className = "" }: LinkChipProps) {
  return (
    <Link href={href} className={`${base} border-hairline bg-white hover:border-ink ${className}`}>
      {children}
      <ArrowIcon />
    </Link>
  );
}

/** Read-only chip (e.g. travel style on a card). Not interactive. */
export function StaticChip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex h-8 items-center rounded-pill border border-hairline bg-white px-3 text-caption text-body ${className}`}>
      {children}
    </span>
  );
}
