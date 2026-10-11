-- Free Traveler base schema: exactly 6 tables (DEC: profiles, mate_posts, mate_applications,
-- user_blocks, reports, app_settings). Destinations, safety notes and curator content are static
-- data in src/data and are NOT stored here. No email, birth date, flight/hotel input, audit log or
-- media tables. Row Level Security policies live in 0002_rls.sql.
--
-- Value lists below are not fixed by the planning docs; they are defined here and mirrored by
-- the app (src/lib/db/*). Change both together.
--   age_band:      20s, 30s, 40s, 50s, 60plus
--   gender:        female, male, other (optional, null = not disclosed)
--   travel_styles: free-form short tags chosen in the UI (max 8, each <= 20 chars)
--   reason_code:   spam, harassment, fraud, contact_info, inappropriate, other

-- updated_at helper -------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.valid_style_tags(tags text[])
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(array_length(tags, 1), 0) <= 8
     and not exists (select 1 from unnest(tags) t where char_length(t) not between 1 and 20);
$$;

-- profiles ----------------------------------------------------------------------------------
-- Public profile per auth user. Only nickname, age band, gender, styles and bio are public.
-- Adult check stores only the boolean and the time it was confirmed (no birth date).
create table public.profiles (
  user_id           uuid primary key references auth.users (id) on delete cascade,
  nickname          text not null unique check (char_length(nickname) between 2 and 20),
  is_adult          boolean not null default false,
  adult_verified_at timestamptz,
  age_band          text not null check (age_band in ('20s', '30s', '40s', '50s', '60plus')),
  gender            text check (gender in ('female', 'male', 'other')),
  travel_styles     text[] not null default '{}' check (public.valid_style_tags(travel_styles)),
  bio               text check (char_length(bio) <= 500),
  role              text not null default 'member' check (role in ('member', 'admin')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint profiles_adult_verified check (is_adult = false or adult_verified_at is not null)
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- mate_posts --------------------------------------------------------------------------------
create table public.mate_posts (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null references public.profiles (user_id) on delete cascade,
  country_code     text not null check (country_code ~ '^[A-Z]{2}$'),
  region_slug      text not null check (region_slug ~ '^[a-z0-9-]{1,40}$'),
  start_date       date not null,
  end_date         date not null,
  capacity         smallint not null check (capacity between 1 and 10),
  preferences      text check (char_length(preferences) <= 300),
  travel_styles    text[] not null default '{}' check (public.valid_style_tags(travel_styles)),
  title            text not null check (char_length(title) between 1 and 100),
  description      text not null check (char_length(description) between 1 and 3000),
  status           text not null default 'OPEN' check (status in ('OPEN', 'CLOSED', 'DELETED')),
  -- Safety rules agreement (REQ-FUNC-080): time of agreement and src/data/policies.ts POLICY_VERSION
  safety_agreed_at timestamptz not null,
  policy_version   text not null check (char_length(policy_version) between 1 and 20),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint mate_posts_date_order check (end_date >= start_date)
);

-- Recruiting is closed at read time when end_date has passed (Asia/Seoul); no cron job.
create index mate_posts_list_idx on public.mate_posts (status, end_date, created_at desc);
create index mate_posts_country_idx on public.mate_posts (country_code, region_slug);
create index mate_posts_owner_idx on public.mate_posts (owner_id);

create trigger mate_posts_set_updated_at
  before update on public.mate_posts
  for each row execute function public.set_updated_at();

-- mate_applications ---------------------------------------------------------------------------
-- No WITHDRAWN status (request cancellation is excluded).
create table public.mate_applications (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid not null references public.mate_posts (id) on delete cascade,
  applicant_id uuid not null references public.profiles (user_id) on delete cascade,
  message      text not null check (char_length(message) between 1 and 500),
  status       text not null default 'PENDING' check (status in ('PENDING', 'ACCEPTED', 'REJECTED')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Duplicate request block (REQ-FUNC-035): one active request per post and applicant.
create unique index mate_applications_active_unique
  on public.mate_applications (post_id, applicant_id)
  where status in ('PENDING', 'ACCEPTED');
create index mate_applications_applicant_idx on public.mate_applications (applicant_id, created_at desc);

create trigger mate_applications_set_updated_at
  before update on public.mate_applications
  for each row execute function public.set_updated_at();

-- user_blocks -------------------------------------------------------------------------------
create table public.user_blocks (
  blocker_id uuid not null references public.profiles (user_id) on delete cascade,
  blocked_id uuid not null references public.profiles (user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint user_blocks_not_self check (blocker_id <> blocked_id)
);

create index user_blocks_blocked_idx on public.user_blocks (blocked_id);

-- reports -----------------------------------------------------------------------------------
-- Admin only changes status; handler and time are the only processing record (no audit log).
create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (user_id) on delete cascade,
  target_type text not null check (target_type in ('post', 'user', 'application')),
  target_id   uuid not null,
  reason_code text not null check (reason_code in ('spam', 'harassment', 'fraud', 'contact_info', 'inappropriate', 'other')),
  description text check (char_length(description) <= 1000),
  status      text not null default 'OPEN' check (status in ('OPEN', 'REVIEWING', 'RESOLVED', 'DISMISSED')),
  handled_by  uuid references public.profiles (user_id) on delete set null,
  handled_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index reports_status_idx on public.reports (status, created_at desc);
create index reports_reporter_idx on public.reports (reporter_id, created_at desc);

-- app_settings ------------------------------------------------------------------------------
-- Outbound URLs for the flight/hotel tabs, set by admins. Only https:// values are stored;
-- the allowed-host check is done in the app (src/lib/outbound.ts) and the admin UI.
create table public.app_settings (
  key        text primary key check (key in ('flight_outbound_url', 'hotel_outbound_url')),
  value      text not null check (value like 'https://%' and char_length(value) <= 300 and value !~ '[?#]'),
  updated_by uuid references public.profiles (user_id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();
