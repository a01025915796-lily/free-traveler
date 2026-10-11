# TASK-RELEASE-CHECK 출시 판정(RAC-01~13)

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 61 | RELEASE-CHECK | 출시 판정(RAC-01~13) | Release | IMPLEMENT | REQ-FUNC-064, REQ-FUNC-070, REQ-NF-001, REQ-NF-003, REQ-NF-007, REQ-NF-012, REQ-NF-016, REQ-NF-023, REQ-NF-024, REQ-NF-026, REQ-NF-027, REQ-NF-030, REQ-NF-031, REQ-NF-034 | 없음 | - | - | UNIT-ROUTE-CONTRACT, TEST-RLS-BASIC, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, MANUAL-CHECK, DEPLOY-VERCEL-SUPABASE, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, UNIT-CONTENT-DATA, UNIT-SEARCH-STALE, UNIT-OUTBOUND-FAVORITES | `docs/checks/RELEASE_CHECK.md` | 1) 06 §5 RAC-01~13을 증거와 함께 판정(RELEASE_READY / RELEASE_BLOCKED)<br>2) 5개 Screen Vercel Preview 사용자 승인 기록<br>3) EXCLUDED 26건이 화면·코드에 없음 확인<br>4) 추적표 Status를 Test 결과에 맞게 VERIFIED로 갱신 | 해당 없음 (화면 요소 없음) | 1) 판정 근거는 실제 실행 결과만 | `docs/checks/RELEASE_CHECK.md` 판정 RELEASE_READY | P0 |

## 1. Context

