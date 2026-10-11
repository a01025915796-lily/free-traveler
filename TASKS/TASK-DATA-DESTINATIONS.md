# TASK-DATA-DESTINATIONS 여행지 정적 데이터

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | DATA-DESTINATIONS | 여행지 정적 데이터 | Data | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-004, REQ-FUNC-008, REQ-FUNC-074, REQ-NF-026 | 없음 | - | - | SETUP-PROJECT | `src/types/content.ts`, `src/data/countries.ts`, `src/data/destinations.ts` | 1) 국내 10곳, 해외 15개국 30개 도시를 `src/data`에 정적 데이터로 작성(DB 사용 안 함)<br>2) 타입으로 필수 필드 강제: 소개 300자+, 명소 5+, 추천·비추천 시기, 1일·3일 일정, 예산, 교통, 음식 3+, 에티켓 3+, 출처 1+, 수정일, `scope`, `countryCode`, 테마·계절·권장 기간<br>3) 이미지는 인터넷 URL + 실제 장소 설명 `alt`만 저장<br>4) 메인 추천용 국내 6·해외 6 지정, 테마 6종 정의 | 해당 없음 (화면 요소 없음) | 1) 출처 URL은 `https:`만 | `npm run test:unit -- content` (UNIT-CONTENT-DATA) | P0 |

## 1. Context

화면과 무관한 기반 작업의 "여행지 정적 데이터" 작업이다. 이 Task는 Data 단계로, 요구사항 5건(REQ-FUNC-001, REQ-FUNC-004, REQ-FUNC-008, REQ-FUNC-074, REQ-NF-026)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: SETUP-PROJECT. 이 Task가 끝나야 DATA-SAFETY, DATA-REPRESENTATIVE, LOGIC-SEARCH-FILTER, LOGIC-TRAVEL-DATES, COMP-SCR001-DESTINATIONS, COMP-SCR001-DESTINATION-DRAWER, PAGE-SCR001, UNIT-CONTENT-DATA를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 3개 안에서 "여행지 정적 데이터"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-001 | 국내·해외 여행지 목록 구분 | SCR-001 국내/해외 구분(검색 구분 선택, 검색 결과 모드 탭). `src/data`의 `scope` 값으로 분류 |
| REQ-FUNC-004 | 여행지 상세 필수 항목 | SCR-001 여행지 상세 Drawer(`?dest`)에 소개·명소 5+·추천 시기·1일/3일 일정·예산·교통·음식 3+·에티켓·출처·수정일 표시. 게시 상태 대신 데이터 타입과 완전성 테스트로 누락을 막는다 |
| REQ-FUNC-008 | 국내 10곳, 해외 15개국 30개 도시 | `src/data`에 수량을 채우고 테스트로 수량을 검사 |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | 정적 데이터 완전성 단위 테스트가 실패하면 배포하지 않는다. 누락 필드 목록을 실패 메시지로 출력 |
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | REQ-FUNC-074 완전성 테스트 |

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

- `src/types/content.ts`
- `src/data/countries.ts`
- `src/data/destinations.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 국내 10곳, 해외 15개국 30개 도시를 `src/data`에 정적 데이터로 작성(DB 사용 안 함)
- 타입으로 필수 필드 강제: 소개 300자+, 명소 5+, 추천·비추천 시기, 1일·3일 일정, 예산, 교통, 음식 3+, 에티켓 3+, 출처 1+, 수정일, `scope`, `countryCode`, 테마·계절·권장 기간
- 이미지는 인터넷 URL + 실제 장소 설명 `alt`만 저장
- 메인 추천용 국내 6·해외 6 지정, 테마 6종 정의

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 출처 URL은 `https:`만

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| UT-01 | 여행지 필터·키워드 검색·국내/해외 구분·검색 결과 유형(`kind`)·관련 여행지·URL query 직렬화 |
| UT-08 | 정적 데이터 완전성 (여행지 필수 필드·수량, 해외 국가별 안전정보, 8개 카테고리, 경보 범위, 대표 프로필, 추천 slug 존재, 모든 이미지 `alt`) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-CONTENT-DATA, UNIT-SEARCH-STALE, E2E-PUBLIC-SMOKE, RELEASE-CHECK

## 12. Verify

- `npm run test:unit -- content` (UNIT-CONTENT-DATA)
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
