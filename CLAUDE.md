# Free Traveler — Agent Rules

이 저장소(`traveler/app`)에서 작업하는 에이전트의 규칙이다. 필요한 규칙은 모두 이 파일에 있다.

## Harness Marker

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

## 정본

| 대상 | 정본 | 다른 문서와 다를 때 |
|---|---|---|
| 요구사항(SRS) | `docs/06_SRS_UIUX_REVISED.md` | 이 문서가 기준 SRS(`02_SRS_BASELINE.md`)보다 우선 |
| 범위 분류 (IMPLEMENT/EXCLUDED) | `docs/PROJECT_SCOPE.md` §9·§10 | 분류는 이 문서를 따른다. 화면 이름·Route는 06과 계약을 따른다 |
| 디자인 토큰 | `design-reference/D-001/DESIGN.md` (LOCKED, `MANIFEST.json`) | `design-reference/vendor/airbnb/`는 참고본일 뿐 |
| Screen·Route·Page Entry | `design-reference/SCREEN_ROUTE_CONTRACT.json` | 계약이 우선 |
| 화면 상세 (영역·상태·이동·금지) | `design-reference/UI_CONTRACT.md` | — |
| 구현 경계 | `docs/ARCHITECTURE.md` | — |
| 작업 단위 | `TASKS/00_TASK_LIST.md`, `TASKS/TASK-<ID>.md` | 상세 파일은 목록 행을 그대로 담는다 |
| 결정 기록 | `docs/DECISION_LOG.md` | — |

## Screen

| Screen | 구분 | Route | Page Entry | Page Owner |
|---|---|---|---|---|
| SCR-001 메인 | 핵심 | `/` | `src/app/page.tsx` | PAGE-SCR001 |
| SCR-002 대표 소개 | 보조 | `/about` | `src/app/about/page.tsx` | PAGE-SCR002 |
| SCR-003 통합 여행 준비 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PAGE-SCR003 |
| SCR-004 동행 조회 | 핵심 | `/mates` | `src/app/mates/page.tsx` | PAGE-SCR004 |
| SCR-005 계정·관리 | 핵심 | `/account` | `src/app/account/page.tsx` | PAGE-SCR005 |

기술 Route: `src/app/auth/callback/page.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`, `src/proxy.ts`. 이 밖에 `page.tsx`·`route.ts`·`src/app/api/*`·Server Action을 만들지 않는다.

## 작업 시작 전

1. `package.json`을 읽고 실제 설치된 버전과 스크립트를 확인한다.
2. 현재 Next.js는 16.x다. 학습 데이터와 API·규칙·파일 구조가 다를 수 있으므로, 관련 기능을 쓰기 전에 `node_modules/next/dist/docs/`의 해당 문서를 읽고 deprecation 안내를 따른다. 확인된 규칙:
   - `page.tsx`의 `searchParams`·`params`는 `Promise`이므로 `await`한다.
   - Client Component에서 `useSearchParams`를 쓰면 `<Suspense>`로 감싼다 (없으면 production build 실패).
   - Middleware 대신 `src/proxy.ts`를 쓴다.
3. 작업할 Task의 `TASKS/TASK-<ID>.md`를 끝까지 읽는다.

## 개발 명령

- 표준 개발 명령은 `/run-wave WXX`다(`.claude/commands/run-wave.md`). 사용자는 Task 하나가 아니라 Wave 단위로 지시한다.
- Wave 구성은 `TASKS/WAVE_PLAN.md`, 진행 상태는 `TASKS/WAVE_STATE.json`이며 둘 다 `python3 scripts/build_waves.py`가 만든다(Wave ID는 이 두 파일이 정본, 직접 고치지 않는다). 상태 파일은 `/run-wave`(Wave 상태)와 `/implement-task`(자기 Task 항목)만 갱신한다. Task 하나는 `/prepare-task WXX <ID>`로 착수 판정 후 `/implement-task WXX <ID>`로 구현한다. 프로젝트 현재 상태 요약은 `docs/PROJECT_STATE.md`다(`/run-wave`가 Wave를 멈추거나 끝낼 때 갱신). `/run-wave status`로 현황을, `/run-wave dry-run WXX`로 실행 전 계획을 본다.
- Wave 안의 Task는 Depends On 순서(목록 Seq 순서)로 **한 번에 하나만** 구현한다. 서브에이전트를 병렬로 돌리지 않는다.
- 앞 Task의 Verify가 통과해야 다음 Task로 넘어간다.
- Page Owner Task가 있는 Wave가 끝나면 멈추고, 사람이 Vercel Preview(Desktop 1440·Mobile 390)를 확인한 뒤에 다음 화면 Wave로 진행한다.

## 구현 규칙

### 범위

1. 현재 Task 상세 §7 Expected Files 밖의 파일은 수정하거나 만들지 않는다. 필요하면 멈추고 Task 목록 변경을 요청한다.
2. `docs/PROJECT_SCOPE.md`에서 EXCLUDED인 기능을 임의로 구현하지 않는다. 예: 콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 행동 분석, 탈퇴 자동 삭제, 참가 요청 취소, 외부 Email 공급자, Monitoring.
3. Prisma 등 ORM, AWS SDK, EC2 등 AWS 인프라를 추가하지 않는다. 호스팅은 Vercel, DB·인증은 Supabase뿐이다.

### 화면

