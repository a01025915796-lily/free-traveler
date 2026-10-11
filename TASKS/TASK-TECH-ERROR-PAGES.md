# TASK-TECH-ERROR-PAGES 404·오류 화면

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 22 | TECH-ERROR-PAGES | 404·오류 화면 | Tech Route | IMPLEMENT | REQ-FUNC-078 | 없음 | - | - | GLOBAL-LAYOUT | `src/app/not-found.tsx`, `src/app/error.tsx` | 1) 404: "찾으시는 페이지가 없어요" + 홈으로·여행지 둘러보기<br>2) error(Client): "일시적인 문제가 생겼어요" + 다시 시도·홈으로 | 1) 공통 Header·Footer, Empty State 형식 | 1) 오류 상세(stack)를 화면에 노출하지 않음 | E2E-PUBLIC-SMOKE | P1 |

## 1. Context

화면과 무관한 기반 작업의 "404·오류 화면" 작업이다. 이 Task는 Tech Route 단계로, 요구사항 1건(REQ-FUNC-078)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-LAYOUT. 이 Task가 끝나야 UNIT-ROUTE-CONTRACT, E2E-PUBLIC-SMOKE를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 2개 안에서 "404·오류 화면"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-078 | 오류 화면 복구 행동 | `not-found.tsx`(홈), `error.tsx`(다시 시도·홈), 권한 없음(홈·로그인), 외부 연결 실패(재시도) |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | 없음 (화면 밖 작업) |
| Route | - |
| Page Entry | - |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §1.2 기술 Route
- `docs/04_UIUX_PLAN.md` §7 기술 Route 화면
- `design-reference/D-001/DESIGN.md` §6 Empty State·Button

## 6. Depends On

- GLOBAL-LAYOUT — Root Layout·공통 Header·Footer·정책 Modal (Seq 5)

## 7. Expected Files

**생성**

- `src/app/not-found.tsx`
- `src/app/error.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 404: "찾으시는 페이지가 없어요" + 홈으로·여행지 둘러보기
- error(Client): "일시적인 문제가 생겼어요" + 다시 시도·홈으로

## 9. Visual AC

- 공통 Header·Footer, Empty State 형식

## 10. Security/Privacy AC

- 오류 상세(stack)를 화면에 노출하지 않음

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-07 | SCR-005 관리 탭 — 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원에게는 관리 탭이 렌더링되지 않음 |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-PUBLIC-SMOKE

## 12. Verify

- E2E-PUBLIC-SMOKE
- E2E-PUBLIC-SMOKE: 이 Task에서는 실행하지 않는다. E2E-PUBLIC-SMOKE Task가 spec을 만든 뒤 `npx playwright test e2e/public.spec.ts --project=chromium`로 검증한다. 구현 시 "보류 — E2E-PUBLIC-SMOKE에서 검증"으로 기록한다 (`/implement-task` 규칙 6).
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
