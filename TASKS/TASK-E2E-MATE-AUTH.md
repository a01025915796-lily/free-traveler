# TASK-E2E-MATE-AUTH Smoke: 계정·동행 흐름

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 58 | E2E-MATE-AUTH | Smoke: 계정·동행 흐름 | E2E Test | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-030, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-043, REQ-FUNC-066, REQ-FUNC-077, REQ-FUNC-080, REQ-NF-014, REQ-NF-015, REQ-FUNC-044, REQ-FUNC-078, REQ-NF-013 | 없음 | - | - | PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, DB-SEED-BASE | `e2e/mate-auth.spec.ts` | 1) SMK-03 비회원: 열람 가능, 쓰기·요청·신고·차단은 `/account?tab=login&next=…`<br>2) SMK-04 회원 A: 로그인, 연락처 차단, 작성·수정·마감, `<script>` 문자열 텍스트 표시, 쿠키 SameSite, 로그아웃<br>3) SMK-05 B 요청 → 중복 차단 → A 승인·거절 → B 내 활동 상태, 제3자 비노출<br>4) SMK-06 신고 접수번호 3초 이내, 차단·해제<br>5) SMK-07 관리자 신고 상태·외부 URL 검증, 일반 회원은 관리 탭 미렌더링<br>6) 만든 데이터는 끝에 삭제<br>7) 핵심 흐름(`test.describe` 단위): FLOW-04 비회원 권한 안내(SMK-03), FLOW-05 로그인 후 여행 정보(국가·지역·기간) 입력과 동행글 작성·수정·마감(SMK-04), FLOW-06 참가 요청 → 승인·거절(SMK-05), FLOW-07 신고·차단·관리자 처리(SMK-06·07)<br>8) 추가 Ref 확인: 제3자 계정이 다른 사람의 참가 요청·이메일을 조회할 수 없음(REQ-FUNC-044·REQ-NF-013, SMK-05), 일반 회원의 관리 탭 미렌더링과 관리자 외부 URL 저장 거부 시 오류 안내·복구 행동 표시(REQ-FUNC-078, SMK-07) | 해당 없음 (화면 요소 없음) | 1) 테스트 계정은 환경변수 | `npx playwright test e2e/mate-auth.spec.ts --project=chromium` (테스트 계정 환경변수 필요) | P0 |

## 1. Context

