-- Copy this file to seed.sql (it is git-ignored), replace the emails, then run it
-- in the Supabase SQL Editor AFTER 0001_phase1.sql. Never commit real emails:
-- this repository is public.

-- Kirk: the owner. Admin from the start, no role picker, can't be locked out.
insert into public.members (google_email, name, role_id, status, is_owner)
select 'KIRK_GOOGLE_EMAIL@gmail.com', 'Kirk', id, 'active', true
from public.roles where key = 'gm';

-- The team: invited. They choose their role on first sign-in.
insert into public.members (google_email, name) values
  ('KYRENE_GOOGLE_EMAIL@gmail.com', 'Kyrene'),
  ('NAOMI_GOOGLE_EMAIL@gmail.com', 'Naomi'),
  ('PAULINE_GOOGLE_EMAIL@gmail.com', 'Pauline');

-- Starter email templates. {business_name} and {hook} are filled in per prospect.
insert into public.templates (name, kind, subject, body) values
  ('Intro · local business', 'intro', 'An idea for {business_name}',
   E'Hi there,\n\nI came across {business_name} and noticed {hook}.\n\nWe build simple websites and booking or ordering pages for local businesses, and I sketched a one-page idea for you. Happy to send it over if useful.\n\nThanks,\n{sender}'),
  ('Follow-up · gentle nudge', 'follow_up', 'Re: An idea for {business_name}',
   E'Hi again,\n\nJust floating this back up in case it got buried. The idea was built around {hook}. Would a quick 10-minute call this week work?\n\n{sender}');
