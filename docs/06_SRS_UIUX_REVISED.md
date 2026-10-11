# Software Requirements Specification — UI·UX 개정판 (06_SRS_UIUX_REVISED)

| 항목 | 내용 |
|---|---|
| 문서 ID | SRS-TRAVEL-001-R1 |
| 개정일 | 2026-10-09 |
| 기준 SRS | `docs/02_SRS_BASELINE.md` (SRS-TRAVEL-001 v1.0) |
| 연결 문서 | `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/05_UIUX_APPROVED.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json` |
| 추적표 | `docs/UIUX_TRACEABILITY.md` |
| 요구사항 수 | 기능 80건 (REQ-FUNC-001~080), 비기능 34건 (REQ-NF-001~034), 합계 114건 — 삭제 없음 |
| 구현 상태 | 2026-10-09 기준 구현 완료된 요구사항 없음. 코드베이스는 Create Next App 초기 상태 |

이 문서는 기준 SRS를 대체하지 않는다. 기준 SRS의 요구사항 문장과 ID는 그대로 두고, 승인된 5개 Screen과 PROJECT_SCOPE 범위에 맞춰 바뀐 부분(화면 배치, Route, 구현 기준, 제외 범위, 검증·출시 기준)만 개정한다. 두 문서가 다르면 이 문서가 우선한다.

---

## 1. 요구사항 상태 정의

| 상태 | 의미 |
|---|---|
| **IMPLEMENT** | 이 프로젝트에서 구현하고 §8의 확인 방법으로 검증한다. "구현 기준 (개정)" 열에 적힌 범위가 구현 기준이다 |
| **EXCLUDED** | 만들지 않는다. "구현 기준 (개정)" 열에 제외 이유를 적는다. 화면에 노출하지 않는다 |

| 구분 | IMPLEMENT | EXCLUDED | 합계 |
|---|---:|---:|---:|
| 기능 (REQ-FUNC) | 69 | 11 | 80 |
| 비기능 (REQ-NF) | 19 | 15 | 34 |
| 합계 | 88 | 26 | 114 |

---

## 2. 개정 내역

| ID | 기준 SRS 위치 | 개정 내용 | 영향 요구사항 |
|---|---|---|---|
| R1 | §3.5 Page and Route Inventory | 공개 Route 16개를 디자인 Screen 5개(`/`, `/about`, `/travel-tools`, `/mates`, `/account`)로 통합한다. 상세·작성·계정 기능은 Screen 안의 탭·패널·Drawer·Modal과 URL query로 제공한다(§3) | REQ-FUNC-001~006, 011~026, 030~040, 046~054, 057~063, 066 |
| R2 | §3.5 | `/travel-tools`는 항공편·숙소·동행 구하기 탭을 포함한다. 동행글 작성·수정(`/mates/new`)은 동행 구하기 탭으로 옮긴다 | REQ-FUNC-011~026, 031, 032, 038, 080 |
| R3 | §3.5, §2.2 | `/account`는 인증(로그인·가입·비밀번호 재설정), 프로필·성인 확인, 내 활동, 간단한 관리(신고 상태 변경·외부 URL 설정)를 포함한다. 역할에 없는 탭은 렌더링하지 않는다 | REQ-FUNC-028, 029, 036, 040, 041, 043, 066, 077 |
| R4 | §3.1, §6.1 API-01~17 | 자체 API Route·Route Handler·Server Action을 만들지 않는다. 여행지·안전·대표 콘텐츠는 `src/data` 정적 데이터, 회원·동행·신고·설정 쓰기는 브라우저 Supabase 클라이언트 + RLS로 처리한다 | REQ-FUNC-017, 025, 044, REQ-NF-013, 014 |
| R5 | §6.3 Data Model | COUNTRY·REGION·DESTINATION·DESTINATION_CONTENT·COUNTRY_SAFETY·REPRESENTATIVE_PROFILE은 DB 테이블 대신 `src/data` 정적 데이터로 둔다. DB 테이블은 `profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings`만 만든다(PROJECT_SCOPE §6). MEDIA_ASSET·AUDIT_LOG는 만들지 않는다 | REQ-FUNC-007, 055, 056, 072~076 |
| R6 | §6.5.2 Application 상태 | 참가 요청 상태는 PENDING·ACCEPTED·REJECTED 3개다. WITHDRAWN(요청 취소)은 만들지 않는다 | REQ-FUNC-034~036 |
| R7 | §3.7.2, CP-04 | 알림은 이메일 없이 Toast와 내 활동 탭의 상태 배지로 제공한다. Supabase Auth의 가입 인증·비밀번호 재설정 메일만 사용한다 | REQ-FUNC-043 |
| R8 | AC-M07 배치 작업 | 모집글 자동 마감은 배치 없이 조회 시 `end_date`로 계산한다 | REQ-FUNC-037 |
| R9 | AC-S03 | 안전정보 stale은 렌더링 시 `verifiedAt + 7일`로 계산한다 | REQ-FUNC-050, REQ-NF-028 |
| R10 | PRD 6-4, CON-08 | 이미지는 일반 인터넷 URL과 실제 장소를 설명하는 `alt`만 쓴다. 출처·작가·라이선스 메타데이터 관리는 제외한다 | REQ-FUNC-007, 061, 073, REQ-NF-029 |
| R11 | REQ-FUNC-068 | 즐겨찾기는 회원 DB가 아니라 브라우저 `localStorage`에 저장한다 | REQ-FUNC-068 |
| R12 | §3.3 EXT-04·05 | KTO TourAPI 연동과 외부 이메일 제공자 연동은 하지 않는다 | REQ-FUNC-043, 072 |
| R13 | §6.8.1 Test Levels | 검증은 Vitest 단위 테스트, Playwright Chromium 핵심 Smoke Test, 수동 확인으로 한다. 부하 테스트·Lighthouse CI는 하지 않는다(§8) | REQ-NF-004, 005, 007, 019 |
| R14 | §6.8.3 Rollout Acceptance | 출시 판정은 §5 Release Acceptance Criteria로 한다. 배포·Merge는 사용자가 직접 한다 | 전체 |
| R15 | 기술 Route | 인증 메일 링크 처리는 Route Handler가 아니라 `src/app/auth/callback/page.tsx`(Client Component)로 한다. 세션 쿠키 갱신은 `src/proxy.ts`(Next.js 16 Proxy)만 맡는다 | REQ-FUNC-066, REQ-NF-013 |

