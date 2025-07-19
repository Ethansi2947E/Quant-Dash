export default function PerformanceLoading() {
  return (
    <div className="container space-y-4 py-4 md:py-8">
      {/* Page heading skeleton */}
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted/50" />

      {/* Metrics cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>

      {/* Chart & side panel skeleton */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Main chart area */}
        <div className="col-span-4 h-[420px] animate-pulse rounded-xl bg-muted" />

        {/* Side cards */}
        <div className="col-span-3 space-y-4">
          <div className="h-[200px] animate-pulse rounded-xl bg-muted" />
          <div className="h-[200px] animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
