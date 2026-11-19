-- Operations · Phase 1 schema
-- Run once in a NEW Supabase project (SQL Editor → paste → Run).
-- Covers: members, roles & permissions, tasks, approvals, activity,
-- outreach (prospects, contact log, research, templates, drafts),
-- auto-created projects, and the daily greeting. Every table has RLS.

create extension if not exists citext;

-- ───────────────────────── Types ─────────────────────────
create type perm_level as enum ('hidden', 'view', 'edit', 'approve');
create type member_status as enum ('invited', 'pending_confirm', 'active', 'on_leave', 'removed');
create type prospect_stage as enum ('prospect', 'researched', 'contacted', 'interested', 'meeting', 'proposal', 'won', 'off_list');
create type off_reason as enum ('not_interested', 'no_reply', 'do_not_contact', 'not_now');
create type contact_channel as enum ('email', 'call', 'visit', 'message');
create type approval_status as enum ('pending', 'approved', 'declined');

-- Areas a permission can cover. Finance tables arrive in Phase 2; the area exists now.
create table public.areas (
  key text primary key,
  name text not null,
  sort int not null
);
insert into public.areas (key, name, sort) values
  ('outreach', 'Outreach', 1),
  ('projects', 'Projects', 2),
  ('social', 'Social & ops', 3),
  ('finance', 'Finance', 4),
  ('team', 'Team & roles', 5);

-- ───────────────────────── Roles ─────────────────────────
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  short_name text not null,
  description text not null default '',
  is_admin boolean not null default false,       -- General Manager: full control
  needs_confirm boolean not null default false,  -- Kirk must confirm before it unlocks
  emails_need_ok boolean not null default false, -- outreach emails need Kirk's OK (interns)
  selectable boolean not null default true,      -- shown on the first-sign-in role picker
  sort int not null default 100,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  area text not null references public.areas(key),
  level perm_level not null default 'hidden',
  primary key (role_id, area)
);

insert into public.roles (key, name, short_name, description, is_admin, needs_confirm, sort) values
  ('gm',  'General Manager & Technical Lead',        'General Manager', 'Runs the company and builds the systems',            true,  true,  1),
  ('ops', 'Business Operations Director',            'Operations',      'Day-to-day operations, trackers and social media',   false, false, 2),
  ('mkt', 'Marketing & Client Acquisition Director', 'Marketing',       'Finds clients and handles outreach',                 false, false, 3),
  ('fin', 'Finance & Corporate Affairs Director',    'Finance',         'Money, quotes, contracts and records',               false, true,  4);

insert into public.role_permissions (role_id, area, level)
select r.id, a.area, a.level::perm_level from public.roles r
join (values
  ('gm','outreach','approve'),('gm','projects','approve'),('gm','social','approve'),('gm','finance','approve'),('gm','team','edit'),
  ('ops','outreach','edit'),('ops','projects','edit'),('ops','social','approve'),('ops','finance','hidden'),('ops','team','hidden'),
  ('mkt','outreach','approve'),('mkt','projects','edit'),('mkt','social','edit'),('mkt','finance','hidden'),('mkt','team','hidden'),
  ('fin','outreach','edit'),('fin','projects','edit'),('fin','social','edit'),('fin','finance','edit'),('fin','team','hidden')
) as a(role_key, area, level) on a.role_key = r.key;

-- ───────────────────────── Members ─────────────────────────
create table public.members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  google_email citext unique not null,
  name text not null,
  role_id uuid references public.roles(id),
  status member_status not null default 'invited',
  leave_from date,
  leave_to date,
  is_owner boolean not null default false, -- Kirk: can never lose admin
  created_at timestamptz not null default now()
);

-- ───────────────────────── Helpers ─────────────────────────
-- The signed-in member, only when allowed in (active or on leave).
create or replace function public.me()
returns public.members
language sql stable security definer set search_path = public as $$
  select m.* from public.members m
  where m.user_id = auth.uid() and m.status in ('active', 'on_leave')
  limit 1
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.members m join public.roles r on r.id = m.role_id
    where m.user_id = auth.uid() and m.status in ('active','on_leave') and r.is_admin
  )
$$;

