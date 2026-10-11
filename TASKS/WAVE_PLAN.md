# Traveler Wave Plan

| 항목 | 내용 |
|---|---|
| 생성 | 2026-10-11T20:18:46+09:00 — `python3 scripts/build_waves.py` (직접 고치지 않는다. Task를 바꾸면 Script를 다시 실행한다) |
| 입력 | `TASKS/TASK_MANIFEST.csv`, Task 상세 파일, `design-reference/SCREEN_ROUTE_CONTRACT.json` |
| 진행 상태 | `TASKS/WAVE_STATE.json` |
| 실행 명령 | `/run-wave <Wave ID>` (`.claude/commands/run-wave.md`) |
| Wave 수 | 13 |
| Task 수 | 61 |

## 1. 규칙

- Wave ID는 이 파일과 `WAVE_STATE.json`이 정본이다. 다른 문서의 예전 Wave 번호보다 우선한다.
- Wave는 번호 순서로 진행한다. 앞 Wave가 `completed`여야 다음 Wave를 시작한다.
- Wave 안의 Task는 아래 표의 실행 순서(Task List Seq 순서)로 **한 번에 하나씩** 구현한다. 병렬 실행하지 않는다.
- 선행 Task는 항상 같은 Wave의 앞 순서나 이전 Wave에 있다. 같은 파일을 다루는 Task는 같은 Wave에 두지 않는다.
- Page Owner는 자기 Screen의 마지막 통합 Task다. Page Owner가 있는 Wave는 PREVIEW Checkpoint에서 멈춘다.
- PREVIEW 확인은 Vercel Preview URL로 한다. Vercel 연결 전에는 로컬 `npm run dev` 화면으로 확인한다.
- 선행 조건이 충족되지 않은 Wave는 시작하지 않고 `blocked`로 기록한다.
- 자동 재시도·자동 Branch·PR·Merge 기능은 없다. Commit은 사용자가 요청할 때만, Push·PR·Merge·배포는 사용자가 한다.

## 2. Wave 요약

| Wave | 그룹 | 이름 | Task 수 | Checkpoint | 선행 조건 |
|---|---:|---|---:|---|---|
| W01 | 1 | Scaffold·문서·Harness 확인 | 1 | 없음 | 없음 |
| W02 | 2 | 공통 UI·정적 데이터·Layout | 7 | 없음 | W01 completed |
| W03 | 3 | Supabase Auth·6개 Table·기본 RLS | 7 | 없음 | W02 completed + 착수 차단 해결(`docs/ARCHITECTURE.md` §12): `.env.local`, Docker 또는 원격 테스트 프로젝트, `supabase/config.toml` 배정 |
| W04 | 4 | SCR-001 메인 (1/2) | 5 | 없음 | W03 completed |
| W05 | 4 | SCR-001 메인 (2/2) | 4 | PREVIEW — 사람이 Desktop 1440·Mobile 390 확인 후 승인 | W04 completed |
| W06 | 5 | SCR-002 대표 소개 | 3 | PREVIEW — 사람이 Desktop 1440·Mobile 390 확인 후 승인 | W05 completed(Checkpoint 승인) |
| W07 | 6 | SCR-003 여행 입력·외부 이동·동행글 입력 (1/2) | 4 | 없음 | W06 completed(Checkpoint 승인) |
| W08 | 6 | SCR-003 여행 입력·외부 이동·동행글 입력 (2/2) | 4 | PREVIEW — 사람이 Desktop 1440·Mobile 390 확인 후 승인 | W07 completed |
| W09 | 7 | SCR-004 동행 목록·상세·신청 | 6 | PREVIEW — 사람이 Desktop 1440·Mobile 390 확인 후 승인 | W08 completed(Checkpoint 승인) |
| W10 | 8 | SCR-005 계정·내 활동·간단 관리자 | 5 | PREVIEW — 사람이 Desktop 1440·Mobile 390 확인 후 승인 | W09 completed(Checkpoint 승인) |
| W11 | 9 | Unit·Playwright·접근성·CI (1/2) | 6 | 없음 | W10 completed(Checkpoint 승인) + 테스트 계정 3개(`E2E_USER_A_*`, `E2E_USER_B_*`, `E2E_ADMIN_*`), Git 원격 저장소·`gh auth login`(CI 확인) |
| W12 | 9 | Unit·Playwright·접근성·CI (2/2) | 6 | 없음 | W11 completed |
| W13 | 10 | Vercel Preview·Release 확인 | 3 | RELEASE — `/release-check` 판정 후 사용자가 Production 배포 | W12 completed + Vercel 프로젝트 연결 |