---

## 3. Screen과 Route

### 3.1 디자인 Screen

| Screen | 구분 | Route | Page Entry | 포함 기능 |
|---|---|---|---|---|
| SCR-001 메인 | 핵심 | `/` | `src/app/page.tsx` | 여행지 검색·필터·목록(검색 결과 모드), 여행지 상세 Drawer, 국가 안전정보 Drawer, 국가별 주의사항, 최근 동행글, 대표 소개 요약, 즐겨찾기 |
| SCR-002 대표 소개 | 보조 | `/about` | `src/app/about/page.tsx` | free_traveler 프로필, 지표, 소개·철학, Timeline, 방문 국가, Gallery, 추천 여행지 |
| SCR-003 통합 여행 준비 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 항공편 탭, 숙소 탭(입력·검증·요약·외부 이동), 동행 구하기 탭(동행글 작성·수정) |
| SCR-004 동행 조회 | 핵심 | `/mates` | `src/app/mates/page.tsx` | 동행글 필터·목록, 상세 패널, 참가 요청, 신고·차단, 본인 글 마감·삭제 |
| SCR-005 계정·관리 | 핵심 | `/account` | `src/app/account/page.tsx` | 로그인·가입·비밀번호 재설정, 프로필·성인 확인, 내 활동(내 글·참가 요청·차단), 관리(신고 상태·외부 URL) |

### 3.2 기준 SRS Route 통합

| 기준 SRS Route | 개정 위치 | URL |
|---|---|---|
| `/` | SCR-001 | `/` |
| `/destinations` | SCR-001 검색 결과 모드 | `/?scope=all` |
| `/destinations/domestic` | SCR-001 검색 결과 모드 | `/?scope=domestic` |
| `/destinations/overseas` | SCR-001 검색 결과 모드 | `/?scope=overseas` |
| `/destinations/[slug]` | SCR-001 여행지 상세 Drawer | `/?dest=<slug>` |
| `/flights` | SCR-003 항공편 탭 | `/travel-tools?tab=flight` |
| `/hotels` | SCR-003 숙소 탭 | `/travel-tools?tab=hotel` |
| `/mates` | SCR-004 | `/mates` |
| `/mates/[id]` | SCR-004 상세 패널 (Mobile Drawer) | `/mates?post=<id>` |
| `/mates/new` | SCR-003 동행 구하기 탭 | `/travel-tools?tab=mate` |
| `/safety` | SCR-001 국가별 주의사항 영역, 검색 결과 모드(안전정보) | `/?kind=safety` |
| `/safety/[countryCode]` | SCR-001 국가 안전정보 Drawer | `/?safety=<countryCode>` |
| `/about` | SCR-002 | `/about` |
| `/auth/*` | SCR-005 로그인 탭 + 기술 Route | `/account?tab=login`, `/auth/callback` |
| `/my/*` | SCR-005 프로필·내 활동 탭 | `/account?tab=profile`, `/account?tab=activity` |
| `/admin/*` | SCR-005 관리 탭 | `/account?tab=admin` |

### 3.3 Use Case 배치

| Use Case | 기준 SRS 요구사항 | 개정 Screen |
|---|---|---|
| UC-01 여행지 검색·필터·상세 열람 | REQ-FUNC-001~010 | SCR-001 |
| UC-02 항공 조건 입력·요약·외부 이동 | REQ-FUNC-011~018 | SCR-003 항공편 탭 |
| UC-03 숙소 조건 입력·요약·외부 이동 | REQ-FUNC-019~026 | SCR-003 숙소 탭 |
| UC-04 동행 모집글 작성·마감 | REQ-FUNC-027~033, 037~038 | SCR-003 동행 구하기 탭(작성·수정), SCR-004(조회·마감) |
| UC-05 참가 요청·승인·거절 | REQ-FUNC-034~036, 043 | SCR-004(요청), SCR-005 내 활동(승인·거절·결과) |
| UC-06 신고·차단·운영 처리 | REQ-FUNC-039~045 | SCR-004(신고·차단), SCR-005 내 활동(차단 해제)·관리(신고 상태) |
| UC-07 국가별 안전정보 확인 | REQ-FUNC-046~056 | SCR-001 국가 안전정보 Drawer |
| UC-08 대표 소개 확인 | REQ-FUNC-057~063 | SCR-002, SCR-001 소개 영역 |
| UC-09 콘텐츠·외부 URL 관리 | REQ-FUNC-072~077 | SCR-005 관리 탭(외부 URL만). 콘텐츠 관리는 EXCLUDED |

---

## 4. UI Route Contract

`design-reference/SCREEN_ROUTE_CONTRACT.json`(schema `traveler-screen-route-v1`, framework `nextjs-app-router`)을 구현 계약으로 삼는다. 화면별 영역·상태·행동·이동·금지 기능은 `design-reference/UI_CONTRACT.md`에 있다.

| ID | 계약 | 검증 |
|---|---|---|
| RC-01 | `src/app` 아래 `page.tsx`는 5개 Screen Page Entry와 `src/app/auth/callback/page.tsx`만 둔다 | UT-10 |
| RC-02 | Route와 Page Entry는 서로 중복되지 않는다 | UT-10 |
| RC-03 | `route.ts`(Route Handler)와 Server Action(`"use server"`)을 만들지 않는다 | UT-10 |
| RC-04 | Proxy는 `src/proxy.ts` 하나이며 Supabase 세션 갱신만 한다 | 코드 리뷰 |
| RC-05 | 5개 Screen 모두 공통 Header·Footer(`src/app/layout.tsx`)를 쓴다 | SMK-08 |
| RC-06 | SCR-001 `src/app/page.tsx`에 Create Next App 시작 화면 문구·이미지가 남지 않는다 | UT-10 |
| RC-07 | 각 Screen의 영역 순서는 `UI_CONTRACT.md`와 같다 | SMK-01~09, Preview 승인 |
| RC-08 | 탭·패널·Drawer 상태는 URL query로 표현하고, `useSearchParams`를 쓰는 Client Component는 `<Suspense>`로 감싼다 | `npm run build` 통과 |
| RC-09 | `required_navigation`의 이동이 모두 동작한다 | SMK-10 |
| RC-10 | 기술 Route(`/auth/callback`, `not-found`, `error`)는 디자인 Screen 수에 포함하지 않는다 | UT-10 |