-- can('outreach','edit') → true if my role's level for that area is at least 'edit'.
create or replace function public.can(p_area text, p_level perm_level)
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((
    select rp.level >= p_level
    from public.members m
    join public.role_permissions rp on rp.role_id = m.role_id and rp.area = p_area
    where m.user_id = auth.uid() and m.status in ('active','on_leave')
  ), false)
$$;

create or replace function public.my_member_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select id from public.members where user_id = auth.uid() limit 1
$$;

-- ───────────────────────── Work tables ─────────────────────────
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  area text not null references public.areas(key),
  owner_id uuid references public.members(id) on delete set null,
  title text not null,
  detail text not null default '',
  due_on date,
  due_time time,
  urgent boolean not null default false,
  done boolean not null default false,
  link text, -- in-app path, e.g. /outreach/<id>
  created_by uuid references public.members(id),
  created_at timestamptz not null default now()
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  area text not null references public.areas(key),
  title text not null,
  detail text not null default '',
  link text,
  requested_by uuid references public.members(id),
  status approval_status not null default 'pending',
  decided_by uuid references public.members(id),
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.activity (
  id bigint generated always as identity primary key,
  area text not null references public.areas(key),
  actor_id uuid references public.members(id),
  record_type text,
  record_id uuid,
  summary text not null,
  created_at timestamptz not null default now()
);

-- ───────────────────────── Outreach ─────────────────────────
create table public.prospects (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  category text not null default '',
  city text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  stage prospect_stage not null default 'prospect',
  off_reason off_reason,
  owner_id uuid references public.members(id) on delete set null,
  next_step text not null default '',
  next_step_due date,
  follow_up_count int not null default 0,
  gmail_thread_url text not null default '',
  contact_checked_on date,
  created_by uuid references public.members(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_log (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  channel contact_channel not null,
  outcome text not null default '',
  note text not null default '',
  happened_at timestamptz not null default now(),
  logged_by uuid references public.members(id)
);

create table public.research_facts (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  fact text not null,
  source_label text not null default '',
  source_url text not null default '',
  checked_on date not null default current_date,
  checked_by uuid references public.members(id)
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null default 'intro', -- intro | follow_up | proposal
  subject text not null default '',
  body text not null default '',
  created_by uuid references public.members(id),
  updated_at timestamptz not null default now()
);

create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  kind text not null default 'intro',
  subject text not null default '',
  body text not null default '',
  sent_at timestamptz,
  updated_by uuid references public.members(id),
  updated_at timestamptz not null default now()
);

-- Projects: Phase 1 only creates them automatically from Won prospects.
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid unique references public.prospects(id) on delete set null,
  name text not null,
  client text not null,
  progress int not null default 0 check (progress between 0 and 100),
  has_maintenance boolean not null default false,
  created_at timestamptz not null default now()
);

-- ───────────────────────── Daily greeting ─────────────────────────
create table public.greeting (
  id int primary key default 1 check (id = 1),
  title text not null default 'Good morning, {name}',
  message text not null default 'Here’s what’s waiting for you today.',
  updated_by uuid references public.members(id),
  updated_at timestamptz not null default now()
);
insert into public.greeting (id) values (1);

create table public.greeting_seen (
  member_id uuid not null references public.members(id) on delete cascade,
  seen_on date not null,
  primary key (member_id, seen_on)
);

-- ───────────────────────── Triggers ─────────────────────────
-- Link a member row to the Google account on first sign-in.
create or replace function public.link_member_on_signup()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.members set user_id = new.id
  where google_email = new.email::citext and user_id is null;
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.link_member_on_signup();

-- Prospect changes: keep updated_at, write history, auto-create project on Won.
create or replace function public.prospect_changed()
returns trigger language plpgsql security definer set search_path = public as $$
declare actor uuid := public.my_member_id();
begin
  new.updated_at := now();
  if tg_op = 'INSERT' then
    insert into public.activity (area, actor_id, record_type, record_id, summary)
    values ('outreach', actor, 'prospect', new.id, 'added ' || new.business_name);
    return new;
  end if;
  if new.stage is distinct from old.stage then
    insert into public.activity (area, actor_id, record_type, record_id, summary)
    values ('outreach', actor, 'prospect', new.id,
            'moved ' || new.business_name || ' to ' || initcap(replace(new.stage::text, '_', ' ')));
    if new.stage = 'won' then
      insert into public.projects (prospect_id, name, client)
      values (new.id, new.business_name || ' project', new.business_name)
      on conflict (prospect_id) do nothing;
    end if;
  end if;
  if new.owner_id is distinct from old.owner_id then
    insert into public.activity (area, actor_id, record_type, record_id, summary)
    values ('outreach', actor, 'prospect', new.id,
            'changed the owner of ' || new.business_name);
  end if;
  return new;
