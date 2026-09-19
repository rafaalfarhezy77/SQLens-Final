import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AiResponseCard } from "@/components/ai-tutor/ai-response-card";
import { AiTutorLaunchpad } from "@/components/ai-tutor/ai-tutor-launchpad";
import { askAiTutor } from "@/lib/api/server/ai-tutor";
import { getAiResponseForPrompt } from "@/lib/data/ai-tutor";

export const metadata: Metadata = {
  title: "AI Query Tutor",
  description:
    "Asisten penalaran query SQLens untuk membimbing pemahaman alur eksekusi database.",
};

export default async function AiTutorPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const promptText = resolvedParams.prompt;
  const queryContext =
    resolvedParams.q ||
    "SELECT students.name, scores.score\nFROM students\nJOIN scores ON students.id = scores.student_id\nWHERE scores.score >= 80;";

  // Zero-state onboarding when user opens AI Tutor for the first time without a prompt
  if (!promptText) {
    return (
      <div className="space-y-6">
        {/* Top Header Bar matching reference ai-tutor.html */}
        <section
          className="neo-card p-5 sm:p-6 bg-[#F7F7F2] flex flex-col md:flex-row md:items-center justify-between gap-4"
          aria-label="AI Tutor Header"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFD600] border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center font-mono font-black text-sm shrink-0">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-[#111111]">
                  SQLens AI Tutor
                </h1>
                <span
                  id="tutor-status-badge"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold bg-[#E8F8F0] text-[#006633] border border-[#00D084] px-2 py-0.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse" />
                  <span>ONLINE</span>
                </span>
                <Badge variant="yellow">Socratic Pedagogy</Badge>
              </div>
              <p className="text-xs text-[#555555] font-semibold mt-0.5">
                Tutor interaktif untuk membimbing pemahaman alur eksekusi
                database tanpa spoiler jawaban langsung.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard/playground"
              className="neo-btn neo-btn-white text-xs py-2 px-3.5 shadow-[2px_2px_0_#111111] flex items-center gap-1.5"
            >
              <span>Buka SQL Playground</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* Guided Launchpad for first-time / unprompted access */}
        <AiTutorLaunchpad />
      </div>
    );
  }

  // Active Consultation State
  let aiResult = await askAiTutor(promptText);
  if (!aiResult.response) {
    // Fallback to rich offline pedagogical scenario if API key not present
    const fallbackScenario = await getAiResponseForPrompt(promptText);
    aiResult = {
      response: {
        explanation: fallbackScenario.answer,
        sqlConcept: fallbackScenario.sqlConcept,
        hint: "Eksplorasi klausa terkait di SQL Playground untuk membuktikan efeknya pada baris data secara visual.",
        reasoning: fallbackScenario.reasoning,
      },
    };
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Active Consultation Header Bar */}
      <section
        className="neo-card p-5 sm:p-6 bg-[#F7F7F2] flex flex-col md:flex-row md:items-center justify-between gap-4"
        aria-label="AI Tutor Header"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/ai-tutor"
            className="w-10 h-10 bg-white hover:bg-[#FFD600] border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center font-bold text-sm shrink-0 transition-colors"
            title="Kembali ke Beranda AI Tutor"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-[#111111]">
                Sesi Bimbingan AI Tutor
              </h1>
              <span
                id="tutor-status-badge"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold bg-[#E8F8F0] text-[#006633] border border-[#00D084] px-2 py-0.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse" />
                <span>SESI AKTIF</span>
              </span>
              <Badge variant="yellow">Metode Socratic</Badge>
            </div>
            <p className="text-xs text-[#555555] font-semibold mt-0.5">
              Penjelasan terstruktur alur eksekusi database tanpa spoiler kode
              instan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard/ai-tutor"
            className="neo-btn neo-btn-white text-xs py-2 px-3.5 shadow-[2px_2px_0_#111111] flex items-center gap-1.5"
          >
            <ArrowLeft size={13} />
            <span>Pilih Topik Lain</span>
          </Link>
          <Link
            href={`/dashboard/playground?q=${encodeURIComponent(queryContext)}`}
            className="neo-btn text-xs py-2 px-3.5 shadow-[2px_2px_0_#111111] flex items-center gap-1.5 hover:bg-[#FFD600]"
          >
            <span>Buka di Playground</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* Main Educational Reading & Action Experience */}
      <main id="tutor-consultation-main" aria-label="Hasil Bimbingan AI Tutor">
        <AiResponseCard
          prompt={promptText}
          queryContext={queryContext}
          response={aiResult.response}
          error={aiResult.error}
        />
      </main>
    </div>
  );
}
