---
description: 출시 전 Task·Wave·CI·Playwright·Supabase·Preview·EXCLUDED를 증거로 확인하고 RELEASE_READY 또는 RELEASE_BLOCKED를 판정한다 (배포하지 않음)
argument-hint: "[--record]  (마지막 Wave의 RELEASE-CHECK Task에서 docs/checks/RELEASE_CHECK.md에 기록할 때만)"
---

## 공통 원칙

- 먼저 Skill 도구로 `traveler-project-pipeline`을 불러오고 루트 `CLAUDE.md`를 따른다.
- 판정은 **실제로 읽은 파일과 실제로 실행한 명령의 결과**로만 한다. 확인하지 못한 항목은 PASS가 아니라 `확인 불가`이며, 하나라도 있으면 `RELEASE_BLOCKED`다.
- 기본으로 **읽기 전용**이다. 제품 코드·`TASKS/`·문서를 고치지 않는다.
  - 검증 명령이 만드는 산출물(`.next/`, `test-results/`, `playwright-report/`)은 예외다.
  - 실패를 고치지 않는다. 실패는 해당 구현 Task로 되돌려 보고한다.
- `--record`는 마지막 Wave(`checkpoint_type: release`)의 `RELEASE-CHECK` Task를 `/implement-task`(또는 `/run-wave <그 Wave>`)로 수행할 때만 쓴다. 이때 결과는 그 Task의 Expected File인 `docs/checks/RELEASE_CHECK.md`에 기록하고, 상태 요약 `docs/PROJECT_STATE.md`의 FINAL·Latest CI만 갱신한다.
- 배포하지 않는다. Production 승격, Push, PR, Merge, Vercel·Supabase 설정 변경을 하지 않는다. Production 배포는 사용자가 한다.
- Secret 값은 출력하지 않는다. 환경변수는 이름만 확인한다. Service Role Key를 쓰지 않는다.

## 근거 문서

- `docs/06_SRS_UIUX_REVISED.md` §5 RAC-01~13, §8 테스트 ID(UT·SMK·MAN)
- `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.json`, `TASKS/00_TASK_LIST.md` §4, `docs/UIUX_TRACEABILITY.md`
- `docs/PROJECT_SCOPE.md` §10, `docs/ARCHITECTURE.md` §7
- 기록 파일:
  - `docs/checks/MANUAL_CHECK.md` (MANUAL-CHECK)
  - `docs/checks/RELEASE_VERCEL.md`, `docs/checks/RELEASE_SUPABASE.md` (DEPLOY-VERCEL-SUPABASE)

## 검사

각 검사는 `PASS` / `FAIL` / `확인 불가` 중 하나와 증거(파일·줄·명령 출력 요약)를 남긴다.

### 1. Task·Wave 상태 (RAC-04)

- `python3 scripts/validate_inputs.py --no-snapshot`가 PASS여야 한다. `python3 scripts/audit_tasks.py`도 PASS여야 하는데, 이 Script는 산출 파일을 다시 쓰므로 `--record`일 때만 실행한다. 아니면 마지막 `TASKS/TASK_AUDIT_REPORT.md`를 읽는다.
- `WAVE_STATE.json`에서 마지막 Wave 앞의 Wave가 모두 `completed`여야 한다. `python3 scripts/build_waves.py --check`가 PASS여야 한다(Wave 구성이 Task 문서와 일치).
- 마지막 Wave의 `DEPLOY-VERCEL-SUPABASE`·`MANUAL-CHECK`가 `completed`여야 한다. `RELEASE-CHECK`는 실행 중이면 `in_progress`여도 된다.
- 어느 Task도 `failed`·`blocked`가 아니어야 한다.
- 61개 Task 중 `completed`가 아닌 것은 `RELEASE-CHECK` 하나뿐이어야 한다.
- 각 Task `verify` 기록의 "보류" 항목이 모두 E2E Task에서 해소됐어야 한다(DEC-015).
- `docs/UIUX_TRACEABILITY.md`에서 IMPLEMENT 88건이 모두 `VERIFIED`여야 한다. `NOT_STARTED`·`IMPLEMENTED`가 남으면 FAIL이다.
- MANUAL-CHECK 기록에 MAN-01~04의 결과·날짜·확인자가 있어야 한다. 이 기록은 RAC-08·11·12의 근거다.
- RAC-13 대표 콘텐츠 확인 기록이 있어야 한다.

