import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="border-3 border-[#111111] bg-[#FFFFFF] shadow-[6px_6px_0px_0px_#111111] p-6 sm:p-8 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2 pb-4 border-b-2 border-[#111111]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Form Fields Skeleton */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="pt-2">
          <Skeleton className="h-12 w-full" />
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="pt-4 border-t-2 border-[#111111] flex justify-between">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
