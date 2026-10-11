# TASK-COMP-SCR005-ADMIN 계정: 관리(신고 상태·외부 URL)

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 42 | COMP-SCR005-ADMIN | 계정: 관리(신고 상태·외부 URL) | Component | IMPLEMENT | REQ-FUNC-041, REQ-FUNC-077 | SCR-005 | `/account` | `src/app/account/page.tsx` | GLOBAL-UI-KIT, DB-ACCESS, LOGIC-OUTBOUND-URL | `src/components/account/ReportList.tsx`, `src/components/account/OutboundUrlForm.tsx` | 1) 관리 Intro, 신고 상태 Chip 4개(접수·검토 중·처리 완료·기각) + 목록(접수번호·대상·사유·설명·시각·상태 변경)<br>2) 항공·숙소 외부 주소 2개, HTTPS·허용 호스트만 저장, 현재·기본 주소 표시<br>3) 통계·차트·대시보드·제재 기능 없음 | 1) Desktop 2열(신고 + 외부 주소), Mobile 신고 목록 Card | 1) `role=admin`만 렌더링·저장(RLS)<br>2) `http:`·`javascript:`·`data:` 거부 | E2E-MATE-AUTH, UNIT-OUTBOUND-FAVORITES | P1 |

## 1. Context

SCR-005 계정·관리 화면(`/account`)의 "계정: 관리(신고 상태·외부 URL)" 작업이다. 이 Task는 Component 단계로, 요구사항 2건(REQ-FUNC-041, REQ-FUNC-077)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT, DB-ACCESS, LOGIC-OUTBOUND-URL. 이 Task가 끝나야 PAGE-SCR005를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 2개 안에서 "계정: 관리(신고 상태·외부 URL)"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Page Entry(`page.tsx`) 조립 (Page Owner 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-041 | 신고 큐 | SCR-005 관리 탭(`?tab=admin`)에 대상·사유·설명·접수 시각·상태 목록과 OPEN/REVIEWING/RESOLVED/DISMISSED 필터 |
| REQ-FUNC-077 | 외부 URL 관리자 설정 | SCR-005 관리 탭에서 HTTPS·허용 호스트만 저장. DB CHECK와 UI 검증 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-005 계정·관리 (핵심) |
| Route | `/account` |
| Page Entry | `src/app/account/page.tsx` |
| 이 Task의 역할 | Page Owner가 조립할 Component |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §6 SCR-005 계정·관리 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.5 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `97ccb288104a40f3a1c10c801636f942` (Mobile 디자인 없음 — UI_CONTRACT §1.4 Mobile 규칙)
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-UI-KIT — 공통 UI Component (Seq 4)
- DB-ACCESS — 동행·요청·차단·신고·설정 데이터 접근 계층 (Seq 14)
- LOGIC-OUTBOUND-URL — 외부 이동 URL 허용목록 (Seq 17)

## 7. Expected Files

**생성**

- `src/components/account/ReportList.tsx`
- `src/components/account/OutboundUrlForm.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 관리 Intro, 신고 상태 Chip 4개(접수·검토 중·처리 완료·기각) + 목록(접수번호·대상·사유·설명·시각·상태 변경)
- 항공·숙소 외부 주소 2개, HTTPS·허용 호스트만 저장, 현재·기본 주소 표시
- 통계·차트·대시보드·제재 기능 없음

## 9. Visual AC

- Desktop 2열(신고 + 외부 주소), Mobile 신고 목록 Card

## 10. Security/Privacy AC

- `role=admin`만 렌더링·저장(RLS)
- `http:`·`javascript:`·`data:` 거부

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-07 | SCR-005 관리 탭 — 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원에게는 관리 탭이 렌더링되지 않음 |
| UT-04 | 외부 URL 허용목록 (HTTPS, 허용 호스트, `http:`·`javascript:`·`data:` 거부, query 없음) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-OUTBOUND-FAVORITES, E2E-MATE-AUTH

## 12. Verify

- E2E-MATE-AUTH, UNIT-OUTBOUND-FAVORITES
- E2E-MATE-AUTH: 이 Task에서는 실행하지 않는다. E2E-MATE-AUTH Task가 spec을 만든 뒤 `npx playwright test e2e/mate-auth.spec.ts --project=chromium` (테스트 계정 환경변수 필요)로 검증한다. 구현 시 "보류 — E2E-MATE-AUTH에서 검증"으로 기록한다 (`/implement-task` 규칙 6).
- UNIT-OUTBOUND-FAVORITES 실행: `npm run test:unit -- src/lib/outbound src/lib/favorites`
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
