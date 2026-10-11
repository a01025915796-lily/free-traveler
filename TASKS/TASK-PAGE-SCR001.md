# TASK-PAGE-SCR001 SCR-001 메인 페이지 조립

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 43 | PAGE-SCR001 | SCR-001 메인 페이지 조립 | Page Owner | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-005, REQ-FUNC-010, REQ-FUNC-065, REQ-FUNC-070, REQ-NF-030, REQ-NF-001, REQ-NF-007 | SCR-001 | `/` | `src/app/page.tsx` | GLOBAL-LAYOUT, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE, DB-ACCESS, COMP-SCR001-SEARCH, COMP-SCR001-DESTINATIONS, COMP-SCR001-DESTINATION-DRAWER, COMP-SCR001-SAFETY, COMP-SCR001-MATES-CURATOR | `src/app/page.tsx` | 1) Next.js Starter 제거(시작 문구·`next.svg`·Vercel 템플릿 링크 삭제)<br>2) Section 순서와 데이터 출처: ①검색 Hero(정적) → ②국내 여행지 6(`destinations.ts`) → ③해외 여행지 6(`destinations.ts`) → ④여행 동기 6(테마 정의) → ⑤국가별 주의사항 6(`safety.ts`) → ⑥최근 동행글 3(`mate_posts` via DB-ACCESS) 또는 완성형 Empty State → ⑦free_traveler 소개(`curator.ts`)<br>3) `searchParams`(Promise) 해석: `q`·`scope`·`kind`·필터 → 결과 모드(②③ 대체), `dest`·`safety` → Drawer, 잘못된 값은 Toast<br>4) `useSearchParams` 사용 Component는 `<Suspense>`로 감쌈<br>5) `generateMetadata`: 기본 + `?dest`별 title·description·canonical·OG, WebSite JSON-LD<br>6) 화면 상태(UI_CONTRACT §2 상태표)를 의존 Component·데이터와 연결해 실제로 표시 — Loading: 최근 동행글 영역 Mate Card Skeleton 3개(300ms 이내 응답이면 생략) / Empty: 검색·필터 결과 없음(필터 초기화 + 추천 테마 Chip), 즐겨찾기 없음(전체 여행지 보기), 동행글 없음(3단계 + 동행글 쓰기 + 동행 찾기) / Error: 동행글 조회 실패 시 그 영역만 danger Alert + 다시 시도(다른 영역 정상), 잘못된 `dest`·`safety`는 Drawer 대신 Toast, 이미지 실패 시 장소명 플레이스홀더 | 1) 최소: 국내 Card 6, 해외 Card 6, 테마 6, 안전 Card 6, 동행글 3<br>2) Hero ≤520px, 1440×900 첫 화면에 ② 제목이 보임<br>3) 밀도: Desktop 3열/Bento/2×3, Section 여백 80px, 흰색·`#F7F7F7` 교차 / Mobile 390 Card 1열, 여백 48px, 320px 가로 스크롤 없음<br>4) 금지: Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역. 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State<br>5) 성능 예산: 모바일 Lighthouse Performance ≥85, LCP ≤2.5s(Hero 사진 `priority`)<br>6) D-001 토큰만 사용(흰 배경·텍스트 `#222222`·CTA 코랄 `#CF4329`·Inter + 시스템 한글·터치 44px 이상·`:focus-visible`). 임의 색·글꼴·그림자 값과 Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI 금지 | 1) 검색·필터 값은 URL query만 사용<br>2) 외부 링크 `noopener noreferrer` | `npm run build`, E2E-PUBLIC-SMOKE, Vercel Preview 확인 | P0 |

## 1. Context

SCR-001 메인 화면(`/`)의 "SCR-001 메인 페이지 조립" 작업이다. 이 Task는 Page Owner 단계로, 요구사항 10건(REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-005, REQ-FUNC-010, REQ-FUNC-065 외)을 다룬다.