### 2. 5개 Page Owner completed (RAC-01)

- `PAGE-SCR001`~`PAGE-SCR005`가 모두 `completed`여야 한다.
- 각 Page Entry가 계약 경로에 실제로 있어야 한다: `src/app/page.tsx`, `about/`, `travel-tools/`, `mates/`, `account/`.
- `src/app` 아래 `page.tsx`가 5개 + `auth/callback` 하나뿐이어야 한다. `route.ts`·`src/app/api/*`·`"use server"`가 없어야 한다(RC-01).
- `src/app/page.tsx`에 Create Next App 문구·`next.svg`가 없어야 한다(RC-06).
- `npm run test:unit -- <Route Contract 테스트 경로>`(UT-10)가 통과해야 한다.

### 3. CI PASS (RAC-02)

- 로컬에서 `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`를 실행해 모두 통과해야 한다.
- GitHub Actions(`.github/workflows/ci.yml`)도 통과해야 한다.
  - `gh run list --workflow ci.yml --limit 5`로 확인한다. 현재 `HEAD` Commit의 최신 실행이 `success`여야 한다.
  - `gh`가 로그인되지 않았거나 원격이 없으면 `확인 불가`다. 사용자에게 Actions 화면 결과를 받는다.
- 구현 경로(`src/`, `supabase/`, `e2e/`, 설정 파일)에 미커밋 변경이 있으면 FAIL이다. CI가 그 변경을 검사하지 않았기 때문이다.
- 워크플로에 자동 Merge·배포 단계가 없어야 한다.

### 4. Playwright Smoke PASS (RAC-03·08·09)

- `npx playwright test --project=chromium`으로 `e2e/public.spec.ts`, `e2e/travel-tools.spec.ts`, `e2e/mate-auth.spec.ts`를 실행해 모두 통과해야 한다.
  - E2E 테스트 계정 환경변수는 이름만 확인한다.
  - 하나라도 skip이면 `확인 불가`다.
- SMK-01~10이 Desktop 1440에서, SMK-01·02가 Mobile 390에서도 실행됐는지 결과 목록으로 확인한다.
- axe serious/critical 0건(SMK-08)이어야 한다.
- 항공·숙소 입력값이 URL·저장소·네트워크에 없어야 한다(SMK-02).
- `playwright.config.ts`에 Firefox·WebKit 프로젝트가 없어야 한다.

### 5. Supabase 6개 Table·기본 RLS 확인 기록 (RAC-09)

- **정적 확인**
  - `supabase/migrations/*.sql`의 `create table`이 6개여야 한다: `profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings`.
  - 6개 모두 `enable row level security`가 있어야 한다.
  - 6개 밖의 테이블이 있으면 FAIL이다.
- **테스트 기록**
  - `TEST-RLS-BASIC`이 `completed`여야 하고, `verify`에 통과가 기록돼 있어야 한다.
- **적용 기록**
  - `docs/checks/RELEASE_SUPABASE.md`에 원격 마이그레이션 적용과 Auth Redirect URL(`/auth/callback`) 등록 기록이 있어야 한다.
  - `docs/checks/MANUAL_CHECK.md`에 MAN-04(대시보드 RLS 활성화·정책) 결과가 있어야 한다.
- **비밀값**
  - `.next/static` 빌드 산출물과 Git 추적 파일에서 `service_role`, `sb_secret_`, JWT 형태 문자열이 나오지 않아야 한다. 나오면 값을 가리고 위치만 적는다.
- 원격 DB에 직접 질의하지 않는다. 기록이 없으면 `확인 불가`다.

### 6. Vercel Preview Checkpoint (RAC-06·10)

- `checkpoint_type`이 `preview`인 Wave(Page Owner 5개가 있는 Wave, `TASKS/WAVE_PLAN.md` §4 Page Owner 위치)가 모두 `checkpoint_result: "approved"`와 `checkpoint_at`을 가져야 한다. Wave 번호는 `WAVE_PLAN.md`에서 읽는다.

