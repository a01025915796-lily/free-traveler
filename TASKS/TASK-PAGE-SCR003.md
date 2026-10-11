# TASK-PAGE-SCR003 SCR-003 통합 여행 준비 페이지 조립

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 45 | PAGE-SCR003 | SCR-003 통합 여행 준비 페이지 조립 | Page Owner | IMPLEMENT | REQ-FUNC-011, REQ-FUNC-019, REQ-FUNC-027, REQ-FUNC-070, REQ-NF-017, REQ-NF-030 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | GLOBAL-LAYOUT, DB-ACCESS, COMP-SCR003-SHELL, COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL, COMP-SCR003-MATE-COMPOSE | `src/app/travel-tools/page.tsx` | 1) 항공편(`tab=flight`, 기본)·숙소(`tab=hotel`)·동행 구하기(`tab=mate`, `&edit=<id>`) 탭을 실제로 조립하고 탭마다 입력·검증·완료 상태 분리<br>2) Section 순서와 데이터 출처: ①Intro(정적) → ②탭 → ③여행정보 Form(`regions.ts`) → ④입력 요약·외부 이동(`app_settings` 또는 기본 URL) → ⑤찾기 Tip 3(정적) → ⑥동행 작성 또는 로그인·성인 확인 안내 + 안전 안내(세션·`mate_posts`)<br>3) 항공·숙소 탭은 ①~⑤, 동행 탭은 ①②⑥ 표시<br>4) `metadata` 설정, `useSearchParams`는 `<Suspense>`<br>5) 화면 상태(UI_CONTRACT §4 상태표)를 의존 Component·데이터와 연결해 실제로 표시 — Loading: 동행글 제출 중 버튼 "올리는 중…" 비활성, 수정 모드 불러오기 Form Skeleton / Empty: 없음 — 입력 전 초기 상태는 안내 문구가 있는 Form / Error: 필드별 검증 오류와 이동 버튼 비활성, 외부 연결 실패 danger Alert + 다시 시도(입력 유지), 연락처 탐지 Alert, 제출 실패(입력 유지) / Unauthorized: 동행 탭의 비회원·성인 확인 전·수정 권한 없음 안내 | 1) 최소: 탭 3, Tip 3<br>2) 밀도: Desktop Form 7열 + 요약 5열(고정) / Mobile 1열, 탭 가로 스크롤<br>3) 금지: Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역. 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State (동행 탭 비회원도 안내·3단계·CTA)<br>4) D-001 토큰만 사용(흰 배경·텍스트 `#222222`·CTA 코랄 `#CF4329`·Inter + 시스템 한글·터치 44px 이상·`:focus-visible`). 임의 색·글꼴·그림자 값과 Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI 금지 | 1) 항공·숙소 입력값은 브라우저 메모리에만: 서버·DB·URL·쿠키·`localStorage`·로그·분석 전송 금지<br>2) 이 화면에 서버 API 없음 | `npm run build`, E2E-TRAVEL-TOOLS, Vercel Preview 확인 | P0 |

## 1. Context

