# Free Traveler UI Contract

| 항목 | 내용 |
|---|---|
| 문서 ID | UI-CONTRACT-TRAVEL-001 |
| 작성일 | 2026-10-09 |
| 기준 문서 | `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md` (STITCH_VALIDATION_PASS) |
| 짝 파일 | `design-reference/SCREEN_ROUTE_CONTRACT.json` (기계 판독용, 이 문서와 같은 내용) |
| 프레임워크 | Next.js 16.4 App Router, React 19.3, TypeScript strict, Tailwind CSS 4 |
| 디자인 토큰 출처 | `docs/04_UIUX_PLAN.md` §3. `design-reference/D-001/DESIGN.md`는 아직 없다(폴더만 있음) — 파일이 추가되면 토큰 출처를 그 파일로 바꾼다 |
| Stitch Project | `12669658078193088277` |

---

## 1. 공통 계약

### 1.1 Screen 구성

| Screen | 구분 | Route | Page Entry | Stitch Desktop | Stitch Mobile |
|---|---|---|---|---|---|
| SCR-001 메인 | 핵심 | `/` | `src/app/page.tsx` | `fd6afbb21ac84ac5a37017043f45c8f9` | `3f3464457ac14719b8a826fffb0c8945` |
| SCR-002 대표 소개 | 보조 | `/about` | `src/app/about/page.tsx` | `beeebd01d9be475392c9e7c6f46d6395` | — |
| SCR-003 통합 여행 준비 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` | `e60c66e71011429289057057824b567c` | `ffa60caca42c439cb75b48963f5f1d05` |
| SCR-004 동행 조회 | 핵심 | `/mates` | `src/app/mates/page.tsx` | `a5652785ec3c4c36ad2b028e4851e080` | — |
| SCR-005 계정·관리 | 핵심 | `/account` | `src/app/account/page.tsx` | `97ccb288104a40f3a1c10c801636f942` | — |

- 디자인 Screen은 위 5개뿐이다. Drawer·패널·탭·Modal은 해당 Screen 안의 상태이며 별도 Route를 만들지 않는다.
- SCR-002는 정적 콘텐츠 화면이고, 다른 화면의 기능이 이 화면에 의존하지 않으므로 보조로 분류한다.
- Stitch Mobile이 없는 Screen도 Mobile 390px 규칙(§1.4)과 각 Screen의 Mobile 규칙을 따른다.

### 1.2 기술 Route (Screen 수에 포함하지 않음)

| ID | Route | Entry | 역할 | 사용자에게 보이는 결과 |
|---|---|---|---|---|
| TR-AUTH-CALLBACK | `/auth/callback` | `src/app/auth/callback/page.tsx` | Supabase 가입 인증·비밀번호 재설정 메일 링크 처리. 브라우저 Supabase 클라이언트로 세션을 확정한 뒤 `router.replace` | 처리 중 문구 "계정을 확인하고 있어요" → `/account?tab=profile` 또는 `/account?tab=login&mode=reset` |
| TR-NOT-FOUND | 없는 모든 경로 | `src/app/not-found.tsx` | 404 | "찾으시는 페이지가 없어요" + 홈으로 / 여행지 둘러보기 |
| TR-ERROR | 렌더링 오류 | `src/app/error.tsx` (Client Component) | 오류 경계 | "일시적인 문제가 생겼어요" + 다시 시도 / 홈으로 |
| TR-API | `/api/*` | 없음 | **만들지 않는다.** PROJECT_SCOPE §5.2: 자체 Route Handler·Server Action 금지, 쓰기는 브라우저 Supabase 클라이언트 + RLS | — |
| TR-PROXY | 모든 요청 | `src/proxy.ts` | Supabase 세션 쿠키 갱신만 수행 (Next.js 16에서 Middleware 대신 Proxy) | 없음 |

`/auth/callback`은 Route Handler(`route.ts`)가 아니라 `page.tsx`로 만든다. PROJECT_SCOPE의 Route Handler 금지 규칙을 지키기 위해서다.

### 1.3 공통 Layout

| 항목 | 계약 |
|---|---|
| Root Layout | `src/app/layout.tsx` — `<html lang="ko">`, Inter + 시스템 한글 fallback, `<body>` 흰 배경 `#FFFFFF` |
| 공통 Component | `SiteHeader`, `SiteFooter`, `SkipLink`, `ToastRegion`, `PolicyDialog` — 5개 Screen과 기술 Route 화면 모두에 표시 |
| Header | 72px(Mobile 64px), 상단 고정, "Free Traveler" 워드마크 + 코랄 나침반 아이콘, 내비게이션 여행지(`/`)·대표 소개(`/about`)·여행 준비(`/travel-tools`)·동행 찾기(`/mates`), 오른쪽 계정 진입(`/account`). 현재 Screen 링크에 `aria-current="page"`와 2px ink 밑줄. Mobile은 44px 메뉴 버튼 → Sheet |
| Footer | `#F7F7F7` 배경, 3열(소개 / 바로가기 5개 / 안내: 정책 Modal 4종 + 외교부 해외안전여행 외부 링크), 하단 띠 "© 2026 Free Traveler · 이 사이트의 여행·안전 정보는 공식 기관의 최신 안내를 대신하지 않습니다." |
| Metadata | 각 `page.tsx`가 `metadata` 또는 `generateMetadata`로 title·description·canonical·Open Graph를 낸다. SCR-001은 `?dest`가 있으면 여행지별 값 |
| URL 상태 | 패널·탭·필터는 URL query로 표현한다. `page.tsx`의 `searchParams`는 `Promise`이므로 `await`로 읽는다. Client Component에서 `useSearchParams`를 쓰면 반드시 `<Suspense>`로 감싼다(없으면 production build 실패) |

### 1.4 Desktop·Mobile 공통 규칙

| 항목 | Desktop 1440px | Mobile 390px |
|---|---|---|
| 콘텐츠 폭 | 최대 1240px 가운데 정렬 | 좌우 여백 20px |
| 그리드 | 12열, 거터 24px | 4열, 거터 16px |
| Section 상하 여백 | 80px (Hero 아래 첫 Section·CTA Banner 64px) | 48px |
| Card | Screen별 열 수 | 모든 Card 1열 |
| Hero | 최대 520px, 첫 화면(1440×900)에 다음 Section 제목이 보여야 함 | 내용 높이 |
| Drawer·상세 패널 | 오른쪽 640px Drawer / 분할 패널 | 전체 화면 Sheet |
| 구간 | Desktop ≥1280px, Tablet 768~1279px(사진 Card 2열, 분할 6:6) | <768px |
| 최소 폭 | — | 320px에서 가로 스크롤 없음 |

### 1.5 공통 디자인·접근성 규칙

| 항목 | 계약 |
|---|---|
| 색 | 흰 캔버스, ink `#222222`, 주요 CTA 코랄 `#CF4329`(hover `#B83A24`). 코랄은 CTA·선택 Chip·즐겨찾기 상태에만 사용 |
| Semantic 색 | danger `#A50E3A`/`#FFF0F3`, warning `#7A5200`/`#FFF8E1`, info `#175CD3`/`#EFF8FF`, success `#067647`/`#ECFDF3`, neutral `#3F3F3F`/`#F2F2F2`. 항상 아이콘 + 텍스트 라벨과 함께 사용 |
| 모양 | 버튼·입력 8px, Card 14px, Chip·검색창 pill, 그림자 1단계 |
| 터치 | 버튼·Chip·탭·아이콘 버튼 최소 44×44px, 주요 버튼·입력 높이 48px |
| 포커스 | `:focus-visible` 2px ink 외곽선 + 2px 간격. 코랄을 포커스 표시에 쓰지 않음 |
| Drawer·Modal | 열 때 제목으로 포커스 이동, 포커스 가두기, Esc 닫기, 닫으면 연 요소로 포커스 복귀, 뒤로 가기로 닫힘. 브라우저 `alert`/`confirm` 금지 |
| 폼 | 라벨 위, 오류는 `aria-describedby`로 연결, 오류 요약 `role="alert"`, 필수 항목 "(필수)" 텍스트 |
| 이미지 | 실제 장소를 설명하는 `alt` 필수, 로드 실패 시 장소명 플레이스홀더, 크기 고정 |
| 문구 | Lorem ipsum·"준비 중"·"정보 확인 필요" 금지. 빈 목록은 이유·이용 방법·CTA가 있는 Empty State |

### 1.6 공통 금지 기능

모든 Screen에서 다음을 만들지 않는다.

- Airbnb 로고·워드마크·Rausch 색(`#FF385C`)·Cereal 글꼴·"Guest favorite" 배지
- 항공·호텔 검색 결과, 가격, 재고, 예약·결제·발권 UI, 별점·리뷰, 광고
- 실시간 채팅·실시간 알림·위치 공유 (알림은 Toast·화면 상태만)
- 행동 분석 이벤트 수집 (REQ-FUNC-071 EXCLUDED)
- 자체 Route Handler·Server Action
- 통계·차트·대시보드

---

## 2. SCR-001 메인

| 항목 | 계약 |
|---|---|
| Screen ID | SCR-001 (핵심) |
| Route | `/` |
| Page Entry | `src/app/page.tsx` — Create Next App 기본 화면을 그대로 두지 않는다(`starter_template_forbidden`) |
| Query | `q`, `scope`(all/domestic/overseas), `kind`(all/destination/safety — 검색 결과 유형), `country`, `city`, `season`, `theme`, `days`, `fav`(1), `dest`(slug), `safety`(countryCode) |
| 데이터 | `src/data` 정적 데이터(여행지·안전·대표), 즐겨찾기 `localStorage`, 최근 동행글은 Supabase 공개 조회 |
| 관련 요구사항 | REQ-FUNC-001~006, 009, 010, 047~054, 057, 067~069, REQ-NF-028 |

### 2.1 영역 순서

| # | 영역 | 주요 Component | 내용 |
|---|---|---|---|
| 1 | 검색 Hero | `SearchHero`, `SearchBar` | 제목, 설명, 구분 선택 + 키워드 + 검색 버튼, "항공·숙소 조건 정리하기" → `/travel-tools`, 대표 사진 |
| 2 | 국내 추천 여행지 | `DestinationGrid`, `DestinationCard` | 6개, "국내 여행지 10곳 모두 보기" |
| 3 | 해외 추천 여행지 | `DestinationBento`, `DestinationCard` | 6개(큰 Card 2 + 작은 Card 4), "해외 30개 도시 모두 보기" |
| 4 | 여행 동기·테마 | `ThemeTileGrid` | 6개 타일 → 테마 필터 적용 |
| 5 | 국가별 주의사항 | `SafetyCardGrid`, `SafetyCard`, `AdvisoryBadge` | 6개 → 안전정보 Drawer, 외교부 외부 링크 |
| 6 | 최근 동행글 | `RecentMatesSection`, `MateCard`, `EmptyState` | 모집중 3개 또는 Empty State |
| 7 | free_traveler 소개 | `CuratorTeaser`, `StatTile` | `50+ Trips`, `30+ Countries`, → `/about` |

**검색 결과 모드**: `q`·`scope`·필터 query가 있으면 영역 2·3 자리에 `SearchResultsSection`(`FilterBar`, 결과 Grid, 유형 라벨 "여행지"/"안전정보", 일치 문자열 강조)이 들어가고 영역 4~7은 유지한다.

**Overlay**:
- `DestinationDrawer` (`?dest`): 헤더, 사진, 한눈에 보기, 추천 시기, 명소 5+, 1일·3일 일정 탭, 예산, 교통, 음식 3+, 에티켓 3+, 안전정보 요약(해외), 다음 행동, 출처·수정일, 관련 여행지 최대 6
- `SafetyDrawer` (`?safety`): 중대 경보(최상단) → stale 경고 → 공식 판단 비대체 고지 → 경보 범위 → 8개 카테고리 → 긴급연락처 → 출처·외교부 원문. 여행지 상세에서 열면 같은 Drawer 안에서 전환하고 "← {여행지}로 돌아가기"를 표시

### 2.2 상태

| 상태 | 조건 | 표시 |
|---|---|---|
| Success | 기본 | 7개 영역 |
| Loading | 영역 6 조회 중 | Mate Card Skeleton 3개 (300ms 이내 응답이면 생략) |
| Empty | 검색·필터 결과 없음 | "조건에 맞는 여행지를 찾지 못했어요" + 필터 초기화 + 추천 테마 Chip |
| Empty | 즐겨찾기 없음 | "아직 저장한 여행지가 없어요" + 전체 여행지 보기 |
| Empty | 동행글 없음 | "아직 모집 중인 동행글이 없어요" + 3단계 + 동행글 쓰기 + 동행 찾기 둘러보기 |
| Error | 영역 6 조회 실패 | danger Alert + 다시 시도 + 동행 찾기로 이동. 다른 영역은 정상 |
| Error | 잘못된 `dest`·`safety` | Drawer를 열지 않고 Toast |
| Stale | 안전정보 `verifiedAt + 7일 < 현재` | warning Alert "최신 정보 재확인 필요", "최신" 배지 숨김, Card에는 "재확인 권장" |

### 2.3 사용자 행동

검색, 구분·필터 선택, 필터 초기화, 여행지 Card 열기, 즐겨찾기 저장·해제, 테마 선택, 안전정보 열기, 공유(Web Share → URL 복사 폴백), Drawer 닫기(닫기 버튼·Esc·뒤로 가기), 외교부 원문 열기(새 탭).

### 2.4 이동

| 목적지 | 계기 |
|---|---|
| `/?dest=<slug>`, `/?safety=<code>` | Card·검색 결과 선택, 상세의 안전정보 보기 (같은 Screen) |
| `/travel-tools` | Hero 보조 버튼 |
| `/travel-tools?tab=flight`, `?tab=hotel` | 상세 Drawer 다음 행동 (입력값은 넘기지 않음) |
| `/travel-tools?tab=mate` | 영역 6 "동행글 쓰기" |
| `/mates`, `/mates?post=<id>`, `/mates?country=<code>` | 영역 6 Card·링크, 상세 "이 지역 동행 찾기" |
| `/about` | 영역 7 버튼 |
| 외부 `https://www.0404.go.kr/` | 영역 5 버튼, 안전정보 Drawer (새 탭, `noopener noreferrer`) |

### 2.5 Desktop·Mobile

| Desktop | Mobile |
|---|---|
| Hero 7:5 분할(사진 오른쪽), 국내 3×2, 해외 Bento, 테마 3×2, 안전 4:8 분할(Card 2×3), 동행글 3열, 소개 5:7 분할 | Hero는 제목 → 검색 → 버튼 → 사진(16:10) 순, 모든 Card 1열, 필터는 하단 Sheet, Drawer는 전체 화면 Sheet |

### 2.6 금지 기능

공통 금지 기능(§1.6) + 객관적 인기 순위 표현("인기 1위" 등, 대신 "free_traveler가 고른"), 출처 없는 안전정보, 색만으로 경보 구분, 콘텐츠 편집 UI(CMS).

---

## 3. SCR-002 대표 소개

| 항목 | 계약 |
|---|---|
| Screen ID | SCR-002 (보조) |
| Route | `/about` |
| Page Entry | `src/app/about/page.tsx` (Server Component, 정적) |
| Query | 없음 |
| 데이터 | `src/data/curator.ts` 단일 출처 (`50+ Trips`, `30+ Countries` 값은 SCR-001과 공유) |
| 관련 요구사항 | REQ-FUNC-057~060, 062, 063 |

### 3.1 영역 순서

| # | 영역 | 주요 Component | 내용 |
|---|---|---|---|
| 1 | Profile Hero | `ProfileHero`, `ContactLinks` | 제목, 소개 문장, 문의·SNS(값이 있는 것만), 대표 사진(얼굴 식별 불가) |
| 2 | 여행 지표 | `StatTile` ×4 | `50+ Trips`, `30+ Countries`, `4개 권역`, `40곳` |
| 3 | 소개 | `ProfileStory` | 확정 소개문 전문, 여행을 시작한 이유, 철학·편집 원칙 |
| 4 | 여행 Timeline | `TravelTimeline` | 7개 시점(연도·장소·요약) |
| 5 | 방문 국가 | `CountryChipGroup` | 권역 4개, 30개국, 소개된 국가는 링크 Chip |
| 6 | Gallery | `PhotoGallery` | 서로 다른 장소 8장 + 캡션 |
| 7 | 기억에 남는 여행지 | `MemoryCard` ×4, `LinkChip` ×6, `CtaBanner` | 4곳 + 추천 6곳 + "여행 준비 시작하기"/"동행 찾아보기" |

### 3.2 상태

| 상태 | 표시 |
|---|---|
| Success | 정적 데이터로 7개 영역 (Loading·Empty·Unauthorized 없음) |
| Error (이미지) | 장소명 플레이스홀더, 레이아웃 유지 |
| SNS 값 없음 | 해당 링크를 렌더링하지 않음 |

### 3.3 사용자 행동

문의·SNS 열기, 국가 Chip 선택, Gallery 넘기기(Mobile 이전·다음 버튼), 기억에 남는 여행지·추천 Chip 선택, CTA 선택.

### 3.4 이동

| 목적지 | 계기 |
|---|---|
| `/?dest=<slug>` | 영역 7 Card·추천 Chip |
| `/?safety=<code>` | 영역 5 링크 Chip |
| `/travel-tools`, `/mates` | 영역 7 CTA Banner |
| 외부 문의·SNS | 영역 1 (`https:`·`mailto:`만, 새 탭) |

### 3.5 Desktop·Mobile

| Desktop | Mobile |
|---|---|
| Hero 6:6, 지표 4열, 소개 4:8(왼쪽 제목 고정), Timeline 가로, 국가 4열, Gallery 4×2, 기억에 남는 곳 2×2 | 모든 영역 1열, Timeline 세로, Gallery 가로 스와이프 1장씩 + "3 / 8" 위치 표시 |

### 3.6 금지 기능

공통 금지 기능(§1.6) + 대표 수치를 `50+ Trips`·`30+ Countries` 외의 표현으로 쓰기, 얼굴이 식별되는 인물 사진, 미디어 라이선스 관리 UI.

---

## 4. SCR-003 통합 여행 준비

| 항목 | 계약 |
|---|---|
| Screen ID | SCR-003 (핵심) |
| Route | `/travel-tools` |
| Page Entry | `src/app/travel-tools/page.tsx` |
| Query | `tab`(flight 기본 / hotel / mate), `edit`(postId, mate 탭 수정 모드) |
| 데이터 | 항공·숙소 입력은 Client Component 상태에만 보관(서버·URL·`localStorage`·분석에 남기지 않음). 외부 URL은 `app_settings` 또는 코드 기본값. 동행글 작성·수정은 Supabase |
| 관련 요구사항 | REQ-FUNC-011~026, 027, 031, 032, 038, 054, 080 |

### 4.1 영역 순서

| # | 영역 | 주요 Component | 표시 탭 |
|---|---|---|---|
| 1 | Intro | `ToolsIntro`, `StepGuide` | 전체 |
| 2 | 탭 | `ToolsTabs` (`role="tablist"`, 좌우 방향키) | 전체 |
| 3 | 입력 Form | `TripConditionForm` (flight/hotel 모드), `RegionSelect`, `DateField` | 항공·숙소 |
| 4 | 요약·외부 이동 | `TripSummaryCard`, `OutboundButton` | 항공·숙소 |
| 5 | 고지·Tip | `NonTransferNotice`, `TipCard` ×3 (Card마다 한 문장) | 항공·숙소 |
| 6 | 동행 구하기 | `MateAuthGate`, `MatePostForm`, `SafetyGuideCard` | 동행 구하기 |

탭마다 입력·검증·요약 상태를 따로 보관한다. 탭을 바꿨다 돌아오면 그 탭의 마지막 상태가 남아 있다.

### 4.2 상태

| 상태 | 대상 | 표시 |
|---|---|---|
| Success | 항공·숙소 | 입력 → 요약(국가·도시·날짜·박 수, 비전달 고지, 항공은 공식 판단 비대체 고지) |
| Error | 항공·숙소 검증 | 필드별 오류: 국가 없음, 도시 없음, 과거 날짜, 귀국일 < 출발일, 체크아웃 ≤ 체크인. 이동 버튼 비활성 |
| Error | 외부 연결 실패 | URL 없음·허용목록 밖 → danger Alert + 다시 시도, 입력 유지 |
| Unauthorized | 동행 탭, 비회원 | "동행글은 로그인한 뒤 쓸 수 있어요" + 3단계 + 로그인하기 + 동행글 먼저 둘러보기 |
| Unauthorized | 동행 탭, 성인 확인 전 | "만 19세 이상 확인이 필요해요" + 성인 확인하러 가기 |
| Unauthorized | 수정 권한 없음·없는 글 | "이 글을 수정할 수 없어요" + 동행 찾기로 돌아가기 |
| Error | 동행글 검증·연락처 탐지·제출 실패 | 필드 오류 + 오류 요약 / 연락처 탐지 Alert / 다시 시도, 입력 유지 |
| Loading | 제출 중, 수정 모드 불러오기 | 버튼 "올리는 중…" 비활성 / Form Skeleton |
| Warning | 승인자가 있는 글의 날짜 변경 | 화면 내 확인 Modal |

### 4.3 사용자 행동

탭 전환, 국가·도시·날짜 입력, 요약 확인, 수정, 외부 사이트 열기(새 탭), 동행글 입력·안전수칙 동의·제출·수정, 정책 Modal 열기.

### 4.4 이동

| 목적지 | 계기 |
|---|---|
| 외부 항공 일반 페이지 (기본 `https://www.google.com/travel/flights`) | "항공편 보러 가기" — 새 탭, query 없음, `noopener,noreferrer` |
| 외부 숙소 일반 페이지 (기본 `https://www.booking.com/`) | "호텔 보러 가기" — 같은 규칙 |
| `/mates?post=<id>` | 동행글 제출·수정 완료 |
| `/account?tab=login&next=/travel-tools?tab=mate` | 비회원의 동행 탭 |
| `/account?tab=profile` | 성인 확인 전 |
| `/mates` | 동행글 먼저 둘러보기, 수정 권한 없음 |

### 4.5 Desktop·Mobile

| Desktop | Mobile |
|---|---|
| Intro 한 줄 3단계 + 사진, 탭 Header 아래 고정, Form 7열 + 요약 Card 5열(스크롤 시 고정), Tip 3열, 동행 탭 8:4(Form + 안전 안내) | Intro 3단계 세로, 탭 가로 스크롤, Form → 요약 Card 순서로 1열, Tip 1열, 안전 안내는 Form 아래 |

### 4.6 금지 기능

공통 금지 기능(§1.6) + 항공·숙소 입력값을 URL query·서버·쿠키·`localStorage`·로그로 전달 또는 저장, 외부 URL에 query 붙이기, 항공권·호텔 검색 결과·가격·특가 문구, 항공·숙소용 서버 API, 모집글 공개 연락처.

---

## 5. SCR-004 동행 조회

| 항목 | 계약 |
|---|---|
| Screen ID | SCR-004 (핵심) |
| Route | `/mates` |
| Page Entry | `src/app/mates/page.tsx` |
| Query | `post`(id), `country`, `region`, `from`, `to`, `status`(open 기본 / all), `age`, `gender`, `style` |
| 데이터 | Supabase `mate_posts`(공개 컬럼, 차단 관계 제외), 마감은 조회 시 `end_date` 계산 |
| 관련 요구사항 | REQ-FUNC-027, 030, 033~035, 037~040, 069 |

### 5.1 영역 순서

| # | 영역 | 주요 Component | 내용 |
|---|---|---|---|
| 1 | Intro | `MatesIntro` | 제목, 설명, "동행글 쓰기", "신청 방법 보기" |
| 2 | Filter·결과 요약 | `MateFilterBar`, `ResultSummary` | 국가·지역·기간·모집 상태 + 상세 조건(연령대·성별·스타일), "조건에 맞는 동행글 N개", 조건 초기화 |
| 3 | 목록 | `MateList`, `MateCard` | 최대 8개 + "8개 더 보기" |
| 4 | 상세 | `MateDetailPanel`, `ApplicationForm`, `ReportDialog`, `BlockConfirmDialog`, `ApplyChecklistCard`, `ReportHintCard` | 상태·조건·설명·작성자 공개 프로필, 참가 메시지(500자), 공유, 신고·차단, 본인 글이면 수정·마감·삭제. 상세 아래 안내 Card 2개 |
| 5 | 신청 방법 | `StepGuide` | 3단계 (3단계 라벨 "내 활동에서 결과 확인") |
| 6 | 안전 안내 | `SafetyRules`, `CtaBanner` | 수칙 4개, 신고·차단 방법, "여행 준비로 가기" |

### 5.2 상태

| 상태 | 표시 |
|---|---|
| Loading | 목록 Skeleton 4개, 상세 Skeleton |
| Success | 목록 + 상세(첫 진입은 미선택 안내 또는 `?post` 글) |
| Empty (전체 없음) | "아직 올라온 동행글이 없어요" + 동행글 쓰기 + 신청 방법 보기 |
| Empty (조건 불일치) | "조건에 맞는 동행글이 없어요" + 조건 초기화 + 동행글 쓰기 + 3단계 |
| Error | 목록 실패: danger Alert + 다시 시도 / 없는 글·차단 관계: "이 글은 볼 수 없어요" + 목록으로 |
| Unauthorized | 비회원: 참가 요청·신고·차단 자리에 로그인 안내 / 성인 확인 전: 성인 확인 안내 |
| 이미 요청함 | 요청 Form 대신 상태 배지(대기 중·승인됨·거절됨) + 내 활동에서 보기 |
| 마감 | neutral 배지 "마감", 요청 Form 비활성 |
| 완료 | 요청 Toast, 신고 Modal 안에 접수번호·접수 시각, 차단 후 목록에서 제거 + Toast |

### 5.3 사용자 행동

필터 선택·초기화, 더 보기, 글 선택, 참가 메시지 작성·전송, 공유, 신고(사유·설명), 차단, 본인 글 수정·마감·삭제, 상세 닫기.

### 5.4 이동

| 목적지 | 계기 |
|---|---|
| `/mates?post=<id>` | 목록 Card, 공유 URL (같은 Screen) |
| `/travel-tools?tab=mate` | 동행글 쓰기, Empty CTA |
| `/travel-tools?tab=mate&edit=<id>` | 본인 글 수정 |
| `/travel-tools` | 영역 6 CTA Banner |
| `/account?tab=login&next=/mates?post=<id>` | 비회원의 참가 요청·신고·차단 |
| `/account?tab=profile` | 성인 확인 전 |
| `/account?tab=activity` | "내 활동에서 보기" |
| `/?safety=<code>` | 상세의 "주의사항 보기" |

### 5.5 Desktop·Mobile

| Desktop | Mobile |
|---|---|
| 목록 7열 + 상세 5열 고정 패널(아래 안내 Card 2개), 필터 한 줄, 3단계 가로, 안전 안내 분할 | 목록 1열, 상세는 전체 화면 Drawer(`?post`), 필터는 하단 Sheet, 3단계 세로 |

### 5.6 금지 기능

공통 금지 기능(§1.6) + 이메일·전화번호 등 작성자 연락처 노출, 실시간 알림 표현, 미성년자 참가, 운영자 제재(숨김·계정 제한) UI, 참가 요청 취소(WITHDRAWN).

---

## 6. SCR-005 계정·관리

| 항목 | 계약 |
|---|---|
| Screen ID | SCR-005 (핵심) |
| Route | `/account` |
| Page Entry | `src/app/account/page.tsx` |
| Query | `tab`(login / profile / activity / admin), `next`(로그인 후 돌아갈 내부 경로, `/`로 시작하는 값만 허용), `mode`(reset) |
| 데이터 | Supabase Auth 세션, `profiles`, `mate_posts`, `mate_applications`, `user_blocks`, `reports`(admin), `app_settings`(admin) |
| 관련 요구사항 | REQ-FUNC-028, 029, 036, 038, 040, 041, 043, 066, 077 |

### 6.1 역할별 탭

| 역할 | 렌더링하는 탭 | 기본 탭 |
|---|---|---|
| Guest | 로그인(탭 바 없음) | `login` |
| Member | 프로필, 내 활동 | `activity` (성인 확인 전이면 `profile`) |
| Admin | 프로필, 내 활동, 관리(관리자 배지) | `activity` |

역할에 없는 탭은 렌더링하지 않는다. 권한 판단은 서버(RLS·`profiles.role`)가 기준이며 화면 숨김은 보조 수단이다.

### 6.2 영역 순서

| 역할·탭 | # | 영역 | 주요 Component |
|---|---|---|---|
| Guest | 1 | 계정 Intro | `AccountIntro` |
| Guest | 2 | 로그인·가입·재설정 Card | `AuthCard`(로그인 / 회원가입 / 비밀번호 재설정 / 새 비밀번호) |
| Guest | 3 | 로그인 후 가능한 기능 | `FeatureCard` ×3 |
| Guest | 4 | 보안 안내 | `PrivacyChecklist` |
| Member 공통 | 1 | 계정 요약 + 탭 | `AccountSummary`, `AccountTabs` |
| 프로필 | 2 | 성인 확인·프로필 | `AdultVerifyCard`, `ProfileForm`, 로그아웃 |
| 내 활동 | 3 | 내가 올린 동행글 | `MyPostList` |
| 내 활동 | 4 | 참가 요청(받은·보낸) | `ApplicationTabs`, `ReceivedRequestCard`, `SentRequestRow` |
| 내 활동 | 5 | 차단한 회원 | `BlockList` |
| 내 활동 | 6 | 새 동행글 CTA | `CtaBanner` |
| 관리 | 7 | 운영 관리: 신고 목록 | `ReportStatusChips`, `ReportList` (상태 변경) |
| 관리 | 8 | 운영 관리: 외부 이동 주소 | `OutboundUrlForm` |
| 공통 | 9 | 도움말 | `HelpList` |

Stitch 디자인(`97ccb288…`)은 Admin 사용자의 내 활동 화면에 관리 영역을 함께 보여 준다. 구현에서는 관리 영역을 `tab=admin`일 때 렌더링한다.

### 6.3 상태

| 상태 | 표시 |
|---|---|
| Loading | 세션 확인 중 탭 영역·Header 계정 버튼 Skeleton, 목록 Skeleton |
| Success | 역할별 구성 |
| Empty | 내 글 / 받은 요청 / 보낸 요청 / 차단 목록 / 신고 목록 각각 이유 + 다음 행동 |
| Error | 로그인 실패, 이메일 미인증(인증 메일 다시 보내기), 만료된 링크, 닉네임 중복, 외부 URL 검증(`https:` + 허용 호스트만), 저장 실패 |
| Unauthorized | 비회원의 회원 탭 → 로그인 화면 + info Alert / 회원의 `tab=admin` → 관리 탭 없이 내 활동 + Toast "관리자만 볼 수 있는 메뉴예요." |
| 완료 | 가입 인증 메일 발송, 재설정 메일 발송, 승인·거절·차단 해제·저장 Toast |

### 6.4 사용자 행동

로그인, 회원가입, 인증 메일 재발송, 비밀번호 재설정·새 비밀번호 저장, 로그아웃, 성인 확인, 프로필 저장, 내 글 보기·수정·마감, 참가 요청 승인·거절, 차단 해제, (Admin) 신고 상태 변경, 외부 URL 저장.

### 6.5 이동

| 목적지 | 계기 |
|---|---|
| `next` 값 또는 `/account?tab=activity` | 로그인 성공 |
| `/account?tab=profile` | `/auth/callback`을 거친 가입 인증 완료 |
| `/mates?post=<id>` | 내 글·참가 요청 항목 |
| `/travel-tools?tab=mate`, `&edit=<id>` | 새 동행글 CTA, 내 글 수정 |
| `/` | 로그아웃, 권한 없음 화면의 홈 이동 |

### 6.6 Desktop·Mobile

| Desktop | Mobile |
|---|---|
| Guest: Intro + 인증 Card 좌우 분할, 기능 3열. Member: 요약 띠 + 탭, 목록 행에 버튼 오른쪽 정렬, 관리 영역 2열(신고 목록 + 외부 주소) | 모든 영역 1열, 목록 행의 버튼은 아래 줄로, 신고 목록은 표 대신 Card |

### 6.7 금지 기능

공통 금지 기능(§1.6) + 생년월일 입력·저장, 다른 회원 이메일 노출, 관리자 통계·대시보드·차트, 콘텐츠 CMS·미디어 업로드·감사 로그 화면, 운영자 제재(경고·숨김·계정 제한), 회원 탈퇴 자동 삭제·개인정보 내보내기, `role` 변경 UI.

---

## 7. 이동 관계 요약

| From | To | 계기 |
|---|---|---|
| 전역 Header | `/`, `/about`, `/travel-tools`, `/mates`, `/account` | 내비게이션 |
| SCR-001 | SCR-003 | Hero 보조 버튼, 상세 Drawer 다음 행동, 동행글 쓰기 |
| SCR-001 | SCR-004 | 최근 동행글, 이 지역 동행 찾기 |
| SCR-001 | SCR-002 | free_traveler 소개 |
| SCR-002 | SCR-001 | 기억에 남는 여행지·추천 Chip, 국가 Chip |
| SCR-002 | SCR-003, SCR-004 | CTA Banner |
| SCR-003 | SCR-004 | 동행글 제출·수정 완료, 둘러보기 |
| SCR-003 | SCR-005 | 동행 탭 로그인·성인 확인 안내 |
| SCR-004 | SCR-003 | 동행글 쓰기, 본인 글 수정, CTA Banner |
| SCR-004 | SCR-005 | 로그인·성인 확인 안내, 내 활동에서 보기 |
| SCR-004 | SCR-001 | 주의사항 보기 |
| SCR-005 | SCR-004 | 내 글·요청 항목 |
| SCR-005 | SCR-003 | 새 동행글, 내 글 수정 |
| SCR-005 | SCR-001 | 로그아웃 |
| TR-AUTH-CALLBACK | SCR-005 | 인증·재설정 처리 완료 |
| TR-NOT-FOUND, TR-ERROR | SCR-001 | 홈으로 |
