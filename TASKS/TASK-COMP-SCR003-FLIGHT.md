# TASK-COMP-SCR003-FLIGHT 항공편 입력·요약·외부 이동

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 31 | COMP-SCR003-FLIGHT | 항공편 입력·요약·외부 이동 | Component | IMPLEMENT | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-054, REQ-NF-017 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | GLOBAL-UI-KIT, LOGIC-TRAVEL-DATES, LOGIC-OUTBOUND-URL, DB-ACCESS | `src/components/tools/TripConditionForm.tsx`, `src/components/tools/TripSummaryCard.tsx`, `src/components/tools/OutboundButton.tsx` | 1) 국가·지역/도시·출발일·귀국일(라벨·도움말·오류)<br>2) 필수값 누락·과거 출발일·귀국일 < 출발일 차단<br>3) 요약: 국가·도시·날짜·박 수, 비전달 고지, 공식 판단 비대체 고지, 수정 시 값 유지<br>4) "항공편 보러 가기"는 `app_settings` 또는 기본 URL을 새 탭으로, 실패 시 Alert + 다시 시도(입력 유지) | 1) Form 7열 + 요약 Card 5열(스크롤 고정) → Mobile 1열<br>2) 비활성 버튼 회색 + 남은 항목 체크리스트 | 1) 입력값은 컴포넌트 메모리에만, 서버·DB·URL·쿠키·`localStorage`·로그·분석으로 보내지 않음<br>2) 외부 URL에 query 없음, `noopener,noreferrer` | E2E-TRAVEL-TOOLS, UNIT-TRAVEL-DATES | P0 |

## 1. Context

SCR-003 통합 여행 준비 화면(`/travel-tools`)의 "항공편 입력·요약·외부 이동" 작업이다. 이 Task는 Component 단계로, 요구사항 10건(REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT, LOGIC-TRAVEL-DATES, LOGIC-OUTBOUND-URL, DB-ACCESS. 이 Task가 끝나야 COMP-SCR003-HOTEL, PAGE-SCR003를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 3개 안에서 "항공편 입력·요약·외부 이동"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Page Entry(`page.tsx`) 조립 (Page Owner 소관)
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
| REQ-FUNC-054 | 공식 판단 비대체 고지 | SCR-001 국가 안전정보 Drawer와 SCR-003 항공 요약에 원문 재확인 안내 표시 |
| REQ-NF-017 | 항공·숙소 원시 입력 미보존 | REQ-FUNC-017·025와 같은 방식 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-003 통합 여행 준비 (핵심) |
| Route | `/travel-tools` |
| Page Entry | `src/app/travel-tools/page.tsx` |
| 이 Task의 역할 | Page Owner가 조립할 Component |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §4 SCR-003 통합 여행 준비 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.3 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `e60c66e71011429289057057824b567c`, Mobile `ffa60caca42c439cb75b48963f5f1d05`
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-UI-KIT — 공통 UI Component (Seq 4)
- LOGIC-TRAVEL-DATES — 항공·숙소·동행 날짜와 지역 검증 (Seq 16)
- LOGIC-OUTBOUND-URL — 외부 이동 URL 허용목록 (Seq 17)
- DB-ACCESS — 동행·요청·차단·신고·설정 데이터 접근 계층 (Seq 14)

## 7. Expected Files

**생성**

- `src/components/tools/TripConditionForm.tsx`
- `src/components/tools/TripSummaryCard.tsx`
- `src/components/tools/OutboundButton.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 국가·지역/도시·출발일·귀국일(라벨·도움말·오류)
- 필수값 누락·과거 출발일·귀국일 < 출발일 차단
- 요약: 국가·도시·날짜·박 수, 비전달 고지, 공식 판단 비대체 고지, 수정 시 값 유지
- "항공편 보러 가기"는 `app_settings` 또는 기본 URL을 새 탭으로, 실패 시 Alert + 다시 시도(입력 유지)

## 9. Visual AC

- Form 7열 + 요약 Card 5열(스크롤 고정) → Mobile 1열
- 비활성 버튼 회색 + 남은 항목 체크리스트

## 10. Security/Privacy AC

- 입력값은 컴포넌트 메모리에만, 서버·DB·URL·쿠키·`localStorage`·로그·분석으로 보내지 않음
- 외부 URL에 query 없음, `noopener,noreferrer`
- 항공·숙소 입력값(국가·도시·날짜)을 서버·DB·URL(query 포함)·쿠키·`localStorage`·로그·분석으로 보내지 않는다

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| SMK-02 | SCR-003 `/travel-tools` 항공편·숙소 탭 — 필수값·날짜 오류 차단, 요약 일치, 비전달 안내, 외부 링크 `href`(query 없음)·`target`·`rel`, 입력 중 네트워크 요청에 입력값 없음, 탭 간 상태 분리 |
| UT-02 | 항공 날짜 검증 (오늘 이전 출발일, 귀국일 < 출발일, 오늘 경계값) |
| UT-04 | 외부 URL 허용목록 (HTTPS, 허용 호스트, `http:`·`javascript:`·`data:` 거부, query 없음) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-TRAVEL-DATES, UNIT-OUTBOUND-FAVORITES, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS

## 12. Verify

- E2E-TRAVEL-TOOLS, UNIT-TRAVEL-DATES
- E2E-TRAVEL-TOOLS: 이 Task에서는 실행하지 않는다. E2E-TRAVEL-TOOLS Task가 spec을 만든 뒤 `npx playwright test e2e/travel-tools.spec.ts --project=chromium`로 검증한다. 구현 시 "보류 — E2E-TRAVEL-TOOLS에서 검증"으로 기록한다 (`/implement-task` 규칙 6).
- UNIT-TRAVEL-DATES 실행: `npm run test:unit -- src/lib/trip`
- `npm run lint` · `npm run typecheck` 오류 0
- `git diff --name-only` 결과가 §7 Expected Files 안에 있음

기대 결과: 보류로 표시한 Playwright를 뺀 위 명령이 모두 성공하고 §8~§10 AC를 하나씩 확인했다.

## 13. Definition of Done

- §8 Functional AC, §9 Visual AC, §10 Security/Privacy AC를 모두 충족
- §12 Verify 명령 통과(Playwright는 보류로 기록)
- 변경 파일이 §7 Expected Files 안에만 있음
- `docs/UIUX_TRACEABILITY.md`의 해당 요구사항 Status를 IMPLEMENTED로 갱신(검증 전)

## 14. Forbidden

- Expected Files 밖 파일을 수정하거나 새로 만들지 않는다. 필요하면 작업을 멈추고 Task 목록 변경을 요청한다
- 자체 Route Handler(`route.ts`)·`src/app/api/*`·Server Action(`"use server"`)을 만들지 않는다
- EXCLUDED 요구사항(콘텐츠 CMS, 미디어 업로드·라이선스, 감사 로그, 운영자 제재, 분석 이벤트, 탈퇴 자동 삭제, 참가 요청 취소, 이메일 사업자 연동 등)을 구현하지 않는다
- AWS·EC2·자동 Merge·Merge Runner 관련 작업을 하지 않는다
- Branch 생성·Commit·Push·PR은 사용자가 요청할 때만 한다
- Page Entry(`page.tsx`)를 수정하지 않는다(Page Owner 소관)
- Placeholder 문구와 내용 없는 Card를 쓰지 않는다
- 항공·숙소 입력값을 서버·DB·URL·쿠키·`localStorage`·로그·분석으로 보내지 않는다
- Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI를 쓰지 않는다
