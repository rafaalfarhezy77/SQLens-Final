import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DatasetPreview } from "@/components/playground/dataset-preview";
import { QueryHistory } from "@/components/playground/query-history";
import { SqlEditor } from "@/components/playground/sql-editor";
import { QueryResult } from "@/components/playground/query-result";
import { QueryVisualization } from "@/components/playground/query-visualization";
import { DEFAULT_SQL_QUERY } from "@/lib/playground/query-processor";
import { executeQueryForCurrentUser } from "@/lib/api/server/query-execution";
import { getEducationalDataset } from "@/lib/api/server/datasets";
import type { QueryExecutionSuccessResponse } from "@/lib/api/contracts/query-execution";
import type { EducationalDataset } from "@/lib/api/contracts/datasets";

export const metadata: Metadata = {
  title: "SQL Playground",
  description:
    "Laboratorium query SQL interaktif dengan visualisasi tahapan pemrosesan data.",
};

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentQuery = resolvedParams.q || DEFAULT_SQL_QUERY;

  let executionResult: QueryExecutionSuccessResponse | undefined;
  let executionError: string | undefined;
  let dataset: EducationalDataset | undefined;
  try {
    dataset = await getEducationalDataset();
  } catch {
    dataset = undefined;
  }
  try {
    const response = await executeQueryForCurrentUser({ query: currentQuery });
    if (response.payload.status === "success") {
      executionResult = response.payload;
    } else {
      executionError = response.payload.error.message;
    }
  } catch {
    executionError =
      "Query tidak dapat dijalankan karena layanan SQLens tidak tersedia.";
  }

  return (
    <div className="space-y-8">
      {/* Page Header matching reference sql-editor.html */}
      <section
        className="neo-card-yellow p-6 sm:p-7 relative overflow-hidden"
        aria-labelledby="playground-title"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="neo-badge neo-badge-dark text-xs py-0.5 px-2">
                LEARNING MODE
              </span>
              <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 border border-[#111111]">
                Simulasi Step-by-Step
              </span>
            </div>
            <h1
              id="playground-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-[#111111]"
            >
              SQL PLAYGROUND
            </h1>
            <p className="text-xs sm:text-sm text-[#111111] font-semibold leading-relaxed max-w-2xl">
              Tulis query SQL kamu, jalankan simulasi, lalu lihat bagaimana data
              diproses step-by-step dari tabel sumber hingga hasil akhir.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href={`/dashboard/ai-tutor?q=${encodeURIComponent(
                currentQuery,
              )}&prompt=${encodeURIComponent(
                `Jelaskan alur eksekusi untuk query: ${currentQuery}`,
              )}`}
              id="btn-hero-ask-ai-tutor"
              className="neo-btn neo-btn-dark text-xs py-2.5 px-4 shadow-[3px_3px_0_#FFD600] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#FFD600]" />
              <span>ASK AI TUTOR</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Two Column Section: SQL Editor & Dataset Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: SQL Editor (7 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <SqlEditor initialQuery={currentQuery} />
          </Suspense>
        </div>

        {/* Right: Dataset Preview (5 Cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <DatasetPreview dataset={dataset} />
        </div>
      </div>

      {/* Query Result Section (Server Component) */}
      <div className="space-y-4">
        <QueryResult result={executionResult} error={executionError} />
      </div>

      {/* Query-to-Visual Explanation Section (Server Component) */}
      {executionResult && (
        <div className="space-y-4">
          <QueryVisualization steps={executionResult.steps} />
        </div>
      )}

      <QueryHistory />
    </div>
  );
}
