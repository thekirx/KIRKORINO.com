-- Newer Supabase projects don't grant table access to signed-in users by default.
-- Row-level security (0001) still decides which rows each person can see;
-- these grants only let the "authenticated" role reach the tables at all.
-- Signed-out visitors ("anon") get nothing.
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant usage, select on sequences to authenticated;
alter default privileges in schema public grant execute on functions to authenticated;
