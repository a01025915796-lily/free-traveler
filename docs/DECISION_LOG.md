# Free Traveler Decision Log

| 항목 | 내용 |
|---|---|
| 작성일 | 2026-10-10 |
| 범위 | 구현 착수 전까지 확정된 프로젝트 결정 |
| 상태 값 | 확정 / 변경됨 / 폐기 |

결정을 바꾸려면 기존 항목을 지우지 않고 상태를 "변경됨"으로 바꾼 뒤, 새 DEC 번호로 새 결정을 추가하고 서로 연결한다.

## 요약

| ID | 결정 | 상태 | 결정일 |
|---|---|---|---|
| DEC-001 | 실제 개발 루트는 `traveler/app` | 확정 | 2026-10-07 |
| DEC-002 | 디자인 Screen은 핵심 4개·보조 1개 | 확정 | 2026-10-09 |
| DEC-003 | `/travel-tools`에 항공·숙소·동행 작성을 통합 | 확정 | 2026-10-07 |
| DEC-004 | 여행지·안전·대표는 정적 TypeScript Data | 확정 | 2026-10-07 |
| DEC-005 | Supabase는 Auth와 동행 기능 중심 | 확정 | 2026-10-07 |
| DEC-006 | DB는 6개 Table로 제한 | 확정 | 2026-10-07 |
| DEC-007 | 항공·숙소 입력은 Browser Memory에만 유지 | 확정 | 2026-10-07 |
| DEC-008 | Airbnb DESIGN.md는 vendor 참고본, D-001이 실제 정본 | 확정 | 2026-10-09 |
| DEC-009 | Playwright는 Chromium Smoke만 필수 | 확정 | 2026-10-07 |
| DEC-010 | 사용자의 개발 실행 단위는 Wave | 확정 | 2026-10-10 |
| DEC-011 | Single Agent가 Wave 내부 Task를 순차 수행 | 확정 | 2026-10-10 |
| DEC-012 | PR·Merge는 사용자가 수동 수행 | 확정 | 2026-10-10 |
| DEC-013 | EC2·AWS는 사용하지 않음 | 확정 | 2026-10-07 |
| DEC-014 | 제외 기능은 EXCLUDED로 관리 | 확정 | 2026-10-07 |
| DEC-015 | Playwright Smoke는 Page Owner·E2E Task에서만 실행, 나머지는 W10까지 보류 | 확정 | 2026-10-11 |
| DEC-016 | Task 감사 보완: 테스트 Ref 연결, Page Owner 상태 AC, Playwright 핵심 흐름 7개 | 확정 | 2026-10-11 |
| DEC-017 | Wave 계획은 `scripts/build_waves.py`가 생성하고 그 산출물을 정본으로 한다 | 확정 | 2026-10-11 |

---

## DEC-001 실제 개발 루트는 `traveler/app`

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-07) |
| 결정 | 실제 개발 루트이자 Git 저장소 루트는 `/Users/sangeunkim/Documents/AI_SERVICE/traveler/app`이다. 문서·코드·Task·Script는 모두 이 아래에서 관리한다 |
| 배경 | 상위 `traveler/` 아래에 `app/`과 `docs/`가 함께 있다. `traveler/docs/`에는 PRD·SRS 원본(`00_PRD_Travel_v1.md`, `05_SRS_Travel_v1.md`)과 별도의 Next.js 초기 프로젝트(`traveler/docs/app/`)가 있다 |
| 영향 | `traveler/docs/`의 PRD·SRS는 `app/docs/01_PRD.md`, `02_SRS_BASELINE.md`와 내용이 같다(바이트 비교 일치). 작업 기준은 `app/docs/`다. `traveler/docs/app/`은 개발에 쓰지 않는다 |
| 근거 | `git rev-parse --show-toplevel` = `traveler/app`, `AGENTS.md`(Next.js 16 규칙) 위치 |