---

## 5. Release Acceptance Criteria

모든 항목이 통과해야 출시(Production 배포)할 수 있다. 판정은 RELEASE_READY 또는 RELEASE_BLOCKED이며, 배포는 사용자가 직접 한다.

| ID | 기준 | 증거 |
|---|---|---|
| RAC-01 | UI Route Contract RC-01~RC-10 충족 | UT-10 결과, build 로그 |
| RAC-02 | `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build` 모두 통과 | 명령 실행 결과 |
| RAC-03 | Playwright Smoke SMK-01~SMK-10이 Chromium Desktop 1440px에서 통과하고, SMK-01·SMK-02는 Mobile 390px에서도 통과 | `npm run test:e2e` 결과 |
| RAC-04 | IMPLEMENT 요구사항 88건 모두 추적표의 Test가 통과하고 Status가 VERIFIED | `docs/UIUX_TRACEABILITY.md` |
| RAC-05 | EXCLUDED 26건이 화면·코드에 노출되지 않음(콘텐츠 CMS, 미디어 업로드, 감사 로그 화면, 운영자 제재, 분석 이벤트, 참가 요청 취소, 요청 취소 배지 없음) | 코드 리뷰, SMK-07 |
| RAC-06 | 5개 Screen의 Vercel Preview를 사용자가 확인하고 승인 | Screen별 Preview 승인 기록 |
| RAC-07 | 정적 데이터 수량·완전성: 국내 10곳, 해외 15개국 30개 도시, 해외 국가 안전정보 15개, 대표 프로필 필수 항목 | UT-08 |
| RAC-08 | 접근성: axe serious/critical 0건, 키보드·스크린리더 핵심 흐름 통과, 320px 가로 스크롤 없음 | SMK-08, MAN-02 |
| RAC-09 | 보안: 모든 테이블 RLS 활성화, 클라이언트 번들에 비밀값 없음, 항공·숙소 입력값이 네트워크·URL·저장소에 남지 않음 | MAN-04, build 산출물 검사, SMK-02 |
| RAC-10 | Vercel 배포: HTTPS, 환경변수 3개 등록, Supabase Auth Redirect URL에 배포 도메인 `/auth/callback` 등록, 요금제 기준 충족 | 배포 설정 화면, `curl -I` |
| RAC-11 | 성능: 배포 URL 모바일 Lighthouse Performance ≥85, LCP ≤2.5s, CLS ≤0.1 | MAN-03 |
| RAC-12 | 인증 메일: 가입 인증·비밀번호 재설정 메일 수신과 `/auth/callback` 처리 | MAN-01 |
| RAC-13 | 대표 콘텐츠(`src/data/curator.ts`)가 대표 확인을 거친 내용 | 사용자 확인 |

---

## 6. 기능 요구사항 (REQ-FUNC-001~080)

