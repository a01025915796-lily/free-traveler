# Free Traveler Architecture

| 항목 | 내용 |
|---|---|
| 작성일 | 2026-10-10 |
| 기준 | `package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv` |
| 현재 코드 상태 | Create Next App 초기 상태(`src/app/page.tsx`, `layout.tsx`, `globals.css`). 구현 Task 61개 미착수 |

이 문서는 구현 경계를 정한다. 무엇을 어디에서 처리하고, 무엇을 하지 않는지가 기준이다. 화면 세부는 `UI_CONTRACT.md`, 요구사항별 구현 기준은 `06_SRS_UIUX_REVISED.md`, 작업 단위는 `TASKS/`를 따른다.

---

## 1. 기술 스택

| 영역 | 기술 | 상태 |
|---|---|---|
| 프레임워크 | Next.js `16.4.0` App Router | 설치됨 |
| UI 런타임 | React `19.3.0` | 설치됨 |
| 언어 | TypeScript `^5`, `strict: true` | 설치됨 |
| 스타일 | Tailwind CSS `^4` (`@theme` 토큰은 D-001) | 설치됨 |
| 린트 | ESLint `^9`, `eslint-config-next` | 설치됨 |
| 인증·DB | `@supabase/supabase-js`, `@supabase/ssr` | SETUP-PROJECT에서 설치 |
| 단위·통합 테스트 | Vitest | SETUP-PROJECT에서 설치 |
| E2E | `@playwright/test`(Chromium), `@axe-core/playwright` | SETUP-PROJECT에서 설치 |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | SETUP-CI에서 작성 |
| 배포 | Vercel (Git 연결, Preview 자동 생성) | DEPLOY-VERCEL-SUPABASE에서 설정 |

Next.js 16 규칙: `page.tsx`의 `searchParams`는 `Promise`이므로 `await`한다. Client Component에서 `useSearchParams`를 쓰면 `<Suspense>`로 감싼다(없으면 production build 실패). Middleware 대신 `src/proxy.ts`를 쓴다.

---

## 2. 화면과 Route

디자인 Screen은 5개(핵심 4, 보조 1)다. 상세·안전정보·작성·계정 기능은 Screen 안의 탭·패널·Drawer·Modal과 URL query로 제공하며 별도 Route를 만들지 않는다.

| Screen | 구분 | Route | Page Entry | Page Owner Task |
|---|---|---|---|---|
| SCR-001 메인 | 핵심 | `/` | `src/app/page.tsx` | PAGE-SCR001 |
| SCR-002 대표 소개 | 보조 | `/about` | `src/app/about/page.tsx` | PAGE-SCR002 |
| SCR-003 통합 여행 준비 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PAGE-SCR003 |
| SCR-004 동행 조회 | 핵심 | `/mates` | `src/app/mates/page.tsx` | PAGE-SCR004 |
| SCR-005 계정·관리 | 핵심 | `/account` | `src/app/account/page.tsx` | PAGE-SCR005 |

기술 Route(디자인 Screen 아님):

| Route | Entry | 역할 |
|---|---|---|
| `/auth/callback` | `src/app/auth/callback/page.tsx` | Supabase 가입 인증·비밀번호 재설정 링크 처리 (Client Component page, Route Handler 아님) |
| 404 | `src/app/not-found.tsx` | 홈·여행지 둘러보기 복구 |
| 렌더링 오류 | `src/app/error.tsx` | 다시 시도·홈 복구 |
| 모든 요청 | `src/proxy.ts` | Supabase 세션 쿠키 갱신만 수행 |

`src/app` 아래 `page.tsx`는 위 5개 + `auth/callback` 6개뿐이다. `route.ts`, `src/app/api/*`, Server Action(`"use server"`)은 만들지 않는다(UT-10이 검사).

---

## 3. 디렉터리 구조

`TASKS/TASK_MANIFEST.csv`의 Expected Files 141개 기준이다.

