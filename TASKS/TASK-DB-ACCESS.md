# TASK-DB-ACCESS 동행·요청·차단·신고·설정 데이터 접근 계층

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 14 | DB-ACCESS | 동행·요청·차단·신고·설정 데이터 접근 계층 | DB | IMPLEMENT | REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-043, REQ-FUNC-077 | 없음 | - | - | DB-RLS-BASE, AUTH-SUPABASE, LOGIC-MATE-STATE | `src/lib/db/profiles.ts`, `src/lib/db/mates.ts`, `src/lib/db/applications.ts`, `src/lib/db/blocks.ts`, `src/lib/db/reports.ts`, `src/lib/db/settings.ts` | 1) 브라우저 Supabase 클라이언트로 RLS 아래에서 읽기·쓰기(자체 API 없음)<br>2) 동행글 목록: 국가·지역·기간 겹침·연령대·성별·스타일·상태 필터, 모집중은 `end_date >= 오늘`(조회 시 자동 마감 계산)<br>3) 공개 프로필 컬럼만 select(이메일 없음)<br>4) 요청 생성·승인·거절, 중복 요청 오류 구분<br>5) 차단·해제, 신고 생성(접수번호·시각 반환), 신고 상태 변경, 외부 URL 저장<br>6) 결과는 Toast·화면 상태로 알림(이메일 없음) | 해당 없음 (화면 요소 없음) | 1) 클라이언트에서 다른 사용자 비공개 데이터 요청하지 않음<br>2) 쓰기 전 입력 길이·형식 검증 | `npm run typecheck`, TEST-RLS-BASIC, E2E-MATE-AUTH | P0 |

## 1. Context

화면과 무관한 기반 작업의 "동행·요청·차단·신고·설정 데이터 접근 계층" 작업이다. 이 Task는 DB 단계로, 요구사항 12건(REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: DB-RLS-BASE, AUTH-SUPABASE, LOGIC-MATE-STATE. 이 Task가 끝나야 COMP-SCR001-MATES-CURATOR, COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL, COMP-SCR003-MATE-COMPOSE, COMP-SCR004-FILTER-LIST, COMP-SCR004-DETAIL, COMP-SCR004-APPLY, COMP-SCR004-REPORT-BLOCK, COMP-SCR005-PROFILE, COMP-SCR005-ACTIVITY, COMP-SCR005-ADMIN, PAGE-SCR001, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, TEST-RLS-BASIC를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 6개 안에서 "동행·요청·차단·신고·설정 데이터 접근 계층"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-030 | 동행글 필터 | 국가·지역·기간 겹침·연령대·성별·스타일·모집 상태 필터를 Supabase 쿼리로 처리, 차단 관계 글 제외 |
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

- DB-RLS-BASE — RLS 정책과 차단 함수 (Seq 10)
- AUTH-SUPABASE — Supabase 클라이언트·세션·Proxy (Seq 12)
- LOGIC-MATE-STATE — 동행글·참가 요청 상태 전이 (Seq 13)

## 7. Expected Files

**생성**

- `src/lib/db/profiles.ts`
- `src/lib/db/mates.ts`
- `src/lib/db/applications.ts`
- `src/lib/db/blocks.ts`
- `src/lib/db/reports.ts`
- `src/lib/db/settings.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 브라우저 Supabase 클라이언트로 RLS 아래에서 읽기·쓰기(자체 API 없음)
- 동행글 목록: 국가·지역·기간 겹침·연령대·성별·스타일·상태 필터, 모집중은 `end_date >= 오늘`(조회 시 자동 마감 계산)
- 공개 프로필 컬럼만 select(이메일 없음)
- 요청 생성·승인·거절, 중복 요청 오류 구분
- 차단·해제, 신고 생성(접수번호·시각 반환), 신고 상태 변경, 외부 URL 저장
- 결과는 Toast·화면 상태로 알림(이메일 없음)

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 클라이언트에서 다른 사용자 비공개 데이터 요청하지 않음
- 쓰기 전 입력 길이·형식 검증

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-05 | SCR-004, SCR-005 (회원 A·B) — B 참가 요청 → 중복 요청 차단 → A 내 활동에서 승인·거절 → B 내 활동에 상태 표시, 제3자는 요청을 볼 수 없음 |
| SMK-06 | SCR-004, SCR-005 — 신고 접수번호·시각 3초 이내 표시, 차단 후 상대 글·프로필이 목록에서 사라짐, 내 활동에서 차단 해제 |
| SMK-07 | SCR-005 관리 탭 — 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원에게는 관리 탭이 렌더링되지 않음 |
| UT-04 | 외부 URL 허용목록 (HTTPS, 허용 호스트, `http:`·`javascript:`·`data:` 거부, query 없음) |
| UT-06 | 자동 마감 계산 (`end_date` 기준, Asia/Seoul) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-MATE-STATE, UNIT-OUTBOUND-FAVORITES, TEST-RLS-BASIC, E2E-MATE-AUTH

## 12. Verify

- `npm run typecheck`, TEST-RLS-BASIC, E2E-MATE-AUTH
- TEST-RLS-BASIC 실행: `npm run test:unit -- src/__tests__/rls` (테스트 계정 환경변수 필요)
- E2E-MATE-AUTH: 이 Task에서는 실행하지 않는다. E2E-MATE-AUTH Task가 spec을 만든 뒤 `npx playwright test e2e/mate-auth.spec.ts --project=chromium` (테스트 계정 환경변수 필요)로 검증한다. 구현 시 "보류 — E2E-MATE-AUTH에서 검증"으로 기록한다 (`/implement-task` 규칙 6).
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
- `profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings` 6개 밖의 테이블을 만들지 않는다
- 여행지·안전·대표 콘텐츠를 DB에 넣지 않는다
