"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Code2,
  Send,
  Loader2,
  HelpCircle,
  Compass,
} from "lucide-react";
import type { AiTutorResponse } from "@/lib/api/contracts/ai-tutor";

export interface AiResponseCardProps {
  prompt: string;
  response?: AiTutorResponse;
  error?: string;
  queryContext?: string;
}

export function AiResponseCard({
  prompt,
  response,
  error,
  queryContext,
}: AiResponseCardProps) {
  const router = useRouter();
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleFollowUpSubmit = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText !== undefined ? customText : followUpQuestion;
    if (!textToSend.trim()) return;

    startTransition(() => {
      const params = new URLSearchParams();
      params.set("prompt", textToSend.trim());
      if (queryContext) {
        params.set("q", queryContext);
      }
      router.push(`/dashboard/ai-tutor?${params.toString()}`);
    });
  };

  if (error || !response) {
    return (
      <div className="border-3 border-[#111111] bg-white shadow-[5px_5px_0_#111111] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 border-b-2 border-[#111111] pb-4 bg-red-50 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-4 sm:p-6">
          <div className="w-9 h-9 bg-[#FF5A5F] text-white border-2 border-[#111111] flex items-center justify-center font-bold shadow-[2px_2px_0_#111111]">
            !
          </div>
          <div>
            <h3 className="font-black text-base uppercase text-[#111111]">
              AI Tutor Belum Dapat Menjawab
            </h3>
            <p className="text-xs text-[#555555]">
              Koneksi layanan AI sedang mengalami kendala.
            </p>
          </div>
        </div>
        <p
          role="alert"
          className="font-mono text-xs text-[#FF5A5F] bg-white p-3 border-2 border-[#FF5A5F] shadow-[2px_2px_0_#FF5A5F]"
        >
          {error ?? "Belum ada respons yang dapat dimuat."}
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/ai-tutor"
            className="neo-btn neo-btn-white text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={13} />
            <span>Kembali ke Pilihan Topik</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Quick Orientation Guide Banner */}
      <div className="p-3.5 bg-[#FFF3A3] border-3 border-[#111111] shadow-[3px_3px_0_#111111] flex items-center gap-2.5 text-xs font-mono">
        <Compass size={18} className="text-[#111111] shrink-0" />
        <p className="text-[#111111] font-bold leading-relaxed">
          <span className="uppercase font-black mr-1">PANDUAN MEMBACA:</span>
          Ikuti urutan <strong>Langkah 1 s.d. 3</strong> di bawah ini untuk
          memahami alur logika, lalu pilih aksi selanjutnya pada kotak kuning di
          bagian akhir.
        </p>
      </div>

      {/* 2. Top Context Card: Question & Attached Query */}
      <section
        className="neo-card p-5 sm:p-6 bg-[#111111] text-white shadow-[5px_5px_0_#FFD600] space-y-4"
        aria-label="Pertanyaan yang Dianalisis"
      >
        <div className="flex items-center justify-between border-b border-white/20 pb-2.5 font-mono text-[11px] text-[#FFD600]">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle size={14} />
            <span>Pertanyaan yang Sedang Dibahas:</span>
          </span>
          <span className="bg-white/10 px-2 py-0.5 border border-white/20 text-white">
            SESI AKTIF
          </span>
        </div>

        <h2 className="font-sans text-base sm:text-lg lg:text-xl font-bold leading-snug text-white">
          &ldquo;{prompt}&rdquo;
        </h2>

        {/* Optional SQL Query context preview */}
        {queryContext && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#AAAAAA]">
              <span className="flex items-center gap-1">
                <Code2 size={13} />
                <span>Kueri SQL Terkait:</span>
              </span>
              <Link
                href={`/dashboard/playground?q=${encodeURIComponent(queryContext)}`}
                className="text-[#FFD600] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Buka di Playground</span>
                <ArrowRight size={11} />
              </Link>
            </div>
            <div className="bg-[#1A1A1A] border border-white/30 p-3 text-[#FFD600] font-mono text-xs overflow-x-auto leading-relaxed">
              <code>{queryContext}</code>
            </div>
          </div>
        )}
      </section>

      {/* 3. Main Educational Breakdown Card */}
      <section
        className="neo-card p-6 sm:p-8 bg-white space-y-6"
        aria-label="Hasil Analisis AI Tutor"
      >
        {/* Step 1: Core Direct Answer */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#00D084] border-2 border-[#111111] flex items-center justify-center font-mono font-black text-xs shadow-[1px_1px_0_#111111]">
              1
            </span>
            <h3 className="font-black text-base uppercase tracking-tight text-[#111111] flex items-center gap-1.5">
              <Sparkles size={16} className="text-[#FFD600] fill-[#FFD600]" />
              <span>Jawaban &amp; Penjelasan Inti</span>
            </h3>
            <span className="text-[10px] font-mono font-bold bg-[#E8F8F0] text-[#006633] px-2 py-0.5 border border-[#00D084] hidden sm:inline-block ml-auto">
              BACA INI TERLEBIH DAHULU
            </span>
          </div>

          <div className="bg-[#F7F7F2] p-4 sm:p-5 border-2 border-[#111111] shadow-[3px_3px_0_#111111] leading-relaxed text-xs sm:text-sm font-medium text-[#111111]">
            {response.explanation}
          </div>
        </div>

        {/* Step 2: Step-by-Step Database Processing Flow */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#FFD600] border-2 border-[#111111] flex items-center justify-center font-mono font-black text-xs shadow-[1px_1px_0_#111111]">
              2
            </span>
            <h3 className="font-black text-base uppercase tracking-tight text-[#111111]">
              Alur Kerja Database (Urutan Eksekusi Mesin DBMS)
            </h3>
            <span className="text-[10px] font-mono font-bold bg-[#FFF3A3] text-[#111111] px-2 py-0.5 border border-[#111111] hidden sm:inline-block ml-auto">
              TAHAPAN LOGIKA
            </span>
          </div>

          <p className="text-xs text-[#555555]">
            Database memproses query kamu secara bertahap. Berikut alur jalannya
            data dari awal hingga selesai:
          </p>

          <div className="space-y-2.5">
            {response.reasoning.map((step, idx) => (
              <div
                key={step}
                className="flex items-start gap-3 p-3.5 bg-white border-2 border-[#111111] shadow-[2px_2px_0_#111111] hover:bg-[#FFF3A3]/20 transition-colors"
              >
                <div className="w-6 h-6 bg-[#111111] text-[#FFD600] flex items-center justify-center font-mono font-black text-[11px] shrink-0 mt-0.5 shadow-[1px_1px_0_#FFD600]">
                  {idx + 1}
                </div>
                <div className="space-y-0.5 flex-1">
                  <span className="text-[10px] font-mono font-black uppercase text-[#666666] tracking-wider block">
                    Tahap 0{idx + 1}
                  </span>
                  <p className="font-mono text-xs sm:text-sm font-bold text-[#111111] leading-relaxed">
                    {step}
                  </p>
                </div>
                <CheckCircle2
                  size={16}
                  className="text-[#00D084] shrink-0 mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Key Concept & Pedagogical Takeaways */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#111111] text-white border-2 border-[#111111] flex items-center justify-center font-mono font-black text-xs shadow-[1px_1px_0_#111111]">
              3
            </span>
            <h3 className="font-black text-base uppercase tracking-tight text-[#111111]">
              Dua Hal Penting untuk Diingat
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SQL Concept */}
            <div className="p-4 bg-[#FFF3A3] border-2 border-[#111111] shadow-[3px_3px_0_#111111] space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wide text-[#111111] mb-1">
                  <Lightbulb size={15} className="text-[#111111]" />
                  <span>Konsep Kunci SQL:</span>
                </div>
                <p className="font-mono text-xs sm:text-sm text-[#111111] font-bold leading-relaxed bg-white p-2.5 border-2 border-[#111111]">
                  {response.sqlConcept}
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#555555]">
                &bull; Prinsip dasar basis data relasional
              </span>
            </div>

            {/* Pedagogical Hint */}
            <div className="p-4 bg-[#E8F8F0] border-2 border-[#111111] shadow-[3px_3px_0_#111111] space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wide text-[#006633] mb-1">
                  <Sparkles size={15} className="text-[#006633]" />
                  <span>Petunjuk Pembelajaran:</span>
                </div>
                <p className="font-mono text-xs sm:text-sm text-[#006633] font-medium leading-relaxed bg-white p-2.5 border-2 border-[#00D084]">
                  {response.hint}
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#006633]">
                &bull; Tips untuk menghindari kesalahan logika
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Action Center: "Apa yang Harus Kamu Lakukan Sekarang?" */}
      <section
        className="neo-card-yellow p-6 sm:p-8 space-y-6"
        aria-labelledby="action-center-heading"
      >
        <div className="border-b-2 border-[#111111] pb-3 space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-badge neo-badge-dark text-xs py-0.5 px-2">
              LANGKAH SELANJUTNYA
            </span>
            <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 border border-[#111111]">
              Pilih Aksi Kamu
            </span>
          </div>
          <h3
            id="action-center-heading"
            className="text-xl sm:text-2xl font-black uppercase text-[#111111] tracking-tight"
          >
            Apa yang Ingin Kamu Lakukan Sekarang?
          </h3>
          <p className="text-xs sm:text-sm text-[#111111] font-semibold">
            Pilih salah satu dari 2 opsi di bawah ini untuk melanjutkan
            pembelajaran kamu:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Option A: Practice in Playground */}
          <div className="bg-white border-3 border-[#111111] p-5 shadow-[4px_4px_0_#111111] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FFD600] border-2 border-[#111111] flex items-center justify-center font-mono font-black text-xs">
                  A
                </span>
                <h4 className="font-black text-sm uppercase text-[#111111]">
                  Uji Coba Langsung di SQL Playground
                </h4>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed font-medium">
                Buktikan penjelasan di atas secara visual. Jalankan query ini di
                lab playground untuk melihat transformasi data dari tabel sumber
                ke hasil akhir.
              </p>
            </div>

            <Link
              href={`/dashboard/playground?q=${encodeURIComponent(queryContext || "")}`}
              className="neo-btn text-xs py-3 px-4 shadow-[2px_2px_0_#111111] flex items-center justify-center gap-2 hover:bg-[#FFD600]"
            >
              <Terminal size={15} />
              <span>BUKA DI SQL PLAYGROUND &rarr;</span>
            </Link>
          </div>

          {/* Option B: Back to Topics */}
          <div className="bg-white border-3 border-[#111111] p-5 shadow-[4px_4px_0_#111111] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#E8F8F0] border-2 border-[#111111] flex items-center justify-center font-mono font-black text-xs text-[#006633]">
                  B
                </span>
                <h4 className="font-black text-sm uppercase text-[#111111]">
                  Pilih Topik Baru / Kasus Lain
                </h4>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed font-medium">
                Ingin mempelajari konsep lain seperti WHERE vs HAVING, urutan
                eksekusi, atau mencari tahu mengapa baris data tertentu
                dieliminasi?
              </p>
            </div>

            <Link
              href="/dashboard/ai-tutor"
              className="neo-btn neo-btn-white text-xs py-3 px-4 shadow-[2px_2px_0_#111111] flex items-center justify-center gap-2"
            >
              <ArrowLeft size={15} />
              <span>KEMBALI KE PILIHAN TOPIK</span>
            </Link>
          </div>
        </div>

        {/* Option C: Follow-up Question Input Form */}
        <div className="bg-white border-3 border-[#111111] p-5 sm:p-6 shadow-[4px_4px_0_#111111] space-y-3">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2">
            <h4 className="font-black text-sm uppercase text-[#111111] flex items-center gap-2">
              <HelpCircle size={16} />
              <span>
                Masih Ada yang Belum Jelas? Tanyakan Pertanyaan Lanjutan
              </span>
            </h4>
            <span className="text-[10px] font-mono font-bold bg-[#F7F7F2] border border-[#111111] px-2 py-0.5">
              RESPONS CEPAT
            </span>
          </div>

          <form onSubmit={(e) => handleFollowUpSubmit(e)} className="space-y-3">
            <textarea
              rows={3}
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              placeholder="Contoh: Bisakah kamu jelaskan tahap 2 lebih detail? Atau bagaimana jika kondisinya saya ganti menjadi score > 85?..."
              className="w-full p-3.5 font-sans text-xs sm:text-sm border-2 border-[#111111] bg-[#F7F7F2] focus:bg-white focus:outline-none leading-relaxed resize-y min-h-[85px] shadow-[2px_2px_0_#111111]"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                <span className="text-[11px] font-bold text-[#555555]">
                  Saran cepat:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleFollowUpSubmit(
                      undefined,
                      "Bisa jelaskan lebih detail bagaimana klausa WHERE menyaring data pada contoh ini?",
                    )
                  }
                  className="bg-[#F7F7F2] hover:bg-[#FFF3A3] px-2 py-1 border border-[#111111] text-[11px] transition-colors cursor-pointer"
                >
                  &ldquo;Detailkan tahap WHERE&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleFollowUpSubmit(
                      undefined,
                      "Bagaimana jika query diganti menggunakan LEFT JOIN?",
                    )
                  }
                  className="bg-[#F7F7F2] hover:bg-[#FFF3A3] px-2 py-1 border border-[#111111] text-[11px] transition-colors cursor-pointer"
                >
                  &ldquo;Jika pakai LEFT JOIN?&rdquo;
                </button>
              </div>

              <button
                type="submit"
                disabled={isPending || !followUpQuestion.trim()}
                className="neo-btn text-xs py-2 px-4 shadow-[2px_2px_0_#111111] flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFD600]"
              >
                {isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Send size={13} />
                )}
                <span>KIRIM PERTANYAAN LANJUTAN &rarr;</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
