# TASK-GLOBAL-UI-KIT 공통 UI Component

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | GLOBAL-UI-KIT | 공통 UI Component | Global | IMPLEMENT | REQ-FUNC-079, REQ-NF-003, REQ-NF-006, REQ-NF-023, REQ-NF-001, REQ-NF-024, REQ-NF-025 | 공통 | - | - | GLOBAL-DESIGN-TOKENS | `src/components/ui/Button.tsx`, `src/components/ui/Chip.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/Drawer.tsx`, `src/components/ui/Modal.tsx`, `src/components/ui/Tabs.tsx`, `src/components/ui/Alert.tsx`, `src/components/ui/Badge.tsx`, `src/components/ui/Toast.tsx`, `src/components/ui/EmptyState.tsx`, `src/components/ui/Skeleton.tsx`, `src/components/ui/SafeImage.tsx`, `src/components/ui/StepGuide.tsx`, `src/components/ui/CtaBanner.tsx` | 1) Drawer·Modal: 열 때 제목 포커스, 포커스 가두기, Esc 닫기, 닫으면 연 요소로 복귀, URL query 연동 가능<br>2) Tabs: `role="tablist"`, 좌우 방향키<br>3) Toast: `aria-live="polite"`, 작업 결과 알림(이메일 대신 화면 알림)<br>4) EmptyState: 제목·이유/이용 방법·Primary·Secondary CTA 필수 props<br>5) SafeImage: `next/image`, `alt` 필수, 크기 고정, 로드 실패 시 장소명 플레이스홀더<br>6) 첫 화면 이미지 `priority`, 나머지 lazy load, `sizes` 지정(LCP ≤2.5s 목표)<br>7) 모든 상호작용 Component가 axe serious/critical 0건, 키보드·스크린리더로 조작 가능 | 1) 버튼 48px, Chip·아이콘 버튼 44px 이상<br>2) 모서리 8/14/pill, 그림자 1단계<br>3) Badge·Alert는 아이콘 + 텍스트 라벨 | 1) 사용자 입력 렌더링에 `dangerouslySetInnerHTML` 금지<br>2) 브라우저 `alert`/`confirm` 금지 | `npm run typecheck`, E2E-PUBLIC-SMOKE(axe) | P0 |

## 1. Context

5개 화면 공통의 "공통 UI Component" 작업이다. 이 Task는 Global 단계로, 요구사항 7건(REQ-FUNC-079, REQ-NF-003, REQ-NF-006, REQ-NF-023, REQ-NF-001, REQ-NF-024 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-DESIGN-TOKENS. 이 Task가 끝나야 GLOBAL-LAYOUT, COMP-SCR001-SEARCH, COMP-SCR001-DESTINATIONS, COMP-SCR001-DESTINATION-DRAWER, COMP-SCR001-SAFETY, COMP-SCR001-MATES-CURATOR, COMP-SCR002-PROFILE, COMP-SCR002-COUNTRIES-GALLERY, COMP-SCR003-SHELL, COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL, COMP-SCR003-MATE-COMPOSE, COMP-SCR004-FILTER-LIST, COMP-SCR004-DETAIL, COMP-SCR004-APPLY, COMP-SCR004-REPORT-BLOCK, COMP-SCR004-GUIDES, COMP-SCR005-AUTH, COMP-SCR005-PROFILE, COMP-SCR005-ACTIVITY, COMP-SCR005-ADMIN를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 14개 안에서 "공통 UI Component"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-079 | HTML 의미·ARIA 상태 | 폼 라벨·오류 `aria-describedby`, 탭 `role="tablist"`, Drawer·Modal 포커스 이동과 Esc 닫기, Toast `aria-live`, 이미지 `alt` 필수 |
| REQ-NF-003 | CLS ≤0.1 | 이미지 `width`·`height` 지정, Drawer·패널은 오버레이로 열어 본문 이동 방지. Lighthouse 측정값으로 판단 |
| REQ-NF-006 | 이미지 최적화 | `next/image`, `sizes` 지정, 기본 lazy load, 첫 화면 이미지 `priority` |
| REQ-NF-023 | WCAG 2.2 AA 목표 | REQ-FUNC-079 규칙, 상태·경보는 텍스트 라벨 병기, 터치 대상 24×24px 이상 |
| REQ-NF-001 | LCP ≤2.5s | 정적 데이터 렌더링, 첫 이미지 `priority`. 실제 사용자 p75 대신 배포 URL의 모바일 Lighthouse 측정값으로 판단 |
| REQ-NF-024 | axe serious/critical 0건 | `@axe-core/playwright`로 5개 Route와 열린 Drawer·패널 검사 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | SCR-001~005 핵심 흐름 수동 검사 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | 5개 화면 공통 |
| Route | - |
| Page Entry | - |

## 5. Design Ref

- `design-reference/D-001/DESIGN.md` §2~§7 (토큰 값의 정본)
- `design-reference/UI_CONTRACT.md` §1.3 공통 Layout · §1.4 Desktop·Mobile · §1.5 디자인·접근성
- `docs/04_UIUX_PLAN.md` §4 공통 컴포넌트

## 6. Depends On

- GLOBAL-DESIGN-TOKENS — D-001 디자인 토큰 적용 (Seq 3)

## 7. Expected Files

**생성**

- `src/components/ui/Button.tsx`
- `src/components/ui/Chip.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Drawer.tsx`
- `src/components/ui/Modal.tsx`
- `src/components/ui/Tabs.tsx`
- `src/components/ui/Alert.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Toast.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/Skeleton.tsx`
- `src/components/ui/SafeImage.tsx`
- `src/components/ui/StepGuide.tsx`
- `src/components/ui/CtaBanner.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- Drawer·Modal: 열 때 제목 포커스, 포커스 가두기, Esc 닫기, 닫으면 연 요소로 복귀, URL query 연동 가능
- Tabs: `role="tablist"`, 좌우 방향키
- Toast: `aria-live="polite"`, 작업 결과 알림(이메일 대신 화면 알림)
- EmptyState: 제목·이유/이용 방법·Primary·Secondary CTA 필수 props
- SafeImage: `next/image`, `alt` 필수, 크기 고정, 로드 실패 시 장소명 플레이스홀더
- 첫 화면 이미지 `priority`, 나머지 lazy load, `sizes` 지정(LCP ≤2.5s 목표)
- 모든 상호작용 Component가 axe serious/critical 0건, 키보드·스크린리더로 조작 가능

## 9. Visual AC

- 버튼 48px, Chip·아이콘 버튼 44px 이상
- 모서리 8/14/pill, 그림자 1단계
- Badge·Alert는 아이콘 + 텍스트 라벨

## 10. Security/Privacy AC

- 사용자 입력 렌더링에 `dangerouslySetInnerHTML` 금지
- 브라우저 `alert`/`confirm` 금지

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-02 | 키보드만으로 SCR-001~005 핵심 흐름 완료, VoiceOver로 폼 오류·Drawer 제목 읽힘 |
| MAN-03 | Vercel 배포 URL에서 모바일 Lighthouse (Performance ≥85, LCP ≤2.5s, CLS ≤0.1) |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-PUBLIC-SMOKE, MANUAL-CHECK, RELEASE-CHECK

## 12. Verify

- `npm run typecheck`, E2E-PUBLIC-SMOKE(axe)
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