## DEC-002 디자인 Screen은 핵심 4개·보조 1개

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-09, Route 확정 2026-10-07) |
| 결정 | 디자인 Screen은 5개다. 핵심: SCR-001 메인 `/`, SCR-003 통합 여행 준비 `/travel-tools`, SCR-004 동행 조회 `/mates`, SCR-005 계정·관리 `/account`. 보조: SCR-002 대표 소개 `/about` |
| 이유 | 기준 SRS의 공개 Route 16개를 탭·패널·Drawer·Modal로 통합해 화면 수와 구현 비용을 줄인다. SCR-002는 정적 콘텐츠이고 다른 화면의 기능이 의존하지 않아 보조로 둔다 |
| 영향 | Screen마다 Page Owner Task가 정확히 하나다(PAGE-SCR001~005). `page.tsx`는 5개 Page Entry와 `src/app/auth/callback/page.tsx`만 둔다 |
| 근거 | `design-reference/SCREEN_ROUTE_CONTRACT.json`, `design-reference/UI_CONTRACT.md` §1.1, `docs/05_UIUX_APPROVED.md` §1·§4, `docs/STITCH_VALIDATION_REPORT.md` |

## DEC-003 `/travel-tools`에 항공·숙소·동행 작성을 통합

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-07) |
| 결정 | SCR-003 `/travel-tools`는 항공편(`tab=flight`, 기본)·숙소(`tab=hotel`)·동행 구하기(`tab=mate`, 수정 `&edit=<id>`) 세 탭을 가진다. 기준 SRS의 `/flights`, `/hotels`, `/mates/new`를 대체한다 |
| 이유 | 여행 조건 정리와 동행 모집을 "여행 준비" 한 화면에서 처리한다. 탭마다 입력·검증·완료 상태를 분리한다 |
| 영향 | Component Task를 COMP-SCR003-SHELL·FLIGHT·HOTEL·MATE-COMPOSE로 나누고 PAGE-SCR003이 조립한다. 동행 조회·상세는 SCR-004에 남는다 |
| 근거 | `docs/06_SRS_UIUX_REVISED.md` R2·§3.2, `design-reference/UI_CONTRACT.md` §4 |

## DEC-004 여행지·안전·대표는 정적 TypeScript Data

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-07) |
| 결정 | 여행지(국내 10곳, 해외 15개국 30개 도시)·국가 안전정보(15개국)·`free_traveler` 대표 콘텐츠는 `src/data/destinations.ts`, `safety.ts`, `curator.ts`의 정적 TypeScript 데이터로 둔다 |
| 이유 | 콘텐츠 양이 고정된 MVP에서 CMS·DB 비용을 없앤다. 타입과 단위 테스트(UNIT-CONTENT-DATA)로 필수 항목과 수량을 강제한다 |
| 영향 | 콘텐츠 변경은 코드 수정 + Vercel Preview + 재배포로 한다. 안전정보 stale은 렌더링 시 계산한다. 콘텐츠 CMS는 EXCLUDED(DEC-014) |
| 근거 | `docs/PROJECT_SCOPE.md` §5.1, `docs/06_SRS_UIUX_REVISED.md` R5, `docs/ARCHITECTURE.md` §5 |

## DEC-005 Supabase는 Auth와 동행 기능 중심

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-07) |
| 결정 | Supabase는 이메일 인증·세션과 동행 기능(모집글·참가 요청·차단·신고)과 외부 URL 설정에만 쓴다. 쓰기는 Browser Client가 RLS 아래에서 하고, Server Client는 읽기 전용, `src/proxy.ts`는 세션 갱신만 한다 |
| 이유 | 자체 API·서버 코드 없이 권한을 RLS로 일원화한다 |
| 영향 | 자체 Route Handler·API Route·Server Action을 만들지 않는다. Prisma 등 ORM을 쓰지 않는다. Service Role Key를 쓰지 않는다. 알림은 Toast·화면 상태(외부 Email 공급자 제외) |
| 근거 | `docs/PROJECT_SCOPE.md` §5.2, `docs/06_SRS_UIUX_REVISED.md` R4·R7·R15, `docs/ARCHITECTURE.md` §7 |

