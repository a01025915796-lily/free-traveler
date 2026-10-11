# TASK-DATA-SAFETY 국가 안전정보 정적 데이터

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 7 | DATA-SAFETY | 국가 안전정보 정적 데이터 | Data | IMPLEMENT | REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053, REQ-NF-027 | 없음 | - | - | DATA-DESTINATIONS | `src/data/safety.ts` | 1) 해외 15개국 모두 작성<br>2) 8개 카테고리(치안·흔한 사기·현지 법규·교통·재난·기후·보건·문화·복장·긴급연락처)<br>3) 경보 단계 라벨, `scopeType`(COUNTRY/REGION)·`scopeText`(지역 경보는 필수)<br>4) 출처명·URL·`verifiedAt`·편집자, 현지 긴급전화·재외공관·영사콜센터<br>5) 메인 노출 6개국 지정 | 해당 없음 (화면 요소 없음) | 1) 공식 출처 URL은 `https:`만 | UNIT-CONTENT-DATA | P0 |

## 1. Context

화면과 무관한 기반 작업의 "국가 안전정보 정적 데이터" 작업이다. 이 Task는 Data 단계로, 요구사항 6건(REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053, REQ-NF-027)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: DATA-DESTINATIONS. 이 Task가 끝나야 LOGIC-SEARCH-FILTER, LOGIC-SAFETY-STALE, COMP-SCR001-SAFETY, COMP-SCR002-COUNTRIES-GALLERY, PAGE-SCR001, UNIT-CONTENT-DATA를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "국가 안전정보 정적 데이터"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-046 | 해외 국가별 안전정보 존재 | `src/data/safety.ts`에 15개국 모두 작성 |
| REQ-FUNC-047 | 8개 안전 카테고리 | 치안·사기·법규·교통·재난·기후·보건·문화·복장·긴급연락처 섹션을 타입으로 강제 |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 | 안전 데이터에 필드를 두고 SCR-001 국가 안전정보 Drawer에 표시 |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 | `scopeType`(COUNTRY/REGION)과 `scopeText` 필드, 지역 경보는 `scopeText` 필수 |
| REQ-FUNC-053 | 긴급전화·재외공관 정보 | 번호·링크·출처·확인일 표시 |
| REQ-NF-027 | 해외 국가 안전정보 커버리지 100% | REQ-FUNC-046 데이터 검사 |

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

- DATA-DESTINATIONS — 여행지 정적 데이터 (Seq 6)

## 7. Expected Files

**생성**

- `src/data/safety.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 해외 15개국 모두 작성
- 8개 카테고리(치안·흔한 사기·현지 법규·교통·재난·기후·보건·문화·복장·긴급연락처)
- 경보 단계 라벨, `scopeType`(COUNTRY/REGION)·`scopeText`(지역 경보는 필수)
- 출처명·URL·`verifiedAt`·편집자, 현지 긴급전화·재외공관·영사콜센터
- 메인 노출 6개국 지정

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 공식 출처 URL은 `https:`만

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| UT-08 | 정적 데이터 완전성 (여행지 필수 필드·수량, 해외 국가별 안전정보, 8개 카테고리, 경보 범위, 대표 프로필, 추천 slug 존재, 모든 이미지 `alt`) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-CONTENT-DATA, RELEASE-CHECK

## 12. Verify

- UNIT-CONTENT-DATA
- UNIT-CONTENT-DATA 실행: `npm run test:unit -- src/data`
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
- 정적 데이터를 DB·외부 API에서 불러오지 않는다
- 출처 없는 안전정보를 쓰지 않는다
