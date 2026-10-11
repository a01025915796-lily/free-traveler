# TASK-COMP-SCR004-DETAIL 동행 상세 패널

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 35 | COMP-SCR004-DETAIL | 동행 상세 패널 | Component | IMPLEMENT | REQ-FUNC-033, REQ-FUNC-038, REQ-FUNC-069 | SCR-004 | `/mates` | `src/app/mates/page.tsx` | GLOBAL-UI-KIT, DB-ACCESS, LOGIC-FAVORITES-SHARE | `src/components/mates/MateDetailPanel.tsx`, `src/components/mates/ApplyChecklistCard.tsx`, `src/components/mates/ReportHintCard.tsx` | 1) `?post=<id>`: 상태·조건·설명·작성자 공개 프로필·공유<br>2) 본인 글: 수정(`/travel-tools?tab=mate&edit=<id>`)·마감·삭제<br>3) 상세 아래 안내 Card 2개(참가 요청 전 확인 / 이 글이 불편하다면)<br>4) 미선택 시 안내 + 3단계 요약, 없는 글·차단 관계는 "이 글은 볼 수 없어요" | 1) Desktop 5열 고정 패널, Mobile 전체 화면 Drawer | 1) 작성자 연락처 미노출 | E2E-MATE-AUTH | P0 |

## 1. Context

SCR-004 동행 조회 화면(`/mates`)의 "동행 상세 패널" 작업이다. 이 Task는 Component 단계로, 요구사항 3건(REQ-FUNC-033, REQ-FUNC-038, REQ-FUNC-069)을 다룬다.

Expected Files는 아직 저장소에 없다. 이 Task에서 새로 만든다. 선행 Task: GLOBAL-UI-KIT, DB-ACCESS, LOGIC-FAVORITES-SHARE. 이 Task가 끝나야 PAGE-SCR004를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 3개 안에서 "동행 상세 패널"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Page Entry(`page.tsx`) 조립 (Page Owner 소관)
- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-FUNC-033 | 이메일·연락처 비노출 | `profiles`에 이메일 컬럼을 두지 않고 공개 컬럼만 조회 |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | SCR-004 상세 패널의 작성자 메뉴에서 마감·삭제(`DELETED`), 수정은 SCR-003 동행 구하기 탭(`&edit=<id>`). 승인자가 있으면 날짜 변경 전 화면 내 확인 Modal 표시 |
| REQ-FUNC-069 | URL 공유 | 여행지 상세·국가 안전정보 Drawer와 SCR-004 동행 상세 패널에 공유 버튼. Web Share API 실패 시 URL 복사 후 Toast |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-004 동행 조회 (핵심) |
| Route | `/mates` |
| Page Entry | `src/app/mates/page.tsx` |
| 이 Task의 역할 | Page Owner가 조립할 Component |

## 5. Design Ref

- `design-reference/UI_CONTRACT.md` §5 SCR-004 동행 조회 (영역·Component·상태·행동·이동·Desktop/Mobile·금지 기능)
- `docs/04_UIUX_PLAN.md` §6.4 (Section 제목·설명 문구·상태 문구)
- Stitch Desktop `a5652785ec3c4c36ad2b028e4851e080` (Mobile 디자인 없음 — UI_CONTRACT §1.4 Mobile 규칙)
- `design-reference/D-001/DESIGN.md` §2 색 · §3 글꼴 · §5 레이아웃 · §6 컴포넌트 · §7 접근성

## 6. Depends On

- GLOBAL-UI-KIT — 공통 UI Component (Seq 4)
- DB-ACCESS — 동행·요청·차단·신고·설정 데이터 접근 계층 (Seq 14)
- LOGIC-FAVORITES-SHARE — 즐겨찾기(localStorage)·공유 (Seq 20)

## 7. Expected Files

**생성**

- `src/components/mates/MateDetailPanel.tsx`
- `src/components/mates/ApplyChecklistCard.tsx`
- `src/components/mates/ReportHintCard.tsx`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- `?post=<id>`: 상태·조건·설명·작성자 공개 프로필·공유
- 본인 글: 수정(`/travel-tools?tab=mate&edit=<id>`)·마감·삭제
- 상세 아래 안내 Card 2개(참가 요청 전 확인 / 이 글이 불편하다면)
- 미선택 시 안내 + 3단계 요약, 없는 글·차단 관계는 "이 글은 볼 수 없어요"

## 9. Visual AC

- Desktop 5열 고정 패널, Mobile 전체 화면 Drawer

## 10. Security/Privacy AC

- 작성자 연락처 미노출

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| SMK-01 | SCR-001 `/` — 7개 영역 표시, 국내/해외 구분, 필터·검색·`kind`, 결과 없음 안내·초기화, 여행지 상세 Drawer 필수 항목, 해외 상세 → 같은 Drawer의 국가 안전정보, stale 경고, 소개 영역 수치, 즐겨찾기, 공유 폴백 |
| SMK-04 | SCR-005 → SCR-003 → SCR-004 (회원 A) — 로그인, 동행 구하기 탭에서 연락처 포함 글 차단·작성·수정, 상세 패널에서 마감, `<script>` 문자열이 텍스트로 표시, 세션 쿠키 SameSite, 로그아웃 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: UNIT-MATE-STATE, E2E-PUBLIC-SMOKE, E2E-MATE-AUTH

## 12. Verify

- E2E-MATE-AUTH
- E2E-MATE-AUTH: 이 Task에서는 실행하지 않는다. E2E-MATE-AUTH Task가 spec을 만든 뒤 `npx playwright test e2e/mate-auth.spec.ts --project=chromium` (테스트 계정 환경변수 필요)로 검증한다. 구현 시 "보류 — E2E-MATE-AUTH에서 검증"으로 기록한다 (`/implement-task` 규칙 6).
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
