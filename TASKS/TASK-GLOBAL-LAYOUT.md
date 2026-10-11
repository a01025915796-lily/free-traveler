# TASK-GLOBAL-LAYOUT Root Layout·공통 Header·Footer·정책 Modal

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | GLOBAL-LAYOUT | Root Layout·공통 Header·Footer·정책 Modal | Global | IMPLEMENT | REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-080, REQ-NF-023, REQ-NF-030 | 공통 | - | - | GLOBAL-DESIGN-TOKENS, GLOBAL-UI-KIT | `src/app/layout.tsx`, `src/components/layout/SiteHeader.tsx`, `src/components/layout/SiteFooter.tsx`, `src/components/layout/SkipLink.tsx`, `src/components/policy/PolicyDialog.tsx`, `src/data/policies.ts` | 1) `<html lang="ko">`, Inter + 시스템 한글 fallback(`next/font/google`)<br>2) Header: 여행지·대표 소개·여행 준비·동행 찾기 + 계정 진입, 현재 화면 `aria-current="page"`<br>3) Footer: 소개 / 바로가기 5개 / 정책 Modal 4종(이용약관·개인정보 처리방침·동행 안전수칙·콘텐츠 면책) + 외교부 외부 링크<br>4) 정책 문서는 `src/data/policies.ts` 정적 데이터, `policy_version` 값 포함<br>5) 기본 metadata(`metadataBase`, title template)<br>6) Toast 영역 1곳 | 1) Header 72px(Mobile 64px, 44px 메뉴 버튼 → Sheet), 아래 hairline<br>2) Footer `#F7F7F7`, Desktop 3열 / Mobile 1열<br>3) 320px에서 가로 스크롤 없음 | 1) 외부 링크 `target="_blank" rel="noopener noreferrer"` | `npm run build`, E2E-PUBLIC-SMOKE | P0 |

## 1. Context

5개 화면 공통의 "Root Layout·공통 Header·Footer·정책 Modal" 작업이다. 이 Task는 Global 단계로, 요구사항 6건(REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-080, REQ-NF-023, REQ-NF-030)을 다룬다.

현재 저장소에는 `src/app/layout.tsx`가 있다(Create Next App 초기 상태). 이 Task에서 수정한다. 선행 Task: GLOBAL-DESIGN-TOKENS, GLOBAL-UI-KIT. 이 Task가 끝나야 TECH-AUTH-CALLBACK, TECH-ERROR-PAGES, PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 6개 안에서 "Root Layout·공통 Header·Footer·정책 Modal"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | `src/app/layout.tsx`의 공통 Header(5개 Screen 메뉴, 계정 진입)와 정책 Modal을 여는 Footer |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | Mobile First Tailwind 레이아웃 |
| REQ-FUNC-070 | 페이지별 SEO 메타 | Metadata API로 5개 Route의 title·description·canonical·Open Graph, `?dest`는 `generateMetadata`로 여행지별 값. `/`에 WebSite JSON-LD |
| REQ-FUNC-080 | 정책 문서·안전수칙 동의 기록 | Footer 정책 Modal 4종. SCR-003 동행 구하기 탭에서 글 작성 시 `safety_agreed_at`, `policy_version` 저장 |
| REQ-NF-023 | WCAG 2.2 AA 목표 | REQ-FUNC-079 규칙, 상태·경보는 텍스트 라벨 병기, 터치 대상 24×24px 이상 |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | REQ-FUNC-070 방식 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | 5개 화면 공통 |
| Route | - |
| Page Entry | - |

## 5. Design Ref

- `design-reference/D-001/DESIGN.md` §2~§7 (토큰 값의 정본)
- `design-reference/UI_CONTRACT.md` §1.3 공통 Layout · §1.4 Desktop·Mobile · §1.5 디자인·접근성
- `docs/04_UIUX_PLAN.md` §4 공통 컴포넌트

