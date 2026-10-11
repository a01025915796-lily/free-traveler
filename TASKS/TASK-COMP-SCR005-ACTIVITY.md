# TASK-COMP-SCR005-ACTIVITY 계정: 내 활동

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 41 | COMP-SCR005-ACTIVITY | 계정: 내 활동 | Component | IMPLEMENT | REQ-FUNC-036, REQ-FUNC-038, REQ-FUNC-040, REQ-FUNC-043 | SCR-005 | `/account` | `src/app/account/page.tsx` | GLOBAL-UI-KIT, DB-ACCESS, LOGIC-MATE-STATE | `src/components/account/MyPostList.tsx`, `src/components/account/ApplicationTabs.tsx`, `src/components/account/BlockList.tsx`, `src/components/account/HelpList.tsx` | 1) 내 동행글(보기·수정·마감), 받은 요청(승인·거절), 보낸 요청(상태 배지), 차단 목록(해제), 새 동행글 CTA, 도움말 3개<br>2) 목록마다 Empty State(이유 + 다음 행동)<br>3) 상태 변경은 Toast와 배지로 알림(이메일 없음) | 1) 행 오른쪽 버튼 → Mobile 아래 줄 | 1) 요청 메시지는 작성자·요청자만 | E2E-MATE-AUTH | P0 |

## 1. Context

SCR-005 계정·관리 화면(`/account`)의 "계정: 내 활동" 작업이다. 이 Task는 Component 단계로, 요구사항 4건(REQ-FUNC-036, REQ-FUNC-038, REQ-FUNC-040, REQ-FUNC-043)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT, DB-ACCESS, LOGIC-MATE-STATE. 이 Task가 끝나야 PAGE-SCR005를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 4개 안에서 "계정: 내 활동"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Page Entry(`page.tsx`) 조립 (Page Owner 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-036 | 작성자 승인·거절 | 작성자만 ACCEPTED/REJECTED로 변경(RLS). 감사 로그 기록은 제외(§7) |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | SCR-004 상세 패널의 작성자 메뉴에서 마감·삭제(`DELETED`), 수정은 SCR-003 동행 구하기 탭(`&edit=<id>`). 승인자가 있으면 날짜 변경 전 화면 내 확인 Modal 표시 |
| REQ-FUNC-040 | 사용자 차단·해제 | `user_blocks`와 RLS로 상호 글·프로필·요청 비노출. SCR-004 상세 패널에서 차단, SCR-005 내 활동 탭에서 해제 |
| REQ-FUNC-043 | 요청·처리 결과 알림 | 이메일 없이 Toast와 SCR-005 내 활동 탭의 상태 배지로 제공 |

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
- LOGIC-MATE-STATE — 동행글·참가 요청 상태 전이 (Seq 13)

## 7. Expected Files

**생성**

- `src/components/account/MyPostList.tsx`
- `src/components/account/ApplicationTabs.tsx`
- `src/components/account/BlockList.tsx`
- `src/components/account/HelpList.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 내 동행글(보기·수정·마감), 받은 요청(승인·거절), 보낸 요청(상태 배지), 차단 목록(해제), 새 동행글 CTA, 도움말 3개
- 목록마다 Empty State(이유 + 다음 행동)
- 상태 변경은 Toast와 배지로 알림(이메일 없음)

## 9. Visual AC

- 행 오른쪽 버튼 → Mobile 아래 줄

## 10. Security/Privacy AC

- 요청 메시지는 작성자·요청자만

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-05 | SCR-004, SCR-005 (회원 A·B) — B 참가 요청 → 중복 요청 차단 → A 내 활동에서 승인·거절 → B 내 활동에 상태 표시, 제3자는 요청을 볼 수 없음 |
| SMK-06 | SCR-004, SCR-005 — 신고 접수번호·시각 3초 이내 표시, 차단 후 상대 글·프로필이 목록에서 사라짐, 내 활동에서 차단 해제 |

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
