# TASK-COMP-SCR001-DESTINATIONS 메인 국내·해외 추천·테마 영역

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 24 | COMP-SCR001-DESTINATIONS | 메인 국내·해외 추천·테마 영역 | Component | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-068 | SCR-001 | `/` | `src/app/page.tsx` | GLOBAL-UI-KIT, DATA-DESTINATIONS, LOGIC-FAVORITES-SHARE | `src/components/home/DestinationCard.tsx`, `src/components/home/DestinationGrid.tsx`, `src/components/home/DestinationBento.tsx`, `src/components/home/ThemeTileGrid.tsx` | 1) 국내 6개 Card Grid, 해외 6개 Bento(큰 2 + 작은 4), 각 "모두 보기"는 결과 모드로<br>2) 테마 타일 6개 → 해당 테마 필터<br>3) Card 선택 시 같은 화면 상세 Drawer(`?dest`)<br>4) 즐겨찾기 버튼(44px, `aria-pressed`) | 1) Card 4:3 사진(14px), 이름·지역·테마 2개<br>2) Desktop 국내 3×2·해외 Bento·테마 3×2, Mobile 1열 | 해당 없음 | E2E-PUBLIC-SMOKE | P0 |

## 1. Context

SCR-001 메인 화면(`/`)의 "메인 국내·해외 추천·테마 영역" 작업이다. 이 Task는 Component 단계로, 요구사항 2건(REQ-FUNC-001, REQ-FUNC-068)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT, DATA-DESTINATIONS, LOGIC-FAVORITES-SHARE. 이 Task가 끝나야 PAGE-SCR001를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 4개 안에서 "메인 국내·해외 추천·테마 영역"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Page Entry(`page.tsx`) 조립 (Page Owner 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-001 | 국내·해외 여행지 목록 구분 | SCR-001 국내/해외 구분(검색 구분 선택, 검색 결과 모드 탭). `src/data`의 `scope` 값으로 분류 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | `localStorage`에 저장, 중복 방지, SCR-001에서 즐겨찾기만 보기 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-001 메인 (핵심) |
| Route | `/` |
| Page Entry | `src/app/page.tsx` |
| 이 Task의 역할 | Page Owner가 조립할 Component |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §2 SCR-001 메인 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.1 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `fd6afbb21ac84ac5a37017043f45c8f9`, Mobile `3f3464457ac14719b8a826fffb0c8945`
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-UI-KIT — 공통 UI Component (Seq 4)
- DATA-DESTINATIONS — 여행지 정적 데이터 (Seq 6)
- LOGIC-FAVORITES-SHARE — 즐겨찾기(localStorage)·공유 (Seq 20)

## 7. Expected Files

**생성**

- `src/components/home/DestinationCard.tsx`
- `src/components/home/DestinationGrid.tsx`
- `src/components/home/DestinationBento.tsx`
- `src/components/home/ThemeTileGrid.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 국내 6개 Card Grid, 해외 6개 Bento(큰 2 + 작은 4), 각 "모두 보기"는 결과 모드로
- 테마 타일 6개 → 해당 테마 필터
- Card 선택 시 같은 화면 상세 Drawer(`?dest`)
- 즐겨찾기 버튼(44px, `aria-pressed`)

## 9. Visual AC

- Card 4:3 사진(14px), 이름·지역·테마 2개
- Desktop 국내 3×2·해외 Bento·테마 3×2, Mobile 1열

## 10. Security/Privacy AC

- 개인정보·비밀값을 다루지 않는다. 비밀값을 코드·로그에 쓰지 않는다

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| UT-01 | 여행지 필터·키워드 검색·국내/해외 구분·검색 결과 유형(`kind`)·관련 여행지·URL query 직렬화 |
| UT-09 | 즐겨찾기 저장 (중복 방지, `localStorage` 예외 시 빈 목록) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-SEARCH-STALE, UNIT-OUTBOUND-FAVORITES, E2E-PUBLIC-SMOKE

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
