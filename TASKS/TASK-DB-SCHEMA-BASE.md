# TASK-DB-SCHEMA-BASE Supabase 6개 테이블 스키마

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 9 | DB-SCHEMA-BASE | Supabase 6개 테이블 스키마 | DB | IMPLEMENT | REQ-FUNC-031, REQ-FUNC-033, REQ-FUNC-035, REQ-FUNC-077, REQ-FUNC-080, REQ-NF-015 | 없음 | - | - | SETUP-PROJECT | `supabase/migrations/0001_schema.sql` | 1) 테이블 6개만: `profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings`<br>2) `profiles`에 이메일·생년월일 컬럼 없음(`is_adult`, `adult_verified_at`, `role`)<br>3) `mate_posts` `end_date >= start_date`, `capacity` 1~10, 길이 CHECK, `safety_agreed_at`·`policy_version`<br>4) `mate_applications` 상태 PENDING/ACCEPTED/REJECTED, `(post_id, applicant_id)` 부분 UNIQUE<br>5) `app_settings.value`는 `https://` CHECK<br>6) 여행지·안전·대표·감사 로그·미디어 테이블 없음 | 해당 없음 (화면 요소 없음) | 1) 개인정보 최소 수집(닉네임·연령대·선택 성별·스타일·자기소개)<br>2) 항공·숙소 입력값 테이블 없음 | `supabase db reset` (로컬) 성공, TEST-RLS-BASIC | P0 |

## 1. Context

화면과 무관한 기반 작업의 "Supabase 6개 테이블 스키마" 작업이다. 이 Task는 DB 단계로, 요구사항 6건(REQ-FUNC-031, REQ-FUNC-033, REQ-FUNC-035, REQ-FUNC-077, REQ-FUNC-080, REQ-NF-015)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: SETUP-PROJECT. 이 Task가 끝나야 DB-RLS-BASE, AUTH-SUPABASE를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "Supabase 6개 테이블 스키마"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-031 | 모집글 입력 항목 | 제목·국가·지역·시작일·종료일·인원·선호 조건·스타일·설명·안전수칙 동의. 누락·역전 날짜·과거 종료일 차단 |
| REQ-FUNC-033 | 이메일·연락처 비노출 | `profiles`에 이메일 컬럼을 두지 않고 공개 컬럼만 조회 |
| REQ-FUNC-035 | 중복 요청 차단 | 부분 UNIQUE 인덱스와 UI 오류 메시지 |
| REQ-FUNC-077 | 외부 URL 관리자 설정 | SCR-005 관리 탭에서 HTTPS·허용 호스트만 저장. DB CHECK와 UI 검증 |
| REQ-FUNC-080 | 정책 문서·안전수칙 동의 기록 | Footer 정책 Modal 4종. SCR-003 동행 구하기 탭에서 글 작성 시 `safety_agreed_at`, `policy_version` 저장 |
| REQ-NF-015 | 입력 검증·XSS 차단 | React 기본 이스케이프, 사용자 입력에 `dangerouslySetInnerHTML` 금지, 길이 제한 DB CHECK |

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

- `supabase/migrations/0001_schema.sql`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 테이블 6개만: `profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings`
- `profiles`에 이메일·생년월일 컬럼 없음(`is_adult`, `adult_verified_at`, `role`)
- `mate_posts` `end_date >= start_date`, `capacity` 1~10, 길이 CHECK, `safety_agreed_at`·`policy_version`
- `mate_applications` 상태 PENDING/ACCEPTED/REJECTED, `(post_id, applicant_id)` 부분 UNIQUE
- `app_settings.value`는 `https://` CHECK
- 여행지·안전·대표·감사 로그·미디어 테이블 없음

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 개인정보 최소 수집(닉네임·연령대·선택 성별·스타일·자기소개)
- 항공·숙소 입력값 테이블 없음

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-05 | SCR-004, SCR-005 (회원 A·B) — B 참가 요청 → 중복 요청 차단 → A 내 활동에서 승인·거절 → B 내 활동에 상태 표시, 제3자는 요청을 볼 수 없음 |
| SMK-07 | SCR-005 관리 탭 — 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원에게는 관리 탭이 렌더링되지 않음 |
| UT-04 | 외부 URL 허용목록 (HTTPS, 허용 호스트, `http:`·`javascript:`·`data:` 거부, query 없음) |
| UT-06 | 자동 마감 계산 (`end_date` 기준, Asia/Seoul) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-TRAVEL-DATES, UNIT-MATE-STATE, UNIT-OUTBOUND-FAVORITES, E2E-PUBLIC-SMOKE, E2E-MATE-AUTH

## 12. Verify

- `supabase db reset` (로컬) 성공, TEST-RLS-BASIC
- TEST-RLS-BASIC 실행: `npm run test:unit -- src/__tests__/rls` (테스트 계정 환경변수 필요)
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
- `profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`, `app_settings` 6개 밖의 테이블을 만들지 않는다
- 여행지·안전·대표 콘텐츠를 DB에 넣지 않는다
