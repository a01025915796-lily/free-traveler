# TASK-LOGIC-CONTACT-DETECTION 공개 연락처 탐지

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 18 | LOGIC-CONTACT-DETECTION | 공개 연락처 탐지 | Logic | IMPLEMENT | REQ-FUNC-032 | 없음 | - | - | SETUP-PROJECT | `src/lib/mates/contact-detection.ts` | 1) 전화번호·이메일·메신저 ID(카카오톡·텔레그램·라인·인스타그램 표기) 정규식 탐지<br>2) 탐지 위치와 수정 안내 반환<br>3) 기준 테스트셋 탐지율 ≥95%, 오탐 ≤5% | 해당 없음 (화면 요소 없음) | 1) 제목·설명 제출 전 검사 | UNIT-CONTACT-DETECTION | P0 |

## 1. Context

화면과 무관한 기반 작업의 "공개 연락처 탐지" 작업이다. 이 Task는 Logic 단계로, 요구사항 1건(REQ-FUNC-032)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: SETUP-PROJECT. 이 Task가 끝나야 COMP-SCR003-MATE-COMPOSE, UNIT-CONTACT-DETECTION를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "공개 연락처 탐지"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-032 | 공개 연락처 탐지 | 제출 전 정규식 검사로 차단하고 수정 안내 표시 |

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

- `src/lib/mates/contact-detection.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 전화번호·이메일·메신저 ID(카카오톡·텔레그램·라인·인스타그램 표기) 정규식 탐지
- 탐지 위치와 수정 안내 반환
- 기준 테스트셋 탐지율 ≥95%, 오탐 ≤5%

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 제목·설명 제출 전 검사

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |
| UT-05 | 공개 연락처 탐지 기준 테스트셋 (탐지율 ≥95%, 오탐 ≤5%) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-CONTACT-DETECTION, E2E-MATE-AUTH

## 12. Verify

- UNIT-CONTACT-DETECTION
- UNIT-CONTACT-DETECTION 실행: `npm run test:unit -- src/lib/mates/contact-detection`
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
