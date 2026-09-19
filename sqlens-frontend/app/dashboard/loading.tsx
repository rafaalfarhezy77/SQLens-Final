import { Skeleton, CardSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div className="pb-6 border-b-2 border-[#111111] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Banner Skeleton */}
      <div className="border-2 border-[#111111] bg-[#FFF3A3] p-6 shadow-[4px_4px_0px_0px_#111111] space-y-3">
        <Skeleton className="h-6 w-48 bg-white/70" />
        <Skeleton className="h-4 w-3/4 bg-white/70" />
        <Skeleton className="h-4 w-1/2 bg-white/70" />
      </div>

      {/* 3 Action Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Two Column Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border-2 border-[#111111] bg-white p-6 shadow-[4px_4px_0px_0px_#111111] space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="border-2 border-[#111111] bg-white p-6 shadow-[4px_4px_0px_0px_#111111] space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}