| ID | 요구사항 요지 | 범위 | UI 분류 | 배치 Screen | 구현 기준 (개정) | 확인 방법 |
|---|---|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 여행지 목록 구분 | IMPLEMENT | UI_DIRECT | SCR-001 | SCR-001 국내/해외 구분(검색 구분 선택, 검색 결과 모드 탭). `src/data`의 `scope` 값으로 분류 | UT-01, SMK-01 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | IMPLEMENT | UI_DIRECT | SCR-001 | 정적 데이터를 클라이언트에서 AND 조건으로 필터 | UT-01, SMK-01 |
| REQ-FUNC-003 | 키워드 검색 | IMPLEMENT | UI_DIRECT | SCR-001 | 여행지명·국가명·테마 한글 부분 일치, 결과 없음 상태 | UT-01, SMK-01 |
| REQ-FUNC-004 | 여행지 상세 필수 항목 | IMPLEMENT | UI_DIRECT | SCR-001 | SCR-001 여행지 상세 Drawer(`?dest`)에 소개·명소 5+·추천 시기·1일/3일 일정·예산·교통·음식 3+·에티켓·출처·수정일 표시. 게시 상태 대신 데이터 타입과 완전성 테스트로 누락을 막는다 | UT-08, SMK-01 |
| REQ-FUNC-005 | 결과 없음 안내·초기화 | IMPLEMENT | UI_STATE | SCR-001 | 조건 완화 안내와 "필터 초기화" 버튼, 초기화 시 전체 목록 복원 | SMK-01 |
| REQ-FUNC-006 | 해외 상세 → 해당 국가 안전정보 | IMPLEMENT | UI_DIRECT | SCR-001 | 여행지 상세 Drawer에서 같은 Drawer 안의 국가 안전정보(`?safety=<countryCode>`)로 전환하고 돌아가기 버튼 제공 | UT-08, SMK-01 |
| REQ-FUNC-007 | 대표 이미지 출처·작가·라이선스 | EXCLUDED | UI_DIRECT | 없음 (EXCLUDED) | 미디어 라이선스 워크플로 제외. 이미지는 URL과 `alt`만 사용하며 `alt` 필수는 REQ-FUNC-079·REQ-NF-023에서 확인 | 없음 |
| REQ-FUNC-008 | 국내 10곳, 해외 15개국 30개 도시 | IMPLEMENT | NON_UI | 없음 (비UI) | `src/data`에 수량을 채우고 테스트로 수량을 검사 | UT-08 |
| REQ-FUNC-009 | 관련 여행지 최대 6개 | IMPLEMENT | UI_DIRECT | SCR-001 | 같은 국가·테마 여행지를 현재 여행지 제외 후 최대 6개 표시 | UT-01 |
| REQ-FUNC-010 | 필터 상태 URL 반영 | IMPLEMENT | UI_STATE | SCR-001 | 허용 필터만 query로 직렬화, 잘못된 값은 무시 | UT-01, SMK-01 |
| REQ-FUNC-011 | 항공 필수 입력 4개 | IMPLEMENT | UI_DIRECT | SCR-003 | SCR-003 항공편 탭(`/travel-tools?tab=flight`): 국가, 지역·도시, 출발일, 귀국일. 라벨·도움말·오류 영역 포함 | SMK-02 |
| REQ-FUNC-012 | 국가별 지역만 선택 | IMPLEMENT | UI_STATE | SCR-003 | 지역 선택지를 국가 데이터에서 생성, 국가 변경 시 지역 초기화 | SMK-02 |
| REQ-FUNC-013 | 항공 날짜 검증 | IMPLEMENT | UI_STATE | SCR-003 | 출발일 < 오늘 또는 귀국일 < 출발일이면 진행 차단·원인 표시 | UT-02, SMK-02 |
| REQ-FUNC-014 | 항공 입력 요약 | IMPLEMENT | UI_DIRECT | SCR-003 | 요약 단계 표시. "수정"으로 돌아가면 컴포넌트 상태의 값 유지 | SMK-02 |
| REQ-FUNC-015 | 항공 비전달 안내 | IMPLEMENT | UI_DIRECT | SCR-003 | 폼과 요약에 "입력값은 외부 사이트로 전달되지 않습니다" 표시, 버튼에 `aria-describedby` 연결 | SMK-02 |
| REQ-FUNC-016 | 항공 외부 URL 새 탭 | IMPLEMENT | UI_DIRECT | SCR-003 | `app_settings` 값 또는 기본 상수를 query 없이 `noopener,noreferrer` 새 탭으로 연다 | UT-04, SMK-02 |
| REQ-FUNC-017 | 항공 입력값 미저장 | IMPLEMENT | NON_UI | SCR-003 | 항공 폼용 서버 API·분석 이벤트를 만들지 않고 값은 컴포넌트 상태에만 둔다 | SMK-02 |
| REQ-FUNC-018 | 항공 URL 오류 처리 | IMPLEMENT | UI_STATE | SCR-003 | URL이 없거나 허용목록 밖이면 이동하지 않고 인라인 오류와 "다시 시도" 표시, `console.error` 기록 | UT-04, SMK-02 |
| REQ-FUNC-019 | 숙소 필수 입력 4개 | IMPLEMENT | UI_DIRECT | SCR-003 | SCR-003 숙소 탭(`/travel-tools?tab=hotel`): 국가, 지역·도시, 체크인, 체크아웃 | SMK-02 |
| REQ-FUNC-020 | 국가별 지역만 선택 | IMPLEMENT | UI_STATE | SCR-003 | 항공과 같은 지역 선택 컴포넌트 사용 | SMK-02 |
| REQ-FUNC-021 | 숙소 날짜 검증 | IMPLEMENT | UI_STATE | SCR-003 | 체크인 < 오늘 또는 체크아웃 ≤ 체크인이면 진행 차단 | UT-03, SMK-02 |
| REQ-FUNC-022 | 숙소 입력 요약 | IMPLEMENT | UI_DIRECT | SCR-003 | 국가·지역·체크인·체크아웃 요약, 입력값과 일치 | SMK-02 |
| REQ-FUNC-023 | 숙소 비전달 안내 | IMPLEMENT | UI_DIRECT | SCR-003 | 폼과 요약에 비전달 안내 표시 | SMK-02 |
| REQ-FUNC-024 | 숙소 외부 URL 새 탭 | IMPLEMENT | UI_DIRECT | SCR-003 | 항공과 같은 방식으로 숙소 URL을 연다 | UT-04, SMK-02 |
| REQ-FUNC-025 | 숙소 입력값 미저장 | IMPLEMENT | NON_UI | SCR-003 | 서버 API·분석 이벤트 없음, 컴포넌트 상태만 사용 | SMK-02 |
| REQ-FUNC-026 | 숙소 URL 오류 처리 | IMPLEMENT | UI_STATE | SCR-003 | 이동 차단, 입력 유지, 인라인 오류·재시도, `console.error` 기록 | UT-04, SMK-02 |
| REQ-FUNC-027 | 동행 쓰기에 인증 세션 필요 | IMPLEMENT | UI_STATE | SCR-003, SCR-004 | 비로그인 쓰기 시도는 `/account?tab=login&next=<원래 경로>`로 이동. RLS가 `auth.uid()` 없는 쓰기를 거부 | SMK-03, MAN-04 |
| REQ-FUNC-028 | 만 19세 이상 확인, 생년월일 미저장 | IMPLEMENT | UI_DIRECT | SCR-005 | SCR-005 프로필 탭의 성인 확인 체크로 `is_adult`, `adult_verified_at`만 저장. RLS가 `is_adult=true`를 요구 | SMK-03, SMK-04 |
| REQ-FUNC-029 | 동행 프로필 | IMPLEMENT | UI_DIRECT | SCR-005 | SCR-005 프로필 탭에서 닉네임·연령대·여행 스타일(필수), 성별·자기소개(선택) 입력 | SMK-04 |
| REQ-FUNC-030 | 동행글 필터 | IMPLEMENT | UI_DIRECT | SCR-004 | 국가·지역·기간 겹침·연령대·성별·스타일·모집 상태 필터를 Supabase 쿼리로 처리, 차단 관계 글 제외 | SMK-06 |
| REQ-FUNC-031 | 모집글 입력 항목 | IMPLEMENT | UI_DIRECT | SCR-003 | 제목·국가·지역·시작일·종료일·인원·선호 조건·스타일·설명·안전수칙 동의. 누락·역전 날짜·과거 종료일 차단 | UT-06, SMK-04 |
| REQ-FUNC-032 | 공개 연락처 탐지 | IMPLEMENT | UI_STATE | SCR-003 | 제출 전 정규식 검사로 차단하고 수정 안내 표시 | UT-05, SMK-04 |
| REQ-FUNC-033 | 이메일·연락처 비노출 | IMPLEMENT | UI_DIRECT | SCR-004 | `profiles`에 이메일 컬럼을 두지 않고 공개 컬럼만 조회 | SMK-04 |
| REQ-FUNC-034 | 참가 메시지 500자 비공개 | IMPLEMENT | UI_DIRECT | SCR-004 | 모집중 글에 ≤500자 메시지, PENDING 저장, RLS로 요청자·작성자만 열람 | SMK-05 |
| REQ-FUNC-035 | 중복 요청 차단 | IMPLEMENT | UI_STATE | SCR-004 | 부분 UNIQUE 인덱스와 UI 오류 메시지 | SMK-05 |
| REQ-FUNC-036 | 작성자 승인·거절 | IMPLEMENT | UI_DIRECT | SCR-005 | 작성자만 ACCEPTED/REJECTED로 변경(RLS). 감사 로그 기록은 제외(§7) | SMK-05 |
| REQ-FUNC-037 | 종료일 경과 자동 마감 | IMPLEMENT | UI_STATE | SCR-004 | 조회 시 `end_date` 기준으로 마감 계산, 모집중 목록에서 제외 | UT-06, SMK-04 |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | IMPLEMENT | UI_DIRECT | SCR-004, SCR-003, SCR-005 | SCR-004 상세 패널의 작성자 메뉴에서 마감·삭제(`DELETED`), 수정은 SCR-003 동행 구하기 탭(`&edit=<id>`). 승인자가 있으면 날짜 변경 전 화면 내 확인 Modal 표시 | SMK-04 |
| REQ-FUNC-039 | 글·사용자·요청 신고 | IMPLEMENT | UI_DIRECT | SCR-004 | 사유 코드와 설명 입력, 접수번호·접수 시각 표시 | SMK-06 |
| REQ-FUNC-040 | 사용자 차단·해제 | IMPLEMENT | UI_DIRECT | SCR-004, SCR-005 | `user_blocks`와 RLS로 상호 글·프로필·요청 비노출. SCR-004 상세 패널에서 차단, SCR-005 내 활동 탭에서 해제 | SMK-06 |
| REQ-FUNC-041 | 신고 큐 | IMPLEMENT | UI_DIRECT | SCR-005 | SCR-005 관리 탭(`?tab=admin`)에 대상·사유·설명·접수 시각·상태 목록과 OPEN/REVIEWING/RESOLVED/DISMISSED 필터 | SMK-07 |
| REQ-FUNC-042 | 운영자 제재 조치 | EXCLUDED | UI_DIRECT | 없음 (EXCLUDED) | 관리자는 신고 상태만 바꾼다. 경고·콘텐츠 숨김·계정 제한과 감사 로그는 제외. 신고 처리 결과는 REQ-FUNC-041의 RESOLVED/DISMISSED로 기록 | 없음 |
| REQ-FUNC-043 | 요청·처리 결과 알림 | IMPLEMENT | UI_STATE | SCR-005, 공통 Layout (SCR-001~005) | 이메일 없이 Toast와 SCR-005 내 활동 탭의 상태 배지로 제공 | SMK-05 |
| REQ-FUNC-044 | RLS 비공개 데이터 보호 | IMPLEMENT | NON_UI | 없음 (비UI) | §6 정책: 본인, 요청 대상 작성자, admin만 비공개 데이터 열람 | SMK-05, SMK-07, MAN-04 |
| REQ-FUNC-045 | 탈퇴 비식별화·30일 삭제 | EXCLUDED | NON_UI | 없음 (EXCLUDED) | Service Role 권한과 삭제 배치가 필요하다. 요청 시 Supabase 대시보드에서 수동 처리 | 없음 |
| REQ-FUNC-046 | 해외 국가별 안전정보 존재 | IMPLEMENT | NON_UI | 없음 (비UI) | `src/data/safety.ts`에 15개국 모두 작성 | UT-08 |
| REQ-FUNC-047 | 8개 안전 카테고리 | IMPLEMENT | UI_DIRECT | SCR-001 | 치안·사기·법규·교통·재난·기후·보건·문화·복장·긴급연락처 섹션을 타입으로 강제 | UT-08, SMK-01 |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 | IMPLEMENT | UI_DIRECT | SCR-001 | 안전 데이터에 필드를 두고 SCR-001 국가 안전정보 Drawer에 표시 | UT-08, SMK-01 |
| REQ-FUNC-049 | 외교부 원문 새 탭 링크 | IMPLEMENT | UI_DIRECT | SCR-001 | `https://www.0404.go.kr/` 링크에 `target="_blank"`, `rel="noopener noreferrer"`. 주간 링크 검사는 제외(REQ-NF-011) | SMK-01 |
| REQ-FUNC-050 | 7일 초과 stale 경고 | IMPLEMENT | UI_STATE | SCR-001 | 렌더링 시 계산해 경고 표시, "최신" 배지 숨김 | UT-07, SMK-01 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | IMPLEMENT | UI_STATE | SCR-001 | 출국권고·여행금지·특별여행주의보를 국가 안전정보 Drawer 최상단에 단계·행동요령·범위 텍스트로 표시 | SMK-01 |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 | IMPLEMENT | UI_DIRECT | SCR-001 | `scopeType`(COUNTRY/REGION)과 `scopeText` 필드, 지역 경보는 `scopeText` 필수 | UT-08 |
| REQ-FUNC-053 | 긴급전화·재외공관 정보 | IMPLEMENT | UI_DIRECT | SCR-001 | 번호·링크·출처·확인일 표시 | UT-08, SMK-01 |
| REQ-FUNC-054 | 공식 판단 비대체 고지 | IMPLEMENT | UI_DIRECT | SCR-001, SCR-003 | SCR-001 국가 안전정보 Drawer와 SCR-003 항공 요약에 원문 재확인 안내 표시 | SMK-01, SMK-02 |
| REQ-FUNC-055 | 안전 콘텐츠 작성·검수·게시 | EXCLUDED | UI_DIRECT | 없음 (EXCLUDED) | 전체 콘텐츠 CMS 제외. `src/data` 수정·코드 리뷰·재배포로 대신한다 | 없음 |
| REQ-FUNC-056 | 안전정보 변경 이력 | EXCLUDED | NON_UI | 없음 (EXCLUDED) | 범용 감사 로그 제외. 변경 이력은 Git 커밋 이력으로 확인 | 없음 |
| REQ-FUNC-057 | `free_traveler`, `50+ Trips`, `30+ Countries` | IMPLEMENT | UI_DIRECT | SCR-002, SCR-001 | `src/data/curator.ts` 단일 값을 SCR-001 free_traveler 소개 영역과 SCR-002 여행 지표에서 사용 | UT-08, SMK-01, SMK-09 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 | IMPLEMENT | UI_DIRECT | SCR-002 | PRD 6-1·6-2 문구를 줄이지 않고 SCR-002 소개 영역에 표시 | SMK-09 |
| REQ-FUNC-059 | 방문 국가 30개 이상 목록 | IMPLEMENT | UI_DIRECT | SCR-002 | SCR-002 방문 국가 영역: 지도 대신 권역별 국가 Chip 30개. 소개된 국가는 SCR-001 국가 안전정보 Drawer로 연결 | UT-08, SMK-09 |
| REQ-FUNC-060 | 대표 여행 타임라인 | IMPLEMENT | UI_DIRECT | SCR-002 | 연도·장소·요약 항목 목록 | UT-08, SMK-09 |
| REQ-FUNC-061 | 대표 이미지 메타데이터·플레이스홀더 | EXCLUDED | UI_DIRECT | 없음 (EXCLUDED) | 미디어 라이선스 워크플로 제외. `alt` 필수와 로드 실패 플레이스홀더는 공통 이미지 컴포넌트로 처리(REQ-FUNC-079) | 없음 |
| REQ-FUNC-062 | 문의·SNS 링크 | IMPLEMENT | UI_DIRECT | SCR-002 | 관리자 설정 대신 `src/data/curator.ts` 값 사용. 빈 값은 렌더링하지 않고 `https:`·`mailto:`만 허용 | UT-08, SMK-09 |
| REQ-FUNC-063 | 추천 여행지 6개 | IMPLEMENT | UI_DIRECT | SCR-002 | SCR-002 기억에 남는 여행지 영역의 추천 6곳 Chip에서 SCR-001 여행지 상세 Drawer로 연결. 존재하지 않는 slug는 테스트 실패 | UT-08, SMK-09 |
| REQ-FUNC-064 | 전역 내비게이션·푸터 | IMPLEMENT | UI_DIRECT | 공통 Layout (SCR-001~005) | `src/app/layout.tsx`의 공통 Header(5개 Screen 메뉴, 계정 진입)와 정책 Modal을 여는 Footer | SMK-08, UT-10 |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | IMPLEMENT | UI_DIRECT | 공통 Layout (SCR-001~005) | Mobile First Tailwind 레이아웃 | SMK-08 |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | IMPLEMENT | UI_DIRECT | SCR-005, 기술 Route | SCR-005 로그인 탭과 기술 Route `/auth/callback`에서 Supabase Auth 사용. 이메일 미인증 계정은 로그인·쓰기 불가 | SMK-04, MAN-01 |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | IMPLEMENT | UI_DIRECT | SCR-001 | SCR-001 검색 결과에 "여행지"/"안전정보" 유형 라벨과 일치 문자열 강조 | UT-01, SMK-01 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | IMPLEMENT | UI_DIRECT | SCR-001 | `localStorage`에 저장, 중복 방지, SCR-001에서 즐겨찾기만 보기 | UT-09 |
| REQ-FUNC-069 | URL 공유 | IMPLEMENT | UI_DIRECT | SCR-001, SCR-004 | 여행지 상세·국가 안전정보 Drawer와 SCR-004 동행 상세 패널에 공유 버튼. Web Share API 실패 시 URL 복사 후 Toast | SMK-01 |
| REQ-FUNC-070 | 페이지별 SEO 메타 | IMPLEMENT | NON_UI | 공통 Layout (SCR-001~005) | Metadata API로 5개 Route의 title·description·canonical·Open Graph, `?dest`는 `generateMetadata`로 여행지별 값. `/`에 WebSite JSON-LD | SMK-08 |
| REQ-FUNC-071 | 행동 분석 이벤트 | EXCLUDED | NON_UI | 없음 (EXCLUDED) | 분석 이벤트를 수집하지 않는다. 수집 도구가 없으므로 입력값이 분석으로 새는 경로도 없다 | 없음 |
| REQ-FUNC-072 | 여행지 콘텐츠 CRUD·미리보기 | EXCLUDED | UI_DIRECT | 없음 (EXCLUDED) | 전체 콘텐츠 CMS 제외. 로컬 `npm run dev`와 Vercel Preview 배포가 미리보기 역할 | 없음 |
| REQ-FUNC-073 | 미디어 업로드 메타데이터 | EXCLUDED | UI_DIRECT | 없음 (EXCLUDED) | 미디어 업로드·라이선스 승인 워크플로 제외 | 없음 |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | IMPLEMENT | NON_UI | 없음 (비UI) | 정적 데이터 완전성 단위 테스트가 실패하면 배포하지 않는다. 누락 필드 목록을 실패 메시지로 출력 | UT-08 |
| REQ-FUNC-075 | 안전정보 stale 대시보드 | EXCLUDED | UI_DIRECT | 없음 (EXCLUDED) | 관리 탭은 신고와 외부 URL만 다룬다. stale 상태는 공개 국가 안전정보 Drawer에 표시(REQ-FUNC-050) | 없음 |
| REQ-FUNC-076 | 관리자 감사 로그 | EXCLUDED | NON_UI | 없음 (EXCLUDED) | 범용 감사 로그 제외. 신고 처리자·처리 시각만 `reports`에 기록 | 없음 |
| REQ-FUNC-077 | 외부 URL 관리자 설정 | IMPLEMENT | UI_DIRECT | SCR-005 | SCR-005 관리 탭에서 HTTPS·허용 호스트만 저장. DB CHECK와 UI 검증 | UT-04, SMK-07 |
| REQ-FUNC-078 | 오류 화면 복구 행동 | IMPLEMENT | UI_STATE | 기술 Route, SCR-003, SCR-005 | `not-found.tsx`(홈), `error.tsx`(다시 시도·홈), 권한 없음(홈·로그인), 외부 연결 실패(재시도) | SMK-07, SMK-08 |
| REQ-FUNC-079 | HTML 의미·ARIA 상태 | IMPLEMENT | UI_DIRECT | 공통 Layout (SCR-001~005) | 폼 라벨·오류 `aria-describedby`, 탭 `role="tablist"`, Drawer·Modal 포커스 이동과 Esc 닫기, Toast `aria-live`, 이미지 `alt` 필수 | SMK-08, MAN-02 |
| REQ-FUNC-080 | 정책 문서·안전수칙 동의 기록 | IMPLEMENT | UI_DIRECT | 공통 Layout (SCR-001~005), SCR-003 | Footer 정책 Modal 4종. SCR-003 동행 구하기 탭에서 글 작성 시 `safety_agreed_at`, `policy_version` 저장 | SMK-04 |