## 3. Wave별 Task (실행 순서)

| Wave | 순서 | Seq | Task | Category | Screen | Depends On |
|---|---:|---:|---|---|---|---|
| W01 | 1 | 1 | SETUP-PROJECT | Setup | 없음 | - |
| W02 | 1 | 3 | GLOBAL-DESIGN-TOKENS | Global | 공통 | SETUP-PROJECT |
| W02 | 2 | 4 | GLOBAL-UI-KIT | Global | 공통 | GLOBAL-DESIGN-TOKENS |
| W02 | 3 | 5 | GLOBAL-LAYOUT | Global | 공통 | GLOBAL-DESIGN-TOKENS, GLOBAL-UI-KIT |
| W02 | 4 | 6 | DATA-DESTINATIONS | Data | 없음 | SETUP-PROJECT |
| W02 | 5 | 7 | DATA-SAFETY | Data | 없음 | DATA-DESTINATIONS |
| W02 | 6 | 8 | DATA-REPRESENTATIVE | Data | 없음 | DATA-DESTINATIONS |
| W02 | 7 | 22 | TECH-ERROR-PAGES | Tech Route | 없음 | GLOBAL-LAYOUT |
| W03 | 1 | 9 | DB-SCHEMA-BASE | DB | 없음 | SETUP-PROJECT |
| W03 | 2 | 10 | DB-RLS-BASE | DB | 없음 | DB-SCHEMA-BASE |
| W03 | 3 | 11 | DB-SEED-BASE | DB | 없음 | DB-RLS-BASE |
| W03 | 4 | 12 | AUTH-SUPABASE | Auth | 없음 | SETUP-PROJECT, DB-SCHEMA-BASE |
| W03 | 5 | 13 | LOGIC-MATE-STATE | Logic | 없음 | SETUP-PROJECT |
| W03 | 6 | 14 | DB-ACCESS | DB | 없음 | DB-RLS-BASE, AUTH-SUPABASE, LOGIC-MATE-STATE |
| W03 | 7 | 21 | TECH-AUTH-CALLBACK | Tech Route | 없음 | AUTH-SUPABASE, GLOBAL-LAYOUT |
| W04 | 1 | 15 | LOGIC-SEARCH-FILTER | Logic | 없음 | DATA-DESTINATIONS, DATA-SAFETY |
| W04 | 2 | 19 | LOGIC-SAFETY-STALE | Logic | 없음 | DATA-SAFETY |
| W04 | 3 | 20 | LOGIC-FAVORITES-SHARE | Logic | 없음 | SETUP-PROJECT |
| W04 | 4 | 23 | COMP-SCR001-SEARCH | Component | SCR-001 | GLOBAL-UI-KIT, LOGIC-SEARCH-FILTER, LOGIC-FAVORITES-SHARE |
| W04 | 5 | 24 | COMP-SCR001-DESTINATIONS | Component | SCR-001 | GLOBAL-UI-KIT, DATA-DESTINATIONS, LOGIC-FAVORITES-SHARE |
| W05 | 1 | 25 | COMP-SCR001-DESTINATION-DRAWER | Component | SCR-001 | GLOBAL-UI-KIT, DATA-DESTINATIONS, LOGIC-SEARCH-FILTER, LOGIC-FAVORITES-SHARE |
| W05 | 2 | 26 | COMP-SCR001-SAFETY | Component | SCR-001 | GLOBAL-UI-KIT, DATA-SAFETY, LOGIC-SAFETY-STALE |
| W05 | 3 | 27 | COMP-SCR001-MATES-CURATOR | Component | SCR-001 | GLOBAL-UI-KIT, DB-ACCESS, DATA-REPRESENTATIVE |
| W05 | 4 | 43 | PAGE-SCR001 | Page Owner | SCR-001 | GLOBAL-LAYOUT, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE, DB-ACCESS, COMP-SCR001-SEARCH, COMP-SCR001-DESTINATIONS, COMP-SCR001-DESTINATION-DRAWER, COMP-SCR001-SAFETY, COMP-SCR001-MATES-CURATOR |
| W06 | 1 | 28 | COMP-SCR002-PROFILE | Component | SCR-002 | GLOBAL-UI-KIT, DATA-REPRESENTATIVE |
| W06 | 2 | 29 | COMP-SCR002-COUNTRIES-GALLERY | Component | SCR-002 | GLOBAL-UI-KIT, DATA-REPRESENTATIVE, DATA-SAFETY |
| W06 | 3 | 44 | PAGE-SCR002 | Page Owner | SCR-002 | GLOBAL-LAYOUT, DATA-REPRESENTATIVE, COMP-SCR002-PROFILE, COMP-SCR002-COUNTRIES-GALLERY |
| W07 | 1 | 16 | LOGIC-TRAVEL-DATES | Logic | 없음 | DATA-DESTINATIONS |
| W07 | 2 | 17 | LOGIC-OUTBOUND-URL | Logic | 없음 | SETUP-PROJECT |
| W07 | 3 | 18 | LOGIC-CONTACT-DETECTION | Logic | 없음 | SETUP-PROJECT |
| W07 | 4 | 30 | COMP-SCR003-SHELL | Component | SCR-003 | GLOBAL-UI-KIT |
| W08 | 1 | 31 | COMP-SCR003-FLIGHT | Component | SCR-003 | GLOBAL-UI-KIT, LOGIC-TRAVEL-DATES, LOGIC-OUTBOUND-URL, DB-ACCESS |
| W08 | 2 | 32 | COMP-SCR003-HOTEL | Component | SCR-003 | GLOBAL-UI-KIT, LOGIC-TRAVEL-DATES, LOGIC-OUTBOUND-URL, DB-ACCESS, COMP-SCR003-FLIGHT |
| W08 | 3 | 33 | COMP-SCR003-MATE-COMPOSE | Component | SCR-003 | GLOBAL-UI-KIT, AUTH-SUPABASE, DB-ACCESS, LOGIC-CONTACT-DETECTION, LOGIC-TRAVEL-DATES, LOGIC-MATE-STATE |
| W08 | 4 | 45 | PAGE-SCR003 | Page Owner | SCR-003 | GLOBAL-LAYOUT, DB-ACCESS, COMP-SCR003-SHELL, COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL, COMP-SCR003-MATE-COMPOSE |
| W09 | 1 | 34 | COMP-SCR004-FILTER-LIST | Component | SCR-004 | GLOBAL-UI-KIT, DB-ACCESS, COMP-SCR001-MATES-CURATOR |
| W09 | 2 | 35 | COMP-SCR004-DETAIL | Component | SCR-004 | GLOBAL-UI-KIT, DB-ACCESS, LOGIC-FAVORITES-SHARE |
| W09 | 3 | 36 | COMP-SCR004-APPLY | Component | SCR-004 | GLOBAL-UI-KIT, DB-ACCESS, AUTH-SUPABASE, LOGIC-MATE-STATE |
| W09 | 4 | 37 | COMP-SCR004-REPORT-BLOCK | Component | SCR-004 | GLOBAL-UI-KIT, DB-ACCESS |
| W09 | 5 | 38 | COMP-SCR004-GUIDES | Component | SCR-004 | GLOBAL-UI-KIT |
| W09 | 6 | 46 | PAGE-SCR004 | Page Owner | SCR-004 | GLOBAL-LAYOUT, DB-ACCESS, COMP-SCR004-FILTER-LIST, COMP-SCR004-DETAIL, COMP-SCR004-APPLY, COMP-SCR004-REPORT-BLOCK, COMP-SCR004-GUIDES |
| W10 | 1 | 39 | COMP-SCR005-AUTH | Component | SCR-005 | GLOBAL-UI-KIT, AUTH-SUPABASE |
| W10 | 2 | 40 | COMP-SCR005-PROFILE | Component | SCR-005 | GLOBAL-UI-KIT, AUTH-SUPABASE, DB-ACCESS |
| W10 | 3 | 41 | COMP-SCR005-ACTIVITY | Component | SCR-005 | GLOBAL-UI-KIT, DB-ACCESS, LOGIC-MATE-STATE |
| W10 | 4 | 42 | COMP-SCR005-ADMIN | Component | SCR-005 | GLOBAL-UI-KIT, DB-ACCESS, LOGIC-OUTBOUND-URL |
| W10 | 5 | 47 | PAGE-SCR005 | Page Owner | SCR-005 | GLOBAL-LAYOUT, AUTH-SUPABASE, DB-ACCESS, COMP-SCR005-AUTH, COMP-SCR005-PROFILE, COMP-SCR005-ACTIVITY, COMP-SCR005-ADMIN |
| W11 | 1 | 2 | SETUP-CI | CI | 없음 | SETUP-PROJECT |
| W11 | 2 | 48 | UNIT-TRAVEL-DATES | Unit Test | 없음 | LOGIC-TRAVEL-DATES |
| W11 | 3 | 49 | UNIT-CONTACT-DETECTION | Unit Test | 없음 | LOGIC-CONTACT-DETECTION |
| W11 | 4 | 50 | UNIT-MATE-STATE | Unit Test | 없음 | LOGIC-MATE-STATE |
| W11 | 5 | 51 | UNIT-CONTENT-DATA | Unit Test | 없음 | DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE |
| W11 | 6 | 52 | UNIT-SEARCH-STALE | Unit Test | 없음 | LOGIC-SEARCH-FILTER, LOGIC-SAFETY-STALE |
| W12 | 1 | 53 | UNIT-OUTBOUND-FAVORITES | Unit Test | 없음 | LOGIC-OUTBOUND-URL, LOGIC-FAVORITES-SHARE |
| W12 | 2 | 54 | UNIT-ROUTE-CONTRACT | Unit Test | 없음 | PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, TECH-AUTH-CALLBACK, TECH-ERROR-PAGES |
| W12 | 3 | 55 | TEST-RLS-BASIC | Integration Test | 없음 | DB-RLS-BASE, DB-SEED-BASE, DB-ACCESS |
| W12 | 4 | 56 | E2E-PUBLIC-SMOKE | E2E Test | 없음 | PAGE-SCR001, PAGE-SCR002, PAGE-SCR004, TECH-ERROR-PAGES, PAGE-SCR003, PAGE-SCR005 |
| W12 | 5 | 57 | E2E-TRAVEL-TOOLS | E2E Test | 없음 | PAGE-SCR003, DB-SEED-BASE |
| W12 | 6 | 58 | E2E-MATE-AUTH | E2E Test | 없음 | PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, DB-SEED-BASE |
| W13 | 1 | 59 | DEPLOY-VERCEL-SUPABASE | Deploy | 없음 | SETUP-CI, DB-SEED-BASE, AUTH-SUPABASE |
| W13 | 2 | 60 | MANUAL-CHECK | Manual Check | 없음 | PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, TECH-AUTH-CALLBACK, DEPLOY-VERCEL-SUPABASE |
| W13 | 3 | 61 | RELEASE-CHECK | Release | 없음 | UNIT-ROUTE-CONTRACT, TEST-RLS-BASIC, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, MANUAL-CHECK, DEPLOY-VERCEL-SUPABASE, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, UNIT-CONTENT-DATA, UNIT-SEARCH-STALE, UNIT-OUTBOUND-FAVORITES |

## 4. Page Owner 위치

| Screen | Page Owner | Wave | Wave 안 순서 |
|---|---|---|---|
| SCR-001 | PAGE-SCR001 | W05 | 4/4 (마지막) |
| SCR-002 | PAGE-SCR002 | W06 | 3/3 (마지막) |
| SCR-003 | PAGE-SCR003 | W08 | 4/4 (마지막) |
| SCR-004 | PAGE-SCR004 | W09 | 6/6 (마지막) |
| SCR-005 | PAGE-SCR005 | W10 | 5/5 (마지막) |

## 5. 경고

- W01 Scaffold·문서·Harness 확인: Task 1개 (기본 4~7개보다 적음 — 그룹 Task 수가 적어 그대로 둠)
- W06 SCR-002 대표 소개: Task 3개 (기본 4~7개보다 적음 — 그룹 Task 수가 적어 그대로 둠)
- W13 Vercel Preview·Release 확인: Task 3개 (기본 4~7개보다 적음 — 그룹 Task 수가 적어 그대로 둠)
