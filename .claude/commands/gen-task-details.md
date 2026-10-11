---
description: TASKS/00_TASK_LIST.md의 각 구현 Task를 TASKS/TASK-<Task ID>.md 상세 파일로 만들고 전체 감사를 통과시킨다
argument-hint: "[Task ID ...]  (생략하면 전체)"
---

## 공통 원칙

- 먼저 Skill 도구로 `traveler-project-pipeline`을 불러오고 그 규칙(§1~§12)을 따른다. 형식은 Skill §4.2다.
- 각 절은 **실제 파일을 Read로 읽어서** 쓴다. Task Row는 목록 파일에서 복사하고, Design Ref·Requirement 요지·Verify 명령은 해당 문서에서 확인한 값만 쓴다. 읽지 못한 파일이 있으면 멈추고 보고한다.
- 구현 코드를 만들지 않는다. `src/`, `supabase/`, `e2e/`, `.github/`, 설정 파일, `package.json`을 만들거나 고치지 않는다. Branch·Commit·Issue도 만들지 않는다.
- Task Audit 실패를 무시하지 않는다. `AUDIT_FAIL`이면 완료로 보고하지 않는다. 감사를 통과시키려고 `scripts/*.py`나 입력 문서를 고치지 않는다.

이 명령이 쓰는 파일은 `TASKS/TASK-<Task ID>.md`다. Script가 `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md`를 다시 쓴다. `TASKS/00_TASK_LIST.md`는 고치지 않는다. 목록에 문제가 있으면 멈추고 `/gen-tasklist --force`를 안내한다.

## 순서

1. **사전 검사** — `python3 scripts/validate_inputs.py`와 `python3 scripts/audit_tasks.py --list-only`를 실행한다. 어느 쪽이든 FAIL이면 멈춘다. Task List에서 중복 ID·빈 필수 열·없는 Depends On을 먼저 확인한다.
2. **대상** — `$ARGUMENTS`의 Task ID, 없으면 목록 전체(Seq 순서)다.
   - 목록에 없는 ID를 받으면 멈추고 알린다.
   - EXCLUDED 요구사항에는 상세 파일을 만들지 않는다(Skill §11).
   - 같은 ID 파일이 있으면 새로 만들지 않고 갱신한다. `TASKS/WAVE_STATE.json`에서 그 Task가 `completed`면 사용자 확인을 받은 뒤에만 고친다.
3. **입력 읽기** — 대상 Task마다 다음을 실제로 읽는다.
   - `TASKS/00_TASK_LIST.md`의 머리행·구분행·그 Task 행
   - `docs/06_SRS_UIUX_REVISED.md`의 Requirement 행과 §8 테스트 ID
   - Screen Task면 다음 4개
     - `design-reference/UI_CONTRACT.md` 해당 절
     - `docs/04_UIUX_PLAN.md` 해당 절
     - `docs/05_UIUX_APPROVED.md`의 Stitch ID
     - `design-reference/D-001/DESIGN.md`
   - `docs/ARCHITECTURE.md`의 관련 절, `TASKS/INPUT_SNAPSHOT.json`의 파일 트리
4. **작성** — Skill §4.2 형식(14절)으로 쓴다.
   - `## Task Row`에 목록 머리행과 그 행을 글자 그대로 복사한다.
   - §3에는 06의 요지와 구현 기준을, §5에는 UI_CONTRACT 절·04 계획 절·Stitch ID·D-001 절을 쓴다.
   - §7은 스냅숏 트리 기준으로 생성·수정을 나누고 "이 목록 밖의 파일은 수정하지 않는다"를 적는다.
   - §8~§10에는 목록 행의 AC를 빠짐없이 담아 구체화한다. 목록에 있는 조건을 상세에서 빼지 않는다.
   - §12 Verify에는 실제 실행 명령을 적는다. 테스트 Task 이름만 적지 않는다.
   - §14에 "Expected Files 밖 파일을 수정하지 않는다"를 넣는다.
   - Page Owner는 Skill §5에 따라 범위를 Page Entry 조립으로 한정한다. §9에 Section 순서 표·`| 항목 | 최소 수 |` 표·반응형 밀도를 넣는다.
   - DB Task는 6개 테이블을 넘지 않는다(§6). 외부 입력 Task는 §10에 비저장 AC를 넣는다(§7).
5. **대조와 감사** — Task List 구현 ID와 `TASK-*.md` 파일명을 1:1로 대조한 뒤 `python3 scripts/audit_tasks.py`(전체)를 실행한다. FAIL이면 **상세 파일을** 고치고 다시 실행한다. 원인이 목록 쪽이거나 같은 Check가 3번 연속 FAIL이면 멈추고 보고한다.
6. **보고(한국어)**
   - 만들거나 갱신한 파일 수와 Task ID
   - 1:1 대조 결과(빠진 파일·남는 파일)
   - 감사 결과 줄 원문
   - 감사가 FAIL이면 "완료"라고 쓰지 않는다. 실패 Check·대표 오류·남은 작업을 그대로 적는다.
