import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CardSkeleton } from "@/components/ui/skeleton";
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { LearningProgress } from "@/components/dashboard/learning-progress";
import { ContinueLearningCard } from "@/components/dashboard/continue-learning-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TopicsToReview } from "@/components/dashboard/topics-to-review";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";

export const metadata: Metadata = {
  title: "Learning Dashboard",
  description:
    "Pantau progress belajar SQL kamu, lihat recent query, dan lanjutkan materi yang belum selesai di SQLens Learning Dashboard.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Section 1: Welcome Hero Section */}
      <section
        className="neo-card-yellow p-6 sm:p-8 lg:p-10 relative overflow-hidden"
        aria-labelledby="hero-title"
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 flex-wrap">
              <span className="neo-badge neo-badge-dark text-xs py-1 px-2.5">
                Current Topic: JOIN Fundamentals
              </span>
              <span className="font-mono text-xs font-bold bg-white px-2.5 py-1 border-2 border-[#111111] shadow-[2px_2px_0_#111111] hidden sm:inline-block">
                Modul 04 &bull; 60% Selesai
              </span>
            </div>

            <h1
              id="hero-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight text-[#111111]"
            >
              WELCOME BACK. <br />
              READY TO QUERY?
            </h1>

            <p className="text-sm sm:text-base text-[#111111] font-semibold leading-relaxed">
              Lanjutkan progress belajar SQL kamu, uji coba logika eksekusi
              query, dan pelajari relasi antar tabel dengan simulasi visual
              interaktif.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="#continue"
                className="neo-btn neo-btn-dark text-xs sm:text-sm py-2.5 px-5"
              >
                CONTINUE LEARNING &rarr;
              </Link>
              <Link
                href="/dashboard/playground"
                className="neo-btn neo-btn-white text-xs sm:text-sm py-2.5 px-5"
              >
                OPEN SQL PLAYGROUND
              </Link>
            </div>
          </div>

          {/* Quick Target / Status Widget on the Right */}
          <div className="bg-white border-3 border-[#111111] p-5 sm:p-6 shadow-[5px_5px_0_#111111] max-w-sm w-full space-y-3.5 font-mono text-xs shrink-0 self-start xl:self-center">
            <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2.5">
              <span className="font-black uppercase tracking-wider text-[#111111] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D084] animate-pulse" />
                SESSION HIGHLIGHT
              </span>
              <span className="text-[10px] font-bold bg-[#FFF3A3] px-2 py-0.5 border border-[#111111]">
                ACTIVE
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#666666]">Dataset Aktif:</span>
                <span className="font-bold text-[#111111]">
                  Akademik Kampus
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#666666]">Target Hari Ini:</span>
                <span className="font-bold text-[#111111]">
                  Kuasai INNER JOIN
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#666666]">Rekomendasi Review:</span>
                <span className="font-bold text-[#FF5A5F]">
                  2 Topik Butuh Cek
                </span>
              </div>
            </div>
            <div className="pt-2 border-t-2 border-[#111111]">
              <Link
                href="/dashboard/playground?q=SELECT+students.name,+scores.score+FROM+students+JOIN+scores+ON+students.id+=+scores.student_id+WHERE+scores.score+>=+80;"
                className="neo-btn text-xs py-2 px-3 w-full text-center block hover:bg-[#FFD600]"
              >
                LATIHAN SEKARANG &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Summary Metrics (4 Cards) */}
      <DashboardMetrics />

      {/* Section 3: Dual Grid (Learning Progress & Continue Learning) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <Suspense fallback={<CardSkeleton />}>
            <LearningProgress />
          </Suspense>
        </div>

        <div className="lg:col-span-5">
          <ContinueLearningCard />
        </div>
      </div>

      {/* Section 4: Recent Queries & Interactive Filter */}
      <Suspense fallback={<CardSkeleton />}>
        <RecentActivity />
      </Suspense>

      {/* Section 5: Topics to Review & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <TopicsToReview />
        </div>

        <div className="lg:col-span-7">
          <WeeklyActivityChart />
        </div>
      </div>

      {/* Section 6: Quick Actions */}
      <QuickActions />
    </div>
  );
}
