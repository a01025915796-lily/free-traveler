# TASK-UNIT-MATE-STATE 단위 테스트: 동행 상태 전이·자동 마감

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 50 | UNIT-MATE-STATE | 단위 테스트: 동행 상태 전이·자동 마감 | Unit Test | IMPLEMENT | REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-031 | 없음 | - | - | LOGIC-MATE-STATE | `src/lib/mates/state.test.ts` | 1) UT-06 종료일 경계(Asia/Seoul)에서 자동 마감 계산<br>2) 허용·금지 전이(요청 PENDING→ACCEPTED/REJECTED, WITHDRAWN 없음, 모집글 OPEN→CLOSED/DELETED)<br>3) 중복 요청 판정, 승인자 있는 글 날짜 변경 경고<br>4) 추가 Ref 확인(REQ-FUNC-031, UT-06): 종료일이 오늘(Asia/Seoul) 이전인 모집글 입력은 OPEN 상태로 판정하지 않음 | 해당 없음 (화면 요소 없음) | 해당 없음 | `npm run test:unit -- src/lib/mates/state` | P0 |

## 1. Context

화면과 무관한 기반 작업의 "단위 테스트: 동행 상태 전이·자동 마감" 작업이다. 이 Task는 Unit Test 단계로, 요구사항 5건(REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-031)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: LOGIC-MATE-STATE. 이 Task가 끝나야 RELEASE-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "단위 테스트: 동행 상태 전이·자동 마감"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 제품 코드 수정 (실패 시 해당 구현 Task로 되돌림)
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
| REQ-FUNC-031 | 모집글 입력 항목 | 제목·국가·지역·시작일·종료일·인원·선호 조건·스타일·설명·안전수칙 동의. 누락·역전 날짜·과거 종료일 차단 |

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

- LOGIC-MATE-STATE — 동행글·참가 요청 상태 전이 (Seq 13)

## 7. Expected Files

**생성**

- `src/lib/mates/state.test.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- UT-06 종료일 경계(Asia/Seoul)에서 자동 마감 계산
- 허용·금지 전이(요청 PENDING→ACCEPTED/REJECTED, WITHDRAWN 없음, 모집글 OPEN→CLOSED/DELETED)
- 중복 요청 판정, 승인자 있는 글 날짜 변경 경고
- 추가 Ref 확인(REQ-FUNC-031, UT-06): 종료일이 오늘(Asia/Seoul) 이전인 모집글 입력은 OPEN 상태로 판정하지 않음

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 개인정보·비밀값을 다루지 않는다. 비밀값을 코드·로그에 쓰지 않는다

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-05 | SCR-004, SCR-005 (회원 A·B) — B 참가 요청 → 중복 요청 차단 → A 내 활동에서 승인·거절 → B 내 활동에 상태 표시, 제3자는 요청을 볼 수 없음 |
| UT-06 | 자동 마감 계산 (`end_date` 기준, Asia/Seoul) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: TEST-RLS-BASIC, E2E-MATE-AUTH

## 12. Verify

- `npm run test:unit -- src/lib/mates/state`
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
- 테스트를 통과시키려고 제품 코드를 고치지 않는다(실패는 해당 구현 Task로 되돌린다)
