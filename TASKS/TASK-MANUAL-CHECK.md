# TASK-MANUAL-CHECK 수동 확인: 메일·키보드·스크린리더·성능

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 60 | MANUAL-CHECK | 수동 확인: 메일·키보드·스크린리더·성능 | Manual Check | IMPLEMENT | REQ-FUNC-066, REQ-FUNC-079, REQ-NF-001, REQ-NF-003, REQ-NF-006, REQ-NF-007, REQ-NF-023, REQ-NF-025, REQ-FUNC-027, REQ-FUNC-044, REQ-NF-013 | 없음 | - | - | PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, TECH-AUTH-CALLBACK, DEPLOY-VERCEL-SUPABASE | `docs/checks/MANUAL_CHECK.md` | 1) MAN-01 가입 인증·재설정 메일 수신과 `/auth/callback` 처리<br>2) MAN-02 키보드만으로 5개 Screen 핵심 흐름, VoiceOver로 폼 오류·Drawer 제목<br>3) MAN-03 Preview URL 모바일 Lighthouse: Performance ≥85, LCP ≤2.5s, CLS ≤0.1<br>4) MAN-04 Supabase 대시보드 RLS 활성화·정책<br>5) 결과·날짜·확인자를 `docs/checks/MANUAL_CHECK.md`에 기록<br>6) 추가 Ref 확인(MAN-04): 대시보드에서 6개 테이블 RLS 활성화와 비로그인 쓰기 거부·비공개 데이터 보호 정책 존재 확인(REQ-FUNC-027·044, REQ-NF-013) | 해당 없음 (화면 요소 없음) | 1) 기록에 비밀번호·토큰을 쓰지 않음 | `docs/checks/MANUAL_CHECK.md` 4개 항목 PASS 기록 | P1 |

## 1. Context

화면과 무관한 기반 작업의 "수동 확인: 메일·키보드·스크린리더·성능" 작업이다. 이 Task는 Manual Check 단계로, 요구사항 11건(REQ-FUNC-066, REQ-FUNC-079, REQ-NF-001, REQ-NF-003, REQ-NF-006, REQ-NF-007 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, TECH-AUTH-CALLBACK, DEPLOY-VERCEL-SUPABASE. 이 Task가 끝나야 RELEASE-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "수동 확인: 메일·키보드·스크린리더·성능"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 제품 코드 수정 (실패 시 해당 구현 Task로 되돌림)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | SCR-005 로그인 탭과 기술 Route `/auth/callback`에서 Supabase Auth 사용. 이메일 미인증 계정은 로그인·쓰기 불가 |
| REQ-FUNC-079 | HTML 의미·ARIA 상태 | 폼 라벨·오류 `aria-describedby`, 탭 `role="tablist"`, Drawer·Modal 포커스 이동과 Esc 닫기, Toast `aria-live`, 이미지 `alt` 필수 |
| REQ-NF-001 | LCP ≤2.5s | 정적 데이터 렌더링, 첫 이미지 `priority`. 실제 사용자 p75 대신 배포 URL의 모바일 Lighthouse 측정값으로 판단 |
| REQ-NF-003 | CLS ≤0.1 | 이미지 `width`·`height` 지정, Drawer·패널은 오버레이로 열어 본문 이동 방지. Lighthouse 측정값으로 판단 |
| REQ-NF-006 | 이미지 최적화 | `next/image`, `sizes` 지정, 기본 lazy load, 첫 화면 이미지 `priority` |
| REQ-NF-007 | Lighthouse Performance ≥85 | CI 대신 배포 전 수동 측정 |
| REQ-NF-023 | WCAG 2.2 AA 목표 | REQ-FUNC-079 규칙, 상태·경보는 텍스트 라벨 병기, 터치 대상 24×24px 이상 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | SCR-001~005 핵심 흐름 수동 검사 |
| REQ-FUNC-027 | 동행 쓰기에 인증 세션 필요 | 비로그인 쓰기 시도는 `/account?tab=login&next=<원래 경로>`로 이동. RLS가 `auth.uid()` 없는 쓰기를 거부 |
| REQ-FUNC-044 | RLS 비공개 데이터 보호 | §6 정책: 본인, 요청 대상 작성자, admin만 비공개 데이터 열람 |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | 모든 테이블 RLS 활성화, `role`은 DB에서만 판단 |

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

- PAGE-SCR001 — SCR-001 메인 페이지 조립 (Seq 43)
- PAGE-SCR002 — SCR-002 대표 소개 페이지 조립 (Seq 44)
- PAGE-SCR003 — SCR-003 통합 여행 준비 페이지 조립 (Seq 45)
- PAGE-SCR004 — SCR-004 동행 조회 페이지 조립 (Seq 46)
- PAGE-SCR005 — SCR-005 계정·관리 페이지 조립 (Seq 47)
- TECH-AUTH-CALLBACK — 인증 메일 링크 처리 Route (Seq 21)
- DEPLOY-VERCEL-SUPABASE — Vercel·Supabase 설정 확인 (Seq 59)

## 7. Expected Files

**생성**

- `docs/checks/MANUAL_CHECK.md`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- MAN-01 가입 인증·재설정 메일 수신과 `/auth/callback` 처리
- MAN-02 키보드만으로 5개 Screen 핵심 흐름, VoiceOver로 폼 오류·Drawer 제목
- MAN-03 Preview URL 모바일 Lighthouse: Performance ≥85, LCP ≤2.5s, CLS ≤0.1
- MAN-04 Supabase 대시보드 RLS 활성화·정책
- 결과·날짜·확인자를 `docs/checks/MANUAL_CHECK.md`에 기록
- 추가 Ref 확인(MAN-04): 대시보드에서 6개 테이블 RLS 활성화와 비로그인 쓰기 거부·비공개 데이터 보호 정책 존재 확인(REQ-FUNC-027·044, REQ-NF-013)

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 기록에 비밀번호·토큰을 쓰지 않음

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-01 | 가입 인증 메일 수신·인증 링크(`/auth/callback`), 비밀번호 재설정 메일 |
| MAN-02 | 키보드만으로 SCR-001~005 핵심 흐름 완료, VoiceOver로 폼 오류·Drawer 제목 읽힘 |
| MAN-03 | Vercel 배포 URL에서 모바일 Lighthouse (Performance ≥85, LCP ≤2.5s, CLS ≤0.1) |
| MAN-04 | Supabase 대시보드에서 RLS 활성화·정책 목록 확인 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-PUBLIC-SMOKE, E2E-MATE-AUTH, RELEASE-CHECK

## 12. Verify

- `docs/checks/MANUAL_CHECK.md` 4개 항목 PASS 기록
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
- 확인하지 않은 항목을 PASS로 기록하지 않는다