- 승인 이후 그 Screen의 Page Owner·Component Expected Files가 바뀌었으면 FAIL이다. `git log`로 `checkpoint_at` 이후 Commit을 확인하고, 재승인이 필요하다고 적는다.
- `docs/checks/RELEASE_VERCEL.md`에 다음 기록이 있어야 한다.
  - Vercel Git 연결
  - Preview·Production 환경변수 3개 이름 등록
  - HTTPS 리다이렉트(`curl -I`)
  - 요금제 확인
- 기록에 Preview URL이 있으면 `curl -sI <URL>`로 HTTPS 응답을 다시 확인할 수 있다. 응답 헤더만 보고 본문·쿠키는 저장하지 않는다.

### 7. EXCLUDED 목록 (RAC-05)

- `TASKS/00_TASK_LIST.md` §4의 EXCLUDED 26건과 추적표 Status `EXCLUDED` 26건이 `PROJECT_SCOPE.md` §10과 같아야 한다.
- EXCLUDED 요구사항의 `TASK-*.md`가 없어야 한다.
- 코드·설정에 EXCLUDED 기능의 흔적이 없어야 한다.
  - 검사 대상: `src/`, `supabase/`, `package.json`, `.github/`
  - 검사 항목과 키워드 예:

    | 항목 | 키워드 예 |
    |---|---|
    | 콘텐츠 CMS | `cms`, 콘텐츠 관리 화면 |
    | 미디어 업로드 | `storage.from`, `upload` 입력 |
    | 감사 로그 | `audit_log` |
    | 운영자 제재 | `ban`, `suspend`, `sanction` |
    | 행동 분석 | `gtag`, `@vercel/analytics`, `posthog`, `mixpanel` |
    | 탈퇴 자동 삭제 | 자동 삭제 스케줄 |
    | 참가 요청 취소 | 취소 버튼·`CANCELLED` 상태 |
    | 외부 Email 공급자 | `resend`, `sendgrid`, `nodemailer` |
    | Monitoring | `@sentry`, `datadog` |

  - 키워드가 나오면 문맥을 읽고 판단한다. 금지 문구나 테스트의 부재 확인이면 PASS다.
- `aws-sdk`·`@aws-sdk/*`·EC2 설정, `prisma`·`drizzle`이 없어야 한다.

## 판정

| 판정 | 조건 |
|---|---|
| `RELEASE_READY` | 7개 검사가 모두 `PASS` |
| `RELEASE_BLOCKED` | `FAIL` 또는 `확인 불가`가 하나라도 있음 |

`RELEASE_READY`는 "사용자가 Production 배포를 해도 된다"는 뜻일 뿐이다. 이 Command는 배포하지 않는다.

## 보고 (한국어)

```
RELEASE_CHECK_RESULT=<RELEASE_READY|RELEASE_BLOCKED> commit=<HEAD 짧은 해시> date=<YYYY-MM-DD>
```

- **검사 결과:** `| # | 검사 | 관련 RAC | 결과 | 증거 |` 7행
- **RAC 대조:** RAC-01~13 각각의 결과와 근거 검사 번호
- **막는 항목**(BLOCKED일 때): 항목마다 원인, 되돌릴 Task ID, 누가 해결하는지(사용자·Task)
- **실행한 명령:** 명령과 결과 요약(통과·실패·skip 수)
- **다음:**
  - READY면 사용자가 할 일: Production 승격, 배포 후 `curl -I` 확인
  - BLOCKED면 다시 실행할 명령

`--record`일 때는 같은 내용을 `docs/checks/RELEASE_CHECK.md`에 쓴다. 판정 날짜와 `HEAD` 해시도 함께 쓴다. `docs/PROJECT_STATE.md`의 FINAL Checkpoint(RELEASE_READY / RELEASE_BLOCKED, 날짜)와 Latest CI도 갱신한다. 그 밖의 파일(`WAVE_STATE.json`·추적표 포함)은 `/implement-task` 기록 단계가 맡는다.
