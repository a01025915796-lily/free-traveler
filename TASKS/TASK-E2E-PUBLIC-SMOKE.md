# TASK-E2E-PUBLIC-SMOKE Smoke: 공개 화면(메인·대표 소개·공통)

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 56 | E2E-PUBLIC-SMOKE | Smoke: 공개 화면(메인·대표 소개·공통) | E2E Test | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-054, REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-063, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-067, REQ-FUNC-069, REQ-FUNC-070, REQ-FUNC-078, REQ-FUNC-079, REQ-FUNC-080, REQ-NF-023, REQ-NF-024, REQ-NF-030, REQ-FUNC-010, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-053, REQ-FUNC-062, REQ-NF-028 | 없음 | - | - | PAGE-SCR001, PAGE-SCR002, PAGE-SCR004, TECH-ERROR-PAGES, PAGE-SCR003, PAGE-SCR005 | `e2e/public.spec.ts` | 1) SMK-01 메인: 7개 Section, 구분·필터·검색·`kind`, 결과 없음·초기화, 상세 Drawer 필수 항목, 해외 → 같은 Drawer 안전정보, stale 경고, 즐겨찾기, 공유 폴백<br>2) SMK-09 대표 소개: 7개 Section, 수치 일치, 국가 30, 링크 이동<br>3) SMK-08 공통: 5개 Route 메타, Header·Footer·정책 Modal, 320px 가로 스크롤 없음, axe serious/critical 0, 404 복구 링크<br>4) SMK-10 대표 이동 관계<br>5) SMK-01은 Mobile 390에서도 실행<br>6) 핵심 흐름(`test.describe` 단위): FLOW-01 여행지 탐색·상세·안전정보(SMK-01), FLOW-02 대표 소개·공통 품질·이동 관계(SMK-08·09·10)<br>7) 추가 Ref 확인: 필터 변경 시 허용 query만 URL에 반영되고 잘못된 값은 무시(REQ-FUNC-010), 국가 안전정보 Drawer에 8개 카테고리·출처명·URL·확인일·편집자·긴급전화·재외공관 표시(REQ-FUNC-047·048·053), 고정 기준 시각에서 7일 초과 데이터에 stale 경고(REQ-NF-028), `/about`의 빈 문의·SNS 링크 미표시와 `https:`·`mailto:`만 허용(REQ-FUNC-062) | 해당 없음 (화면 요소 없음) | 1) 외부 링크 rel 확인 | `npx playwright test e2e/public.spec.ts --project=chromium` | P0 |

## 1. Context

