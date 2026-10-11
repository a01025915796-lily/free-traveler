# Traveler UI 커버리지 분석 (03_UI_COVERAGE_ANALYSIS)

| 항목 | 내용 |
|---|---|
| 문서 ID | UICOV-TRAVEL-001 |
| 작성일 | 2026-10-07 |
| 기준 문서 | `docs/02_SRS_BASELINE.md` (SRS-TRAVEL-001 v1.0), `docs/PROJECT_SCOPE.md` (SCOPE-TRAVEL-001) |
| 요구사항 수 | 기능 80건 (REQ-FUNC-001~080), 비기능 34건 (REQ-NF-001~034), 합계 114건 |
| 디자인 Screen | 5개 (SCR-001~005) |

---

## 1. 분류 기준

### 1.1 UI 분류

| 분류 | 의미 |
|---|---|
| **UI_DIRECT** | 사용자가 보거나 조작하는 화면 요소(목록, 폼, 버튼, 패널, 링크, 텍스트 블록)가 요구사항의 본체다. |
| **UI_STATE** | 조건에 따라 바뀌는 화면 상태(빈 결과, 오류, 비활성, 경고, 권한 없음, 마감, 이미 요청함 등)가 요구사항의 본체다. |
| **NON_UI** | 데이터·보안·성능·검증 규칙이 본체이며 전용 화면 요소가 없다. 결과가 화면에 드러날 수는 있다. |
| **OPERATIONS** | 배포·모니터링·백업·검사 절차·운영 인력 목표처럼 제품 화면 밖에서 수행된다. |

### 1.2 PROJECT_SCOPE 분류

`docs/PROJECT_SCOPE.md` §9·§10의 값을 그대로 옮긴다.

| 분류 | 이 문서에서의 처리 |
|---|---|
| **IMPLEMENT** | 배치 Screen과 영역을 지정한다. |
| **EXCLUDED** | UI 분류만 기록하고 Screen은 `—`, 영역은 "배치 안 함"으로 둔다. |

### 1.3 Screen 열 표기

| 표기 | 의미 |
|---|---|
| `SCR-00n` | 해당 디자인 Screen에 배치 |
| `전역` | 5개 Screen 모두에 공통 적용 (헤더·푸터·공통 컴포넌트·메타데이터 등) |
| `기술 Route` | §3.2의 기술 Route에서 처리하며 디자인 Screen으로 세지 않음 |
| `—` | 배치하지 않음 (NON_UI·OPERATIONS 또는 EXCLUDED) |

---

## 2. 요구사항 추출 결과

| 구분 | 범위 | 건수 |
|---|---|---:|
| 기능 | REQ-FUNC-001~080 | 80 |
| 비기능 | REQ-NF-001~034 | 34 |
| 합계 | | **114** |

§6 배치표에 114건이 각각 한 행씩 있다. 삭제된 요구사항은 없다.

---

## 3. 화면 구성

### 3.1 디자인 Screen (5개)

| Screen | Route | 이름 | 화면 안의 하위 구성 | 접근 |
|---|---|---|---|---|
| **SCR-001** | `/` | 메인 | 여행지 검색·필터·목록, 여행지 상세 Drawer, 국가 안전정보 Modal, 대표 소개 카드 | Public |
| **SCR-002** | `/about` | 대표 소개 | `free_traveler` 프로필 단일 페이지 | Public |
| **SCR-003** | `/travel-tools` | 통합 여행 준비 | 탭 3개: 항공, 숙소, 동행 작성 | 항공·숙소 Public, 동행 작성 성인 확인 회원 |
| **SCR-004** | `/mates` | 동행 조회 | 동행글 필터·목록, 동행 상세 패널 | 열람 Public, 참가 요청·신고·차단 성인 확인 회원 |
| **SCR-005** | `/account` | 계정·관리 | 탭 4개: 로그인, 프로필, 내 활동, 관리자 | 로그인 탭 Public, 프로필·내 활동 Member, 관리자 Admin |

### 3.2 기술 Route (디자인 Screen 아님)

| Route | 역할 | 사용자에게 보이는 결과 |
|---|---|---|
| `/auth/callback` | Supabase 가입 인증·비밀번호 재설정 메일 링크 처리 | 처리 후 SCR-005로 이동 (인증 완료 → 프로필 탭, 재설정 → 로그인 탭 새 비밀번호 상태) |
| `not-found` | 404 처리 | 공통 오류 레이아웃 + 홈 이동 |
| `error` / `global-error` | 렌더링 오류 처리 | 공통 오류 레이아웃 + 다시 시도·홈 이동 |
| API Route | 없음. 데이터 쓰기는 Supabase 클라이언트가 RLS 아래에서 직접 수행 (PROJECT_SCOPE §5.2) | — |

