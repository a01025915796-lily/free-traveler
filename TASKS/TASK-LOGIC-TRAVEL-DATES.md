# TASK-LOGIC-TRAVEL-DATES 항공·숙소·동행 날짜와 지역 검증

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 16 | LOGIC-TRAVEL-DATES | 항공·숙소·동행 날짜와 지역 검증 | Logic | IMPLEMENT | REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-031 | 없음 | - | - | DATA-DESTINATIONS | `src/lib/trip/validation.ts`, `src/lib/trip/regions.ts` | 1) 출발일 < 오늘, 귀국일 < 출발일 차단<br>2) 체크인 < 오늘, 체크아웃 ≤ 체크인 차단<br>3) 동행글 역전 날짜·과거 종료일 차단<br>4) 국가별 지역 선택지, 국가 변경 시 지역 초기화<br>5) 기준 날짜 Asia/Seoul | 해당 없음 (화면 요소 없음) | 1) 입력값은 함수 인자로만 받고 저장하지 않음 | UNIT-TRAVEL-DATES | P0 |

## 1. Context

화면과 무관한 기반 작업의 "항공·숙소·동행 날짜와 지역 검증" 작업이다. 이 Task는 Logic 단계로, 요구사항 5건(REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-031)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: DATA-DESTINATIONS. 이 Task가 끝나야 COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL, COMP-SCR003-MATE-COMPOSE, UNIT-TRAVEL-DATES를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 2개 안에서 "항공·숙소·동행 날짜와 지역 검증"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-012 | 국가별 지역만 선택 | 지역 선택지를 국가 데이터에서 생성, 국가 변경 시 지역 초기화 |
| REQ-FUNC-013 | 항공 날짜 검증 | 출발일 < 오늘 또는 귀국일 < 출발일이면 진행 차단·원인 표시 |
| REQ-FUNC-020 | 국가별 지역만 선택 | 항공과 같은 지역 선택 컴포넌트 사용 |
| REQ-FUNC-021 | 숙소 날짜 검증 | 체크인 < 오늘 또는 체크아웃 ≤ 체크인이면 진행 차단 |
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

- DATA-DESTINATIONS — 여행지 정적 데이터 (Seq 6)

## 7. Expected Files

**생성**

- `src/lib/trip/validation.ts`
- `src/lib/trip/regions.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 출발일 < 오늘, 귀국일 < 출발일 차단
- 체크인 < 오늘, 체크아웃 ≤ 체크인 차단
- 동행글 역전 날짜·과거 종료일 차단
- 국가별 지역 선택지, 국가 변경 시 지역 초기화
- 기준 날짜 Asia/Seoul

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 입력값은 함수 인자로만 받고 저장하지 않음

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-02 | SCR-003 `/travel-tools` 항공편·숙소 탭 — 필수값·날짜 오류 차단, 요약 일치, 비전달 안내, 외부 링크 `href`(query 없음)·`target`·`rel`, 입력 중 네트워크 요청에 입력값 없음, 탭 간 상태 분리 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| UT-02 | 항공 날짜 검증 (오늘 이전 출발일, 귀국일 < 출발일, 오늘 경계값) |
| UT-03 | 숙소 날짜 검증 (오늘 이전 체크인, 체크아웃 ≤ 체크인) |
| UT-06 | 자동 마감 계산 (`end_date` 기준, Asia/Seoul) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH

## 12. Verify

- UNIT-TRAVEL-DATES
- UNIT-TRAVEL-DATES 실행: `npm run test:unit -- src/lib/trip`
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
