-- Row Level Security for the 6 tables. RLS is the source of truth for permissions; hiding UI
-- is only secondary. No Service Role Key is used by the app, so every read/write below runs as
-- `anon` or `authenticated` with the user's session.
--
-- Layers:
--   1. RLS policies decide which rows a role can see or change.
--   2. Column privileges decide which columns are readable/writable (e.g. profiles public
--      columns only, `role` never writable by users).
--   3. Triggers fill server-side values (adult_verified_at, handled_by/handled_at, updated_by).
-- Helper functions live in schema `private`, which is not exposed through the Data API.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- Helpers -----------------------------------------------------------------------------------
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function private.is_adult()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where user_id = (select auth.uid()) and is_adult
  );
$$;

-- True when either user blocked the other. With no session (a is null) nothing is blocked.
create or replace function private.is_blocked(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select a is not null and b is not null and exists (
    select 1 from public.user_blocks
    where (blocker_id = a and blocked_id = b) or (blocker_id = b and blocked_id = a)
  );
$$;

create or replace function private.is_post_owner(p_post_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.mate_posts where id = p_post_id and owner_id = (select auth.uid())
  );
$$;

-- Applications are allowed only on visible, open, not-ended posts of someone else who is not blocked.
create or replace function private.can_apply(p_post_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.mate_posts p
    where p.id = p_post_id
      and p.status = 'OPEN'
      and p.end_date >= (now() at time zone 'Asia/Seoul')::date
      and p.owner_id <> (select auth.uid())
      and not private.is_blocked((select auth.uid()), p.owner_id)
  );
$$;

revoke all on function private.is_admin(), private.is_adult(), private.is_blocked(uuid, uuid),
  private.is_post_owner(uuid), private.can_apply(uuid) from public;
grant execute on function private.is_admin(), private.is_adult(), private.is_blocked(uuid, uuid),
  private.is_post_owner(uuid), private.can_apply(uuid) to anon, authenticated;

-- Enable RLS on all 6 tables ------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.mate_posts enable row level security;
alter table public.mate_applications enable row level security;
alter table public.user_blocks enable row level security;
alter table public.reports enable row level security;
alter table public.app_settings enable row level security;

-- Reset default table privileges, then grant only what is needed.
revoke all on public.profiles, public.mate_posts, public.mate_applications,
  public.user_blocks, public.reports, public.app_settings from anon, authenticated;

-- profiles ----------------------------------------------------------------------------------
-- Public columns only (no is_adult, adult_verified_at, role). Email lives in auth.users and is
-- never exposed. The owner reads private fields through public.get_my_profile().
grant select (user_id, nickname, age_band, gender, travel_styles, bio, created_at)
  on public.profiles to anon, authenticated;
grant insert (user_id, nickname, age_band, gender, travel_styles, bio, is_adult)
  on public.profiles to authenticated;
grant update (nickname, age_band, gender, travel_styles, bio, is_adult)
  on public.profiles to authenticated;

create policy profiles_select_visible on public.profiles
  for select to anon, authenticated
  using (not private.is_blocked((select auth.uid()), user_id));

create policy profiles_insert_own on public.profiles
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Adult check: only false -> true, time set by the server. Role stays as stored (SQL only).
create or replace function private.profiles_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.role := 'member';
    new.adult_verified_at := case when new.is_adult then now() else null end;
  else
    new.role := old.role;
    if old.is_adult then
      new.is_adult := true;
      new.adult_verified_at := old.adult_verified_at;
    elsif new.is_adult then
      new.adult_verified_at := now();
    else
      new.adult_verified_at := null;
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_guard
  before insert or update on public.profiles
  for each row execute function private.profiles_guard();

-- Own full profile (including is_adult, adult_verified_at, role) for the signed-in user.
create or replace function public.get_my_profile()
returns setof public.profiles
language sql
stable
security definer
set search_path = ''
as $$
  select * from public.profiles where user_id = (select auth.uid());
$$;
revoke all on function public.get_my_profile() from public, anon;
grant execute on function public.get_my_profile() to authenticated;

-- mate_posts --------------------------------------------------------------------------------
grant select on public.mate_posts to anon, authenticated;
grant insert (owner_id, country_code, region_slug, start_date, end_date, capacity, preferences,
  travel_styles, title, description, safety_agreed_at, policy_version)
  on public.mate_posts to authenticated;
grant update (country_code, region_slug, start_date, end_date, capacity, preferences,
  travel_styles, title, description, status)
  on public.mate_posts to authenticated;

create policy mate_posts_select_visible on public.mate_posts
  for select to anon, authenticated
  using (
    owner_id = (select auth.uid())
    or (status <> 'DELETED' and not private.is_blocked((select auth.uid()), owner_id))
  );

create policy mate_posts_insert_adult on public.mate_posts
  for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and private.is_adult()
    and status = 'OPEN'
    and end_date >= (now() at time zone 'Asia/Seoul')::date
  );

