# Traveler 프로젝트 범위 (PROJECT_SCOPE)

| 항목 | 내용 |
|---|---|
| 문서 ID | SCOPE-TRAVEL-001 |
| 작성일 | 2026-10-07 |
| 기준 문서 | `docs/01_PRD.md` (PRD-TRAVEL-001 v1.0), `docs/02_SRS_BASELINE.md` (SRS-TRAVEL-001 v1.0) |
| 대상 코드 | 현재 저장소 (`package.json`, `src/app`) |
| 요구사항 수 | 기능 80건 (REQ-FUNC-001~080), 비기능 34건 (REQ-NF-001~034) |

---

## 1. 요구사항 상태 정의

| 상태 | 의미 |
|---|---|
| **IMPLEMENT** | 이 프로젝트에서 구현하고, 아래 "확인 방법"으로 테스트한다. 처리 방법에 적힌 범위가 구현 기준이며, SRS 문구 중 처리 방법에서 빠진 부분은 만들지 않는다. |
| **EXCLUDED** | 만들지 않는다. 제외 이유를 상태표에 기록한다. 관련 요구사항이 일부를 대신하는 경우 그 ID를 함께 적는다. |

SRS의 요구사항은 하나도 삭제하지 않는다. 114건 모두 §9·§10 상태표에 한 번씩 기록한다.

---

## 2. 현재 코드 상태

| 항목 | 현재 값 |
|---|---|
| 프레임워크 | Next.js `16.4.0` (App Router), React `19.3.0` |
| 언어·스타일 | TypeScript `^5` (`strict: true`), Tailwind CSS `^4` |
| 경로 별칭 | `@/*` → `./src/*` |
| `src/app` | `layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico` (Create Next App 기본 상태) |
| 스크립트 | `dev`, `build`, `start`, `lint` |
| 테스트 도구 | 없음 |
| Supabase | 없음 |

### 2.1 추가할 패키지

| 패키지 | 용도 |
|---|---|
| `@supabase/supabase-js`, `@supabase/ssr` | 이메일 인증, 동행·신고·설정 데이터 |
| `@playwright/test`, `@axe-core/playwright` | 핵심 Smoke Test, 자동 접근성 검사 |
| `vitest` | 날짜 검증·연락처 탐지·stale 계산·정적 데이터 완전성 단위 테스트 |

### 2.2 추가할 스크립트

| 스크립트 | 명령 |
|---|---|
| `typecheck` | `tsc --noEmit` |
| `test:unit` | `vitest run` |
| `test:e2e` | `playwright test` |

### 2.3 환경변수

