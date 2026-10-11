# TASK-COMP-SCR004-GUIDES 동행 신청 방법·안전 안내

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 38 | COMP-SCR004-GUIDES | 동행 신청 방법·안전 안내 | Component | IMPLEMENT | REQ-FUNC-080 | SCR-004 | `/mates` | `src/app/mates/page.tsx` | GLOBAL-UI-KIT | `src/components/mates/SafetyRules.tsx` | 1) 신청 3단계(3단계 라벨 "내 활동에서 결과 확인", 실시간 알림 표현 금지)<br>2) 안전 수칙 4개 + 신고·차단 방법 + 동행 안전수칙 링크(정책 Modal)<br>3) CTA Banner → `/travel-tools` | 1) 3단계 가로 → Mobile 세로, 안전 안내 분할 | 1) 서비스가 신원·안전을 보증하지 않는다는 고지 | E2E-PUBLIC-SMOKE | P1 |

## 1. Context

SCR-004 동행 조회 화면(`/mates`)의 "동행 신청 방법·안전 안내" 작업이다. 이 Task는 Component 단계로, 요구사항 1건(REQ-FUNC-080)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT. 이 Task가 끝나야 PAGE-SCR004를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "동행 신청 방법·안전 안내"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Page Entry(`page.tsx`) 조립 (Page Owner 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-080 | 정책 문서·안전수칙 동의 기록 | Footer 정책 Modal 4종. SCR-003 동행 구하기 탭에서 글 작성 시 `safety_agreed_at`, `policy_version` 저장 |

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

## 7. Expected Files

**생성**

- `src/components/mates/SafetyRules.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 신청 3단계(3단계 라벨 "내 활동에서 결과 확인", 실시간 알림 표현 금지)
- 안전 수칙 4개 + 신고·차단 방법 + 동행 안전수칙 링크(정책 Modal)
- CTA Banner → `/travel-tools`

## 9. Visual AC

- 3단계 가로 → Mobile 세로, 안전 안내 분할

## 10. Security/Privacy AC

- 서비스가 신원·안전을 보증하지 않는다는 고지

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-PUBLIC-SMOKE, E2E-MATE-AUTH

## 12. Verify

- E2E-PUBLIC-SMOKE
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
- Page Entry(`page.tsx`)를 수정하지 않는다(Page Owner 소관)
- Placeholder 문구와 내용 없는 Card를 쓰지 않는다
- Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI를 쓰지 않는다