### 3.3 전역 요소 (모든 Screen 공통)

| 요소 | 내용 | 관련 요구사항 |
|---|---|---|
| 헤더 내비게이션 | 메인, 대표 소개, 여행 준비, 동행, 계정. 현재 위치 표시 | REQ-FUNC-064 |
| 푸터 | 정책 Modal 4종(이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책) 열기 | REQ-FUNC-064, 080 |
| Toast 영역 | 작업 결과·공유 URL 복사·요청 상태 변경 알림 (`aria-live`) | REQ-FUNC-043, 069 |
| 공통 이미지 | `alt` 필수, 로드 실패 시 플레이스홀더 | REQ-FUNC-079, REQ-NF-006 |
| 반응형 레이아웃 | 320px부터 데스크톱까지, Drawer는 모바일에서 전체 화면 시트 | REQ-FUNC-065 |

---

## 4. PROJECT_SCOPE 화면 대응

PROJECT_SCOPE §3은 다른 Route 이름과 배치를 사용한다. 이 문서는 아래 5개 Screen을 기준으로 하며, 요구사항의 IMPLEMENT/EXCLUDED 분류는 바꾸지 않는다.

| PROJECT_SCOPE §3 | 이 문서 | 바뀐 점 |
|---|---|---|
| SCR-001 `/` (대표 소개 섹션·패널 포함) | SCR-001 `/` 메인 | 대표 소개는 카드만 남기고 본문은 SCR-002로 이동 |
| — | SCR-002 `/about` 대표 소개 | 대표 소개를 별도 Screen으로 분리 |
| SCR-002 `/plan` (항공·숙소) | SCR-003 `/travel-tools` | 동행 작성 탭 추가 |
| SCR-003 `/mates` (작성·수정 대화상자 포함) | SCR-004 `/mates` | 작성·수정은 SCR-003 동행 작성 탭으로 이동, 상세는 패널 |
| SCR-004 `/auth` | SCR-005 `/account` 로그인·프로필 탭 | 계정 Screen에 통합 |
| SCR-005 `/my` (보조) | SCR-005 `/account` 내 활동·관리자 탭 | 계정 Screen에 통합 |

---

## 5. Screen별 구성

### 5.1 SCR-001 `/` 메인

**사용자 목표:** 국내·해외 여행지를 찾아 상세 정보와 해당 국가의 안전정보를 확인한다.

| 영역 | 내용 |
|---|---|
| 검색 | 키워드 입력, 결과에 "여행지"/"안전정보" 유형 라벨과 일치 문자열 강조 |
| 국내/해외 탭 | 구분별 게시 여행지만 표시 |
| 필터 바 | 국가·도시·계절·테마·권장 기간, 즐겨찾기만 보기, 필터 초기화 |
| 결과 목록 | 여행지 카드(이미지·이름·국가·테마·즐겨찾기 버튼) |
| 대표 소개 카드 | `free_traveler`, `50+ Trips`, `30+ Countries`, SCR-002 이동 |
| 여행지 상세 Drawer (`?dest=<slug>`) | 소개, 명소 5개 이상, 추천·비추천 시기, 1일·3일 일정, 예산, 교통, 음식 3개 이상, 에티켓, 출처·수정일, 관련 여행지 최대 6개, 안전정보 열기(해외), 여행 준비 이동, 공유 |
| 국가 안전정보 Modal (`?safety=<countryCode>`) | 중대 경보 배너, 경보 단계·범위(국가/지역), 8개 카테고리, 긴급연락처·재외공관, 출처명·URL·최종 확인일·편집자, 외교부 원문 링크, 공식 판단 비대체 고지, 공유 |

| 상태 | 표시 |
|---|---|
| 기본 | 전체 목록 (URL query 필터가 있으면 복원) |
| 결과 없음 | 조건 완화 안내 + 필터 초기화 버튼 |
| 즐겨찾기 없음 | 즐겨찾기 안내 문구 |
| 즐겨찾기 저장 불가 | `localStorage` 사용 불가 시 버튼 동작 없이 안내 Toast |
| 잘못된 `?dest`·`?safety` 값 | Drawer·Modal을 열지 않고 목록 유지 + 안내 Toast |
| 안전정보 stale | "최신 정보 재확인 필요" 경고, 공식 링크 우선 표시, "최신" 배지 숨김 |
| 중대 경보 | 출국권고·여행금지·특별여행주의보를 Modal 최상단에 단계·행동요령·범위 텍스트로 표시 |
| 이미지 로드 실패 | 플레이스홀더 |
| 공유 실패 | Web Share API 실패 시 URL 복사 + Toast |

