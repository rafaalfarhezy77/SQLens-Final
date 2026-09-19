"use client";

import { useState } from "react";

type Stage = "FROM" | "WHERE" | "RESULT";

interface RowData {
  id: number;
  name: string;
  score: number;
  status?: "kept" | "filtered";
}

const DATA_INITIAL: RowData[] = [
  { id: 1, name: "Andi", score: 90 },
  { id: 2, name: "Budi", score: 85 },
  { id: 3, name: "Citra", score: 70 },
];

export function InteractiveSimulator() {
  const [activeStage, setActiveStage] = useState<Stage>("FROM");

  const stageConfig = {
    FROM: {
      badge: "STAGE 1 / 3 : SOURCE TABLE",
      explanation: "FROM menentukan dataset awal yang akan diproses.",
      code: "FROM students",
    },
    WHERE: {
      badge: "STAGE 2 / 3 : ROW FILTERING",
      explanation:
        "WHERE mengevaluasi predikat (score >= 80). Baris Citra terfilter karena score < 80.",
      code: "WHERE score >= 80",
    },
    RESULT: {
      badge: "STAGE 3 / 3 : PROJECTION RESULT",
      explanation:
        "SELECT memproyeksikan kolom akhir (name, score) dari baris yang lolos filter.",
      code: "SELECT name, score",
    },
  }[activeStage];

  return (
    <div className="neo-card p-6 sm:p-8 bg-white">
      {/* Stage Selector Buttons (Tabs) */}
      <div
        className="flex flex-wrap items-center gap-3 pb-6 border-b-2 border-[#111111]"
        role="tablist"
        aria-label="Tahapan Eksekusi Query"
      >
        <span className="font-mono text-xs font-black uppercase mr-2 text-[#777777]">
          Stages:
        </span>

        {(["FROM", "WHERE", "RESULT"] as Stage[]).map((stage, idx) => (
          <button
            key={stage}
            type="button"
            role="tab"
            onClick={() => setActiveStage(stage)}
            className={`neo-btn-tab ${activeStage === stage ? "is-active" : ""}`}
            aria-selected={activeStage === stage}
          >
            {idx + 1}. {stage}
          </button>
        ))}
      </div>

      {/* Active Stage Info Banner */}
      <div className="my-6 p-4 sm:p-5 bg-[#FFF3A3] border-2 border-[#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="neo-badge neo-badge-dark text-[10px]">
            {stageConfig.badge}
          </span>
          <p
            className="font-semibold text-sm sm:text-base text-[#111111] pt-1"
            aria-live="polite"
          >
            {stageConfig.explanation}
          </p>
        </div>

        <div className="bg-[#111111] text-[#FFD600] px-3.5 py-2 border-2 border-[#111111] font-mono text-xs font-bold shrink-0">
          <span className="text-[#AAAAAA] mr-1">$</span>
          <code>{stageConfig.code}</code>
        </div>
      </div>

      {/* Dynamic Interactive Table */}
      <div className="overflow-x-auto border-3 border-[#111111] shadow-[4px_4px_0_#111111]">
        <table
          className="w-full text-left border-collapse font-mono"
          aria-label="Tabel Simulasi Data Mahasiswa"
        >
          <thead>
            {activeStage === "RESULT" ? (
              <tr>
                <th
                  scope="col"
                  className="py-2.5 px-3 sm:px-4 text-left font-mono font-bold text-xs uppercase tracking-wider border-b-2 border-r-2 border-[#111111] bg-[#FFF3A3] text-[#111111]"
                >
                  name
                </th>
                <th
                  scope="col"
                  className="py-2.5 px-3 sm:px-4 text-left font-mono font-bold text-xs uppercase tracking-wider border-b-2 border-[#111111] bg-[#FFF3A3] text-[#111111]"
                >
                  score
                </th>
              </tr>
            ) : (
              <tr>
                <th
                  scope="col"
                  className="py-2.5 px-3 sm:px-4 text-left font-mono font-bold text-xs uppercase tracking-wider border-b-2 border-r-2 border-[#111111] bg-[#FFF3A3] text-[#111111]"
                >
                  id
                </th>
                <th
                  scope="col"
                  className="py-2.5 px-3 sm:px-4 text-left font-mono font-bold text-xs uppercase tracking-wider border-b-2 border-r-2 border-[#111111] bg-[#FFF3A3] text-[#111111]"
                >
                  name
                </th>
                <th
                  scope="col"
                  className="py-2.5 px-3 sm:px-4 text-left font-mono font-bold text-xs uppercase tracking-wider border-b-2 border-r-2 border-[#111111] bg-[#FFF3A3] text-[#111111]"
                >
                  score
                </th>
                {activeStage === "WHERE" && (
                  <th
                    scope="col"
                    className="py-2.5 px-3 sm:px-4 text-left font-mono font-bold text-xs uppercase tracking-wider border-b-2 border-[#111111] bg-[#FFF3A3] text-[#111111]"
                  >
                    status
                  </th>
                )}
              </tr>
            )}
          </thead>
          <tbody className="divide-y-2 divide-[#111111] bg-white">
            {activeStage === "RESULT" ? (
              <>
                <tr className="border-b-2 border-[#111111]">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-sm border-r-2 border-[#111111]">
                    Andi
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 font-mono font-bold text-sm">
                    90
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-sm border-r-2 border-[#111111]">
                    Budi
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 font-mono font-bold text-sm">
                    85
                  </td>
                </tr>
              </>
            ) : (
              DATA_INITIAL.map((row) => {
                const isFiltered = activeStage === "WHERE" && row.score < 80;
                return (
                  <tr
                    key={row.id}
                    className={`border-b-2 border-[#111111] last:border-b-0 ${
                      isFiltered ? "bg-red-50/70 text-black/50" : ""
                    }`}
                  >
                    <td className="py-2.5 px-3 sm:px-4 font-mono font-bold text-sm border-r-2 border-[#111111]">
                      {row.id}
                    </td>
                    <td
                      className={`py-2.5 px-3 sm:px-4 font-bold text-sm border-r-2 border-[#111111] ${isFiltered ? "line-through" : ""}`}
                    >
                      {row.name}
                    </td>
                    <td
                      className={`py-2.5 px-3 sm:px-4 font-mono font-bold text-sm ${activeStage === "WHERE" ? "border-r-2 border-[#111111]" : ""}`}
                    >
                      {row.score}
                    </td>
                    {activeStage === "WHERE" && (
                      <td className="py-2 px-3 sm:px-4">
                        {isFiltered ? (
                          <span className="neo-badge neo-badge-red text-[10px]">
                            FILTERED OUT
                          </span>
                        ) : (
                          <span className="neo-badge neo-badge-green text-[10px]">
                            KEPT (PASS)
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Micro-Explainer */}
      <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#666666]">
        <span>
          Tip: Klik tab 1. FROM, 2. WHERE, dan 3. RESULT untuk melihat
          transformasi data.
        </span>
        <span className="font-bold text-[#111111]">Live Simulation</span>
      </div>
    </div>
  );
}
