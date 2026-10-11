---
name: traveler-project-pipeline
description: Traveler PRD/SRS에서 Task를 생성·상세화·감사하고 5개 Screen과 Wave 개발을 지원하는 프로젝트 Skill
---

# Traveler Project Pipeline

이 Skill은 루트 `CLAUDE.md`의 전역 규칙을 전제로 한다. 두 문서가 다르게 읽히면 `CLAUDE.md`를 따르고, 차이를 사용자에게 알린다.

순서는 항상 **입력 검증 → Task 목록 → 목록 감사 → 상세 파일 → 전체 감사 → Wave 계획(`build_waves.py`) → Wave 실행**이다. 어느 단계든 FAIL이면 다음 단계로 가지 않는다.

```
python3 scripts/validate_inputs.py          # VALIDATE_INPUTS_PASS checks=11, TASKS/INPUT_SNAPSHOT.json 생성
/gen-tasklist                                # TASKS/00_TASK_LIST.md
python3 scripts/audit_tasks.py --list-only   # AUDIT_PASS checks=19 (상세 검사 생략)
/gen-task-details                            # TASKS/TASK-<Task ID>.md
python3 scripts/audit_tasks.py               # AUDIT_PASS checks=19, TASK_MANIFEST.csv·TASK_AUDIT_REPORT.md
python3 scripts/build_waves.py               # BUILD_WAVES_PASS, TASK_DAG.md·WAVE_PLAN.md·WAVE_STATE.json·Manifest wave_id
/run-wave WXX                                # TASKS/WAVE_PLAN.md의 Wave 실행, TASKS/WAVE_STATE.json 기록
```

Pipeline 명령(`/gen-tasklist`, `/gen-task-details`, `/audit-tasks`)은 구현 코드·Branch·Commit·Issue를 만들지 않는다. 코드는 `/run-wave`에서만 쓴다.

## 1. 입력 문서

| 입력 | 역할 |
|---|---|
| `docs/01_PRD.md` | PRD (배경·목표, 참고용) |
| `docs/02_SRS_BASELINE.md` | 기준 SRS (참고용, 06이 우선) |
| `docs/06_SRS_UIUX_REVISED.md` | SRS 정본: 개정 R1~R15, RC-01~10, RAC-01~13, 요구사항 114개, UT·SMK·MAN 검증 ID |
| `docs/PROJECT_SCOPE.md` | 범위 분류 정본(§9 IMPLEMENT 88 / §10 EXCLUDED 26), Supabase·데이터 규칙. 화면 이름·Route는 06과 계약을 따른다 |
| `design-reference/SCREEN_ROUTE_CONTRACT.json` | Screen·Route·Page Entry 정본 (`traveler-screen-route-v1`) |
| `design-reference/UI_CONTRACT.md` | 화면별 영역 순서·Component·상태·행동·이동·금지 기능 |
| `design-reference/D-001/DESIGN.md` + `MANIFEST.json`(LOCKED) | 디자인 토큰 정본 |
| `docs/04_UIUX_PLAN.md`, `docs/05_UIUX_APPROVED.md` | Section별 문구, 승인된 Stitch 화면 ID |
| `docs/ARCHITECTURE.md` | 구현 경계, §12 착수 차단 |
| `docs/DECISION_LOG.md` | 확정 결정 DEC-001~014 |
| `docs/UIUX_TRACEABILITY.md` | 요구사항 ↔ Screen·Task·Test·Status 추적표 |
| `TASKS/INPUT_SNAPSHOT.json` | 현재 `package.json`·`src/app` 트리·요구사항 상태 (`validate_inputs.py`가 생성) |

입력 문서가 없거나 서로 맞지 않으면 임의로 만들거나 고치지 않고 멈춰서 보고한다. 감사를 통과시키려고 요구사항·계약·06·PROJECT_SCOPE를 고치지 않는다.

## 2. 5개 Screen과 Page Entry

| Screen | 구분 | Route | Page Entry | Page Owner |
|---|---|---|---|---|
| SCR-001 메인 | 핵심 | `/` | `src/app/page.tsx` | PAGE-SCR001 |
| SCR-002 대표 소개 | 보조 | `/about` | `src/app/about/page.tsx` | PAGE-SCR002 |
| SCR-003 통합 여행 준비 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PAGE-SCR003 |
| SCR-004 동행 조회 | 핵심 | `/mates` | `src/app/mates/page.tsx` | PAGE-SCR004 |
| SCR-005 계정·관리 | 핵심 | `/account` | `src/app/account/page.tsx` | PAGE-SCR005 |