```
src/
  app/                 Route Page (Page Owner만 page.tsx 소유), layout, not-found, error, auth/callback
  components/
    layout/            SiteHeader, SiteFooter, SkipLink            (GLOBAL-LAYOUT)
    ui/                Button, Chip, Card, Drawer, Modal, Tabs, Alert, Badge, Toast,
                       EmptyState, Skeleton, SafeImage, StepGuide, CtaBanner, StatTile
    policy/            PolicyDialog
    home/ safety/      SCR-001 영역
    about/             SCR-002 영역
    tools/             SCR-003 영역
    mates/             SCR-004 영역 (MateCard는 SCR-001과 공유)
    account/           SCR-005 영역
  data/                destinations.ts, countries.ts, safety.ts, curator.ts, policies.ts  (정적 데이터)
  types/               content.ts
  lib/
    supabase/          client.ts (Browser), server.ts (Server, 읽기 전용)
    auth/              session.ts
    db/                profiles, mates, applications, blocks, reports, settings (DB 접근 계층)
    destinations/ trip/ mates/ safety/   순수 함수 (검색·날짜·연락처 탐지·상태 전이·stale)
    outbound.ts favorites.ts share.ts
  proxy.ts
supabase/              migrations/0001_schema.sql, 0002_rls.sql, seed.sql
e2e/                   public.spec.ts, travel-tools.spec.ts, mate-auth.spec.ts
.github/workflows/     ci.yml
docs/checks/           TEST_ACCOUNTS.md, MANUAL_CHECK.md, RELEASE_*.md
```

---

## 4. Server Component와 Client Component

기본은 Server Component다. 상태·브라우저 API·이벤트가 필요한 부분만 Client Component(`"use client"`)로 나눈다.

| 위치 | Server Component | Client Component |
|---|---|---|
| `layout.tsx` | Root Layout, Footer, metadata 기본값 | Header의 Mobile 메뉴 Sheet·계정 진입 표시, Toast 영역, 정책 Modal |
| SCR-001 `/` | `page.tsx`(searchParams 해석, 정적 데이터 import, `generateMetadata`), 추천·테마·안전 Card 목록 | 검색창·필터 바(URL 갱신), 여행지 상세·안전정보 Drawer, 즐겨찾기 버튼, 공유, 최근 동행글(Supabase 조회·Skeleton·Empty·Error) |
| SCR-002 `/about` | `page.tsx`와 대부분의 영역(정적) | Gallery Mobile 스와이프 |
| SCR-003 `/travel-tools` | `page.tsx`(metadata), Intro·Tip 정적 영역 | 탭, 항공·숙소 Form·요약·외부 이동, 동행 권한 안내·작성 Form |
| SCR-004 `/mates` | `page.tsx`(metadata), Intro·신청 방법·안전 안내 | 필터·목록·상세 패널/Drawer·참가 요청·신고·차단 |
| SCR-005 `/account` | `page.tsx`(metadata) | 인증 Card, 프로필·성인 확인, 내 활동, 관리 탭 (모두 세션 의존) |
| 기술 Route | `not-found.tsx` | `auth/callback/page.tsx`, `error.tsx` |

규칙:
- 정적 데이터(`src/data`)는 Server Component에서 import해 HTML로 내보낸다.
- Supabase 쓰기는 Client Component에서 Browser Client로만 한다.
- 비밀값을 Client Component로 넘기지 않는다. 클라이언트가 보는 환경변수는 `NEXT_PUBLIC_*` 3개뿐이다.

---

## 5. 데이터 경계

| 데이터 | 저장 위치 | 읽기 | 쓰기 |
|---|---|---|---|
| 여행지 (국내 10, 해외 15개국 30개 도시) | `src/data/destinations.ts`, `countries.ts` | Server Component import | 코드 수정 + 재배포 |
| 국가 안전정보 (15개국) | `src/data/safety.ts` | Server Component import | 코드 수정 + 재배포 |
| 대표 콘텐츠 (`free_traveler`) | `src/data/curator.ts` | Server Component import | 코드 수정 + 재배포 |
| 정책 문서 | `src/data/policies.ts` | 정책 Modal | 코드 수정 + 재배포 |
| 즐겨찾기 | 브라우저 `localStorage` (slug 배열) | Client Component | Client Component (`try/catch`) |
| 항공·숙소 입력값 | Client Component 메모리 상태 | 같은 Component | 저장하지 않음 (§6) |
| 회원·동행·요청·차단·신고·외부 URL | Supabase PostgreSQL (§7) | Browser Client(목록·상세), Server Client(읽기 전용) | Browser Client + RLS |
| 이미지 | 일반 인터넷 URL + 실제 장소 설명 `alt` | `next/image` (`images.remotePatterns`) | 정적 데이터에 URL 기록 |

