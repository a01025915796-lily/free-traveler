# TASK-PAGE-SCR002 SCR-002 대표 소개 페이지 조립

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 44 | PAGE-SCR002 | SCR-002 대표 소개 페이지 조립 | Page Owner | IMPLEMENT | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063, REQ-FUNC-070, REQ-NF-030 | SCR-002 | `/about` | `src/app/about/page.tsx` | GLOBAL-LAYOUT, DATA-REPRESENTATIVE, COMP-SCR002-PROFILE, COMP-SCR002-COUNTRIES-GALLERY | `src/app/about/page.tsx` | 1) Section 순서와 데이터 출처(모두 `curator.ts`): ①Profile Hero → ②여행 지표 4 → ③소개·시작한 이유·철학 → ④Timeline 7 → ⑤방문 국가 30 → ⑥Gallery 8 → ⑦기억에 남는 여행지 4 + 추천 6 + CTA<br>2) Server Component 정적 렌더링, `metadata` title·description·canonical·OG<br>3) `50+ Trips`·`30+ Countries`는 SCR-001과 같은 값<br>4) 화면 상태(UI_CONTRACT §3 상태표)를 의존 Component·데이터와 연결해 실제로 표시 — Loading: 없음 — 정적 데이터를 서버에서 렌더링 / Empty: 없음 — 정적 데이터 최소 수를 보장하고 빈 SNS 링크는 렌더링하지 않음 / Error: 이미지 실패 시 장소명 플레이스홀더, 레이아웃 유지 | 1) 최소: 지표 4, Timeline 6 이상(7), 방문 국가 30, Gallery 8, 기억에 남는 여행지 4, 추천 6<br>2) 밀도: Desktop Hero 6:6·지표 4열·Gallery 4×2·기억 2×2 / Mobile 1열, Timeline 세로, Gallery 스와이프<br>3) 금지: Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역. 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State (SNS 값이 없으면 링크 미렌더링)<br>4) D-001 토큰만 사용(흰 배경·텍스트 `#222222`·CTA 코랄 `#CF4329`·Inter + 시스템 한글·터치 44px 이상·`:focus-visible`). 임의 색·글꼴·그림자 값과 Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI 금지 | 1) 외부 링크 `https:`·`mailto:`만 | `npm run build`, E2E-PUBLIC-SMOKE, Vercel Preview 확인 | P1 |

## 1. Context