- Screen은 계약의 5개뿐이다. 상세·작성·계정 기능은 Screen 안의 탭·패널·Drawer·Modal과 URL query로 제공한다. Screen이나 Route를 새로 만들지 않는다.
- 기술 Route는 `src/app/auth/callback/page.tsx`(Client Component), `src/app/not-found.tsx`, `src/app/error.tsx`, `src/proxy.ts`뿐이다. `route.ts`·`src/app/api/*`·Server Action은 만들지 않는다.
- `PROJECT_SCOPE.md` §3·§8에 남은 예전 Route 이름(`/plan`, `/auth`, `/my`)은 쓰지 않는다.

## 3. IMPLEMENT·EXCLUDED 상태 처리 규칙

| 상태 | Task List | 상세 파일 | 추적표 Status |
|---|---|---|---|
| IMPLEMENT (88) | 구현 Task 1개 이상 **그리고** 테스트·확인 Task(Unit·Integration·E2E·Manual·Release) 1개 이상의 Requirement Ref에 연결 | 만든다 | NOT_STARTED → IMPLEMENTED(코드 작성) → VERIFIED(테스트 통과) |
| EXCLUDED (26) | §4 NON_IMPLEMENTATION 표에 근거·후속 방향과 함께 기록 | 만들지 않는다 | EXCLUDED 유지 |

- 114개 요구사항은 모두 Task Requirement Ref 또는 NON_IMPLEMENTATION 표에 있어야 하며, 분류는 `PROJECT_SCOPE.md`와 같아야 한다. 요구사항을 삭제하거나 분류를 바꾸지 않는다.
- Task List의 Implementation Status 열은 항상 `IMPLEMENT`다.
- 검증하지 않은 요구사항을 VERIFIED로, 코드가 없는 요구사항을 IMPLEMENTED로 기록하지 않는다.

## 4. Task List·상세 Task 형식

### 4.1 Task List — `TASKS/00_TASK_LIST.md`

```
# Traveler Task List      (상단에 기준 문서, 선행 검사 결과, 총 Task 수, Category별 수)
## 1. 원칙
## 2. Task 목록            (16열 표)
## 3. 요구사항 추적표       (| Requirement | 요지 | Implementation Status | 구현 Task | 테스트·확인 Task |)
## 4. NON_IMPLEMENTATION   (| Requirement | 요지 | 근거 | 후속 방향 |)
```

§2 머리행:

```
| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
```

| 열 | 규칙 |
|---|---|
| Seq | 1부터. 의존 Task는 항상 앞 Seq. Foundation → Screen별 Component → Page Owner → Test → Deploy·Release |
| Category | Setup, CI, Global, Data, DB, Auth, Logic, Tech Route, Component, Page Owner, Unit Test, Integration Test, E2E Test, Manual Check, Deploy, Release |
| Requirement Ref | ID를 하나씩 쉼표로 (범위 표기 금지) |
| Screen | `SCR-00x`(Component·Page Owner만), `공통`, `없음` |
| Route / Page Entry | SCR이면 계약 값을 백틱으로, 아니면 `-` |
| Expected Files | 스냅숏의 실제 트리 기준 |
| AC 3열 | `1) …<br>2) …` 형식 |
| Verify | 실행 명령 (테스트 Task 이름만 쓰지 않는다) |
| Priority | P0 / P1 / P2 |

셀 안의 `|`는 `\|`로 쓴다. Task 개수는 완료 조건이 아니다.

### 4.2 상세 Task — `TASKS/TASK-<Task ID>.md`

```
# TASK-<ID> <제목>
## Task Row                 (목록 머리행 + 구분행 + 그 행 원문 그대로)
## 1. Context
## 2. Project Scope          (범위 / 범위 밖)
## 3. Requirement Ref        (ID, 요지, 06 구현 기준)
## 4. Screen / Route / Page Entry
## 5. Design Ref             (UI_CONTRACT 절, 04 계획 절, Stitch ID, D-001 절)
## 6. Depends On
## 7. Expected Files         (생성 / 수정 구분, "이 목록 밖의 파일은 수정하지 않는다")
## 8. Functional AC
## 9. Visual AC
## 10. Security/Privacy AC
## 11. Test Cases            (06 §8 ID와 시나리오, 검증 Task)
## 12. Verify                (실행 명령)
## 13. Definition of Done
## 14. Forbidden             ("Expected Files 밖" 수정 금지 포함)
```

