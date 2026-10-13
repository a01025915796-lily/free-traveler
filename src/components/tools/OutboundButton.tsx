"use client";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { OUTBOUND_LINK_PROPS, reportOutboundError, type OutboundCheck, type OutboundKind } from "@/lib/outbound";

const LABEL: Record<OutboundKind, string> = { flight: "항공편 보러 가기", hotel: "호텔 보러 가기" };

function NewTabIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 2.5h4.5V7M13.5 2.5 7 9M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3" />
    </svg>
  );
}

type OutboundButtonProps = {
  kind: OutboundKind;
  /** Result of resolveOutboundUrl(). The URL never carries the user's inputs. */
  check: OutboundCheck | null;
  disabled: boolean;
  onRetry: () => void;
};

/**
 * "항공편/호텔 보러 가기": a plain link to the checked general page — new tab, noopener,
 * noreferrer, no query. When the URL is missing or not allowed, shows a danger Alert with
 * "다시 시도" instead of navigating; the form input stays as it is.
 */
export function OutboundButton({ kind, check, disabled, onRetry }: OutboundButtonProps) {
  if (disabled || check === null) {
    return (
      <Button disabled fullWidth>
        {LABEL[kind]}
      </Button>
    );
  }

  if (!check.ok) {
    return (
      <Alert
        tone="danger"
        role="alert"
        title="지금은 외부 사이트에 연결할 수 없어요."
        action={
          <Button variant="secondary" onClick={onRetry}>
            다시 시도
          </Button>
        }
      >
        입력한 조건은 그대로 남아 있습니다.
      </Alert>
    );
  }

  return (
    <a
      href={check.url}
      {...OUTBOUND_LINK_PROPS}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-control bg-primary px-5 text-button text-white hover:bg-primary-hover"
    >
      {LABEL[kind]}
      <NewTabIcon />
      <span className="sr-only">(새 탭에서 열림)</span>
    </a>
  );
}

/** Logs a blocked outbound link (kind + reason only, never inputs or URLs). */
export function logBlocked(kind: OutboundKind, check: OutboundCheck | null) {
  if (check && !check.ok) reportOutboundError(kind, check.error);
}