| 이동 목적지 | 계기 |
|---|---|
| SCR-001 상세 Drawer / 안전 Modal | 카드 선택, 검색 결과 선택, 상세의 안전정보 열기 |
| SCR-002 `/about` | 대표 소개 카드 |
| SCR-003 `/travel-tools?tab=flight` / `?tab=hotel` | 상세 Drawer의 여행 준비 버튼 (입력값은 넘기지 않고 탭만 연다) |
| SCR-004 `/mates` | 상세 Drawer의 동행 찾기 버튼 |
| 외부: 외교부 해외안전여행 | 안전 Modal 원문 링크 (새 탭) |

### 5.2 SCR-002 `/about` 대표 소개

**사용자 목표:** `free_traveler`의 여행 경험과 추천 기준을 확인한다.

| 영역 | 내용 |
|---|---|
| 히어로 | 대표 이미지, 한 문장 소개 |
| 수치 카드 | `50+ Trips`, `30+ Countries` |
| 소개문·철학·편집 원칙 | PRD 6-1·6-2 확정 문구 |
| 방문 국가 목록 | 권역별 30개국 이상, 소개된 국가는 링크 |
| 여행 타임라인 | 연도·장소·요약 |
| 추천 여행지 | 6개 카드 |
| 여행 준비 체크리스트 | PRD 6-3 항목 |
| 문의·SNS | 값이 있는 링크만 표시 |

| 상태 | 표시 |
|---|---|
| 기본 | 모든 영역 표시 |
| 이미지 로드 실패 | 플레이스홀더 |
| 여행지가 없는 방문 국가 | 링크 없이 텍스트 |
| 빈 SNS 값 | 해당 링크 미표시 |

| 이동 목적지 | 계기 |
|---|---|
| SCR-001 `/?dest=<slug>` | 추천 여행지 카드 |
| SCR-001 `/?safety=<countryCode>` | 방문 국가 링크 (소개된 해외 국가) |
| 외부: 문의·SNS | 링크 (새 탭, `https:`·`mailto:`만) |

### 5.3 SCR-003 `/travel-tools` 통합 여행 준비

**사용자 목표:** 항공·숙소 조건을 정리해 외부 사이트로 이동하거나, 동행 모집글을 작성·수정한다.

| 영역 | 내용 |
|---|---|
| 탭 바 (`?tab=flight\|hotel\|mate`) | 항공, 숙소, 동행 작성 |
| 항공 탭 | 국가, 지역·도시(국가 종속), 출발일, 귀국일, 비전달 안내, 계속 → 요약(값 + 비전달 안내 + 공식 판단 비대체 고지) → 수정 / 항공편 보러 가기 |
| 숙소 탭 | 국가, 지역·도시(국가 종속), 체크인, 체크아웃, 비전달 안내, 계속 → 요약 → 수정 / 호텔 보러 가기 |
| 동행 작성 탭 (`?tab=mate`, 수정은 `&edit=<postId>`) | 제목, 국가, 지역, 시작일, 종료일, 모집 인원, 선호 조건, 여행 스타일, 상세 설명, 안전수칙 동의, 안전고지, 제출 |

| 상태 | 표시 |
|---|---|
| 항공·숙소 입력 중 | 필수값 누락 시 이동 버튼 비활성 + 필드별 오류 |
| 날짜 오류 | 과거 출발일·체크인, 귀국일 < 출발일, 체크아웃 ≤ 체크인 → 원인 안내, 진행 차단 |
| 요약 | 입력값 그대로 표시, "수정" 시 값 유지 |
| 외부 연결 실패 | URL 없음·허용목록 밖 → 인라인 오류 + 다시 시도, 입력 유지 |
| 동행 작성: 비회원 | 작성 폼 대신 로그인 안내 → SCR-005 로그인 탭 |
| 동행 작성: 성인 확인 미완료 | 성인 확인 안내 → SCR-005 프로필 탭 |
| 동행 작성: 검증 오류 | 필수값 누락, 역전 날짜, 과거 종료일 |
| 동행 작성: 공개 연락처 탐지 | 탐지 위치 안내 + 제출 차단 |
| 동행 수정: 승인자 있음 | 일정 변경 전 화면 내 확인 대화상자 |
| 동행 수정: 권한 없음·없는 글 | 안내 + SCR-004 이동 |
| 제출 중·실패 | 버튼 진행 표시, 실패 시 오류 + 다시 시도 (입력 유지) |

| 이동 목적지 | 계기 |
|---|---|
| 외부: 항공 일반 페이지 | 항공편 보러 가기 (새 탭, query 없음, `noopener,noreferrer`) |
| 외부: 숙소 일반 페이지 | 호텔 보러 가기 (새 탭, query 없음, `noopener,noreferrer`) |
| SCR-004 `/mates?post=<id>` | 동행글 제출·수정 완료 |
| SCR-005 `/account?tab=login&next=…` | 비회원의 동행 작성 탭 진입 |
| SCR-005 `/account?tab=profile` | 성인 확인 미완료 |
| 전역 정책 Modal | 동행 안전수칙 보기 |

