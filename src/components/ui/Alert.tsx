import type { ReactNode } from "react";

export type SemanticTone = "danger" | "warning" | "info" | "success" | "neutral";

const toneClass: Record<SemanticTone, string> = {
  danger: "border-danger-border bg-danger-bg text-danger",
  warning: "border-warning-border bg-warning-bg text-warning",
  info: "border-info-border bg-info-bg text-info",
  success: "border-success-border bg-success-bg text-success",
  neutral: "border-neutral-border bg-neutral-bg text-neutral",
};

/** Text label read before the title so state is never conveyed by color alone. */
export const toneLabel: Record<SemanticTone, string> = {
  danger: "오류",
  warning: "주의",
  info: "안내",
  success: "완료",
  neutral: "알림",
};

export function SemanticIcon({ tone, size = 20 }: { tone: SemanticTone; size?: number }) {
  const common = { "aria-hidden": true, width: size, height: size, viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.75 } as const;
  switch (tone) {
    case "danger":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7.5" />
          <path d="M10 6v4.5M10 13.5v.5" />
        </svg>
      );
    case "warning":
      return (
        <svg {...common}>
          <path d="M10 3 18 17H2L10 3Z" />
          <path d="M10 8v4M10 14.5v.5" />
        </svg>
      );
    case "success":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7.5" />
          <path d="m6.5 10 2.5 2.5 4.5-5" />
        </svg>
      );
    case "neutral":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7.5" />
          <path d="M6.5 10h7" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7.5" />
          <path d="M10 9v5M10 6v.5" />
        </svg>
      );
  }
}

type AlertProps = {
  tone: SemanticTone;
  title: string;
  children?: ReactNode;
  /** Use "alert" for errors raised by a user action so they are announced immediately. */
  role?: "alert" | "status";
  /** Optional action (e.g. a "다시 시도" button). Notices and warnings have no close button. */
  action?: ReactNode;
  className?: string;
};

/** Semantic alert: tinted background + border + icon + bold title + description. */
export function Alert({ tone, title, children, role, action, className = "" }: AlertProps) {
  return (
    <div role={role} className={`flex gap-3 rounded-control border p-4 ${toneClass[tone]} ${className}`}>
      <span className="mt-0.5 shrink-0">
        <SemanticIcon tone={tone} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-md font-semibold">
          <span className="sr-only">{toneLabel[tone]}: </span>
          {title}
        </p>
        {children ? <div className="mt-1 text-body-sm text-body">{children}</div> : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  );
}