화면과 무관한 기반 작업의 "출시 판정(RAC-01~13)" 작업이다. 이 Task는 Release 단계로, 요구사항 14건(REQ-FUNC-064, REQ-FUNC-070, REQ-NF-001, REQ-NF-003, REQ-NF-007, REQ-NF-012 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: UNIT-ROUTE-CONTRACT, TEST-RLS-BASIC, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, MANUAL-CHECK, DEPLOY-VERCEL-SUPABASE, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, UNIT-CONTENT-DATA, UNIT-SEARCH-STALE, UNIT-OUTBOUND-FAVORITES.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "출시 판정(RAC-01~13)"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 제품 코드 수정 (실패 시 해당 구현 Task로 되돌림)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | `src/app/layout.tsx`의 공통 Header(5개 Screen 메뉴, 계정 진입)와 정책 Modal을 여는 Footer |
| REQ-FUNC-070 | 페이지별 SEO 메타 | Metadata API로 5개 Route의 title·description·canonical·Open Graph, `?dest`는 `generateMetadata`로 여행지별 값. `/`에 WebSite JSON-LD |
| REQ-NF-001 | LCP ≤2.5s | 정적 데이터 렌더링, 첫 이미지 `priority`. 실제 사용자 p75 대신 배포 URL의 모바일 Lighthouse 측정값으로 판단 |
| REQ-NF-003 | CLS ≤0.1 | 이미지 `width`·`height` 지정, Drawer·패널은 오버레이로 열어 본문 이동 방지. Lighthouse 측정값으로 판단 |
| REQ-NF-007 | Lighthouse Performance ≥85 | CI 대신 배포 전 수동 측정 |
| REQ-NF-012 | TLS 1.2 이상 | Vercel 기본 HTTPS, Supabase HTTPS 엔드포인트만 사용 |
| REQ-NF-016 | 비밀키 환경변수 관리 | 클라이언트에는 `NEXT_PUBLIC_*` 공개 값만 사용, Service Role Key 미사용, `.env*` Git 제외 |
| REQ-NF-023 | WCAG 2.2 AA 목표 | REQ-FUNC-079 규칙, 상태·경보는 텍스트 라벨 병기, 터치 대상 24×24px 이상 |
| REQ-NF-024 | axe serious/critical 0건 | `@axe-core/playwright`로 5개 Route와 열린 Drawer·패널 검사 |
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | REQ-FUNC-074 완전성 테스트 |
| REQ-NF-027 | 해외 국가 안전정보 커버리지 100% | REQ-FUNC-046 데이터 검사 |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | REQ-FUNC-070 방식 |
| REQ-NF-031 | TypeScript strict·lint·unit test | `strict: true` 유지, `lint`·`typecheck`·`test:unit` 통과 후 사용자가 직접 Merge. 자동 Merge Runner 없음 |
| REQ-NF-034 | 월 인프라 비용 ≤100,000원 | Vercel·Supabase 무료 또는 최저 요금제, 유료 부가 기능 미사용 |

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

- UNIT-ROUTE-CONTRACT — 단위 테스트: Route Contract (Seq 54)
- TEST-RLS-BASIC — 통합 테스트: RLS 권한 (Seq 55)
- E2E-PUBLIC-SMOKE — Smoke: 공개 화면(메인·대표 소개·공통) (Seq 56)
- E2E-TRAVEL-TOOLS — Smoke: 여행 준비(항공·숙소) (Seq 57)
- E2E-MATE-AUTH — Smoke: 계정·동행 흐름 (Seq 58)
- MANUAL-CHECK — 수동 확인: 메일·키보드·스크린리더·성능 (Seq 60)
- DEPLOY-VERCEL-SUPABASE — Vercel·Supabase 설정 확인 (Seq 59)
- UNIT-TRAVEL-DATES — 단위 테스트: 날짜·지역 검증 (Seq 48)
- UNIT-CONTACT-DETECTION — 단위 테스트: 공개 연락처 탐지 (Seq 49)
- UNIT-MATE-STATE — 단위 테스트: 동행 상태 전이·자동 마감 (Seq 50)
- UNIT-CONTENT-DATA — 단위 테스트: 정적 데이터 완전성 (Seq 51)
- UNIT-SEARCH-STALE — 단위 테스트: 검색·필터·stale (Seq 52)
- UNIT-OUTBOUND-FAVORITES — 단위 테스트: 외부 URL·즐겨찾기 (Seq 53)

## 7. Expected Files

**생성**

- `docs/checks/RELEASE_CHECK.md`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 06 §5 RAC-01~13을 증거와 함께 판정(RELEASE_READY / RELEASE_BLOCKED)
- 5개 Screen Vercel Preview 사용자 승인 기록
- EXCLUDED 26건이 화면·코드에 없음 확인
- 추적표 Status를 Test 결과에 맞게 VERIFIED로 갱신

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 판정 근거는 실제 실행 결과만

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-02 | 키보드만으로 SCR-001~005 핵심 흐름 완료, VoiceOver로 폼 오류·Drawer 제목 읽힘 |
| MAN-03 | Vercel 배포 URL에서 모바일 Lighthouse (Performance ≥85, LCP ≤2.5s, CLS ≤0.1) |
| RAC-01 | UI Route Contract RC-01~RC-10 충족 (증거: UT-10 결과, build 로그) |
| RAC-02 | `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build` 모두 통과 (증거: 명령 실행 결과) |
| RAC-09 | 보안: 모든 테이블 RLS 활성화, 클라이언트 번들에 비밀값 없음, 항공·숙소 입력값이 네트워크·URL·저장소에 남지 않음 (증거: MAN-04, build 산출물 검사, SMK-02) |
| RAC-10 | Vercel 배포: HTTPS, 환경변수 3개 등록, Supabase Auth Redirect URL에 배포 도메인 `/auth/callback` 등록, 요금제 기준 충족 (증거: 배포 설정 화면, `curl -I`) |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |
| UT-08 | 정적 데이터 완전성 (여행지 필수 필드·수량, 해외 국가별 안전정보, 8개 카테고리, 경보 범위, 대표 프로필, 추천 slug 존재, 모든 이미지 `alt`) |
| UT-10 | Route Contract: `SCREEN_ROUTE_CONTRACT.json`과 `src/app` 파일 일치, `route.ts`·Server Action 없음, SCR-001 시작 화면 흔적 없음 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-CONTENT-DATA, UNIT-ROUTE-CONTRACT, E2E-PUBLIC-SMOKE, MANUAL-CHECK

## 12. Verify

- `docs/checks/RELEASE_CHECK.md` 판정 RELEASE_READY
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
- 근거 없이 RELEASE_READY로 판정하지 않는다
- Production 배포를 직접 하지 않는다(사용자가 한다)