end $$;

create trigger prospect_changed_ins before insert on public.prospects
for each row execute function public.prospect_changed();
create trigger prospect_changed_upd before update on public.prospects
for each row execute function public.prospect_changed();

-- Logging a contact writes history and counts follow-ups.
create or replace function public.contact_logged()
returns trigger language plpgsql security definer set search_path = public as $$
declare biz text;
begin
  update public.prospects
     set follow_up_count = follow_up_count + 1,
         stage = case when stage in ('prospect','researched') then 'contacted'::prospect_stage else stage end
   where id = new.prospect_id
   returning business_name into biz;
  insert into public.activity (area, actor_id, record_type, record_id, summary)
  values ('outreach', new.logged_by, 'prospect', new.prospect_id,
          'logged a ' || new.channel::text || ' with ' || biz ||
          case when new.outcome <> '' then ' · ' || new.outcome else '' end);
  return new;
end $$;

create trigger contact_logged after insert on public.contact_log
for each row execute function public.contact_logged();

-- ───────────────────────── RPCs ─────────────────────────
-- First sign-in: pick a role. GM/Finance wait for Kirk; others unlock now.
create or replace function public.choose_role(p_role_key text)
returns member_status
language plpgsql security definer set search_path = public as $$
declare r public.roles; m public.members;
begin
  select * into m from public.members where user_id = auth.uid();
  if m.id is null then raise exception 'Not on the team list'; end if;
  if m.status <> 'invited' then raise exception 'Role already chosen'; end if;
  select * into r from public.roles where key = p_role_key and selectable;
  if r.id is null then raise exception 'Unknown role'; end if;
  update public.members
     set role_id = r.id,
         status = (case when r.needs_confirm then 'pending_confirm' else 'active' end)::member_status
   where id = m.id
   returning status into m.status;
  if r.needs_confirm then
    insert into public.approvals (area, title, detail, link, requested_by)
    values ('team', m.name || ' chose the ' || r.short_name || ' role',
            'First sign-in · confirm to unlock it', '/team', m.id);
  end if;
  return m.status;
end $$;

-- Kirk moves a person's open tasks (all, or urgent only) to someone else.
create or replace function public.transfer_tasks(p_from uuid, p_to uuid, p_urgent_only boolean)
returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public.is_admin() then raise exception 'Only Kirk can move work'; end if;
  update public.tasks set owner_id = p_to
   where owner_id = p_from and not done and (not p_urgent_only or urgent);
  get diagnostics n = row_count;
  insert into public.activity (area, actor_id, summary)
  values ('team', public.my_member_id(),
          'moved ' || n || ' task(s) from ' || (select name from public.members where id = p_from)
          || ' to ' || (select name from public.members where id = p_to));
  return n;
end $$;

-- Owner protection: the owner always keeps an admin role.
create or replace function public.protect_owner()
returns trigger language plpgsql as $$
begin
  if old.is_owner and (
       new.status not in ('active','on_leave')
       or not exists (select 1 from public.roles where id = new.role_id and is_admin)) then
    raise exception 'The owner always stays an active admin';
  end if;
  return new;
end $$;
create trigger protect_owner before update on public.members
for each row execute function public.protect_owner();

-- ───────────────────────── Row-level security ─────────────────────────
alter table public.areas enable row level security;
alter table public.roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.members enable row level security;
alter table public.tasks enable row level security;
alter table public.approvals enable row level security;
alter table public.activity enable row level security;
alter table public.prospects enable row level security;
alter table public.contact_log enable row level security;
alter table public.research_facts enable row level security;
alter table public.templates enable row level security;
alter table public.drafts enable row level security;
alter table public.projects enable row level security;
alter table public.greeting enable row level security;
alter table public.greeting_seen enable row level security;