| 이름 | 공개 범위 | 용도 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 클라이언트 | canonical·Open Graph 절대 URL |
| `NEXT_PUBLIC_SUPABASE_URL` | 클라이언트 | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 클라이언트 | Supabase 공개 키 (RLS 적용) |
| `E2E_USER_A_EMAIL`, `E2E_USER_A_PASSWORD`, `E2E_USER_B_EMAIL`, `E2E_USER_B_PASSWORD`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` | 로컬·테스트 전용 | 이메일 인증을 마친 Smoke Test 계정 |

Service Role Key는 사용하지 않는다. 항공·숙소 외부 URL 기본값은 코드 상수로 두고, 관리자가 저장한 값(`app_settings`)이 있으면 그 값을 쓴다.

---

## 3. 화면 구성

핵심 화면 4개와 보조 화면 1개로 구성한다. 상세·안전정보·대표 소개·작성·수정은 별도 페이지가 아니라 각 화면 안의 패널·대화상자로 연다. 패널 상태는 URL query로 표현해 새로고침·공유 시 복원한다.

| 화면 ID | 구분 | Route | 구성 | 접근 |
|---|---|---|---|---|
| **SCR-001** | 핵심 | `/` | 여행지 검색·필터·목록(국내/해외 탭), 여행지 상세 패널(`?dest=<slug>`), 국가 안전정보 패널(`?safety=<countryCode>`), `free_traveler` 대표 소개 섹션·패널(`?about=1`), 즐겨찾기 | Public |
| **SCR-002** | 핵심 | `/plan` | 항공 탭·숙소 탭(`?tab=flight\|hotel`): 입력 → 검증 → 요약 → 외부 사이트 새 탭 이동 | Public |
| **SCR-003** | 핵심 | `/mates` | 동행글 목록·필터, 상세 패널(`?post=<id>`), 작성·수정 대화상자, 마감, 참가 요청, 신고·차단 | 열람 Public, 쓰기 성인 확인 회원 |
| **SCR-004** | 핵심 | `/auth` | 회원가입, 이메일 인증 안내, 로그인, 로그아웃, 비밀번호 재설정, 성인 확인, 동행 프로필 입력 | Public/Member |
| **SCR-005** | 보조 | `/my` | 내 활동 탭(내 글, 받은 요청, 보낸 요청, 차단 목록), 관리자 탭(신고 목록·상태 변경, 외부 URL 설정). 관리자 탭은 `role=admin`에게만 보인다. | Member / Admin |

공통 요소: 전역 내비게이션(SCR-001~005), 푸터(정책 대화상자: 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책), `not-found.tsx`, `error.tsx`, Toast 영역.

---

## 4. 직접 구현 범위

| # | 범위 | 화면 | 주요 요구사항 |
|---|---|---|---|
| 1 | 핵심 화면 4개와 보조 화면 1개, 전역 내비게이션·푸터·오류 화면 | SCR-001~005 | REQ-FUNC-064, 065, 078 |
| 2 | 여행지 검색·필터와 상세 패널 | SCR-001 | REQ-FUNC-001~006, 008~010, 067, 068 |
| 3 | 국가 안전정보 패널 | SCR-001 | REQ-FUNC-046~054 |
| 4 | `free_traveler` 대표 소개 | SCR-001 | REQ-FUNC-057~060, 062, 063 |
| 5 | 항공·숙소 입력·검증·요약·외부 이동 | SCR-002 | REQ-FUNC-011~026 |
| 6 | Supabase 이메일 인증과 성인 확인 | SCR-004 | REQ-FUNC-027~029, 066 |
| 7 | 동행글 작성·조회·수정·마감 | SCR-003 | REQ-FUNC-030~033, 037, 038, 080 |
| 8 | 참가 요청·승인·거절 | SCR-003, SCR-005 | REQ-FUNC-034~036, 043, 044 |
| 9 | 간단한 차단·신고 | SCR-003, SCR-005 | REQ-FUNC-039, 040 |
| 10 | 내 활동과 간단한 관리자 탭 | SCR-005 | REQ-FUNC-041, 043, 077 |
| 11 | Playwright 핵심 Smoke Test | 전체 | §8.2 |
| 12 | Vercel 배포 | 전체 | REQ-NF-012, 016, 034, §8.4 |

---

## 5. 구현 방식

### 5.1 데이터 위치

| 데이터 | 위치 | 비고 |
|---|---|---|
| 여행지·도시·국가 | `src/data/destinations.ts`, `src/data/countries.ts` | 국내 10곳, 해외 15개국 30개 도시. 타입으로 필수 필드를 강제한다. |
| 국가 안전정보 | `src/data/safety.ts` | 8개 카테고리, 경보 범위(`scopeType`, `scopeText`), 출처명·URL, `verifiedAt`, 편집자, 긴급연락처 |
| 대표 콘텐츠 | `src/data/curator.ts` | `free_traveler`, `50+ Trips`, `30+ Countries`, 소개문, 철학, 편집 원칙, 방문 국가 30개 이상, 타임라인, 추천 여행지 6개, SNS 링크 |
| 즐겨찾기 | 브라우저 `localStorage` | 여행지 slug 배열. 읽기·쓰기는 `try/catch`로 감싸고 실패 시 빈 목록으로 동작한다. |
| 항공·숙소 입력값 | React 컴포넌트 상태 | 서버·`localStorage`·URL·분석 이벤트에 남기지 않는다. |
| 회원·동행·요청·차단·신고·외부 URL | Supabase PostgreSQL + RLS | §6 참고 |

### 5.2 동작 규칙

| 규칙 | 방식 |
|---|---|
| 알림 | 실제 이메일을 보내지 않는다. 작업 결과는 Toast로, 요청 상태(대기·승인·거절)는 SCR-005 내 활동 탭의 상태 배지로 보여준다. Supabase Auth가 보내는 가입 인증·비밀번호 재설정 메일만 사용한다. |
| 자동 마감 | 배치 작업 없이 조회 시 계산한다. `status='OPEN'`이고 `end_date < 오늘(Asia/Seoul)`이면 화면에 "마감"으로 표시하고, 모집중 필터 쿼리는 `end_date >= 오늘` 조건을 붙인다. |
| 안전정보 stale | 렌더링 시 `verifiedAt + 7일 < 현재 시각`이면 "최신 정보 재확인 필요" 경고와 공식 링크를 먼저 보여주고 "최신" 배지를 숨긴다. |
| 이미지 | 일반 인터넷 이미지 URL과 `alt` 텍스트만 저장한다. `next/image`와 `next.config.ts`의 `images.remotePatterns`로 사용하는 호스트만 허용한다. 로드 실패 시 기본 플레이스홀더를 보여준다. |
| 관리자 | 신고 상태 변경(OPEN/REVIEWING/RESOLVED/DISMISSED)과 항공·숙소 외부 URL 설정만 다룬다. 콘텐츠는 `src/data` 수정과 재배포로 바꾼다. |
| 외부 이동 | `window.open(url, "_blank", "noopener,noreferrer")` 또는 `<a target="_blank" rel="noopener noreferrer">`. URL에 query를 붙이지 않는다. 허용 호스트: `www.google.com`, `www.booking.com`. |
| 성인 확인 | 생년월일을 받지 않고 "만 19세 이상입니다" 확인 체크로 `is_adult=true`, `adult_verified_at`만 저장한다. |
| 공개 연락처 탐지 | 전화번호·이메일·메신저 ID(카카오톡·텔레그램·라인·인스타그램 표기 등) 정규식으로 제목·설명을 검사해 제출을 막고 수정 안내를 표시한다. |
| 서버 코드 | 자체 Route Handler·Server Action을 만들지 않는다. 쓰기는 브라우저 Supabase 클라이언트가 RLS 아래에서 수행하고, `src/proxy.ts`는 세션 갱신만 맡는다. |

---

## 6. Supabase 구성

| 테이블 | 주요 컬럼 | RLS 요지 |
|---|---|---|
| `profiles` | `user_id`(PK, `auth.users`), `nickname`(UNIQUE), `is_adult`, `adult_verified_at`, `age_band`, `gender`(선택), `travel_styles`, `bio`(≤500), `role`(`member`/`admin`) | 공개 읽기는 닉네임·연령대·성별·스타일·자기소개만. 본인만 수정. `role`은 사용자가 바꿀 수 없고 SQL로만 지정한다. 이메일 컬럼을 두지 않는다. |
| `mate_posts` | `id`, `owner_id`, `country_code`, `region_slug`, `start_date`, `end_date`(≥ start), `capacity`(1~10), `preferences`, `travel_styles`, `title`(≤100), `description`(≤3000), `status`(`OPEN`/`CLOSED`/`DELETED`), `safety_agreed_at`, `policy_version`, `created_at` | 읽기는 `DELETED` 제외 + 차단 관계 제외. 생성은 `is_adult=true` 본인. 수정·마감·삭제는 작성자만. |
| `mate_applications` | `id`, `post_id`, `applicant_id`, `message`(≤500), `status`(`PENDING`/`ACCEPTED`/`REJECTED`), `created_at` | 읽기는 요청자·글 작성자만. 생성은 성인 회원, 모집중 글, 차단 관계 아님. 상태 변경은 글 작성자만. `(post_id, applicant_id)` 부분 UNIQUE (`status in ('PENDING','ACCEPTED')`). |
| `user_blocks` | `blocker_id`, `blocked_id`, `created_at`, pair UNIQUE | 본인 행만 읽기·생성·삭제 |
| `reports` | `id`, `reporter_id`, `target_type`(`post`/`user`/`application`), `target_id`, `reason_code`, `description`, `status`, `handled_by`, `handled_at`, `created_at` | 생성은 회원 본인. 읽기는 신고자 본인(접수번호·상태)과 admin. 상태 변경은 admin만. |
| `app_settings` | `key`(`flight_outbound_url`/`hotel_outbound_url`), `value`, `updated_at` | 읽기 Public, 쓰기 admin. `value`는 `https://`로 시작해야 한다(CHECK). |

