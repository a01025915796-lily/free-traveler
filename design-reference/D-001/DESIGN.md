# D-001 Free Traveler Design System

| 항목 | 내용 |
|---|---|
| ID | D-001 |
| 버전 | 1.0.0 |
| 상태 | LOCKED (`design-reference/D-001/MANIFEST.json`) |
| 근거 | `docs/04_UIUX_PLAN.md` §3·§4, Stitch 디자인 시스템 `assets/6924880912438359117`, `docs/STITCH_VALIDATION_REPORT.md` (STITCH_VALIDATION_PASS) |
| 적용 대상 | `/`, `/about`, `/travel-tools`, `/mates`, `/account`와 기술 Route 화면 |
| 구현 위치 | `src/app/globals.css`의 Tailwind CSS 4 `@theme` 토큰, `src/app/layout.tsx`의 글꼴 |

이 문서의 값을 바꾸려면 버전을 올리고 MANIFEST의 `status`를 `DRAFT`로 되돌린 뒤 다시 승인한다.

---

## 1. 원칙

1. 흰 배경 위에서 여행 사진이 시선을 이끌고, 글은 결정을 돕는다.
2. 강조색 코랄은 Section마다 주요 행동 하나, 선택된 Chip, 즐겨찾기 상태에만 쓴다.
3. 상태·경고·오류는 semantic 색과 아이콘·텍스트 라벨로 표시한다. 코랄을 쓰지 않는다.
4. Airbnb 로고·Rausch 색(`#FF385C`)·Cereal 글꼴·"Guest favorite" 배지·별점·가격·예약 UI를 쓰지 않는다.

---

## 2. 색

### 2.1 기본 색

| 토큰 | CSS 변수 | 값 | 흰 배경 대비 | 용도 |
|---|---|---|---:|---|
| canvas | `--color-canvas` | `#FFFFFF` | — | 페이지 배경 |
| surface-soft | `--color-surface-soft` | `#F7F7F7` | — | 교차 Section, Footer, 비활성 입력 |
| surface-strong | `--color-surface-strong` | `#F2F2F2` | — | 비활성 버튼, Skeleton |
| ink | `--color-ink` | `#222222` | 15.9:1 | 제목, 기본 본문, 포커스 링 |
| body | `--color-body` | `#3F3F3F` | 10.5:1 | 긴 본문 |
| muted | `--color-muted` | `#6A6A6A` | 5.4:1 | 보조 설명, 메타 정보, 비활성 탭 |
| hairline | `--color-hairline` | `#DDDDDD` | — | Card 테두리, 구분선 |
| hairline-soft | `--color-hairline-soft` | `#EBEBEB` | — | 긴 본문 구분선 |
| border-input | `--color-border-input` | `#8C8C8C` | 3.4:1 | 입력 테두리 |
| scrim | `--color-scrim` | `rgb(0 0 0 / 0.5)` | — | Drawer·Modal 배경 |

### 2.2 코랄 (강조)

| 토큰 | CSS 변수 | 값 | 흰 배경 대비 | 용도 |
|---|---|---|---:|---|
| primary | `--color-primary` | `#CF4329` | 4.7:1 | 주요 버튼 배경(흰 글자), 코랄 텍스트 링크 |
| primary-hover | `--color-primary-hover` | `#B83A24` | 5.7:1 | 주요 버튼 hover·pressed |
| primary-accent | `--color-primary-accent` | `#E8553E` | 3.6:1 | 아이콘, 선택 Chip 테두리, 즐겨찾기 채움 (텍스트 금지) |
| primary-tint | `--color-primary-tint` | `#FFF1EE` | — | 선택 Chip 배경 |

### 2.3 Semantic 색

