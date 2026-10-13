# Free Traveler Project State

| 항목 | 내용 |
|---|---|
| 기준일 | 2026-10-11 |
| 마지막 갱신 | 2026-10-13 — W08 completed (SCR-003 Preview 승인) |
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
| Current Wave | W08 completed(SCR-003 승인). 다음 Wave는 W09(SCR-004 동행 조회, 6개, PREVIEW) |
| Current Task | 없음 |
| Completed Tasks | 35 / 61 (W01 1, W02 7, W03 7, W04 5, W05 4, W06 3, W07 4, W08 4) |
| Blocked Tasks | 0 (Task 단위 `blocked` 기록 없음). 착수 차단 6건은 §4 참고(W03부터 필요) |
| Latest CI | 없음 — `.github/workflows/ci.yml` 미작성(SETUP-CI, W11). Git 원격 `origin` 연결됨(github.com/a01025915796-lily/free-traveler). 로컬: lint·typecheck·build PASS(2026-10-11, W01) |
| Supabase State | 원격 테스트 프로젝트 free-traveler(ap-northeast-1) link 완료(DEC-019). 마이그레이션 0001(6개 테이블)·0002(RLS, 정책 18개) 적용, seed 적용(app_settings 2건). 비로그인 API 검사 12항목 기대대로. 테스트 계정 3개 미생성(`docs/checks/TEST_ACCOUNTS.md` 절차, W11 전) |
| Vercel Preview URL | 없음 — Vercel 프로젝트 미연결(`.vercel` 없음). 연결 전 Page Owner Wave는 로컬 `npm run dev`로 확인 |
| Screen Checkpoints | 모두 PENDING (§2) |
| Playwright State | `@playwright/test` 1.64, Chromium headless 설치됨(W05 확인용). `playwright.config.ts`(chromium 하나). spec 3개는 W12 E2E Task가 만든다(FLOW-01~07). Chromium Smoke만(DEC-009) |
| Deferred Items | 7건 미결 (§3, #2는 DEC-016으로 해소) |
| Next Action | §5 |

## 2. Screen Checkpoints

| Checkpoint | Route | Page Owner | Wave | 확인 방법 | 상태 | 승인일 |
|---|---|---|---|---|---|---|
| SCR-001 | `/` | PAGE-SCR001 | W05 | Vercel Preview(연결 전에는 로컬 dev), Desktop 1440·Mobile 390 | APPROVED | 2026-10-11 |
| SCR-002 | `/about` | PAGE-SCR002 | W06 | Vercel Preview(연결 전에는 로컬 dev), Desktop 1440·Mobile 390 | APPROVED | 2026-10-12 |
| SCR-003 | `/travel-tools` | PAGE-SCR003 | W08 | Vercel Preview(연결 전에는 로컬 dev), Desktop 1440·Mobile 390 | APPROVED | 2026-10-13 |
| SCR-004 | `/mates` | PAGE-SCR004 | W09 | Vercel Preview(연결 전에는 로컬 dev), Desktop 1440·Mobile 390 | PENDING | - |
| SCR-005 | `/account` | PAGE-SCR005 | W10 | Vercel Preview(연결 전에는 로컬 dev), Desktop 1440·Mobile 390 | PENDING | - |
| FINAL | 5개 Route 전체 | RELEASE-CHECK | W13 | `/release-check` 판정 RELEASE_READY | PENDING | - |

상태 값은 `PENDING` → `WAITING_FOR_PREVIEW` → `APPROVED` 순서로 바뀐다. 수정 요청이 있으면 `CHANGES_REQUESTED`로 기록한다. FINAL은 `PENDING` → `RELEASE_READY` 또는 `RELEASE_BLOCKED`로 바뀐다. Production 배포는 사용자가 한다.

## 3. Deferred Items

| # | 항목 | 영향 | 필요한 결정·행동 | 기한 |
|---|---|---|---|---|
| 1 | ~~`supabase/config.toml` 배정~~ | 해소 (2026-10-11, DEC-019): A안 원격 테스트 프로젝트, DB-SCHEMA-BASE에 배정 | 없음 | 완료 |
| 2 | ~~E2E·Manual Task Requirement Ref에 없는 요구사항~~ | 해소 (2026-10-11, DEC-016): 11건을 E2E·MANUAL-CHECK·UNIT-MATE-STATE Ref에 연결 | 없음 | 완료 |
| 3 | DEC-015 Playwright 보류 | W05~W10 화면 요구사항은 IMPLEMENTED에 머문다 | W12 E2E Task 통과 후 VERIFIED로 바꾼다. 보류 목록은 각 Task의 `verify` 기록에 남는다 | W12 |
| 4 | `docs/PROJECT_SCOPE.md` §3·§8에 예전 Route 이름(`/plan`, `/auth`, `/my`)이 남아 있음 | 혼동 가능. 06·계약이 우선하므로 구현 영향 없음 | 문서 정리 여부를 사용자가 정한다 | 선택 |
| 5 | `src/data/safety.ts` 경보 단계·적용 범위·재외공관 링크가 작성자 지식 기반 초안(외교부 페이지 자동 대조 불가) | 잘못된 경보 표시 위험(RAC 안전정보) | 게시 전 외교부 해외안전여행 원문과 대조하고 `verifiedAt` 갱신 | 배포(W13) 전 |
| 6 | `src/data/curator.ts` 초안 문구(여행 이유·Timeline·기억 문장)와 빈 문의·SNS 값 (`CURATOR_CONTENT_CONFIRMED=false`) | 대표 확인 전 문구 | 대표(사용자)가 문구 확인·SNS 값 제공 | 배포 전 |
| 8 | 여행지 사진 품질 개선 — SCR-001 Preview에서 사용자가 "매력적이지 않은 사진이 많다"고 지적. 대상 여행지는 수정할 때 함께 정한다 | 메인·Drawer 첫인상 저하 | 사용자와 여행지별로 다시 고르기(DEC-018 범위 Commons PD·CC0 또는 라이선스 확인된 출처로 변경 검토). `src/data/destinations.ts`·`curator.ts` 이미지 교체, 출처 정책 바뀌면 DEC 추가 | 배포(W13) 전 |
| 7 | 공통 Header의 회원 아바타·닉네임 표시(04 §4.1)를 맡은 Task가 없음 | Header는 "계정" 링크만 표시 | 회원 표시가 필요하면 Task 추가 결정 | W10 전 |

## 4. 착수 차단 (`docs/ARCHITECTURE.md` §12)

Wave 번호는 `TASKS/WAVE_PLAN.md`(build_waves.py 생성) 기준이다. W01~W02는 이 항목과 무관하게 진행할 수 있다. #1·#3·#4는 W03(Supabase) 전, #2·#5는 W11(테스트·CI) 전, #6은 W13(배포) 전에 필요하다. #6을 일찍 해결하면 화면 Checkpoint를 Vercel Preview로 확인할 수 있다.

| # | 차단 | 현재 | 해결 주체 |
|---|---|---|---|
| 1 | `.env.local`(`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) | 해결 — 3개 값 입력, anon 키 확인 | - |
| 2 | 테스트 계정 3개(`E2E_USER_A_*`, `E2E_USER_B_*`, `E2E_ADMIN_*`) | 없음 — `docs/checks/TEST_ACCOUNTS.md` 절차로 생성(W11 전) | 사용자 |
| 3 | 원격 Supabase 테스트 프로젝트 + `supabase login` (DEC-019) | 해결 — free-traveler 생성, CLI 로그인·link 완료 | - |
| 4 | `supabase/config.toml` 배정 | 해결 — DB-SCHEMA-BASE (DEC-019) | - |
| 5 | Git 원격 저장소, `gh auth login` | 원격 연결됨, `gh` 로그인 미확인 | 사용자 |
| 6 | Vercel 프로젝트 연결 | 미연결 | 사용자 |

## 5. Next Action

1. `/run-wave W09` (SCR-004 동행 조회).
2. Deferred #6·#8 사용자 확인, W11 전 테스트 계정 3개 생성.

## 6. 변경 이력

| 날짜 | 변경 | 주체 |
|---|---|---|
| 2026-10-11 | 초기 작성. 모든 Wave·Task PENDING, Screen Checkpoint 6개 PENDING | Claude (사용자 요청) |
| 2026-10-11 | Task 감사 보완(DEC-016). Deferred #2 해소 | Claude (사용자 요청) |
| 2026-10-11 | `scripts/build_waves.py`로 Wave 재생성(13개, DEC-017). Checkpoint Wave 번호·착수 차단 시점 갱신 | Claude (사용자 요청) |
| 2026-10-11 | SETUP-PROJECT Expected Files에 `package-lock.json`·`.gitignore` 추가. W01 completed(SETUP-PROJECT) | `/run-wave W01` |
| 2026-10-11 | DEC-019 원격 Supabase(A안) 반영, Deferred #1 해소 | Claude (사용자 요청) |
| 2026-10-11 | W03 completed(7 Task). 원격 DB에 스키마·RLS·시드 적용 | `/run-wave W03` |
| 2026-10-11 | W05 Task 4개 완료, SCR-001 PREVIEW 대기 | `/run-wave W05` |
| 2026-10-11 | SCR-001 Preview 승인 → W05 completed. Deferred #8(사진 품질) 추가 | 사용자 승인, `/run-wave resume` |
| 2026-10-11 | W04 completed(5 Task). 검색 query 키를 계약(days·kind)에 맞춤, 해외 추천 6곳 바르셀로나로 정정 | `/run-wave W04` |
| 2026-10-11 | W02 completed(7 Task). DEC-018(Commons PD·CC0 사진), DATA-DESTINATIONS Expected Files에 `next.config.ts` 추가. Deferred #5~#7 추가 | `/run-wave W02` |
| 2026-10-12 | W06 Task 3개 완료, SCR-002 PREVIEW 대기 | `/run-wave W06` |
| 2026-10-12 | SCR-002 Preview 승인 → W06 completed | 사용자 승인 |
| 2026-10-12 | W07 completed(4 Task): 날짜·지역 검증, 외부 URL 허용목록, 연락처 탐지, SCR-003 공통 틀 | `/run-wave W07` |
| 2026-10-13 | W08 Task 4개 완료(항공·숙소·동행 작성·PAGE-SCR003), SCR-003 PREVIEW 대기 | `/run-wave W08` |
| 2026-10-13 | SCR-003 Preview 승인 → W08 completed | 사용자 승인 |