### 5.4 SCR-004 `/mates` 동행 조회

**사용자 목표:** 조건이 맞는 동행글을 찾고 참가를 요청하며, 문제가 있으면 신고·차단한다.

| 영역 | 내용 |
|---|---|
| 필터 바 | 국가, 지역, 여행 기간(겹침), 연령대, 성별, 여행 스타일, 모집 상태 |
| 목록 | 동행글 카드(제목, 국가·지역, 기간, 모집 인원, 상태 배지 "모집중"/"마감", 작성자 닉네임) |
| 글쓰기 버튼 | SCR-003 동행 작성 탭 이동 |
| 동행 상세 패널 (`?post=<id>`) | 제목, 조건, 설명, 작성자 공개 프로필(닉네임·연령대·성별·스타일·자기소개), 상태, 참가 요청 폼(500자, 안전고지), 공유, 더보기 메뉴(신고, 차단) |
| 작성자 메뉴 (본인 글) | 수정(SCR-003), 마감, 삭제 |
| 신고 Modal | 대상(글·사용자·요청), 사유 코드, 설명, 제출 → 접수번호·접수 시각 |
| 차단 확인 | 화면 내 확인 대화상자 |

| 상태 | 표시 |
|---|---|
| 기본 | 공개·모집중 글 (차단 관계 글 제외) |
| 불러오는 중 | 목록 스켈레톤 |
| 결과 없음 | 조건 완화 안내 + 필터 초기화 |
| 데이터 오류 | 오류 안내 + 다시 시도 |
| 비회원 | 참가 요청·신고·차단 대신 로그인 안내 |
| 성인 확인 미완료 | 성인 확인 안내 |
| 이미 요청함 | 참가 요청 폼 대신 현재 요청 상태 (대기·승인·거절) |
| 마감 | "마감" 배지, 참가 요청 비활성 (종료일 경과 또는 수동 마감) |
| 없는 글·차단 관계 | 상세 패널에 "볼 수 없는 글" 안내 |
| 신고 완료 | 접수번호·접수 시각 |
| 차단 완료 | 상대 글이 목록에서 사라짐 + Toast |

| 이동 목적지 | 계기 |
|---|---|
| SCR-004 상세 패널 | 카드 선택, 공유 URL |
| SCR-003 `/travel-tools?tab=mate` | 글쓰기, 본인 글 수정 (`&edit=<id>`) |
| SCR-005 `/account?tab=login&next=…` | 비회원의 참가 요청·신고·차단 시도 |
| SCR-005 `/account?tab=activity` | 요청 후 "내 요청 보기" |
| SCR-001 `/?safety=<countryCode>` | 상세 패널의 국가 안전정보 링크 |
| 전역 정책 Modal | 동행 안전수칙 보기 |

### 5.5 SCR-005 `/account` 계정·관리

**사용자 목표:** 로그인하고 성인 확인·프로필을 마친 뒤, 내 글·요청·차단을 관리한다. 관리자는 신고와 외부 URL을 관리한다.

| 탭 (`?tab=`) | 대상 | 영역 |
|---|---|---|
| 로그인 (`login`) | 비회원 | 로그인, 회원가입, 이메일 인증 안내, 비밀번호 재설정 요청, 새 비밀번호 입력(재설정 링크로 진입 시) |
| 프로필 (`profile`) | 회원 | 성인 확인(만 19세 이상 확인 체크, 확인 시각 표시), 닉네임·연령대·여행 스타일(필수), 성별·자기소개(선택), 로그아웃 |
| 내 활동 (`activity`) | 회원 | 내 동행글(상태·수정·마감), 받은 요청(메시지·승인·거절), 보낸 요청(상태 배지), 차단 목록(해제) |
| 관리자 (`admin`) | `role=admin` | 신고 목록(대상·사유·설명·접수 시각·상태), 상태 필터 OPEN/REVIEWING/RESOLVED/DISMISSED, 상태 변경, 항공·숙소 외부 URL 설정 |

| 상태 | 표시 |
|---|---|
| 역할별 탭 | 비회원: 로그인 탭만 / 회원: 프로필·내 활동 / 관리자: 프로필·내 활동·관리자 |
| 이메일 미인증 | 인증 메일 재확인 안내, 동행 쓰기 불가 |
| 인증 오류 | 잘못된 이메일·비밀번호, 만료된 링크 안내 |
| 재설정 메일 발송 | 발송 안내 |
| 닉네임 중복 | 필드 오류 |
| 빈 목록 | 내 글·받은 요청·보낸 요청·차단 목록별 안내 |
| 요청 상태 변경 | 배지 갱신 + Toast |
| 권한 없음 | 비관리자가 `?tab=admin` 접근 시 안내 + 홈·내 활동 이동 |
| 외부 URL 검증 오류 | `http:`·`javascript:`·`data:`·허용목록 밖 주소 저장 거부 |

