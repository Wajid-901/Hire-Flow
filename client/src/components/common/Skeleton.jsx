// Base shimmer block — use as a building block for page-specific skeletons
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-zinc-800 ${className}`} />
);

// 4-card stats row (Dashboard top section)
export const StatsRowSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="rounded-2xl border border-white/5 bg-[#18181B] p-6">
        <Skeleton className="h-4 w-28 mb-4" />
        <Skeleton className="h-10 w-16 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

// Recent applications list (Dashboard)
export const RecentAppsSkeleton = () => (
  <div className="rounded-2xl border border-white/5 bg-[#18181B] p-6">
    <Skeleton className="h-5 w-44 mb-1" />
    <Skeleton className="h-3 w-56 mb-6" />
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl bg-zinc-800/40 p-4">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

// Applications table (Applications page)
export const TableSkeleton = ({ rows = 6 }) => (
  <div className="rounded-2xl border border-white/5 bg-[#18181B] overflow-hidden">
    {/* Header row */}
    <div className="flex items-center gap-4 border-b border-white/5 bg-white/[0.02] px-5 py-4">
      <Skeleton className="w-4 h-4 rounded" />
      {["w-28","w-32","w-24","w-24","w-20","w-20"].map((w, i) => (
        <Skeleton key={i} className={`h-3 ${w}`} />
      ))}
    </div>
    {/* Data rows */}
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 border-b border-white/5 px-5 py-4">
        <Skeleton className="w-4 h-4 rounded shrink-0" />
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-4 w-32 hidden sm:block" />
        <Skeleton className="h-4 w-24 hidden md:block" />
        <Skeleton className="h-4 w-24 hidden lg:block" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <div className="ml-auto flex gap-1">
          {[...Array(3)].map((_, j) => <Skeleton key={j} className="w-8 h-8 rounded-lg" />)}
        </div>
      </div>
    ))}
  </div>
);

// Full Dashboard skeleton (stats + main grid)
export const DashboardSkeleton = () => (
  <div className="space-y-8">
    {/* Greeting */}
    <div className="space-y-2">
      <Skeleton className="h-9 w-72" />
      <Skeleton className="h-5 w-96" />
    </div>
    <StatsRowSkeleton />
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <RecentAppsSkeleton />
      </div>
      <div className="rounded-2xl border border-white/5 bg-[#18181B] p-6 space-y-4">
        <Skeleton className="h-5 w-36 mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;
