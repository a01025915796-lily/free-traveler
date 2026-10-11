# TASK-LOGIC-SAFETY-STALE 안전정보 stale 계산

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 19 | LOGIC-SAFETY-STALE | 안전정보 stale 계산 | Logic | IMPLEMENT | REQ-FUNC-050, REQ-FUNC-051, REQ-NF-028 | 없음 | - | - | DATA-SAFETY | `src/lib/safety/stale.ts` | 1) 렌더링 시 `verifiedAt + 7일 < 현재`면 stale<br>2) 중대 경보(출국권고·여행금지·특별여행주의보) 판정<br>3) 배치 작업 없음 | 해당 없음 (화면 요소 없음) | 해당 없음 | UNIT-SEARCH-STALE | P0 |

## 1. Context

화면과 무관한 기반 작업의 "안전정보 stale 계산" 작업이다. 이 Task는 Logic 단계로, 요구사항 3건(REQ-FUNC-050, REQ-FUNC-051, REQ-NF-028)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: DATA-SAFETY. 이 Task가 끝나야 COMP-SCR001-SAFETY, UNIT-SEARCH-STALE를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "안전정보 stale 계산"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-050 | 7일 초과 stale 경고 | 렌더링 시 계산해 경고 표시, "최신" 배지 숨김 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | 출국권고·여행금지·특별여행주의보를 국가 안전정보 Drawer 최상단에 단계·행동요령·범위 텍스트로 표시 |
| REQ-NF-028 | 안전정보 7일 이내 95%, 초과 시 경고 100% | 초과 시 경고는 렌더링 계산으로 100% 표시. 7일 이내 95%는 `src/data/safety.ts`의 `verifiedAt`을 주기적으로 갱신해 재배포하는 운영 작업으로 유지 |

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

- DATA-SAFETY — 국가 안전정보 정적 데이터 (Seq 7)

## 7. Expected Files

**생성**

- `src/lib/safety/stale.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 렌더링 시 `verifiedAt + 7일 < 현재`면 stale
- 중대 경보(출국권고·여행금지·특별여행주의보) 판정
- 배치 작업 없음

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 개인정보·비밀값을 다루지 않는다. 비밀값을 코드·로그에 쓰지 않는다

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| UT-07 | 안전정보 stale 계산 (7일 경계, 고정 기준 시각) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-SEARCH-STALE, E2E-PUBLIC-SMOKE

## 12. Verify

- UNIT-SEARCH-STALE
- UNIT-SEARCH-STALE 실행: `npm run test:unit -- src/lib/destinations src/lib/safety`
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