create policy mate_posts_update_owner on public.mate_posts
  for update to authenticated
  using (owner_id = (select auth.uid()) and status <> 'DELETED')
  with check (owner_id = (select auth.uid()) and private.is_adult());

-- mate_applications ---------------------------------------------------------------------------
-- Readable only by the applicant and the post owner. Only the post owner changes the status.
grant select on public.mate_applications to authenticated;
grant insert (post_id, applicant_id, message) on public.mate_applications to authenticated;
grant update (status) on public.mate_applications to authenticated;

create policy mate_applications_select_parties on public.mate_applications
  for select to authenticated
  using (applicant_id = (select auth.uid()) or private.is_post_owner(post_id));

create policy mate_applications_insert_adult on public.mate_applications
  for insert to authenticated
  with check (
    applicant_id = (select auth.uid())
    and status = 'PENDING'
    and private.is_adult()
    and private.can_apply(post_id)
  );

create policy mate_applications_update_owner on public.mate_applications
  for update to authenticated
  using (private.is_post_owner(post_id))
  with check (private.is_post_owner(post_id) and status in ('ACCEPTED', 'REJECTED'));

-- user_blocks -------------------------------------------------------------------------------
grant select, delete on public.user_blocks to authenticated;
grant insert (blocker_id, blocked_id) on public.user_blocks to authenticated;

create policy user_blocks_select_own on public.user_blocks
  for select to authenticated
  using (blocker_id = (select auth.uid()));

create policy user_blocks_insert_own on public.user_blocks
  for insert to authenticated
  with check (blocker_id = (select auth.uid()));

create policy user_blocks_delete_own on public.user_blocks
  for delete to authenticated
  using (blocker_id = (select auth.uid()));

-- reports -----------------------------------------------------------------------------------
grant select on public.reports to authenticated;
grant insert (reporter_id, target_type, target_id, reason_code, description) on public.reports to authenticated;
grant update (status) on public.reports to authenticated;

create policy reports_select_reporter_or_admin on public.reports
  for select to authenticated
  using (reporter_id = (select auth.uid()) or private.is_admin());

create policy reports_insert_own on public.reports
  for insert to authenticated
  with check (reporter_id = (select auth.uid()) and status = 'OPEN');

create policy reports_update_admin on public.reports
  for update to authenticated
  using (private.is_admin())
  with check (private.is_admin());

-- Handler and handling time are set by the server whenever an admin changes the status.
create or replace function private.reports_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    new.handled_by := (select auth.uid());
    new.handled_at := now();
  end if;
  return new;
end;
$$;

create trigger reports_guard
  before update on public.reports
  for each row execute function private.reports_guard();

-- app_settings ------------------------------------------------------------------------------
grant select on public.app_settings to anon, authenticated;
grant insert (key, value), update (value) on public.app_settings to authenticated;

create policy app_settings_select_all on public.app_settings
  for select to anon, authenticated
  using (true);

create policy app_settings_insert_admin on public.app_settings
  for insert to authenticated
  with check (private.is_admin());

create policy app_settings_update_admin on public.app_settings
  for update to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create or replace function private.app_settings_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_by := (select auth.uid());
  return new;
end;
$$;

create trigger app_settings_guard
  before insert or update on public.app_settings
  for each row execute function private.app_settings_guard();
