---
description: Task 하나를 구현하기 전에 입력·의존·작업 트리·범위를 검사하고 READY_TO_IMPLEMENT 또는 BLOCKED_* 판정을 낸다 (읽기 전용)
argument-hint: "WAVE_ID TASK_ID [상세 Task 파일 경로]"
---

## 공통 원칙

- 먼저 Skill 도구로 `traveler-project-pipeline`을 불러오고 루트 `CLAUDE.md`를 따른다.
- **이 Command는 아무 파일도 수정하지 않는다.** 코드·`TASKS/`(WAVE_STATE 포함)·문서·설정을 만들거나 고치지 않는다. 판정만 보고한다.
  - `validate_inputs.py`는 `--no-snapshot`으로만 실행한다. `audit_tasks.py`는 산출 파일을 다시 쓰므로 실행하지 않는다(필요하면 `/audit-tasks`를 안내).
  - Git은 읽기 명령(`git status`, `git diff --name-only`, `git ls-files`)만 쓴다.
- 판단은 **실제 파일을 Read로 읽어서** 한다. 기억이나 추정으로 PASS를 주지 않는다. 확인하지 못한 항목은 PASS가 아니라 FAIL(확인 불가)로 적는다.
- Secret 값은 출력하지 않는다. 환경변수는 **이름만** 확인하고, 값이나 일치한 문자열은 앞 4자 이후를 `****`로 가린다.

## 입력

`$ARGUMENTS` = `WAVE_ID TASK_ID [상세 Task 파일 경로]`

| 입력 | 규칙 |
|---|---|
| `WAVE_ID` | `WXX` 형식. `scripts/build_waves.py`가 만든 `TASKS/WAVE_PLAN.md`·`WAVE_STATE.json`에 있어야 한다 |
| `TASK_ID` | `TASKS/00_TASK_LIST.md` §2에 있는 구현 Task ID |
| 상세 Task 파일 | 생략하면 `TASKS/TASK-<TASK_ID>.md`. 지정한 경로가 이 이름과 다르거나 파일이 없으면 BLOCKED_INPUT |

인자가 빠졌거나 형식이 틀리면 검사를 진행하지 않고 BLOCKED_INPUT으로 보고한다.

## 읽을 파일

- 상세 Task 파일 14개 절 전체, `TASKS/00_TASK_LIST.md`의 그 행
- `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.json`
- `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md` §9·§10
- `design-reference/SCREEN_ROUTE_CONTRACT.json`, `design-reference/UI_CONTRACT.md`, `design-reference/D-001/DESIGN.md`·`MANIFEST.json`, `docs/05_UIUX_APPROVED.md`
- `docs/ARCHITECTURE.md` §12 착수 차단, `.gitignore`

## 검사

각 검사는 PASS / FAIL / WARN 중 하나와 근거(파일·줄·경로)를 남긴다. WARN은 판정을 막지 않는다.

### 1. Working Tree 상태 → BLOCKED_DIRTY_TREE

- `git status --short`와 `git diff --name-only`를 읽는다.
- **FAIL:** 구현 경로(`src/`, `supabase/`, `e2e/`, `public/`, `.github/`, `package.json`, `package-lock.json`, `*.config.*`, `tsconfig.json`)에 이 Task의 §7 Expected Files 밖의 미커밋 변경이 있다. 다른 Task의 작업이 섞일 수 있다.
- **알려진 변경(FAIL 아님):** `WAVE_STATE.json`에서 이미 `completed`인 Task의 Expected Files 변경이다. 아직 Commit하지 않은 앞 Task의 결과로 보고 목록으로만 보고한다.
- **WARN:**
  - 하네스·문서 경로(`.claude/`, `.omc/`, `CLAUDE.md`, `TASKS/`, `docs/`, `design-reference/`, `scripts/`)에만 변경이 있다.
  - 이 Task의 Expected Files 안에 이미 변경이 있다. 이전 시도가 남았을 수 있으니 이어서 할지 사용자에게 묻도록 적는다.
- 남의 변경을 되돌리거나 stash하지 않는다.

### 2. Task가 현재 Wave에 포함되는지 → BLOCKED_INPUT

