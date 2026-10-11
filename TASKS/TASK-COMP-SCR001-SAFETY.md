# TASK-COMP-SCR001-SAFETY 국가별 주의사항 영역·안전정보 Drawer

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 26 | COMP-SCR001-SAFETY | 국가별 주의사항 영역·안전정보 Drawer | Component | IMPLEMENT | REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-NF-028 | SCR-001 | `/` | `src/app/page.tsx` | GLOBAL-UI-KIT, DATA-SAFETY, LOGIC-SAFETY-STALE | `src/components/safety/SafetyCard.tsx`, `src/components/safety/SafetyCardGrid.tsx`, `src/components/safety/AdvisoryBadge.tsx`, `src/components/safety/SafetyDrawer.tsx` | 1) 안전 Card 6개(국가·경보 배지·요약·최종 확인일·stale이면 "재확인 권장")<br>2) Drawer 순서: 중대 경보 → stale 경고("최신 정보 재확인 필요", 최신 배지 숨김) → 공식 판단 비대체 고지 → 경보 범위(국가/지역) → 8개 카테고리 → 긴급연락처(`tel:`) → 출처·확인일·편집자·외교부 원문<br>3) "15개국 주의사항 모두 보기" → `/?kind=safety` | 1) 4:8 분할, Card 2×3, Mobile 1열<br>2) 경보는 색 + 아이콘 + 단계명 텍스트 | 1) 외교부·출처 링크 `target="_blank" rel="noopener noreferrer"` | E2E-PUBLIC-SMOKE, UNIT-SEARCH-STALE | P0 |

## 1. Context

SCR-001 메인 화면(`/`)의 "국가별 주의사항 영역·안전정보 Drawer" 작업이다. 이 Task는 Component 단계로, 요구사항 9건(REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052 외)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT, DATA-SAFETY, LOGIC-SAFETY-STALE. 이 Task가 끝나야 PAGE-SCR001를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 4개 안에서 "국가별 주의사항 영역·안전정보 Drawer"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Page Entry(`page.tsx`) 조립 (Page Owner 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-047 | 8개 안전 카테고리 | 치안·사기·법규·교통·재난·기후·보건·문화·복장·긴급연락처 섹션을 타입으로 강제 |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 | 안전 데이터에 필드를 두고 SCR-001 국가 안전정보 Drawer에 표시 |
| REQ-FUNC-049 | 외교부 원문 새 탭 링크 | `https://www.0404.go.kr/` 링크에 `target="_blank"`, `rel="noopener noreferrer"`. 주간 링크 검사는 제외(REQ-NF-011) |
| REQ-FUNC-050 | 7일 초과 stale 경고 | 렌더링 시 계산해 경고 표시, "최신" 배지 숨김 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | 출국권고·여행금지·특별여행주의보를 국가 안전정보 Drawer 최상단에 단계·행동요령·범위 텍스트로 표시 |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 | `scopeType`(COUNTRY/REGION)과 `scopeText` 필드, 지역 경보는 `scopeText` 필수 |
| REQ-FUNC-053 | 긴급전화·재외공관 정보 | 번호·링크·출처·확인일 표시 |
| REQ-FUNC-054 | 공식 판단 비대체 고지 | SCR-001 국가 안전정보 Drawer와 SCR-003 항공 요약에 원문 재확인 안내 표시 |
| REQ-NF-028 | 안전정보 7일 이내 95%, 초과 시 경고 100% | 초과 시 경고는 렌더링 계산으로 100% 표시. 7일 이내 95%는 `src/data/safety.ts`의 `verifiedAt`을 주기적으로 갱신해 재배포하는 운영 작업으로 유지 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-001 메인 (핵심) |
| Route | `/` |
| Page Entry | `src/app/page.tsx` |
| 이 Task의 역할 | Page Owner가 조립할 Component |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §2 SCR-001 메인 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.1 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `fd6afbb21ac84ac5a37017043f45c8f9`, Mobile `3f3464457ac14719b8a826fffb0c8945`
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-UI-KIT — 공통 UI Component (Seq 4)
- DATA-SAFETY — 국가 안전정보 정적 데이터 (Seq 7)
- LOGIC-SAFETY-STALE — 안전정보 stale 계산 (Seq 19)

## 7. Expected Files

**생성**

- `src/components/safety/SafetyCard.tsx`
- `src/components/safety/SafetyCardGrid.tsx`
- `src/components/safety/AdvisoryBadge.tsx`
- `src/components/safety/SafetyDrawer.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- 안전 Card 6개(국가·경보 배지·요약·최종 확인일·stale이면 "재확인 권장")
- Drawer 순서: 중대 경보 → stale 경고("최신 정보 재확인 필요", 최신 배지 숨김) → 공식 판단 비대체 고지 → 경보 범위(국가/지역) → 8개 카테고리 → 긴급연락처(`tel:`) → 출처·확인일·편집자·외교부 원문
- "15개국 주의사항 모두 보기" → `/?kind=safety`

## 9. Visual AC

- 4:8 분할, Card 2×3, Mobile 1열
- 경보는 색 + 아이콘 + 단계명 텍스트

## 10. Security/Privacy AC

- 외교부·출처 링크 `target="_blank" rel="noopener noreferrer"`

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| SMK-02 | SCR-003 `/travel-tools` 항공편·숙소 탭 — 필수값·날짜 오류 차단, 요약 일치, 비전달 안내, 외부 링크 `href`(query 없음)·`target`·`rel`, 입력 중 네트워크 요청에 입력값 없음, 탭 간 상태 분리 |
| UT-07 | 안전정보 stale 계산 (7일 경계, 고정 기준 시각) |
| UT-08 | 정적 데이터 완전성 (여행지 필수 필드·수량, 해외 국가별 안전정보, 8개 카테고리, 경보 범위, 대표 프로필, 추천 slug 존재, 모든 이미지 `alt`) |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-CONTENT-DATA, UNIT-SEARCH-STALE, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS

## 12. Verify

- E2E-PUBLIC-SMOKE, UNIT-SEARCH-STALE
- E2E-PUBLIC-SMOKE: 이 Task에서는 실행하지 않는다. E2E-PUBLIC-SMOKE Task가 spec을 만든 뒤 `npx playwright test e2e/public.spec.ts --project=chromium`로 검증한다. 구현 시 "보류 — E2E-PUBLIC-SMOKE에서 검증"으로 기록한다 (`/implement-task` 규칙 6).
- UNIT-SEARCH-STALE 실행: `npm run test:unit -- src/lib/destinations src/lib/safety`
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
- Page Entry(`page.tsx`)를 수정하지 않는다(Page Owner 소관)
- Placeholder 문구와 내용 없는 Card를 쓰지 않는다
- Airbnb 로고·Rausch 색·별점·가격·예약·결제 UI를 쓰지 않는다
