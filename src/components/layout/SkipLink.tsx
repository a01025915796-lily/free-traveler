/** "본문으로 건너뛰기" link before the header; visible only when focused. Target: <main id="main-content">. */
export function SkipLink({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-control focus:bg-white focus:px-4 focus:text-button focus:text-ink focus:shadow-raised"
    >
      본문으로 건너뛰기
    </a>
  );
}
