# TASK-PAGE-SCR004 SCR-004 동행 조회 페이지 조립

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 46 | PAGE-SCR004 | SCR-004 동행 조회 페이지 조립 | Page Owner | IMPLEMENT | REQ-FUNC-030, REQ-FUNC-037, REQ-FUNC-070, REQ-NF-030 | SCR-004 | `/mates` | `src/app/mates/page.tsx` | GLOBAL-LAYOUT, DB-ACCESS, COMP-SCR004-FILTER-LIST, COMP-SCR004-DETAIL, COMP-SCR004-APPLY, COMP-SCR004-REPORT-BLOCK, COMP-SCR004-GUIDES | `src/app/mates/page.tsx` | 1) Section 순서와 데이터 출처: ①Intro(정적) → ②Filter·결과 요약(query) → ③동행 목록(`mate_posts`) → ④상세(`?post`, `mate_posts`·`profiles`·`mate_applications`) → ⑤신청 방법 3단계(정적) → ⑥안전·신고·차단 안내 + CTA(정적)<br>2) 필터·`post` query 해석, `useSearchParams`는 `<Suspense>`<br>3) `metadata` 설정<br>4) 화면 상태(UI_CONTRACT §5 상태표)를 의존 Component·데이터와 연결해 실제로 표시 — Loading: 목록 Skeleton 4개, 상세 Skeleton / Empty: 전체 없음("아직 올라온 동행글이 없어요" + 동행글 쓰기)·조건 불일치(조건 초기화 + 3단계) 2종 / Error: 목록 실패 danger Alert + 다시 시도, 없는 글·차단 관계 "이 글은 볼 수 없어요" + 목록으로 / Unauthorized: 비회원·성인 확인 전은 참가 요청·신고·차단 자리에 안내 | 1) 최소: 목록 8(데이터가 있을 때 첫 화면), 신청 단계 3, 안전 수칙 4<br>2) 밀도: Desktop 목록 7열 + 상세 5열 고정(아래 안내 Card 2개로 빈 영역 없음) / Mobile 목록 1열 + 상세 Drawer<br>3) 금지: Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역. 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State (전체 없음·조건 불일치 2종)<br>4) D-001 토큰만 사용(흰 배경·텍스트 `#222222`·CTA 코랄 `#CF4329`·Inter + 시스템 한글·터치 44px 이상·`:focus-visible`). 임의 색·글꼴·그림자 값과 Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI 금지 | 1) 작성자 연락처 미노출, 차단 관계 비노출 | `npm run build`, E2E-MATE-AUTH, Vercel Preview 확인 | P0 |

## 1. Context

