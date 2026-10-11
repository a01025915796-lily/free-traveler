# Free Traveler Project State

| 항목 | 내용 |
|---|---|
| 기준일 | 2026-10-11 |
| 마지막 갱신 | 2026-10-11 — 초기 작성 (구현 착수 전) |
| 갱신 주체 | `/run-wave`가 Wave 실행·Checkpoint·resume이 끝날 때 갱신한다. `/release-check --record`가 FINAL을 갱신한다. 사람이 고쳐도 되지만, Task·Wave 상태의 정본은 `TASKS/WAVE_STATE.json`이다 |

이 문서는 프로젝트 현재 상태를 한 장으로 요약한다. 다른 문서와 다르면 다음 정본을 따른다.
- Task·Wave 상태: `TASKS/WAVE_STATE.json`
- 요구사항 Status: `docs/UIUX_TRACEABILITY.md`
- 결정: `docs/DECISION_LOG.md`

## 1. 상태 요약

| 필드 | 값 |
|---|---|
| Harness Schema | `traveler-screen-route-v1` (`design-reference/SCREEN_ROUTE_CONTRACT.json`) |
| Design Version | D-001 `1.0.0` LOCKED (2026-10-09), `design-reference/D-001/DESIGN.md` sha256 `6282ae1e…fcec4` |
| Scope Mode | IMPLEMENT/EXCLUDED — 요구사항 114건 중 IMPLEMENT 88, EXCLUDED 26 (`docs/PROJECT_SCOPE.md` §9·§10, DEC-014) |
| Current Wave | 없음 — 아직 시작한 Wave 없음. 다음 Wave는 W01 |
| Current Task | 없음 |
| Completed Tasks | 0 / 61 |
| Blocked Tasks | 0 (Task 단위 `blocked` 기록 없음). 착수 차단 6건은 §4 참고(W03부터 필요) |
| Latest CI | 없음 — `.github/workflows/ci.yml` 미작성(SETUP-CI, W11), Git 원격 없음 |
| Supabase State | 미구성 — Supabase 프로젝트·`.env.local` 없음, `supabase/` 디렉터리 없음, 마이그레이션 미작성. Supabase CLI는 설치됨, Docker 없음 |
| Vercel Preview URL | 없음 — Vercel 프로젝트 미연결(`.vercel` 없음). 연결 전 Page Owner Wave는 로컬 `npm run dev`로 확인 |
| Screen Checkpoints | 모두 PENDING (§2) |
| Playwright State | 미설치·spec 없음 — `playwright.config.ts`는 SETUP-PROJECT(W01), spec 3개는 W12 E2E Task가 만든다(핵심 흐름 FLOW-01~07). Chromium Smoke만 (DEC-009) |
| Deferred Items | 3건 미결 (§3, #2는 DEC-016으로 해소) |
| Next Action | §5 |

## 2. Screen Checkpoints

| Checkpoint | Route | Page Owner | Wave | 확인 방법 | 상태 | 승인일 |
|---|---|---|---|---|---|---|
| SCR-001 | `/` | PAGE-SCR001 | W05 | Vercel Preview(연결 전에는 로컬 dev), Desktop 1440·Mobile 390 | PENDING | - |
| SCR-002 | `/about` | PAGE-SCR002 | W06 | Vercel Preview(연결 전에는 로컬 dev), Desktop 1440·Mobile 390 | PENDING | - |
| SCR-003 | `/travel-tools` | PAGE-SCR003 | W08 | Vercel Preview(연결 전에는 로컬 dev), Desktop 1440·Mobile 390 | PENDING | - |
| SCR-004 | `/mates` | PAGE-SCR004 | W09 | Vercel Preview(연결 전에는 로컬 dev), Desktop 1440·Mobile 390 | PENDING | - |
| SCR-005 | `/account` | PAGE-SCR005 | W10 | Vercel Preview(연결 전에는 로컬 dev), Desktop 1440·Mobile 390 | PENDING | - |
| FINAL | 5개 Route 전체 | RELEASE-CHECK | W13 | `/release-check` 판정 RELEASE_READY | PENDING | - |

상태 값은 `PENDING` → `WAITING_FOR_PREVIEW` → `APPROVED` 순서로 바뀐다. 수정 요청이 있으면 `CHANGES_REQUESTED`로 기록한다. FINAL은 `PENDING` → `RELEASE_READY` 또는 `RELEASE_BLOCKED`로 바뀐다. Production 배포는 사용자가 한다.

## 3. Deferred Items

| # | 항목 | 영향 | 필요한 결정·행동 | 기한 |
|---|---|---|---|---|
| 1 | `supabase/config.toml`이 어느 Task에도 배정되지 않음 | DB-SCHEMA-BASE의 로컬 검증(`supabase db reset`) 불가 | 사용자 결정 필요. 방법 (a) DB-SCHEMA-BASE Expected Files에 추가, 방법 (b) Verify를 원격 테스트 프로젝트 `supabase db push` 기준으로 변경 | W05 전 |
| 2 | ~~E2E·Manual Task Requirement Ref에 없는 요구사항~~ | 해소 (2026-10-11, DEC-016): 11건을 E2E·MANUAL-CHECK·UNIT-MATE-STATE Ref에 연결 | 없음 | 완료 |
| 3 | DEC-015 Playwright 보류 | W05~W10 화면 요구사항은 IMPLEMENTED에 머문다 | W12 E2E Task 통과 후 VERIFIED로 바꾼다. 보류 목록은 각 Task의 `verify` 기록에 남는다 | W12 |
| 4 | `docs/PROJECT_SCOPE.md` §3·§8에 예전 Route 이름(`/plan`, `/auth`, `/my`)이 남아 있음 | 혼동 가능. 06·계약이 우선하므로 구현 영향 없음 | 문서 정리 여부를 사용자가 정한다 | 선택 |

## 4. 착수 차단 (`docs/ARCHITECTURE.md` §12)

Wave 번호는 `TASKS/WAVE_PLAN.md`(build_waves.py 생성) 기준이다. W01~W02는 이 항목과 무관하게 진행할 수 있다. #1·#3·#4는 W03(Supabase) 전, #2·#5는 W11(테스트·CI) 전, #6은 W13(배포) 전에 필요하다. #6을 일찍 해결하면 화면 Checkpoint를 Vercel Preview로 확인할 수 있다.

| # | 차단 | 현재 | 해결 주체 |
|---|---|---|---|
| 1 | `.env.local`(`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) | 없음 | 사용자 |
| 2 | 테스트 계정 3개(`E2E_USER_A_*`, `E2E_USER_B_*`, `E2E_ADMIN_*`) | 없음 | 사용자 |
| 3 | Docker 또는 원격 테스트 프로젝트 | Docker 없음 | 사용자 (Deferred #1과 함께 결정) |
| 4 | `supabase/config.toml` 배정 | 미배정 | 사용자 결정 → Task 수정 |
| 5 | Git 원격 저장소, `gh auth login` | 원격 없음, 미로그인 | 사용자 |
| 6 | Vercel 프로젝트 연결 | 미연결 | 사용자 |

## 5. Next Action

1. (권장) 지금까지 만든 하네스 문서(`.claude/`, `CLAUDE.md`, `TASKS/`, `docs/`, `design-reference/`, `scripts/`)를 사용자가 Commit한다. 하지 않아도 W01은 진행할 수 있다(prepare-task에서는 WARN).
2. `/run-wave dry-run W01`로 실행 계획을 확인한다.
3. `/run-wave W01`을 실행한다(SETUP-PROJECT 1개). 이어서 W02(공통 UI·정적 데이터·Layout 7개).
4. W03(Supabase) 전에 §4 착수 차단 #1·#3·#4와 Deferred #1을 해결한다.

## 6. 변경 이력

| 날짜 | 변경 | 주체 |
|---|---|---|
| 2026-10-11 | 초기 작성. 모든 Wave·Task PENDING, Screen Checkpoint 6개 PENDING | Claude (사용자 요청) |
| 2026-10-11 | Task 감사 보완(DEC-016). Deferred #2 해소 | Claude (사용자 요청) |
| 2026-10-11 | `scripts/build_waves.py`로 Wave 재생성(13개, DEC-017). Checkpoint Wave 번호·착수 차단 시점 갱신 | Claude (사용자 요청) |