## 6. Depends On

- GLOBAL-DESIGN-TOKENS — D-001 디자인 토큰 적용 (Seq 3)
- GLOBAL-UI-KIT — 공통 UI Component (Seq 4)

## 7. Expected Files

**생성**

- `src/components/layout/SiteHeader.tsx`
- `src/components/layout/SiteFooter.tsx`
- `src/components/layout/SkipLink.tsx`
- `src/components/policy/PolicyDialog.tsx`
- `src/data/policies.ts`

**수정** (현재 저장소에 있음)

- `src/app/layout.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- `<html lang="ko">`, Inter + 시스템 한글 fallback(`next/font/google`)
- Header: 여행지·대표 소개·여행 준비·동행 찾기 + 계정 진입, 현재 화면 `aria-current="page"`
- Footer: 소개 / 바로가기 5개 / 정책 Modal 4종(이용약관·개인정보 처리방침·동행 안전수칙·콘텐츠 면책) + 외교부 외부 링크
- 정책 문서는 `src/data/policies.ts` 정적 데이터, `policy_version` 값 포함
- 기본 metadata(`metadataBase`, title template)
- Toast 영역 1곳

## 9. Visual AC

- Header 72px(Mobile 64px, 44px 메뉴 버튼 → Sheet), 아래 hairline
- Footer `#F7F7F7`, Desktop 3열 / Mobile 1열
- 320px에서 가로 스크롤 없음

## 10. Security/Privacy AC

- 외부 링크 `target="_blank" rel="noopener noreferrer"`

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-02 | 키보드만으로 SCR-001~005 핵심 흐름 완료, VoiceOver로 폼 오류·Drawer 제목 읽힘 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |
| UT-10 | Route Contract: `SCREEN_ROUTE_CONTRACT.json`과 `src/app` 파일 일치, `route.ts`·Server Action 없음, SCR-001 시작 화면 흔적 없음 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-ROUTE-CONTRACT, E2E-PUBLIC-SMOKE, E2E-MATE-AUTH, MANUAL-CHECK, RELEASE-CHECK

## 12. Verify

- `npm run build`, E2E-PUBLIC-SMOKE
- E2E-PUBLIC-SMOKE: 이 Task에서는 실행하지 않는다. E2E-PUBLIC-SMOKE Task가 spec을 만든 뒤 `npx playwright test e2e/public.spec.ts --project=chromium`로 검증한다. 구현 시 "보류 — E2E-PUBLIC-SMOKE에서 검증"으로 기록한다 (`/implement-task` 규칙 6).
- `npm run lint` · `npm run typecheck` 오류 0
- `git diff --name-only` 결과가 §7 Expected Files 안에 있음

기대 결과: 보류로 표시한 Playwright를 뺀 위 명령이 모두 성공하고 §8~§10 AC를 하나씩 확인했다.

## 13. Definition of Done

- §8 Functional AC, §9 Visual AC, §10 Security/Privacy AC를 모두 충족
- §12 Verify 명령 통과(Playwright는 보류로 기록)
- 변경 파일이 §7 Expected Files 안에만 있음
- `docs/UIUX_TRACEABILITY.md`의 해당 요구사항 Status를 IMPLEMENTED로 갱신(검증 전)

## 14. Forbidden

- Expected Files 밖 파일을 수정하거나 새로 만들지 않는다. 필요하면 작업을 멈추고 Task 목록 변경을 요청한다
- 자체 Route Handler(`route.ts`)·`src/app/api/*`·Server Action(`"use server"`)을 만들지 않는다
- EXCLUDED 요구사항(콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 분석 이벤트, 탈퇴 자동 삭제, 참가 요청 취소, 이메일 사업자 연동 등)을 구현하지 않는다
- AWS·EC2·자동 Merge·Merge Runner 관련 작업을 하지 않는다
- Branch 생성·Commit·Push·PR은 사용자가 요청할 때만 한다