## DEC-006 DB는 6개 Table로 제한

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-07) |
| 결정 | DB 테이블은 `profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings` 6개뿐이다 |
| 이유 | 여행지·안전·대표는 정적 데이터(DEC-004)이고, 미디어·감사 로그·알림 큐는 범위 밖이다 |
| 영향 | 기준 SRS의 COUNTRY·REGION·DESTINATION·DESTINATION_CONTENT·COUNTRY_SAFETY·REPRESENTATIVE_PROFILE·MEDIA_ASSET·AUDIT_LOG 테이블을 만들지 않는다. 감사 Script F12가 6개 밖 테이블과 금지 테이블을 검사한다 |
| 근거 | `docs/PROJECT_SCOPE.md` §6, `docs/06_SRS_UIUX_REVISED.md` R5, `scripts/audit_tasks.py` F11·F12 |

## DEC-007 항공·숙소 입력은 Browser Memory에만 유지

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-07) |
| 결정 | 항공·숙소 입력값(국가·도시·날짜)은 SCR-003 Client Component의 일시 상태에만 둔다. API·Supabase·DB·URL(query 포함)·쿠키·`localStorage`·`sessionStorage`·로그·분석으로 보내지 않는다. 외부 사이트는 query 없는 일반 페이지를 새 탭으로 연다 |
| 이유 | 기준 SRS CON-01·CON-02와 개인정보 최소 수집 원칙. 입력값은 외부로 전달하지 않는다는 고지와 실제 동작을 일치시킨다 |
| 영향 | 항공·숙소용 서버 API가 없다. URL에는 `tab`만 쓴다. E2E-TRAVEL-TOOLS가 네트워크 요청과 URL에 입력값이 없음을 단언하고, 감사 Script F13이 관련 Task의 Security/Privacy AC를 검사한다 |
| 근거 | `docs/06_SRS_UIUX_REVISED.md` REQ-FUNC-017·025, REQ-NF-017, `docs/ARCHITECTURE.md` §6 |

## DEC-008 Airbnb DESIGN.md는 vendor 참고본, D-001이 실제 정본

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-09) |
| 결정 | `design-reference/vendor/airbnb/DESIGN-airbnb.md`는 레이아웃·여백·사진 중심 구성을 참고하는 자료일 뿐이다. 실제 디자인 토큰의 정본은 `design-reference/D-001/DESIGN.md`(LOCKED, `MANIFEST.json`)다 |
| 이유 | Airbnb 상표 요소(로고, Rausch `#FF385C`, Cereal 글꼴, Guest favorite 배지, 별점·예약 UI)를 쓰지 않고 Free Traveler 고유 토큰(코랄 `#CF4329`, Inter + 시스템 한글)을 쓴다 |
| 영향 | `src/app/globals.css`의 `@theme` 토큰은 D-001에서 옮긴다(GLOBAL-DESIGN-TOKENS). D-001을 바꾸려면 버전을 올리고 MANIFEST를 DRAFT로 되돌린 뒤 다시 승인한다. D-001 초안은 사용자 요청으로 `04_UIUX_PLAN.md` §3·§4와 Stitch 디자인 시스템을 옮겨 작성했다 |
| 근거 | `design-reference/D-001/MANIFEST.json`, `docs/04_UIUX_PLAN.md` §2, `scripts/validate_inputs.py` 검사 4 |

