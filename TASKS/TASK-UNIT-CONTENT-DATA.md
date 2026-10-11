# TASK-UNIT-CONTENT-DATA 단위 테스트: 정적 데이터 완전성

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 51 | UNIT-CONTENT-DATA | 단위 테스트: 정적 데이터 완전성 | Unit Test | IMPLEMENT | REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-008, REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-057, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063, REQ-FUNC-074, REQ-NF-026, REQ-NF-027 | 없음 | - | - | DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE | `src/data/content.test.ts` | 1) UT-08: 국내 10·해외 15개국 30개 도시, 필수 필드·최소 개수, 해외 국가별 안전정보·8개 카테고리·경보 범위·출처·확인일·긴급연락처<br>2) 대표: `50+ Trips`·`30+ Countries`, 국가 30, Timeline 6+, Gallery 8, 기억 4, 추천 6 slug 존재, SNS 프로토콜<br>3) 모든 이미지 `alt` 존재, 누락 필드 목록을 실패 메시지로 출력 | 해당 없음 (화면 요소 없음) | 해당 없음 | `npm run test:unit -- src/data` | P0 |

## 1. Context

화면과 무관한 기반 작업의 "단위 테스트: 정적 데이터 완전성" 작업이다. 이 Task는 Unit Test 단계로, 요구사항 16건(REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-008, REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE. 이 Task가 끝나야 RELEASE-CHECK를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "단위 테스트: 정적 데이터 완전성"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- 제품 코드 수정 (실패 시 해당 구현 Task로 되돌림)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-004 | 여행지 상세 필수 항목 | SCR-001 여행지 상세 Drawer(`?dest`)에 소개·명소 5+·추천 시기·1일/3일 일정·예산·교통·음식 3+·에티켓·출처·수정일 표시. 게시 상태 대신 데이터 타입과 완전성 테스트로 누락을 막는다 |
| REQ-FUNC-006 | 해외 상세 → 해당 국가 안전정보 | 여행지 상세 Drawer에서 같은 Drawer 안의 국가 안전정보(`?safety=<countryCode>`)로 전환하고 돌아가기 버튼 제공 |
| REQ-FUNC-008 | 국내 10곳, 해외 15개국 30개 도시 | `src/data`에 수량을 채우고 테스트로 수량을 검사 |
| REQ-FUNC-046 | 해외 국가별 안전정보 존재 | `src/data/safety.ts`에 15개국 모두 작성 |
| REQ-FUNC-047 | 8개 안전 카테고리 | 치안·사기·법규·교통·재난·기후·보건·문화·복장·긴급연락처 섹션을 타입으로 강제 |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 | 안전 데이터에 필드를 두고 SCR-001 국가 안전정보 Drawer에 표시 |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 | `scopeType`(COUNTRY/REGION)과 `scopeText` 필드, 지역 경보는 `scopeText` 필수 |
| REQ-FUNC-053 | 긴급전화·재외공관 정보 | 번호·링크·출처·확인일 표시 |
| REQ-FUNC-057 | `free_traveler`, `50+ Trips`, `30+ Countries` | `src/data/curator.ts` 단일 값을 SCR-001 free_traveler 소개 영역과 SCR-002 여행 지표에서 사용 |
| REQ-FUNC-059 | 방문 국가 30개 이상 목록 | SCR-002 방문 국가 영역: 지도 대신 권역별 국가 Chip 30개. 소개된 국가는 SCR-001 국가 안전정보 Drawer로 연결 |
| REQ-FUNC-060 | 대표 여행 타임라인 | 연도·장소·요약 항목 목록 |
| REQ-FUNC-062 | 문의·SNS 링크 | 관리자 설정 대신 `src/data/curator.ts` 값 사용. 빈 값은 렌더링하지 않고 `https:`·`mailto:`만 허용 |
| REQ-FUNC-063 | 추천 여행지 6개 | SCR-002 기억에 남는 여행지 영역의 추천 6곳 Chip에서 SCR-001 여행지 상세 Drawer로 연결. 존재하지 않는 slug는 테스트 실패 |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | 정적 데이터 완전성 단위 테스트가 실패하면 배포하지 않는다. 누락 필드 목록을 실패 메시지로 출력 |
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | REQ-FUNC-074 완전성 테스트 |
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
- DATA-SAFETY — 국가 안전정보 정적 데이터 (Seq 7)
- DATA-REPRESENTATIVE — free_traveler 대표 정적 데이터 (Seq 8)

## 7. Expected Files

**생성**

- `src/data/content.test.ts`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- UT-08: 국내 10·해외 15개국 30개 도시, 필수 필드·최소 개수, 해외 국가별 안전정보·8개 카테고리·경보 범위·출처·확인일·긴급연락처
- 대표: `50+ Trips`·`30+ Countries`, 국가 30, Timeline 6+, Gallery 8, 기억 4, 추천 6 slug 존재, SNS 프로토콜
- 모든 이미지 `alt` 존재, 누락 필드 목록을 실패 메시지로 출력

## 9. Visual AC

- 해당 없음 (화면 요소 없음)

## 10. Security/Privacy AC

- 개인정보·비밀값을 다루지 않는다. 비밀값을 코드·로그에 쓰지 않는다

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| SMK-09 | SCR-002 `/about` — 7개 영역, `50+ Trips`·`30+ Countries`가 SCR-001과 일치, 국가 30개, 링크 Chip → `/?safety=`, 추천 6곳 → `/?dest=`, 빈 SNS 링크 미표시 |
| UT-08 | 정적 데이터 완전성 (여행지 필수 필드·수량, 해외 국가별 안전정보, 8개 카테고리, 경보 범위, 대표 프로필, 추천 slug 존재, 모든 이미지 `alt`) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-PUBLIC-SMOKE, RELEASE-CHECK

## 12. Verify

- `npm run test:unit -- src/data`
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