SCR-002 대표 소개 화면(`/about`)의 "SCR-002 대표 소개 페이지 조립" 작업이다. 이 Task는 Page Owner 단계로, 요구사항 8건(REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-LAYOUT, DATA-REPRESENTATIVE, COMP-SCR002-PROFILE, COMP-SCR002-COUNTRIES-GALLERY. 이 Task가 끝나야 UNIT-ROUTE-CONTRACT, E2E-PUBLIC-SMOKE, MANUAL-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- `src/app/about/page.tsx`에서 Route Page를 조립한다: 의존 Component 배치, 데이터 연결, URL query 해석, metadata
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 하위 Component 생성·수정 (의존 Component Task 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-057 | `free_traveler`, `50+ Trips`, `30+ Countries` | `src/data/curator.ts` 단일 값을 SCR-001 free_traveler 소개 영역과 SCR-002 여행 지표에서 사용 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 | PRD 6-1·6-2 문구를 줄이지 않고 SCR-002 소개 영역에 표시 |
| REQ-FUNC-059 | 방문 국가 30개 이상 목록 | SCR-002 방문 국가 영역: 지도 대신 권역별 국가 Chip 30개. 소개된 국가는 SCR-001 국가 안전정보 Drawer로 연결 |
| REQ-FUNC-060 | 대표 여행 타임라인 | 연도·장소·요약 항목 목록 |
| REQ-FUNC-062 | 문의·SNS 링크 | 관리자 설정 대신 `src/data/curator.ts` 값 사용. 빈 값은 렌더링하지 않고 `https:`·`mailto:`만 허용 |
| REQ-FUNC-063 | 추천 여행지 6개 | SCR-002 기억에 남는 여행지 영역의 추천 6곳 Chip에서 SCR-001 여행지 상세 Drawer로 연결. 존재하지 않는 slug는 테스트 실패 |
| REQ-FUNC-070 | 페이지별 SEO 메타 | Metadata API로 5개 Route의 title·description·canonical·Open Graph, `?dest`는 `generateMetadata`로 여행지별 값. `/`에 WebSite JSON-LD |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | REQ-FUNC-070 방식 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-002 대표 소개 (보조) |
| Route | `/about` |
| Page Entry | `src/app/about/page.tsx` |
| 이 Task의 역할 | Route Page 조립 (Page Owner) |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §3 SCR-002 대표 소개 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.2 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `beeebd01d9be475392c9e7c6f46d6395` (Mobile 디자인 없음 — UI_CONTRACT §1.4 Mobile 규칙)
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-LAYOUT — Root Layout·공통 Header·Footer·정책 Modal (Seq 5)
- DATA-REPRESENTATIVE — free_traveler 대표 정적 데이터 (Seq 8)
- COMP-SCR002-PROFILE — 대표 소개 Hero·지표·소개·Timeline (Seq 28)
- COMP-SCR002-COUNTRIES-GALLERY — 대표 소개 방문 국가·Gallery·기억에 남는 여행지 (Seq 29)

## 7. Expected Files

**생성**

- `src/app/about/page.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- Section 순서와 데이터 출처(모두 `curator.ts`): ①Profile Hero → ②여행 지표 4 → ③소개·시작한 이유·철학 → ④Timeline 7 → ⑤방문 국가 30 → ⑥Gallery 8 → ⑦기억에 남는 여행지 4 + 추천 6 + CTA
- Server Component 정적 렌더링, `metadata` title·description·canonical·OG
- `50+ Trips`·`30+ Countries`는 SCR-001과 같은 값

**화면 상태** (`UI_CONTRACT.md` §3 상태표, `04_UIUX_PLAN.md` §7) — 의존 Component의 상태를 Page에서 데이터와 연결해 실제로 표시한다.

| 상태 | 표시 |
|---|---|
| Loading | 없음 — 정적 데이터를 서버에서 렌더링 |
| Empty | 없음 — 정적 데이터 최소 수를 보장하고 빈 SNS 링크는 렌더링하지 않음 |
| Error | 이미지 실패 시 장소명 플레이스홀더, 레이아웃 유지 |

## 9. Visual AC

**Section 순서와 데이터 출처** (계약 `sections` 순서)


| 순서 | Section id | 제목 | 데이터 출처 |
|---|---|---|---|
| 1 | `profile-hero` | 내가 감당할 수 있는 속도로, 현지를 이해하는 여행 | `src/data/curator.ts` |
| 2 | `stats` | 숫자로 보는 여행 이력 | `src/data/curator.ts` |
| 3 | `story` | free_traveler는 이런 여행을 합니다 | `src/data/curator.ts` |
| 4 | `timeline` | 여행으로 쌓아 온 시간 | `src/data/curator.ts` |
| 5 | `countries` | 다녀온 30개 나라 | `src/data/curator.ts` + `src/data/safety.ts`(링크 여부) |
| 6 | `gallery` | 길 위에서 담은 장면들 | `src/data/curator.ts` |
| 7 | `memories` | 다시 가고 싶은 네 곳 | `src/data/curator.ts` + `src/data/destinations.ts`(slug) |

**최소 콘텐츠**

| 항목 | 최소 수 |
|---|---|
| 여행 지표 | 4 |
| Timeline 항목 | 7 (최소 6) |
| 방문 국가 | 30 |
| Gallery 사진 | 8 (서로 다른 장소) |
| 기억에 남는 여행지 | 4 |
| 추천 여행지 | 6 |

**반응형 콘텐츠 밀도**

| 구간 | 기준 |
|---|---|
| Desktop 1440px | Hero 6:6 · 지표 4열 · 소개 4:8 · Timeline 가로 · 국가 4열 · Gallery 4×2 · 기억 2×2 |
| Mobile 390px | 1열, Timeline 세로, Gallery 스와이프 1장 + 이전/다음 + 위치 표시 |
| 320px | 가로 스크롤 없음 |

**공통 조건**

- 최소: 지표 4, Timeline 6 이상(7), 방문 국가 30, Gallery 8, 기억에 남는 여행지 4, 추천 6
- 밀도: Desktop Hero 6:6·지표 4열·Gallery 4×2·기억 2×2 / Mobile 1열, Timeline 세로, Gallery 스와이프
- 금지: Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역. 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State (SNS 값이 없으면 링크 미렌더링)
- 모든 Section에 제목·1~3문장 설명·실제 콘텐츠 또는 CTA가 있다
- 목록 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State를 보여 준다
- D-001 토큰만 사용(흰 배경·텍스트 `#222222`·CTA 코랄 `#CF4329`·Inter + 시스템 한글·터치 44px 이상·`:focus-visible`). 임의 색·글꼴·그림자 값과 Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI 금지

## 10. Security/Privacy AC

- 외부 링크 `https:`·`mailto:`만

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |
| SMK-09 | SCR-002 `/about` — 7개 영역, `50+ Trips`·`30+ Countries`가 SCR-001과 일치, 국가 30개, 링크 Chip → `/?safety=`, 추천 6곳 → `/?dest=`, 빈 SNS 링크 미표시 |
| UT-08 | 정적 데이터 완전성 (여행지 필수 필드·수량, 해외 국가별 안전정보, 8개 카테고리, 경보 범위, 대표 프로필, 추천 slug 존재, 모든 이미지 `alt`) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-CONTENT-DATA, E2E-PUBLIC-SMOKE, RELEASE-CHECK

## 12. Verify

- `npm run build`, E2E-PUBLIC-SMOKE, Vercel Preview 확인
- E2E-PUBLIC-SMOKE 실행: `npx playwright test e2e/public.spec.ts --project=chromium` — spec이 아직 없으면(E2E-PUBLIC-SMOKE 이전) 실행하지 않고 "보류 — E2E-PUBLIC-SMOKE에서 검증"으로 기록한다.
- `npm run lint` · `npm run typecheck` 오류 0
- `git diff --name-only` 결과가 §7 Expected Files 안에 있음

기대 결과: 위 명령이 모두 성공하고 §8~§10 AC를 하나씩 확인했다.

## 13. Definition of Done

- §8 Functional AC, §9 Visual AC, §10 Security/Privacy AC를 모두 충족
- §12 Verify 명령 통과
- 변경 파일이 §7 Expected Files 안에만 있음
- Vercel Preview에서 Desktop 1440·Mobile 390 화면을 사용자가 확인·승인(`preview_required`)
- `docs/UIUX_TRACEABILITY.md`의 해당 요구사항 Status를 IMPLEMENTED로 갱신

## 14. Forbidden

- Expected Files 밖 파일을 수정하거나 새로 만들지 않는다. 필요하면 작업을 멈추고 Task 목록 변경을 요청한다
- 자체 Route Handler(`route.ts`)·`src/app/api/*`·Server Action(`"use server"`)을 만들지 않는다
- EXCLUDED 요구사항(콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 분석 이벤트, 탈퇴 자동 삭제, 참가 요청 취소, 이메일 사업자 연동 등)을 구현하지 않는다
- AWS·EC2·자동 Merge·Merge Runner 관련 작업을 하지 않는다
- Branch 생성·Commit·Push·PR은 사용자가 요청할 때만 한다
- 하위 Component를 새로 만들거나 고치지 않는다(의존 Component Task 소관). 이 Task는 Route Page 조립만 한다
- Placeholder 문구(Lorem ipsum·"준비 중"·"정보 확인 필요")와 내용 없는 Card를 쓰지 않는다
- 큰 빈 영역을 남기지 않는다. 데이터가 없을 때는 완성형 Empty State를 보여 준다
- Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI를 쓰지 않는다
