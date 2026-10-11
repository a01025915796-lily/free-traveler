# TASK-COMP-SCR003-SHELL 여행 준비 Intro·탭·고지·Tip

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 30 | COMP-SCR003-SHELL | 여행 준비 Intro·탭·고지·Tip | Component | IMPLEMENT | REQ-FUNC-015, REQ-FUNC-023, REQ-FUNC-079 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | GLOBAL-UI-KIT | `src/components/tools/ToolsIntro.tsx`, `src/components/tools/ToolsTabs.tsx`, `src/components/tools/NonTransferNotice.tsx`, `src/components/tools/TipCard.tsx` | 1) Intro + 3단계(조건 입력·요약 확인·외부 사이트 검색)<br>2) 탭 항공편(`tab=flight`, 기본)·숙소(`tab=hotel`)·동행 구하기(`tab=mate`), 탭별 상태 분리 유지<br>3) "입력값은 외부 사이트로 전달되지 않습니다" 고지 + 탭별 Tip 3개(Card당 한 문장) | 1) 탭은 Header 아래 고정, Mobile 가로 스크롤<br>2) Tip 3열 → Mobile 1열 | 1) 탭 전환 시에도 입력값을 URL에 쓰지 않음(`tab`만) | E2E-TRAVEL-TOOLS | P0 |

## 1. Context

SCR-003 통합 여행 준비 화면(`/travel-tools`)의 "여행 준비 Intro·탭·고지·Tip" 작업이다. 이 Task는 Component 단계로, 요구사항 3건(REQ-FUNC-015, REQ-FUNC-023, REQ-FUNC-079)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT. 이 Task가 끝나야 PAGE-SCR003를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 4개 안에서 "여행 준비 Intro·탭·고지·Tip"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Page Entry(`page.tsx`) 조립 (Page Owner 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-015 | 항공 비전달 안내 | 폼과 요약에 "입력값은 외부 사이트로 전달되지 않습니다" 표시, 버튼에 `aria-describedby` 연결 |
| REQ-FUNC-023 | 숙소 비전달 안내 | 폼과 요약에 비전달 안내 표시 |
| REQ-FUNC-079 | HTML 의미·ARIA 상태 | 폼 라벨·오류 `aria-describedby`, 탭 `role="tablist"`, Drawer·Modal 포커스 이동과 Esc 닫기, Toast `aria-live`, 이미지 `alt` 필수 |

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

## 7. Expected Files

**생성**

- `src/components/tools/ToolsIntro.tsx`
- `src/components/tools/ToolsTabs.tsx`
- `src/components/tools/NonTransferNotice.tsx`
- `src/components/tools/TipCard.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- Intro + 3단계(조건 입력·요약 확인·외부 사이트 검색)
- 탭 항공편(`tab=flight`, 기본)·숙소(`tab=hotel`)·동행 구하기(`tab=mate`), 탭별 상태 분리 유지
- "입력값은 외부 사이트로 전달되지 않습니다" 고지 + 탭별 Tip 3개(Card당 한 문장)

## 9. Visual AC

- 탭은 Header 아래 고정, Mobile 가로 스크롤
- Tip 3열 → Mobile 1열

## 10. Security/Privacy AC

- 탭 전환 시에도 입력값을 URL에 쓰지 않음(`tab`만)

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-02 | 키보드만으로 SCR-001~005 핵심 흐름 완료, VoiceOver로 폼 오류·Drawer 제목 읽힘 |
| SMK-02 | SCR-003 `/travel-tools` 항공편·숙소 탭 — 필수값·날짜 오류 차단, 요약 일치, 비전달 안내, 외부 링크 `href`(query 없음)·`target`·`rel`, 입력 중 네트워크 요청에 입력값 없음, 탭 간 상태 분리 |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, MANUAL-CHECK

## 12. Verify

- E2E-TRAVEL-TOOLS
- E2E-TRAVEL-TOOLS: 이 Task에서는 실행하지 않는다. E2E-TRAVEL-TOOLS Task가 spec을 만든 뒤 `npx playwright test e2e/travel-tools.spec.ts --project=chromium`로 검증한다. 구현 시 "보류 — E2E-TRAVEL-TOOLS에서 검증"으로 기록한다 (`/implement-task` 규칙 6).
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
