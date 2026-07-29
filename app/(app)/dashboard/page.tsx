import { createClient } from "@/lib/supabase/server";
import { Brick, Eyebrow } from "@/components/ui";
import { Bookmark, Pencil, TrendingUp, Flame } from "lucide-react";
import { FILL_VAR } from "@/lib/tokens";

async function StatCard({
  label,
  value,
  icon: Icon,
  fill,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  fill: string;
}) {
  return (
    <Brick className="p-5 flex items-center gap-4">
      <span
        className="grid place-items-center flex-shrink-0"
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--r-md)",
          background: fill,
          border: "var(--bw-2) solid var(--ink)",
        }}
      >
        <Icon size={20} strokeWidth={2.5} />
      </span>
      <div>
        <p
          className="font-display font-bold leading-none"
          style={{ fontSize: 32, letterSpacing: "-0.02em" }}
        >
          {value}
        </p>
        <p className="text-[12px] font-mono font-bold tracking-widest text-muted mt-1 uppercase">
          {label}
        </p>
      </div>
    </Brick>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ count: bookmarkCount }, { count: draftCount }, { data: topCategories }] =
    await Promise.all([
      supabase
        .from("bookmarks")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("drafts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("articles")
        .select("categories(name, fill)", { count: "exact" })
        .eq("signal_tier", "hot")
        .order("published_at", { ascending: false })
        .limit(50),
    ]);

  // Count hot articles per category
  type CatCount = { name: string; fill: string; count: number };
  const catMap = new Map<string, CatCount>();
  for (const row of topCategories ?? []) {
    const cats = Array.isArray(row.categories) ? row.categories : row.categories ? [row.categories] : [];
    for (const c of cats as { name: string; fill: string }[]) {
      if (!c?.name) continue;
      const existing = catMap.get(c.name);
      if (existing) existing.count++;
      else catMap.set(c.name, { name: c.name, fill: c.fill, count: 1 });
    }
  }
  const topCats = [...catMap.values()].sort((a, b) => b.count - a.count).slice(0, 4);

  return (
    <div>
      <Brick
        fill="lemon"
        className="p-6 mb-5"
        style={{ animation: "popUp var(--d-reveal) var(--ease-spring) both" }}
      >
        <Eyebrow className="block mb-2">Your workspace</Eyebrow>
        <h1
          className="font-display font-bold leading-[1.02] mb-2"
          style={{ fontSize: 38, letterSpacing: "-0.02em" }}
        >
          Dashboard
        </h1>
        <p
          className="max-w-[58ch] text-[14px] leading-[1.55] font-medium"
          style={{ color: "var(--ink-2)" }}
        >
          Your activity at a glance.
        </p>
      </Brick>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <StatCard label="Saved articles" value={bookmarkCount ?? 0} icon={Bookmark} fill={FILL_VAR.sky} />
        <StatCard label="Drafts" value={draftCount ?? 0} icon={Pencil} fill={FILL_VAR.pink} />
      </div>

      {topCats.length > 0 && (
        <Brick className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={14} strokeWidth={2.5} />
            <Eyebrow>Trending in your categories</Eyebrow>
          </div>
          <ol className="flex flex-col gap-2">
            {topCats.map((c, i) => (
              <li key={c.name} className="flex items-center gap-3">
                <span
                  className="grid place-items-center font-mono text-[11px] font-bold"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "var(--r-sm)",
                    background: FILL_VAR[c.fill as keyof typeof FILL_VAR] ?? FILL_VAR.sky,
                    border: "var(--bw-2) solid var(--ink)",
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-semibold text-[14px]">{c.name}</span>
                <span
                  className="font-mono text-[11px] font-bold"
                  style={{ color: "var(--muted)", letterSpacing: "0.06em" }}
                >
                  <TrendingUp size={11} className="inline mr-1" />
                  {c.count} hot
                </span>
              </li>
            ))}
          </ol>
        </Brick>
      )}
    </div>
  );
}