-- Reference data: any signed-in team member (incl. invited, to pick a role) can read.
create policy areas_read on public.areas for select to authenticated using (true);
create policy roles_read on public.roles for select to authenticated using (true);
create policy roles_admin on public.roles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy perms_read on public.role_permissions for select to authenticated using (true);
create policy perms_admin on public.role_permissions for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Members: you can always read yourself; the team can read each other; only Kirk changes members.
create policy members_self on public.members for select to authenticated using (user_id = auth.uid());
create policy members_team on public.members for select to authenticated using (public.me() is not null);
create policy members_admin on public.members for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Tasks: visible if you can view the area; you edit your own, editors edit any in the area.
create policy tasks_read on public.tasks for select to authenticated using (public.can(area, 'view'));
create policy tasks_write on public.tasks for all to authenticated
  using (public.can(area, 'edit') or owner_id = public.my_member_id())
  with check (public.can(area, 'edit'));

-- Approvals: requesters see their own; only Kirk sees and decides all.
create policy approvals_read on public.approvals for select to authenticated
  using (public.is_admin() or requested_by = public.my_member_id());
create policy approvals_insert on public.approvals for insert to authenticated
  with check (public.me() is not null and requested_by = public.my_member_id());
create policy approvals_decide on public.approvals for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Activity: read if you can view the area. Rows are written by triggers/RPCs and server actions.
create policy activity_read on public.activity for select to authenticated using (public.can(area, 'view'));
create policy activity_insert on public.activity for insert to authenticated
  with check (public.me() is not null and actor_id = public.my_member_id());

-- Outreach tables
create policy prospects_read on public.prospects for select to authenticated using (public.can('outreach', 'view'));
create policy prospects_write on public.prospects for all to authenticated
  using (public.can('outreach', 'edit')) with check (public.can('outreach', 'edit'));
create policy contact_read on public.contact_log for select to authenticated using (public.can('outreach', 'view'));
create policy contact_write on public.contact_log for insert to authenticated
  with check (public.can('outreach', 'edit') and logged_by = public.my_member_id());
create policy facts_read on public.research_facts for select to authenticated using (public.can('outreach', 'view'));
create policy facts_write on public.research_facts for all to authenticated
  using (public.can('outreach', 'edit')) with check (public.can('outreach', 'edit'));
create policy templates_read on public.templates for select to authenticated using (public.can('outreach', 'view'));
create policy templates_write on public.templates for all to authenticated
  using (public.can('outreach', 'edit')) with check (public.can('outreach', 'edit'));
create policy drafts_read on public.drafts for select to authenticated using (public.can('outreach', 'view'));
create policy drafts_write on public.drafts for all to authenticated
  using (public.can('outreach', 'edit')) with check (public.can('outreach', 'edit'));
create policy projects_read on public.projects for select to authenticated using (public.can('projects', 'view'));
create policy projects_write on public.projects for all to authenticated
  using (public.can('projects', 'edit')) with check (public.can('projects', 'edit'));

-- Greeting: everyone on the team reads it; only Kirk edits. You record only your own "seen".
create policy greeting_read on public.greeting for select to authenticated using (public.me() is not null);
create policy greeting_admin on public.greeting for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy seen_own on public.greeting_seen for all to authenticated
  using (member_id = public.my_member_id()) with check (member_id = public.my_member_id());

-- ───────────────────────── Sign-up gate (Auth hook) ─────────────────────────
-- Rejects any Google account whose email Kirk hasn't added to members.
-- Turn it on in: Authentication → Hooks → "Before User Created" → Postgres → public.hook_before_user_created
create or replace function public.hook_before_user_created(event jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare email text := lower(coalesce(event->'user'->>'email', ''));
begin
  if exists (select 1 from public.members where google_email = email::citext and status <> 'removed') then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object('error', jsonb_build_object(
    'http_code', 403,
    'message', 'This Google account isn''t on the team. Ask Kirk to add you.'));
end $$;

grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_before_user_created(jsonb) from authenticated, anon, public;
grant usage on schema public to supabase_auth_admin;
grant select on public.members to supabase_auth_admin;
create policy members_auth_hook on public.members for select to supabase_auth_admin using (true);

-- Kirk saved a new greeting and wants everyone to see it again today.
create or replace function public.reset_greeting_seen(p_day date)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only Kirk can do this'; end if;
  delete from public.greeting_seen where seen_on = p_day;
end $$;