| 이동 목적지 | 계기 |
|---|---|
| `next` 값의 원래 Screen | 로그인 성공 (`next` 없으면 프로필 탭) |
| SCR-005 프로필 탭 | 가입 인증 완료 (`/auth/callback` 경유) |
| SCR-004 `/mates?post=<id>` | 내 글·받은 요청·보낸 요청 항목 선택 |
| SCR-003 `/travel-tools?tab=mate&edit=<id>` | 내 글 수정 |
| SCR-001 `/` | 로그아웃, 권한 없음 화면의 홈 이동 |

---

## 6. 요구사항 배치표

### 6.1 기능 요구사항 (REQ-FUNC-001~080)

| ID | 요구사항 요지 | UI 분류 | PROJECT_SCOPE | Screen | 배치 영역·상태 |
|---|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 여행지 목록 구분 | UI_DIRECT | IMPLEMENT | SCR-001 | 국내/해외 탭 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | UI_DIRECT | IMPLEMENT | SCR-001 | 필터 바 |
| REQ-FUNC-003 | 키워드 검색 | UI_DIRECT | IMPLEMENT | SCR-001 | 검색 |
| REQ-FUNC-004 | 여행지 상세 필수 항목 | UI_DIRECT | IMPLEMENT | SCR-001 | 여행지 상세 Drawer |
| REQ-FUNC-005 | 결과 없음 안내·초기화 | UI_STATE | IMPLEMENT | SCR-001 | 결과 없음 상태 |
| REQ-FUNC-006 | 해외 상세 → 해당 국가 안전정보 | UI_DIRECT | IMPLEMENT | SCR-001 | 상세 Drawer의 안전정보 열기 → 안전 Modal |
| REQ-FUNC-007 | 대표 이미지 출처·작가·라이선스 | UI_DIRECT | EXCLUDED | — | 배치 안 함 |
| REQ-FUNC-008 | 국내 10곳, 해외 15개국 30개 도시 | NON_UI | IMPLEMENT | — | 정적 데이터 수량 검사 |
| REQ-FUNC-009 | 관련 여행지 최대 6개 | UI_DIRECT | IMPLEMENT | SCR-001 | 상세 Drawer 하단 |
| REQ-FUNC-010 | 필터 상태 URL 반영 | UI_STATE | IMPLEMENT | SCR-001 | 필터 상태 복원 |
| REQ-FUNC-011 | 항공 필수 입력 4개 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 폼 |
| REQ-FUNC-012 | 국가별 지역만 선택 (항공) | UI_STATE | IMPLEMENT | SCR-003 | 항공 탭 지역 선택 (국가 변경 시 초기화) |
| REQ-FUNC-013 | 항공 날짜 검증 | UI_STATE | IMPLEMENT | SCR-003 | 항공 탭 날짜 오류 |
| REQ-FUNC-014 | 항공 입력 요약 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 요약 단계 |
| REQ-FUNC-015 | 항공 비전달 안내 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 폼·요약 안내 문구 |
| REQ-FUNC-016 | 항공 외부 URL 새 탭 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공편 보러 가기 버튼 |
| REQ-FUNC-017 | 항공 입력값 미저장 | NON_UI | IMPLEMENT | — | 컴포넌트 상태만 사용 |
| REQ-FUNC-018 | 항공 URL 오류 처리 | UI_STATE | IMPLEMENT | SCR-003 | 항공 탭 외부 연결 실패 |
| REQ-FUNC-019 | 숙소 필수 입력 4개 | UI_DIRECT | IMPLEMENT | SCR-003 | 숙소 탭 폼 |
| REQ-FUNC-020 | 국가별 지역만 선택 (숙소) | UI_STATE | IMPLEMENT | SCR-003 | 숙소 탭 지역 선택 (국가 변경 시 초기화) |
| REQ-FUNC-021 | 숙소 날짜 검증 | UI_STATE | IMPLEMENT | SCR-003 | 숙소 탭 날짜 오류 |
| REQ-FUNC-022 | 숙소 입력 요약 | UI_DIRECT | IMPLEMENT | SCR-003 | 숙소 탭 요약 단계 |
| REQ-FUNC-023 | 숙소 비전달 안내 | UI_DIRECT | IMPLEMENT | SCR-003 | 숙소 탭 폼·요약 안내 문구 |
| REQ-FUNC-024 | 숙소 외부 URL 새 탭 | UI_DIRECT | IMPLEMENT | SCR-003 | 호텔 보러 가기 버튼 |
| REQ-FUNC-025 | 숙소 입력값 미저장 | NON_UI | IMPLEMENT | — | 컴포넌트 상태만 사용 |
| REQ-FUNC-026 | 숙소 URL 오류 처리 | UI_STATE | IMPLEMENT | SCR-003 | 숙소 탭 외부 연결 실패 |
| REQ-FUNC-027 | 동행 쓰기에 인증 세션 필요 | UI_STATE | IMPLEMENT | SCR-003, SCR-004 | 비회원 상태 → SCR-005 로그인 탭 이동 |
| REQ-FUNC-028 | 만 19세 이상 확인 | UI_DIRECT | IMPLEMENT | SCR-005 | 프로필 탭 성인 확인 |
| REQ-FUNC-029 | 동행 프로필 | UI_DIRECT | IMPLEMENT | SCR-005 | 프로필 탭 입력 폼 |
| REQ-FUNC-030 | 동행글 필터 | UI_DIRECT | IMPLEMENT | SCR-004 | 필터 바 |
| REQ-FUNC-031 | 모집글 입력 항목 | UI_DIRECT | IMPLEMENT | SCR-003 | 동행 작성 탭 폼 |
| REQ-FUNC-032 | 공개 연락처 탐지 | UI_STATE | IMPLEMENT | SCR-003 | 동행 작성 탭 연락처 탐지 오류 |
| REQ-FUNC-033 | 작성자·상태·조건 표시, 연락처 비노출 | UI_DIRECT | IMPLEMENT | SCR-004 | 목록 카드·상세 패널 (작성자는 공개 프로필만) |
| REQ-FUNC-034 | 참가 메시지 500자 비공개 제출 | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 참가 요청 폼 |
| REQ-FUNC-035 | 중복 요청 차단 | UI_STATE | IMPLEMENT | SCR-004 | 이미 요청함 상태 |
| REQ-FUNC-036 | 작성자 승인·거절 | UI_DIRECT | IMPLEMENT | SCR-005 | 내 활동 탭 받은 요청 |
| REQ-FUNC-037 | 종료일 경과 자동 마감 | UI_STATE | IMPLEMENT | SCR-004 | 마감 배지, 모집중 목록 제외 |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | UI_DIRECT | IMPLEMENT | SCR-004, SCR-003, SCR-005 | 상세 패널 작성자 메뉴, 동행 작성 탭 수정 모드, 내 활동 탭 내 글 |
| REQ-FUNC-039 | 글·사용자·요청 신고 | UI_DIRECT | IMPLEMENT | SCR-004 | 신고 Modal, 접수번호·시각 |
| REQ-FUNC-040 | 사용자 차단·해제 | UI_DIRECT | IMPLEMENT | SCR-004, SCR-005 | 상세 패널 차단, 내 활동 탭 차단 목록 |
| REQ-FUNC-041 | 신고 큐 | UI_DIRECT | IMPLEMENT | SCR-005 | 관리자 탭 신고 목록·상태 필터 |
| REQ-FUNC-042 | 운영자 제재 조치 | UI_DIRECT | EXCLUDED | — | 배치 안 함 |
| REQ-FUNC-043 | 요청·처리 결과 알림 | UI_STATE | IMPLEMENT | SCR-005, 전역 | 내 활동 탭 상태 배지, Toast |
| REQ-FUNC-044 | RLS 비공개 데이터 보호 | NON_UI | IMPLEMENT | — | Supabase RLS |
| REQ-FUNC-045 | 탈퇴 비식별화·30일 삭제 | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-FUNC-046 | 해외 국가별 안전정보 존재 | NON_UI | IMPLEMENT | — | 정적 데이터 커버리지 검사 |
| REQ-FUNC-047 | 8개 안전 카테고리 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전 Modal 카테고리 섹션 |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전 Modal 출처 영역 |
| REQ-FUNC-049 | 외교부 원문 새 탭 링크 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전 Modal 원문 링크 |
| REQ-FUNC-050 | 7일 초과 stale 경고 | UI_STATE | IMPLEMENT | SCR-001 | 안전 Modal stale 상태 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | UI_STATE | IMPLEMENT | SCR-001 | 안전 Modal 중대 경보 배너 |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전 Modal 경보 범위 표시 |
| REQ-FUNC-053 | 긴급전화·재외공관 정보 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전 Modal 긴급연락처 |
| REQ-FUNC-054 | 공식 판단 비대체 고지 | UI_DIRECT | IMPLEMENT | SCR-001, SCR-003 | 안전 Modal 고지, 항공 탭 요약 고지 |
| REQ-FUNC-055 | 안전 콘텐츠 작성·검수·게시 | UI_DIRECT | EXCLUDED | — | 배치 안 함 |
| REQ-FUNC-056 | 안전정보 변경 이력 | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-FUNC-057 | `free_traveler`, `50+ Trips`, `30+ Countries` | UI_DIRECT | IMPLEMENT | SCR-002, SCR-001 | 수치 카드, 메인 대표 소개 카드 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 | UI_DIRECT | IMPLEMENT | SCR-002 | 소개문·철학·편집 원칙 영역 |
| REQ-FUNC-059 | 방문 국가 30개 이상 목록 | UI_DIRECT | IMPLEMENT | SCR-002 | 방문 국가 목록 |
| REQ-FUNC-060 | 대표 여행 타임라인 | UI_DIRECT | IMPLEMENT | SCR-002 | 여행 타임라인 |
| REQ-FUNC-061 | 대표 이미지 메타데이터·플레이스홀더 | UI_DIRECT | EXCLUDED | — | 배치 안 함 |
| REQ-FUNC-062 | 문의·SNS 링크 | UI_DIRECT | IMPLEMENT | SCR-002 | 문의·SNS 영역 |
| REQ-FUNC-063 | 추천 여행지 6개 | UI_DIRECT | IMPLEMENT | SCR-002 | 추천 여행지 카드 → SCR-001 상세 Drawer |
| REQ-FUNC-064 | 전역 내비게이션·푸터 | UI_DIRECT | IMPLEMENT | 전역 | 헤더 내비게이션, 푸터 |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | UI_DIRECT | IMPLEMENT | 전역 | 반응형 레이아웃 |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·재설정 | UI_DIRECT | IMPLEMENT | SCR-005, 기술 Route | 로그인 탭, 프로필 탭 로그아웃, `/auth/callback` |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | UI_DIRECT | IMPLEMENT | SCR-001 | 검색 결과 유형 라벨·강조 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | UI_DIRECT | IMPLEMENT | SCR-001 | 카드 즐겨찾기 버튼, 즐겨찾기만 보기 필터 |
| REQ-FUNC-069 | URL 공유 | UI_DIRECT | IMPLEMENT | SCR-001, SCR-004 | 상세 Drawer·안전 Modal·동행 상세 패널 공유 버튼 |
| REQ-FUNC-070 | 페이지별 SEO 메타 | NON_UI | IMPLEMENT | 전역 | 5개 Route 메타데이터 |
| REQ-FUNC-071 | 행동 분석 이벤트 | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-FUNC-072 | 여행지 콘텐츠 CRUD·미리보기 | UI_DIRECT | EXCLUDED | — | 배치 안 함 |
| REQ-FUNC-073 | 미디어 업로드 메타데이터 | UI_DIRECT | EXCLUDED | — | 배치 안 함 |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | NON_UI | IMPLEMENT | — | 정적 데이터 완전성 테스트 |
| REQ-FUNC-075 | 안전정보 stale 대시보드 | UI_DIRECT | EXCLUDED | — | 배치 안 함 |
| REQ-FUNC-076 | 관리자 감사 로그 | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-FUNC-077 | 외부 URL 관리자 설정 | UI_DIRECT | IMPLEMENT | SCR-005 | 관리자 탭 외부 URL 설정 |
| REQ-FUNC-078 | 오류 화면 복구 행동 | UI_STATE | IMPLEMENT | 기술 Route, SCR-003, SCR-005 | `not-found`·`error` 레이아웃, 외부 연결 실패, 권한 없음 |
| REQ-FUNC-079 | HTML 의미·ARIA 상태 | UI_DIRECT | IMPLEMENT | 전역 | 폼·탭·Drawer·Modal·Toast 공통 컴포넌트 |
| REQ-FUNC-080 | 정책 문서·안전수칙 동의 기록 | UI_DIRECT | IMPLEMENT | 전역, SCR-003 | 푸터 정책 Modal, 동행 작성 탭 동의 체크 |

