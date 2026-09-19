import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Play, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QueryHistory } from "@/components/playground/query-history";

export const metadata: Metadata = {
  title: "Query History",
  description:
    "Riwayat eksekusi query dan analisis keberhasilan eksplorasi database SQLens.",
};

export default function QueryHistoryPage() {
  return (
    <div className="space-y-6">
      {/* 1. Page Header matching reference query-history.html */}
      <header className="neo-card p-6 sm:p-8 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <Badge variant="yellow">LEARNING ACTIVITY</Badge>
            <span className="font-mono text-xs text-[#666666]">
              Sesi Pembelajaran Aktif
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]">
            QUERY HISTORY
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-semibold max-w-2xl leading-relaxed">
            Lihat kembali aktivitas query kamu, temukan query yang perlu
            diperbaiki, dan lanjutkan belajar dari percobaan sebelumnya.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/dashboard/playground"
            className="neo-btn text-xs sm:text-sm py-3 px-6 shadow-[4px_4px_0_#111111] flex items-center gap-2"
          >
            <Play size={14} className="fill-current" />
            <span>OPEN SQL PLAYGROUND</span>
          </Link>
        </div>
      </header>

      {/* 2. History Summary Metric Cards matching reference query-history.html */}
      <section
        aria-label="History Summary Cards"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Queries */}
        <article className="neo-card p-5 bg-white flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#666666] block mb-2">
              TOTAL QUERIES
            </span>
            <p className="font-mono text-3xl sm:text-4xl font-black text-[#111111]">
              Live
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#111111] text-xs font-medium text-[#555555]">
            query tersimpan dalam learning history
          </div>
        </article>

        {/* Success */}
        <article className="neo-card p-5 bg-[#E8F8F0] border-3 border-[#111111] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111]">
                SUCCESS
              </span>
              <span className="w-6 h-6 bg-[#00D084] border-2 border-[#111111] flex items-center justify-center font-bold text-xs">
                <CheckCircle2
                  size={14}
                  strokeWidth={3}
                  className="text-[#111111]"
                />
              </span>
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-black text-[#111111]">
              100%
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#111111] text-xs font-semibold text-[#111111]">
            eksekusi query berjalan optimal
          </div>
        </article>

        {/* Needs Review */}
        <article className="neo-card p-5 bg-[#FFF3A3] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111]">
                NEEDS REVIEW
              </span>
              <span className="w-6 h-6 bg-[#FFD600] border-2 border-[#111111] flex items-center justify-center font-bold text-xs">
                <HelpCircle
                  size={14}
                  strokeWidth={2.5}
                  className="text-[#111111]"
                />
              </span>
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-black text-[#111111]">
              Socratic
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#111111] text-xs font-semibold text-[#111111]">
            bimbingan logika via AI Tutor
          </div>
        </article>

        {/* Errors */}
        <article className="neo-card p-5 bg-[#FDE8E8] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF5A5F]">
                ISOLATED
              </span>
              <span className="w-6 h-6 bg-[#FF5A5F] text-white border-2 border-[#111111] flex items-center justify-center font-bold text-xs">
                <AlertTriangle size={14} strokeWidth={2.5} />
              </span>
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-black text-[#FF5A5F]">
              Safe
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#111111] text-xs font-semibold text-[#FF5A5F]">
            read-only sandbox simulation
          </div>
        </article>
      </section>

      {/* 3. Query History List */}
      <QueryHistory />
    </div>
  );
}
