# TASK-PAGE-SCR005 SCR-005 계정·관리 페이지 조립

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 47 | PAGE-SCR005 | SCR-005 계정·관리 페이지 조립 | Page Owner | IMPLEMENT | REQ-FUNC-029, REQ-FUNC-041, REQ-FUNC-066, REQ-FUNC-070, REQ-NF-030 | SCR-005 | `/account` | `src/app/account/page.tsx` | GLOBAL-LAYOUT, AUTH-SUPABASE, DB-ACCESS, COMP-SCR005-AUTH, COMP-SCR005-PROFILE, COMP-SCR005-ACTIVITY, COMP-SCR005-ADMIN | `src/app/account/page.tsx` | 1) Guest·Member·Admin 상태를 실제로 조립: Guest=`login`(탭 바 없음), Member=`profile`·`activity`, Admin=+`admin`<br>2) 역할별 Section 순서와 데이터 출처: Intro(정적·세션) → 핵심 작업(Guest 인증 Card / Member 프로필·내 글·요청·차단 / Admin 신고·외부 URL: `profiles`·`mate_posts`·`mate_applications`·`user_blocks`·`reports`·`app_settings`) → 도움말 또는 다음 행동(CTA)<br>3) 역할에 없는 관리 영역은 렌더링하지 않음, 회원의 `tab=admin`은 내 활동 + Toast, 비회원의 회원 탭은 로그인 + 안내<br>4) `next`·`mode` query 처리, `metadata` 설정<br>5) 화면 상태(UI_CONTRACT §6 상태표)를 의존 Component·데이터와 연결해 실제로 표시 — Loading: 세션 확인 중 탭 영역·목록 Skeleton / Empty: 내 글·받은 요청·보낸 요청·차단·신고 목록마다 이유 + 다음 행동 / Error: 로그인 실패, 이메일 미인증(인증 메일 다시 보내기), 만료된 링크, 닉네임 중복, 외부 URL 검증, 저장 실패 / Unauthorized: 비회원의 회원 탭 → 로그인 화면, 회원의 `tab=admin` → 관리 탭 없이 내 활동 + Toast | 1) 최소: Guest 영역 4, 신고 상태 4, 도움말 3<br>2) 밀도: Desktop Guest 분할·Member 요약 띠 + 탭·Admin 2열 / Mobile 1열<br>3) 금지: Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역. 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State (내 글·받은 요청·보낸 요청·차단·신고 목록 각각)<br>4) D-001 토큰만 사용(흰 배경·텍스트 `#222222`·CTA 코랄 `#CF4329`·Inter + 시스템 한글·터치 44px 이상·`:focus-visible`). 임의 색·글꼴·그림자 값과 Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI 금지 | 1) 권한은 RLS·`profiles.role` 기준, 화면 숨김은 보조<br>2) 생년월일·다른 회원 이메일 미노출 | `npm run build`, E2E-MATE-AUTH, Vercel Preview 확인 | P0 |

## 1. Context

