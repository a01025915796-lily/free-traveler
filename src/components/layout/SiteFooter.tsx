import Link from "next/link";
import { PolicyLinks } from "@/components/policy/PolicyDialog";

const SHORTCUTS = [
  { href: "/", label: "여행지" },
  { href: "/about", label: "대표 소개" },
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
  { href: "/account", label: "계정" },
] as const;

const MOFA_SAFETY_URL = "https://www.0404.go.kr/";

/** Global footer: about / 5 shortcuts / 4 policy dialogs + MOFA travel safety (new tab). */
export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-surface-soft">
      <div className="mx-auto grid max-w-content gap-10 px-page-x py-12 md:grid-cols-3 md:gap-6">
        <div>
          <p className="text-[20px] font-bold leading-7 text-ink">Free Traveler</p>
          <p className="mt-3 max-w-(--container-prose) text-body-sm text-body">
            여행지를 고르고, 조건을 정리하고, 안전정보와 동행을 확인하는 여행 준비 공간입니다.
          </p>
        </div>

        <nav aria-labelledby="footer-shortcuts">
          <h2 id="footer-shortcuts" className="text-caption font-semibold text-ink">
            바로가기
          </h2>
          <ul className="mt-2">
            {SHORTCUTS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center text-body-sm text-body underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-caption font-semibold text-ink">안내</h2>
          <ul className="mt-2">
            <PolicyLinks />
            <li>
              <a
                href={MOFA_SAFETY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 text-body-sm text-body underline-offset-4 hover:underline"
              >
                외교부 해외안전여행
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 2.5h4.5V7M13.5 2.5 7 9M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3" />
                </svg>
                <span className="sr-only">(새 탭에서 열림)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-hairline">
        <p className="mx-auto max-w-content px-page-x py-4 text-caption text-muted">
          © 2026 Free Traveler · 이 사이트의 여행·안전 정보는 공식 기관의 최신 안내를 대신하지 않습니다.
        </p>
      </div>
    </footer>
  );
}
