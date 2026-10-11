# TASK-AUTH-SUPABASE Supabase 클라이언트·세션·Proxy

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 12 | AUTH-SUPABASE | Supabase 클라이언트·세션·Proxy | Auth | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-066, REQ-NF-013, REQ-NF-014, REQ-NF-016 | 없음 | - | - | SETUP-PROJECT, DB-SCHEMA-BASE | `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/proxy.ts`, `src/lib/auth/session.ts` | 1) `@supabase/ssr` 브라우저·서버 읽기 클라이언트<br>2) `src/proxy.ts`는 세션 쿠키 갱신만 수행(Next.js 16 Proxy)<br>3) 세션·프로필(`is_adult`, `role`) 조회 헬퍼, `next` 파라미터는 `/`로 시작하는 내부 경로만 허용<br>4) Route Handler·Server Action 없음 | 해당 없음 (화면 요소 없음) | 1) 쿠키 SameSite=Lax<br>2) Service Role Key 미사용<br>3) 열린 리다이렉트 방지 | `npm run typecheck`, E2E-MATE-AUTH | P0 |

## 1. Context

화면과 무관한 기반 작업의 "Supabase 클라이언트·세션·Proxy" 작업이다. 이 Task는 Auth 단계로, 요구사항 5건(REQ-FUNC-027, REQ-FUNC-066, REQ-NF-013, REQ-NF-014, REQ-NF-016)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: SETUP-PROJECT, DB-SCHEMA-BASE. 이 Task가 끝나야 DB-ACCESS, TECH-AUTH-CALLBACK, COMP-SCR003-MATE-COMPOSE, COMP-SCR004-APPLY, COMP-SCR005-AUTH, COMP-SCR005-PROFILE, PAGE-SCR005, DEPLOY-VERCEL-SUPABASE를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 4개 안에서 "Supabase 클라이언트·세션·Proxy"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-027 | 동행 쓰기에 인증 세션 필요 | 비로그인 쓰기 시도는 `/account?tab=login&next=<원래 경로>`로 이동. RLS가 `auth.uid()` 없는 쓰기를 거부 |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | SCR-005 로그인 탭과 기술 Route `/auth/callback`에서 Supabase Auth 사용. 이메일 미인증 계정은 로그인·쓰기 불가 |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | 모든 테이블 RLS 활성화, `role`은 DB에서만 판단 |
| REQ-NF-014 | CSRF·SameSite | 자체 상태 변경 엔드포인트 없음. Supabase 요청은 Authorization 헤더, `@supabase/ssr` 세션 쿠키는 SameSite=Lax |
| REQ-NF-016 | 비밀키 환경변수 관리 | 클라이언트에는 `NEXT_PUBLIC_*` 공개 값만 사용, Service Role Key 미사용, `.env*` Git 제외 |

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
- DB-SCHEMA-BASE — Supabase 6개 테이블 스키마 (Seq 9)

## 7. Expected Files

**생성**

- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/proxy.ts`
- `src/lib/auth/session.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- `@supabase/ssr` 브라우저·서버 읽기 클라이언트
- `src/proxy.ts`는 세션 쿠키 갱신만 수행(Next.js 16 Proxy)
- 세션·프로필(`is_adult`, `role`) 조회 헬퍼, `next` 파라미터는 `/`로 시작하는 내부 경로만 허용
- Route Handler·Server Action 없음

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 쿠키 SameSite=Lax
- Service Role Key 미사용
- 열린 리다이렉트 방지

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-01 | 가입 인증 메일 수신·인증 링크(`/auth/callback`), 비밀번호 재설정 메일 |
| MAN-04 | Supabase 대시보드에서 RLS 활성화·정책 목록 확인 |
| RAC-09 | 보안: 모든 테이블 RLS 활성화, 클라이언트 번들에 비밀값 없음, 항공·숙소 입력값이 네트워크·URL·저장소에 남지 않음 (증거: MAN-04, build 산출물 검사, SMK-02) |
| SMK-03 | SCR-004, SCR-003 (비회원) — 동행 목록·상세 열람 가능, 참가 요청·신고·차단·동행 구하기 탭 진입 시 `/account?tab=login&next=…`로 안내 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-05 | SCR-004, SCR-005 (회원 A·B) — B 참가 요청 → 중복 요청 차단 → A 내 활동에서 승인·거절 → B 내 활동에 상태 표시, 제3자는 요청을 볼 수 없음 |
| SMK-07 | SCR-005 관리 탭 — 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원에게는 관리 탭이 렌더링되지 않음 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: TEST-RLS-BASIC, E2E-MATE-AUTH, MANUAL-CHECK, RELEASE-CHECK

## 12. Verify

- `npm run typecheck`, E2E-MATE-AUTH
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