- `WAVE_PLAN.md` §3에서 `WAVE_ID` 행에 `TASK_ID`가 있는지, `WAVE_STATE.json`의 `waves.<WAVE_ID>.tasks`에도 있는지 확인한다.
- **FAIL:**
  - 어느 한쪽에 없다. 실제로 속한 Wave를 알려 준다.
  - 그 Task의 상태가 이미 `completed`다.
  - Wave 상태가 `completed`이거나 Checkpoint 대기(Task 모두 `completed`, `checkpoint_result` 미승인)다.
- 상세 파일의 `## Task Row`가 Task List 행과 글자 그대로 같지 않아도 FAIL이다.

### 3. Depends On 완료 여부 → BLOCKED_DEPENDENCY

- 상세 §6과 Task Row의 Depends On에 있는 Task가 모두 `WAVE_STATE.json`에서 `completed`인지 확인한다.
- 앞 Wave가 모두 `completed`인지 확인한다. `checkpoint_type`이 `preview`인 앞 Wave는 `checkpoint_result`가 `approved`여야 한다.
- **FAIL:** 하나라도 아니다. 미완료 Task와 그 Wave·상태를 적는다.

### 4. Expected Files → BLOCKED_INPUT / BLOCKED_SCOPE

- 상세 §7과 Task Row의 Expected Files가 같은지 확인한다. 다르면 BLOCKED_INPUT이다.
- "수정"으로 표시한 파일이 실제로 있는지 확인한다. 없으면 BLOCKED_INPUT이다.
- "생성"으로 표시한 파일이 이미 있으면 WARN을 남긴다(이전 시도 또는 다른 Task가 만든 파일).
- 다음 중 하나라도 해당하면 BLOCKED_SCOPE다.
  - `route.ts`, `src/app/api/*`, `"use server"` 파일, 계약에 없는 `page.tsx`가 있다.
  - 다른 Screen의 Page Entry가 있다(Page Owner가 아닌데 `page.tsx`가 있는 경우 포함).
  - `.env*` 파일이 있다.
  - 6개 테이블 밖의 migration이 있다.

### 5. SRS·Scope·Design·Screen Ref → BLOCKED_INPUT / BLOCKED_SCOPE

- **Requirement Ref:**
  - 06 §4에 없는 ID가 있으면 BLOCKED_INPUT이다.
  - `PROJECT_SCOPE.md` §10에서 EXCLUDED인 ID가 있으면 BLOCKED_SCOPE다.
- **Screen·Route·Page Entry:** `SCREEN_ROUTE_CONTRACT.json` 값과 다르면 BLOCKED_INPUT이다. Screen이 `공통`·`없음`이면 Route·Page Entry가 `-`인지 확인한다.
- **Design Ref(§5)** — 하나라도 실제로 없으면 BLOCKED_INPUT이다.
  - UI_CONTRACT 절이 실제로 있는지
  - Stitch ID가 05에 있는지
  - D-001 `MANIFEST.json`이 `LOCKED`이고 `DESIGN.md`가 있는지

### 6. 필요한 환경변수 이름 → BLOCKED_INPUT / BLOCKED_SCOPE

- 상세 §7·§8·§10·§12와 `ARCHITECTURE.md` §12를 보고, 이 Task의 구현·Verify에 필요한 환경변수 **이름**을 목록으로 만든다. 예: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `E2E_USER_A_*`, `E2E_USER_B_*`, `E2E_ADMIN_*`.
- 있는지는 이름만 확인한다. 값이 비어 있지 않은지만 보고, 값은 읽어 출력하지 않는다.
  - `.env.local`: `grep -oE '^[A-Z0-9_]+=.' .env.local | cut -d= -f1`
  - 셸 환경: `printenv | cut -d= -f1`
- **FAIL — BLOCKED_INPUT:** 필요한 변수가 없거나 비어 있다. `ARCHITECTURE.md` §12의 해결 방법을 같이 적는다.
- **FAIL — BLOCKED_SCOPE:** Task가 허용 3개 밖의 `NEXT_PUBLIC_*` 변수나 `SUPABASE_SERVICE_ROLE_KEY`·Secret Key를 요구한다.
- 환경변수가 필요 없는 Task는 "필요 없음"으로 PASS한다.