계산으로 처리하는 상태:
- **자동 마감:** 조회 시 `end_date < 오늘(Asia/Seoul)`이면 마감으로 봅니다. 배치 작업은 없습니다.
- **안전정보 stale:** 렌더링 시 `verifiedAt + 7일 < 현재`로 판단합니다.
- **알림:** Toast와 화면 상태 배지로 보여 줍니다. 이메일은 Supabase Auth 기본 메일(가입 인증·비밀번호 재설정)만 씁니다.

---

## 6. 항공·숙소 입력 경계

| 규칙 | 내용 |
|---|---|
| 보관 위치 | SCR-003 항공·숙소 Form Client Component의 일시 상태(React state)만 사용. 탭을 바꿔도 같은 페이지 안에서만 유지 |
| 전송 금지 | 입력값(국가·도시·날짜)을 API·Supabase·DB·URL(path·query·hash)·쿠키·`localStorage`·`sessionStorage`·서버 로그·콘솔 로그·분석 도구로 보내지 않는다 |
| URL | `/travel-tools?tab=flight\|hotel`처럼 탭 이름만 query에 쓴다 |
| 외부 이동 | 허용 호스트(`www.google.com`, `www.booking.com`)의 `https:` 일반 페이지를 query 없이 새 탭(`noopener,noreferrer`)으로 연다. 주소는 `app_settings` 또는 코드 기본값 |
| 서버 코드 | 항공·숙소용 API·Route Handler·Server Action 없음 |
| 검증 | 날짜 검증은 순수 함수(`src/lib/trip/validation.ts`, UNIT-TRAVEL-DATES). E2E-TRAVEL-TOOLS가 입력 중 발생한 모든 네트워크 요청과 URL에 입력값이 없음을 단언 |

---

## 7. Supabase

Supabase는 **인증과 동행 기능**에만 쓴다. 여행지·안전·대표 콘텐츠는 DB에 넣지 않는다.

### 7.1 Client

| Client | 파일 | 사용처 | 권한 |
|---|---|---|---|
| Browser Client | `src/lib/supabase/client.ts` (`createBrowserClient`) | Client Component의 조회와 모든 쓰기 | Publishable Key + 사용자 세션, RLS 적용 |
| Server Client | `src/lib/supabase/server.ts` (`createServerClient` + cookies) | Server Component의 읽기 전용 조회(세션·역할 확인 등) | 사용자 세션 쿠키, RLS 적용, 쓰기 금지 |
| Proxy | `src/proxy.ts` | 모든 요청의 세션 쿠키 갱신 | 읽기·갱신만 |

Service Role Key는 쓰지 않는다. 쿠키는 SameSite=Lax다. 로그인 후 이동할 `next` 값은 `/`로 시작하는 내부 경로만 허용한다.

### 7.2 테이블 (6개)

| 테이블 | 핵심 컬럼 | 비고 |
|---|---|---|
| `profiles` | `user_id`, `nickname`, `is_adult`, `adult_verified_at`, `age_band`, `gender`, `travel_styles`, `bio`, `role` | 이메일·생년월일 컬럼 없음 |
| `mate_posts` | `owner_id`, `country_code`, `region_slug`, `start_date`, `end_date`, `capacity`, `preferences`, `travel_styles`, `title`, `description`, `status`, `safety_agreed_at`, `policy_version` | 상태 OPEN·CLOSED·DELETED |
| `mate_applications` | `post_id`, `applicant_id`, `message`, `status` | 상태 PENDING·ACCEPTED·REJECTED, `(post_id, applicant_id)` 부분 UNIQUE |
| `user_blocks` | `blocker_id`, `blocked_id` | pair UNIQUE |
| `reports` | `reporter_id`, `target_type`, `target_id`, `reason_code`, `description`, `status`, `handled_by`, `handled_at` | 상태 OPEN·REVIEWING·RESOLVED·DISMISSED |
| `app_settings` | `key`, `value` | 항공·숙소 외부 URL, `https://` CHECK |

스키마는 `supabase/migrations/*.sql`, 기본 설정은 `supabase/seed.sql`이다.

### 7.3 RLS 원칙

