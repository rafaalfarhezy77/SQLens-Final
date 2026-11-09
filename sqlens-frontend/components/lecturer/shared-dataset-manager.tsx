"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Database,
  Upload,
  FileSpreadsheet,
  FileCode,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Users,
  Table,
} from "lucide-react";
import type { SharedDataset } from "@/lib/api/contracts/shared-datasets";

interface SharedDatasetManagerProps {
  initialDatasets: SharedDataset[];
}

export function SharedDatasetManager({
  initialDatasets,
}: SharedDatasetManagerProps) {
  const router = useRouter();
  const [datasets, setDatasets] = useState<SharedDataset[]>(initialDatasets);
  const [activeTab, setActiveTab] = useState<"list" | "upload_csv" | "upload_sql">("list");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [csvFiles, setCsvFiles] = useState<File[]>([]);
  const [sqlContent, setSqlContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
        setErrorMessage(`File ${f.name} bukan format .csv`);
        return;
      }
    }
    setCsvFiles((prev) => [...prev, ...newFiles]);
  };

  const handleUploadCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage("Judul dataset wajib diisi.");
      return;
    }
    if (csvFiles.length === 0) {
      setErrorMessage("Pilih minimal satu file CSV.");
      return;
    }

    setIsSubmitting(true);
    try {
      const filePayloads = await Promise.all(
        csvFiles.map(async (file) => ({
          filename: file.name,
          content: await file.text(),
        })),
      );

      const res = await fetch("/api/lecturer/shared-datasets/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          files: filePayloads,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Gagal mengunggah dataset.");
        return;
      }

      setSuccessMessage("Dataset kelas berhasil diunggah dan dibagikan ke mahasiswa.");
      setTitle("");
      setDescription("");
      setCsvFiles([]);
      setActiveTab("list");
      router.refresh();
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadSql = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage("Judul dataset wajib diisi.");
      return;
    }
    if (!sqlContent.trim()) {
      setErrorMessage("Skrip SQL tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/lecturer/shared-datasets/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          sql: sqlContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Gagal mengunggah dataset SQL.");
        return;
      }

      setSuccessMessage("Dataset SQL berhasil dieksekusi dan dibagikan ke kelas.");
      setTitle("");
      setDescription("");
      setSqlContent("");
      setActiveTab("list");
      router.refresh();
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (datasetId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus dataset bersama ini?")) {
      return;
    }
    setDeletingId(datasetId);
    try {
      const res = await fetch(`/api/lecturer/shared-datasets/${datasetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDatasets((prev) => prev.filter((d) => d.id !== datasetId));
        setSuccessMessage("Dataset kelas berhasil dihapus.");
        router.refresh();
      } else {
        const err = await res.json();
        setErrorMessage(err.message || "Gagal menghapus dataset.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan saat menghapus dataset.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="border-3 border-[#111111] bg-white p-5 sm:p-6 shadow-[5px_5px_0_#111111] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#111111] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="neo-badge neo-badge-yellow text-xs px-2 py-0.5">
              PORTAL DOSEN
            </span>
            <span className="text-xs font-mono font-bold bg-[#D4F4DD] border border-[#111111] px-2 py-0.5 text-[#006633]">
              SHARED DATASETS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#111111] mt-1">
            Kelola Database & Dataset Kelas
          </h2>
          <p className="text-xs text-[#555555] font-medium mt-0.5">
            Unggah dataset CSV atau SQL tugas praktikum yang dapat langsung dipilih oleh mahasiswa di SQL Playground.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("upload_csv");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`neo-btn text-xs py-1.5 px-3 flex items-center gap-1.5 ${
              activeTab === "upload_csv" ? "bg-[#FFD600]" : "bg-white"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>+ Upload CSV</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("upload_sql");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`neo-btn text-xs py-1.5 px-3 flex items-center gap-1.5 ${
              activeTab === "upload_sql" ? "bg-[#FFD600]" : "bg-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>+ Upload SQL</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border-2 border-[#FF5A5F] shadow-[2px_2px_0_#FF5A5F] text-xs font-mono text-[#FF5A5F] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-3 bg-green-50 border-2 border-[#00A854] shadow-[2px_2px_0_#00A854] text-xs font-mono text-[#006633] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tab 1: Upload CSV Form */}
      {activeTab === "upload_csv" && (
        <form onSubmit={handleUploadCsv} className="border-2 border-[#111111] bg-[#F7F7F2] p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#111111] pb-2">
            <h3 className="text-xs font-black uppercase text-[#111111] flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Unggah Dataset Kelas Baru (File CSV)</span>
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className="text-xs font-bold underline text-[#666666]"
            >
              Kembali ke Daftar
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono font-bold text-[#111111] mb-1">
                Judul Dataset / Tugas *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Dataset Praktikum 3 - Penjualan Tiket Pesawat"
                className="w-full p-2.5 text-xs font-mono border-2 border-[#111111] bg-white focus:outline-none focus:bg-[#FFFDE7]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#111111] mb-1">
                Deskripsi / Instruksi Tugas
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan petunjuk studi kasus atau tujuan query yang diharapkan..."
                rows={3}
                className="w-full p-2.5 text-xs font-mono border-2 border-[#111111] bg-white focus:outline-none focus:bg-[#FFFDE7]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#111111] mb-1">
                Pilih File CSV (Maks 5 file, maks 2 MB per file) *
              </label>
              <input
                type="file"
                accept=".csv"
                multiple
                onChange={handleCsvChange}
                className="w-full p-2 text-xs font-mono border-2 border-[#111111] bg-white file:mr-3 file:py-1 file:px-2.5 file:border file:border-[#111111] file:text-xs file:font-mono file:bg-[#FFD600] file:font-bold cursor-pointer"
              />
              {csvFiles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {csvFiles.map((f, i) => (
                    <span
                      key={i}
                      className="font-mono text-xs bg-white border border-[#111111] px-2 py-0.5 flex items-center gap-1"
                    >
                      <span>{f.name}</span>
                      <button
                        type="button"
                        onClick={() => setCsvFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-red-500 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="neo-btn bg-[#FFD600] text-xs py-2 px-4 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{isSubmitting ? "Mengunggah..." : "Publikasikan ke Mahasiswa"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className="neo-btn neo-btn-white text-xs py-2 px-3"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Upload SQL Form */}
      {activeTab === "upload_sql" && (
        <form onSubmit={handleUploadSql} className="border-2 border-[#111111] bg-[#F7F7F2] p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#111111] pb-2">
            <h3 className="text-xs font-black uppercase text-[#111111] flex items-center gap-1.5">
              <FileCode className="w-4 h-4" />
              <span>Unggah Dataset Kelas Baru (Skrip DDL / DML SQL)</span>
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className="text-xs font-bold underline text-[#666666]"
            >
              Kembali ke Daftar
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono font-bold text-[#111111] mb-1">
                Judul Dataset / Tugas *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Skema Basis Data Rumah Sakit & Pasien"
                className="w-full p-2.5 text-xs font-mono border-2 border-[#111111] bg-white focus:outline-none focus:bg-[#FFFDE7]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#111111] mb-1">
                Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan petunjuk studi kasus atau konteks skema..."
                rows={2}
                className="w-full p-2.5 text-xs font-mono border-2 border-[#111111] bg-white focus:outline-none focus:bg-[#FFFDE7]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#111111] mb-1">
                Skrip SQL (Hanya CREATE TABLE dan INSERT INTO) *
              </label>
              <textarea
                value={sqlContent}
                onChange={(e) => setSqlContent(e.target.value)}
                placeholder="CREATE TABLE dokter (id INT, nama VARCHAR(100), spesialis VARCHAR(50));&#10;INSERT INTO dokter VALUES (1, 'dr. Ani', 'Anak');"
                rows={6}
                spellCheck={false}
                className="w-full p-3 text-xs font-mono bg-[#181818] text-[#00D084] border-2 border-[#111111] focus:outline-none leading-relaxed"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="neo-btn bg-[#FFD600] text-xs py-2 px-4 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{isSubmitting ? "Mengeksekusi..." : "Publikasikan ke Mahasiswa"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className="neo-btn neo-btn-white text-xs py-2 px-3"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Dataset List Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span>DAFTAR DATASET KELAS AKTIF ({datasets.length})</span>
        </h3>

        {datasets.length === 0 ? (
          <div className="border-2 border-dashed border-[#111111] p-6 text-center bg-[#F7F7F2]">
            <p className="text-xs font-mono text-[#666666]">
              Belum ada dataset kelas yang diunggah. Klik tombol "+ Upload CSV" atau "+ Upload SQL" di atas untuk membagikan dataset tugas ke mahasiswa.
            </p>
          </div>
        ) : (
          <div className="border-2 border-[#111111] overflow-x-auto shadow-[3px_3px_0_#111111]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="bg-[#FFF3A3] border-b-2 border-[#111111]">
                <tr>
                  <th className="p-2.5 border-r border-[#111111] font-black uppercase">Judul Dataset</th>
                  <th className="p-2.5 border-r border-[#111111] font-black uppercase">Daftar Tabel</th>
                  <th className="p-2.5 border-r border-[#111111] font-black uppercase">Pengunggah</th>
                  <th className="p-2.5 border-r border-[#111111] font-black uppercase">Tanggal</th>
                  <th className="p-2.5 font-black uppercase text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y border-[#111111]">
                {datasets.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F7F7F2] transition-colors">
                    <td className="p-2.5 border-r border-[#111111] font-bold text-[#111111]">
                      <div>{d.title}</div>
                      {d.description && (
                        <div className="text-[11px] font-normal text-[#666666] line-clamp-1">
                          {d.description}
                        </div>
                      )}
                    </td>
                    <td className="p-2.5 border-r border-[#111111]">
                      <div className="flex flex-wrap gap-1">
                        {d.tableNames.map((t) => (
                          <span
                            key={t}
                            className="bg-white border border-[#111111] px-1.5 py-0.2 text-[10px] font-mono flex items-center gap-1"
                          >
                            <Table className="w-3 h-3 text-[#555555]" />
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2.5 border-r border-[#111111] text-[#444444]">
                      {d.createdByName}
                    </td>
                    <td className="p-2.5 border-r border-[#111111] text-[#666666] text-[11px]">
                      {new Date(d.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(d.id)}
                        disabled={deletingId === d.id}
                        className="text-red-600 hover:text-red-800 p-1 border border-transparent hover:border-red-600 cursor-pointer"
                        title="Hapus dataset bersama"
                      >
                        {deletingId === d.id ? (
                          <Loader2 className="w-4 h-4 animate-spin inline" />
                        ) : (
                          <Trash2 className="w-4 h-4 inline" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