현재 저장소에는 `src/app/page.tsx`가 있다(Create Next App 초기 상태). 이 Task에서 수정한다. 선행 Task: GLOBAL-LAYOUT, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE, DB-ACCESS, COMP-SCR001-SEARCH, COMP-SCR001-DESTINATIONS, COMP-SCR001-DESTINATION-DRAWER, COMP-SCR001-SAFETY, COMP-SCR001-MATES-CURATOR. 이 Task가 끝나야 UNIT-ROUTE-CONTRACT, E2E-PUBLIC-SMOKE, MANUAL-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- `src/app/page.tsx`에서 Route Page를 조립한다: 의존 Component 배치, 데이터 연결, URL query 해석, metadata
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 하위 Component 생성·수정 (의존 Component Task 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-001 | 국내·해외 여행지 목록 구분 | SCR-001 국내/해외 구분(검색 구분 선택, 검색 결과 모드 탭). `src/data`의 `scope` 값으로 분류 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | 정적 데이터를 클라이언트에서 AND 조건으로 필터 |
| REQ-FUNC-003 | 키워드 검색 | 여행지명·국가명·테마 한글 부분 일치, 결과 없음 상태 |
| REQ-FUNC-005 | 결과 없음 안내·초기화 | 조건 완화 안내와 "필터 초기화" 버튼, 초기화 시 전체 목록 복원 |
| REQ-FUNC-010 | 필터 상태 URL 반영 | 허용 필터만 query로 직렬화, 잘못된 값은 무시 |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | Mobile First Tailwind 레이아웃 |
| REQ-FUNC-070 | 페이지별 SEO 메타 | Metadata API로 5개 Route의 title·description·canonical·Open Graph, `?dest`는 `generateMetadata`로 여행지별 값. `/`에 WebSite JSON-LD |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | REQ-FUNC-070 방식 |
| REQ-NF-001 | LCP ≤2.5s | 정적 데이터 렌더링, 첫 이미지 `priority`. 실제 사용자 p75 대신 배포 URL의 모바일 Lighthouse 측정값으로 판단 |
| REQ-NF-007 | Lighthouse Performance ≥85 | CI 대신 배포 전 수동 측정 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-001 메인 (핵심) |
| Route | `/` |
| Page Entry | `src/app/page.tsx` |
| 이 Task의 역할 | Route Page 조립 (Page Owner) |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §2 SCR-001 메인 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.1 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `fd6afbb21ac84ac5a37017043f45c8f9`, Mobile `3f3464457ac14719b8a826fffb0c8945`
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-LAYOUT — Root Layout·공통 Header·Footer·정책 Modal (Seq 5)
- DATA-DESTINATIONS — 여행지 정적 데이터 (Seq 6)
- DATA-SAFETY — 국가 안전정보 정적 데이터 (Seq 7)
- DATA-REPRESENTATIVE — free_traveler 대표 정적 데이터 (Seq 8)
- DB-ACCESS — 동행·요청·차단·신고·설정 데이터 접근 계층 (Seq 14)
- COMP-SCR001-SEARCH — 메인 검색 Hero·검색 결과 모드 (Seq 23)
- COMP-SCR001-DESTINATIONS — 메인 국내·해외 추천·테마 영역 (Seq 24)
- COMP-SCR001-DESTINATION-DRAWER — 여행지 상세 Drawer (Seq 25)
- COMP-SCR001-SAFETY — 국가별 주의사항 영역·안전정보 Drawer (Seq 26)
- COMP-SCR001-MATES-CURATOR — 메인 최근 동행글·free_traveler 소개 (Seq 27)

## 7. Expected Files

**수정** (현재 저장소에 있음)

- `src/app/page.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- Next.js Starter 제거(시작 문구·`next.svg`·Vercel 템플릿 링크 삭제)
- Section 순서와 데이터 출처: ①검색 Hero(정적) → ②국내 여행지 6(`destinations.ts`) → ③해외 여행지 6(`destinations.ts`) → ④여행 동기 6(테마 정의) → ⑤국가별 주의사항 6(`safety.ts`) → ⑥최근 동행글 3(`mate_posts` via DB-ACCESS) 또는 완성형 Empty State → ⑦free_traveler 소개(`curator.ts`)
- `searchParams`(Promise) 해석: `q`·`scope`·`kind`·필터 → 결과 모드(②③ 대체), `dest`·`safety` → Drawer, 잘못된 값은 Toast
- `useSearchParams` 사용 Component는 `<Suspense>`로 감쌈
- `generateMetadata`: 기본 + `?dest`별 title·description·canonical·OG, WebSite JSON-LD

**화면 상태** (`UI_CONTRACT.md` §2 상태표, `04_UIUX_PLAN.md` §7) — 의존 Component의 상태를 Page에서 데이터와 연결해 실제로 표시한다.

| 상태 | 표시 |
|---|---|
| Loading | 최근 동행글 영역 Mate Card Skeleton 3개(300ms 이내 응답이면 생략) |
| Empty | 검색·필터 결과 없음(필터 초기화 + 추천 테마 Chip), 즐겨찾기 없음(전체 여행지 보기), 동행글 없음(3단계 + 동행글 쓰기 + 동행 찾기) |
| Error | 동행글 조회 실패 시 그 영역만 danger Alert + 다시 시도(다른 영역 정상), 잘못된 `dest`·`safety`는 Drawer 대신 Toast, 이미지 실패 시 장소명 플레이스홀더 |

## 9. Visual AC

**Section 순서와 데이터 출처** (계약 `sections` 순서)


| 순서 | Section id | 제목 | 데이터 출처 |
|---|---|---|---|
| 1 | `search-hero` | 어디로 떠날지, 여기서 차근차근 정해 보세요 | 정적 문구 + `src/lib/destinations/search.ts` |
| 2 | `domestic-picks` | free_traveler가 고른 국내 여행지 | `src/data/destinations.ts` (국내 추천 6) |
| 3 | `overseas-picks` | free_traveler가 고른 해외 여행지 | `src/data/destinations.ts` (해외 추천 6) |
| 4 | `themes` | 이번 여행에서 무엇을 하고 싶으세요? | `src/data/destinations.ts` 테마 정의 6 |
| 5 | `country-safety` | 떠나기 전에 국가별 주의사항을 확인하세요 | `src/data/safety.ts` (메인 노출 6개국) |
| 6 | `recent-mates` | 함께 떠날 동행을 찾고 있나요? | Supabase `mate_posts` (DB-ACCESS, 모집중 최신 3) |
| 7 | `curator-teaser` | 여행지를 고르는 사람, free_traveler | `src/data/curator.ts` |

**최소 콘텐츠**

| 항목 | 최소 수 |
|---|---|
| 국내 여행지 Card | 6 |
| 해외 여행지 Card | 6 |
| 테마 타일 | 6 |
| 안전 Card | 6 |
| 동행글 Card | 3 (없으면 완성형 Empty State) |

**반응형 콘텐츠 밀도**

| 구간 | 기준 |
|---|---|
| Desktop 1440px | Hero 7:5 분할(≤520px) · 국내 3×2 · 해외 Bento(2+4) · 테마 3×2 · 안전 4:8(2×3) · 동행글 3열 · 소개 5:7, Section 여백 80px, 흰색·`#F7F7F7` 교차 |
| Mobile 390px | Card 1열, Hero는 제목→검색→버튼→사진(16:10), 필터 하단 Sheet, Drawer 전체 화면, Section 여백 48px |
| 320px | 가로 스크롤 없음 |

**공통 조건**

- 최소: 국내 Card 6, 해외 Card 6, 테마 6, 안전 Card 6, 동행글 3
- Hero ≤520px, 1440×900 첫 화면에 ② 제목이 보임
- 밀도: Desktop 3열/Bento/2×3, Section 여백 80px, 흰색·`#F7F7F7` 교차 / Mobile 390 Card 1열, 여백 48px, 320px 가로 스크롤 없음
- 금지: Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역. 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State
- 성능 예산: 모바일 Lighthouse Performance ≥85, LCP ≤2.5s(Hero 사진 `priority`)
- 모든 Section에 제목·1~3문장 설명·실제 콘텐츠 또는 CTA가 있다
- 목록 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State를 보여 준다
- D-001 토큰만 사용(흰 배경·텍스트 `#222222`·CTA 코랄 `#CF4329`·Inter + 시스템 한글·터치 44px 이상·`:focus-visible`). 임의 색·글꼴·그림자 값과 Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI 금지

## 10. Security/Privacy AC

- 검색·필터 값은 URL query만 사용
- 외부 링크 `noopener noreferrer`

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-03 | Vercel 배포 URL에서 모바일 Lighthouse (Performance ≥85, LCP ≤2.5s, CLS ≤0.1) |
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |
| UT-01 | 여행지 필터·키워드 검색·국내/해외 구분·검색 결과 유형(`kind`)·관련 여행지·URL query 직렬화 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-SEARCH-STALE, E2E-PUBLIC-SMOKE, MANUAL-CHECK, RELEASE-CHECK

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