### 7. Secret 하드코딩 위험 → BLOCKED_SCOPE

- `.gitignore`가 `.env*`를 제외하는지 확인한다. 아니면 FAIL이다.
- `git ls-files`에 `.env*`(`.env.example` 제외)가 있으면 FAIL이다.
- 다음 위치를 검사한다.
  - 상세 Task 파일
  - 이미 있는 Expected Files
  - Git이 추적하는 `src/`·`supabase/`·`e2e/`
- 검사 패턴
  - `service_role`, `SERVICE_ROLE_KEY`
  - `sb_secret_`
  - JWT 형태(`eyJ[A-Za-z0-9_-]{10,}\.`)
  - `https://<ref>.supabase.co`와 키가 함께 하드코딩된 문자열
  - `password\s*[:=]\s*['"][^'"]+`
  - 실제 이메일·비밀번호가 들어간 테스트 계정 값
- **FAIL:** 패턴이 나왔다. 값은 가려서 파일·줄만 적는다.
- **WARN:** AC가 Secret을 코드에 넣으라고 읽힐 수 있다. 예: "키를 상수로 둔다".

### 8. EXCLUDED 범위 침범 여부 → BLOCKED_SCOPE

- 상세 §2·§7·§8~§10의 내용이 `PROJECT_SCOPE.md` §10 EXCLUDED 기능을 구현하게 하는지 확인한다. 예: 콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 행동 분석, 탈퇴 자동 삭제, 참가 요청 취소, 외부 Email 공급자, Monitoring.
- 다음도 함께 확인한다.
  - AWS·EC2·ORM(Prisma·Drizzle) 사용
  - 자동 PR·자동 Merge 설정
  - Firefox·WebKit Playwright
  - 항공·숙소 입력값을 서버·DB·URL·저장소로 보내는 AC
- **FAIL:** 하나라도 있다. 해당 절·문구와 EXCLUDED 근거를 적는다.

## 판정

검사 결과로 판정 하나를 낸다. 여러 개가 걸리면 아래 우선순위에서 가장 위의 것을 판정으로 쓰고, 나머지 FAIL도 모두 보고한다.

| 우선순위 | 판정 | 조건 |
|---:|---|---|
| 1 | `BLOCKED_INPUT` | 인자·상세 파일 문제, Wave 불일치(2), Expected Files·Ref 불일치(4·5), 환경변수 없음(6) |
| 2 | `BLOCKED_SCOPE` | 금지 파일·EXCLUDED Requirement(4·5), 금지 환경변수(6), Secret 위험(7), EXCLUDED 침범(8) |
| 3 | `BLOCKED_DEPENDENCY` | Depends On 또는 앞 Wave 미완료(3) |
| 4 | `BLOCKED_DIRTY_TREE` | 무관한 구현 경로 변경(1) |
| — | `READY_TO_IMPLEMENT` | 8개 검사에 FAIL이 없음 (WARN은 허용) |

## 보고 (한국어)

첫 줄에 판정을 그대로 쓴다.

```
PREPARE_TASK_RESULT=<판정> wave=<WAVE_ID> task=<TASK_ID>
```

그다음 다음 내용을 쓴다.

- **검사 결과:** 8개 검사를 `| # | 검사 | 결과 | 근거 |` 표로 쓴다.
- **필요한 환경변수:** 이름과 있음/없음. 값은 쓰지 않는다.
- **Expected Files:** 생성·수정 목록과 현재 존재 여부
- **다음 행동**
  - `READY_TO_IMPLEMENT`면 구현 단계(`/run-wave <WAVE_ID>` 또는 `CLAUDE.md`의 Task 완료 순서)로 갈 수 있다고 적고 끝낸다. 이 Command가 구현을 시작하지 않는다.
  - BLOCKED면 무엇을 누가 해결해야 하는지 적는다.
    - 사용자: 환경변수, 계정, 미커밋 변경 정리
    - Pipeline: `/gen-tasklist --force`, `/gen-task-details <TASK_ID>`
    - 앞 Task: `/run-wave <앞 Wave>`
