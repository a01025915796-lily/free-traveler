"use client";

import { EmptyState } from "@/components/ui/EmptyState";

function AlertIcon() {
  return (
    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="20" cy="20" r="15" />
      <path d="M20 12v10M20 27v1" />
    </svg>
  );
}

/**
 * Error boundary for route segments. Never shows the error message or stack to the user,
 * and does not log it (no monitoring service; user input must not reach logs).
 */
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="mx-auto max-w-content px-page-x py-section-mobile md:py-section">
      <h1 className="sr-only">일시적인 문제가 생겼어요</h1>
      <EmptyState
        headingLevel="h2"
        icon={<AlertIcon />}
        title="일시적인 문제가 생겼어요"
        description="잠시 후 다시 시도해 주세요. 문제가 계속되면 홈에서 다시 시작해 주세요."
        primary={{ label: "다시 시도", onClick: retry }}
        secondary={{ label: "홈으로", href: "/" }}
      />
    </section>
  );
}