1. 6개 테이블 모두 RLS를 켠다. 권한 판단의 기준은 RLS이며 화면 숨김은 보조다.
2. 쓰기는 `auth.uid()` 본인 행만 허용한다. 동행글·참가 요청 쓰기는 `is_adult = true`가 필요하다.
3. 공개 읽기는 공개 컬럼만 허용한다(닉네임·연령대·성별·스타일·자기소개, 모집글 조건). 다른 회원 이메일은 조회할 수 없다.
4. 참가 요청은 요청자와 글 작성자만 읽는다. 상태 변경은 글 작성자만 한다.
5. 차단 관계(`is_blocked(a, b)`)에 있는 사용자끼리는 글·프로필·요청을 서로 볼 수 없다.
6. `reports` 읽기는 신고자 본인과 admin만, 상태 변경은 admin만 한다. `app_settings` 쓰기는 admin만 한다.
7. `role`은 사용자가 바꿀 수 없으며 SQL로만 지정한다.

### 7.4 ORM

Prisma·Drizzle 등 ORM을 쓰지 않는다. 스키마는 SQL 마이그레이션, 조회는 `supabase-js` 쿼리 빌더와 `src/lib/db/*`의 타입 있는 함수로 처리한다.

---

## 8. 디자인 시스템

`design-reference/D-001/DESIGN.md`(LOCKED, `MANIFEST.json`)가 토큰의 정본이다. `src/app/globals.css`의 Tailwind CSS 4 `@theme`로 옮긴다.

| 항목 | 기준 |
|---|---|
| 색 | 흰 배경 `#FFFFFF`, 텍스트 `#222222`, CTA 코랄 `#CF4329`, semantic(danger·warning·info·success·neutral) |
| 글꼴 | Inter(`next/font/google`) + 시스템 한글 fallback, `<html lang="ko">` |
| 레이아웃 | Desktop 1440(콘텐츠 1240), Mobile 390(Card 1열), 320px 가로 스크롤 없음 |
| 접근성 | 터치 44px 이상, `:focus-visible` 2px ink, Drawer·Modal 포커스 관리 |

---

## 9. 테스트

| 종류 | 도구 | 위치 | Task |
|---|---|---|---|
| 단위 | Vitest | `src/**/*.test.ts` | UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, UNIT-CONTENT-DATA, UNIT-SEARCH-STALE, UNIT-OUTBOUND-FAVORITES, UNIT-ROUTE-CONTRACT |
| RLS 통합 | Vitest + 테스트 Supabase 프로젝트 | `src/__tests__/rls.test.ts` | TEST-RLS-BASIC |
| E2E Smoke | Playwright, **Chromium 프로젝트만** (Desktop 1440·Mobile 390) | `e2e/*.spec.ts` | E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH |
| 수동 | 체크리스트 | `docs/checks/MANUAL_CHECK.md` | MANUAL-CHECK (메일, 키보드·VoiceOver, Lighthouse, RLS 대시보드) |
| 출시 판정 | RAC-01~13 | `docs/checks/RELEASE_CHECK.md` | RELEASE-CHECK |

Firefox·WebKit 프로젝트, 부하 테스트, Lighthouse CI는 두지 않는다.

---

## 10. CI·배포

