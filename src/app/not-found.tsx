import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요",
  robots: { index: false },
};

function MapIcon() {
  return (
    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M5 10l10-4 10 4 10-4v24l-10 4-10-4-10 4V10Z" />
      <path d="M15 6v24M25 10v24" />
    </svg>
  );
}

/** 404 screen inside the shared header/footer layout. */
export default function NotFound() {
  return (
    <section className="mx-auto max-w-content px-page-x py-section-mobile md:py-section">
      <h1 className="sr-only">찾으시는 페이지가 없어요</h1>
      <EmptyState
        headingLevel="h2"
        icon={<MapIcon />}
        title="찾으시는 페이지가 없어요"
        description="주소가 바뀌었거나 삭제된 페이지입니다. 홈에서 다시 시작하거나 여행지를 둘러보세요."
        primary={{ label: "홈으로", href: "/" }}
        secondary={{ label: "여행지 둘러보기", href: "/?scope=all" }}
      />
    </section>
  );
}
