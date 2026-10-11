# TASK-COMP-SCR004-APPLY 참가 요청

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 36 | COMP-SCR004-APPLY | 참가 요청 | Component | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-043 | SCR-004 | `/mates` | `src/app/mates/page.tsx` | GLOBAL-UI-KIT, DB-ACCESS, AUTH-SUPABASE, LOGIC-MATE-STATE | `src/components/mates/ApplicationForm.tsx` | 1) 500자 메시지 + 글자 수 + 안전고지, PENDING 저장 후 Toast<br>2) 비회원·성인 확인 전 안내(`/account?...`)<br>3) 이미 요청함: 상태 배지(대기 중·승인됨·거절됨) + 내 활동에서 보기<br>4) 마감 글은 비활성 | 1) 상세 패널 안 배치 | 1) 메시지는 요청자·작성자만 열람(RLS)<br>2) 연락처 입력 안내 | E2E-MATE-AUTH | P0 |

## 1. Context

SCR-004 동행 조회 화면(`/mates`)의 "참가 요청" 작업이다. 이 Task는 Component 단계로, 요구사항 4건(REQ-FUNC-027, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-043)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT, DB-ACCESS, AUTH-SUPABASE, LOGIC-MATE-STATE. 이 Task가 끝나야 PAGE-SCR004를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "참가 요청"을 구현한다
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
| REQ-FUNC-034 | 참가 메시지 500자 비공개 | 모집중 글에 ≤500자 메시지, PENDING 저장, RLS로 요청자·작성자만 열람 |
| REQ-FUNC-035 | 중복 요청 차단 | 부분 UNIQUE 인덱스와 UI 오류 메시지 |
| REQ-FUNC-043 | 요청·처리 결과 알림 | 이메일 없이 Toast와 SCR-005 내 활동 탭의 상태 배지로 제공 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-004 동행 조회 (핵심) |
| Route | `/mates` |
| Page Entry | `src/app/mates/page.tsx` |
| 이 Task의 역할 | Page Owner가 조립할 Component |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §5 SCR-004 동행 조회 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.4 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `a5652785ec3c4c36ad2b028e4851e080` (Mobile 디자인 없음 — UI_CONTRACT §1.4 Mobile 규칙)
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-UI-KIT — 공통 UI Component (Seq 4)
- DB-ACCESS — 동행·요청·차단·신고·설정 데이터 접근 계층 (Seq 14)
- AUTH-SUPABASE — Supabase 클라이언트·세션·Proxy (Seq 12)
- LOGIC-MATE-STATE — 동행글·참가 요청 상태 전이 (Seq 13)

## 7. Expected Files

**생성**

- `src/components/mates/ApplicationForm.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 500자 메시지 + 글자 수 + 안전고지, PENDING 저장 후 Toast
- 비회원·성인 확인 전 안내(`/account?...`)
- 이미 요청함: 상태 배지(대기 중·승인됨·거절됨) + 내 활동에서 보기
- 마감 글은 비활성

## 9. Visual AC

- 상세 패널 안 배치

## 10. Security/Privacy AC

- 메시지는 요청자·작성자만 열람(RLS)
- 연락처 입력 안내

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-04 | Supabase 대시보드에서 RLS 활성화·정책 목록 확인 |
| SMK-03 | SCR-004, SCR-003 (비회원) — 동행 목록·상세 열람 가능, 참가 요청·신고·차단·동행 구하기 탭 진입 시 `/account?tab=login&next=…`로 안내 |
| SMK-05 | SCR-004, SCR-005 (회원 A·B) — B 참가 요청 → 중복 요청 차단 → A 내 활동에서 승인·거절 → B 내 활동에 상태 표시, 제3자는 요청을 볼 수 없음 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-MATE-STATE, TEST-RLS-BASIC, E2E-MATE-AUTH

## 12. Verify

- E2E-MATE-AUTH
- E2E-MATE-AUTH: 이 Task에서는 실행하지 않는다. E2E-MATE-AUTH Task가 spec을 만든 뒤 `npx playwright test e2e/mate-auth.spec.ts --project=chromium` (테스트 계정 환경변수 필요)로 검증한다. 구현 시 "보류 — E2E-MATE-AUTH에서 검증"으로 기록한다 (`/implement-task` 규칙 6).
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
- Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI를 쓰지 않는다
