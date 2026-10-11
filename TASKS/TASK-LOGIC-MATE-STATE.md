# TASK-LOGIC-MATE-STATE 동행글·참가 요청 상태 전이

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 13 | LOGIC-MATE-STATE | 동행글·참가 요청 상태 전이 | Logic | IMPLEMENT | REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038 | 없음 | - | - | SETUP-PROJECT | `src/lib/mates/state.ts` | 1) 모집글 OPEN→CLOSED(작성자 마감·종료일 경과)·DELETED, 종료일 경과는 조회 시 계산<br>2) 요청 PENDING→ACCEPTED/REJECTED만 허용(WITHDRAWN 없음)<br>3) 같은 글 PENDING·ACCEPTED 중복 요청 판정<br>4) 승인자가 있는 글의 날짜 변경 경고 판정 | 해당 없음 (화면 요소 없음) | 1) 상태 변경 권한 판정은 RLS가 최종 기준 | UNIT-MATE-STATE | P0 |

## 1. Context

화면과 무관한 기반 작업의 "동행글·참가 요청 상태 전이" 작업이다. 이 Task는 Logic 단계로, 요구사항 4건(REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: SETUP-PROJECT. 이 Task가 끝나야 DB-ACCESS, COMP-SCR003-MATE-COMPOSE, COMP-SCR004-APPLY, COMP-SCR005-ACTIVITY, UNIT-MATE-STATE를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "동행글·참가 요청 상태 전이"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-035 | 중복 요청 차단 | 부분 UNIQUE 인덱스와 UI 오류 메시지 |
| REQ-FUNC-036 | 작성자 승인·거절 | 작성자만 ACCEPTED/REJECTED로 변경(RLS). 감사 로그 기록은 제외(§7) |
| REQ-FUNC-037 | 종료일 경과 자동 마감 | 조회 시 `end_date` 기준으로 마감 계산, 모집중 목록에서 제외 |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | SCR-004 상세 패널의 작성자 메뉴에서 마감·삭제(`DELETED`), 수정은 SCR-003 동행 구하기 탭(`&edit=<id>`). 승인자가 있으면 날짜 변경 전 화면 내 확인 Modal 표시 |

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

- SETUP-PROJECT — 패키지·스크립트·설정 초기화 (Seq 1)

## 7. Expected Files

**생성**

- `src/lib/mates/state.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 모집글 OPEN→CLOSED(작성자 마감·종료일 경과)·DELETED, 종료일 경과는 조회 시 계산
- 요청 PENDING→ACCEPTED/REJECTED만 허용(WITHDRAWN 없음)
- 같은 글 PENDING·ACCEPTED 중복 요청 판정
- 승인자가 있는 글의 날짜 변경 경고 판정

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 상태 변경 권한 판정은 RLS가 최종 기준

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-05 | SCR-004, SCR-005 (회원 A·B) — B 참가 요청 → 중복 요청 차단 → A 내 활동에서 승인·거절 → B 내 활동에 상태 표시, 제3자는 요청을 볼 수 없음 |
| UT-06 | 자동 마감 계산 (`end_date` 기준, Asia/Seoul) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-MATE-STATE, TEST-RLS-BASIC, E2E-MATE-AUTH

## 12. Verify

- UNIT-MATE-STATE
- UNIT-MATE-STATE 실행: `npm run test:unit -- src/lib/mates/state`
- `npm run lint` · `npm run typecheck` 오류 0
- `git diff --name-only` 결과가 §7 Expected Files 안에 있음

기대 결과: 위 명령이 모두 성공하고 §8~§10 AC를 하나씩 확인했다.

## 13. Definition of Done

- §8 Functional AC, §9 Visual AC, §10 Security/Privacy AC를 모두 충족
- §12 Verify 명령 통과
- 변경 파일이 §7 Expected Files 안에만 있음
- `docs/UIUX_TRACEABILITY.md`의 해당 요구사항 Status를 IMPLEMENTED로 갱신(검증 전)

## 14. Forbidden

- Expected Files 밖 파일을 수정하거나 새로 만들지 않는다. 필요하면 작업을 멈추고 Task 목록 변경을 요청한다
- 자체 Route Handler(`route.ts`)·`src/app/api/*`·Server Action(`"use server"`)을 만들지 않는다
- EXCLUDED 요구사항(콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 분석 이벤트, 탈퇴 자동 삭제, 참가 요청 취소, 이메일 사업자 연동 등)을 구현하지 않는다
- AWS·EC2·자동 Merge·Merge Runner 관련 작업을 하지 않는다
- Branch 생성·Commit·Push·PR은 사용자가 요청할 때만 한다
