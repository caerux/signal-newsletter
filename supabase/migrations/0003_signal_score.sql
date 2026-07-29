-- Signal score v1: age-based scoring refreshed on every ingest run.
-- Score = GREATEST(0, 100 - age_hours * 2), clamped to [0, 100].
-- Tiers: hot > 80 (<10h), rise 50-80 (10-25h), cool <50 (>25h).
-- Only touches articles from the last 3 days to stay fast.

create or replace function public.refresh_signal_scores()
returns void
language sql
security definer
as $$
  update public.articles
  set
    signal_score = greatest(0, 100 - (
      extract(epoch from (now() - published_at)) / 3600.0 * 2
    )),
    signal_tier = case
      when extract(epoch from (now() - published_at)) / 3600.0 < 10  then 'hot'
      when extract(epoch from (now() - published_at)) / 3600.0 < 25  then 'rise'
      else 'cool'
    end
  where published_at > now() - interval '3 days';
$$;
