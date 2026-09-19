import { Flame, Terminal, BookOpen, AlertCircle } from "lucide-react";

export interface DashboardMetricsProps {
  queriesCount?: number;
  completedCount?: number;
}

export function DashboardMetrics({
  queriesCount = 24,
  completedCount = 4,
}: DashboardMetricsProps) {
  return (
    <section aria-label="Learning Summary Metrics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Queries Practiced */}
        <article className="neo-card p-5 sm:p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#666666]">
                QUERY PRACTICED
              </span>
              <div className="w-8 h-8 bg-[#F7F7F2] border-2 border-[#111111] flex items-center justify-center shadow-[1px_1px_0_#111111]">
                <Terminal size={15} className="text-[#111111]" />
              </div>
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-black text-[#111111]">
              {queriesCount}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#111111] text-xs font-medium text-[#444444]">
            query sudah dieksekusi
          </div>
        </article>

        {/* Metric 2: Lessons Completed */}
        <article className="neo-card p-5 sm:p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#666666]">
                LESSONS COMPLETED
              </span>
              <div className="w-8 h-8 bg-[#E8F8F0] border-2 border-[#111111] flex items-center justify-center shadow-[1px_1px_0_#111111]">
                <BookOpen size={15} className="text-[#006633]" />
              </div>
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-black text-[#111111]">
              {completedCount}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#111111] text-xs font-medium text-[#444444]">
            materi terselesaikan
          </div>
        </article>

        {/* Metric 3: Learning Streak */}
        <article className="neo-card p-5 sm:p-6 bg-[#FFF3A3] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#666666]">
                LEARNING STREAK
              </span>
              <div className="w-8 h-8 bg-white border-2 border-[#111111] flex items-center justify-center shadow-[1px_1px_0_#111111]">
                <Flame size={15} className="text-[#FF5A5F] fill-current" />
              </div>
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-black text-[#111111]">
              5
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#111111] text-xs font-bold text-[#111111] flex items-center gap-1.5">
            <span>hari berturut-turut</span>
            <Flame size={14} className="text-[#FF5A5F] fill-current shrink-0" />
          </div>
        </article>

        {/* Metric 4: Needs Review */}
        <article className="neo-card p-5 sm:p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#666666]">
                NEEDS REVIEW
              </span>
              <div className="w-8 h-8 bg-[#FEECEC] border-2 border-[#111111] flex items-center justify-center shadow-[1px_1px_0_#111111]">
                <AlertCircle size={15} className="text-[#FF5A5F]" />
              </div>
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-black text-[#FF5A5F]">
              2
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#111111] text-xs font-medium text-[#444444]">
            topik butuh pemahaman ulang
          </div>
        </article>
      </div>
    </section>
  );
}
