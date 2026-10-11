# 테스트 계정 준비 절차

| 항목 | 내용 |
|---|---|
| 대상 | 원격 Supabase **테스트** 프로젝트 (DEC-019). Production 프로젝트에는 만들지 않는다 |
| 사용처 | TEST-RLS-BASIC, E2E-MATE-AUTH, MANUAL-CHECK(MAN-01·04), 로컬·Preview 화면 확인 |
| 작성 Task | DB-SEED-BASE |

이 문서와 저장소에는 실제 이메일·비밀번호·키를 쓰지 않는다. 값은 각자의 `.env.local`(Git 제외)에만 둔다.

## 1. 계정 3개

| 역할 | 환경변수 | 프로필 닉네임 | 성인 확인 | `role` |
|---|---|---|---|---|
| 회원 A | `E2E_USER_A_EMAIL`, `E2E_USER_A_PASSWORD` | `ft_member_a` | 완료 | `member` |
| 회원 B | `E2E_USER_B_EMAIL`, `E2E_USER_B_PASSWORD` | `ft_member_b` | 완료 | `member` |
| 관리자 | `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` | `ft_admin` | 완료 | `admin` |

이메일은 실제로 받을 수 있는 주소를 쓴다(가입 인증 메일 확인 필요). 같은 메일함을 쓰려면 `+` 별칭(예: `name+ft-a@…`)을 쓸 수 있다.

## 2. 절차

1. **가입과 이메일 인증** — 앱의 `/account?tab=signup`(SCR-005, W10 이후) 또는 Supabase 대시보드 Authentication › Users › "Add user"로 3개 계정을 만들고 이메일 인증을 마친다. 대시보드에서 만들면 "Auto Confirm User"를 켠다.
2. **프로필과 성인 확인** — 각 계정으로 로그인해 `/account?tab=profile`에서 위 닉네임으로 프로필을 저장하고 "저는 만 19세 이상입니다"를 확인한다. 화면이 아직 없으면 대시보드 SQL 편집기에서 아래 SQL을 실행한다. 이 SQL은 SQL 편집기(관리자 권한)에서만 동작하며 앱에서는 실행되지 않는다.

   ```sql
   -- 이메일은 실제 값으로 바꿔서 실행하고, 이 파일에는 저장하지 않는다.
   insert into public.profiles (user_id, nickname, age_band, travel_styles, is_adult)
   select id, 'ft_member_a', '30s', array['도시 산책'], true from auth.users where email = '<회원 A 이메일>'
   on conflict (user_id) do nothing;
   insert into public.profiles (user_id, nickname, age_band, travel_styles, is_adult)
   select id, 'ft_member_b', '20s', array['자연'], true from auth.users where email = '<회원 B 이메일>'
   on conflict (user_id) do nothing;
   insert into public.profiles (user_id, nickname, age_band, travel_styles, is_adult)
   select id, 'ft_admin', '40s', array['역사'], true from auth.users where email = '<관리자 이메일>'
   on conflict (user_id) do nothing;
   ```

3. **관리자 역할 지정** — `role`은 앱에서 바꿀 수 없고 SQL로만 지정한다(RLS 원칙 7). 대시보드 SQL 편집기에서 실행한다. 프로필 트리거가 사용자 변경을 막으므로 트리거를 잠시 끄고 바꾼다.

   ```sql
   alter table public.profiles disable trigger profiles_guard;
   update public.profiles set role = 'admin' where nickname = 'ft_admin';
   alter table public.profiles enable trigger profiles_guard;
   ```

4. **예시 모집글 시드** — 프로필이 생긴 뒤 시드를 다시 실행하면 `[예시]` 모집글 2건이 회원 A·B 소유로 들어간다.

   ```
   supabase db query --linked -f supabase/seed.sql
   ```

5. **환경변수** — 각 계정의 이메일·비밀번호를 `.env.local`의 `E2E_*` 6개 변수에 넣는다(`.env.example` 참고).

## 3. 확인

| 확인 | 기대 결과 |
|---|---|
| `select nickname, role, is_adult from public.profiles where nickname like 'ft_%';` (SQL 편집기) | 3행, `ft_admin`만 `admin`, 모두 `is_adult = true` |
| `select key, value from public.app_settings;` | 2행(항공·숙소 기본 URL) |
| `select count(*) from public.mate_posts where title like '[예시]%';` | 프로필 생성 후 시드 재실행 시 2 |

## 4. 정리

E2E 테스트가 만든 글·요청·신고는 테스트 끝에 같은 계정으로 삭제한다(PROJECT_SCOPE §8). 테스트 계정 자체는 지우지 않는다.
