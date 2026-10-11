---
description: Traveler Wave 하나를 실행한다 — READY Task를 Depends On 순서로 하나씩 prepare-task 검사·implement-task 구현하고 TASKS/WAVE_STATE.json에 기록한다
argument-hint: "WXX [--commit] | status | resume | dry-run WXX"
---

## 공통 원칙

- 먼저 Skill 도구로 `traveler-project-pipeline`을 불러오고 루트 `CLAUDE.md`를 따른다.
- Wave ID와 Wave 구성은 `scripts/build_waves.py`가 만든 `TASKS/WAVE_PLAN.md`·`TASKS/WAVE_STATE.json`이 정본이다. Wave 번호를 추측하거나 다른 문서의 예전 번호를 쓰지 않는다.
- Task는 **한 번에 하나씩** 처리한다. 서브에이전트를 병렬로 돌리지 않는다.
- 각 Task의 검사는 `.claude/commands/prepare-task.md`, 구현은 `.claude/commands/implement-task.md` 규칙을 그대로 따른다. 이 문서는 그 둘을 Wave 단위로 반복하는 순서만 정한다.
- 자동 재시도 루프·자동 Branch·PR·Merge 기능은 없다. Branch를 만들거나 바꾸지 않고, Push·PR 생성·Merge·Production 배포를 하지 않는다. Commit은 `--commit`이 있거나 사용자가 요청했을 때만 `implement-task` §6에 따라 Task 단위로 한다.

## 지원 명령

| 명령 | 동작 | 파일 수정 |
|---|---|---|
| `/run-wave W03` | W03의 READY Task를 차례로 검사·구현한다 (§2) | 코드(Expected Files), `WAVE_STATE.json`, 추적표 |
| `/run-wave W03 --commit` | 위와 같고, Task가 `completed`가 될 때마다 Task 단위 Commit | 위 + Git Commit |
| `/run-wave status` | 모든 Wave와 Task 상태를 표로 보고한다 (§4) | 없음 |
| `/run-wave resume` | Checkpoint 결과를 기록하거나, 멈춘 Wave를 이어서 실행한다 (§5) | §2와 같음 |
| `/run-wave dry-run W03` | 실행하지 않고 실행 계획만 보고한다 (§3) | 없음 |

## 상태 값 (`TASKS/WAVE_STATE.json`, `schema_version` `traveler-wave-state-v2`)

| 대상 | 필드 | 값 |
|---|---|---|
| Wave | `status` | `pending` → `in_progress` → `completed`, 또는 `blocked` |
| Wave | `checkpoint_required`·`checkpoint_type` | `true`이면 `preview`(Page Owner Wave) 또는 `release`(마지막 Wave) |
| Wave | `checkpoint_result` | `null` → `approved`·`changes_requested`(preview), `release_ready`·`release_blocked`(release) |
| Task | `waves[].tasks.<ID>.status` | `pending` → `in_progress` → `completed`, 또는 `blocked`·`failed` |

- **Checkpoint 대기:** Task가 모두 `completed`인데 `checkpoint_required`가 `true`이고 `checkpoint_result`가 `approved`(release면 사람 확인 완료)가 아닌 상태. Wave `status`는 `in_progress`로 둔다.
- **READY Task:** 이 Wave에서 상태가 `pending`이고 Depends On Task가 모두 `completed`인 Task. 아직 prepare-task 검사를 받지 않은 상태다.
- **기록 담당:** Wave 항목(`status`, `started_at`, `finished_at`, `checkpoint_result`, `checkpoint_at`, `blocked_reason`)은 이 명령이 기록한다. Task 항목은 `implement-task` §5가 기록한다. `wave_id`·`title`·`task_ids`·`checkpoint_required`·`checkpoint_type`·`prerequisites`는 `build_waves.py`만 바꾼다.
- **저장 규칙:** 이 두 명령 밖에서는 이 파일을 고치지 않는다. Task 구성을 바꾸려면 Task 문서를 고친 뒤 `python3 scripts/build_waves.py`를 다시 실행한다(진행 기록이 있는 Wave의 구성이 바뀌면 Script가 실패한다).