## DEC-009 Playwright는 Chromium Smoke만 필수

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-07) |
| 결정 | 필수 E2E는 Playwright Chromium 프로젝트의 Smoke Test 3개 Task(E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH)다. Desktop 1440과 Mobile 390 뷰포트를 Chromium에서 실행한다 |
| 이유 | 핵심 흐름을 빠르게 회귀 확인하는 데 집중한다 |
| 영향 | Firefox·WebKit 프로젝트, 부하 테스트, Lighthouse CI는 두지 않는다. 단위·통합 검증은 Vitest, 성능·접근성 일부는 수동 확인(MANUAL-CHECK)이다. 감사 Script F15가 `--project=chromium`을 검사한다 |
| 근거 | `docs/PROJECT_SCOPE.md` §8.2, `docs/06_SRS_UIUX_REVISED.md` R13, `docs/ARCHITECTURE.md` §9 |

## DEC-010 사용자의 개발 실행 단위는 Wave

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-10) |
| 결정 | 사용자는 Task 하나가 아니라 Wave(여러 Task 묶음) 단위로 개발을 지시한다 |
| 이유 | 의존 관계가 있는 Task를 묶어 한 번에 진행하고, 사용자가 Wave 끝에서 결과를 검토한다 |
| 영향 | Wave 구성은 `TASKS/WAVE_PLAN.md`(W01~W11, Task 61개)이며 `TASKS/00_TASK_LIST.md`의 Seq·Depends On을 따른다. 실행은 `/run-wave WXX`, 진행 상태는 `TASKS/WAVE_STATE.json`. 화면 Wave(W04·W06~W09)는 Page Owner 뒤에 PREVIEW 확인 지점을 가진다 |
| 근거 | 사용자 지시 (2026-10-10) |

## DEC-011 Single Agent가 Wave 내부 Task를 순차 수행

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-10) |
| 결정 | 한 Wave 안의 Task는 에이전트 하나가 Seq 순서대로 하나씩 수행한다. 서브에이전트를 병렬로 돌리지 않는다 |
| 이유 | 같은 파일을 동시에 편집하는 충돌을 막고, Task별 결과를 순서대로 검증한다 |
| 영향 | Task마다 상세 파일 §7 Expected Files 밖을 수정하지 않고, §12 Verify가 통과한 뒤 다음 Task로 넘어간다 |
| 근거 | 사용자 지시 (2026-10-10), `TASKS/TASK-*.md` §7·§12·§14 |

## DEC-012 PR·Merge는 사용자가 수동 수행

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-10) |
| 결정 | PR 생성·Merge·Production 배포는 사용자가 직접 한다. 에이전트는 사용자가 요청할 때만 Commit하며 Push·PR·Merge를 하지 않는다 |
| 이유 | 검토와 병합의 통제권을 사용자에게 둔다 |
| 영향 | 자동 Merge·Merge Runner를 만들지 않는다. GitHub Actions는 검사(lint·typecheck·unit·build)만 하고 배포·병합 단계가 없다. Vercel Production 승격은 사용자가 한다 |
| 근거 | 사용자 지시 (2026-10-10), `docs/ARCHITECTURE.md` §10, `scripts/audit_tasks.py` F16 |

## DEC-013 EC2·AWS는 사용하지 않음

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-07) |
| 결정 | 호스팅은 Vercel, DB·인증은 Supabase만 쓴다. EC2를 포함한 AWS 인프라를 쓰지 않는다 |
| 이유 | MVP 규모에서 Vercel·Supabase로 충분하고, 인프라 운영 비용과 복잡도를 줄인다 |
| 영향 | AWS SDK 의존성·AWS 배포 설정(`serverless.yml`, `cdk.json` 등)을 두지 않는다. 입력 검증 Script 검사 11과 감사 Script F16이 이를 검사한다 |
| 근거 | `docs/PROJECT_SCOPE.md` §7, `scripts/validate_inputs.py` 검사 11 |

