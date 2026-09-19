"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Database,
  Terminal,
  MessageSquare,
  Code2,
  CheckCircle2,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface StarterScenario {
  id: string;
  category: "Alur Eksekusi" | "Filter Data" | "Relasi JOIN" | "Aturan Agregat";
  title: string;
  question: string;
  description: string;
  badge: string;
  icon: typeof Sparkles;
  accentColor: string;
}

const STARTER_SCENARIOS: StarterScenario[] = [
  {
    id: "query-flow",
    category: "Alur Eksekusi",
    title: "Urutan Logika Eksekusi Query",
    question:
      "Jelaskan urutan logika eksekusi query SQL (Query Execution Order).",
    description:
      "Pelajari mengapa DBMS mengevaluasi FROM & JOIN terlebih dahulu sebelum klausa WHERE dan SELECT.",
    badge: "FUNDAMENTAL",
    icon: Sparkles,
    accentColor: "bg-[#FFF3A3]",
  },
  {
    id: "inner-join",
    category: "Relasi JOIN",
    title: "Mekanisme Pasangan INNER JOIN",
    question:
      "Bagaimana cara kerja INNER JOIN antara tabel students dan scores?",
    description:
      "Pahami bagaimana irisan kunci primer dan kunci asing dipasangkan dan mengapa baris tanpa pasangan diabaikan.",
    badge: "RELASIONAL",
    icon: Database,
    accentColor: "bg-[#E8F8F0]",
  },
  {
    id: "filter-missing",
    category: "Filter Data",
    title: "Mengapa Data Tertentu Hilang?",
    question: "Mengapa Citra Dewi tidak muncul pada tabel hasil akhir query?",
    description:
      "Bedah langkah eliminasi baris pada evaluasi klausa predikat WHERE dan pencegahan false assumption.",
    badge: "ANALISIS FILTER",
    icon: Lightbulb,
    accentColor: "bg-[#FFF3A3]",
  },
  {
    id: "where-vs-having",
    category: "Aturan Agregat",
    title: "Perbedaan WHERE vs HAVING",
    question: "Kapan saya harus menggunakan HAVING daripada WHERE?",
    description:
      "Ketahui aturan penempatan fungsi agregat (COUNT, AVG) dan perbedaan filter sebelum vs sesudah GROUP BY.",
    badge: "TIPS KUNCI",
    icon: AlertTriangle,
    accentColor: "bg-[#FEECEC]",
  },
];