차단 관계 확인은 `is_blocked(a, b)` SQL 함수로 묶어 각 정책에서 재사용한다. 마이그레이션 SQL은 `supabase/migrations/`에 둔다.

---

## 7. 제외 기능

| 제외 기능 | 이유 | 대신하는 방식 | 관련 요구사항 |
|---|---|---|---|
| 전체 콘텐츠 CMS (여행지·안전·대표 콘텐츠 CRUD, 게시 상태, 미리보기, 편집·승인 분리) | 콘텐츠 양이 고정된 MVP에서 관리 화면 비용이 크다. | `src/data` 정적 데이터를 코드 리뷰 후 재배포. 완전성은 단위 테스트로 막는다. | REQ-FUNC-055, 072, 075 |
| 미디어 업로드·라이선스 승인 워크플로 | 저장소·라이선스 증빙 관리가 필요하다. | 일반 인터넷 이미지 URL과 `alt` 텍스트만 사용 | REQ-FUNC-007, 061, 073, REQ-NF-029 |
| 범용 감사 로그 | 모든 변경을 기록하는 별도 테이블·조회 화면이 필요하다. | 콘텐츠 변경은 Git 이력, 신고 처리는 `reports.handled_by`, `handled_at` | REQ-FUNC-042, 056, 076, REQ-NF-022 |
| 자동 백업·장애 알림·부하 테스트 | 유료 플랜·모니터링 인프라가 필요하다. | Supabase·Vercel 기본 제공 기능에 맡긴다. | REQ-NF-004, 005, 008~011, 019, 033 |
| 외부 이메일 사업자 연동 | 발송 도메인·재시도 큐 운영이 필요하다. | Toast·화면 상태. Supabase Auth 기본 메일만 사용 | REQ-FUNC-043의 이메일 부분 |
| EC2·AWS 인프라 | Vercel·Supabase로 충분하다. | Vercel 배포 | — |
| 무인 자동 Merge Runner | Merge는 사람이 검토 후 결정한다. | 로컬 검사 통과 후 사용자가 직접 Merge | REQ-NF-031 |
| 운영자 제재(경고·콘텐츠 숨김·계정 일시 제한) | 관리자는 신고 상태와 외부 URL만 다룬다. | 사용자 차단, 신고 상태 관리 | REQ-FUNC-042 |
| 회원 탈퇴 자동 삭제·개인정보 내보내기 | Service Role 권한과 삭제 배치가 필요하다. | 요청 시 Supabase 대시보드에서 수동 처리 | REQ-FUNC-045, REQ-NF-018 |
| 행동 분석 이벤트 수집 | 분석 SDK 도입 시 입력값 유출 위험이 생기고 MVP 필수 흐름이 아니다. | 수집하지 않음 | REQ-FUNC-071, REQ-NF-002 |
| 쓰기 속도 제한(429) | 서버 측 카운터 인프라가 필요하다. | Supabase Auth 기본 속도 제한 | REQ-NF-021 |
| 참가 요청 취소(WITHDRAWN) | 승인·거절 흐름에 필요하지 않다. | 상태는 PENDING/ACCEPTED/REJECTED 3개 | — |

---

## 8. 테스트·확인 방법

### 8.1 단위 테스트 (Vitest, `src/**/*.test.ts`)

| ID | 대상 |
|---|---|
| UT-01 | 여행지 필터·키워드 검색·국내/해외 구분·관련 여행지·URL query 직렬화 |
| UT-02 | 항공 날짜 검증 (오늘 이전 출발일, 귀국일 < 출발일, 오늘 경계값) |
| UT-03 | 숙소 날짜 검증 (오늘 이전 체크인, 체크아웃 ≤ 체크인) |
| UT-04 | 외부 URL 허용목록 (HTTPS, 허용 호스트, `http:`·`javascript:`·`data:` 거부, query 없음) |
| UT-05 | 공개 연락처 탐지 기준 테스트셋 (탐지율 ≥95%, 오탐 ≤5%) |
| UT-06 | 자동 마감 계산 (`end_date` 기준, Asia/Seoul) |
| UT-07 | 안전정보 stale 계산 (7일 경계, 고정 기준 시각) |
| UT-08 | 정적 데이터 완전성 (여행지 필수 필드·수량, 해외 국가별 안전정보, 8개 카테고리, 경보 범위, 대표 프로필, 추천 slug 존재, 모든 이미지 `alt`) |
| UT-09 | 즐겨찾기 저장 (중복 방지, `localStorage` 예외 시 빈 목록) |

