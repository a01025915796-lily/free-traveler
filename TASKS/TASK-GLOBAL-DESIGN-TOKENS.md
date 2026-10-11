# TASK-GLOBAL-DESIGN-TOKENS D-001 디자인 토큰 적용

## Task Row

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 3 | GLOBAL-DESIGN-TOKENS | D-001 디자인 토큰 적용 | Global | IMPLEMENT | REQ-NF-023 | 공통 | - | - | SETUP-PROJECT | `src/app/globals.css` | 1) `design-reference/D-001/DESIGN.md` §2~§4 값을 Tailwind CSS 4 `@theme` 변수로 정의(색·semantic·radius·shadow·간격)<br>2) Create Next App 기본 다크 모드·Geist 변수 제거<br>3) `:focus-visible` 2px ink 외곽선 전역 규칙 | 1) body 배경 `#FFFFFF`, 텍스트 `#222222`<br>2) 코랄 `#CF4329`는 primary 토큰으로만 노출<br>3) semantic 5종(danger·warning·info·success·neutral) 텍스트·배경·테두리 토큰 | 해당 없음 | `npm run build` 후 개발 서버에서 토큰 클래스 렌더 확인 | P0 |

## 1. Context

5개 화면 공통의 "D-001 디자인 토큰 적용" 작업이다. 이 Task는 Global 단계로, 요구사항 1건(REQ-NF-023)을 다룬다.

현재 저장소에는 `src/app/globals.css`가 있다(Create Next App 초기 상태). 이 Task에서 수정한다. 선행 Task: SETUP-PROJECT. 이 Task가 끝나야 GLOBAL-UI-KIT, GLOBAL-LAYOUT를 진행할 수 있다.

## 2. Project Scope

**범위**

- Expected Files 1개 안에서 "D-001 디자인 토큰 적용"을 구현한다
- §8~§10 AC를 모두 충족한다

**범위 밖**

- Expected Files 밖의 파일 변경
- 다른 Task의 Expected Files에 속한 기능 구현
- EXCLUDED 요구사항 26건 (`TASKS/00_TASK_LIST.md` §4)

## 3. Requirement Ref

| ID | 요구사항 요지 | 06 구현 기준 (개정) |
|---|---|---|
| REQ-NF-023 | WCAG 2.2 AA 목표 | REQ-FUNC-079 규칙, 상태·경보는 텍스트 라벨 병기, 터치 대상 24×24px 이상 |

## 4. Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | 5개 화면 공통 |
| Route | - |
| Page Entry | - |

## 5. Design Ref

- `design-reference/D-001/DESIGN.md` §2~§7 (토큰 값의 정본)
- `design-reference/UI_CONTRACT.md` §1.3 공통 Layout · §1.4 Desktop·Mobile · §1.5 디자인·접근성
- `docs/04_UIUX_PLAN.md` §4 공통 컴포넌트

## 6. Depends On

- SETUP-PROJECT — 패키지·스크립트·설정 초기화 (Seq 1)

## 7. Expected Files

**수정** (현재 저장소에 있음)

- `src/app/globals.css`

이 목록 밖의 파일은 수정하지 않는다.

## 8. Functional AC

- `design-reference/D-001/DESIGN.md` §2~§4 값을 Tailwind CSS 4 `@theme` 변수로 정의(색·semantic·radius·shadow·간격)
- Create Next App 기본 다크 모드·Geist 변수 제거
- `:focus-visible` 2px ink 외곽선 전역 규칙

## 9. Visual AC

- body 배경 `#FFFFFF`, 텍스트 `#222222`
- 코랄 `#CF4329`는 primary 토큰으로만 노출
- semantic 5종(danger·warning·info·success·neutral) 텍스트·배경·테두리 토큰

## 10. Security/Privacy AC

- 개인정보·비밀값을 다루지 않는다. 비밀값을 코드·로그에 쓰지 않는다

## 11. Test Cases

| ID | 시나리오 (06 §8) |
|---|---|
| MAN-02 | 키보드만으로 SCR-001~005 핵심 흐름 완료, VoiceOver로 폼 오류·Drawer 제목 읽힘 |
| SMK-08 | 공통 — 5개 Route의 title·description·canonical·Open Graph, 공통 Header·Footer, 320px 가로 스크롤 없음, axe serious/critical 0건, 404·오류 화면의 복구 링크 |

이 Task의 요구사항을 검증하는 테스트·확인 Task: E2E-PUBLIC-SMOKE, MANUAL-CHECK, RELEASE-CHECK

## 12. Verify

- `npm run build` 후 개발 서버에서 토큰 클래스 렌더 확인
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
