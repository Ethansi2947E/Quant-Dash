export default function AnalyticsLoading() {
  return (
    <div className="container space-y-4 py-4 md:py-8">
      {/* Page heading skeleton */}
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted/50" />

      {/* Card skeletons */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Large chart skeleton */}
        <div className="col-span-4 h-[420px] animate-pulse rounded-xl bg-muted" />

        {/* Right-hand cards */}
        <div className="col-span-3 space-y-4">
          <div className="h-[200px] animate-pulse rounded-xl bg-muted" />
          <div className="h-[200px] animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
