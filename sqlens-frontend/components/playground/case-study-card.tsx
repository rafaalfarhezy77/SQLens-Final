"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Table2,
  Code2,
  CheckCircle2,
} from "lucide-react";
import type { StudyCaseDetail } from "@/lib/api/contracts/study-cases";

interface CaseStudyCardProps {
  caseStudy: StudyCaseDetail;
  onSelectQuery?: (query: string) => void;
}

export function CaseStudyCard({ caseStudy, onSelectQuery }: CaseStudyCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showChallenges, setShowChallenges] = useState(true);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  const handleApplyQuery = (sql: string) => {
    if (onSelectQuery) {
      onSelectQuery(sql);
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", sql);
    router.push(`/dashboard/playground?${params.toString()}`);
  };

  return (
    <div className="border-3 border-[#111111] bg-white p-5 sm:p-6 shadow-[5px_5px_0_#111111] space-y-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#111111] pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="neo-badge neo-badge-yellow text-xs px-2 py-0.5">
              STUDI KASUS AKTIF
            </span>
            <span className="text-xs font-mono font-bold bg-[#F7F7F2] border border-[#111111] px-2 py-0.5">
              {caseStudy.category}
            </span>
            <span className="text-xs font-mono font-bold bg-[#D4F4DD] border border-[#111111] px-2 py-0.5 text-[#006633]">
              Tingkat: {caseStudy.difficulty}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#111111] tracking-tight">
            {caseStudy.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#666666]">
            Tabel terkait:
          </span>
          <div className="flex flex-wrap gap-1">
            {caseStudy.tableNames.map((tbl) => (
              <span
                key={tbl}
                className="inline-flex items-center gap-1 font-mono text-xs font-bold bg-[#FFF3A3] px-2 py-0.5 border border-[#111111]"
              >
                <Table2 className="w-3 h-3" />
                {tbl}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm font-medium text-[#444444] leading-relaxed">
        {caseStudy.description}
      </p>

      {/* Challenges Section */}
      {caseStudy.challenges.length > 0 && (
        <div className="border-2 border-[#111111] bg-[#F7F7F2] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#111111]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
                SOAL TANTANGAN & LATIHAN SQL ({caseStudy.challenges.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowChallenges((prev) => !prev)}
              className="text-xs font-bold underline flex items-center gap-1 text-[#111111]"
            >
              {showChallenges ? (
                <>
                  <span>Sembunyikan</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Tampilkan Soal</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {showChallenges && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {caseStudy.challenges.map((c) => {
                const isHintVisible = activeHintId === c.id;
                return (
                  <div
                    key={c.id}
                    className="border-2 border-[#111111] bg-white p-3.5 space-y-2 shadow-[2px_2px_0_#111111]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-[#111111]">
                        {c.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#FFF3A3] border border-[#111111]">
                        {c.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-[#555555]">{c.description}</p>

                    {isHintVisible && (
                      <div className="text-[11px] p-2 bg-[#FFFDE7] border border-[#111111] text-[#666600] font-mono flex items-start gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{c.hint}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveHintId((prev) => (prev === c.id ? null : c.id))
                        }
                        className="text-[11px] font-bold underline text-[#666666] hover:text-[#111111]"
                      >
                        {isHintVisible ? "Tutup Petunjuk" : "Lihat Petunjuk"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyQuery(c.starterQuery)}
                        className="neo-btn text-[11px] py-1 px-2.5 flex items-center gap-1.5"
                      >
                        <Code2 className="w-3 h-3" />
                        <span>Kerjakan Soal</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sample Queries Quick Launcher */}
      {caseStudy.sampleQueries.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-xs font-black uppercase text-[#111111] tracking-wider block">
            CONTOH QUERY CEPAT:
          </span>
          <div className="flex flex-wrap gap-2">
            {caseStudy.sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyQuery(sq.query)}
                className="text-xs font-mono font-bold bg-[#F7F7F2] hover:bg-[#FFF3A3] border border-[#111111] px-2.5 py-1 transition-colors flex items-center gap-1.5 shadow-[1px_1px_0_#111111] active:translate-x-[1px] active:translate-y-[1px]"
                title={sq.explanation}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00A854]" />
                <span>{sq.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