### 6.2 비기능 요구사항 (REQ-NF-001~034)

| ID | 요구사항 요지 | UI 분류 | PROJECT_SCOPE | Screen | 배치 영역·상태 |
|---|---|---|---|---|---|
| REQ-NF-001 | LCP ≤2.5s | NON_UI | IMPLEMENT | 전역 | 첫 화면 이미지 우선 로드 |
| REQ-NF-002 | INP p75 ≤200ms | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-NF-003 | CLS ≤0.1 | NON_UI | IMPLEMENT | 전역 | 이미지 크기 고정, Drawer·Modal은 오버레이 |
| REQ-NF-004 | 필터 p95 ≤1s, 동시 50명 | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-NF-005 | 쓰기 p95 ≤3s | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-NF-006 | 이미지 최적화 | NON_UI | IMPLEMENT | 전역 | 공통 이미지 |
| REQ-NF-007 | Lighthouse Performance ≥85 | OPERATIONS | IMPLEMENT | — | 배포 전 수동 측정 |
| REQ-NF-008 | 월간 가용성 ≥99.5% | OPERATIONS | EXCLUDED | — | 배치 안 함 |
| REQ-NF-009 | 내부 API 5xx ≤0.5% | OPERATIONS | EXCLUDED | — | 배치 안 함 |
| REQ-NF-010 | DB 백업 RPO/RTO | OPERATIONS | EXCLUDED | — | 배치 안 함 |
| REQ-NF-011 | 주간 링크 자동 검사·알림 | OPERATIONS | EXCLUDED | — | 배치 안 함 |
| REQ-NF-012 | TLS 1.2 이상 | NON_UI | IMPLEMENT | — | Vercel HTTPS |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | NON_UI | IMPLEMENT | — | Supabase RLS |
| REQ-NF-014 | CSRF·SameSite | NON_UI | IMPLEMENT | — | 세션 쿠키 설정 |
| REQ-NF-015 | 입력 검증·XSS 차단 | NON_UI | IMPLEMENT | — | 사용자 입력 텍스트 렌더링 규칙 |
| REQ-NF-016 | 비밀키 환경변수 관리 | NON_UI | IMPLEMENT | — | 환경변수 |
| REQ-NF-017 | 항공·숙소 원시 입력 미보존 | NON_UI | IMPLEMENT | — | 컴포넌트 상태만 사용 |
| REQ-NF-018 | 개인정보 내보내기·탈퇴·삭제 | UI_DIRECT | EXCLUDED | — | 배치 안 함 |
| REQ-NF-019 | 신고 접수 p95 ≤3s | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-NF-020 | 신고 1차 검토 24h 90% | OPERATIONS | EXCLUDED | — | 배치 안 함 |
| REQ-NF-021 | 쓰기 속도 제한 429 | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-NF-022 | Moderator 조치 추적 | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-NF-023 | WCAG 2.2 AA 목표 | UI_DIRECT | IMPLEMENT | 전역 | 텍스트 라벨 병기, 터치 대상 24×24px, 포커스 표시 |
| REQ-NF-024 | axe serious/critical 0건 | OPERATIONS | IMPLEMENT | — | 자동 접근성 검사 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | OPERATIONS | IMPLEMENT | — | 수동 검사 절차 |
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | NON_UI | IMPLEMENT | — | 정적 데이터 완전성 테스트 |
| REQ-NF-027 | 해외 국가 안전정보 커버리지 100% | NON_UI | IMPLEMENT | — | 정적 데이터 커버리지 검사 |
| REQ-NF-028 | 안전정보 7일 이내 95%, 초과 시 경고 100% | UI_STATE | IMPLEMENT | SCR-001 | 안전 Modal stale 상태 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | NON_UI | IMPLEMENT | 전역 | 5개 Route 메타데이터 |
| REQ-NF-031 | TypeScript strict·lint·unit test | OPERATIONS | IMPLEMENT | — | 배포 전 검사 |
| REQ-NF-032 | 구조화 로그 | NON_UI | EXCLUDED | — | 배치 안 함 |
| REQ-NF-033 | 핵심 오류 알림 | OPERATIONS | EXCLUDED | — | 배치 안 함 |
| REQ-NF-034 | 월 인프라 비용 ≤100,000원 | OPERATIONS | IMPLEMENT | — | 요금제 확인 |

