# Free Traveler 승인 UI·UX (05_UIUX_APPROVED)

| 항목 | 내용 |
|---|---|
| 문서 ID | UIUX-APPROVED-TRAVEL-001 |
| 승인일 | 2026-10-09 |
| 승인 근거 | `docs/STITCH_VALIDATION_REPORT.md` 최종 판정 STITCH_VALIDATION_PASS (7개 화면 PASS) |
| 기준 문서 | `docs/04_UIUX_PLAN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json` |
| Stitch Project | `12669658078193088277` |
| Stitch 디자인 시스템 | `assets/6924880912438359117` "Free Traveler" |
| 후속 문서 | `docs/06_SRS_UIUX_REVISED.md`, `docs/UIUX_TRACEABILITY.md` |

---

## 1. 승인 범위

디자인 Screen은 아래 5개로 확정한다. 이 밖의 공개 화면은 만들지 않으며, 상세·안전정보·작성·계정 기능은 5개 Screen 안의 탭·패널·Drawer·Modal로 제공한다.

| Screen | 구분 | Route | Page Entry | Stitch Desktop | Stitch Mobile | 검증 |
|---|---|---|---|---|---|---|
| SCR-001 메인 | 핵심 | `/` | `src/app/page.tsx` | `fd6afbb21ac84ac5a37017043f45c8f9` | `3f3464457ac14719b8a826fffb0c8945` | PASS |
| SCR-002 대표 소개 | 보조 | `/about` | `src/app/about/page.tsx` | `beeebd01d9be475392c9e7c6f46d6395` | — | PASS |
| SCR-003 통합 여행 준비 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` | `e60c66e71011429289057057824b567c` | `ffa60caca42c439cb75b48963f5f1d05` | PASS |
| SCR-004 동행 조회 | 핵심 | `/mates` | `src/app/mates/page.tsx` | `a5652785ec3c4c36ad2b028e4851e080` | — | PASS |
| SCR-005 계정·관리 | 핵심 | `/account` | `src/app/account/page.tsx` | `97ccb288104a40f3a1c10c801636f942` | — | PASS |

Mobile 디자인이 없는 SCR-002·004·005는 `UI_CONTRACT.md`의 Mobile 390px 규칙으로 구현한다.

---

## 2. 승인된 화면 구성

### 2.1 SCR-001 메인 `/`

| # | 영역 | 주요 내용 |
|---|---|---|
| 1 | 검색 Hero | 구분 선택 + 키워드 검색, "항공·숙소 조건 정리하기", 대표 사진 (최대 520px) |
| 2 | 국내 추천 여행지 | Card 6개, 국내 10곳 모두 보기 |
| 3 | 해외 추천 여행지 | Bento Card 6개, 해외 30개 도시 모두 보기 |
| 4 | 여행 동기·테마 | 아이콘 타일 6개 → 테마 필터 |
| 5 | 국가별 주의사항 | Safety Card 6개, 외교부 해외안전여행 링크 |
| 6 | 최근 동행글 | Mate Card 3개 또는 Empty State |
| 7 | free_traveler 소개 | `50+ Trips`, `30+ Countries`, 대표 소개 이동 |

같은 Screen 안의 상태: 검색 결과 모드(영역 2·3 대체), 여행지 상세 Drawer(`?dest`), 국가 안전정보 Drawer(`?safety`).

### 2.2 SCR-002 대표 소개 `/about`

Profile Hero → 여행 지표 4개 → 소개·시작한 이유·철학 → Timeline 7개 → 방문 국가 30개(권역 4) → Gallery 8장 → 다시 가고 싶은 네 곳 + 추천 6곳 + CTA Banner.

### 2.3 SCR-003 통합 여행 준비 `/travel-tools`

| 탭 (`?tab=`) | 표시 영역 |
|---|---|
| 항공편 `flight` (기본) | Intro + 3단계 → 탭 → 항공 Form → 입력 요약·외부 이동 Card → 비전달 고지 + Tip 3개 |
| 숙소 `hotel` | 같은 구성, 숙소 Form |
| 동행 구하기 `mate` (`&edit=<id>` 수정) | Intro → 탭 → 로그인·성인 확인 안내 또는 동행글 작성 Form + 안전 안내 |

### 2.4 SCR-004 동행 조회 `/mates`

Intro + 글쓰기 CTA → Filter·결과 요약 → 동행글 목록(최대 8개) + 상세 패널(`?post`, 아래 안내 Card 2개) → 신청 방법 3단계 → 안전 수칙·신고·차단 안내 + CTA Banner. Desktop은 목록·상세 분할, Mobile은 상세 Drawer.

### 2.5 SCR-005 계정·관리 `/account`

| 역할 | 탭 (`?tab=`) | 영역 |
|---|---|---|
| Guest | `login` (탭 바 없음) | 계정 Intro, 로그인·가입·비밀번호 재설정 Card, 로그인 후 가능한 기능, 보안 안내 |
| Member | `profile`, `activity` | 계정 요약, 성인 확인·프로필, 내 동행글, 참가 요청(받은·보낸), 차단 목록, 새 동행글 CTA, 도움말 |
| Admin | `profile`, `activity`, `admin` | Member 구성 + 운영 관리(신고 상태 변경, 항공·숙소 외부 이동 주소 설정) |

---

## 3. 승인된 디자인 기준

| 항목 | 기준 |
|---|---|
| 브랜드 | Free Traveler 텍스트 워드마크 + 코랄 나침반 아이콘 |
| 색 | 흰 배경 `#FFFFFF`, 텍스트 `#222222`, 주요 CTA 코랄 `#CF4329`(hover `#B83A24`) |
| Semantic 색 | danger `#A50E3A`, warning `#7A5200`, info `#175CD3`, success `#067647`, neutral `#3F3F3F` — 항상 아이콘 + 텍스트 라벨 |
| 글꼴 | Inter + 시스템 한글(Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR) |
| 모양 | 버튼·입력 8px, Card 14px, Chip·검색창 pill, 그림자 1단계 |
| 레이아웃 | Desktop 1440px(콘텐츠 1240px, 12열), Mobile 390px(여백 20px, Card 1열), Section 여백 80px / 48px |
| 접근성 | 터치 영역 44px 이상, `:focus-visible` 2px ink 외곽선, Drawer·Modal 포커스 관리 |
| 공통 영역 | Header·Footer를 5개 Screen에서 공통 사용 |