export function AiTutorLaunchpad() {
  const router = useRouter();
  const [customQuestion, setCustomQuestion] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleLaunch = (questionText: string, optionalQuery?: string) => {
    const finalPrompt = questionText.trim()
      ? questionText.trim()
      : optionalQuery
        ? `Jelaskan alur eksekusi untuk query: ${optionalQuery.trim()}`
        : "";

    if (!finalPrompt) return;

    startTransition(() => {
      const params = new URLSearchParams();
      params.set("prompt", finalPrompt);
      if (optionalQuery?.trim()) {
        params.set("q", optionalQuery.trim());
      }
      router.push(`/dashboard/ai-tutor?${params.toString()}`);
    });
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLaunch(customQuestion, queryInput);
  };

  return (
    <div className="space-y-8">
      {/* 3-Step Visual Guide Banner */}
      <section
        className="neo-card p-6 sm:p-7 bg-white space-y-5"
        aria-labelledby="guide-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#111111] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FFD600] border-2 border-[#111111] flex items-center justify-center font-black text-sm shadow-[2px_2px_0_#111111]">
              ?
            </div>
            <div>
              <h2
                id="guide-heading"
                className="font-black text-lg sm:text-xl uppercase tracking-tight text-[#111111]"
              >
                Cara Kerja Bimbingan AI Tutor
              </h2>
              <p className="text-xs text-[#555555] font-medium">
                Pahami alur berpikir mesin database tanpa spoiler jawaban
                langsung.
              </p>
            </div>
          </div>
          <span className="neo-badge neo-badge-dark text-xs self-start sm:self-auto">
            METODE SOCRATIC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Step 1 */}
          <div className="p-4 bg-[#F7F7F2] border-2 border-[#111111] shadow-[3px_3px_0_#111111] space-y-2 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-[#111111] text-[#FFD600] px-2 py-0.5 text-[10px] font-bold mb-2">
                LANGKAH 01
              </span>
              <h3 className="font-sans font-black text-sm text-[#111111] uppercase mb-1">
                Pilih Topik / Pertanyaan
              </h3>
              <p className="font-sans text-xs text-[#555555] leading-relaxed">
                Pilih salah satu skenario masalah di bawah ini atau tulis
                kendala query yang sedang kamu hadapi.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-bold text-[#111111] flex items-center gap-1.5 border-t border-[#D5D5CF]">
              <HelpCircle size={13} />
              <span>Analisis instan</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-[#FFF3A3] border-2 border-[#111111] shadow-[3px_3px_0_#111111] space-y-2 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-[#111111] text-[#FFD600] px-2 py-0.5 text-[10px] font-bold mb-2">
                LANGKAH 02
              </span>
              <h3 className="font-sans font-black text-sm text-[#111111] uppercase mb-1">
                Bedah Logika DBMS
              </h3>
              <p className="font-sans text-xs text-[#333333] leading-relaxed font-medium">
                AI Tutor menjelaskan urutan evaluasi baris data, konsep kunci,
                dan hint tanpa memberikan kode instan jadi.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-bold text-[#111111] flex items-center gap-1.5 border-t border-[#111111]/20">
              <Sparkles size={13} />
              <span>Penalaran bertahap</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-[#E8F8F0] border-2 border-[#111111] shadow-[3px_3px_0_#111111] space-y-2 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-[#006633] text-white px-2 py-0.5 text-[10px] font-bold mb-2">
                LANGKAH 03
              </span>
              <h3 className="font-sans font-black text-sm text-[#006633] uppercase mb-1">
                Buktikan di Playground
              </h3>
              <p className="font-sans text-xs text-[#222222] leading-relaxed">
                Terapkan logika yang dipelajari langsung ke SQL Playground untuk
                melihat transformasi data tabel secara visual.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-bold text-[#006633] flex items-center gap-1.5 border-t border-[#00D084]/40">
              <Terminal size={13} />
              <span>Simulasi interaktif</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Ask Input Section (Konsultasi Bebas Luas dengan Kolom Pertanyaan & Query) */}
      <section
        className="neo-card-yellow p-6 sm:p-8 space-y-5"
        aria-labelledby="ask-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#111111] pb-3.5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 flex-wrap">
              <span className="neo-badge neo-badge-dark text-xs py-0.5 px-2">
                KONSULTASI BEBAS
              </span>
              <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 border border-[#111111]">
                Kolom Luas &bull; Pertanyaan Multi-Baris &amp; Query SQL
              </span>
            </div>
            <h2
              id="ask-heading"
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]"
            >
              Konsultasikan Masalah atau Bedah Query SQL Anda
            </h2>
            <p className="text-xs sm:text-sm text-[#111111] font-semibold">
              Gunakan kolom luas di bawah ini untuk menuliskan pertanyaan detail
              serta menempelkan query SQL yang ingin kamu analisis.
            </p>
          </div>
        </div>

        <form onSubmit={handleCustomSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Detailed Question Area (7 Cols) */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="custom-tutor-input"
                  className="font-mono text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>Pertanyaan / Kendala yang Dihadapi:</span>
                </label>
                <span className="font-mono text-[10px] text-[#444444] font-bold">
                  Bebas &amp; Multi-baris
                </span>
              </div>

              <div className="relative border-3 border-[#111111] bg-white shadow-[4px_4px_0_#111111] focus-within:shadow-[6px_6px_0_#111111] transition-all">
                <textarea
                  id="custom-tutor-input"
                  aria-label="Ketik pertanyaan SQL ke AI Tutor"
                  rows={6}
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Contoh: Mengapa fungsi COUNT(*) tidak bisa diletakkan di klausa WHERE? Lalu bagaimana urutan evaluasi jika saya ingin menyaring hasil setelah di-grouping?..."
                  className="w-full font-sans text-xs sm:text-sm bg-transparent focus:outline-none text-[#111111] p-4 leading-relaxed resize-y min-h-[140px]"
                />
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[#111111] pt-1">
                <span className="text-[11px] font-bold text-[#444444]">
                  Contoh cepat:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCustomQuestion(
                      "Mengapa Citra Dewi tidak muncul pada tabel hasil akhir query?",
                    )
                  }
                  className="bg-white hover:bg-[#FFF3A3] px-2 py-0.5 border border-[#111111] text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  &ldquo;Kenapa data Citra hilang?&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCustomQuestion(
                      "Kapan saya harus menggunakan HAVING daripada WHERE?",
                    )
                  }
                  className="bg-white hover:bg-[#FFF3A3] px-2 py-0.5 border border-[#111111] text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  &ldquo;WHERE vs HAVING?&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCustomQuestion(
                      "Jelaskan urutan logika eksekusi query SQL (Query Execution Order).",
                    )
                  }
                  className="bg-white hover:bg-[#FFF3A3] px-2 py-0.5 border border-[#111111] text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  &ldquo;Urutan evaluasi SQL?&rdquo;
                </button>
              </div>
            </div>

            {/* Right Column: SQL Query Area (5 Cols) */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="custom-sql-query-input"
                  className="font-mono text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5"
                >
                  <Code2 size={14} />
                  <span>Kueri SQL Terkait (Opsional):</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setQueryInput(
                      "SELECT students.name, scores.score\nFROM students\nJOIN scores ON students.id = scores.student_id\nWHERE scores.score >= 80;",
                    )
                  }
                  className="font-mono text-[10px] font-bold underline hover:bg-white px-1.5 py-0.5 border border-[#111111] transition-colors cursor-pointer text-[#111111] bg-[#FFF3A3]"
                >
                  + Muat Contoh Query
                </button>
              </div>

              <div className="relative border-3 border-[#111111] bg-[#111111] shadow-[4px_4px_0_#111111] focus-within:shadow-[6px_6px_0_#111111] transition-all">
                <textarea
                  id="custom-sql-query-input"
                  aria-label="Tempelkan query SQL yang ingin dianalisis"
                  rows={6}
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="-- Tempelkan (paste) query SQL kamu di sini&#10;SELECT * FROM students&#10;JOIN scores ON students.id = scores.student_id&#10;WHERE score >= 80;"
                  className="w-full font-mono text-xs text-[#FFD600] bg-transparent focus:outline-none p-4 leading-relaxed resize-y min-h-[140px] placeholder:text-[#777777]"
                  spellCheck={false}
                />
              </div>

              <p className="text-[11px] font-mono text-[#333333] leading-relaxed">
                Query yang ditempel akan otomatis dianalisis oleh AI Tutor
                bersama pertanyaan kamu.
              </p>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="pt-3 border-t-2 border-[#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-mono text-[#333333] font-medium flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D084] inline-block shrink-0" />
              <span>
                Analisis alur eksekusi logika database secara edukatif.
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {(customQuestion || queryInput) && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomQuestion("");
                    setQueryInput("");
                  }}
                  className="neo-btn neo-btn-white text-xs py-2.5 px-3.5"
                >
                  Reset
                </button>
              )}
              <button
                type="submit"
                disabled={
                  isPending || (!customQuestion.trim() && !queryInput.trim())
                }
                className="neo-btn text-xs sm:text-sm py-2.5 px-6 shadow-[3px_3px_0_#111111] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
              >
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                <span>TANYA SEKARANG &rarr;</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Starter Scenario Cards Grid */}
      <section className="space-y-4" aria-labelledby="scenarios-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-[#111111]">
          <div>
            <h2
              id="scenarios-heading"
              className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111]"
            >
              Pilih Topik Pembelajaran Populer
            </h2>
            <p className="text-xs text-[#555555] font-medium">
              Klik salah satu topik di bawah ini untuk langsung memulai sesi
              bimbingan interaktif.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#555555]">
            4 Topik Rekomendasi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {STARTER_SCENARIOS.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <article
                key={scenario.id}
                className={cn(
                  "neo-card p-5 sm:p-6 bg-white flex flex-col justify-between space-y-4 hover:shadow-[7px_7px_0_#111111] transition-all group",
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-[#F7F7F2] border border-[#111111] px-2 py-0.5 text-[#555555]">
                      {scenario.category}
                    </span>
                    <span className="neo-badge neo-badge-dark text-[10px]">
                      {scenario.badge}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 border-2 border-[#111111] flex items-center justify-center shrink-0 shadow-[2px_2px_0_#111111] mt-0.5",
                        scenario.accentColor,
                      )}
                    >
                      <Icon size={18} className="text-[#111111]" />
                    </div>
                    <div>
                      <h3 className="font-black text-base uppercase tracking-tight text-[#111111] group-hover:text-[#FFD600] transition-colors">
                        {scenario.title}
                      </h3>
                      <p className="font-mono text-xs font-bold text-[#111111] mt-1 bg-[#F7F7F2] p-2 border border-[#111111] leading-relaxed">
                        &ldquo;{scenario.question}&rdquo;
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#444444] font-medium leading-relaxed pl-12">
                    {scenario.description}
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-[#111111] flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#666666] flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-[#00D084]" />
                    <span>Socratic Guide</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLaunch(scenario.question)}
                    disabled={isPending}
                    className="neo-btn text-xs py-2 px-4 shadow-[2px_2px_0_#111111] flex items-center gap-1.5 cursor-pointer hover:bg-[#FFD600]"
                  >
                    <span>Mulai Topik Ini</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Sandbox Connection / Cross-link Box */}
      <section className="p-5 bg-[#F7F7F2] border-3 border-[#111111] shadow-[4px_4px_0_#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFD600] border-2 border-[#111111] flex items-center justify-center font-bold text-base shadow-[2px_2px_0_#111111] shrink-0">
            <Terminal size={20} />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase text-[#111111]">
              Punya Query Tertentu yang Ingin Dibedah?
            </h3>
            <p className="text-xs text-[#555555] font-medium">
              Buka SQL Playground, ketik query kamu, dan klik &ldquo;Ask AI
              Tutor&rdquo; untuk membawa query langsung ke halaman ini.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/playground"
          className="neo-btn neo-btn-white text-xs py-2.5 px-4 shrink-0 flex items-center justify-center gap-2"
        >
          <span>BUKA SQL PLAYGROUND</span>
          <ArrowRight size={13} />
        </Link>
      </section>
    </div>
  );
}