| 단계 | 내용 |
|---|---|
| GitHub Actions | push·pull_request에서 `npm ci` → `lint` → `typecheck` → `test:unit` → `build`. 실패하면 job 실패 |
| Vercel Preview | Git 연결로 push·PR마다 Preview 배포. 5개 Screen은 Preview에서 사용자가 확인·승인(`preview_required`) |
| Production | 사용자가 Vercel에서 직접 승격 |
| Merge | 사용자가 직접. 자동 Merge·Merge Runner를 쓰지 않는다 |
| 환경변수 | Vercel Preview·Production에 `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| Supabase | 마이그레이션 적용, Auth Redirect URL에 Preview·Production `/auth/callback` 등록 |

AWS·EC2를 쓰지 않는다. 호스팅은 Vercel, DB·인증은 Supabase뿐이다.

---

## 11. 범위에서 제외

| 제외 | 대신 |
|---|---|
| 콘텐츠 CMS (여행지·안전·대표 편집 화면, 게시 상태, 미리보기) | `src/data` 수정 + Vercel Preview |
| 외부 Email 공급자 (요청 알림 메일, 재시도 큐) | Toast·화면 상태, Supabase Auth 기본 메일 |
| Monitoring (가용성·5xx·오류 알림, 구조화 로그) | Vercel·Supabase 기본 로그 |
| 미디어 업로드·라이선스 관리, 감사 로그, 운영자 제재, 행동 분석, 탈퇴 자동 삭제, 참가 요청 취소 | `TASKS/00_TASK_LIST.md` §4 NON_IMPLEMENTATION |
| 자체 API Route·Route Handler·Server Action | Supabase Browser Client + RLS |
| Prisma 등 ORM | SQL 마이그레이션 + `supabase-js` |
| AWS·EC2, 자동 Merge | Vercel, 사용자 수동 Merge |

---

## 12. 착수 차단

2026-10-10에 저장소와 로컬 환경을 확인한 결과, 실제로 빠진 것만 적었다. 패키지 설치·설정 파일 작성처럼 Task가 맡고 있는 항목은 차단으로 보지 않는다.

| # | 누락 | 막히는 Task | 해결 |
|---|---|---|---|
| 1 | `.env.local` 없음 — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL` 값이 없음 | AUTH-SUPABASE, DB-ACCESS 이후 Supabase를 쓰는 Component·Page의 실행 확인 | Supabase 프로젝트를 만들고 값을 `.env.local`에 넣는다 (`.env*`는 Git 제외) |
| 2 | E2E·RLS 테스트 계정 환경변수(`E2E_USER_A_*`, `E2E_USER_B_*`, `E2E_ADMIN_*`) 없음 | TEST-RLS-BASIC, E2E-MATE-AUTH | 이메일 인증을 마친 테스트 계정 3개를 만들고 관리자 `role` 지정 (DB-SEED-BASE 절차) |
| 3 | 원격 Supabase 테스트 프로젝트 없음 (DEC-019: Docker 대신 원격 프로젝트) | DB-SCHEMA-BASE, DB-RLS-BASE, DB-SEED-BASE의 Verify(`supabase db push`) | supabase.com에서 테스트 프로젝트 생성, `supabase login`, `supabase link` |
| 4 | `supabase/config.toml` 없음 | `supabase link`·`db push` | 해결됨: DB-SCHEMA-BASE Expected Files에 배정(DEC-019), `supabase/.temp/`는 Git 제외 |
| 5 | Git 원격 저장소 없음, GitHub CLI 미로그인 | SETUP-CI(Actions 실행), DEPLOY-VERCEL-SUPABASE(Vercel Git 연결·Preview) | GitHub 저장소 생성·push(`gh auth login` 후) — 사용자가 직접 |
| 6 | Vercel 프로젝트 연결(`.vercel`) 없음 | DEPLOY-VERCEL-SUPABASE, Preview 승인이 필요한 Page Owner의 DoD | Vercel에서 GitHub 저장소 Import |

위 항목이 해결되기 전에도 시작할 수 있는 Task는 30개다. 이 Task들은 Supabase·원격 저장소 Task에 직접·간접으로 의존하지 않는다(`TASK_MANIFEST.csv`의 Depends On 기준).

- 기반: SETUP-PROJECT, GLOBAL-DESIGN-TOKENS, GLOBAL-UI-KIT, GLOBAL-LAYOUT, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE, TECH-ERROR-PAGES
- 로직: LOGIC-SEARCH-FILTER, LOGIC-TRAVEL-DATES, LOGIC-OUTBOUND-URL, LOGIC-CONTACT-DETECTION, LOGIC-MATE-STATE, LOGIC-SAFETY-STALE, LOGIC-FAVORITES-SHARE
- 화면: COMP-SCR001-SEARCH, COMP-SCR001-DESTINATIONS, COMP-SCR001-DESTINATION-DRAWER, COMP-SCR001-SAFETY, COMP-SCR002-PROFILE, COMP-SCR002-COUNTRIES-GALLERY, PAGE-SCR002, COMP-SCR003-SHELL, COMP-SCR004-GUIDES
- 테스트: UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, UNIT-CONTENT-DATA, UNIT-SEARCH-STALE, UNIT-OUTBOUND-FAVORITES

SCR-003 항공·숙소 Component는 외부 URL 설정(`app_settings`)을 읽기 위해 DB-ACCESS에 의존하므로 1번 항목이 해결된 뒤 진행한다.
