-- Free Traveler seed data (test project only). Idempotent: safe to run more than once.
-- Apply with `supabase db push --include-seed`, or re-run after creating the test accounts:
--   supabase db query --linked -f supabase/seed.sql
-- Contains no passwords, keys or e-mail addresses (see docs/checks/TEST_ACCOUNTS.md).

-- 1. Default outbound URLs for the flight / hotel tabs (https, no query) -----------------------
insert into public.app_settings (key, value) values
  ('flight_outbound_url', 'https://www.google.com/travel/flights'),
  ('hotel_outbound_url', 'https://www.booking.com/')
on conflict (key) do nothing;

-- 2. Example open mate posts for local / Preview checks ------------------------------------------
-- Inserted only when the test member profiles exist (nicknames ft_member_a / ft_member_b,
-- created by the procedure in docs/checks/TEST_ACCOUNTS.md). Dates are relative to today
-- (Asia/Seoul) so the posts stay open. Skipped silently when the profiles are missing.
do $$
declare
  today date := (now() at time zone 'Asia/Seoul')::date;
  member_a uuid := (select user_id from public.profiles where nickname = 'ft_member_a');
  member_b uuid := (select user_id from public.profiles where nickname = 'ft_member_b');
begin
  if member_a is not null then
    insert into public.mate_posts (owner_id, country_code, region_slug, start_date, end_date, capacity,
      preferences, travel_styles, title, description, status, safety_agreed_at, policy_version)
    select member_a, 'JP', 'kyoto', today + 30, today + 33, 2,
      '아침 일찍 움직이는 분이면 좋겠어요.', array['사찰 산책', '사진'],
      '[예시] 교토 이른 아침 사찰 산책 함께해요',
      '[예시 데이터] 후시미 이나리와 기요미즈데라를 이른 아침에 걷고, 오후는 각자 자유 일정으로 보내려 해요. 숙소와 비용은 각자 부담합니다.',
      'OPEN', now(), '2026-10-11'
    where not exists (select 1 from public.mate_posts where owner_id = member_a and title like '[예시] 교토%');
  end if;

  if member_b is not null then
    insert into public.mate_posts (owner_id, country_code, region_slug, start_date, end_date, capacity,
      preferences, travel_styles, title, description, status, safety_agreed_at, policy_version)
    select member_b, 'KR', 'jeju', today + 20, today + 22, 3,
      '렌터카 운전 가능한 분 환영해요.', array['드라이브', '자연'],
      '[예시] 제주 동쪽 해안 드라이브 동행 구해요',
      '[예시 데이터] 성산일출봉과 우도, 세화 해변을 하루씩 나눠 돌 예정이에요. 렌터카 비용은 n분의 1로 나눠요.',
      'OPEN', now(), '2026-10-11'
    where not exists (select 1 from public.mate_posts where owner_id = member_b and title like '[예시] 제주%');
  end if;
end;
$$;
