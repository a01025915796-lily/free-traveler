# TASK-SETUP-PROJECT 패키지·스크립트·설정 초기화

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | SETUP-PROJECT | 패키지·스크립트·설정 초기화 | Setup | IMPLEMENT | REQ-NF-016, REQ-NF-031, REQ-FUNC-016, REQ-FUNC-024 | 없음 | - | - | - | `package.json`, `tsconfig.json`, `next.config.ts`, `.env.example`, `vitest.config.ts`, `playwright.config.ts`, `package-lock.json`, `.gitignore` | 1) `@supabase/supabase-js`, `@supabase/ssr`, `vitest`, `@playwright/test`, `@axe-core/playwright` 설치<br>2) 스크립트 `typecheck`(`tsc --noEmit`), `test:unit`(`vitest run`), `test:e2e`(`playwright test`) 추가<br>3) Playwright는 Chromium 프로젝트 하나만 정의(Desktop 1440×900, Mobile 390×844)<br>4) `.env.example`에 `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, E2E 테스트 계정 변수 기재<br>5) `next.config.ts` `images.remotePatterns`에 사용할 사진 호스트 등록<br>6) 기본 외부 URL 상수(항공 `https://www.google.com/travel/flights`, 숙소 `https://www.booking.com/`) 정의 위치 확정 | 해당 없음 (화면 요소 없음) | 1) Service Role Key를 쓰지 않고 `.env*`는 Git 제외<br>2) 클라이언트 노출 변수는 `NEXT_PUBLIC_*` 3개뿐<br>3) `.gitignore`는 `.env*` 제외를 유지하고 `!.env.example` 예외만 추가 | `npm install && npm run lint && npm run typecheck && npm run build` | P0 |

## 1. Context

화면과 무관한 기반 작업의 "패키지·스크립트·설정 초기화" 작업이다. 이 Task는 Setup 단계로, 요구사항 4건(REQ-NF-016, REQ-NF-031, REQ-FUNC-016, REQ-FUNC-024)을 다룬다.

현재 저장소에는 `package.json`, `tsconfig.json`, `next.config.ts`가 있다(Create Next App 초기 상태). 이 Task에서 수정한다. 이 Task가 끝나야 SETUP-CI, GLOBAL-DESIGN-TOKENS, DATA-DESTINATIONS, DB-SCHEMA-BASE, AUTH-SUPABASE, LOGIC-MATE-STATE, LOGIC-OUTBOUND-URL, LOGIC-CONTACT-DETECTION, LOGIC-FAVORITES-SHARE를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 8개 안에서 "패키지·스크립트·설정 초기화"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-NF-016 | 비밀키 환경변수 관리 | 클라이언트에는 `NEXT_PUBLIC_*` 공개 값만 사용, Service Role Key 미사용, `.env*` Git 제외 |
| REQ-NF-031 | TypeScript strict·lint·unit test | `strict: true` 유지, `lint`·`typecheck`·`test:unit` 통과 후 사용자가 직접 Merge. 자동 Merge Runner 없음 |
| REQ-FUNC-016 | 항공 외부 URL 새 탭 | `app_settings` 값 또는 기본 상수를 query 없이 `noopener,noreferrer` 새 탭으로 연다 |
| REQ-FUNC-024 | 숙소 외부 URL 새 탭 | 항공과 같은 방식으로 숙소 URL을 연다 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | 없음 (화면 밖 작업) |
| Route | - |
| Page Entry | - |

## 5. Design Ref

- 화면 디자인 없음 (비UI 작업)
- `docs/PROJECT_SCOPE.md` §5 구현 방식 · §6 Supabase 구성
- `docs/06_SRS_UIUX_REVISED.md` §2 개정 내역 · §4 UI Route Contract

## 6. Depends On

- 없음 (가장 먼저 시작할 수 있는 Task)

## 7. Expected Files

**생성**

- `.env.example`
- `vitest.config.ts`
- `playwright.config.ts`

**수정** (현재 저장소에 있음)

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `package-lock.json` (`npm install` 결과)
- `.gitignore` (`!.env.example` 예외 한 줄)

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- `@supabase/supabase-js`, `@supabase/ssr`, `vitest`, `@playwright/test`, `@axe-core/playwright` 설치
- 스크립트 `typecheck`(`tsc --noEmit`), `test:unit`(`vitest run`), `test:e2e`(`playwright test`) 추가
- Playwright는 Chromium 프로젝트 하나만 정의(Desktop 1440×900, Mobile 390×844)
- `.env.example`에 `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, E2E 테스트 계정 변수 기재
- `next.config.ts` `images.remotePatterns`에 사용할 사진 호스트 등록
- 기본 외부 URL 상수(항공 `https://www.google.com/travel/flights`, 숙소 `https://www.booking.com/`) 정의 위치 확정

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- Service Role Key를 쓰지 않고 `.env*`는 Git 제외
- 클라이언트 노출 변수는 `NEXT_PUBLIC_*` 3개뿐
- `.gitignore`는 `.env*` 제외를 유지하고 `!.env.example` 예외만 추가

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| RAC-02 | `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build` 모두 통과 (증거: 명령 실행 결과) |
| RAC-09 | 보안: 모든 테이블 RLS 활성화, 클라이언트 번들에 비밀값 없음, 항공·숙소 입력값이 네트워크·URL·저장소에 남지 않음 (증거: MAN-04, build 산출물 검사, SMK-02) |
| SMK-02 | SCR-003 `/travel-tools` 항공편·숙소 탭 — 필수값·날짜 오류 차단, 요약 일치, 비전달 안내, 외부 링크 `href`(query 없음)·`target`·`rel`, 입력 중 네트워크 요청에 입력값 없음, 탭 간 상태 분리 |
| UT-04 | 외부 URL 허용목록 (HTTPS, 허용 호스트, `http:`·`javascript:`·`data:` 거부, query 없음) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-OUTBOUND-FAVORITES, E2E-TRAVEL-TOOLS, RELEASE-CHECK

## 12. Verify

- `npm install && npm run lint && npm run typecheck && npm run build`
- `npm run lint` · `npm run typecheck` 오류 0
- `git diff --name-only` 결과가 §7 Expected Files 안에 있음

기대 결과: 위 명령이 모두 성공하고 §8~§10 AC를 하나씩 확인했다.

## 13. Definition of Done

- §8 Functional AC, §9 Visual AC, §10 Security/Privacy AC를 모두 충족
- §12 Verify 명령 통과
- 변경 파일이 §7 Expected Files 안에만 있음
- `docs/UIUX_TRACEABILITY.md`의 해당 요구사항 Status를 IMPLEMENTED로 갱신(검증 전)

## 14. Forbidden

- Expected Files 밖 파일을 수정하거나 새로 만들지 않는다. 필요하면 작업을 멈추고 Task 목록 변경을 요청한다
- 자체 Route Handler(`route.ts`)·`src/app/api/*`·Server Action(`"use server"`)을 만들지 않는다
- EXCLUDED 요구사항(콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 분석 이벤트, 탈퇴 자동 삭제, 참가 요청 취소, 이메일 사업자 연동 등)을 구현하지 않는다
- AWS·EC2·자동 Merge·Merge Runner 관련 작업을 하지 않는다
- Branch 생성·Commit·Push·PR은 사용자가 요청할 때만 한다
