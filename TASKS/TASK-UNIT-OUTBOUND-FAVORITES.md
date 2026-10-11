# TASK-UNIT-OUTBOUND-FAVORITES 단위 테스트: 외부 URL·즐겨찾기

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 53 | UNIT-OUTBOUND-FAVORITES | 단위 테스트: 외부 URL·즐겨찾기 | Unit Test | IMPLEMENT | REQ-FUNC-016, REQ-FUNC-018, REQ-FUNC-024, REQ-FUNC-026, REQ-FUNC-068, REQ-FUNC-077 | 없음 | - | - | LOGIC-OUTBOUND-URL, LOGIC-FAVORITES-SHARE | `src/lib/outbound.test.ts`, `src/lib/favorites.test.ts` | 1) UT-04 허용 호스트·HTTPS만, `http:`·`javascript:`·`data:` 거부, query 제거 없이 거부<br>2) UT-09 중복 방지, `localStorage` 예외 시 빈 목록 | 해당 없음 (화면 요소 없음) | 1) 외부 URL에 입력값이 붙지 않음을 단언 | `npm run test:unit -- src/lib/outbound src/lib/favorites` | P1 |

## 1. Context

화면과 무관한 기반 작업의 "단위 테스트: 외부 URL·즐겨찾기" 작업이다. 이 Task는 Unit Test 단계로, 요구사항 6건(REQ-FUNC-016, REQ-FUNC-018, REQ-FUNC-024, REQ-FUNC-026, REQ-FUNC-068, REQ-FUNC-077)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: LOGIC-OUTBOUND-URL, LOGIC-FAVORITES-SHARE. 이 Task가 끝나야 RELEASE-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 2개 안에서 "단위 테스트: 외부 URL·즐겨찾기"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 제품 코드 수정 (실패 시 해당 구현 Task로 되돌림)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-016 | 항공 외부 URL 새 탭 | `app_settings` 값 또는 기본 상수를 query 없이 `noopener,noreferrer` 새 탭으로 연다 |
| REQ-FUNC-018 | 항공 URL 오류 처리 | URL이 없거나 허용목록 밖이면 이동하지 않고 인라인 오류와 "다시 시도" 표시, `console.error` 기록 |
| REQ-FUNC-024 | 숙소 외부 URL 새 탭 | 항공과 같은 방식으로 숙소 URL을 연다 |
| REQ-FUNC-026 | 숙소 URL 오류 처리 | 이동 차단, 입력 유지, 인라인 오류·재시도, `console.error` 기록 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | `localStorage`에 저장, 중복 방지, SCR-001에서 즐겨찾기만 보기 |
| REQ-FUNC-077 | 외부 URL 관리자 설정 | SCR-005 관리 탭에서 HTTPS·허용 호스트만 저장. DB CHECK와 UI 검증 |

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

- LOGIC-OUTBOUND-URL — 외부 이동 URL 허용목록 (Seq 17)
- LOGIC-FAVORITES-SHARE — 즐겨찾기(localStorage)·공유 (Seq 20)

## 7. Expected Files

**생성**

- `src/lib/outbound.test.ts`
- `src/lib/favorites.test.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- UT-04 허용 호스트·HTTPS만, `http:`·`javascript:`·`data:` 거부, query 제거 없이 거부
- UT-09 중복 방지, `localStorage` 예외 시 빈 목록

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 외부 URL에 입력값이 붙지 않음을 단언

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-02 | SCR-003 `/travel-tools` 항공편·숙소 탭 — 필수값·날짜 오류 차단, 요약 일치, 비전달 안내, 외부 링크 `href`(query 없음)·`target`·`rel`, 입력 중 네트워크 요청에 입력값 없음, 탭 간 상태 분리 |
| SMK-07 | SCR-005 관리 탭 — 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원에게는 관리 탭이 렌더링되지 않음 |
| UT-04 | 외부 URL 허용목록 (HTTPS, 허용 호스트, `http:`·`javascript:`·`data:` 거부, query 없음) |
| UT-09 | 즐겨찾기 저장 (중복 방지, `localStorage` 예외 시 빈 목록) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-TRAVEL-TOOLS, E2E-MATE-AUTH

## 12. Verify

- `npm run test:unit -- src/lib/outbound src/lib/favorites`
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