Task List 행과 상세 파일은 1:1이다. 목록 행을 고치면 상세의 Task Row와 해당 절도 같이 맞추고, Wave에 영향이 있으면 `TASKS/WAVE_PLAN.md`도 맞춘다. 고친 뒤 `validate_inputs.py`와 `audit_tasks.py`를 다시 실행한다.

### 4.3 감사 — `scripts/audit_tasks.py` (F01~F19)

| Check | 내용 |
|---|---|
| F01 | Task List 구현 ID ↔ 상세 파일 1:1 |
| F02 | 중복 Task ID 0 |
| F03 | Depends On 누락 0 |
| F04 | Dependency Cycle 0 |
| F05 | Screen 5개 모두 Page Owner 정확히 1개 |
| F06 | Route·Page Entry·Expected Files 일치 (page.tsx 소유권, Route Handler 금지, 상세 §7 기재) |
| F07 | Component-only Screen 0, Page Owner가 Component에 의존 |
| F08 | SCR-001 Starter 제거 AC |
| F09 | SCR-003 세 탭 조립 AC |
| F10 | SCR-005 역할별 상태 조립 AC |
| F11 | DB Schema·RLS·Access·Seed Task |
| F12 | DB 6개 테이블(+허용 1), 금지 테이블 없음 |
| F13 | 외부 입력 비저장 AC (Task List·상세 §10 양쪽) |
| F14 | Auth 세션·성인 확인·RLS 활성화 AC |
| F15 | Playwright Chromium Smoke Task |
| F16 | AWS·EC2·자동 Merge 구현 Task 0 |
| F17 | 114개 요구사항이 Task 또는 EXCLUDED 표에 존재, PROJECT_SCOPE 분류와 일치 |
| F18 | EXCLUDED 상세 파일 미생성 |
| F19 | 형식: 16열, 상세 14절·Task Row·범위 밖 수정 금지, Page Owner 콘텐츠 계약 |

`AUDIT_FAIL`이면 완료로 보고하지 않는다.

## 5. Page Owner·Component 분리 규칙

1. Screen마다 Page Owner Task가 정확히 하나다. Page Owner만 자기 `page_entry`를 Expected Files에 가진다. 한 Task가 Page Entry 여러 개를 소유하지 않는다.
2. Component Task는 `src/components/<영역>/…`(home·about·tools·mates·account 등) 하위 Component만 만들고 `page.tsx`를 건드리지 않는다. Component만 있고 Page Owner가 없는 Screen을 두지 않는다.
3. Page Owner는 같은 Screen의 모든 Component Task에 의존하고, Page Entry에서 실제 조립만 한다. 하위 Component 생성·수정은 범위 밖이다(상세 §2에 명시).
4. Page Owner 상세 §9에는 다음을 넣는다.
   - Section 순서 표(section id 백틱, `UI_CONTRACT.md` 순서)와 데이터 출처
   - `| 항목 | 최소 수 |` 표와 반응형 밀도(Desktop 1440·Mobile 390)
   - Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역 금지
   - 데이터가 없을 때 안내·이용 방법·CTA가 있는 Empty State
5. Screen별 필수 AC
   - PAGE-SCR001: Next.js Starter(시작 문구, `next.svg`, Vercel 템플릿 링크) 제거
   - PAGE-SCR003: `tab=flight`·`tab=hotel`·`tab=mate` 세 탭 조립, 탭마다 입력·검증·완료 상태 분리
   - PAGE-SCR005: Guest·Member·Admin 상태 조립, 역할에 없는 관리 영역은 렌더링하지 않음
6. 디자인 값은 D-001 토큰만 쓴다(흰 배경, 텍스트 `#222222`, CTA 코랄 `#CF4329`, Inter + 시스템 한글). Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI는 쓰지 않는다.

## 6. DB 6개 Table과 정적 Data 경계

| 구분 | 대상 | 위치 |
|---|---|---|
| Supabase DB | `profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings` (6개뿐) | `supabase/migrations/*.sql`, `supabase/seed.sql` |
| 정적 Data | 여행지, 국가 안전정보, free_traveler 대표 콘텐츠 | `src/data/destinations.ts`, `safety.ts`, `curator.ts` |
| 브라우저 | 즐겨찾기 | `localStorage` |
| 화면 상태 | 알림 | Toast·화면 상태 (DB 테이블 없음) |

