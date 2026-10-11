---
description: prepare-task가 READY_TO_IMPLEMENT로 판정한 Task 하나를 Expected Files 안에서 구현·검증하고 보고한다
argument-hint: "WAVE_ID TASK_ID [--commit]"
---

## 공통 원칙

- 먼저 Skill 도구로 `traveler-project-pipeline`을 불러오고 루트 `CLAUDE.md`를 따른다.
- **한 번에 Task 하나만** 구현한다. 서브에이전트를 병렬로 돌리지 않고, 다음 Task로 이어서 진행하지 않는다.
- 판단은 실제 파일을 Read로 읽고, 실제로 명령을 실행해서 한다. 실행하지 않은 검증을 통과로 쓰지 않는다.
- 기본으로 Commit·Push·PR을 하지 않는다. 사용자가 요청하거나 `--commit`을 줬을 때만 이 Task 단위 Commit까지 한다. Push·PR·Merge·배포는 어떤 경우에도 하지 않는다.

## 입력

`$ARGUMENTS` = `WAVE_ID TASK_ID [--commit]`. 상세 파일은 `TASKS/TASK-<TASK_ID>.md`다.

## 1. 착수 판정 (규칙 1)

1. `/prepare-task <WAVE_ID> <TASK_ID>`의 검사 절차를 **이번 실행에서 다시** 수행한다. 이전 대화의 판정 결과를 재사용하지 않는다.
2. 결과가 `READY_TO_IMPLEMENT`가 아니면 아무 파일도 고치지 않는다. 그 판정(`BLOCKED_*`)과 FAIL 항목을 그대로 보고하고 끝낸다.
3. WARN이 있으면 보고에 옮긴다. "Expected Files 안에 이미 변경 있음" WARN이면 이어서 작업할지 사용자에게 묻고 답을 받은 뒤 진행한다.

## 2. 준비

1. 상세 파일 14개 절을 모두 읽는다. 특히 §7 Expected Files, §8 Functional AC, §9 Visual AC, §10 Security/Privacy AC, §12 Verify, §14 Forbidden을 본다.
2. `package.json`으로 실제 버전과 스크립트를 확인한다.
3. 쓰려는 Next.js 기능의 문서를 `node_modules/next/dist/docs/`에서 읽는다. 다음 규칙을 지킨다.
   - `page.tsx`의 `searchParams`·`params`는 `await`한다.
   - `useSearchParams`를 쓰면 `<Suspense>`로 감싼다.
   - Middleware 대신 `src/proxy.ts`를 쓴다.
4. Screen Task면 `UI_CONTRACT.md`의 해당 절, `04_UIUX_PLAN.md`의 문구, `D-001/DESIGN.md`의 토큰을 읽는다.
5. `TASKS/WAVE_STATE.json`에서 이 Task를 `in_progress`로 기록한다.

## 3. 구현 (규칙 2·3·4·7)

- **Expected Files 안에서만** 파일을 만들고 고친다.
  - 다른 파일이 필요하면 구현을 멈추고 Task 목록 변경을 요청한다. `/gen-tasklist --force`, `/gen-task-details`를 안내한다.
  - 우회하려고 다른 파일에 코드를 넣지 않는다.
- **AC를 하나씩 충족한다.** §8 Functional, §9 Visual, §10 Security/Privacy AC를 체크리스트로 삼고, §14 Forbidden을 어기지 않는다.
- **Page Owner(PAGE-SCR00x)**
  - Page Entry(`page.tsx`)에서 의존 Component를 실제로 import해 조립한다. 하위 Component는 새로 만들거나 고치지 않는다(Component Task 소관).
  - `UI_CONTRACT.md`의 Section 순서와 §9의 최소 콘텐츠 수를 지킨다.
  - Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 Card·큰 빈 영역을 쓰지 않는다. 데이터가 없으면 안내·이용 방법·CTA가 있는 Empty State를 보여 준다.
  - Screen별로 다음을 지킨다.
    - SCR-001: Next.js Starter를 제거한다.
    - SCR-003: `tab=flight`·`tab=hotel`·`tab=mate` 세 탭을 조립한다.
    - SCR-005: Guest·Member·Admin 상태를 조립하고, 역할에 없는 영역은 렌더링하지 않는다.
- **데이터·보안**
  - 항공·숙소 입력값은 Client 일시 상태에만 둔다. 서버·DB·URL·쿠키·저장소·로그·분석으로 보내지 않는다.
  - 쓰기는 Browser Client가 사용자 세션으로, RLS 아래에서 한다.
  - Service Role Key·Secret을 코드에 넣지 않는다.
  - 다음을 쓰지 않는다: `dangerouslySetInnerHTML`, `alert`·`confirm`.
  - DB 테이블은 6개를 넘지 않는다.
- **추가 금지**
  - AWS SDK·EC2·Prisma·Drizzle 등 ORM
  - 자동 PR·자동 Merge 설정
  - `route.ts`·`src/app/api/*`·Server Action
  - Firefox·WebKit Playwright 프로젝트
  - EXCLUDED 기능
- 디자인 값은 D-001 토큰만 쓴다. 터치 영역은 44px 이상으로 하고 `:focus-visible`을 표시한다.

