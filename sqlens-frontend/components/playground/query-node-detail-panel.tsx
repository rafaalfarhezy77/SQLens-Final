"use client";

import Link from "next/link";
import {
  X,
  Sparkles,
  ArrowRight,
  Database,
  Filter,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  Table,
} from "lucide-react";
import type { QueryFlowNode } from "@/lib/playground/query-graph-types";

interface QueryNodeDetailPanelProps {
  node: QueryFlowNode | null;
  onClose: () => void;
  rawQuery?: string;
}

export function QueryNodeDetailPanel({
  node,
  onClose,
  rawQuery = "",
}: QueryNodeDetailPanelProps) {
  if (!node) return null;

  const rowDiff = node.outputRowCount - node.inputRowCount;

  const getNodeIcon = () => {
    switch (node.type) {
      case "TABLE":
        return <Database size={16} className="text-[#111111]" />;
      case "JOIN":
        return <Layers size={16} className="text-[#111111]" />;
      case "WHERE":
      case "HAVING":
        return <Filter size={16} className="text-[#111111]" />;
      case "ORDER_BY":
        return <ArrowUpDown size={16} className="text-[#111111]" />;
      case "RESULT":
        return <CheckCircle2 size={16} className="text-[#111111]" />;
      default:
        return <Table size={16} className="text-[#111111]" />;
    }
  };

  const aiPrompt = `Jelaskan secara mendalam mengapa operasi ${node.type} (${node.operation}) memproses data dari ${node.inputRowCount} baris menjadi ${node.outputRowCount} baris pada query SQL berikut:\n${rawQuery}`;

  return (
    <section
      aria-label={`Detail operasi node ${node.label}`}
      className="bg-white border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] flex flex-col max-h-[600px] overflow-hidden"
    >
      {/* Panel Header */}
      <div className="bg-[#FFF3A3] p-3.5 border-b-2 border-[#111111] flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#FFD600] border border-[#111111] flex items-center justify-center shadow-[1px_1px_0px_0px_#111111]">
            {getNodeIcon()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-black uppercase bg-[#111111] text-[#FFD600] px-1.5 py-0.2 border border-[#111111]">
                {node.type}
              </span>
              <h4 className="font-black text-xs sm:text-sm uppercase tracking-tight text-[#111111]">
                {node.label}
              </h4>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Panel Detail"
          className="w-7 h-7 bg-white hover:bg-[#FF5A5F] hover:text-white border border-[#111111] flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_0px_#111111] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="p-4 space-y-4 overflow-y-auto font-mono text-xs text-[#111111]">
        {/* SQL Clause Expression */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-black/60">
            Klausul Operasi:
          </span>
          <div className="p-2.5 bg-[#111111] text-[#00D084] border-2 border-[#111111] font-bold text-xs leading-relaxed overflow-x-auto shadow-[2px_2px_0px_0px_#111111]">
            <span className="text-[#FFD600] select-none mr-1.5">&gt;</span>
            {node.operation}
          </div>
        </div>

        {/* Cardinality Stats Card */}
        <div className="bg-[#F7F7F2] p-3 border-2 border-[#111111] space-y-2">
          <span className="text-[10px] uppercase font-bold text-black/60">
            Perubahan Kardinalitas Relasi:
          </span>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="bg-white px-2.5 py-1 border border-[#111111] font-bold shadow-[1px_1px_0px_0px_#111111]">
                <span className="text-[10px] text-black/50 block">Input</span>
                <span className="text-sm font-black">{node.inputRowCount} baris</span>
              </div>
              <ArrowRight size={14} className="text-black/60" />
              <div className="bg-[#FFD600] px-2.5 py-1 border border-[#111111] font-black shadow-[1px_1px_0px_0px_#111111]">
                <span className="text-[10px] text-black/60 block">Output</span>
                <span className="text-sm font-black">{node.outputRowCount} baris</span>
              </div>
            </div>

            {rowDiff !== 0 && (
              <span
                className={`px-2 py-1 text-xs font-black border ${
                  rowDiff < 0
                    ? "bg-red-100 text-red-700 border-red-300"
                    : "bg-green-100 text-green-700 border-green-300"
                }`}
              >
                {rowDiff > 0 ? `+${rowDiff} baris` : `${rowDiff} baris`}
              </span>
            )}
          </div>
        </div>

        {/* JOIN Details metadata if present */}
        {node.joinDetails && (
          <div className="bg-[#FFF9C4]/60 p-3 border-2 border-[#111111] space-y-1.5">
            <span className="text-[10px] uppercase font-black text-[#111111]">
              Peta Penggabungan ({node.joinDetails.joinType}):
            </span>
            <div className="text-[11px] leading-relaxed">
              Tabel Kiri: <strong>{node.joinDetails.leftTable}</strong> (
              <code>{node.joinDetails.leftKey}</code>)
              <br />
              Tabel Kanan: <strong>{node.joinDetails.rightTable}</strong> (
              <code>{node.joinDetails.rightKey}</code>)
            </div>
          </div>
        )}

        {/* Data Row Evaluations Preview */}
        {node.evaluations && node.evaluations.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-black/60">
                Preview Data Baris (Maks. {node.evaluations.length} Baris):
              </span>
              <span className="text-[10px] text-black/50 font-bold">
                Status Evaluasi
              </span>
            </div>

            <div className="border border-[#111111] max-h-48 overflow-y-auto bg-white">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-[#F7F7F2] border-b border-[#111111] select-none sticky top-0">
                  <tr>
                    <th className="p-1.5 border-r border-black/20 font-black">
                      Data
                    </th>
                    <th className="p-1.5 font-black text-center w-20">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {node.evaluations.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-black/10 last:border-0 hover:bg-[#FFF3A3]/20"
                    >
                      <td className="p-1.5 border-r border-black/20">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(item.data).map(([k, v]) => (
                            <span
                              key={k}
                              className="bg-[#F7F7F2] px-1 border border-black/15 text-[10px]"
                            >
                              <strong className="text-black/60">{k}:</strong>{" "}
                              {String(v)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-1.5 text-center">
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.2 border uppercase ${
                            item.status === "keep"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : item.status === "filtered"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : item.status === "joined"
                              ? "bg-yellow-200 text-black border-yellow-400"
                              : "bg-gray-100 text-black border-gray-300"
                          }`}
                        >
                          {item.statusText || item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Tutor Quick Context Button */}
        <div className="pt-2 border-t border-black/10">
          <Link
            href={`/dashboard/ai-tutor?prompt=${encodeURIComponent(aiPrompt)}`}
            className="w-full neo-btn neo-btn-dark text-xs py-2 px-3 shadow-[2px_2px_0px_0px_#FFD600] flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-[#FFD600]" />
            <span>TANYA AI TUTOR TENTANG TAHAP INI</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