### 8.2 Playwright 핵심 Smoke Test (Chromium, `e2e/*.spec.ts`)

| ID | 시나리오 |
|---|---|
| SMK-01 | SCR-001: 국내/해외 탭, 필터·검색, 결과 없음 안내·초기화, 상세 패널 필수 항목, 해외 상세 → 같은 국가 안전 패널, stale 경고, 대표 소개 수치 일치 |
| SMK-02 | SCR-002: 필수값·날짜 오류 차단, 요약 일치, 비전달 안내, 외부 링크 `href`(query 없음)·`target`·`rel`, 입력 중 발생한 네트워크 요청에 입력값 없음 |
| SMK-03 | 비회원: 동행 목록 열람 가능, 작성·참가 요청 시 `/auth`로 이동 |
| SMK-04 | 회원 A: 로그인, 연락처 포함 글 제출 차단, 글 작성·수정·마감, `<script>` 문자열이 텍스트로 표시됨, 로그아웃 |
| SMK-05 | 회원 B 참가 요청 → 중복 요청 차단 → 회원 A 승인·거절 → B의 내 활동에 상태 표시. 제3자는 요청을 볼 수 없음 |
| SMK-06 | 신고 접수번호·시각 3초 이내 표시, 차단 후 상대 글·프로필이 목록에서 사라짐, 차단 해제 |
| SMK-07 | 관리자: 신고 상태 필터·변경, 외부 URL에 `http:`·`javascript:`·허용목록 밖 주소 저장 거부. 일반 회원은 관리자 탭을 볼 수 없음 |
| SMK-08 | 공통: 5개 Route의 title·description·canonical·Open Graph, 320px 폭 가로 스크롤 없음, axe serious/critical 0건, 404 화면의 홈 링크 |

로그인이 필요한 시나리오는 §2.3의 이메일 인증을 마친 테스트 계정을 사용한다. 테스트가 만든 글·요청·신고는 테스트 끝에 같은 계정으로 삭제한다.

### 8.3 수동 확인

| ID | 대상 |
|---|---|
| MAN-01 | 가입 인증 메일 수신·인증 링크, 비밀번호 재설정 메일 |
| MAN-02 | 키보드만으로 SCR-001~005 핵심 흐름 완료, VoiceOver로 폼 오류·패널 제목 읽힘 |
| MAN-03 | Vercel 배포 URL에서 모바일 Lighthouse (Performance ≥85, LCP ≤2.5s, CLS ≤0.1) |
| MAN-04 | Supabase 대시보드에서 RLS 활성화·정책 목록 확인 |

### 8.4 배포

| 항목 | 기준 |
|---|---|
| 플랫폼 | Vercel (Git 연결). Preview 배포로 확인 후 사용자가 Production을 승격한다. |
| 환경변수 | §2.3의 `NEXT_PUBLIC_*` 3개를 Vercel Preview·Production에 등록 |
| Supabase | Auth Redirect URL에 배포 도메인 `/auth` 등록 |
| 배포 전 검사 | `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`, `npm run test:e2e` 통과 |

---

## 9. 기능 요구사항 상태표 (REQ-FUNC-001~080)