## 4. 검증 (규칙 5·6)

명령마다 실제 결과(통과·실패, 실패 메시지 요약)를 기록한다.

1. **포맷·타입** — `npm run lint`, `npm run typecheck`를 실행한다. SETUP-PROJECT 이전이라 스크립트가 없으면 "스크립트 없음"으로 기록한다.
2. **Unit Test** — §12 Verify의 `npm run test:unit -- <경로>`를 실행한다. 이 Task가 만든 `*.test.ts`가 있으면 그것도 실행한다.
   - 테스트 파일이 아직 없을 수 있다(뒤 Wave의 Unit Test Task가 만드는 경우). 그때는 실행하지 않고 "보류 — <Task ID>에서 검증"으로 기록한다. 통과로 쓰지 않는다.
3. **Playwright Smoke** — **Page Owner 또는 E2E Test Task일 때만** 실행한다. 명령은 `npx playwright test <spec> --project=chromium`이다.
   - **Page Owner:** 관련 spec이 이미 있으면 실행한다. 아직 없으면(테스트 그룹 Wave의 E2E Task가 만든다) "보류 — <E2E Task ID>에서 검증"으로 기록한다.
   - **E2E Test Task:** 자기 spec을 실행한다. 테스트 계정 환경변수가 필요하면 이름만 확인한다.
   - **그 밖의 Task:** §12 Verify에 Playwright가 적혀 있어도 실행하지 않는다. "보류 — <E2E Task ID>에서 검증"으로 기록한다.
4. **Page Owner 추가 확인** — `npm run build`를 실행하고, 사람이 확인할 Route와 화면(Desktop 1440·Mobile 390)을 정리한다. Preview 승인은 사람이 하며 이 Command가 대신하지 않는다.
5. **Diff 확인**
   - `git diff --name-only`와 `git status --short`로 변경 파일이 모두 §7 Expected Files 안에 있는지 확인한다.
   - 예외로 기록 파일 `TASKS/WAVE_STATE.json`, `docs/UIUX_TRACEABILITY.md`, `docs/PROJECT_STATE.md`는 허용한다.
   - 밖의 변경이 있으면 원인을 보고하고 멈춘다. 그 변경을 임의로 되돌리지 않는다.
6. 검증이 실패하면 Expected Files 안에서만 고치고 다시 실행한다. 같은 실패가 3번 이어지거나 Expected Files 밖을 고쳐야 해결되면 멈춘다.

## 5. 기록

- **`TASKS/WAVE_STATE.json`의 이 Task 항목만 갱신한다.** Wave 단위 상태(`status`, `checkpoint_result` 등)는 `/run-wave`가 맡는다.
  - 모든 검증이 통과하거나 정당하게 보류되면 `completed`로 기록한다. `finished_at`과 `verify`(실행한 명령·결과 요약, 보류 항목 포함)를 함께 적는다.
  - 실패로 멈추면 `failed`로, 입력 문제로 멈추면 `blocked`로 기록하고 `note`에 이유를 적는다.
- **`docs/UIUX_TRACEABILITY.md`의 Status를 갱신한다.** 대상은 이 Task의 Requirement Ref 행이다.
  - 코드만 작성했고 관련 테스트가 보류면 `IMPLEMENTED`로 한다.
  - 해당 요구사항의 테스트·확인이 이번에 실제로 통과했으면 `VERIFIED`로 한다.
  - 검증하지 않은 것을 VERIFIED로 쓰지 않는다.

## 6. Commit (요청 시에만)

`--commit`이 있거나 사용자가 요청했고 Task가 `completed`일 때만 한다.

1. `git add`에는 이 Task의 Expected Files 경로를 하나씩 지정한다.
   - `git add -A`나 `git add .`를 쓰지 않는다.
   - `WAVE_STATE.json`·추적표는 Git이 이미 추적하는 파일일 때만 함께 넣는다.
2. 메시지는 `<TASK_ID>: <제목>` 형식이고, 마지막 줄에 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`을 넣는다.
3. Push·PR 생성·Merge를 하지 않는다. `--amend`, `reset`, `--force`, `--no-verify`를 쓰지 않는다. Hook이 실패하면 원인을 고치고 새 Commit으로 다시 시도한다.

## 7. 보고 (한국어, 규칙 8)

```
IMPLEMENT_TASK_RESULT=<COMPLETED|FAILED|BLOCKED_*> wave=<WAVE_ID> task=<TASK_ID>
```

- **변경 파일:** 생성·수정 파일 목록(Expected Files 대비 표시)
- **검증 결과:** 실행한 명령과 결과를 그대로 적는다(통과·실패·보류와 보류 이유).
- **AC 확인:** §8~§10 AC별 충족 여부
- **남은 제한사항**
  - 충족하지 못한 AC, 확인하지 못한 항목, 보류된 테스트와 검증할 Task
  - Page Owner면 사람의 Preview 확인이 필요한 Route·뷰포트
  - Commit 여부(하지 않았으면 "Commit하지 않음")
- **다음:** 같은 Wave의 다음 Task ID. 이 Command는 다음 Task를 자동으로 시작하지 않는다.