## 1. 사전 검사 (`WXX`, `dry-run WXX`, `resume`의 이어서 실행)

1. **상태 읽기** — `TASKS/WAVE_PLAN.md`와 `TASKS/WAVE_STATE.json`을 읽는다. Wave ID가 없거나 두 파일의 Task 구성이 다르면 멈추고 `python3 scripts/build_waves.py --check`를 안내한다.
2. **Wave 상태**
   - 이미 `completed`이면 "완료됨"으로 보고하고 끝낸다.
   - Checkpoint 대기이면 `/run-wave resume`을 안내하고 끝낸다.
3. **앞 Wave** — 모두 `completed`여야 한다. `checkpoint_type`이 `preview`인 앞 Wave는 `checkpoint_result`가 `approved`여야 한다. 아니면 먼저 끝낼 Wave를 알리고 멈춘다.
4. **선행 조건** — Wave의 `prerequisites`(`WAVE_PLAN.md` §2 선행 조건)를 실제로 확인한다. Supabase 그룹부터는 `docs/ARCHITECTURE.md` §12 착수 차단(`.env.local` 변수 이름, 원격 Supabase 테스트 프로젝트 연결 `supabase link` — DEC-019), 테스트 그룹은 테스트 계정 변수 이름·Git 원격, Release 그룹은 Vercel 연결을 확인한다. 값은 출력하지 않는다.
   - 빠진 것이 있으면 Wave를 `blocked`로, `blocked_reason`에 빠진 항목을 기록하고 멈춘다. `dry-run`은 기록하지 않고 보고만 한다.
5. **문서·Task 검사**
   - `python3 scripts/validate_inputs.py --no-snapshot`를 실행한다.
   - `python3 scripts/audit_tasks.py`를 실행한다. `dry-run`이면 생략하고 마지막 `TASKS/TASK_AUDIT_REPORT.md`만 읽는다.
   - `python3 scripts/build_waves.py --check`를 실행해 현재 Task 문서와 Wave 구성이 맞는지 확인한다(파일을 쓰지 않음).
   - 하나라도 FAIL이면 멈춘다.

## 2. `/run-wave WXX` — Task 반복

Wave 상태가 `pending` 또는 `blocked`(§5 resume로 다시 연 경우)이면 `in_progress`로, 처음이면 `started_at`도 기록한다. 그다음 아래를 반복한다.

1. **READY Task 하나 선택** — 이 Wave에서 READY인 Task 중 `task_ids` 순서(Task List Seq 순서)가 가장 앞선 것 하나를 고른다. 이미 `completed`인 Task는 건너뛴다.
2. **prepare-task 검사** — `prepare-task` 규칙의 8개 검사를 수행한다.
   - 검사 1(Working Tree)에서, 이 Wave나 앞 Wave에서 `completed`가 된 Task의 Expected Files 변경은 알려진 변경으로 본다. 아직 Commit하지 않은 앞 Task의 결과가 다음 Task를 막지 않도록 하기 위함이다.
   - 판정이 `READY_TO_IMPLEMENT`가 아니면 이렇게 처리한다.
     - `BLOCKED_INPUT`·`BLOCKED_SCOPE`·`BLOCKED_DEPENDENCY`: Task를 `blocked`로 기록하고 `note`에 판정과 FAIL 항목을 적는다. Wave를 `blocked`로, `blocked_reason`을 기록하고 멈춘다.
     - `BLOCKED_DIRTY_TREE`: Task 상태는 바꾸지 않는다. 무관한 변경 목록을 보고하고 사용자에게 정리를 요청한 뒤 멈춘다. 남의 변경을 되돌리거나 stash하지 않는다.