| ID | 요구사항 요지 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 여행지 목록 구분 | IMPLEMENT | SCR-001 국내/해외 탭. `src/data`의 `scope` 값으로 분류 | UT-01, SMK-01 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | IMPLEMENT | 정적 데이터를 클라이언트에서 AND 조건으로 필터 | UT-01, SMK-01 |
| REQ-FUNC-003 | 키워드 검색 | IMPLEMENT | 여행지명·국가명·테마 한글 부분 일치, 결과 없음 상태 | UT-01, SMK-01 |
| REQ-FUNC-004 | 여행지 상세 필수 항목 | IMPLEMENT | 상세 패널에 소개·명소 5+·추천 시기·1일/3일 일정·예산·교통·음식 3+·에티켓·출처·수정일 표시. 게시 상태 대신 데이터 타입과 완전성 테스트로 누락을 막는다 | UT-08, SMK-01 |
| REQ-FUNC-005 | 결과 없음 안내·초기화 | IMPLEMENT | 조건 완화 안내와 "필터 초기화" 버튼, 초기화 시 전체 목록 복원 | SMK-01 |
| REQ-FUNC-006 | 해외 상세 → 해당 국가 안전정보 | IMPLEMENT | 상세 패널에서 `?safety=<countryCode>` 안전 패널을 연다 | UT-08, SMK-01 |
| REQ-FUNC-007 | 대표 이미지 출처·작가·라이선스 | EXCLUDED | 미디어 라이선스 워크플로 제외. 이미지는 URL과 `alt`만 사용하며 `alt` 필수는 REQ-FUNC-079·REQ-NF-023에서 확인 | — |
| REQ-FUNC-008 | 국내 10곳, 해외 15개국 30개 도시 | IMPLEMENT | `src/data`에 수량을 채우고 테스트로 수량을 검사 | UT-08 |
| REQ-FUNC-009 | 관련 여행지 최대 6개 | IMPLEMENT | 같은 국가·테마 여행지를 현재 여행지 제외 후 최대 6개 표시 | UT-01 |
| REQ-FUNC-010 | 필터 상태 URL 반영 | IMPLEMENT | 허용 필터만 query로 직렬화, 잘못된 값은 무시 | UT-01, SMK-01 |
| REQ-FUNC-011 | 항공 필수 입력 4개 | IMPLEMENT | SCR-002 항공 탭: 국가, 지역·도시, 출발일, 귀국일. 라벨·도움말·오류 영역 포함 | SMK-02 |
| REQ-FUNC-012 | 국가별 지역만 선택 | IMPLEMENT | 지역 선택지를 국가 데이터에서 생성, 국가 변경 시 지역 초기화 | SMK-02 |
| REQ-FUNC-013 | 항공 날짜 검증 | IMPLEMENT | 출발일 < 오늘 또는 귀국일 < 출발일이면 진행 차단·원인 표시 | UT-02, SMK-02 |
| REQ-FUNC-014 | 항공 입력 요약 | IMPLEMENT | 요약 단계 표시. "수정"으로 돌아가면 컴포넌트 상태의 값 유지 | SMK-02 |
| REQ-FUNC-015 | 항공 비전달 안내 | IMPLEMENT | 폼과 요약에 "입력값은 외부 사이트로 전달되지 않습니다" 표시, 버튼에 `aria-describedby` 연결 | SMK-02 |
| REQ-FUNC-016 | 항공 외부 URL 새 탭 | IMPLEMENT | `app_settings` 값 또는 기본 상수를 query 없이 `noopener,noreferrer` 새 탭으로 연다 | UT-04, SMK-02 |
| REQ-FUNC-017 | 항공 입력값 미저장 | IMPLEMENT | 항공 폼용 서버 API·분석 이벤트를 만들지 않고 값은 컴포넌트 상태에만 둔다 | SMK-02 |
| REQ-FUNC-018 | 항공 URL 오류 처리 | IMPLEMENT | URL이 없거나 허용목록 밖이면 이동하지 않고 인라인 오류와 "다시 시도" 표시, `console.error` 기록 | UT-04, SMK-02 |
| REQ-FUNC-019 | 숙소 필수 입력 4개 | IMPLEMENT | SCR-002 숙소 탭: 국가, 지역·도시, 체크인, 체크아웃 | SMK-02 |
| REQ-FUNC-020 | 국가별 지역만 선택 | IMPLEMENT | 항공과 같은 지역 선택 컴포넌트 사용 | SMK-02 |
| REQ-FUNC-021 | 숙소 날짜 검증 | IMPLEMENT | 체크인 < 오늘 또는 체크아웃 ≤ 체크인이면 진행 차단 | UT-03, SMK-02 |
| REQ-FUNC-022 | 숙소 입력 요약 | IMPLEMENT | 국가·지역·체크인·체크아웃 요약, 입력값과 일치 | SMK-02 |
| REQ-FUNC-023 | 숙소 비전달 안내 | IMPLEMENT | 폼과 요약에 비전달 안내 표시 | SMK-02 |
| REQ-FUNC-024 | 숙소 외부 URL 새 탭 | IMPLEMENT | 항공과 같은 방식으로 숙소 URL을 연다 | UT-04, SMK-02 |
| REQ-FUNC-025 | 숙소 입력값 미저장 | IMPLEMENT | 서버 API·분석 이벤트 없음, 컴포넌트 상태만 사용 | SMK-02 |
| REQ-FUNC-026 | 숙소 URL 오류 처리 | IMPLEMENT | 이동 차단, 입력 유지, 인라인 오류·재시도, `console.error` 기록 | UT-04, SMK-02 |
| REQ-FUNC-027 | 동행 쓰기에 인증 세션 필요 | IMPLEMENT | 비로그인 쓰기 시도는 `/auth`로 이동. RLS가 `auth.uid()` 없는 쓰기를 거부 | SMK-03, MAN-04 |
| REQ-FUNC-028 | 만 19세 이상 확인, 생년월일 미저장 | IMPLEMENT | SCR-004 성인 확인 체크로 `is_adult`, `adult_verified_at`만 저장. RLS가 `is_adult=true`를 요구 | SMK-03, SMK-04 |
| REQ-FUNC-029 | 동행 프로필 | IMPLEMENT | SCR-004에서 닉네임·연령대·여행 스타일(필수), 성별·자기소개(선택) 입력 | SMK-04 |
| REQ-FUNC-030 | 동행글 필터 | IMPLEMENT | 국가·지역·기간 겹침·연령대·성별·스타일·모집 상태 필터를 Supabase 쿼리로 처리, 차단 관계 글 제외 | SMK-06 |
| REQ-FUNC-031 | 모집글 입력 항목 | IMPLEMENT | 제목·국가·지역·시작일·종료일·인원·선호 조건·스타일·설명·안전수칙 동의. 누락·역전 날짜·과거 종료일 차단 | UT-06, SMK-04 |
| REQ-FUNC-032 | 공개 연락처 탐지 | IMPLEMENT | 제출 전 정규식 검사로 차단하고 수정 안내 표시 | UT-05, SMK-04 |
| REQ-FUNC-033 | 이메일·연락처 비노출 | IMPLEMENT | `profiles`에 이메일 컬럼을 두지 않고 공개 컬럼만 조회 | SMK-04 |
| REQ-FUNC-034 | 참가 메시지 500자 비공개 | IMPLEMENT | 모집중 글에 ≤500자 메시지, PENDING 저장, RLS로 요청자·작성자만 열람 | SMK-05 |
| REQ-FUNC-035 | 중복 요청 차단 | IMPLEMENT | 부분 UNIQUE 인덱스와 UI 오류 메시지 | SMK-05 |
| REQ-FUNC-036 | 작성자 승인·거절 | IMPLEMENT | 작성자만 ACCEPTED/REJECTED로 변경(RLS). 감사 로그 기록은 제외(§7) | SMK-05 |
| REQ-FUNC-037 | 종료일 경과 자동 마감 | IMPLEMENT | 조회 시 `end_date` 기준으로 마감 계산, 모집중 목록에서 제외 | UT-06, SMK-04 |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | IMPLEMENT | 작성자 수정·마감·삭제(`DELETED`). 승인자가 있으면 날짜 변경 전 화면 내 확인 대화상자 표시 | SMK-04 |
| REQ-FUNC-039 | 글·사용자·요청 신고 | IMPLEMENT | 사유 코드와 설명 입력, 접수번호·접수 시각 표시 | SMK-06 |
| REQ-FUNC-040 | 사용자 차단·해제 | IMPLEMENT | `user_blocks`와 RLS로 상호 글·프로필·요청 비노출, SCR-005에서 해제 | SMK-06 |
| REQ-FUNC-041 | 신고 큐 | IMPLEMENT | SCR-005 관리자 탭에 대상·사유·설명·접수 시각·상태 목록과 OPEN/REVIEWING/RESOLVED/DISMISSED 필터 | SMK-07 |
| REQ-FUNC-042 | 운영자 제재 조치 | EXCLUDED | 관리자는 신고 상태만 바꾼다. 경고·콘텐츠 숨김·계정 제한과 감사 로그는 제외. 신고 처리 결과는 REQ-FUNC-041의 RESOLVED/DISMISSED로 기록 | — |
| REQ-FUNC-043 | 요청·처리 결과 알림 | IMPLEMENT | 이메일 없이 Toast와 SCR-005 상태 배지로 제공 | SMK-05 |
| REQ-FUNC-044 | RLS 비공개 데이터 보호 | IMPLEMENT | §6 정책: 본인, 요청 대상 작성자, admin만 비공개 데이터 열람 | SMK-05, SMK-07, MAN-04 |
| REQ-FUNC-045 | 탈퇴 비식별화·30일 삭제 | EXCLUDED | Service Role 권한과 삭제 배치가 필요하다. 요청 시 Supabase 대시보드에서 수동 처리 | — |
| REQ-FUNC-046 | 해외 국가별 안전정보 존재 | IMPLEMENT | `src/data/safety.ts`에 15개국 모두 작성 | UT-08 |
| REQ-FUNC-047 | 8개 안전 카테고리 | IMPLEMENT | 치안·사기·법규·교통·재난·기후·보건·문화·복장·긴급연락처 섹션을 타입으로 강제 | UT-08, SMK-01 |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 | IMPLEMENT | 안전 데이터에 필드를 두고 패널에 표시 | UT-08, SMK-01 |
| REQ-FUNC-049 | 외교부 원문 새 탭 링크 | IMPLEMENT | `https://www.0404.go.kr/` 링크에 `target="_blank"`, `rel="noopener noreferrer"`. 주간 링크 검사는 제외(REQ-NF-011) | SMK-01 |
| REQ-FUNC-050 | 7일 초과 stale 경고 | IMPLEMENT | 렌더링 시 계산해 경고 표시, "최신" 배지 숨김 | UT-07, SMK-01 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | IMPLEMENT | 출국권고·여행금지·특별여행주의보를 패널 최상단에 단계·행동요령·범위 텍스트로 표시 | SMK-01 |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 | IMPLEMENT | `scopeType`(COUNTRY/REGION)과 `scopeText` 필드, 지역 경보는 `scopeText` 필수 | UT-08 |
| REQ-FUNC-053 | 긴급전화·재외공관 정보 | IMPLEMENT | 번호·링크·출처·확인일 표시 | UT-08, SMK-01 |
| REQ-FUNC-054 | 공식 판단 비대체 고지 | IMPLEMENT | 안전 패널과 SCR-002 항공 요약에 원문 재확인 안내 표시 | SMK-01, SMK-02 |
| REQ-FUNC-055 | 안전 콘텐츠 작성·검수·게시 | EXCLUDED | 전체 콘텐츠 CMS 제외. `src/data` 수정·코드 리뷰·재배포로 대신한다 | — |
| REQ-FUNC-056 | 안전정보 변경 이력 | EXCLUDED | 범용 감사 로그 제외. 변경 이력은 Git 커밋 이력으로 확인 | — |
| REQ-FUNC-057 | `free_traveler`, `50+ Trips`, `30+ Countries` | IMPLEMENT | `src/data/curator.ts` 단일 값을 홈 소개 카드와 대표 소개 패널에서 사용 | UT-08, SMK-01 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 | IMPLEMENT | PRD 6-1·6-2 문구를 줄이지 않고 대표 소개 패널에 표시 | SMK-01 |
| REQ-FUNC-059 | 방문 국가 30개 이상 목록 | IMPLEMENT | 지도 대신 권역별 국가 목록. 소개된 국가는 해당 여행지·안전 패널로 연결 | UT-08 |
| REQ-FUNC-060 | 대표 여행 타임라인 | IMPLEMENT | 연도·장소·요약 항목 목록 | UT-08, SMK-01 |
| REQ-FUNC-061 | 대표 이미지 메타데이터·플레이스홀더 | EXCLUDED | 미디어 라이선스 워크플로 제외. `alt` 필수와 로드 실패 플레이스홀더는 공통 이미지 컴포넌트로 처리(REQ-FUNC-079) | — |
| REQ-FUNC-062 | 문의·SNS 링크 | IMPLEMENT | 관리자 설정 대신 `src/data/curator.ts` 값 사용. 빈 값은 렌더링하지 않고 `https:`·`mailto:`만 허용 | UT-08 |
| REQ-FUNC-063 | 추천 여행지 6개 | IMPLEMENT | 대표 소개에서 6개 여행지 상세 패널로 연결, 존재하지 않는 slug는 테스트 실패 | UT-08, SMK-01 |
| REQ-FUNC-064 | 전역 내비게이션·푸터 | IMPLEMENT | `layout.tsx`에 SCR-001~005 메뉴와 정책 대화상자를 여는 푸터 | SMK-08 |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | IMPLEMENT | Mobile First Tailwind 레이아웃 | SMK-08 |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | IMPLEMENT | SCR-004에서 Supabase Auth 사용. 이메일 미인증 계정은 로그인·쓰기 불가 | SMK-04, MAN-01 |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | IMPLEMENT | SCR-001 검색 결과에 "여행지"/"안전정보" 유형 라벨과 일치 문자열 강조 | UT-01, SMK-01 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | IMPLEMENT | `localStorage`에 저장, 중복 방지, SCR-001에서 즐겨찾기만 보기 | UT-09 |
| REQ-FUNC-069 | URL 공유 | IMPLEMENT | 여행지·안전·동행 패널에 공유 버튼. Web Share API 실패 시 URL 복사 후 Toast | SMK-01 |
| REQ-FUNC-070 | 페이지별 SEO 메타 | IMPLEMENT | Metadata API로 5개 Route의 title·description·canonical·Open Graph, `?dest`는 `generateMetadata`로 여행지별 값. `/`에 WebSite JSON-LD | SMK-08 |
| REQ-FUNC-071 | 행동 분석 이벤트 | EXCLUDED | 분석 이벤트를 수집하지 않는다. 수집 도구가 없으므로 입력값이 분석으로 새는 경로도 없다 | — |
| REQ-FUNC-072 | 여행지 콘텐츠 CRUD·미리보기 | EXCLUDED | 전체 콘텐츠 CMS 제외. 로컬 `npm run dev`와 Vercel Preview 배포가 미리보기 역할 | — |
| REQ-FUNC-073 | 미디어 업로드 메타데이터 | EXCLUDED | 미디어 업로드·라이선스 승인 워크플로 제외 | — |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | IMPLEMENT | 정적 데이터 완전성 단위 테스트가 실패하면 배포하지 않는다. 누락 필드 목록을 실패 메시지로 출력 | UT-08 |
| REQ-FUNC-075 | 안전정보 stale 대시보드 | EXCLUDED | 관리자 탭은 신고와 외부 URL만 다룬다. stale 상태는 공개 안전 패널에 표시(REQ-FUNC-050) | — |
| REQ-FUNC-076 | 관리자 감사 로그 | EXCLUDED | 범용 감사 로그 제외. 신고 처리자·처리 시각만 `reports`에 기록 | — |
| REQ-FUNC-077 | 외부 URL 관리자 설정 | IMPLEMENT | SCR-005 관리자 탭에서 HTTPS·허용 호스트만 저장. DB CHECK와 UI 검증 | UT-04, SMK-07 |
| REQ-FUNC-078 | 오류 화면 복구 행동 | IMPLEMENT | `not-found.tsx`(홈), `error.tsx`(다시 시도·홈), 권한 없음(홈·로그인), 외부 연결 실패(재시도) | SMK-07, SMK-08 |
| REQ-FUNC-079 | HTML 의미·ARIA 상태 | IMPLEMENT | 폼 라벨·오류 `aria-describedby`, 탭 `role="tablist"`, 패널·대화상자 포커스 이동과 Esc 닫기, Toast `aria-live`, 이미지 `alt` 필수 | SMK-08, MAN-02 |
| REQ-FUNC-080 | 정책 문서·안전수칙 동의 기록 | IMPLEMENT | 푸터 정책 대화상자 4종. 글 작성 시 `safety_agreed_at`, `policy_version` 저장 | SMK-04 |