- DB Task는 Schema·RLS·Access·Seed로 나눈다(`DB-SCHEMA*`, `DB-RLS*`, `DB-ACCESS`, `DB-SEED*`). 6개 밖의 테이블(여행지·콘텐츠·알림·즐겨찾기·감사 로그 등)을 만들지 않는다.
- 정적 Data는 Data Task(DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE)가 맡고 DB에 넣지 않는다.
- 조회는 `supabase-js` 쿼리 빌더와 `src/lib/db/*`의 타입 있는 함수로 한다. ORM은 쓰지 않는다.

## 7. 외부 입력 비저장 불변조건

항공·숙소 입력값(국가·도시·날짜)은 Client Component의 일시 상태에만 둔다.

- 보내지 않는 곳: API·Supabase·DB·URL(path·query·hash)·쿠키·`localStorage`·`sessionStorage`·서버 로그·콘솔 로그·분석 도구
- 외부 사이트는 `app_settings`의 URL을 query 없이 새 탭(`noopener,noreferrer`)으로 연다.
- SCR-003 Page Owner, 그리고 REQ-FUNC-017·025, REQ-NF-017을 참조하는 Task는 Task List의 Security/Privacy AC와 상세 §10 **양쪽**에 이 AC를 쓴다(F13).
- E2E-TRAVEL-TOOLS는 입력 후 URL·저장소·네트워크 요청에 입력값이 없음을 확인한다.

## 8. 기본 Auth·성인·RLS 규칙

| 항목 | 규칙 |
|---|---|
| 인증 | Supabase 이메일 인증. 메일 링크는 `src/app/auth/callback/page.tsx`(Client Component)가 처리한다 |
| 세션 | `src/proxy.ts`는 세션 쿠키 갱신만 한다. 쿠키 SameSite=Lax. 로그인 후 `next`는 `/`로 시작하는 내부 경로만 허용 |
| Client | Browser Client(`src/lib/supabase/client.ts`)가 사용자 세션으로 조회·쓰기를 한다 |
| Server | Server Client(`src/lib/supabase/server.ts`)는 읽기 전용이다 |
| 키 | Service Role Key를 쓰지 않는다. 클라이언트 환경변수는 `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`뿐이다 |
| 성인 확인 | 생년월일을 받지 않는다. "만 19세 이상입니다" 확인 체크로 `is_adult=true`, `adult_verified_at`만 저장한다 |

RLS:

1. 6개 테이블 모두 RLS를 켠다. 권한 판단의 기준은 RLS이며 화면 숨김은 보조다.
2. 쓰기는 `auth.uid()` 본인 행만 허용한다. 동행글·참가 요청 쓰기는 `is_adult = true`가 필요하다.
3. 공개 읽기는 공개 컬럼만(닉네임·연령대·성별·스타일·자기소개, 모집글 조건). 다른 회원 이메일은 조회할 수 없다.
4. 참가 요청은 요청자와 글 작성자만 읽고, 상태 변경은 글 작성자만 한다.
5. 차단 관계(`is_blocked(a, b)`)의 사용자끼리는 글·프로필·요청을 서로 볼 수 없다.
6. `reports` 읽기는 신고자 본인과 admin만, 상태 변경과 `app_settings` 쓰기는 admin만 한다.
7. `role`은 사용자가 바꿀 수 없고 SQL로만 지정한다.

Auth·DB Task에는 세션·성인 확인·RLS 활성화 AC를 넣고(F14), RLS는 TEST-RLS-BASIC 통합 테스트로 검증한다. RLS를 우회하는 Client 코드를 쓰지 않는다.

## 9. Playwright Chromium Smoke 범위

| Task | Spec | 핵심 흐름 (`test.describe` 단위) |
|---|---|---|
| E2E-PUBLIC-SMOKE | `e2e/public.spec.ts` | FLOW-01 여행지 탐색·상세·안전정보(SMK-01), FLOW-02 대표 소개·공통 품질·이동 관계(SMK-08·09·10) |
| E2E-TRAVEL-TOOLS | `e2e/travel-tools.spec.ts` | FLOW-03 항공·숙소 입력 → 요약 → 외부 이동, 입력값 비전송(SMK-02) |
| E2E-MATE-AUTH | `e2e/mate-auth.spec.ts` | FLOW-04 비회원 권한 안내(SMK-03), FLOW-05 로그인 후 여행 정보 입력·동행글 작성(SMK-04), FLOW-06 참가 요청 → 승인·거절(SMK-05), FLOW-07 신고·차단·관리자 처리(SMK-06·07) (테스트 계정 필요) |

핵심 흐름은 FLOW-01~07의 7개다(DEC-016). 흐름을 늘리거나 spec 파일을 나누려면 Task 목록을 먼저 바꾼다.

