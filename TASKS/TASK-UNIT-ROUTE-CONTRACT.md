# TASK-UNIT-ROUTE-CONTRACT 단위 테스트: Route Contract

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 54 | UNIT-ROUTE-CONTRACT | 단위 테스트: Route Contract | Unit Test | IMPLEMENT | REQ-FUNC-064 | 없음 | - | - | PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, TECH-AUTH-CALLBACK, TECH-ERROR-PAGES | `src/__tests__/route-contract.test.ts` | 1) UT-10: `src/app`의 `page.tsx`가 계약 5개 + `auth/callback`과 일치<br>2) `route.ts`·`src/app/api`·`"use server"` 없음<br>3) `src/app/page.tsx`에 Starter 문구 없음 | 해당 없음 (화면 요소 없음) | 해당 없음 | `npm run test:unit -- src/__tests__/route-contract` | P0 |

## 1. Context

화면과 무관한 기반 작업의 "단위 테스트: Route Contract" 작업이다. 이 Task는 Unit Test 단계로, 요구사항 1건(REQ-FUNC-064)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, TECH-AUTH-CALLBACK, TECH-ERROR-PAGES. 이 Task가 끝나야 RELEASE-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "단위 테스트: Route Contract"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 제품 코드 수정 (실패 시 해당 구현 Task로 되돌림)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | `src/app/layout.tsx`의 공통 Header(5개 Screen 메뉴, 계정 진입)와 정책 Modal을 여는 Footer |

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
- TECH-ERROR-PAGES — 404·오류 화면 (Seq 22)

## 7. Expected Files

**생성**

- `src/__tests__/route-contract.test.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- UT-10: `src/app`의 `page.tsx`가 계약 5개 + `auth/callback`과 일치
- `route.ts`·`src/app/api`·`"use server"` 없음
- `src/app/page.tsx`에 Starter 문구 없음

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 개인정보·비밀값을 다루지 않는다. 비밀값을 코드·로그에 쓰지 않는다

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |
| UT-10 | Route Contract: `SCREEN_ROUTE_CONTRACT.json`과 `src/app` 파일 일치, `route.ts`·Server Action 없음, SCR-001 시작 화면 흔적 없음 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-PUBLIC-SMOKE, RELEASE-CHECK

## 12. Verify

- `npm run test:unit -- src/__tests__/route-contract`
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
