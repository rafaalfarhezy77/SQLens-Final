"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileSpreadsheet,
  FileCode,
  X,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";

interface CustomDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export function CustomDatasetModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: CustomDatasetModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"csv" | "sql">("csv");
  const [csvFiles, setCsvFiles] = useState<File[]>([]);
  const [sqlContent, setSqlContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    if (csvFiles.length + newFiles.length > 5) {
      setErrorMessage("Maksimum 5 file CSV yang dapat diunggah.");
      return;
    }

    for (const f of newFiles) {
      if (!f.name.toLowerCase().endsWith(".csv")) {
        setErrorMessage(`File ${f.name} bukan file berformat .csv`);
        return;
      }
      if (f.size > 2 * 1024 * 1024) {
        setErrorMessage(`File ${f.name} melebihi batas ukuran 2 MB.`);
        return;
      }
    }

    setCsvFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setCsvFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSqlFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Ukuran file SQL melebihi batas 2 MB.");
      return;
    }

    try {
      const text = await file.text();
      setSqlContent(text);
    } catch {
      setErrorMessage("Gagal membaca berkas SQL.");
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setIsUploading(true);

    try {
      if (activeTab === "csv") {
        if (csvFiles.length === 0) {
          setErrorMessage("Pilih setidaknya satu file CSV.");
          setIsUploading(false);
          return;
        }

        const payloadFiles = await Promise.all(
          csvFiles.map(async (file) => ({
            filename: file.name,
            content: await file.text(),
          })),
        );

        const res = await fetch("/api/custom-dataset/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "csv", files: payloadFiles }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Gagal mengunggah file CSV.");
        }
      } else {
        if (!sqlContent.trim()) {
          setErrorMessage("Skrip SQL tidak boleh kosong.");
          setIsUploading(false);
          return;
        }

        const res = await fetch("/api/custom-dataset/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "sql", sql: sqlContent }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Gagal mengeksekusi skrip SQL.");
        }
      }

      onClose();
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memproses database kustom.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-dataset-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div className="neo-card bg-white w-full max-w-xl max-h-[90vh] flex flex-col shadow-[6px_6px_0px_0px_#111111] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FFF3A3] p-4 border-b-2 border-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 bg-[#111111] text-[#FFD600] flex items-center justify-center font-bold text-sm">
              <Upload size={16} />
            </span>
            <h2
              id="custom-dataset-modal-title"
              className="text-base font-black uppercase tracking-tight text-[#111111]"
            >
              UNGGAH DATABASE PENGGUNA
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            aria-label="Tutup modal"
            className="p-1 border border-[#111111] bg-white hover:bg-[#FF5A5F] hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b-2 border-[#111111] bg-[#F7F7F2]">
          <button
            type="button"
            onClick={() => {
              setActiveTab("csv");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-r-2 border-[#111111] transition-colors cursor-pointer ${
              activeTab === "csv"
                ? "bg-white text-[#111111] shadow-[inset_0_-2px_0_#FFD600]"
                : "text-[#666666] hover:bg-white/50"
            }`}
          >
            <FileSpreadsheet size={16} />
            <span>Multi-File CSV (Rekomendasi)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("sql");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === "sql"
                ? "bg-white text-[#111111] shadow-[inset_0_-2px_0_#FFD600]"
                : "text-[#666666] hover:bg-white/50"
            }`}
          >
            <FileCode size={16} />
            <span>Skrip SQL (.sql)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {errorMessage && (
            <div
              role="alert"
              className="p-3 bg-[#FF5A5F]/10 border-2 border-[#FF5A5F] flex items-start gap-2.5 text-xs text-[#111111] font-semibold"
            >
              <AlertCircle
                size={16}
                className="text-[#FF5A5F] shrink-0 mt-0.5"
              />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === "csv" ? (
            <div className="space-y-4">
              <p className="text-xs text-[#555555]">
                Unggah 1 sampai 5 file <code>.csv</code>. Nama file akan
                otomatis menjadi nama tabel, dan baris pertama dijadikan nama
                kolom.
              </p>

              <div className="border-2 border-dashed border-[#111111] p-6 text-center bg-[#F7F7F2]/40 hover:bg-[#FFF9C4]/30 transition-colors">
                <input
                  type="file"
                  id="csv-file-input"
                  multiple
                  accept=".csv"
                  onChange={handleCsvChange}
                  disabled={isUploading || csvFiles.length >= 5}
                  className="hidden"
                />
                <label
                  htmlFor="csv-file-input"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload size={28} className="text-[#111111]" />
                  <span className="text-xs font-bold uppercase underline">
                    Pilih Berkas CSV
                  </span>
                  <span className="text-[11px] text-[#777777]">
                    Maks. 5 file, maks. 2 MB per file
                  </span>
                </label>
              </div>

              {csvFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase text-[#111111]">
                    Berkas Terpilih ({csvFiles.length}/5):
                  </div>
                  <div className="space-y-1.5">
                    {csvFiles.map((f, idx) => (
                      <div
                        key={`${f.name}-${f.size}-${f.lastModified}`}
                        className="flex items-center justify-between p-2 border border-[#111111] bg-white text-xs font-mono"
                      >
                        <span className="truncate max-w-[320px]">
                          <strong>{f.name}</strong> (
                          {(f.size / 1024).toFixed(1)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          disabled={isUploading}
                          className="text-[#FF5A5F] hover:bg-[#FF5A5F]/10 p-1 cursor-pointer"
                          aria-label={`Hapus ${f.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-[#555555]">
                Tulis atau tempel perintah DDL/DML (hanya{" "}
                <code>CREATE TABLE</code> dan <code>INSERT INTO</code> yang
                diizinkan).
              </p>

              <div>
                <input
                  type="file"
                  id="sql-file-input"
                  accept=".sql"
                  onChange={handleSqlFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
                <label
                  htmlFor="sql-file-input"
                  className="neo-btn bg-[#F7F7F2] text-xs py-1.5 px-3 inline-flex items-center gap-1.5 cursor-pointer mb-2"
                >
                  <Upload size={14} />
                  <span>Muat dari file .sql</span>
                </label>
              </div>

              <textarea
                value={sqlContent}
                onChange={(e) => setSqlContent(e.target.value)}
                placeholder={`CREATE TABLE produk (
  id INT PRIMARY KEY,
  nama VARCHAR(100),
  harga INT
);

INSERT INTO produk VALUES (1, 'Laptop', 10000000);`}
                rows={8}
                disabled={isUploading}
                className="w-full p-3 font-mono text-xs border-2 border-[#111111] bg-[#FDFDFD] focus:outline-hidden focus:border-[#FFD600] resize-y"
              />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-[#F7F7F2] p-4 border-t-2 border-[#111111] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="neo-btn bg-white text-xs py-2 px-4 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isUploading ||
              (activeTab === "csv" ? csvFiles.length === 0 : !sqlContent.trim())
            }
            className="neo-btn neo-btn-dark text-xs py-2 px-5 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Upload size={14} />
                <span>Unggah & Buat Tabel</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