- Verify는 `npx playwright test <spec> --project=chromium` 형식이다.
- Chromium 프로젝트의 핵심 Smoke만 둔다. Firefox·WebKit·부하 테스트·Lighthouse CI·시각 회귀 Task를 만들지 않는다.
- 단위 테스트는 Vitest(`src/**/*.test.ts`), 메일·키보드·스크린리더·성능은 MANUAL-CHECK에서 사람이 확인한다.

## 10. Wave 내부 순차 실행

- `python3 scripts/build_waves.py`가 `TASK_MANIFEST.csv`·상세 파일·계약을 읽어 `TASKS/TASK_DAG.md`, `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.json`(schema `traveler-wave-state-v2`), Manifest `wave_id` 열을 만든다. Wave ID는 고정하지 않으며 이 산출물이 정본이다. `--check`는 파일을 쓰지 않고 검사만 한다.
- 규칙: 순환 의존성 0, 선행 Task는 같은 Wave의 앞 순서나 이전 Wave, Wave당 기본 4~7개(7 초과 그룹은 분할), Page Owner는 자기 Screen의 마지막 Task, 같은 파일을 다루는 Task는 다른 Wave. 그룹 순서: Scaffold → 공통 UI·정적 데이터·Layout → Supabase Auth·Table·RLS → SCR-001 → SCR-002 → SCR-003 → SCR-004 → SCR-005 → Unit·Playwright·CI → Deploy·Release.
- `TASKS/WAVE_STATE.json`: 진행 상태. `/run-wave`(Wave 상태)와 `/implement-task`(자기 Task 항목)만 갱신한다.
- Task 하나: `/prepare-task WXX <ID>`(읽기 전용 착수 판정) → `READY_TO_IMPLEMENT`일 때만 `/implement-task WXX <ID>`.
- Wave 안의 Task는 에이전트 하나가 Seq 순서로 **한 번에 하나씩** 구현한다. 서브에이전트를 병렬로 돌리지 않는다.
- Task마다 `CLAUDE.md`의 완료 순서(Task 읽기 → 입력 확인 → 구현 → 포맷·Unit Test → 필요 시 Playwright → Diff 확인 → 완료 보고)를 따른다. 앞 Task의 Verify가 통과해야 다음 Task로 간다.
- Depends On 미완료, 필요한 파일·환경변수 없음(`ARCHITECTURE.md` §12 착수 차단)이면 구현하지 않고 멈춰서 보고한다.
- Page Owner Wave(`checkpoint_type: preview`)에서 멈추고, 사람이 Desktop 1440·Mobile 390 화면을 확인해 `/run-wave resume`으로 승인한 뒤 다음 Wave로 간다. Vercel 연결 전에는 로컬 dev, 연결 후에는 Vercel Preview로 확인한다.
- Commit은 사용자가 요청할 때(`--commit`)만 한다.

## 11. EXCLUDED 보호

- `PROJECT_SCOPE.md` §10의 EXCLUDED 26건은 Task·상세 파일·코드·테이블·화면 요소를 만들지 않는다. 예: 콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 행동 분석, 탈퇴 자동 삭제, 참가 요청 취소, 외부 Email 공급자, Monitoring.
- 구현 중 EXCLUDED 기능이 필요해 보이면 멈추고 사용자에게 범위 변경을 요청한다. 다른 Task에 몰래 끼워 넣지 않는다.
- EXCLUDED를 IMPLEMENT로 바꾸는 것은 사용자 결정이며, 바뀌면 `PROJECT_SCOPE.md`·06·`DECISION_LOG.md`를 먼저 고친 뒤 Pipeline을 다시 돈다.

## 12. AWS·EC2·자동 Merge 금지

- 호스팅은 Vercel, DB·인증은 Supabase뿐이다. AWS SDK, EC2 등 AWS 인프라, Prisma·Drizzle 등 ORM을 Task나 코드에 넣지 않는다.
- CI는 GitHub Actions(lint, typecheck, unit, build)만 둔다. 자동 PR·자동 Merge를 설정하거나 실행하는 Task·Workflow를 만들지 않는다.
- 에이전트는 Push·PR 생성·Merge·Production 배포를 하지 않는다. 이것은 사용자가 직접 한다.
- `git reset --hard`, `git push --force`, `git clean -f`, `git checkout -- .`, 브랜치 삭제처럼 되돌릴 수 없는 Git 명령을 사용자 요청 없이 쓰지 않는다.
