# TASK-DEPLOY-VERCEL-SUPABASE Vercel·Supabase 설정 확인

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 59 | DEPLOY-VERCEL-SUPABASE | Vercel·Supabase 설정 확인 | Deploy | IMPLEMENT | REQ-FUNC-066, REQ-NF-012, REQ-NF-016, REQ-NF-034 | 없음 | - | - | SETUP-CI, DB-SEED-BASE, AUTH-SUPABASE | `docs/checks/RELEASE_VERCEL.md`, `docs/checks/RELEASE_SUPABASE.md` | 1) Vercel Git 연결, Preview·Production에 `NEXT_PUBLIC_*` 3개 등록<br>2) Supabase 마이그레이션 적용, Auth Redirect URL에 Preview·Production `/auth/callback` 등록<br>3) HTTP → HTTPS 리다이렉트 확인(`curl -I`)<br>4) 요금제(Hobby·Free) 확인<br>5) Production 승격은 사용자가 직접 | 해당 없음 (화면 요소 없음) | 1) Service Role Key를 Vercel에 등록하지 않음<br>2) build 산출물(`.next/static`)에 비밀값 없음 | `docs/checks/RELEASE_VERCEL.md`, `RELEASE_SUPABASE.md` 기록 | P0 |

## 1. Context

화면과 무관한 기반 작업의 "Vercel·Supabase 설정 확인" 작업이다. 이 Task는 Deploy 단계로, 요구사항 4건(REQ-FUNC-066, REQ-NF-012, REQ-NF-016, REQ-NF-034)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: SETUP-CI, DB-SEED-BASE, AUTH-SUPABASE. 이 Task가 끝나야 MANUAL-CHECK, RELEASE-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 2개 안에서 "Vercel·Supabase 설정 확인"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | SCR-005 로그인 탭과 기술 Route `/auth/callback`에서 Supabase Auth 사용. 이메일 미인증 계정은 로그인·쓰기 불가 |
| REQ-NF-012 | TLS 1.2 이상 | Vercel 기본 HTTPS, Supabase HTTPS 엔드포인트만 사용 |
| REQ-NF-016 | 비밀키 환경변수 관리 | 클라이언트에는 `NEXT_PUBLIC_*` 공개 값만 사용, Service Role Key 미사용, `.env*` Git 제외 |
| REQ-NF-034 | 월 인프라 비용 ≤100,000원 | Vercel·Supabase 무료 또는 최저 요금제, 유료 부가 기능 미사용 |

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

- SETUP-CI — GitHub Actions CI (Seq 2)
- DB-SEED-BASE — 기본 설정·테스트 데이터 시드 (Seq 11)
- AUTH-SUPABASE — Supabase 클라이언트·세션·Proxy (Seq 12)

## 7. Expected Files

**생성**

- `docs/checks/RELEASE_VERCEL.md`
- `docs/checks/RELEASE_SUPABASE.md`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- Vercel Git 연결, Preview·Production에 `NEXT_PUBLIC_*` 3개 등록
- Supabase 마이그레이션 적용, Auth Redirect URL에 Preview·Production `/auth/callback` 등록
- HTTP → HTTPS 리다이렉트 확인(`curl -I`)
- 요금제(Hobby·Free) 확인
- Production 승격은 사용자가 직접

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- Service Role Key를 Vercel에 등록하지 않음
- build 산출물(`.next/static`)에 비밀값 없음

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-01 | 가입 인증 메일 수신·인증 링크(`/auth/callback`), 비밀번호 재설정 메일 |
| RAC-09 | 보안: 모든 테이블 RLS 활성화, 클라이언트 번들에 비밀값 없음, 항공·숙소 입력값이 네트워크·URL·저장소에 남지 않음 (증거: MAN-04, build 산출물 검사, SMK-02) |
| RAC-10 | Vercel 배포: HTTPS, 환경변수 3개 등록, Supabase Auth Redirect URL에 배포 도메인 `/auth/callback` 등록, 요금제 기준 충족 (증거: 배포 설정 화면, `curl -I`) |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-MATE-AUTH, MANUAL-CHECK, RELEASE-CHECK

## 12. Verify

- `docs/checks/RELEASE_VERCEL.md`, `RELEASE_SUPABASE.md` 기록
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
- Service Role Key를 Vercel·저장소에 등록하지 않는다
- Production 승격을 직접 하지 않는다
