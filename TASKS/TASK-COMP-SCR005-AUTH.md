# TASK-COMP-SCR005-AUTH 계정: 로그인·가입·비밀번호 재설정 (Guest)

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 39 | COMP-SCR005-AUTH | 계정: 로그인·가입·비밀번호 재설정 (Guest) | Component | IMPLEMENT | REQ-FUNC-066 | SCR-005 | `/account` | `src/app/account/page.tsx` | GLOBAL-UI-KIT, AUTH-SUPABASE | `src/components/account/AccountIntro.tsx`, `src/components/account/AuthCard.tsx`, `src/components/account/FeatureCard.tsx`, `src/components/account/PrivacyChecklist.tsx` | 1) Guest 4영역: Intro·인증 Card(로그인/회원가입/재설정/새 비밀번호)·로그인 후 가능한 기능 3개·보안 안내<br>2) 오류: 잘못된 로그인, 이메일 미인증(인증 메일 다시 보내기), 만료 링크<br>3) 성공 시 `next` 또는 내 활동 | 1) Intro + 인증 Card 분할, 기능 3열 → Mobile 1열 | 1) 비밀번호 규칙 안내, 미인증 계정은 쓰기 불가<br>2) 생년월일 입력 없음 | E2E-MATE-AUTH, MANUAL-CHECK | P0 |

## 1. Context

SCR-005 계정·관리 화면(`/account`)의 "계정: 로그인·가입·비밀번호 재설정 (Guest)" 작업이다. 이 Task는 Component 단계로, 요구사항 1건(REQ-FUNC-066)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT, AUTH-SUPABASE. 이 Task가 끝나야 PAGE-SCR005를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 4개 안에서 "계정: 로그인·가입·비밀번호 재설정 (Guest)"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Page Entry(`page.tsx`) 조립 (Page Owner 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | SCR-005 로그인 탭과 기술 Route `/auth/callback`에서 Supabase Auth 사용. 이메일 미인증 계정은 로그인·쓰기 불가 |

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
- AUTH-SUPABASE — Supabase 클라이언트·세션·Proxy (Seq 12)

## 7. Expected Files

**생성**

- `src/components/account/AccountIntro.tsx`
- `src/components/account/AuthCard.tsx`
- `src/components/account/FeatureCard.tsx`
- `src/components/account/PrivacyChecklist.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- Guest 4영역: Intro·인증 Card(로그인/회원가입/재설정/새 비밀번호)·로그인 후 가능한 기능 3개·보안 안내
- 오류: 잘못된 로그인, 이메일 미인증(인증 메일 다시 보내기), 만료 링크
- 성공 시 `next` 또는 내 활동

## 9. Visual AC

- Intro + 인증 Card 분할, 기능 3열 → Mobile 1열

## 10. Security/Privacy AC

- 비밀번호 규칙 안내, 미인증 계정은 쓰기 불가
- 생년월일 입력 없음

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-01 | 가입 인증 메일 수신·인증 링크(`/auth/callback`), 비밀번호 재설정 메일 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-MATE-AUTH, MANUAL-CHECK

## 12. Verify

- E2E-MATE-AUTH, MANUAL-CHECK
- E2E-MATE-AUTH: 이 Task에서는 실행하지 않는다. E2E-MATE-AUTH Task가 spec을 만든 뒤 `npx playwright test e2e/mate-auth.spec.ts --project=chromium` (테스트 계정 환경변수 필요)로 검증한다. 구현 시 "보류 — E2E-MATE-AUTH에서 검증"으로 기록한다 (`/implement-task` 규칙 6).
- MANUAL-CHECK 실행: `docs/checks/MANUAL_CHECK.md` 4개 항목 PASS 기록
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