SCR-005 계정·관리 화면(`/account`)의 "SCR-005 계정·관리 페이지 조립" 작업이다. 이 Task는 Page Owner 단계로, 요구사항 5건(REQ-FUNC-029, REQ-FUNC-041, REQ-FUNC-066, REQ-FUNC-070, REQ-NF-030)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-LAYOUT, AUTH-SUPABASE, DB-ACCESS, COMP-SCR005-AUTH, COMP-SCR005-PROFILE, COMP-SCR005-ACTIVITY, COMP-SCR005-ADMIN. 이 Task가 끝나야 UNIT-ROUTE-CONTRACT, E2E-PUBLIC-SMOKE, E2E-MATE-AUTH, MANUAL-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- `src/app/account/page.tsx`에서 Route Page를 조립한다: 의존 Component 배치, 데이터 연결, URL query 해석, metadata
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 하위 Component 생성·수정 (의존 Component Task 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-029 | 동행 프로필 | SCR-005 프로필 탭에서 닉네임·연령대·여행 스타일(필수), 성별·자기소개(선택) 입력 |
| REQ-FUNC-041 | 신고 큐 | SCR-005 관리 탭(`?tab=admin`)에 대상·사유·설명·접수 시각·상태 목록과 OPEN/REVIEWING/RESOLVED/DISMISSED 필터 |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | SCR-005 로그인 탭과 기술 Route `/auth/callback`에서 Supabase Auth 사용. 이메일 미인증 계정은 로그인·쓰기 불가 |
| REQ-FUNC-070 | 페이지별 SEO 메타 | Metadata API로 5개 Route의 title·description·canonical·Open Graph, `?dest`는 `generateMetadata`로 여행지별 값. `/`에 WebSite JSON-LD |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | REQ-FUNC-070 방식 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-005 계정·관리 (핵심) |
| Route | `/account` |
| Page Entry | `src/app/account/page.tsx` |
| 이 Task의 역할 | Route Page 조립 (Page Owner) |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §6 SCR-005 계정·관리 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.5 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `97ccb288104a40f3a1c10c801636f942` (Mobile 디자인 없음 — UI_CONTRACT §1.4 Mobile 규칙)
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-LAYOUT — Root Layout·공통 Header·Footer·정책 Modal (Seq 5)
- AUTH-SUPABASE — Supabase 클라이언트·세션·Proxy (Seq 12)
- DB-ACCESS — 동행·요청·차단·신고·설정 데이터 접근 계층 (Seq 14)
- COMP-SCR005-AUTH — 계정: 로그인·가입·비밀번호 재설정 (Guest) (Seq 39)
- COMP-SCR005-PROFILE — 계정: 요약·탭·성인 확인·프로필 (Seq 40)
- COMP-SCR005-ACTIVITY — 계정: 내 활동 (Seq 41)
- COMP-SCR005-ADMIN — 계정: 관리(신고 상태·외부 URL) (Seq 42)

## 7. Expected Files

**생성**

- `src/app/account/page.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- Guest·Member·Admin 상태를 실제로 조립: Guest=`login`(탭 바 없음), Member=`profile`·`activity`, Admin=+`admin`
- 역할별 Section 순서와 데이터 출처: Intro(정적·세션) → 핵심 작업(Guest 인증 Card / Member 프로필·내 글·요청·차단 / Admin 신고·외부 URL: `profiles`·`mate_posts`·`mate_applications`·`user_blocks`·`reports`·`app_settings`) → 도움말 또는 다음 행동(CTA)
- 역할에 없는 관리 영역은 렌더링하지 않음, 회원의 `tab=admin`은 내 활동 + Toast, 비회원의 회원 탭은 로그인 + 안내
- `next`·`mode` query 처리, `metadata` 설정

**화면 상태** (`UI_CONTRACT.md` §6 상태표, `04_UIUX_PLAN.md` §7) — 의존 Component의 상태를 Page에서 데이터와 연결해 실제로 표시한다.

| 상태 | 표시 |
|---|---|
| Loading | 세션 확인 중 탭 영역·목록 Skeleton |
| Empty | 내 글·받은 요청·보낸 요청·차단·신고 목록마다 이유 + 다음 행동 |
| Error | 로그인 실패, 이메일 미인증(인증 메일 다시 보내기), 만료된 링크, 닉네임 중복, 외부 URL 검증, 저장 실패 |
| Unauthorized | 비회원의 회원 탭 → 로그인 화면, 회원의 `tab=admin` → 관리 탭 없이 내 활동 + Toast |

## 9. Visual AC

**Section 순서와 데이터 출처** (계약 `sections` 순서)


| 순서 | Section id | 제목 | 데이터 출처 |
|---|---|---|---|
| 1 | `guest-intro` | Free Traveler 계정 | 정적 문구 |
| 2 | `guest-auth` | 로그인 / 회원가입 / 비밀번호 재설정 | Supabase Auth |
| 3 | `guest-features` | 로그인하면 이런 일을 할 수 있어요 | 정적 문구 |
| 4 | `guest-privacy` | 개인정보는 꼭 필요한 만큼만 받아요 | 정적 문구 |
| 5 | `member-summary` | 안녕하세요, {닉네임}님 | 세션 + `profiles` |
| 6 | `profile` | 프로필과 성인 확인 | `profiles` |
| 7 | `my-posts` | 내가 올린 동행글 | `mate_posts` |
| 8 | `applications` | 참가 요청 | `mate_applications` |
| 9 | `blocks` | 차단한 회원 | `user_blocks` |
| 10 | `new-post-cta` | 다음 여행의 동행을 모집해 보세요 | 정적 문구 |
| 11 | `admin-reports` | 운영 관리 · 신고 목록 | `reports` (admin) |
| 12 | `admin-outbound` | 항공·숙소 외부 이동 주소 | `app_settings` (admin) |
| 13 | `help` | 도움말 | 정적 문구 |

역할별 표시: Guest(`tab=login`) → `guest-intro`~`guest-privacy` / Member 프로필 탭 → `member-summary`, `profile`, `help` / Member 내 활동 탭 → `member-summary`, `my-posts`, `applications`, `blocks`, `new-post-cta`, `help` / Admin 관리 탭 → `member-summary`, `admin-reports`, `admin-outbound` (역할에 없는 관리 영역은 렌더링하지 않음)

**최소 콘텐츠**

| 항목 | 최소 수 |
|---|---|
| Guest 영역 | 4 |
| 신고 상태 Chip | 4 |
| 도움말 항목 | 3 |

**반응형 콘텐츠 밀도**

| 구간 | 기준 |
|---|---|
| Desktop 1440px | Guest Intro + 인증 Card 분할 · 기능 3열 / Member 요약 띠 + 탭 · 목록 행 버튼 오른쪽 / Admin 2열 |
| Mobile 390px | 1열, 행 버튼 아래 줄, 신고 목록 Card |
| 320px | 가로 스크롤 없음 |

**공통 조건**

- 최소: Guest 영역 4, 신고 상태 4, 도움말 3
- 밀도: Desktop Guest 분할·Member 요약 띠 + 탭·Admin 2열 / Mobile 1열
- 금지: Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역. 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State (내 글·받은 요청·보낸 요청·차단·신고 목록 각각)
- 모든 Section에 제목·1~3문장 설명·실제 콘텐츠 또는 CTA가 있다
- 목록 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State를 보여 준다
- D-001 토큰만 사용(흰 배경·텍스트 `#222222`·CTA 코랄 `#CF4329`·Inter + 시스템 한글·터치 44px 이상·`:focus-visible`). 임의 색·글꼴·그림자 값과 Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI 금지

## 10. Security/Privacy AC

- 권한은 RLS·`profiles.role` 기준, 화면 숨김은 보조
- 생년월일·다른 회원 이메일 미노출

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-01 | 가입 인증 메일 수신·인증 링크(`/auth/callback`), 비밀번호 재설정 메일 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-07 | SCR-005 관리 탭 — 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원에게는 관리 탭이 렌더링되지 않음 |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-PUBLIC-SMOKE, E2E-MATE-AUTH, MANUAL-CHECK, RELEASE-CHECK

## 12. Verify

- `npm run build`, E2E-MATE-AUTH, Vercel Preview 확인
- E2E-MATE-AUTH 실행: `npx playwright test e2e/mate-auth.spec.ts --project=chromium` (테스트 계정 환경변수 필요) — spec이 아직 없으면(E2E-MATE-AUTH 이전) 실행하지 않고 "보류 — E2E-MATE-AUTH에서 검증"으로 기록한다.
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
- Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI를 쓰지 않는다
