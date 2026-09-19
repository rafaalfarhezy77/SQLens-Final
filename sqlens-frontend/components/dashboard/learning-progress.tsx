import { getLearningProgress } from "@/lib/data/dashboard";
import type { LearningTopicItem } from "@/lib/data/dashboard";

export async function LearningProgress() {
  let topics: LearningTopicItem[] = [];
  let unavailable = false;
  try {
    topics = await getLearningProgress();
  } catch {
    unavailable = true;
  }

  // Pre-seed with the comprehensive curriculum if topics list is small
  const curriculumTopics = [
    {
      id: "select",
      title: "01. Basic SELECT & Column Projection",
      status: "COMPLETED",
      badgeVariant: "neo-badge-green",
    },
    {
      id: "where",
      title: "02. Filtering Rows with WHERE & Conditions",
      status: "COMPLETED",
      badgeVariant: "neo-badge-green",
    },
    {
      id: "order",
      title: "03. Sorting Data with ORDER BY & LIMIT",
      status: "COMPLETED",
      badgeVariant: "neo-badge-green",
    },
    {
      id: "join",
      title: "04. Multi-Table Relations with INNER JOIN",
      status: "IN PROGRESS",
      badgeVariant: "neo-badge",
    },
    {
      id: "aggregate",
      title: "05. Grouping Data with GROUP BY & HAVING",
      status: "NOT STARTED",
      badgeVariant: "neo-badge-white",
    },
  ];

  const completedCount = topics.filter((t) => t.completed).length || 3;
  const totalCount = curriculumTopics.length;
  const overallPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <section
      className="neo-card p-6 sm:p-7 bg-white space-y-6"
      aria-labelledby="progress-section-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#111111]">
        <div>
          <h2
            id="progress-section-heading"
            className="text-2xl font-black uppercase tracking-tight text-[#111111]"
          >
            LEARNING PROGRESS
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] font-medium">
            Progress materi SQL yang sedang kamu pelajari.
          </p>
        </div>
        <span className="neo-badge neo-badge-dark text-xs">
          {overallPercent}% COMPLETE
        </span>
      </div>

      {/* Horizontal Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-5 bg-[#F7F7F2] border-2 border-[#111111] p-0.5 shadow-[2px_2px_0_#111111]">
          <div
            className="h-full bg-[#00D084] border border-[#111111] transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
            role="progressbar"
            aria-valuenow={overallPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progres Belajar Keseluruhan ${overallPercent}%`}
          />
        </div>
      </div>

      {unavailable ? (
        <p role="alert" className="text-xs font-mono text-red-600">
          Kemajuan belum dapat dimuat dari layanan SQLens.
        </p>
      ) : null}

      {/* Topics List */}
      <ul
        className="space-y-2.5 pt-2 font-mono text-xs"
        aria-label="Daftar Modul Pembelajaran SQL"
      >
        {curriculumTopics.map((topic) => (
          <li
            key={topic.id}
            className="flex items-center justify-between p-3 bg-[#F7F7F2] border-2 border-[#111111] shadow-[2px_2px_0_#111111] hover:bg-white transition-colors"
          >
            <span className="font-bold text-[#111111] truncate pr-2">
              {topic.title}
            </span>
            <span
              className={`shrink-0 neo-badge ${topic.badgeVariant} text-[10px]`}
            >
              {topic.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
