# TASK-DATA-REPRESENTATIVE free_traveler 대표 정적 데이터

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 8 | DATA-REPRESENTATIVE | free_traveler 대표 정적 데이터 | Data | IMPLEMENT | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063 | 없음 | - | - | DATA-DESTINATIONS | `src/data/curator.ts` | 1) `free_traveler`, `50+ Trips`, `30+ Countries` 단일 출처<br>2) PRD 6-1·6-2 소개문·철학·편집 원칙 전문<br>3) 방문 국가 30개(권역 4개), Timeline 7개(연도·장소·요약), Gallery 8장(서로 다른 장소, alt), 기억에 남는 여행지 4곳, 추천 여행지 6곳(존재하는 slug), 문의·SNS 링크<br>4) 대표 확인 전 초안 문구는 대표 확인 후 확정 | 해당 없음 (화면 요소 없음) | 1) SNS·문의 링크는 `https:`·`mailto:`만, 빈 값 허용 | UNIT-CONTENT-DATA | P0 |

## 1. Context

화면과 무관한 기반 작업의 "free_traveler 대표 정적 데이터" 작업이다. 이 Task는 Data 단계로, 요구사항 6건(REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: DATA-DESTINATIONS. 이 Task가 끝나야 COMP-SCR001-MATES-CURATOR, COMP-SCR002-PROFILE, COMP-SCR002-COUNTRIES-GALLERY, PAGE-SCR001, PAGE-SCR002, UNIT-CONTENT-DATA를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "free_traveler 대표 정적 데이터"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-057 | `free_traveler`, `50+ Trips`, `30+ Countries` | `src/data/curator.ts` 단일 값을 SCR-001 free_traveler 소개 영역과 SCR-002 여행 지표에서 사용 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 | PRD 6-1·6-2 문구를 줄이지 않고 SCR-002 소개 영역에 표시 |
| REQ-FUNC-059 | 방문 국가 30개 이상 목록 | SCR-002 방문 국가 영역: 지도 대신 권역별 국가 Chip 30개. 소개된 국가는 SCR-001 국가 안전정보 Drawer로 연결 |
| REQ-FUNC-060 | 대표 여행 타임라인 | 연도·장소·요약 항목 목록 |
| REQ-FUNC-062 | 문의·SNS 링크 | 관리자 설정 대신 `src/data/curator.ts` 값 사용. 빈 값은 렌더링하지 않고 `https:`·`mailto:`만 허용 |
| REQ-FUNC-063 | 추천 여행지 6개 | SCR-002 기억에 남는 여행지 영역의 추천 6곳 Chip에서 SCR-001 여행지 상세 Drawer로 연결. 존재하지 않는 slug는 테스트 실패 |

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

- `src/data/curator.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- `free_traveler`, `50+ Trips`, `30+ Countries` 단일 출처
- PRD 6-1·6-2 소개문·철학·편집 원칙 전문
- 방문 국가 30개(권역 4개), Timeline 7개(연도·장소·요약), Gallery 8장(서로 다른 장소, alt), 기억에 남는 여행지 4곳, 추천 여행지 6곳(존재하는 slug), 문의·SNS 링크
- 대표 확인 전 초안 문구는 대표 확인 후 확정

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- SNS·문의 링크는 `https:`·`mailto:`만, 빈 값 허용

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| SMK-09 | SCR-002 `/about` — 7개 영역, `50+ Trips`·`30+ Countries`가 SCR-001과 일치, 국가 30개, 링크 Chip → `/?safety=`, 추천 6곳 → `/?dest=`, 빈 SNS 링크 미표시 |
| UT-08 | 정적 데이터 완전성 (여행지 필수 필드·수량, 해외 국가별 안전정보, 8개 카테고리, 경보 범위, 대표 프로필, 추천 slug 존재, 모든 이미지 `alt`) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-CONTENT-DATA, E2E-PUBLIC-SMOKE

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