SCR-003 통합 여행 준비 화면(`/travel-tools`)의 "SCR-003 통합 여행 준비 페이지 조립" 작업이다. 이 Task는 Page Owner 단계로, 요구사항 6건(REQ-FUNC-011, REQ-FUNC-019, REQ-FUNC-027, REQ-FUNC-070, REQ-NF-017, REQ-NF-030)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-LAYOUT, DB-ACCESS, COMP-SCR003-SHELL, COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL, COMP-SCR003-MATE-COMPOSE. 이 Task가 끝나야 UNIT-ROUTE-CONTRACT, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, MANUAL-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- `src/app/travel-tools/page.tsx`에서 Route Page를 조립한다: 의존 Component 배치, 데이터 연결, URL query 해석, metadata
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 하위 Component 생성·수정 (의존 Component Task 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-011 | 항공 필수 입력 4개 | SCR-003 항공편 탭(`/travel-tools?tab=flight`): 국가, 지역·도시, 출발일, 귀국일. 라벨·도움말·오류 영역 포함 |
| REQ-FUNC-019 | 숙소 필수 입력 4개 | SCR-003 숙소 탭(`/travel-tools?tab=hotel`): 국가, 지역·도시, 체크인, 체크아웃 |
| REQ-FUNC-027 | 동행 쓰기에 인증 세션 필요 | 비로그인 쓰기 시도는 `/account?tab=login&next=<원래 경로>`로 이동. RLS가 `auth.uid()` 없는 쓰기를 거부 |
| REQ-FUNC-070 | 페이지별 SEO 메타 | Metadata API로 5개 Route의 title·description·canonical·Open Graph, `?dest`는 `generateMetadata`로 여행지별 값. `/`에 WebSite JSON-LD |
| REQ-NF-017 | 항공·숙소 원시 입력 미보존 | REQ-FUNC-017·025와 같은 방식 |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | REQ-FUNC-070 방식 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-003 통합 여행 준비 (핵심) |
| Route | `/travel-tools` |
| Page Entry | `src/app/travel-tools/page.tsx` |
| 이 Task의 역할 | Route Page 조립 (Page Owner) |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §4 SCR-003 통합 여행 준비 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.3 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `e60c66e71011429289057057824b567c`, Mobile `ffa60caca42c439cb75b48963f5f1d05`
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-LAYOUT — Root Layout·공통 Header·Footer·정책 Modal (Seq 5)
- DB-ACCESS — 동행·요청·차단·신고·설정 데이터 접근 계층 (Seq 14)
- COMP-SCR003-SHELL — 여행 준비 Intro·탭·고지·Tip (Seq 30)
- COMP-SCR003-FLIGHT — 항공편 입력·요약·외부 이동 (Seq 31)
- COMP-SCR003-HOTEL — 숙소 입력·요약·외부 이동 (Seq 32)
- COMP-SCR003-MATE-COMPOSE — 동행 구하기 탭: 권한 안내·작성·수정 (Seq 33)

## 7. Expected Files

**생성**

- `src/app/travel-tools/page.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 항공편(`tab=flight`, 기본)·숙소(`tab=hotel`)·동행 구하기(`tab=mate`, `&edit=<id>`) 탭을 실제로 조립하고 탭마다 입력·검증·완료 상태 분리
- Section 순서와 데이터 출처: ①Intro(정적) → ②탭 → ③여행정보 Form(`regions.ts`) → ④입력 요약·외부 이동(`app_settings` 또는 기본 URL) → ⑤찾기 Tip 3(정적) → ⑥동행 작성 또는 로그인·성인 확인 안내 + 안전 안내(세션·`mate_posts`)
- 항공·숙소 탭은 ①~⑤, 동행 탭은 ①②⑥ 표시
- `metadata` 설정, `useSearchParams`는 `<Suspense>`

**화면 상태** (`UI_CONTRACT.md` §4 상태표, `04_UIUX_PLAN.md` §7) — 의존 Component의 상태를 Page에서 데이터와 연결해 실제로 표시한다.

| 상태 | 표시 |
|---|---|
| Loading | 동행글 제출 중 버튼 "올리는 중…" 비활성, 수정 모드 불러오기 Form Skeleton |
| Empty | 없음 — 입력 전 초기 상태는 안내 문구가 있는 Form |
| Error | 필드별 검증 오류와 이동 버튼 비활성, 외부 연결 실패 danger Alert + 다시 시도(입력 유지), 연락처 탐지 Alert, 제출 실패(입력 유지) |
| Unauthorized | 동행 탭의 비회원·성인 확인 전·수정 권한 없음 안내 |

## 9. Visual AC

**Section 순서와 데이터 출처** (계약 `sections` 순서)


| 순서 | Section id | 제목 | 데이터 출처 |
|---|---|---|---|
| 1 | `intro` | 여행 조건을 먼저 정리하고 떠나세요 | 정적 문구 |
| 2 | `tabs` | (aria-label: 여행 준비 도구) | URL query `tab` |
| 3 | `condition-form` | 어디로, 언제 떠나시나요? / 어디에서, 언제 머무시나요? | `src/lib/trip/regions.ts` (브라우저 메모리 상태) |
| 4 | `summary-outbound` | 입력 요약 | `app_settings` 또는 기본 URL 상수 |
| 5 | `notice-tips` | 이동하기 전에 알아 두세요 | 정적 문구 |
| 6 | `mate-compose` | 함께 떠날 동행을 모집해 보세요 | Supabase 세션·`profiles`·`mate_posts` |

**최소 콘텐츠**

| 항목 | 최소 수 |
|---|---|
| 탭 | 3 (항공편·숙소·동행 구하기) |
| Tip Card | 3 (탭별, Card당 한 문장) |

**반응형 콘텐츠 밀도**

| 구간 | 기준 |
|---|---|
| Desktop 1440px | Intro 3단계 가로 · 탭 고정 · Form 7열 + 요약 Card 5열(고정) · Tip 3열 · 동행 탭 8:4 |
| Mobile 390px | 3단계 세로, 탭 가로 스크롤, Form → 요약 1열, Tip 1열 |
| 320px | 가로 스크롤 없음 |

**공통 조건**

- 최소: 탭 3, Tip 3
- 밀도: Desktop Form 7열 + 요약 5열(고정) / Mobile 1열, 탭 가로 스크롤
- 금지: Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역. 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State (동행 탭 비회원도 안내·3단계·CTA)
- 모든 Section에 제목·1~3문장 설명·실제 콘텐츠 또는 CTA가 있다
- 목록 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State를 보여 준다
- D-001 토큰만 사용(흰 배경·텍스트 `#222222`·CTA 코랄 `#CF4329`·Inter + 시스템 한글·터치 44px 이상·`:focus-visible`). 임의 색·글꼴·그림자 값과 Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI 금지

## 10. Security/Privacy AC

- 항공·숙소 입력값은 브라우저 메모리에만: 서버·DB·URL·쿠키·`localStorage`·로그·분석 전송 금지
- 이 화면에 서버 API 없음
- 항공·숙소 입력값(국가·도시·날짜)을 서버·DB·URL(query 포함)·쿠키·`localStorage`·로그·분석으로 보내지 않는다

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-04 | Supabase 대시보드에서 RLS 활성화·정책 목록 확인 |
| SMK-02 | SCR-003 `/travel-tools` 항공편·숙소 탭 — 필수값·날짜 오류 차단, 요약 일치, 비전달 안내, 외부 링크 `href`(query 없음)·`target`·`rel`, 입력 중 네트워크 요청에 입력값 없음, 탭 간 상태 분리 |
| SMK-03 | SCR-004, SCR-003 (비회원) — 동행 목록·상세 열람 가능, 참가 요청·신고·차단·동행 구하기 탭 진입 시 `/account?tab=login&next=…`로 안내 |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: TEST-RLS-BASIC, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, RELEASE-CHECK

## 12. Verify

- `npm run build`, E2E-TRAVEL-TOOLS, Vercel Preview 확인
- E2E-TRAVEL-TOOLS 실행: `npx playwright test e2e/travel-tools.spec.ts --project=chromium` — spec이 아직 없으면(E2E-TRAVEL-TOOLS 이전) 실행하지 않고 "보류 — E2E-TRAVEL-TOOLS에서 검증"으로 기록한다.
- `npm run lint` · `npm run typecheck` 오류 0
- `git diff --name-only` 결과가 §7 Expected Files 안에 있음

기대 결과: 위 명령이 모두 성공하고 §8~§10 AC를 하나씩 확인했다.

## 13. Definition of Done

- §8 Functional AC, §9 Visual AC, §10 Security/Privacy AC를 모두 충족
- §12 Verify 명령 통과
- 변경 파일이 §7 Expected Files 안에만 있음
- Vercel Preview에서 Desktop 1440·Mobile 390 화면을 사용자가 확인·승인(`preview_required`)
- `docs/UIUX_TRACEABILITY.md`의 해당 요구사항 Status를 IMPLEMENTED로 갱신

## 14. Forbidden

- Expected Files 밖 파일을 수정하거나 새로 만들지 않는다. 필요하면 작업을 멈추고 Task 목록 변경을 요청한다
- 자체 Route Handler(`route.ts`)·`src/app/api/*`·Server Action(`"use server"`)을 만들지 않는다
- EXCLUDED 요구사항(콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 분석 이벤트, 탈퇴 자동 삭제, 참가 요청 취소, 이메일 사업자 연동 등)을 구현하지 않는다
- AWS·EC2·자동 Merge·Merge Runner 관련 작업을 하지 않는다
- Branch 생성·Commit·Push·PR은 사용자가 요청할 때만 한다
- 하위 Component를 새로 만들거나 고치지 않는다(의존 Component Task 소관). 이 Task는 Route Page 조립만 한다
- Placeholder 문구(Lorem ipsum·"준비 중"·"정보 확인 필요")와 내용 없는 Card를 쓰지 않는다
- 큰 빈 영역을 남기지 않는다. 데이터가 없을 때는 완성형 Empty State를 보여 준다
- 항공·숙소 입력값을 서버·DB·URL·쿠키·`localStorage`·로그·분석으로 보내지 않는다
- Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI를 쓰지 않는다