---

## 10. 비기능 요구사항 상태표 (REQ-NF-001~034)

| ID | 요구사항 요지 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-001 | LCP ≤2.5s | IMPLEMENT | 정적 데이터 렌더링, 첫 이미지 `priority`. 실제 사용자 p75 대신 배포 URL의 모바일 Lighthouse 측정값으로 판단 | MAN-03 |
| REQ-NF-002 | INP p75 ≤200ms | EXCLUDED | 실제 사용자 필드 데이터 수집 도구를 두지 않는다(행동 분석 제외) | — |
| REQ-NF-003 | CLS ≤0.1 | IMPLEMENT | 이미지 `width`·`height` 지정, 패널은 오버레이로 열어 본문 이동 방지. Lighthouse 측정값으로 판단 | MAN-03 |
| REQ-NF-004 | 필터 p95 ≤1s, 동시 50명 | EXCLUDED | 부하 테스트 제외. 여행지 필터는 클라이언트 메모리에서 처리 | — |
| REQ-NF-005 | 쓰기 p95 ≤3s | EXCLUDED | 부하 테스트 제외. 신고 접수 3초 이내 표시는 REQ-FUNC-039에서 단일 요청으로 확인 | — |
| REQ-NF-006 | 이미지 최적화 | IMPLEMENT | `next/image`, `sizes` 지정, 기본 lazy load, 첫 화면 이미지 `priority` | MAN-03 |
| REQ-NF-007 | Lighthouse Performance ≥85 | IMPLEMENT | CI 대신 배포 전 수동 측정 | MAN-03 |
| REQ-NF-008 | 월간 가용성 ≥99.5% | EXCLUDED | 장애 알림·모니터링 제외. Vercel·Supabase 기본 가용성에 의존 | — |
| REQ-NF-009 | 내부 API 5xx ≤0.5% | EXCLUDED | 자체 API가 없고 모니터링을 두지 않는다 | — |
| REQ-NF-010 | DB 백업 RPO/RTO | EXCLUDED | 자동 백업 제외. Supabase 플랜 기본 백업에 의존 | — |
| REQ-NF-011 | 주간 링크 자동 검사·알림 | EXCLUDED | 장애 알림 제외. 외부 링크 형식은 SMK-02·SMK-01에서 배포 전 확인 | — |
| REQ-NF-012 | TLS 1.2 이상 | IMPLEMENT | Vercel 기본 HTTPS, Supabase HTTPS 엔드포인트만 사용 | 배포 URL `curl -I http://…`이 HTTPS로 리다이렉트 |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | IMPLEMENT | 모든 테이블 RLS 활성화, `role`은 DB에서만 판단 | SMK-05, SMK-07, MAN-04 |
| REQ-NF-014 | CSRF·SameSite | IMPLEMENT | 자체 상태 변경 엔드포인트 없음. Supabase 요청은 Authorization 헤더, `@supabase/ssr` 세션 쿠키는 SameSite=Lax | SMK-04에서 세션 쿠키 속성 확인 |
| REQ-NF-015 | 입력 검증·XSS 차단 | IMPLEMENT | React 기본 이스케이프, 사용자 입력에 `dangerouslySetInnerHTML` 금지, 길이 제한 DB CHECK | SMK-04 |
| REQ-NF-016 | 비밀키 환경변수 관리 | IMPLEMENT | 클라이언트에는 `NEXT_PUBLIC_*` 공개 값만 사용, Service Role Key 미사용, `.env*` Git 제외 | `npm run build` 후 `.next/static`에 비밀값 문자열 없음 확인 |
| REQ-NF-017 | 항공·숙소 원시 입력 미보존 | IMPLEMENT | REQ-FUNC-017·025와 같은 방식 | SMK-02 |
| REQ-NF-018 | 개인정보 내보내기·탈퇴·삭제 | EXCLUDED | Service Role 권한과 삭제 배치가 필요하다. 요청 시 수동 처리(REQ-FUNC-045) | — |
| REQ-NF-019 | 신고 접수 p95 ≤3s | EXCLUDED | 부하 테스트 제외. 단일 요청 3초 이내 표시는 REQ-FUNC-039에서 확인 | — |
| REQ-NF-020 | 신고 1차 검토 24h 90% | EXCLUDED | 운영 인력의 처리 시간 목표로 소프트웨어 구현 대상이 아니다. 관리자 탭은 접수 시각을 표시 | — |
| REQ-NF-021 | 쓰기 속도 제한 429 | EXCLUDED | 서버 측 속도 제한 인프라를 두지 않는다. Supabase Auth 기본 제한만 적용 | — |
| REQ-NF-022 | Moderator 조치 추적 | EXCLUDED | 범용 감사 로그 제외. 신고 처리자·시각만 `reports`에 기록 | — |
| REQ-NF-023 | WCAG 2.2 AA 목표 | IMPLEMENT | REQ-FUNC-079 규칙, 상태·경보는 텍스트 라벨 병기, 터치 대상 24×24px 이상 | SMK-08, MAN-02 |
| REQ-NF-024 | axe serious/critical 0건 | IMPLEMENT | `@axe-core/playwright`로 5개 Route와 열린 패널 검사 | SMK-08 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | IMPLEMENT | SCR-001~005 핵심 흐름 수동 검사 | MAN-02 |
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | IMPLEMENT | REQ-FUNC-074 완전성 테스트 | UT-08 |
| REQ-NF-027 | 해외 국가 안전정보 커버리지 100% | IMPLEMENT | REQ-FUNC-046 데이터 검사 | UT-08 |
| REQ-NF-028 | 안전정보 7일 이내 95%, 초과 시 경고 100% | IMPLEMENT | 초과 시 경고는 렌더링 계산으로 100% 표시. 7일 이내 95%는 `src/data/safety.ts`의 `verifiedAt`을 주기적으로 갱신해 재배포하는 운영 작업으로 유지 | UT-07, SMK-01 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | EXCLUDED | 미디어 라이선스 워크플로 제외. 이미지는 URL과 `alt`만 사용 | — |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | IMPLEMENT | REQ-FUNC-070 방식 | SMK-08 |
| REQ-NF-031 | TypeScript strict·lint·unit test | IMPLEMENT | `strict: true` 유지, `lint`·`typecheck`·`test:unit` 통과 후 사용자가 직접 Merge. 자동 Merge Runner 없음 | §8.4 배포 전 검사 |
| REQ-NF-032 | 구조화 로그 | EXCLUDED | 자체 서버 엔드포인트가 없어 기록할 서버 요청이 없다. Vercel 기본 로그만 사용 | — |
| REQ-NF-033 | 핵심 오류 알림 | EXCLUDED | 장애 알림 제외 | — |
| REQ-NF-034 | 월 인프라 비용 ≤100,000원 | IMPLEMENT | Vercel·Supabase 무료 또는 최저 요금제, 유료 부가 기능 미사용 | 배포 시 두 서비스 요금제·청구 화면 확인 |

---

## 11. 집계

| 구분 | IMPLEMENT | EXCLUDED | 합계 |
|---|---:|---:|---:|
| 기능 (REQ-FUNC) | 69 | 11 | 80 |
| 비기능 (REQ-NF) | 19 | 15 | 34 |
| 합계 | 88 | 26 | 114 |
