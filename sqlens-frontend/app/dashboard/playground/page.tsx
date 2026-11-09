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
import { CaseStudySelector } from "@/components/playground/case-study-selector";
import { CaseStudyCard } from "@/components/playground/case-study-card";
import { DEFAULT_SQL_QUERY } from "@/lib/playground/query-processor";
import { executeQueryForCurrentUser } from "@/lib/api/server/query-execution";
import { getEducationalDataset } from "@/lib/api/server/datasets";
import { getCustomDatasetInfo } from "@/lib/api/server/custom-dataset";
import { getStudyCases, getStudyCaseDetail } from "@/lib/api/server/study-cases";
import { getSharedDatasets, getSharedDatasetDetail } from "@/lib/api/server/shared-datasets";
import { BffRequestError } from "@/lib/api/server/errors";
import type { QueryExecutionSuccessResponse } from "@/lib/api/contracts/query-execution";
import type { EducationalDataset } from "@/lib/api/contracts/datasets";
import type { CustomDatasetInfo } from "@/lib/api/contracts/custom-dataset";
import type { StudyCaseSummary, StudyCaseDetail } from "@/lib/api/contracts/study-cases";
import type { SharedDataset, SharedDatasetDetail } from "@/lib/api/contracts/shared-datasets";

export const metadata: Metadata = {
  title: "SQL Playground",
  description:
    "Laboratorium query SQL interaktif dengan studi kasus bisnis nyata dan visualisasi tahapan pemrosesan data.",
};

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; case?: string; shared?: string }>;
}) {
  const resolvedParams = await searchParams;
  const activeCaseId = resolvedParams.case || "academic";
  const activeSharedId = resolvedParams.shared;

  let studyCases: StudyCaseSummary[] = [];
  let activeCaseDetail: StudyCaseDetail | null = null;
  let sharedDatasets: SharedDataset[] = [];
  let activeSharedDetail: SharedDatasetDetail | null = null;
  let dataset: EducationalDataset | undefined;
  let customDataset: CustomDatasetInfo | undefined;

  try {
    studyCases = await getStudyCases();
  } catch {
    studyCases = [];
  }

  try {
    activeCaseDetail = await getStudyCaseDetail(activeCaseId);
  } catch {
    activeCaseDetail = null;
  }

  try {
    sharedDatasets = await getSharedDatasets();
  } catch {
    sharedDatasets = [];
  }

  if (activeSharedId) {
    try {
      activeSharedDetail = await getSharedDatasetDetail(activeSharedId);
    } catch {
      activeSharedDetail = null;
    }
  }

  try {
    dataset = await getEducationalDataset();
  } catch {
    dataset = undefined;
  }

  try {
    customDataset = await getCustomDatasetInfo();
  } catch {
    customDataset = undefined;
  }

  // Determine initial query
  const defaultCaseQuery = activeCaseDetail?.sampleQueries?.[0]?.query || DEFAULT_SQL_QUERY;
  const currentQuery = resolvedParams.q || defaultCaseQuery;

  let executionResult: QueryExecutionSuccessResponse | undefined;
  let executionError: string | undefined;

  try {
    const response = await executeQueryForCurrentUser({
      query: currentQuery,
      sharedDatasetId: activeSharedId,
    });
    if (response.payload.status === "success") {
      executionResult = response.payload;
    } else {
      executionError = response.payload.error.message;
    }
  } catch (error) {
    if (error instanceof BffRequestError) {
      executionError = error.payload.message;
    } else {
      executionError =
        "Query tidak dapat dijalankan karena layanan SQLens tidak tersedia.";
    }
  }

  const editorPresets = activeCaseDetail?.sampleQueries?.map((sq) => ({
    label: sq.title,
    query: sq.query,
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
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
                Multi-Studi Kasus & Visualisasi
              </span>
            </div>
            <h1
              id="playground-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-[#111111]"
            >
              SQL PLAYGROUND
            </h1>
            <p className="text-xs sm:text-sm text-[#111111] font-semibold leading-relaxed max-w-2xl">
              Pilih studi kasus database, kerjakan tantangan SQL, atau jelajahi
              skema dataset tugas kelas dengan simulasi alur data step-by-step.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href={`/dashboard/ai-tutor?q=${encodeURIComponent(
                currentQuery,
              )}&prompt=${encodeURIComponent(
                `Jelaskan alur pemrosesan query berikut pada studi kasus ${activeCaseDetail?.title || "Basis Data"}: ${currentQuery}`,
              )}`}
              id="btn-hero-ask-ai-tutor"
              className="neo-btn neo-btn-dark text-xs py-2.5 px-4 shadow-[3px_3px_0_#FFD600] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#FFD600]" />
              <span>TANYA AI TUTOR</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Case Study & Database Selector */}
      {studyCases.length > 0 && (
        <CaseStudySelector
          studyCases={studyCases}
          sharedDatasets={sharedDatasets}
          hasCustomDataset={customDataset?.has_custom_dataset}
          activeCaseId={activeCaseId}
        />
      )}

      {/* Case Study Card (Overview, Challenges, Sample Queries) */}
      {activeCaseDetail && !activeSharedId && (
        <CaseStudyCard caseStudy={activeCaseDetail} />
      )}

      {/* Two Column Section: SQL Editor & Dataset Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: SQL Editor (7 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <SqlEditor
              initialQuery={currentQuery}
              presets={editorPresets}
              sharedDatasetId={activeSharedId}
            />
          </Suspense>
        </div>

        {/* Right: Dataset Preview (5 Cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <DatasetPreview
            educationalDataset={dataset}
            initialCustomDataset={customDataset}
            studyCaseTables={activeCaseDetail?.tables}
            studyCaseTitle={activeCaseDetail?.title}
            sharedDatasetTables={activeSharedDetail?.tables}
            sharedDatasetTitle={activeSharedDetail?.title}
          />
        </div>
      </div>

      {/* Query Result Section (Server Component) */}
      <div className="space-y-4">
        <QueryResult result={executionResult} error={executionError} />
      </div>

      {/* Query-to-Visual Explanation Section (Server Component) */}
      {executionResult && (
        <div className="space-y-4">
          <QueryVisualization
            steps={executionResult.steps}
            query={currentQuery}
          />
        </div>
      )}

      <QueryHistory limit={5} showViewAllLink={true} />
    </div>
  );
}
