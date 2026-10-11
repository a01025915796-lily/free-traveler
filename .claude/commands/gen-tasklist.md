---
description: Traveler 구현 Task 목록(TASKS/00_TASK_LIST.md)을 만들고 감사한다
argument-hint: "[--force]  (기존 목록을 덮어쓸 때만)"
---

## 공통 원칙

- 먼저 Skill 도구로 `traveler-project-pipeline`을 불러오고 그 규칙(§1~§12)을 따른다. 형식은 Skill §4.1이다.
- 입력은 **실제 파일을 Read로 읽어서** 쓴다. 기억·이전 대화·추정으로 Requirement ID·Route·파일 경로를 채우지 않는다. 읽지 못한 파일이 있으면 멈추고 보고한다.
- 구현 코드를 만들지 않는다. `src/`, `supabase/`, `e2e/`, `.github/`, 설정 파일, `package.json`을 만들거나 고치지 않는다. Branch·Commit·Issue도 만들지 않는다.
- Task Audit 실패를 무시하지 않는다. `AUDIT_FAIL`이면 완료로 보고하지 않는다. 감사를 통과시키려고 `scripts/*.py`나 입력 문서(06·PROJECT_SCOPE·계약·UI_CONTRACT)를 고치지 않는다.

이 명령이 쓰는 파일은 `TASKS/00_TASK_LIST.md`와 `docs/UIUX_TRACEABILITY.md`의 Task·Test 열이다. Script가 `TASKS/INPUT_SNAPSHOT.json`, `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md`를 다시 쓴다.

## 순서

1. **입력 검증** — `python3 scripts/validate_inputs.py`를 실행한다. `VALIDATE_INPUTS_FAIL`이면 누락 파일·Screen·Requirement ID를 보고하고 멈춘다. 입력 문서를 임의로 만들거나 고치지 않는다.
2. **기존 파일** — `TASKS/00_TASK_LIST.md`가 있고 `$ARGUMENTS`에 `--force`가 없으면 덮어쓰지 않고 사용자에게 묻는다. 목록을 바꾸면 `TASKS/TASK-*.md`의 Task Row와 `python3 scripts/build_waves.py`로 `TASKS/WAVE_PLAN.md`·`TASKS/WAVE_STATE.json`·`TASK_DAG.md`도 다시 만들어야 한다고 알린다. `WAVE_STATE.json`에서 `completed`인 Task의 행을 바꾸려면 먼저 사용자 확인을 받는다.
3. **입력 읽기** — 다음 파일을 실제로 읽는다.
   - `TASKS/INPUT_SNAPSHOT.json`(현재 `package.json`·`src/app` 트리)
   - `design-reference/SCREEN_ROUTE_CONTRACT.json`, `design-reference/UI_CONTRACT.md`
   - `docs/06_SRS_UIUX_REVISED.md` §2·§4·§5·§6·§7·§8
   - `docs/PROJECT_SCOPE.md` §5·§6·§9·§10
   - `docs/ARCHITECTURE.md`, `docs/DECISION_LOG.md`
4. **목록 작성** — Skill §4.1 형식(16열)으로 쓴다.
   - Seq는 Foundation → Screen별 Component → Page Owner → Test → Deploy·Release 순서로 매긴다. 의존 Task는 항상 앞 Seq에 둔다.
   - 다음 Task와 AC를 넣는다.
     - Screen마다 Page Owner 하나(Skill §5)
     - DB는 Schema·RLS·Access·Seed와 6개 테이블(§6)
     - 외부 입력 비저장 AC(§7)
     - Auth·성인·RLS AC(§8)
     - Playwright Chromium Smoke(§9)
   - Expected Files는 스냅숏의 실제 트리를 보고 정한다.
   - IMPLEMENT 88건은 구현 Task와 테스트·확인 Task에 모두 연결한다. EXCLUDED 26건은 Task List §4 NON_IMPLEMENTATION에 근거·후속 방향과 함께 적는다(Skill §3·§11).
   - 상단에 Task 수와 Category별 수를 요약한다. Task 개수를 완료 조건으로 쓰지 않는다.
5. **목록 감사** — `python3 scripts/audit_tasks.py --list-only`를 실행한다. FAIL이면 **목록을** 고치고 다시 실행한다. 같은 Check가 3번 연속 FAIL이거나 원인이 입력 문서로 보이면 멈추고, 원인과 함께 보고한다.
6. **추적표** — `docs/UIUX_TRACEABILITY.md`의 Task·Test 열을 목록과 `TASKS/TASK_MANIFEST.csv`에서 다시 만든다. Status 열은 바꾸지 않는다.
7. **보고(한국어)**
   - Task 수(Category별), Screen별 Component·Page Owner
   - 감사 결과 줄 원문(`AUDIT_PASS checks=19` 또는 `AUDIT_FAIL …`)
   - 상세 파일이 아직 없거나 목록과 맞지 않으면 다음 단계로 `/gen-task-details`를 안내한다.
   - 빠진 Requirement ID가 있거나 감사가 FAIL이면 "완료"라고 쓰지 않는다. 실패 Check와 남은 문제를 그대로 적는다.
