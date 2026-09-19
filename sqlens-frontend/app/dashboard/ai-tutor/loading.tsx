import { Skeleton } from "@/components/ui/skeleton";

export default function AiTutorLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="pb-6 border-b-2 border-[#111111] space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Context Card Skeleton */}
      <Skeleton className="h-28 w-full" />

      {/* Form and Response Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="lg:col-span-7">
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
}