---

## 7. 비기능 요구사항 (REQ-NF-001~034)

| ID | 요구사항 요지 | 범위 | UI 분류 | 배치 Screen | 구현 기준 (개정) | 확인 방법 |
|---|---|---|---|---|---|---|
| REQ-NF-001 | LCP ≤2.5s | IMPLEMENT | NON_UI | 공통 Layout (SCR-001~005) | 정적 데이터 렌더링, 첫 이미지 `priority`. 실제 사용자 p75 대신 배포 URL의 모바일 Lighthouse 측정값으로 판단 | MAN-03 |
| REQ-NF-002 | INP p75 ≤200ms | EXCLUDED | NON_UI | 없음 (EXCLUDED) | 실제 사용자 필드 데이터 수집 도구를 두지 않는다(행동 분석 제외) | 없음 |
| REQ-NF-003 | CLS ≤0.1 | IMPLEMENT | NON_UI | 공통 Layout (SCR-001~005) | 이미지 `width`·`height` 지정, Drawer·패널은 오버레이로 열어 본문 이동 방지. Lighthouse 측정값으로 판단 | MAN-03 |
| REQ-NF-004 | 필터 p95 ≤1s, 동시 50명 | EXCLUDED | NON_UI | 없음 (EXCLUDED) | 부하 테스트 제외. 여행지 필터는 클라이언트 메모리에서 처리 | 없음 |
| REQ-NF-005 | 쓰기 p95 ≤3s | EXCLUDED | NON_UI | 없음 (EXCLUDED) | 부하 테스트 제외. 신고 접수 3초 이내 표시는 REQ-FUNC-039에서 단일 요청으로 확인 | 없음 |
| REQ-NF-006 | 이미지 최적화 | IMPLEMENT | NON_UI | 공통 Layout (SCR-001~005) | `next/image`, `sizes` 지정, 기본 lazy load, 첫 화면 이미지 `priority` | MAN-03 |
| REQ-NF-007 | Lighthouse Performance ≥85 | IMPLEMENT | OPERATIONS | 없음 (비UI) | CI 대신 배포 전 수동 측정 | MAN-03 |
| REQ-NF-008 | 월간 가용성 ≥99.5% | EXCLUDED | OPERATIONS | 없음 (EXCLUDED) | 장애 알림·모니터링 제외. Vercel·Supabase 기본 가용성에 의존 | 없음 |
| REQ-NF-009 | 내부 API 5xx ≤0.5% | EXCLUDED | OPERATIONS | 없음 (EXCLUDED) | 자체 API가 없고 모니터링을 두지 않는다 | 없음 |
| REQ-NF-010 | DB 백업 RPO/RTO | EXCLUDED | OPERATIONS | 없음 (EXCLUDED) | 자동 백업 제외. Supabase 플랜 기본 백업에 의존 | 없음 |
| REQ-NF-011 | 주간 링크 자동 검사·알림 | EXCLUDED | OPERATIONS | 없음 (EXCLUDED) | 장애 알림 제외. 외부 링크 형식은 SMK-02·SMK-01에서 배포 전 확인 | 없음 |
| REQ-NF-012 | TLS 1.2 이상 | IMPLEMENT | NON_UI | 없음 (비UI) | Vercel 기본 HTTPS, Supabase HTTPS 엔드포인트만 사용 | 배포 URL `curl -I http://…`이 HTTPS로 리다이렉트 (RAC-10) |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | IMPLEMENT | NON_UI | 없음 (비UI) | 모든 테이블 RLS 활성화, `role`은 DB에서만 판단 | SMK-05, SMK-07, MAN-04 |
| REQ-NF-014 | CSRF·SameSite | IMPLEMENT | NON_UI | 없음 (비UI) | 자체 상태 변경 엔드포인트 없음. Supabase 요청은 Authorization 헤더, `@supabase/ssr` 세션 쿠키는 SameSite=Lax | SMK-04 (세션 쿠키 속성) |
| REQ-NF-015 | 입력 검증·XSS 차단 | IMPLEMENT | NON_UI | 없음 (비UI) | React 기본 이스케이프, 사용자 입력에 `dangerouslySetInnerHTML` 금지, 길이 제한 DB CHECK | SMK-04 |
| REQ-NF-016 | 비밀키 환경변수 관리 | IMPLEMENT | NON_UI | 없음 (비UI) | 클라이언트에는 `NEXT_PUBLIC_*` 공개 값만 사용, Service Role Key 미사용, `.env*` Git 제외 | `npm run build` 후 `.next/static`에 비밀값 없음 (RAC-09) |
| REQ-NF-017 | 항공·숙소 원시 입력 미보존 | IMPLEMENT | NON_UI | SCR-003 | REQ-FUNC-017·025와 같은 방식 | SMK-02 |
| REQ-NF-018 | 개인정보 내보내기·탈퇴·삭제 | EXCLUDED | UI_DIRECT | 없음 (EXCLUDED) | Service Role 권한과 삭제 배치가 필요하다. 요청 시 수동 처리(REQ-FUNC-045) | 없음 |
| REQ-NF-019 | 신고 접수 p95 ≤3s | EXCLUDED | NON_UI | 없음 (EXCLUDED) | 부하 테스트 제외. 단일 요청 3초 이내 표시는 REQ-FUNC-039에서 확인 | 없음 |
| REQ-NF-020 | 신고 1차 검토 24h 90% | EXCLUDED | OPERATIONS | 없음 (EXCLUDED) | 운영 인력의 처리 시간 목표로 소프트웨어 구현 대상이 아니다. SCR-005 관리 탭은 접수 시각을 표시 | 없음 |
| REQ-NF-021 | 쓰기 속도 제한 429 | EXCLUDED | NON_UI | 없음 (EXCLUDED) | 서버 측 속도 제한 인프라를 두지 않는다. Supabase Auth 기본 제한만 적용 | 없음 |
| REQ-NF-022 | Moderator 조치 추적 | EXCLUDED | NON_UI | 없음 (EXCLUDED) | 범용 감사 로그 제외. 신고 처리자·시각만 `reports`에 기록 | 없음 |
| REQ-NF-023 | WCAG 2.2 AA 목표 | IMPLEMENT | UI_DIRECT | 공통 Layout (SCR-001~005) | REQ-FUNC-079 규칙, 상태·경보는 텍스트 라벨 병기, 터치 대상 24×24px 이상 | SMK-08, MAN-02 |
| REQ-NF-024 | axe serious/critical 0건 | IMPLEMENT | OPERATIONS | 없음 (비UI) | `@axe-core/playwright`로 5개 Route와 열린 Drawer·패널 검사 | SMK-08 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | IMPLEMENT | OPERATIONS | 없음 (비UI) | SCR-001~005 핵심 흐름 수동 검사 | MAN-02 |
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | IMPLEMENT | NON_UI | 없음 (비UI) | REQ-FUNC-074 완전성 테스트 | UT-08 |
| REQ-NF-027 | 해외 국가 안전정보 커버리지 100% | IMPLEMENT | NON_UI | 없음 (비UI) | REQ-FUNC-046 데이터 검사 | UT-08 |
| REQ-NF-028 | 안전정보 7일 이내 95%, 초과 시 경고 100% | IMPLEMENT | UI_STATE | SCR-001 | 초과 시 경고는 렌더링 계산으로 100% 표시. 7일 이내 95%는 `src/data/safety.ts`의 `verifiedAt`을 주기적으로 갱신해 재배포하는 운영 작업으로 유지 | UT-07, SMK-01 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | EXCLUDED | NON_UI | 없음 (EXCLUDED) | 미디어 라이선스 워크플로 제외. 이미지는 URL과 `alt`만 사용 | 없음 |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | IMPLEMENT | NON_UI | 공통 Layout (SCR-001~005) | REQ-FUNC-070 방식 | SMK-08 |
| REQ-NF-031 | TypeScript strict·lint·unit test | IMPLEMENT | OPERATIONS | 없음 (비UI) | `strict: true` 유지, `lint`·`typecheck`·`test:unit` 통과 후 사용자가 직접 Merge. 자동 Merge Runner 없음 | §8 배포 전 검사(RAC-02) |
| REQ-NF-032 | 구조화 로그 | EXCLUDED | NON_UI | 없음 (EXCLUDED) | 자체 서버 엔드포인트가 없어 기록할 서버 요청이 없다. Vercel 기본 로그만 사용 | 없음 |
| REQ-NF-033 | 핵심 오류 알림 | EXCLUDED | OPERATIONS | 없음 (EXCLUDED) | 장애 알림 제외 | 없음 |
| REQ-NF-034 | 월 인프라 비용 ≤100,000원 | IMPLEMENT | OPERATIONS | 없음 (비UI) | Vercel·Supabase 무료 또는 최저 요금제, 유료 부가 기능 미사용 | Vercel·Supabase 요금제·청구 화면 확인 (RAC-10) |