---

## 7. 집계

### 7.1 UI 분류 × PROJECT_SCOPE

| UI 분류 | IMPLEMENT | EXCLUDED | 합계 |
|---|---:|---:|---:|
| UI_DIRECT | 47 | 8 | 55 |
| UI_STATE | 17 | 0 | 17 |
| NON_UI | 19 | 12 | 31 |
| OPERATIONS | 5 | 6 | 11 |
| **합계** | **88** | **26** | **114** |

### 7.2 Screen별 배치 수 (IMPLEMENT, 여러 Screen 배치는 각 Screen에 중복 집계)

| Screen | 배치 요구사항 수 |
|---|---:|
| SCR-001 | 21 |
| SCR-002 | 6 |
| SCR-003 | 21 |
| SCR-004 | 10 |
| SCR-005 | 10 |
| 전역 | 11 |
| 기술 Route | 2 |
| 배치 없음 (`—`, NON_UI·OPERATIONS) | 19 |
| EXCLUDED (배치 안 함, 집계 제외) | 26 |

### 7.3 총수 확인

| 확인 항목 | 결과 |
|---|---|
| REQ-FUNC 행 수 | 80 / 80 |
| REQ-NF 행 수 | 34 / 34 |
| 전체 행 수 | 114 / 114 |
| 누락·중복 ID | 없음 |
| PROJECT_SCOPE 분류 불일치 | 없음 |
| IMPLEMENT인데 Screen·영역이 비어 있음 | 0건 |
| EXCLUDED인데 Screen에 배치됨 | 0건 |
| 디자인 Screen 수 | 5 |
