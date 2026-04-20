-- Signal — row-level security policies
-- The service-role key (used by the ingest worker) bypasses RLS entirely.

alter table public.profiles   enable row level security;
alter table public.categories enable row level security;
alter table public.sources    enable row level security;
alter table public.articles   enable row level security;
alter table public.summaries  enable row level security;
alter table public.bookmarks  enable row level security;
alter table public.ideas      enable row level security;
alter table public.drafts     enable row level security;

-- ---------------------------------------------------------------------------
-- profiles: everyone can read, users can update their own row
-- ---------------------------------------------------------------------------
drop policy if exists "profiles are readable by everyone" on public.profiles;
create policy "profiles are readable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "users update their own profile" on public.profiles;
create policy "users update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- categories / sources / articles / summaries: public read-only
-- Writes happen via the service-role key during ingestion.
-- ---------------------------------------------------------------------------
drop policy if exists "categories are readable by everyone" on public.categories;
create policy "categories are readable by everyone"
  on public.categories for select
  using (true);

drop policy if exists "sources are readable by everyone" on public.sources;
create policy "sources are readable by everyone"
  on public.sources for select
  using (true);

drop policy if exists "articles are readable by everyone" on public.articles;
create policy "articles are readable by everyone"
  on public.articles for select
  using (true);

drop policy if exists "summaries are readable by everyone" on public.summaries;
create policy "summaries are readable by everyone"
  on public.summaries for select
  using (true);

-- ---------------------------------------------------------------------------
-- bookmarks: fully user-scoped
-- ---------------------------------------------------------------------------
drop policy if exists "users read their own bookmarks" on public.bookmarks;
create policy "users read their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

drop policy if exists "users insert their own bookmarks" on public.bookmarks;
create policy "users insert their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

drop policy if exists "users update their own bookmarks" on public.bookmarks;
create policy "users update their own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

drop policy if exists "users delete their own bookmarks" on public.bookmarks;
create policy "users delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- ideas: fully user-scoped
-- ---------------------------------------------------------------------------
drop policy if exists "users read their own ideas" on public.ideas;
create policy "users read their own ideas"
  on public.ideas for select
  using (auth.uid() = user_id);

drop policy if exists "users insert their own ideas" on public.ideas;
create policy "users insert their own ideas"
  on public.ideas for insert
  with check (auth.uid() = user_id);

drop policy if exists "users delete their own ideas" on public.ideas;
create policy "users delete their own ideas"
  on public.ideas for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- drafts: fully user-scoped
-- ---------------------------------------------------------------------------
drop policy if exists "users read their own drafts" on public.drafts;
create policy "users read their own drafts"
  on public.drafts for select
  using (auth.uid() = user_id);

drop policy if exists "users insert their own drafts" on public.drafts;
create policy "users insert their own drafts"
  on public.drafts for insert
  with check (auth.uid() = user_id);

drop policy if exists "users update their own drafts" on public.drafts;
create policy "users update their own drafts"
  on public.drafts for update
  using (auth.uid() = user_id);

drop policy if exists "users delete their own drafts" on public.drafts;
create policy "users delete their own drafts"
  on public.drafts for delete
  using (auth.uid() = user_id);
