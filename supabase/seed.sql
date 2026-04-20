-- Signal — seed data for categories and RSS sources.
-- Safe to run multiple times; rows conflict on slug / feed_url.

-- Categories (fill values map to soft-neobrutalism color tokens in
-- lib/tokens.ts → FILL_VAR: 'peach' | 'lemon' | 'mint' | 'sky' | 'lavender' | 'pink')
insert into public.categories (slug, name, description, fill, sort_order) values
  ('tech',        'Tech',        'Software, infra, platforms',        'sky',      10),
  ('ai',          'AI',          'Models, agents, applied ML',        'lavender', 20),
  ('startups',    'Startups',    'Founders, funding, building',       'peach',    30),
  ('design',      'Design',      'Product, visual, systems',          'pink',     40),
  ('engineering', 'Engineering', 'Languages, tools, best practices',  'mint',     50),
  ('business',    'Business',    'Markets, strategy, operations',     'lemon',    60),
  ('culture',     'Culture',     'Media, society, creators',          'peach',    70)
on conflict (slug) do nothing;

-- A starter set of ~22 high-signal feeds across the categories above.
-- Swap/extend freely via the Supabase dashboard — `active = false` disables ingestion.
insert into public.sources (name, homepage_url, feed_url, category_id)
select src.name, src.homepage_url, src.feed_url, c.id
from (values
  -- tech
  ('Hacker News Frontpage',   'https://news.ycombinator.com',              'https://news.ycombinator.com/rss',                                'tech'),
  ('The Verge',               'https://www.theverge.com',                  'https://www.theverge.com/rss/index.xml',                          'tech'),
  ('TechCrunch',              'https://techcrunch.com',                    'https://techcrunch.com/feed/',                                    'tech'),
  ('Ars Technica',            'https://arstechnica.com',                   'https://feeds.arstechnica.com/arstechnica/index',                 'tech'),
  ('Wired',                   'https://www.wired.com',                     'https://www.wired.com/feed/rss',                                  'tech'),
  ('MIT Technology Review',   'https://www.technologyreview.com',          'https://www.technologyreview.com/feed/',                          'tech'),
  -- ai
  ('Hugging Face Blog',       'https://huggingface.co/blog',               'https://huggingface.co/blog/feed.xml',                            'ai'),
  ('OpenAI Blog',             'https://openai.com/blog',                   'https://openai.com/blog/rss.xml',                                 'ai'),
  ('Anthropic News',          'https://www.anthropic.com/news',            'https://www.anthropic.com/news/rss.xml',                          'ai'),
  ('Simon Willison',          'https://simonwillison.net',                 'https://simonwillison.net/atom/everything/',                      'ai'),
  -- startups
  ('Every',                   'https://every.to',                          'https://every.to/feed.xml',                                       'startups'),
  ('Stratechery',             'https://stratechery.com',                   'https://stratechery.com/feed/',                                   'startups'),
  ('First Round Review',      'https://review.firstround.com',             'https://review.firstround.com/rss',                               'startups'),
  ('A Smart Bear',            'https://longform.asmartbear.com',           'https://longform.asmartbear.com/index.xml',                       'startups'),
  -- design
  ('Smashing Magazine',       'https://www.smashingmagazine.com',          'https://www.smashingmagazine.com/feed/',                          'design'),
  ('A List Apart',            'https://alistapart.com',                    'https://alistapart.com/main/feed/',                               'design'),
  ('UX Collective',           'https://uxdesign.cc',                       'https://uxdesign.cc/feed',                                        'design'),
  -- engineering
  ('GitHub Blog',             'https://github.blog',                       'https://github.blog/feed/',                                       'engineering'),
  ('Cloudflare Blog',         'https://blog.cloudflare.com',               'https://blog.cloudflare.com/rss/',                                'engineering'),
  ('Vercel Blog',             'https://vercel.com/blog',                   'https://vercel.com/atom',                                         'engineering'),
  ('Netflix Tech Blog',       'https://netflixtechblog.com',               'https://netflixtechblog.com/feed',                                'engineering'),
  ('The Pragmatic Engineer',  'https://newsletter.pragmaticengineer.com',  'https://newsletter.pragmaticengineer.com/feed',                   'engineering')
) as src(name, homepage_url, feed_url, cat_slug)
join public.categories c on c.slug = src.cat_slug
on conflict (feed_url) do nothing;
