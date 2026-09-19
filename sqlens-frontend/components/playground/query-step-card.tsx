"use client";
import { ArrowRight, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { QueryStep } from "@/lib/playground/query-steps";
import { cn } from "@/lib/utils/cn";
import { usePlaygroundUiStore } from "@/lib/stores/playground-ui-store";

export interface QueryStepCardProps {
  step: QueryStep;
}

export function QueryStepCard({ step }: QueryStepCardProps) {
  const activeStepId = usePlaygroundUiStore(
    (state) => state.activeVisualizationStepId,
  );
  const isActive = activeStepId === step.stepNumber;
  const rowDiff = step.rowsAfterCount - step.rowsBeforeCount;

  return (
    <div
      aria-current={isActive ? "step" : undefined}
      className={cn(
        "border-2 border-[#111111] bg-white shadow-[4px_4px_0px_0px_#111111] space-y-4 transition-all duration-150",
        isActive
          ? "ring-2 ring-[#111111] ring-offset-2 bg-yellow-50/30 shadow-[6px_6px_0px_0px_#111111]"
          : "hover:shadow-[5px_5px_0px_0px_#111111]",
      )}
    >
      {/* Step Header */}
      <div className="p-3.5 sm:p-4 bg-[#F7F7F2] border-b-2 border-[#111111] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <Badge variant={isActive ? "yellow" : "soft-yellow"}>
            {step.badge}
          </Badge>
          <h4 className="font-black text-sm uppercase tracking-tight text-[#111111]">
            {step.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
          <span className="text-black/60 font-bold">Baris Data:</span>
          <span className="px-2 py-0.5 bg-white border border-[#111111] font-bold shadow-[1px_1px_0px_0px_#111111]">
            {step.rowsBeforeCount}
          </span>
          <ArrowRight size={12} className="text-black/60" />
          <span className="px-2 py-0.5 bg-[#FFD600] border border-[#111111] font-black shadow-[1px_1px_0px_0px_#111111]">
            {step.rowsAfterCount}
          </span>
          {rowDiff !== 0 && (
            <span
              className={cn(
                "px-1.5 py-0.5 text-[10px] font-bold border",
                rowDiff < 0
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "bg-green-100 text-green-700 border-green-300",
              )}
            >
              {rowDiff > 0 ? `+${rowDiff}` : `${rowDiff}`}
            </span>
          )}
        </div>
      </div>

      {/* SQL Clause & Explanation */}
      <div className="px-4 sm:px-5 space-y-2.5">
        <div className="p-3 bg-[#111111] border-2 border-[#111111] font-mono text-xs font-bold text-[#FFD600] shadow-[2px_2px_0px_0px_#111111] flex items-center gap-2">
          <span className="text-[#FFD600]/60 select-none">&gt;</span>
          <span className="tracking-wide">{step.clause}</span>
        </div>
        <p className="text-xs font-medium text-black/80 leading-relaxed bg-[#F7F7F2]/60 p-2.5 border border-[#111111]/20">
          {step.description}{" "}
          <strong className="text-[#111111] font-bold">
            {step.explanation}
          </strong>
        </p>
      </div>

      {/* Row-by-Row Evaluations Table */}
      <div className="px-4 sm:px-5 pb-4">
        <div className="border-2 border-[#111111] overflow-x-auto shadow-[2px_2px_0px_0px_#111111]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#FFF3A3] border-b-2 border-[#111111] select-none">
              <tr>
                <th className="p-2.5 border-r border-[#111111] text-black/80 font-black uppercase text-[11px] w-5/12">
                  Data Baris
                </th>
                <th className="p-2.5 border-r border-[#111111] text-center w-28 font-black uppercase text-[11px]">
                  Status
                </th>
                <th className="p-2.5 text-black/80 font-black uppercase text-[11px]">
                  Alasan Evaluasi Engine
                </th>
              </tr>
            </thead>
            <tbody>
              {step.rowEvaluations.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#111111]/20 last:border-0 hover:bg-[#F7F7F2] transition-colors"
                >
                  {/* Data details formatted as clean tags */}
                  <td className="p-2.5 border-r border-[#111111]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {Object.entries(item.data).map(([k, v]) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1 text-[11px] bg-white px-1.5 py-0.5 border border-[#111111]/30 shadow-[1px_1px_0px_0px_#111111]/20"
                        >
                          <span className="font-bold text-black/60">{k}:</span>
                          <span className="font-medium text-[#111111]">
                            {String(v)}
                          </span>
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status pill */}
                  <td className="p-2.5 border-r border-[#111111] text-center whitespace-nowrap">
                    {item.status === "keep" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-[#22c55e] text-white border border-[#111111] shadow-[1px_1px_0px_0px_#111111]">
                        <Check size={11} strokeWidth={3} /> KEEP
                      </span>
                    ) : item.status === "filtered" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-[#ef4444] text-white border border-[#111111] shadow-[1px_1px_0px_0px_#111111]">
                        <X size={11} strokeWidth={3} /> FILTERED
                      </span>
                    ) : item.status === "joined" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase bg-[#FFD600] text-[#111111] border border-[#111111] shadow-[1px_1px_0px_0px_#111111]">
                        MATCHED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-[#F7F7F2] text-[#111111] border border-[#111111] shadow-[1px_1px_0px_0px_#111111]">
                        SOURCE
                      </span>
                    )}
                  </td>

                  {/* Engine explanation */}
                  <td className="p-2.5 text-black/80 text-[11px] font-medium leading-snug">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