화면과 무관한 기반 작업의 "Smoke: 공개 화면(메인·대표 소개·공통)" 작업이다. 이 Task는 E2E Test 단계로, 요구사항 32건(REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: PAGE-SCR001, PAGE-SCR002, PAGE-SCR004, TECH-ERROR-PAGES, PAGE-SCR003, PAGE-SCR005. 이 Task가 끝나야 RELEASE-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "Smoke: 공개 화면(메인·대표 소개·공통)"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 제품 코드 수정 (실패 시 해당 구현 Task로 되돌림)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-001 | 국내·해외 여행지 목록 구분 | SCR-001 국내/해외 구분(검색 구분 선택, 검색 결과 모드 탭). `src/data`의 `scope` 값으로 분류 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | 정적 데이터를 클라이언트에서 AND 조건으로 필터 |
| REQ-FUNC-003 | 키워드 검색 | 여행지명·국가명·테마 한글 부분 일치, 결과 없음 상태 |
| REQ-FUNC-004 | 여행지 상세 필수 항목 | SCR-001 여행지 상세 Drawer(`?dest`)에 소개·명소 5+·추천 시기·1일/3일 일정·예산·교통·음식 3+·에티켓·출처·수정일 표시. 게시 상태 대신 데이터 타입과 완전성 테스트로 누락을 막는다 |
| REQ-FUNC-005 | 결과 없음 안내·초기화 | 조건 완화 안내와 "필터 초기화" 버튼, 초기화 시 전체 목록 복원 |
| REQ-FUNC-006 | 해외 상세 → 해당 국가 안전정보 | 여행지 상세 Drawer에서 같은 Drawer 안의 국가 안전정보(`?safety=<countryCode>`)로 전환하고 돌아가기 버튼 제공 |
| REQ-FUNC-049 | 외교부 원문 새 탭 링크 | `https://www.0404.go.kr/` 링크에 `target="_blank"`, `rel="noopener noreferrer"`. 주간 링크 검사는 제외(REQ-NF-011) |
| REQ-FUNC-050 | 7일 초과 stale 경고 | 렌더링 시 계산해 경고 표시, "최신" 배지 숨김 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | 출국권고·여행금지·특별여행주의보를 국가 안전정보 Drawer 최상단에 단계·행동요령·범위 텍스트로 표시 |
| REQ-FUNC-054 | 공식 판단 비대체 고지 | SCR-001 국가 안전정보 Drawer와 SCR-003 항공 요약에 원문 재확인 안내 표시 |
| REQ-FUNC-057 | `free_traveler`, `50+ Trips`, `30+ Countries` | `src/data/curator.ts` 단일 값을 SCR-001 free_traveler 소개 영역과 SCR-002 여행 지표에서 사용 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 | PRD 6-1·6-2 문구를 줄이지 않고 SCR-002 소개 영역에 표시 |
| REQ-FUNC-059 | 방문 국가 30개 이상 목록 | SCR-002 방문 국가 영역: 지도 대신 권역별 국가 Chip 30개. 소개된 국가는 SCR-001 국가 안전정보 Drawer로 연결 |
| REQ-FUNC-060 | 대표 여행 타임라인 | 연도·장소·요약 항목 목록 |
| REQ-FUNC-063 | 추천 여행지 6개 | SCR-002 기억에 남는 여행지 영역의 추천 6곳 Chip에서 SCR-001 여행지 상세 Drawer로 연결. 존재하지 않는 slug는 테스트 실패 |
| REQ-FUNC-064 | 전역 내비게이션·푸터 | `src/app/layout.tsx`의 공통 Header(5개 Screen 메뉴, 계정 진입)와 정책 Modal을 여는 Footer |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | Mobile First Tailwind 레이아웃 |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | SCR-001 검색 결과에 "여행지"/"안전정보" 유형 라벨과 일치 문자열 강조 |
| REQ-FUNC-069 | URL 공유 | 여행지 상세·국가 안전정보 Drawer와 SCR-004 동행 상세 패널에 공유 버튼. Web Share API 실패 시 URL 복사 후 Toast |
| REQ-FUNC-070 | 페이지별 SEO 메타 | Metadata API로 5개 Route의 title·description·canonical·Open Graph, `?dest`는 `generateMetadata`로 여행지별 값. `/`에 WebSite JSON-LD |
| REQ-FUNC-078 | 오류 화면 복구 행동 | `not-found.tsx`(홈), `error.tsx`(다시 시도·홈), 권한 없음(홈·로그인), 외부 연결 실패(재시도) |
| REQ-FUNC-079 | HTML 의미·ARIA 상태 | 폼 라벨·오류 `aria-describedby`, 탭 `role="tablist"`, Drawer·Modal 포커스 이동과 Esc 닫기, Toast `aria-live`, 이미지 `alt` 필수 |
| REQ-FUNC-080 | 정책 문서·안전수칙 동의 기록 | Footer 정책 Modal 4종. SCR-003 동행 구하기 탭에서 글 작성 시 `safety_agreed_at`, `policy_version` 저장 |
| REQ-NF-023 | WCAG 2.2 AA 목표 | REQ-FUNC-079 규칙, 상태·경보는 텍스트 라벨 병기, 터치 대상 24×24px 이상 |
| REQ-NF-024 | axe serious/critical 0건 | `@axe-core/playwright`로 5개 Route와 열린 Drawer·패널 검사 |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | REQ-FUNC-070 방식 |
| REQ-FUNC-010 | 필터 상태 URL 반영 | 허용 필터만 query로 직렬화, 잘못된 값은 무시 |
| REQ-FUNC-047 | 8개 안전 카테고리 | 치안·사기·법규·교통·재난·기후·보건·문화·복장·긴급연락처 섹션을 타입으로 강제 |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 | 안전 데이터에 필드를 두고 SCR-001 국가 안전정보 Drawer에 표시 |
| REQ-FUNC-053 | 긴급전화·재외공관 정보 | 번호·링크·출처·확인일 표시 |
| REQ-FUNC-062 | 문의·SNS 링크 | 관리자 설정 대신 `src/data/curator.ts` 값 사용. 빈 값은 렌더링하지 않고 `https:`·`mailto:`만 허용 |
| REQ-NF-028 | 안전정보 7일 이내 95%, 초과 시 경고 100% | 초과 시 경고는 렌더링 계산으로 100% 표시. 7일 이내 95%는 `src/data/safety.ts`의 `verifiedAt`을 주기적으로 갱신해 재배포하는 운영 작업으로 유지 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | 없음 (화면 밖 작업) |
| Route | - |
| Page Entry | - |

## 5. Design Ref

- 화면 디자인 없음 (비UI 작업)
- `docs/PROJECT_SCOPE.md` §5 구현 방식 · §6 Supabase 구성
- `docs/06_SRS_UIUX_REVISED.md` §2 개정 내역 · §4 UI Route Contract

## 6. Depends On

- PAGE-SCR001 — SCR-001 메인 페이지 조립 (Seq 43)
- PAGE-SCR002 — SCR-002 대표 소개 페이지 조립 (Seq 44)
- PAGE-SCR004 — SCR-004 동행 조회 페이지 조립 (Seq 46)
- TECH-ERROR-PAGES — 404·오류 화면 (Seq 22)
- PAGE-SCR003 — SCR-003 통합 여행 준비 페이지 조립 (Seq 45)
- PAGE-SCR005 — SCR-005 계정·관리 페이지 조립 (Seq 47)

## 7. Expected Files

**생성**

- `e2e/public.spec.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- SMK-01 메인: 7개 Section, 구분·필터·검색·`kind`, 결과 없음·초기화, 상세 Drawer 필수 항목, 해외 → 같은 Drawer 안전정보, stale 경고, 즐겨찾기, 공유 폴백
- SMK-09 대표 소개: 7개 Section, 수치 일치, 국가 30, 링크 이동
- SMK-08 공통: 5개 Route 메타, Header·Footer·정책 Modal, 320px 가로 스크롤 없음, axe serious/critical 0, 404 복구 링크
- SMK-10 대표 이동 관계
- SMK-01은 Mobile 390에서도 실행
- 핵심 흐름(`test.describe` 단위): FLOW-01 여행지 탐색·상세·안전정보(SMK-01), FLOW-02 대표 소개·공통 품질·이동 관계(SMK-08·09·10)
- 추가 Ref 확인: 필터 변경 시 허용 query만 URL에 반영되고 잘못된 값은 무시(REQ-FUNC-010), 국가 안전정보 Drawer에 8개 카테고리·출처명·URL·확인일·편집자·긴급전화·재외공관 표시(REQ-FUNC-047·048·053), 고정 기준 시각에서 7일 초과 데이터에 stale 경고(REQ-NF-028), `/about`의 빈 문의·SNS 링크 미표시와 `https:`·`mailto:`만 허용(REQ-FUNC-062)

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 외부 링크 rel 확인

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-02 | 키보드만으로 SCR-001~005 핵심 흐름 완료, VoiceOver로 폼 오류·Drawer 제목 읽힘 |
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| SMK-02 | SCR-003 `/travel-tools` 항공편·숙소 탭 — 필수값·날짜 오류 차단, 요약 일치, 비전달 안내, 외부 링크 `href`(query 없음)·`target`·`rel`, 입력 중 네트워크 요청에 입력값 없음, 탭 간 상태 분리 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-07 | SCR-005 관리 탭 — 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원에게는 관리 탭이 렌더링되지 않음 |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |
| SMK-09 | SCR-002 `/about` — 7개 영역, `50+ Trips`·`30+ Countries`가 SCR-001과 일치, 국가 30개, 링크 Chip → `/?safety=`, 추천 6곳 → `/?dest=`, 빈 SNS 링크 미표시 |
| SMK-10 | 이동 관계 — `SCREEN_ROUTE_CONTRACT.json`의 `required_navigation` 대표 경로가 실제로 이동 |
| UT-01 | 여행지 필터·키워드 검색·국내/해외 구분·검색 결과 유형(`kind`)·관련 여행지·URL query 직렬화 |
| UT-07 | 안전정보 stale 계산 (7일 경계, 고정 기준 시각) |
| UT-08 | 정적 데이터 완전성 (여행지 필수 필드·수량, 해외 국가별 안전정보, 8개 카테고리, 경보 범위, 대표 프로필, 추천 slug 존재, 모든 이미지 `alt`) |
| UT-10 | Route Contract: `SCREEN_ROUTE_CONTRACT.json`과 `src/app` 파일 일치, `route.ts`·Server Action 없음, SCR-001 시작 화면 흔적 없음 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-CONTENT-DATA, UNIT-SEARCH-STALE, UNIT-ROUTE-CONTRACT, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, MANUAL-CHECK, RELEASE-CHECK

## 12. Verify

- `npx playwright test e2e/public.spec.ts --project=chromium`
- `npm run lint` · `npm run typecheck` 오류 0
- `git diff --name-only` 결과가 §7 Expected Files 안에 있음

기대 결과: 위 명령이 모두 성공하고 §8~§10 AC를 하나씩 확인했다.

## 13. Definition of Done

- §8 Functional AC, §9 Visual AC, §10 Security/Privacy AC를 모두 충족
- §12 Verify 명령 통과
- 변경 파일이 §7 Expected Files 안에만 있음
- 테스트·확인 결과로 `docs/UIUX_TRACEABILITY.md`의 해당 요구사항 Status를 VERIFIED로 갱신(통과한 것만)

## 14. Forbidden

- Expected Files 밖 파일을 수정하거나 새로 만들지 않는다. 필요하면 작업을 멈추고 Task 목록 변경을 요청한다
- 자체 Route Handler(`route.ts`)·`src/app/api/*`·Server Action(`"use server"`)을 만들지 않는다
- EXCLUDED 요구사항(콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 분석 이벤트, 탈퇴 자동 삭제, 참가 요청 취소, 이메일 사업자 연동 등)을 구현하지 않는다
- AWS·EC2·자동 Merge·Merge Runner 관련 작업을 하지 않는다
- Branch 생성·Commit·Push·PR은 사용자가 요청할 때만 한다
- Chromium 밖 브라우저 프로젝트(Firefox·WebKit)를 추가하지 않는다
- 테스트를 통과시키려고 제품 코드를 고치지 않는다
