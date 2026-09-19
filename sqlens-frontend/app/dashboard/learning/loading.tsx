import { Skeleton } from "@/components/ui/skeleton";

export default function LearningLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="pb-6 border-b-2 border-[#111111] space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Progress Card Skeleton */}
      <Skeleton className="h-28 w-full" />

      {/* Module List Skeletons */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-2 border-[#111111] bg-white p-6 shadow-[4px_4px_0px_0px_#111111] space-y-3"
          >
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