4. Page Owner Task는 Page Entry(`page.tsx`)에서 의존 Component를 실제로 조립한다. 하위 Component를 새로 만들거나 고치지 않는다(Component Task 소관).
5. Page Owner는 `UI_CONTRACT.md`의 영역 순서와 Task 상세의 최소 콘텐츠 수를 지킨다. Lorem ipsum·"준비 중"·"정보 확인 필요"·내용 없는 Card·큰 빈 영역을 금지한다. 데이터가 없으면 안내·이용 방법·CTA가 있는 Empty State를 보여 준다.
6. SCR-001(PAGE-SCR001)을 마칠 때 Next.js Starter(시작 문구, `next.svg`, Vercel 템플릿 링크)를 제거한다.
7. SCR-003(PAGE-SCR003)은 항공편(`tab=flight`)·숙소(`tab=hotel`)·동행 구하기(`tab=mate`) 탭을 모두 조립하고, 탭마다 입력·검증·완료 상태를 분리한다.
8. SCR-005(PAGE-SCR005)는 Guest·Member·Admin 상태를 조립하고, 역할에 없는 관리 영역은 렌더링하지 않는다.
9. 디자인 값은 D-001 토큰만 쓴다(흰 배경, 텍스트 `#222222`, CTA 코랄 `#CF4329`, Inter + 시스템 한글). Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI를 쓰지 않는다. 터치 영역 44px 이상, `:focus-visible` 표시.

### 데이터·보안

10. 항공·숙소 입력값(국가·도시·날짜)은 Client Component의 일시 상태에만 둔다. 서버·API·DB·URL(query 포함)·쿠키·`localStorage`·로그·분석으로 보내지 않는다. 외부 사이트는 query 없이 새 탭(`noopener,noreferrer`)으로 연다.
11. 여행지·안전정보·대표 콘텐츠는 `src/data`의 정적 TypeScript 데이터를 쓴다. DB에 넣지 않는다.
12. Supabase 쓰기는 Auth(프로필·성인 확인)·동행(모집글·참가 요청·차단)·신고·설정(`app_settings`) 범위로 제한한다. 테이블은 `profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings` 6개뿐이다.
13. 쓰기는 Browser Client(`src/lib/supabase/client.ts`)가 사용자 세션으로 하며 RLS를 우회하는 코드를 쓰지 않는다. Server Client는 읽기 전용이다.
14. Service Role Key를 Client 코드·`NEXT_PUBLIC_*` 변수·저장소에 두지 않는다. 클라이언트 환경변수는 `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`뿐이다.
15. 사용자 입력은 텍스트로 렌더링한다(`dangerouslySetInnerHTML` 금지). 브라우저 `alert`/`confirm`을 쓰지 않는다.

### 테스트

16. 단위 테스트는 Vitest(`src/**/*.test.ts`)로 작성한다.
17. Playwright는 Chromium 프로젝트의 핵심 Smoke만 작성한다(`e2e/*.spec.ts`, `--project=chromium`). Firefox·WebKit·부하 테스트·Lighthouse CI를 추가하지 않는다.

### Git

18. `git reset --hard`, `git push --force`, `git clean -f`, `git checkout -- .`, 브랜치 삭제처럼 되돌릴 수 없는 Git 명령을 사용자 요청 없이 쓰지 않는다.
19. Commit은 사용자가 요청할 때만 한다. Push·PR 생성·Merge를 하지 않는다. 자동 PR·자동 Merge를 설정하거나 실행하지 않는다. Production 배포는 사용자가 한다.

## Task 완료 순서

```
Task 읽기 → 입력 확인 → 구현 → 관련 포맷·Unit Test → 필요 시 Playwright → Diff 확인 → 완료 보고
```

| 단계 | 할 일 |
|---|---|
| Task 읽기 | `TASKS/TASK-<ID>.md` 14개 절 전체, 특히 §7 Expected Files·§8~§10 AC·§14 Forbidden |
| 입력 확인 | Depends On Task가 끝났는지, 필요한 파일·환경변수가 있는지 확인. 없으면 구현하지 않고 보고 (`docs/ARCHITECTURE.md` §12 착수 차단 참고) |
| 구현 | Expected Files 안에서만 작성 |
| 포맷·Unit Test | `npm run lint`, `npm run typecheck`, 해당 `npm run test:unit -- <경로>` (스크립트는 SETUP-PROJECT 이후 존재) |
| Playwright | Task Verify에 있을 때만 `npx playwright test <spec> --project=chromium` |
| Diff 확인 | `git diff --name-only`(및 새 파일 `git status --short`)가 Expected Files 안에 있는지 확인 |
| 완료 보고 | 아래 형식 |

완료 보고(한국어):

- **변경 파일:** 생성·수정한 파일 목록
- **검증 결과:** 실행한 명령과 결과(통과·실패 그대로)
- **남은 제한사항:** 충족하지 못한 AC, 확인하지 못한 항목, 다음 Task나 사람 확인(Preview 등)이 필요한 점

검증하지 않은 것을 통과했다고 쓰지 않는다. Task 완료 후 `docs/UIUX_TRACEABILITY.md`의 Status는 코드만 작성했으면 IMPLEMENTED, 테스트가 통과했으면 VERIFIED로 바꾼다.

## 문서·Task 검사

- `python3 scripts/validate_inputs.py` → `VALIDATE_INPUTS_PASS checks=11`
- `python3 scripts/audit_tasks.py` → `AUDIT_PASS checks=19`
- `python3 scripts/build_waves.py` → `BUILD_WAVES_PASS` (`TASK_DAG.md`·`WAVE_PLAN.md`·`WAVE_STATE.json`·Manifest `wave_id` 재생성, `--check`는 검사만)

Task 목록이나 상세 파일을 고치면 세 명령을 이 순서로 다시 실행한다. 목록 행을 바꾸면 상세 파일의 Task Row도 같은 내용으로 맞춘다.
