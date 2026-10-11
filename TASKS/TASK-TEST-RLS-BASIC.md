# TASK-TEST-RLS-BASIC 통합 테스트: RLS 권한

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 55 | TEST-RLS-BASIC | 통합 테스트: RLS 권한 | Integration Test | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-034, REQ-FUNC-036, REQ-FUNC-040, REQ-FUNC-044, REQ-NF-013 | 없음 | - | - | DB-RLS-BASE, DB-SEED-BASE, DB-ACCESS | `src/__tests__/rls.test.ts` | 1) 테스트 Supabase 프로젝트에 회원 A·B·관리자·비회원으로 접속<br>2) 비회원 쓰기 거부, 성인 미확인 쓰기 거부, 제3자의 요청 열람 불가, 비작성자 승인·거절 불가, 차단 관계 비노출, 일반 회원 `reports`·`app_settings` 쓰기 불가, `role` 변경 불가<br>3) 테스트 데이터는 끝에 삭제 | 해당 없음 (화면 요소 없음) | 1) 테스트 계정 정보는 환경변수, 저장소에 쓰지 않음 | `npm run test:unit -- src/__tests__/rls` (테스트 계정 환경변수 필요) | P0 |

## 1. Context

화면과 무관한 기반 작업의 "통합 테스트: RLS 권한" 작업이다. 이 Task는 Integration Test 단계로, 요구사항 7건(REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-034, REQ-FUNC-036, REQ-FUNC-040, REQ-FUNC-044 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: DB-RLS-BASE, DB-SEED-BASE, DB-ACCESS. 이 Task가 끝나야 RELEASE-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "통합 테스트: RLS 권한"을 구현한다
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
| REQ-FUNC-034 | 참가 메시지 500자 비공개 | 모집중 글에 ≤500자 메시지, PENDING 저장, RLS로 요청자·작성자만 열람 |
| REQ-FUNC-036 | 작성자 승인·거절 | 작성자만 ACCEPTED/REJECTED로 변경(RLS). 감사 로그 기록은 제외(§7) |
| REQ-FUNC-040 | 사용자 차단·해제 | `user_blocks`와 RLS로 상호 글·프로필·요청 비노출. SCR-004 상세 패널에서 차단, SCR-005 내 활동 탭에서 해제 |
| REQ-FUNC-044 | RLS 비공개 데이터 보호 | §6 정책: 본인, 요청 대상 작성자, admin만 비공개 데이터 열람 |
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

- DB-RLS-BASE — RLS 정책과 차단 함수 (Seq 10)
- DB-SEED-BASE — 기본 설정·테스트 데이터 시드 (Seq 11)
- DB-ACCESS — 동행·요청·차단·신고·설정 데이터 접근 계층 (Seq 14)

## 7. Expected Files

**생성**

- `src/__tests__/rls.test.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 테스트 Supabase 프로젝트에 회원 A·B·관리자·비회원으로 접속
- 비회원 쓰기 거부, 성인 미확인 쓰기 거부, 제3자의 요청 열람 불가, 비작성자 승인·거절 불가, 차단 관계 비노출, 일반 회원 `reports`·`app_settings` 쓰기 불가, `role` 변경 불가
- 테스트 데이터는 끝에 삭제

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 테스트 계정 정보는 환경변수, 저장소에 쓰지 않음

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-04 | Supabase 대시보드에서 RLS 활성화·정책 목록 확인 |
| SMK-03 | SCR-004, SCR-003 (비회원) — 동행 목록·상세 열람 가능, 참가 요청·신고·차단·동행 구하기 탭 진입 시 `/account?tab=login&next=…`로 안내 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-05 | SCR-004, SCR-005 (회원 A·B) — B 참가 요청 → 중복 요청 차단 → A 내 활동에서 승인·거절 → B 내 활동에 상태 표시, 제3자는 요청을 볼 수 없음 |
| SMK-06 | SCR-004, SCR-005 — 신고 접수번호·시각 3초 이내 표시, 차단 후 상대 글·프로필이 목록에서 사라짐, 내 활동에서 차단 해제 |
| SMK-07 | SCR-005 관리 탭 — 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원에게는 관리 탭이 렌더링되지 않음 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-MATE-STATE, E2E-MATE-AUTH

## 12. Verify

- `npm run test:unit -- src/__tests__/rls` (테스트 계정 환경변수 필요)
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
- 테스트를 통과시키려고 RLS 정책을 고치지 않는다(DB-RLS-BASE로 되돌린다)
- 실제 사용자 데이터를 쓰지 않는다
