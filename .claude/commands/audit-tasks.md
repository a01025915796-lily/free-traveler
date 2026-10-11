---
description: Traveler Task 목록·상세 파일을 감사하고 결과를 보고한다 (읽기 전용)
argument-hint: "[--list-only]"
---

## 공통 원칙

- 먼저 Skill 도구로 `traveler-project-pipeline`을 불러온다. 감사 기준은 Skill §4.3(F01~F19)이다.
- 결과는 **Script를 실제로 실행하고, 그 출력과 `TASKS/TASK_AUDIT_REPORT.md`를 읽어서** 보고한다. 이전 실행 결과나 추정으로 PASS를 보고하지 않는다.
- 구현 코드를 만들지 않는다. 이 명령은 Task 파일·입력 문서·코드를 고치지 않는다.
- Task Audit 실패를 무시하지 않는다. FAIL을 경고나 사소한 문제로 낮춰 쓰지 않고, 실패한 Check를 모두 보고한다. Script를 고치거나 검사를 건너뛰어 PASS를 만들지 않는다.

Script가 다시 쓰는 파일은 `TASKS/TASK_MANIFEST.csv`와 `TASKS/TASK_AUDIT_REPORT.md`뿐이다. 입력 검증은 `--no-snapshot`으로 실행해 `TASKS/INPUT_SNAPSHOT.json`을 바꾸지 않는다.

## 순서

1. **입력 검증** — `python3 scripts/validate_inputs.py --no-snapshot`을 실행한다. FAIL이면 결과를 보고하고 멈춘다.
2. **감사** — `python3 scripts/audit_tasks.py $ARGUMENTS`를 실행한다. `--list-only`면 상세 파일이 필요한 검사를 생략한다. 이때 보고에 "상세 파일 검사 생략"을 적고, 이 결과를 전체 감사 결과로 쓰지 않는다.
3. **결과 읽기** — 출력 마지막 줄과 `TASKS/TASK_AUDIT_REPORT.md`를 읽는다. Script가 예외 등으로 비정상 종료하면 그 출력을 그대로 보고한다.
4. **보고(한국어)**
   - 마지막 줄 원문(`AUDIT_PASS checks=N` 또는 `AUDIT_FAIL failed=F checks=N`)
   - FAIL인 Check마다 ID, 내용, 대표 오류 3개까지
   - 고치는 방법
     - 목록 문제: `/gen-tasklist --force`
     - 상세 문제: `/gen-task-details <Task ID>`
     - 입력 문서 문제: 사용자 결정 필요
   - FAIL이 있으면 `/run-wave`를 진행하지 말라고 적는다.
   - 갱신된 파일: `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md`
5. 사용자가 요청하기 전에는 `TASKS/`의 목록·상세·Wave 파일과 입력 문서를 수정하지 않는다.
