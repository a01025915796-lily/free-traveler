"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";

export const NAV_ITEMS = [
  { href: "/", label: "여행지" },
  { href: "/about", label: "대표 소개" },
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
] as const;

const ACCOUNT_HREF = "/account";

function CompassIcon() {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary-accent">
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" fill="currentColor" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 6h16M3 11h16M3 16h16" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="6" r="3" />
      <path d="M3 15.5c.8-2.8 3.1-4.5 6-4.5s5.2 1.7 6 4.5" />
    </svg>
  );
}

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Global header: wordmark + coral compass, 4 screen links, account entry (/account).
 * 72px desktop / 64px mobile, sticky, hairline bottom. Mobile shows a 44px menu button
 * that opens a sheet with the same links. The current screen gets aria-current="page".
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-white">
      <div className="mx-auto flex h-header-mobile max-w-content items-center justify-between gap-4 px-page-x md:h-header">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-[20px] font-bold leading-7 text-ink">
          <CompassIcon />
          Free Traveler
        </Link>

        <nav aria-label="주 메뉴" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`inline-flex h-11 items-center border-b-2 px-3 text-button ${
                      current ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href={ACCOUNT_HREF}
            aria-current={isCurrent(pathname, ACCOUNT_HREF) ? "page" : undefined}
            className="hidden h-11 items-center gap-2 rounded-control border border-ink px-4 text-button text-ink hover:bg-surface-soft md:inline-flex"
          >
            <PersonIcon />
            계정
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="메뉴 열기"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className="inline-flex size-11 items-center justify-center rounded-pill text-ink hover:bg-surface-soft md:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="메뉴">
        <nav aria-label="모바일 메뉴">
          <ul className="flex flex-col">
            {[...NAV_ITEMS, { href: ACCOUNT_HREF, label: "계정" }].map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-hairline-soft">
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex min-h-12 items-center text-title-sm ${current ? "text-ink underline underline-offset-8" : "text-body"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Drawer>
    </header>
  );
}