| 의미 | 텍스트·아이콘 | 배경 | 테두리 | 용도 |
|---|---|---|---|---|
| danger | `#A50E3A` | `#FFF0F3` | `#F4B6C4` | 폼 오류, 중대 여행경보(출국권고·여행금지·특별여행주의보), 외부 연결 실패, 삭제 확인 |
| warning | `#7A5200` | `#FFF8E1` | `#F1D27C` | 안전정보 stale, 여행자제 단계, 승인자가 있는 글의 일정 변경 |
| info | `#175CD3` | `#EFF8FF` | `#B2DDFF` | 입력값 비전달 고지, 공식 판단 비대체 고지, 안전 안내, 여행유의 단계 |
| success | `#067647` | `#ECFDF3` | `#ABEFC6` | 모집중, 승인됨, 저장 완료, 성인 확인 완료 |
| neutral | `#3F3F3F` | `#F2F2F2` | `#DDDDDD` | 마감, 거절됨, 기각, 대기 |

CSS 변수 이름은 `--color-{의미}`, `--color-{의미}-bg`, `--color-{의미}-border`다. 여행경보 단계는 외교부 단계명을 텍스트로 쓰고 색은 보조 신호로만 쓴다.

---

## 3. 글꼴

| 항목 | 값 |
|---|---|
| 글꼴 | `Inter` (`next/font/google`, `--font-sans`) + fallback `-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif` |
| 한글 줄바꿈 | `word-break: keep-all` |
| 설명 문단 최대 폭 | 640px |

| 토큰 | Desktop | Mobile | 굵기 | 용도 |
|---|---|---|---|---|
| display | 40px / 52px | 28px / 38px | 700 | 화면별 `h1` (화면당 1개) |
| title-lg | 28px / 38px | 22px / 30px | 700 | Section `h2` |
| title-md | 20px / 28px | 18px / 26px | 600 | Drawer·패널 제목 |
| title-sm | 17px / 24px | 16px / 24px | 600 | Card 제목 |
| stat | 48px / 56px | 36px / 44px | 700 | `50+ Trips`, `30+ Countries` |
| body | 16px / 26px | 16px / 26px | 400 | 본문, Section 설명 |
| body-sm | 14px / 22px | 14px / 22px | 400 | Card 메타, 도움말 |
| caption | 13px / 18px | 13px / 18px | 500 | 장소명, 확인일, 배지 |
| button | 16px / 24px | 16px / 24px | 600 | 버튼 라벨 |

---

## 4. 간격·모서리·그림자

| 항목 | 값 |
|---|---|
| 간격 단위 | 4px 기반: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96 |
| Section 상하 여백 | Desktop 80px (Hero 아래 첫 Section·CTA Banner 64px), Mobile 48px |
| Section 내부 | 제목 → 설명 12px, 설명 → 콘텐츠 32px (Mobile 24px) |
| Card 간격 | Desktop 24px, Mobile 16px |
| 모서리 | 버튼·입력 8px (`--radius-control`), Card·Drawer 상단 14px (`--radius-card`), Chip·검색창 9999px (`--radius-pill`) |
| 그림자 | 1단계만: `0 0 0 1px rgb(0 0 0 / 0.02), 0 2px 6px rgb(0 0 0 / 0.04), 0 4px 8px rgb(0 0 0 / 0.10)` (`--shadow-raised`) — Card hover, 검색창, 고정 Action Card, 드롭다운 |

---

## 5. 레이아웃

| 항목 | Desktop 1440px | Mobile 390px |
|---|---|---|
| 콘텐츠 폭 | 최대 1240px 가운데 | 좌우 여백 20px |
| 그리드 | 12열, 거터 24px | 4열, 거터 16px |
| Header | 72px, 상단 고정 | 64px, 상단 고정 |
| Card 열 | 사진 Card 3열, 텍스트 Card 3~4열 | 1열 |
| Hero | 최대 520px — 1440×900 첫 화면에 다음 Section 제목이 보여야 함 | 내용 높이 |
| Drawer | 오른쪽 640px, 전체 높이 | 전체 화면 Sheet |

| 구간 | 폭 | 변화 |
|---|---|---|
| Mobile | < 768px | Header 메뉴는 Sheet, Card 1열, 분할 레이아웃은 위아래로, 상세 패널은 Drawer |
| Tablet | 768~1279px | 사진 Card 2열, 분할 6:6, Drawer 560px |
| Desktop | ≥ 1280px | 기준 레이아웃 |