SCR-004 동행 조회 화면(`/mates`)의 "SCR-004 동행 조회 페이지 조립" 작업이다. 이 Task는 Page Owner 단계로, 요구사항 4건(REQ-FUNC-030, REQ-FUNC-037, REQ-FUNC-070, REQ-NF-030)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-LAYOUT, DB-ACCESS, COMP-SCR004-FILTER-LIST, COMP-SCR004-DETAIL, COMP-SCR004-APPLY, COMP-SCR004-REPORT-BLOCK, COMP-SCR004-GUIDES. 이 Task가 끝나야 UNIT-ROUTE-CONTRACT, E2E-PUBLIC-SMOKE, E2E-MATE-AUTH, MANUAL-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- `src/app/mates/page.tsx`에서 Route Page를 조립한다: 의존 Component 배치, 데이터 연결, URL query 해석, metadata
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 하위 Component 생성·수정 (의존 Component Task 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-030 | 동행글 필터 | 국가·지역·기간 겹침·연령대·성별·스타일·모집 상태 필터를 Supabase 쿼리로 처리, 차단 관계 글 제외 |
| REQ-FUNC-037 | 종료일 경과 자동 마감 | 조회 시 `end_date` 기준으로 마감 계산, 모집중 목록에서 제외 |
| REQ-FUNC-070 | 페이지별 SEO 메타 | Metadata API로 5개 Route의 title·description·canonical·Open Graph, `?dest`는 `generateMetadata`로 여행지별 값. `/`에 WebSite JSON-LD |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | REQ-FUNC-070 방식 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-004 동행 조회 (핵심) |
| Route | `/mates` |
| Page Entry | `src/app/mates/page.tsx` |
| 이 Task의 역할 | Route Page 조립 (Page Owner) |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §5 SCR-004 동행 조회 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.4 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `a5652785ec3c4c36ad2b028e4851e080` (Mobile 디자인 없음 — UI_CONTRACT §1.4 Mobile 규칙)
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-LAYOUT — Root Layout·공통 Header·Footer·정책 Modal (Seq 5)
- DB-ACCESS — 동행·요청·차단·신고·설정 데이터 접근 계층 (Seq 14)
- COMP-SCR004-FILTER-LIST — 동행 Intro·필터·목록 (Seq 34)
- COMP-SCR004-DETAIL — 동행 상세 패널 (Seq 35)
- COMP-SCR004-APPLY — 참가 요청 (Seq 36)
- COMP-SCR004-REPORT-BLOCK — 신고·차단 (Seq 37)
- COMP-SCR004-GUIDES — 동행 신청 방법·안전 안내 (Seq 38)

## 7. Expected Files

**생성**

- `src/app/mates/page.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- Section 순서와 데이터 출처: ①Intro(정적) → ②Filter·결과 요약(query) → ③동행 목록(`mate_posts`) → ④상세(`?post`, `mate_posts`·`profiles`·`mate_applications`) → ⑤신청 방법 3단계(정적) → ⑥안전·신고·차단 안내 + CTA(정적)
- 필터·`post` query 해석, `useSearchParams`는 `<Suspense>`
- `metadata` 설정

**화면 상태** (`UI_CONTRACT.md` §5 상태표, `04_UIUX_PLAN.md` §7) — 의존 Component의 상태를 Page에서 데이터와 연결해 실제로 표시한다.

| 상태 | 표시 |
|---|---|
| Loading | 목록 Skeleton 4개, 상세 Skeleton |
| Empty | 전체 없음("아직 올라온 동행글이 없어요" + 동행글 쓰기)·조건 불일치(조건 초기화 + 3단계) 2종 |
| Error | 목록 실패 danger Alert + 다시 시도, 없는 글·차단 관계 "이 글은 볼 수 없어요" + 목록으로 |
| Unauthorized | 비회원·성인 확인 전은 참가 요청·신고·차단 자리에 안내 |

## 9. Visual AC

**Section 순서와 데이터 출처** (계약 `sections` 순서)


| 순서 | Section id | 제목 | 데이터 출처 |
|---|---|---|---|
| 1 | `intro` | 일정이 맞는 여행 동행을 찾아보세요 | 정적 문구 |
| 2 | `filter-summary` | 조건으로 좁혀 보기 | URL query + `mate_posts` 건수 |
| 3 | `list` | 모집 중인 동행글 | Supabase `mate_posts` |
| 4 | `detail` | (선택한 글 제목) | `mate_posts`·`profiles`·`mate_applications` |
| 5 | `how-to-apply` | 동행 신청은 이렇게 진행돼요 | 정적 문구 |
| 6 | `safety` | 안전한 동행을 위해 꼭 지켜 주세요 | 정적 문구 + `src/data/policies.ts` |

**최소 콘텐츠**

| 항목 | 최소 수 |
|---|---|
| 목록 Card | 8 (데이터가 있을 때 첫 화면, 이후 8개씩 더 보기) |
| 신청 단계 | 3 |
| 안전 수칙 | 4 |

**반응형 콘텐츠 밀도**

| 구간 | 기준 |
|---|---|
| Desktop 1440px | Intro 8:4 · 필터 한 줄 · 목록 7열 + 상세 5열 고정(아래 안내 Card 2개) · 3단계 가로 · 안전 분할 |
| Mobile 390px | 목록 1열, 상세 전체 화면 Drawer, 필터 하단 Sheet, 3단계 세로 |
| 320px | 가로 스크롤 없음 |

**공통 조건**

- 최소: 목록 8(데이터가 있을 때 첫 화면), 신청 단계 3, 안전 수칙 4
- 밀도: Desktop 목록 7열 + 상세 5열 고정(아래 안내 Card 2개로 빈 영역 없음) / Mobile 목록 1열 + 상세 Drawer
- 금지: Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역. 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State (전체 없음·조건 불일치 2종)
- 모든 Section에 제목·1~3문장 설명·실제 콘텐츠 또는 CTA가 있다
- 목록 데이터가 없으면 안내 문장·이용 방법·CTA가 있는 완성형 Empty State를 보여 준다
- D-001 토큰만 사용(흰 배경·텍스트 `#222222`·CTA 코랄 `#CF4329`·Inter + 시스템 한글·터치 44px 이상·`:focus-visible`). 임의 색·글꼴·그림자 값과 Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI 금지

## 10. Security/Privacy AC

- 작성자 연락처 미노출, 차단 관계 비노출

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-06 | SCR-004, SCR-005 — 신고 접수번호·시각 3초 이내 표시, 차단 후 상대 글·프로필이 목록에서 사라짐, 내 활동에서 차단 해제 |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |
| UT-06 | 자동 마감 계산 (`end_date` 기준, Asia/Seoul) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-MATE-STATE, E2E-PUBLIC-SMOKE, E2E-MATE-AUTH, RELEASE-CHECK

## 12. Verify

- `npm run build`, E2E-MATE-AUTH, Vercel Preview 확인
- E2E-MATE-AUTH 실행: `npx playwright test e2e/mate-auth.spec.ts --project=chromium` (테스트 계정 환경변수 필요) — spec이 아직 없으면(E2E-MATE-AUTH 이전) 실행하지 않고 "보류 — E2E-MATE-AUTH에서 검증"으로 기록한다.
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
