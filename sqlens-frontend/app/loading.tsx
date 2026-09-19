import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <main className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      {/* Header Skeleton */}
      <div className="border-2 border-[#111111] bg-white p-6 shadow-[4px_4px_0px_0px_#111111] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Hero Skeleton */}
      <div className="border-2 border-[#111111] bg-[#FFF3A3] p-8 md:p-12 shadow-[6px_6px_0px_0px_#111111] space-y-4">
        <Skeleton className="h-6 w-24 bg-white/60" />
        <Skeleton className="h-12 w-3/4 bg-white/60" />
        <Skeleton className="h-5 w-2/3 bg-white/60" />
        <div className="pt-4 flex gap-4">
          <Skeleton className="h-12 w-40 bg-white/60" />
          <Skeleton className="h-12 w-40 bg-white/60" />
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-2 border-[#111111] bg-white p-6 shadow-[4px_4px_0px_0px_#111111] space-y-3"
          >
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="pt-4">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