320px 폭에서도 가로 스크롤이 생기지 않는다.

---

## 6. 컴포넌트 규칙

| 컴포넌트 | 규칙 |
|---|---|
| Button | 높이 48px. Primary: primary 배경 + 흰 글자, hover primary-hover. Secondary: 흰 배경 + 1px ink 테두리. Tertiary: 텍스트 + hover 밑줄. Disabled: surface-strong 배경 + muted 글자 + `aria-disabled`. 외부 이동 버튼은 "새 탭" 아이콘과 숨김 텍스트 "(새 탭에서 열림)" |
| Chip | 높이 44px pill. 기본 흰 배경 + hairline 테두리. 선택: primary-tint 배경 + primary-accent 테두리 + 체크 아이콘 + `aria-pressed="true"` |
| Card | 흰 배경, hairline 1px, 모서리 14px, hover 시 shadow-raised. 사진 Card는 4:3 사진 + 제목 + 메타 |
| Input | 높이 48px, border-input 1px, 모서리 8px, 포커스 시 2px ink. 라벨 위, 오류는 danger 아이콘 + 문장 + `aria-describedby` |
| Tabs | 텍스트 탭 + 활성 2px ink 밑줄, 높이 48px, `role="tablist"`, 좌우 방향키 |
| Drawer / Modal | scrim 배경, 열 때 제목으로 포커스, 포커스 가두기, Esc 닫기, 닫으면 연 요소로 복귀. Modal 최대 폭 560px. 브라우저 `alert`/`confirm` 금지 |
| Alert | semantic 배경·테두리 + 아이콘 + 굵은 제목 + 설명. 고지·경고는 닫기 버튼 없음 |
| Badge | 높이 24px pill, caption, semantic 색 + 아이콘 |
| Toast | 하단 가운데(Mobile 전체 폭), 4초, `aria-live="polite"` |
| Empty State | 아이콘 + 제목 + 이유·이용 방법 1~2문장 + Primary CTA + Secondary CTA |
| Skeleton | 실제 Card와 같은 크기의 surface-strong 블록. 300ms 안에 응답하면 표시하지 않음 |
| Image | 실제 장소를 설명하는 `alt` 필수, 크기 고정, 로드 실패 시 surface-soft + 장소명 |
| Header | 흰 배경 + 아래 hairline. "Free Traveler" 워드마크(20px/700 ink) + 코랄 나침반 아이콘, 내비게이션 4개 + 계정 진입, 현재 화면 2px ink 밑줄 + `aria-current="page"` |
| Footer | surface-soft 배경, 3열(소개 / 바로가기 / 안내), 하단 띠 caption muted |

---

## 7. 접근성

| 항목 | 기준 |
|---|---|
| 대비 | 텍스트 4.5:1 이상, 아이콘·테두리 3:1 이상 |
| 포커스 | `:focus-visible` 2px ink 외곽선 + 2px 간격. 사진 위 요소는 흰색 2px 안쪽 링 추가. 코랄 사용 금지 |
| 터치 | 버튼·Chip·탭·아이콘 버튼·체크박스 행 최소 44×44px |
| 구조 | 화면당 `h1` 1개, Section마다 `h2`, Header 앞 "본문으로 건너뛰기" 링크 |
| 모션 | Drawer 200ms 슬라이드, `prefers-reduced-motion`이면 페이드만 |
| 색 의존 금지 | 상태·경보는 항상 텍스트 라벨 병기 |

---

## 8. 콘텐츠 표기

| 항목 | 규칙 |
|---|---|
| 문장 | 존댓말 완성 문장, Section 설명 1~3문장, 버튼은 동사로 끝냄 |
| 대표 수치 | `50+ Trips`, `30+ Countries` 고정 |
| 금지 문구 | Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 Card |
| 순위 표현 | "인기 1위" 같은 객관적 순위 대신 "free_traveler가 고른" |
| 예약 연상 표현 | "최저가", "예약하기", "특가" 금지 |
