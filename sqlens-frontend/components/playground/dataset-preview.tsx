"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Database,
  Table,
  Upload,
  RotateCcw,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";
import type {
  EducationalDataset,
  DatasetTable,
} from "@/lib/api/contracts/datasets";
import type { CustomDatasetInfo } from "@/lib/api/contracts/custom-dataset";
import { CustomDatasetModal } from "@/components/playground/custom-dataset-modal";

interface DatasetPreviewProps {
  dataset?: EducationalDataset;
  educationalDataset?: EducationalDataset;
  initialCustomDataset?: CustomDatasetInfo;
}

export function DatasetPreview({
  dataset,
  educationalDataset,
  initialCustomDataset,
}: DatasetPreviewProps) {
  const router = useRouter();
  const effectiveEducational = educationalDataset || dataset;
  const [customInfo, setCustomInfo] = useState<CustomDatasetInfo | undefined>(
    initialCustomDataset,
  );
  const [activeTab, setActiveTab] = useState<"educational" | "custom">(
    initialCustomDataset?.has_custom_dataset ? "custom" : "educational",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const currentTables: DatasetTable[] =
    activeTab === "custom"
      ? customInfo?.tables || []
      : effectiveEducational?.tables || [];

  const handleReset = async () => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menghapus dataset kustom dan kembali ke dataset edukasi bawaan?",
      )
    ) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch("/api/custom-dataset", { method: "DELETE" });
      if (res.ok) {
        setCustomInfo({ has_custom_dataset: false, tables: [] });
        setActiveTab("educational");
        router.refresh();
      }
    } finally {
      setIsResetting(false);
    }
  };

  const handleUploadSuccess = async () => {
    try {
      const res = await fetch("/api/custom-dataset");
      if (res.ok) {
        const data = await res.json();
        setCustomInfo(data);
        setActiveTab("custom");
      }
    } catch {
      // fallback
    }
    router.refresh();
  };

  return (
    <>
      <div className="neo-card h-full flex flex-col bg-white">
        {/* Main Header */}
        <div className="bg-[#F7F7F2] p-4 border-b-2 border-[#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-tight text-[#111111]">
              <span className="w-6 h-6 bg-[#FFD600] border border-[#111111] flex items-center justify-center font-bold text-xs shadow-[1px_1px_0_#111111]">
                <Database size={14} />
              </span>
              <span>DATASET SANDBOX</span>
            </h2>
            <p className="text-xs text-[#555555] font-medium mt-0.5">
              {activeTab === "custom"
                ? "Database kustom pengguna aktif untuk eksplorasi dan query."
                : "Data sampel edukatif untuk mempraktikkan proyeksi, filter, dan join."}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="neo-btn bg-[#FFD600] text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer font-bold"
              aria-label="Unggah Database Kustom"
            >
              <Upload size={13} />
              <span>
                {customInfo?.has_custom_dataset ? "Ganti DB" : "+ Upload DB"}
              </span>
            </button>

            {customInfo?.has_custom_dataset && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isResetting}
                className="neo-btn bg-white text-xs py-1.5 px-2.5 flex items-center gap-1 cursor-pointer font-bold hover:bg-[#FF5A5F]/15"
                title="Hapus database kustom dan reset ke bawaan"
                aria-label="Reset Dataset ke Bawaan"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-2 border-[#111111] bg-[#EEEEEE] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("educational")}
            className={`flex-1 py-2 px-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "educational"
                ? "bg-white text-[#111111] border-b-2 border-[#FFD600]"
                : "text-[#666666] hover:bg-white/60"
            }`}
          >
            <span>Bawaan (Edukasi)</span>
            <span className="text-[10px] bg-[#E0E0E0] px-1.5 py-0.2 border border-[#111111]/30">
              {effectiveEducational?.tables.length || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`flex-1 py-2 px-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "custom"
                ? "bg-white text-[#111111] border-b-2 border-[#FFD600]"
                : "text-[#666666] hover:bg-white/60"
            }`}
          >
            <span>Dataset Saya</span>
            {customInfo?.has_custom_dataset ? (
              <span className="text-[10px] bg-[#FFF3A3] text-[#111111] px-1.5 py-0.2 border border-[#111111] flex items-center gap-0.5">
                <CheckCircle2 size={10} className="text-green-700" />
                {customInfo.tables.length}
              </span>
            ) : (
              <span className="text-[10px] text-[#888888]">Kosong</span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-6 flex-1 p-4 md:p-5 overflow-x-auto">
          {activeTab === "custom" && !customInfo?.has_custom_dataset ? (
            <div className="border-2 border-dashed border-[#111111] p-8 text-center bg-[#F7F7F2]/60 space-y-3">
              <div className="w-12 h-12 bg-[#FFF3A3] border-2 border-[#111111] rounded-full mx-auto flex items-center justify-center shadow-[2px_2px_0px_#111111]">
                <PlusCircle size={24} className="text-[#111111]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-sm uppercase text-[#111111]">
                  Belum Ada Database Kustom
                </h3>
                <p className="text-xs text-[#666666] max-w-sm mx-auto">
                  Unggah file CSV (misal data produk atau pesanan) atau skrip
                  SQL Anda untuk mencoba query pada skema sendiri!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="neo-btn neo-btn-dark text-xs py-2 px-4 inline-flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#FFD600]"
              >
                <Upload size={14} className="text-[#FFD600]" />
                <span>Unggah Database Sekarang</span>
              </button>
            </div>
          ) : currentTables.length === 0 ? (
            <div className="p-6 bg-[#F7F7F2] text-center">
              <p className="font-mono text-xs text-[#888888]">
                Tidak ada tabel yang tersedia pada dataset ini.
              </p>
            </div>
          ) : (
            currentTables.map((table) => (
              <div key={table.name} className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs font-bold border-b-2 border-[#111111] pb-1.5">
                  <span className="flex items-center gap-1.5 text-[#111111] uppercase tracking-wide">
                    <Table size={14} className="text-[#555555]" /> TABEL:{" "}
                    {table.name}
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 border border-[#111111] text-[#555555] font-bold">
                    {table.rows.length} BARIS DITAMPILKAN
                  </span>
                </div>

                <div className="border-2 border-[#111111] overflow-x-auto shadow-[2px_2px_0px_0px_#111111]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-[#FFF3A3] border-b-2 border-[#111111] select-none">
                      <tr>
                        {table.columns.map((column) => (
                          <th
                            key={column}
                            className="p-2 border-r border-[#111111] last:border-r-0 font-bold uppercase text-[11px] text-[#111111]"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={table.columns.length}
                            className="p-3 text-center text-[#777777] italic text-xs"
                          >
                            Tabel kosong (belum ada baris data).
                          </td>
                        </tr>
                      ) : (
                        table.rows.map((row) => (
                          <tr
                            key={`${table.name}-${table.columns
                              .map((column) => String(row[column] ?? ""))
                              .join("|")}`}
                            className="border-b border-[#111111]/15 last:border-0 odd:bg-white even:bg-[#F7F7F2]/60 hover:bg-[#FFF9C4]/40 transition-colors"
                          >
                            {table.columns.map((column) => (
                              <td
                                key={column}
                                className="p-2 border-r border-[#111111]/20 last:border-r-0 text-black/90 font-medium text-xs"
                              >
                                {String(row[column] ?? "")}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CustomDatasetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
}
