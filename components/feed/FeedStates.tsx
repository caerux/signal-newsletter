import { Brick } from "@/components/ui/Brick";

function SkeletonCard() {
  return (
    <div className="brick p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-20 rounded bg-ink/10" />
        <div className="h-5 w-16 rounded-full bg-ink/10" />
      </div>
      <div className="h-6 w-3/4 rounded bg-ink/10 mb-2" />
      <div className="h-4 w-full rounded bg-ink/10 mb-1.5" />
      <div className="h-4 w-5/6 rounded bg-ink/10 mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 rounded-full bg-ink/10" />
        <div className="h-8 w-16 rounded bg-ink/10" />
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      {/* Hero brick skeleton */}
      <Brick fill="lemon" className="p-6 mb-1 animate-pulse">
        <div className="h-3 w-28 rounded bg-ink/10 mb-3" />
        <div className="h-10 w-3/4 rounded bg-ink/15 mb-3" />
        <div className="h-4 w-full max-w-sm rounded bg-ink/10 mb-1" />
        <div className="h-4 w-4/5 max-w-xs rounded bg-ink/10" />
      </Brick>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </section>
  );
}

export function FeedError({ message }: { message?: string }) {
  return (
    <Brick fill="peach" className="p-8 text-center">
      <p className="font-display font-bold text-xl mb-2">
        Couldn&apos;t load the feed
      </p>
      <p className="text-sm font-ui text-ink-2">
        {message ?? "Something went wrong. Refresh to try again."}
      </p>
    </Brick>
  );
}