3. **implement-task 구현** — `implement-task` §2~§5 규칙으로 이 Task 하나를 구현하고 검증한다.
   - Expected Files 안에서만 작업하고 AC를 따른다.
   - Unit Test를 실행한다. Playwright는 Page Owner·E2E Task만 실행하고, 그 밖은 보류로 기록한다(DEC-015).
4. **결과 기록**
   - 관련 검증이 모두 PASS(정당한 보류 포함)이면 Task를 `completed`로 갱신한다. `finished_at`, `verify`를 함께 적고, 추적표 Status도 갱신한다.
   - 검증 실패면 Task를 `failed`로 기록한다. 입력 문제가 새로 드러나면 `blocked`로 기록한다. 어느 경우든 Wave를 멈춘다(Wave 상태는 `in_progress` 유지, 실패 Task는 `blocked_reason`에 적는다). 자동으로 다시 시도하지 않는다.
5. **Commit** — `--commit`이 있으면 `implement-task` §6에 따라 이 Task만 Commit한다. 없으면 Commit하지 않는다.
6. **다음 Task** — 1로 돌아가 같은 Wave의 다음 READY Task를 처리한다.
7. **종료 조건**
   - Wave의 Task가 모두 `completed`이면 §2.1 마무리로 간다.
   - `completed`가 아닌 Task가 남았는데 READY Task가 없으면 남은 Task와 막힌 Depends On을 보고한다. 이때 Wave를 `blocked`로 기록하고 멈춘다. 같은 Task를 반복해서 시도하지 않는다.

### 2.1 Wave 마무리

| `checkpoint_type` | 처리 |
|---|---|
| `null` (`checkpoint_required: false`) | Wave를 `completed`, `finished_at`으로 기록하고 종료한다. 다음 Wave를 자동으로 시작하지 않는다 |
| `preview` | Wave를 `in_progress`로 둔 채(Checkpoint 대기) 종료한다. 사람이 확인할 항목을 알린다(아래 참고) |
| `release` | `/release-check` 규칙으로 기록한 `docs/checks/RELEASE_CHECK.md`의 판정을 `checkpoint_result`에 `release_ready` 또는 `release_blocked`로 기록하고, 사람 확인을 기다린다(Checkpoint 대기). `release_ready`이고 사용자가 resume으로 확인하면 `completed`가 된다. Production 배포는 사용자가 한다 |

Wave를 멈추거나 끝낼 때마다(`completed`·Checkpoint 대기·`blocked`·실패로 중단, `resume` 포함) `docs/PROJECT_STATE.md`를 `WAVE_STATE.json` 기준으로 갱신한다. 갱신할 항목은 Current Wave·Task, Completed·Blocked Tasks, Screen Checkpoints, Playwright State, Deferred Items, Next Action, 변경 이력이다. Screen Checkpoint는 Page Owner Wave가 Checkpoint 대기가 되면 `WAITING_FOR_PREVIEW`, resume으로 승인되면 `APPROVED`와 승인일, 수정 요청이면 `CHANGES_REQUESTED`로 바꾼다. Latest CI·Supabase State·Vercel Preview URL은 실제로 확인한 값만 쓴다.

`preview`일 때 알릴 항목:
- Route
- Desktop 1440·Mobile 390
- Page Owner 상세 §9의 Section 순서·최소 콘텐츠, §8 화면 상태(Loading·Empty·Error)
- 보류된 Playwright 항목
- 확인할 주소: Vercel 프로젝트가 연결돼 있으면 Vercel Preview 주소(사용자가 Push해서 생성), 아니면 로컬 `npm run dev` 주소

## 3. `/run-wave dry-run WXX`

§1 사전 검사(기록 없이)를 수행하고, 실행하지 않은 채 다음을 보고한다. 파일·상태를 수정하지 않는다.

- 선행 조건 충족 여부와 착수 차단
- Task 실행 순서 표: `| 순서 | Seq | Task | Category | 현재 상태 | Depends On | READY 여부 |`
- Task별 Expected Files와 Verify 명령. Playwright를 실행할지 보류할지 함께 표시한다.
- 필요한 환경변수 이름
- Wave 마무리 Checkpoint

