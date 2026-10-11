# TASK-UNIT-SEARCH-STALE 단위 테스트: 검색·필터·stale

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 52 | UNIT-SEARCH-STALE | 단위 테스트: 검색·필터·stale | Unit Test | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-005, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-067, REQ-NF-028 | 없음 | - | - | LOGIC-SEARCH-FILTER, LOGIC-SAFETY-STALE | `src/lib/destinations/search.test.ts`, `src/lib/safety/stale.test.ts` | 1) UT-01 구분·AND 필터·한글 부분 일치·`kind`·query 직렬화·관련 여행지<br>2) UT-07 7일 경계(고정 기준 시각), 중대 경보 판정 | 해당 없음 (화면 요소 없음) | 해당 없음 | `npm run test:unit -- src/lib/destinations src/lib/safety` | P1 |

## 1. Context

화면과 무관한 기반 작업의 "단위 테스트: 검색·필터·stale" 작업이다. 이 Task는 Unit Test 단계로, 요구사항 10건(REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-005, REQ-FUNC-009, REQ-FUNC-010 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: LOGIC-SEARCH-FILTER, LOGIC-SAFETY-STALE. 이 Task가 끝나야 RELEASE-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 2개 안에서 "단위 테스트: 검색·필터·stale"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 제품 코드 수정 (실패 시 해당 구현 Task로 되돌림)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-001 | 국내·해외 여행지 목록 구분 | SCR-001 국내/해외 구분(검색 구분 선택, 검색 결과 모드 탭). `src/data`의 `scope` 값으로 분류 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | 정적 데이터를 클라이언트에서 AND 조건으로 필터 |
| REQ-FUNC-003 | 키워드 검색 | 여행지명·국가명·테마 한글 부분 일치, 결과 없음 상태 |
| REQ-FUNC-005 | 결과 없음 안내·초기화 | 조건 완화 안내와 "필터 초기화" 버튼, 초기화 시 전체 목록 복원 |
| REQ-FUNC-009 | 관련 여행지 최대 6개 | 같은 국가·테마 여행지를 현재 여행지 제외 후 최대 6개 표시 |
| REQ-FUNC-010 | 필터 상태 URL 반영 | 허용 필터만 query로 직렬화, 잘못된 값은 무시 |
| REQ-FUNC-050 | 7일 초과 stale 경고 | 렌더링 시 계산해 경고 표시, "최신" 배지 숨김 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | 출국권고·여행금지·특별여행주의보를 국가 안전정보 Drawer 최상단에 단계·행동요령·범위 텍스트로 표시 |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | SCR-001 검색 결과에 "여행지"/"안전정보" 유형 라벨과 일치 문자열 강조 |
| REQ-NF-028 | 안전정보 7일 이내 95%, 초과 시 경고 100% | 초과 시 경고는 렌더링 계산으로 100% 표시. 7일 이내 95%는 `src/data/safety.ts`의 `verifiedAt`을 주기적으로 갱신해 재배포하는 운영 작업으로 유지 |

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

- LOGIC-SEARCH-FILTER — 여행지 검색·필터·URL 상태 (Seq 15)
- LOGIC-SAFETY-STALE — 안전정보 stale 계산 (Seq 19)

## 7. Expected Files

**생성**

- `src/lib/destinations/search.test.ts`
- `src/lib/safety/stale.test.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- UT-01 구분·AND 필터·한글 부분 일치·`kind`·query 직렬화·관련 여행지
- UT-07 7일 경계(고정 기준 시각), 중대 경보 판정

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 개인정보·비밀값을 다루지 않는다. 비밀값을 코드·로그에 쓰지 않는다

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| UT-01 | 여행지 필터·키워드 검색·국내/해외 구분·검색 결과 유형(`kind`)·관련 여행지·URL query 직렬화 |
| UT-07 | 안전정보 stale 계산 (7일 경계, 고정 기준 시각) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-PUBLIC-SMOKE

## 12. Verify

- `npm run test:unit -- src/lib/destinations src/lib/safety`
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
