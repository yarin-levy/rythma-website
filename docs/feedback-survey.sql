-- rythma.co/feedback — answers to the "help us make Rythma better" survey sent to
-- people who tried, paid for, or cancelled the subscription.
--
-- Applied to the app's Supabase project (xvpjkmdrzddwnfhnvtbh). The website writes
-- with the PUBLIC anon key, so the table is insert-only for anon: nobody can read
-- answers back through the API. Read them in the Supabase dashboard (or SQL).
-- Every column is length-capped so the open insert can't be used to dump junk.

create table if not exists public.churn_survey_responses (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  -- which email link she came from (?g=trial|paid|active), if any
  link_group      text check (link_group in ('trial', 'paid', 'active')),
  status          text not null check (status in ('trial_cancelled', 'paid_cancelled', 'still_subscribed')),
  main_reason     text not null check (char_length(main_reason) <= 40),
  reason_other    text check (char_length(reason_other) <= 600),
  hoped_for       text check (char_length(hoped_for) <= 4000),
  liked           text check (char_length(liked) <= 4000),
  come_back       text[] not null default '{}' check (cardinality(come_back) <= 12),
  come_back_other text check (char_length(come_back_other) <= 600),
  contact_ok      boolean not null default false,
  contact_email   text check (char_length(contact_email) <= 320)
);

alter table public.churn_survey_responses enable row level security;

revoke all on public.churn_survey_responses from anon, authenticated;
grant insert on public.churn_survey_responses to anon;

drop policy if exists "anon can submit survey answers" on public.churn_survey_responses;
create policy "anon can submit survey answers"
  on public.churn_survey_responses
  for insert
  to anon
  with check (true);