## DEC-014 제외 기능은 EXCLUDED로 관리

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-07) |
| 결정 | 만들지 않는 요구사항도 삭제하지 않고 EXCLUDED로 표시해 근거와 후속 방향을 남긴다. 현재 114건 중 26건이 EXCLUDED다 |
| 이유 | 기준 SRS와의 추적성을 유지하고, 나중에 범위를 넓힐 때 어디서부터 시작할지 남긴다 |
| 영향 | EXCLUDED에는 구현 Task·상세 파일을 만들지 않는다(감사 F17·F18). `TASKS/00_TASK_LIST.md` §4 NON_IMPLEMENTATION과 `docs/UIUX_TRACEABILITY.md`에 Status `EXCLUDED`로 남는다. 주요 제외: 콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 행동 분석, 탈퇴 자동 삭제, 외부 Email 공급자, Monitoring, 부하 테스트, 참가 요청 취소 |
| 근거 | `docs/PROJECT_SCOPE.md` §1·§7·§9·§10, `docs/06_SRS_UIUX_REVISED.md` §1 |

## DEC-015 Playwright Smoke는 Page Owner·E2E Task에서만 실행, 나머지는 W10까지 보류

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-11) |
| 결정 | Task 구현(`/implement-task`, `/run-wave`) 중 Playwright Smoke는 Page Owner(PAGE-SCR001~005)와 E2E Test Task(E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH)에서만 실행한다. 그 밖의 Task는 §12 Verify에 E2E Task가 걸려 있어도 실행하지 않고 "보류 — <E2E Task ID>에서 검증"으로 기록한다. Page Owner도 spec이 아직 없으면(W10 이전) 같은 방식으로 보류한다 |
| 이유 | E2E spec(`e2e/*.spec.ts`)은 W10의 E2E Task가 만든다. 그 전의 Component·Auth·DB·Global Task가 Playwright 통과를 완료 조건으로 가지면 실행할 수 없는 검증 때문에 Task가 끝나지 않는다. 대안(B: E2E Task를 각 화면 Wave로 옮겨 Wave 계획을 다시 짜기) 대신 문서 정리(A)를 택했다 |
| 영향 | Task 상세 25개(Component 20, AUTH-SUPABASE, DB-ACCESS, GLOBAL-UI-KIT, GLOBAL-LAYOUT, TECH-ERROR-PAGES)의 §12 Verify를 "이 Task에서는 실행하지 않는다 … 보류로 기록"으로, "기대 결과"와 §13 DoD에 보류를 반영했다. Page Owner 5개의 Playwright 줄에 "spec이 없으면 보류" 조건을 붙였다. Task List(`00_TASK_LIST.md`)와 Task Row는 바꾸지 않았다. W04·W06~W09에서 화면 관련 요구사항의 추적표 Status는 IMPLEMENTED에 머물고, W10 E2E 통과 후 VERIFIED가 된다. 보류 항목을 통과로 기록하지 않는다 |
| 근거 | `.claude/commands/implement-task.md` 규칙 6·§4, `.claude/commands/run-wave.md` §2 6단계, `TASKS/WAVE_PLAN.md` W10, DEC-009(Chromium Smoke 범위) |

