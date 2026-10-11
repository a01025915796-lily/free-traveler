# TASK-E2E-TRAVEL-TOOLS Smoke: 여행 준비(항공·숙소)

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 57 | E2E-TRAVEL-TOOLS | Smoke: 여행 준비(항공·숙소) | E2E Test | IMPLEMENT | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-FUNC-054, REQ-NF-017 | 없음 | - | - | PAGE-SCR003, DB-SEED-BASE | `e2e/travel-tools.spec.ts` | 1) SMK-02: 필수값·날짜 오류 차단, 요약 일치, 비전달 고지, 외부 링크 `href`(query 없음)·`target`·`rel`, 탭 간 상태 분리<br>2) 입력 중 발생한 모든 네트워크 요청과 URL에 입력값(국가·도시·날짜) 없음을 단언<br>3) Mobile 390에서도 실행<br>4) 핵심 흐름(`test.describe` 단위): FLOW-03 항공·숙소 입력 → 요약 → 외부 이동, 입력값 비전송(SMK-02) | 해당 없음 (화면 요소 없음) | 1) 항공·숙소 입력값(국가·도시·날짜)이 서버·DB·URL(query 포함)에 남지 않음을 단언하는 것이 테스트 핵심 | `npx playwright test e2e/travel-tools.spec.ts --project=chromium` | P0 |

## 1. Context

화면과 무관한 기반 작업의 "Smoke: 여행 준비(항공·숙소)" 작업이다. 이 Task는 E2E Test 단계로, 요구사항 18건(REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: PAGE-SCR003, DB-SEED-BASE. 이 Task가 끝나야 RELEASE-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "Smoke: 여행 준비(항공·숙소)"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 제품 코드 수정 (실패 시 해당 구현 Task로 되돌림)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-011 | 항공 필수 입력 4개 | SCR-003 항공편 탭(`/travel-tools?tab=flight`): 국가, 지역·도시, 출발일, 귀국일. 라벨·도움말·오류 영역 포함 |
| REQ-FUNC-012 | 국가별 지역만 선택 | 지역 선택지를 국가 데이터에서 생성, 국가 변경 시 지역 초기화 |
| REQ-FUNC-013 | 항공 날짜 검증 | 출발일 < 오늘 또는 귀국일 < 출발일이면 진행 차단·원인 표시 |
| REQ-FUNC-014 | 항공 입력 요약 | 요약 단계 표시. "수정"으로 돌아가면 컴포넌트 상태의 값 유지 |
| REQ-FUNC-015 | 항공 비전달 안내 | 폼과 요약에 "입력값은 외부 사이트로 전달되지 않습니다" 표시, 버튼에 `aria-describedby` 연결 |
| REQ-FUNC-016 | 항공 외부 URL 새 탭 | `app_settings` 값 또는 기본 상수를 query 없이 `noopener,noreferrer` 새 탭으로 연다 |
| REQ-FUNC-017 | 항공 입력값 미저장 | 항공 폼용 서버 API·분석 이벤트를 만들지 않고 값은 컴포넌트 상태에만 둔다 |
| REQ-FUNC-018 | 항공 URL 오류 처리 | URL이 없거나 허용목록 밖이면 이동하지 않고 인라인 오류와 "다시 시도" 표시, `console.error` 기록 |
| REQ-FUNC-019 | 숙소 필수 입력 4개 | SCR-003 숙소 탭(`/travel-tools?tab=hotel`): 국가, 지역·도시, 체크인, 체크아웃 |
| REQ-FUNC-020 | 국가별 지역만 선택 | 항공과 같은 지역 선택 컴포넌트 사용 |
| REQ-FUNC-021 | 숙소 날짜 검증 | 체크인 < 오늘 또는 체크아웃 ≤ 체크인이면 진행 차단 |
| REQ-FUNC-022 | 숙소 입력 요약 | 국가·지역·체크인·체크아웃 요약, 입력값과 일치 |
| REQ-FUNC-023 | 숙소 비전달 안내 | 폼과 요약에 비전달 안내 표시 |
| REQ-FUNC-024 | 숙소 외부 URL 새 탭 | 항공과 같은 방식으로 숙소 URL을 연다 |
| REQ-FUNC-025 | 숙소 입력값 미저장 | 서버 API·분석 이벤트 없음, 컴포넌트 상태만 사용 |
| REQ-FUNC-026 | 숙소 URL 오류 처리 | 이동 차단, 입력 유지, 인라인 오류·재시도, `console.error` 기록 |
| REQ-FUNC-054 | 공식 판단 비대체 고지 | SCR-001 국가 안전정보 Drawer와 SCR-003 항공 요약에 원문 재확인 안내 표시 |
| REQ-NF-017 | 항공·숙소 원시 입력 미보존 | REQ-FUNC-017·025와 같은 방식 |

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
- DB-SEED-BASE — 기본 설정·테스트 데이터 시드 (Seq 11)

## 7. Expected Files

**생성**

- `e2e/travel-tools.spec.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- SMK-02: 필수값·날짜 오류 차단, 요약 일치, 비전달 고지, 외부 링크 `href`(query 없음)·`target`·`rel`, 탭 간 상태 분리
- 입력 중 발생한 모든 네트워크 요청과 URL에 입력값(국가·도시·날짜) 없음을 단언
- Mobile 390에서도 실행
- 핵심 흐름(`test.describe` 단위): FLOW-03 항공·숙소 입력 → 요약 → 외부 이동, 입력값 비전송(SMK-02)

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 항공·숙소 입력값(국가·도시·날짜)이 서버·DB·URL(query 포함)에 남지 않음을 단언하는 것이 테스트 핵심
- 항공·숙소 입력값(국가·도시·날짜)을 서버·DB·URL(query 포함)·쿠키·`localStorage`·로그·분석으로 보내지 않는다

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| SMK-02 | SCR-003 `/travel-tools` 항공편·숙소 탭 — 필수값·날짜 오류 차단, 요약 일치, 비전달 안내, 외부 링크 `href`(query 없음)·`target`·`rel`, 입력 중 네트워크 요청에 입력값 없음, 탭 간 상태 분리 |
| UT-02 | 항공 날짜 검증 (오늘 이전 출발일, 귀국일 < 출발일, 오늘 경계값) |
| UT-03 | 숙소 날짜 검증 (오늘 이전 체크인, 체크아웃 ≤ 체크인) |
| UT-04 | 외부 URL 허용목록 (HTTPS, 허용 호스트, `http:`·`javascript:`·`data:` 거부, query 없음) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-TRAVEL-DATES, UNIT-OUTBOUND-FAVORITES, E2E-PUBLIC-SMOKE

## 12. Verify

- `npx playwright test e2e/travel-tools.spec.ts --project=chromium`
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
- 항공·숙소 입력값을 서버·DB·URL·쿠키·`localStorage`·로그·분석으로 보내지 않는다