화면과 무관한 기반 작업의 "Smoke: 계정·동행 흐름" 작업이다. 이 Task는 E2E Test 단계로, 요구사항 24건(REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-030, REQ-FUNC-031, REQ-FUNC-032 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, DB-SEED-BASE. 이 Task가 끝나야 RELEASE-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "Smoke: 계정·동행 흐름"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 제품 코드 수정 (실패 시 해당 구현 Task로 되돌림)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-027 | 동행 쓰기에 인증 세션 필요 | 비로그인 쓰기 시도는 `/account?tab=login&next=<원래 경로>`로 이동. RLS가 `auth.uid()` 없는 쓰기를 거부 |
| REQ-FUNC-028 | 만 19세 이상 확인, 생년월일 미저장 | SCR-005 프로필 탭의 성인 확인 체크로 `is_adult`, `adult_verified_at`만 저장. RLS가 `is_adult=true`를 요구 |
| REQ-FUNC-029 | 동행 프로필 | SCR-005 프로필 탭에서 닉네임·연령대·여행 스타일(필수), 성별·자기소개(선택) 입력 |
| REQ-FUNC-030 | 동행글 필터 | 국가·지역·기간 겹침·연령대·성별·스타일·모집 상태 필터를 Supabase 쿼리로 처리, 차단 관계 글 제외 |
| REQ-FUNC-031 | 모집글 입력 항목 | 제목·국가·지역·시작일·종료일·인원·선호 조건·스타일·설명·안전수칙 동의. 누락·역전 날짜·과거 종료일 차단 |
| REQ-FUNC-032 | 공개 연락처 탐지 | 제출 전 정규식 검사로 차단하고 수정 안내 표시 |
| REQ-FUNC-033 | 이메일·연락처 비노출 | `profiles`에 이메일 컬럼을 두지 않고 공개 컬럼만 조회 |
| REQ-FUNC-034 | 참가 메시지 500자 비공개 | 모집중 글에 ≤500자 메시지, PENDING 저장, RLS로 요청자·작성자만 열람 |
| REQ-FUNC-035 | 중복 요청 차단 | 부분 UNIQUE 인덱스와 UI 오류 메시지 |
| REQ-FUNC-036 | 작성자 승인·거절 | 작성자만 ACCEPTED/REJECTED로 변경(RLS). 감사 로그 기록은 제외(§7) |
| REQ-FUNC-037 | 종료일 경과 자동 마감 | 조회 시 `end_date` 기준으로 마감 계산, 모집중 목록에서 제외 |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | SCR-004 상세 패널의 작성자 메뉴에서 마감·삭제(`DELETED`), 수정은 SCR-003 동행 구하기 탭(`&edit=<id>`). 승인자가 있으면 날짜 변경 전 화면 내 확인 Modal 표시 |
| REQ-FUNC-039 | 글·사용자·요청 신고 | 사유 코드와 설명 입력, 접수번호·접수 시각 표시 |
| REQ-FUNC-040 | 사용자 차단·해제 | `user_blocks`와 RLS로 상호 글·프로필·요청 비노출. SCR-004 상세 패널에서 차단, SCR-005 내 활동 탭에서 해제 |
| REQ-FUNC-041 | 신고 큐 | SCR-005 관리 탭(`?tab=admin`)에 대상·사유·설명·접수 시각·상태 목록과 OPEN/REVIEWING/RESOLVED/DISMISSED 필터 |
| REQ-FUNC-043 | 요청·처리 결과 알림 | 이메일 없이 Toast와 SCR-005 내 활동 탭의 상태 배지로 제공 |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | SCR-005 로그인 탭과 기술 Route `/auth/callback`에서 Supabase Auth 사용. 이메일 미인증 계정은 로그인·쓰기 불가 |
| REQ-FUNC-077 | 외부 URL 관리자 설정 | SCR-005 관리 탭에서 HTTPS·허용 호스트만 저장. DB CHECK와 UI 검증 |
| REQ-FUNC-080 | 정책 문서·안전수칙 동의 기록 | Footer 정책 Modal 4종. SCR-003 동행 구하기 탭에서 글 작성 시 `safety_agreed_at`, `policy_version` 저장 |
| REQ-NF-014 | CSRF·SameSite | 자체 상태 변경 엔드포인트 없음. Supabase 요청은 Authorization 헤더, `@supabase/ssr` 세션 쿠키는 SameSite=Lax |
| REQ-NF-015 | 입력 검증·XSS 차단 | React 기본 이스케이프, 사용자 입력에 `dangerouslySetInnerHTML` 금지, 길이 제한 DB CHECK |
| REQ-FUNC-044 | RLS 비공개 데이터 보호 | §6 정책: 본인, 요청 대상 작성자, admin만 비공개 데이터 열람 |
| REQ-FUNC-078 | 오류 화면 복구 행동 | `not-found.tsx`(홈), `error.tsx`(다시 시도·홈), 권한 없음(홈·로그인), 외부 연결 실패(재시도) |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | 모든 테이블 RLS 활성화, `role`은 DB에서만 판단 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | 없음 (화면 밖 작업) |
| Route | - |
| Page Entry | - |

## 5. Design Ref

- 화면 디자인 없음 (비UI 작업)
- `docs/PROJECT_SCOPE.md` §5 구현 방식 · §6 Supabase 구성
- `docs/06_SRS_UIUX_REVISED.md` §2 개정 내역 · §4 UI Route Contract

## 6. Depends On

- PAGE-SCR003 — SCR-003 통합 여행 준비 페이지 조립 (Seq 45)
- PAGE-SCR004 — SCR-004 동행 조회 페이지 조립 (Seq 46)
- PAGE-SCR005 — SCR-005 계정·관리 페이지 조립 (Seq 47)
- DB-SEED-BASE — 기본 설정·테스트 데이터 시드 (Seq 11)

## 7. Expected Files

**생성**

- `e2e/mate-auth.spec.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- SMK-03 비회원: 열람 가능, 쓰기·요청·신고·차단은 `/account?tab=login&next=…`
- SMK-04 회원 A: 로그인, 연락처 차단, 작성·수정·마감, `<script>` 문자열 텍스트 표시, 쿠키 SameSite, 로그아웃
- SMK-05 B 요청 → 중복 차단 → A 승인·거절 → B 내 활동 상태, 제3자 비노출
- SMK-06 신고 접수번호 3초 이내, 차단·해제
- SMK-07 관리자 신고 상태·외부 URL 검증, 일반 회원은 관리 탭 미렌더링
- 만든 데이터는 끝에 삭제
- 핵심 흐름(`test.describe` 단위): FLOW-04 비회원 권한 안내(SMK-03), FLOW-05 로그인 후 여행 정보(국가·지역·기간) 입력과 동행글 작성·수정·마감(SMK-04), FLOW-06 참가 요청 → 승인·거절(SMK-05), FLOW-07 신고·차단·관리자 처리(SMK-06·07)
- 추가 Ref 확인: 제3자 계정이 다른 사람의 참가 요청·이메일을 조회할 수 없음(REQ-FUNC-044·REQ-NF-013, SMK-05), 일반 회원의 관리 탭 미렌더링과 관리자 외부 URL 저장 거부 시 오류 안내·복구 행동 표시(REQ-FUNC-078, SMK-07)

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 테스트 계정은 환경변수

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-01 | 가입 인증 메일 수신·인증 링크(`/auth/callback`), 비밀번호 재설정 메일 |
| MAN-04 | Supabase 대시보드에서 RLS 활성화·정책 목록 확인 |
| SMK-03 | SCR-004, SCR-003 (비회원) — 동행 목록·상세 열람 가능, 참가 요청·신고·차단·동행 구하기 탭 진입 시 `/account?tab=login&next=…`로 안내 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-05 | SCR-004, SCR-005 (회원 A·B) — B 참가 요청 → 중복 요청 차단 → A 내 활동에서 승인·거절 → B 내 활동에 상태 표시, 제3자는 요청을 볼 수 없음 |
| SMK-06 | SCR-004, SCR-005 — 신고 접수번호·시각 3초 이내 표시, 차단 후 상대 글·프로필이 목록에서 사라짐, 내 활동에서 차단 해제 |
| SMK-07 | SCR-005 관리 탭 — 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원에게는 관리 탭이 렌더링되지 않음 |
| UT-04 | 외부 URL 허용목록 (HTTPS, 허용 호스트, `http:`·`javascript:`·`data:` 거부, query 없음) |
| UT-05 | 공개 연락처 탐지 기준 테스트셋 (탐지율 ≥95%, 오탐 ≤5%) |
| UT-06 | 자동 마감 계산 (`end_date` 기준, Asia/Seoul) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, UNIT-OUTBOUND-FAVORITES, TEST-RLS-BASIC, E2E-PUBLIC-SMOKE, MANUAL-CHECK

## 12. Verify

- `npx playwright test e2e/mate-auth.spec.ts --project=chromium` (테스트 계정 환경변수 필요)
- `npm run lint` · `npm run typecheck` 오류 0
- `git diff --name-only` 결과가 §7 Expected Files 안에 있음

기대 결과: 위 명령이 모두 성공하고 §8~§10 AC를 하나씩 확인했다.

## 13. Definition of Done

- §8 Functional AC, §9 Visual AC, §10 Security/Privacy AC를 모두 충족
- §12 Verify 명령 통과
- 변경 파일이 §7 Expected Files 안에만 있음
- 테스트·확인 결과로 `docs/UIUX_TRACEABILITY.md`의 해당 요구사항 Status를 VERIFIED로 갱신(통과한 것만)

## 14. Forbidden

- Expected Files 밖 파일을 수정하거나 새로 만들지 않는다. 필요하면 작업을 멈추고 Task 목록 변경을 요청한다
- 자체 Route Handler(`route.ts`)·`src/app/api/*`·Server Action(`"use server"`)을 만들지 않는다
- EXCLUDED 요구사항(콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 분석 이벤트, 탈퇴 자동 삭제, 참가 요청 취소, 이메일 사업자 연동 등)을 구현하지 않는다
- AWS·EC2·자동 Merge·Merge Runner 관련 작업을 하지 않는다
- Branch 생성·Commit·Push·PR은 사용자가 요청할 때만 한다
- Chromium 밖 브라우저 프로젝트(Firefox·WebKit)를 추가하지 않는다
- 테스트를 통과시키려고 제품 코드를 고치지 않는다