---

## 8. 검증 계획

### 8.1 단위 테스트 (Vitest, `src/**/*.test.ts`)

| ID | 대상 |
|---|---|
| UT-01 | 여행지 필터·키워드 검색·국내/해외 구분·검색 결과 유형(`kind`)·관련 여행지·URL query 직렬화 |
| UT-02 | 항공 날짜 검증 (오늘 이전 출발일, 귀국일 < 출발일, 오늘 경계값) |
| UT-03 | 숙소 날짜 검증 (오늘 이전 체크인, 체크아웃 ≤ 체크인) |
| UT-04 | 외부 URL 허용목록 (HTTPS, 허용 호스트, `http:`·`javascript:`·`data:` 거부, query 없음) |
| UT-05 | 공개 연락처 탐지 기준 테스트셋 (탐지율 ≥95%, 오탐 ≤5%) |
| UT-06 | 자동 마감 계산 (`end_date` 기준, Asia/Seoul) |
| UT-07 | 안전정보 stale 계산 (7일 경계, 고정 기준 시각) |
| UT-08 | 정적 데이터 완전성 (여행지 필수 필드·수량, 해외 국가별 안전정보, 8개 카테고리, 경보 범위, 대표 프로필, 추천 slug 존재, 모든 이미지 `alt`) |
| UT-09 | 즐겨찾기 저장 (중복 방지, `localStorage` 예외 시 빈 목록) |
| UT-10 | Route Contract: `SCREEN_ROUTE_CONTRACT.json`과 `src/app` 파일 일치, `route.ts`·Server Action 없음, SCR-001 시작 화면 흔적 없음 |

