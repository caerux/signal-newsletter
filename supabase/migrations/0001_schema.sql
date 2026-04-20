-- Signal — initial schema
-- Applied once, idempotent where practical.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles — public-facing data that mirrors auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  username      text unique,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'preferred_username',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Shared updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- categories — editorial buckets shown in the sidebar
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  fill        text not null default 'peach',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- sources — RSS/Atom feeds we ingest from
-- ---------------------------------------------------------------------------
create table if not exists public.sources (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  homepage_url       text not null,
  feed_url           text unique not null,
  category_id        uuid references public.categories (id) on delete set null,
  favicon_url        text,
  active             boolean not null default true,
  last_fetched_at    timestamptz,
  last_fetch_status  text,
  created_at         timestamptz not null default now()
);

create index if not exists sources_active_idx   on public.sources (active);
create index if not exists sources_category_idx on public.sources (category_id);

-- ---------------------------------------------------------------------------
-- articles — ingested items (deduped by canonical_url)
-- ---------------------------------------------------------------------------
create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  source_id     uuid not null references public.sources (id) on delete cascade,
  category_id   uuid references public.categories (id) on delete set null,
  title         text not null,
  description   text,
  canonical_url text unique not null,
  author        text,
  published_at  timestamptz,
  image_url     text,
  signal_score  numeric(5, 2) not null default 50,
  signal_tier   text not null default 'cool'
                check (signal_tier in ('hot', 'rise', 'cool')),
  raw           jsonb,
  ingested_at   timestamptz not null default now()
);

create index if not exists articles_published_idx
  on public.articles (published_at desc nulls last);
create index if not exists articles_category_published_idx
  on public.articles (category_id, published_at desc nulls last);
create index if not exists articles_source_published_idx
  on public.articles (source_id, published_at desc nulls last);
create index if not exists articles_signal_tier_idx
  on public.articles (signal_tier);

-- ---------------------------------------------------------------------------
-- bookmarks — user saves
-- ---------------------------------------------------------------------------
create table if not exists public.bookmarks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  article_id  uuid not null references public.articles (id) on delete cascade,
  note        text,
  created_at  timestamptz not null default now(),
  unique (user_id, article_id)
);

create index if not exists bookmarks_user_created_idx
  on public.bookmarks (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- summaries — AI-generated, cached per article
-- ---------------------------------------------------------------------------
create table if not exists public.summaries (
  id          uuid primary key default gen_random_uuid(),
  article_id  uuid unique not null references public.articles (id) on delete cascade,
  summary_md  text not null,
  key_points  jsonb,
  model       text not null,
  tokens_used int,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ideas — AI-generated article angles from a source article (per user)
-- ---------------------------------------------------------------------------
create table if not exists public.ideas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  article_id  uuid not null references public.articles (id) on delete cascade,
  angle       text not null,
  audience    text,
  outline     jsonb not null,
  model       text not null,
  created_at  timestamptz not null default now(),
  unique (user_id, article_id)
);

-- ---------------------------------------------------------------------------
-- drafts — user-owned markdown drafts
-- ---------------------------------------------------------------------------
create table if not exists public.drafts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  idea_id     uuid references public.ideas (id) on delete set null,
  title       text not null default 'Untitled',
  body_md     text not null default '',
  status      text not null default 'draft'
              check (status in ('draft', 'ready', 'published')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists drafts_user_updated_idx
  on public.drafts (user_id, updated_at desc);

drop trigger if exists drafts_updated_at on public.drafts;
create trigger drafts_updated_at
  before update on public.drafts
  for each row execute function public.set_updated_at();
