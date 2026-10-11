# TASK-COMP-SCR003-MATE-COMPOSE 동행 구하기 탭: 권한 안내·작성·수정

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 33 | COMP-SCR003-MATE-COMPOSE | 동행 구하기 탭: 권한 안내·작성·수정 | Component | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-038, REQ-FUNC-080 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | GLOBAL-UI-KIT, AUTH-SUPABASE, DB-ACCESS, LOGIC-CONTACT-DETECTION, LOGIC-TRAVEL-DATES, LOGIC-MATE-STATE | `src/components/tools/MateAuthGate.tsx`, `src/components/tools/MatePostForm.tsx`, `src/components/tools/SafetyGuideCard.tsx` | 1) 비회원: 로그인 안내 Card + 3단계 + `/account?tab=login&next=/travel-tools?tab=mate`<br>2) 성인 확인 전: `/account?tab=profile` 안내<br>3) 작성 Form(로그인·성인 확인 후): 제목·여행 정보(국가·지역·시작일·종료일)·인원·선호·스타일·설명(글자 수)·안전수칙 동의, 오류 요약 `role="alert"`<br>4) 연락처 탐지 시 차단·위치 안내, 제출 중·실패(입력 유지)<br>5) `&edit=<id>` 수정 모드, 승인자 있으면 날짜 변경 확인 Modal, 권한 없음 안내<br>6) 완료 시 `/mates?post=<id>` + Toast | 1) 8:4 분할(Form + 안전 안내), Mobile 안전 안내는 Form 아래 | 1) 공개 연락처 금지<br>2) 동의 시 `safety_agreed_at`·`policy_version` 저장<br>3) 사용자 입력은 텍스트로만 렌더링 | E2E-MATE-AUTH, UNIT-CONTACT-DETECTION | P0 |

## 1. Context

SCR-003 통합 여행 준비 화면(`/travel-tools`)의 "동행 구하기 탭: 권한 안내·작성·수정" 작업이다. 이 Task는 Component 단계로, 요구사항 6건(REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-038, REQ-FUNC-080)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT, AUTH-SUPABASE, DB-ACCESS, LOGIC-CONTACT-DETECTION, LOGIC-TRAVEL-DATES, LOGIC-MATE-STATE. 이 Task가 끝나야 PAGE-SCR003를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 3개 안에서 "동행 구하기 탭: 권한 안내·작성·수정"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Page Entry(`page.tsx`) 조립 (Page Owner 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-027 | 동행 쓰기에 인증 세션 필요 | 비로그인 쓰기 시도는 `/account?tab=login&next=<원래 경로>`로 이동. RLS가 `auth.uid()` 없는 쓰기를 거부 |
| REQ-FUNC-028 | 만 19세 이상 확인, 생년월일 미저장 | SCR-005 프로필 탭의 성인 확인 체크로 `is_adult`, `adult_verified_at`만 저장. RLS가 `is_adult=true`를 요구 |
| REQ-FUNC-031 | 모집글 입력 항목 | 제목·국가·지역·시작일·종료일·인원·선호 조건·스타일·설명·안전수칙 동의. 누락·역전 날짜·과거 종료일 차단 |
| REQ-FUNC-032 | 공개 연락처 탐지 | 제출 전 정규식 검사로 차단하고 수정 안내 표시 |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | SCR-004 상세 패널의 작성자 메뉴에서 마감·삭제(`DELETED`), 수정은 SCR-003 동행 구하기 탭(`&edit=<id>`). 승인자가 있으면 날짜 변경 전 화면 내 확인 Modal 표시 |
| REQ-FUNC-080 | 정책 문서·안전수칙 동의 기록 | Footer 정책 Modal 4종. SCR-003 동행 구하기 탭에서 글 작성 시 `safety_agreed_at`, `policy_version` 저장 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-003 통합 여행 준비 (핵심) |
| Route | `/travel-tools` |
| Page Entry | `src/app/travel-tools/page.tsx` |
| 이 Task의 역할 | Page Owner가 조립할 Component |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §4 SCR-003 통합 여행 준비 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.3 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `e60c66e71011429289057057824b567c`, Mobile `ffa60caca42c439cb75b48963f5f1d05`
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-UI-KIT — 공통 UI Component (Seq 4)
- AUTH-SUPABASE — Supabase 클라이언트·세션·Proxy (Seq 12)
- DB-ACCESS — 동행·요청·차단·신고·설정 데이터 접근 계층 (Seq 14)
- LOGIC-CONTACT-DETECTION — 공개 연락처 탐지 (Seq 18)
- LOGIC-TRAVEL-DATES — 항공·숙소·동행 날짜와 지역 검증 (Seq 16)
- LOGIC-MATE-STATE — 동행글·참가 요청 상태 전이 (Seq 13)

## 7. Expected Files

**생성**

- `src/components/tools/MateAuthGate.tsx`
- `src/components/tools/MatePostForm.tsx`
- `src/components/tools/SafetyGuideCard.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 비회원: 로그인 안내 Card + 3단계 + `/account?tab=login&next=/travel-tools?tab=mate`
- 성인 확인 전: `/account?tab=profile` 안내
- 작성 Form(로그인·성인 확인 후): 제목·여행 정보(국가·지역·시작일·종료일)·인원·선호·스타일·설명(글자 수)·안전수칙 동의, 오류 요약 `role="alert"`
- 연락처 탐지 시 차단·위치 안내, 제출 중·실패(입력 유지)
- `&edit=<id>` 수정 모드, 승인자 있으면 날짜 변경 확인 Modal, 권한 없음 안내
- 완료 시 `/mates?post=<id>` + Toast

## 9. Visual AC

- 8:4 분할(Form + 안전 안내), Mobile 안전 안내는 Form 아래

## 10. Security/Privacy AC

- 공개 연락처 금지
- 동의 시 `safety_agreed_at`·`policy_version` 저장
- 사용자 입력은 텍스트로만 렌더링

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-04 | Supabase 대시보드에서 RLS 활성화·정책 목록 확인 |
| SMK-03 | SCR-004, SCR-003 (비회원) — 동행 목록·상세 열람 가능, 참가 요청·신고·차단·동행 구하기 탭 진입 시 `/account?tab=login&next=…`로 안내 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| UT-05 | 공개 연락처 탐지 기준 테스트셋 (탐지율 ≥95%, 오탐 ≤5%) |
| UT-06 | 자동 마감 계산 (`end_date` 기준, Asia/Seoul) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, TEST-RLS-BASIC, E2E-PUBLIC-SMOKE, E2E-MATE-AUTH

## 12. Verify

- E2E-MATE-AUTH, UNIT-CONTACT-DETECTION
- E2E-MATE-AUTH: 이 Task에서는 실행하지 않는다. E2E-MATE-AUTH Task가 spec을 만든 뒤 `npx playwright test e2e/mate-auth.spec.ts --project=chromium` (테스트 계정 환경변수 필요)로 검증한다. 구현 시 "보류 — E2E-MATE-AUTH에서 검증"으로 기록한다 (`/implement-task` 규칙 6).
- UNIT-CONTACT-DETECTION 실행: `npm run test:unit -- src/lib/mates/contact-detection`
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
- Page Entry(`page.tsx`)를 수정하지 않는다(Page Owner 소관)
- Placeholder 문구와 내용 없는 Card를 쓰지 않는다
- 항공·숙소 입력값을 서버·DB·URL·쿠키·`localStorage`·로그·분석으로 보내지 않는다
- Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI를 쓰지 않는다
