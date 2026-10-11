"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { EMPTY_FILTERS, SCOPE_LABEL, type ScopeFilter } from "@/lib/destinations/search";
import { homeHref } from "./FilterBar";

const SCOPES: ScopeFilter[] = ["all", "domestic", "overseas"];

/**
 * Pill search box: scope select + keyword + 검색. Submitting navigates to the home search
 * result mode (?q=&scope=). The keyword only goes to the URL query — never to a server.
 */
export function SearchBar({ initialQuery = "", initialScope = "all" }: { initialQuery?: string; initialScope?: ScopeFilter }) {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState(initialQuery);
  const [scope, setScope] = useState<ScopeFilter>(initialScope);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(homeHref({ ...EMPTY_FILTERS, q: q.trim().slice(0, 50), scope }));
  };

  return (
    <form role="search" aria-label="여행지 검색" onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-2 rounded-card border border-hairline bg-white p-2 shadow-raised md:flex-row md:items-center md:rounded-pill md:p-1.5 md:pl-2">
        <div className="relative">
          <label htmlFor={`${id}-scope`} className="sr-only">
            구분
          </label>
          <select
            id={`${id}-scope`}
            value={scope}
            onChange={(e) => setScope(e.target.value as ScopeFilter)}
            className="h-11 w-full appearance-none rounded-pill bg-surface-soft px-4 pr-9 text-body-sm font-semibold text-ink md:w-auto"
          >
            {SCOPES.map((s) => (
              <option key={s} value={s}>
                {SCOPE_LABEL[s]}
              </option>
            ))}
          </select>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
        <label htmlFor={`${id}-q`} className="sr-only">
          검색어
        </label>
        <input
          id={`${id}-q`}
          type="search"
          value={q}
          maxLength={50}
          onChange={(e) => setQ(e.target.value)}
          placeholder="여행지, 국가, 테마로 검색해 보세요"
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-pill px-4 text-body-md text-ink placeholder:text-muted"
        />
        <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-primary px-6 text-button text-white hover:bg-primary-hover">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" />
          </svg>
          검색
        </button>
      </div>
    </form>
  );
}