### 8.2 Playwright 핵심 Smoke Test (Chromium, `e2e/*.spec.ts`)

| ID | Screen | 시나리오 |
|---|---|---|
| SMK-01 | SCR-001 `/` | 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| SMK-02 | SCR-003 `/travel-tools` 항공편·숙소 탭 | 필수값·날짜 오류 차단, 요약 일치, 비전달 안내, 외부 링크 `href`(query 없음)·`target`·`rel`, 입력 중 네트워크 요청에 입력값 없음, 탭 간 상태 분리 |
| SMK-03 | SCR-004, SCR-003 (비회원) | 동행 목록·상세 열람 가능, 참가 요청·신고·차단·동행 구하기 탭 진입 시 `/account?tab=login&next=…`로 안내 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) | 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-05 | SCR-004, SCR-005 (회원 A·B) | B 참가 요청 → 중복 요청 차단 → A 내 활동에서 승인·거절 → B 내 활동에 상태 표시, 제3자는 요청을 볼 수 없음 |
| SMK-06 | SCR-004, SCR-005 | 신고 접수번호·시각 3초 이내 표시, 차단 후 상대 글·프로필이 목록에서 사라짐, 내 활동에서 차단 해제 |
| SMK-07 | SCR-005 관리 탭 | 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원에게는 관리 탭이 렌더링되지 않음 |
| SMK-08 | 공통 | 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |
| SMK-09 | SCR-002 `/about` | 7개 영역, `50+ Trips`·`30+ Countries`가 SCR-001과 일치, 국가 30개, 링크 Chip → `/?safety=`, 추천 6곳 → `/?dest=`, 빈 SNS 링크 미표시 |
| SMK-10 | 이동 관계 | `SCREEN_ROUTE_CONTRACT.json`의 `required_navigation` 대표 경로가 실제로 이동 |

로그인이 필요한 시나리오는 이메일 인증을 마친 테스트 계정(PROJECT_SCOPE §2.3)을 쓴다.

### 8.3 수동 확인

| ID | 대상 |
|---|---|
| MAN-01 | 가입 인증 메일 수신·인증 링크(`/auth/callback`), 비밀번호 재설정 메일 |
| MAN-02 | 키보드만으로 SCR-001~005 핵심 흐름 완료, VoiceOver로 폼 오류·Drawer 제목 읽힘 |
| MAN-03 | Vercel 배포 URL에서 모바일 Lighthouse (Performance ≥85, LCP ≤2.5s, CLS ≤0.1) |
| MAN-04 | Supabase 대시보드에서 RLS 활성화·정책 목록 확인 |