## 4. `/run-wave status`

`WAVE_STATE.json`과 `WAVE_PLAN.md`만 읽고 보고한다. 파일을 수정하지 않는다.

- 모든 Wave: `| Wave | 이름 | 상태 | 완료/전체 | Checkpoint | Checkpoint 결과 |`
- 진행 중이거나 멈춘 Wave의 Task 표: `| 순서 | Task | 상태 | 마지막 Verify 요약 | note |`
- `blocked_reason`, 다음에 실행할 명령

## 5. `/run-wave resume`

`WAVE_STATE.json`을 읽고 경우에 따라 처리한다.

| 상황 | 처리 |
|---|---|
| Checkpoint 대기인 `preview` Wave가 있음 | 사용자가 화면을 확인·승인했다는 뜻으로 `checkpoint_result: "approved"`, `checkpoint_at`, `finished_at`을 기록하고 Wave를 `completed`로 바꾼다. 사용자가 수정 요청을 함께 말했다면 `checkpoint_result: "changes_requested"`로 기록하고, 해당 Task를 `pending`으로 다시 열어 `note`에 요청을 적은 뒤 멈춘다 |
| Checkpoint 대기인 `release` Wave가 있음 | `checkpoint_result`가 `release_ready`이고 사용자가 확인했다고 말하면 `checkpoint_at`·`finished_at`을 기록하고 `completed`로 바꾼다. `release_blocked`이면 막는 항목과 되돌릴 Task를 안내하고 멈춘다 |
| `in_progress`·`blocked`인 Wave가 있음 | 그 Wave에 대해 §1 사전 검사부터 다시 하고 §2를 이어서 실행한다. `failed`·`blocked` Task는 prepare-task 검사를 통과할 때만 `pending`으로 되돌려 다시 시도한다 |
| 해당 Wave 없음 | 다음에 실행할 Wave를 안내하고 끝낸다 |

## 6. 보고 (한국어)

```
RUN_WAVE_RESULT=<COMPLETED|WAITING_FOR_CHECKPOINT|BLOCKED|IN_PROGRESS> wave=<WXX> done=<n>/<전체>
```

`WAITING_FOR_CHECKPOINT`는 보고용 값이다. 상태 파일에는 `in_progress` + `checkpoint_result`로 남는다.

- **Wave 상태:** 상태, 완료 Task / 전체 Task, 멈춘 이유
- **Task별 결과:** Task ID, 판정(prepare-task), 결과(`completed`·`failed`·`blocked`), 변경 파일
- **검증 결과:** 실행한 명령과 결과를 그대로 적는다(통과·실패·보류).
- **남은 제한사항**
  - 충족하지 못한 AC, 보류된 테스트와 검증할 Task
  - 사람 확인이 필요한 점(Preview)
  - Commit 여부(하지 않았으면 "Commit하지 않음")
- **다음:** 사람이 할 일, 다음 명령(`/run-wave resume`, `/run-wave <다음 Wave ID>`)

## 7. 하지 않는 것

- 여러 Task를 동시에 구현하거나 서브에이전트를 병렬로 돌리지 않는다.
- 한 번의 실행에서 다음 Wave로 넘어가지 않는다. Checkpoint 승인 없이 다음 Wave를 시작하지 않는다.
- 실패한 Task를 자동으로 반복 수정·재시도하지 않는다.
- Expected Files 밖 수정, EXCLUDED 기능, ORM·AWS·EC2, 자동 PR·자동 Merge 설정, Firefox·WebKit Playwright를 추가하지 않는다.
- Branch 생성·전환, Push, PR 생성, Merge, Production 배포를 하지 않는다.
- `git reset --hard`, `git push --force`, `git clean -f`, `git checkout -- .`, `git stash`, 브랜치 삭제를 쓰지 않는다.
- 검증하지 않은 Task를 `completed`로, 보류된 테스트를 통과로 기록하지 않는다.