## DEC-016 Task 감사 보완: 테스트 Ref 연결, Page Owner 상태 AC, Playwright 핵심 흐름 7개

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-11) |
| 결정 | ① 06 §6·§7 "확인 방법"의 UT·SMK·MAN이 가리키는 테스트 Task에 빠진 Requirement Ref 11건을 추가한다(E2E-PUBLIC-SMOKE: REQ-FUNC-010·047·048·053·062, REQ-NF-028 / E2E-MATE-AUTH: REQ-FUNC-044·078, REQ-NF-013 / MANUAL-CHECK: REQ-FUNC-027·044, REQ-NF-013 / UNIT-MATE-STATE: REQ-FUNC-031). ② Depends On 3건을 추가한다(E2E-PUBLIC-SMOKE ← PAGE-SCR003·PAGE-SCR005, E2E-TRAVEL-TOOLS ← DB-SEED-BASE, UNIT-ROUTE-CONTRACT ← TECH-ERROR-PAGES). ③ Page Owner 5개에 UI_CONTRACT 상태표 기준 Loading·Empty·Error(·Unauthorized) AC와 D-001 토큰 Visual AC를 넣는다. ④ Playwright 핵심 흐름을 FLOW-01~07로 정의해 E2E Task 3개에 나눈다. ⑤ EXCLUDED 근거 3건(REQ-NF-008·011·033)을 구체화한다 |
| 이유 | 감사 Script(F01~F19)는 통과했지만, 06의 확인 방법과 테스트 Task Ref가 어긋나 RAC-04 판정 근거가 불명확했다. SMK-08·10은 5개 Route 전체, SMK-02는 `app_settings` 시드, UT-10은 not-found·error 파일을 필요로 하는데 Depends On에 없었다. Page Owner에는 Loading 상태 AC가 없었다 |
| 영향 | Task 수는 61개 그대로다. Wave 배치는 바뀌지 않는다(추가 의존 Task는 모두 앞 Wave). PROJECT_STATE Deferred #2를 해소했다. 테이블은 `user_blocks`를 유지한다(감사 요청서의 `blocks`는 같은 테이블로 본다) |
| 근거 | `docs/06_SRS_UIUX_REVISED.md` §6~§8, `design-reference/UI_CONTRACT.md` 상태표, `docs/04_UIUX_PLAN.md` §7 |

## DEC-017 Wave 계획은 `scripts/build_waves.py`가 생성하고 그 산출물을 정본으로 한다

| 항목 | 내용 |
|---|---|
| 상태 | 확정 (2026-10-11) |
| 결정 | `scripts/build_waves.py`가 `TASK_MANIFEST.csv`·Task 상세 파일·`SCREEN_ROUTE_CONTRACT.json`을 읽어 `TASKS/TASK_DAG.md`, `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.json`(schema `traveler-wave-state-v2`), Manifest `wave_id` 열을 만든다. Wave ID는 미리 고정하지 않고 이 산출물을 이후 단계의 정본으로 쓴다. 그룹 순서는 Scaffold → 공통 UI·정적 데이터·Layout → Supabase Auth·6개 Table·RLS → SCR-001 → SCR-002 → SCR-003 → SCR-004 → SCR-005 → Unit·Playwright·CI → Deploy·Release이고, 7개를 넘는 그룹은 나눈다 |
| 이유 | 손으로 쓴 W01~W11 계획은 Task 수정 때마다 어긋날 수 있다. 순환 의존성·Wave 역순 의존·Page Owner 위치·파일 충돌을 Script로 검사해 재현 가능하게 만든다 |
| 영향 | 2026-10-11 생성 결과: 13개 Wave(W01 1 · W02 7 · W03 7 · W04 5 · W05 4 · W06 3 · W07 4 · W08 4 · W09 6 · W10 5 · W11 6 · W12 6 · W13 3), 순환 의존성 0. Page Owner: SCR-001 W05, SCR-002 W06, SCR-003 W08, SCR-004 W09, SCR-005 W10(각 Wave 마지막), Release W13. 상태 값은 소문자(`pending`·`in_progress`·`blocked`·`completed`, Task는 `failed` 추가)로 바뀌고 `preview_approved_at` 대신 `checkpoint_result`·`checkpoint_at`을 쓴다. `/run-wave`·`/prepare-task`·`/implement-task`·`/release-check`·Skill·`CLAUDE.md`·`PROJECT_STATE.md`를 이에 맞췄다. DEC-011·DEC-015에 적힌 예전 Wave 번호(W04·W05·W06~W09·W10·W11)는 이 결정으로 대체한다. Wave당 4개 미만인 W01·W06·W13은 그룹 Task 수가 적어 경고만 남긴다. `audit_tasks.py`는 Manifest를 다시 쓸 때 `wave_id` 열을 보존한다 |
| 근거 | `scripts/build_waves.py`, `TASKS/WAVE_PLAN.md`, `TASKS/TASK_DAG.md` |