상세 토큰은 `docs/04_UIUX_PLAN.md` §3을 따른다.

---

## 4. 기존 공개 Route 통합

SRS §3.5의 공개 Route 16개는 아래와 같이 5개 Screen으로 통합한다. 왼쪽의 Route 파일은 만들지 않는다.

| SRS Route | 통합 위치 | 접근 방법 |
|---|---|---|
| `/` | SCR-001 | `/` |
| `/destinations` | SCR-001 검색 결과 모드 | `/?scope=all` |
| `/destinations/domestic` | SCR-001 검색 결과 모드 | `/?scope=domestic` |
| `/destinations/overseas` | SCR-001 검색 결과 모드 | `/?scope=overseas` |
| `/destinations/[slug]` | SCR-001 여행지 상세 Drawer | `/?dest=<slug>` |
| `/flights` | SCR-003 항공편 탭 | `/travel-tools?tab=flight` |
| `/hotels` | SCR-003 숙소 탭 | `/travel-tools?tab=hotel` |
| `/mates` | SCR-004 | `/mates` |
| `/mates/[id]` | SCR-004 상세 패널 (Mobile Drawer) | `/mates?post=<id>` |
| `/mates/new` | SCR-003 동행 구하기 탭 | `/travel-tools?tab=mate` |
| `/safety` | SCR-001 국가별 주의사항 영역 + 검색 결과 모드(안전정보) | `/?kind=safety` |
| `/safety/[countryCode]` | SCR-001 국가 안전정보 Drawer | `/?safety=<countryCode>` |
| `/about` | SCR-002 | `/about` |
| `/auth/*` | SCR-005 로그인 탭 + 기술 Route | `/account?tab=login`, `/auth/callback` |
| `/my/*` | SCR-005 프로필·내 활동 탭 | `/account?tab=profile`, `/account?tab=activity` |
| `/admin/*` | SCR-005 관리 탭 | `/account?tab=admin` |

기술 Route(디자인 Screen 아님): `/auth/callback`(`src/app/auth/callback/page.tsx`), `not-found`(`src/app/not-found.tsx`), `error`(`src/app/error.tsx`), `src/proxy.ts`. API Route는 만들지 않는다.

---

## 5. 승인 조건과 남은 확인 사항

| # | 항목 | 내용 | 처리 시점 |
|---|---|---|---|
| 1 | 대표 콘텐츠 | `04_UIUX_PLAN.md` §6.2의 여행을 시작한 이유, Timeline 7개, 방문 국가 30개, 기억에 남는 여행지 이야기는 초안이다. 대표가 확인한 내용으로 `src/data/curator.ts`에 넣는다 | SCR-002 구현 전 |
| 2 | 디자인 토큰 파일 | `design-reference/D-001/DESIGN.md`가 아직 없다. 그때까지 `04_UIUX_PLAN.md` §3을 토큰 출처로 쓴다 | 구현 전 |
| 3 | Desktop 폭 | Stitch는 Desktop을 1280px로 렌더링했다. 구현은 1440px 기준(`UI_CONTRACT.md` §1.4)을 따른다 | 구현 시 |
| 4 | SCR-005 관리 영역 위치 | Stitch 디자인은 Admin의 내 활동 화면에 관리 영역을 함께 보여 준다. 구현은 `?tab=admin`에서 렌더링한다 | 구현 시 |
| 5 | Stitch 수정 방식 | API 수정은 Stitch 캔버스에 저장되지 않는다. 디자인을 바꿀 때는 Stitch 편집기에서 직접 수정하고 검증을 다시 한다 | 디자인 변경 시 |
| 6 | 화면별 Preview 승인 | 5개 Screen 모두 구현 후 Preview 확인이 필요하다(`preview_required=true`) | 각 Screen 구현 후 |
