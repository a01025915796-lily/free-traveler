# TASK-COMP-SCR002-COUNTRIES-GALLERY 대표 소개 방문 국가·Gallery·기억에 남는 여행지

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 29 | COMP-SCR002-COUNTRIES-GALLERY | 대표 소개 방문 국가·Gallery·기억에 남는 여행지 | Component | IMPLEMENT | REQ-FUNC-059, REQ-FUNC-063 | SCR-002 | `/about` | `src/app/about/page.tsx` | GLOBAL-UI-KIT, DATA-REPRESENTATIVE, DATA-SAFETY | `src/components/about/CountryChipGroup.tsx`, `src/components/about/PhotoGallery.tsx`, `src/components/about/MemoryCard.tsx` | 1) 권역 4묶음 30개국 Chip, 소개된 국가는 `/?safety=<code>` 링크<br>2) Gallery 8장(서로 다른 장소, 캡션)<br>3) 기억에 남는 여행지 4곳 → `/?dest=<slug>`, 추천 6곳 링크 Chip<br>4) CTA Banner: 여행 준비 시작하기·동행 찾아보기 | 1) 국가 4열, Gallery 4×2 → Mobile 스와이프 1장 + 이전/다음 + 위치 표시, 기억 2×2 | 1) 얼굴 식별 가능한 인물 사진 금지 | E2E-PUBLIC-SMOKE | P1 |

## 1. Context

SCR-002 대표 소개 화면(`/about`)의 "대표 소개 방문 국가·Gallery·기억에 남는 여행지" 작업이다. 이 Task는 Component 단계로, 요구사항 2건(REQ-FUNC-059, REQ-FUNC-063)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT, DATA-REPRESENTATIVE, DATA-SAFETY. 이 Task가 끝나야 PAGE-SCR002를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 3개 안에서 "대표 소개 방문 국가·Gallery·기억에 남는 여행지"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Page Entry(`page.tsx`) 조립 (Page Owner 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-059 | 방문 국가 30개 이상 목록 | SCR-002 방문 국가 영역: 지도 대신 권역별 국가 Chip 30개. 소개된 국가는 SCR-001 국가 안전정보 Drawer로 연결 |
| REQ-FUNC-063 | 추천 여행지 6개 | SCR-002 기억에 남는 여행지 영역의 추천 6곳 Chip에서 SCR-001 여행지 상세 Drawer로 연결. 존재하지 않는 slug는 테스트 실패 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-002 대표 소개 (보조) |
| Route | `/about` |
| Page Entry | `src/app/about/page.tsx` |
| 이 Task의 역할 | Page Owner가 조립할 Component |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §3 SCR-002 대표 소개 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.2 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `beeebd01d9be475392c9e7c6f46d6395` (Mobile 디자인 없음 — UI_CONTRACT §1.4 Mobile 규칙)
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-UI-KIT — 공통 UI Component (Seq 4)
- DATA-REPRESENTATIVE — free_traveler 대표 정적 데이터 (Seq 8)
- DATA-SAFETY — 국가 안전정보 정적 데이터 (Seq 7)

## 7. Expected Files

**생성**

- `src/components/about/CountryChipGroup.tsx`
- `src/components/about/PhotoGallery.tsx`
- `src/components/about/MemoryCard.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 권역 4묶음 30개국 Chip, 소개된 국가는 `/?safety=<code>` 링크
- Gallery 8장(서로 다른 장소, 캡션)
- 기억에 남는 여행지 4곳 → `/?dest=<slug>`, 추천 6곳 링크 Chip
- CTA Banner: 여행 준비 시작하기·동행 찾아보기

## 9. Visual AC

- 국가 4열, Gallery 4×2 → Mobile 스와이프 1장 + 이전/다음 + 위치 표시, 기억 2×2

## 10. Security/Privacy AC

- 얼굴 식별 가능한 인물 사진 금지

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-09 | SCR-002 `/about` — 7개 영역, `50+ Trips`·`30+ Countries`가 SCR-001과 일치, 국가 30개, 링크 Chip → `/?safety=`, 추천 6곳 → `/?dest=`, 빈 SNS 링크 미표시 |
| UT-08 | 정적 데이터 완전성 (여행지 필수 필드·수량, 해외 국가별 안전정보, 8개 카테고리, 경보 범위, 대표 프로필, 추천 slug 존재, 모든 이미지 `alt`) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-CONTENT-DATA, E2E-PUBLIC-SMOKE

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
