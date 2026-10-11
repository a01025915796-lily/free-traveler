import { SemanticIcon, type SemanticTone } from "./Alert";

const toneClass: Record<SemanticTone, string> = {
  danger: "border-danger-border bg-danger-bg text-danger",
  warning: "border-warning-border bg-warning-bg text-warning",
  info: "border-info-border bg-info-bg text-info",
  success: "border-success-border bg-success-bg text-success",
  neutral: "border-neutral-border bg-neutral-bg text-neutral",
};

type BadgeProps = {
  tone: SemanticTone;
  /** Visible text label (status is never shown by color alone). */
  children: string;
  className?: string;
};

/** 24px pill status badge: semantic color + icon + text. */
export function Badge({ tone, children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-pill border px-2.5 text-caption ${toneClass[tone]} ${className}`}
    >
      <SemanticIcon tone={tone} size={14} />
      {children}
    </span>
  );
}
