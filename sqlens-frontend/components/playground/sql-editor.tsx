"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Terminal, Play, RotateCcw, AlertCircle, Loader2 } from "lucide-react";
import { queryInputSchema } from "@/lib/schemas/query";
import { DEFAULT_SQL_QUERY } from "@/lib/playground/query-processor";

export interface SqlEditorProps {
  initialQuery?: string;
}

const PRESET_QUERIES = [
  {
    label: "JOIN & WHERE Filter",
    query: DEFAULT_SQL_QUERY,
  },
  {
    label: "Semua Mahasiswa (SELECT)",
    query: "SELECT id, name, major FROM students;",
  },
  {
    label: "Nilai di Atas 80",
    query: "SELECT * FROM scores WHERE score >= 80;",
  },
];

export function SqlEditor({
  initialQuery = DEFAULT_SQL_QUERY,
}: SqlEditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQueryFromUrl = searchParams.get("q") || initialQuery;

  const [query, setQuery] = useState(currentQueryFromUrl);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    // 1. Validasi Zod di sisi klien
    const validation = queryInputSchema.safeParse({ query });
    if (!validation.success) {
      setError(
        validation.error.flatten().fieldErrors.query?.[0] ||
          "Query SQL tidak valid.",
      );
      return;
    }

    // 2. Kirim parameter query ke Server Component via URL
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", query);
      router.push(`/dashboard/playground?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setQuery(DEFAULT_SQL_QUERY);
    setError(null);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      router.push("/dashboard/playground");
    });
  };

  const handleSelectPreset = (presetQuery: string) => {
    setQuery(presetQuery);
    setError(null);
  };

  return (
    <div className="neo-card bg-white">
      {/* Editor Header Bar */}
      <div className="bg-[#222222] p-3 border-b-2 border-[#111111] flex flex-wrap items-center justify-between gap-2 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 mr-1" aria-hidden="true">
            <span className="w-3 h-3 bg-[#FF5A5F] border border-[#111111] inline-block" />
            <span className="w-3 h-3 bg-[#FFD600] border border-[#111111] inline-block" />
            <span className="w-3 h-3 bg-[#00D084] border border-[#111111] inline-block" />
          </div>
          <div className="w-6 h-6 bg-[#FFD600] border border-[#111111] flex items-center justify-center font-bold text-xs text-[#111111] shadow-[1px_1px_0px_0px_#111111]">
            <Terminal size={14} />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F7F7F2]">
            editor.sql
          </span>
        </div>

        {/* Preset Query Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-white/60 font-bold hidden sm:inline">
            Preset:
          </span>
          {PRESET_QUERIES.map((preset) => {
            const isSelected = query.trim() === preset.query.trim();
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(preset.query)}
                className={`px-2 py-1 text-[10px] font-mono font-bold uppercase border border-[#111111] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FFD600] text-[#111111] shadow-[2px_2px_0px_0px_#000000] -translate-x-0.5"
                    : "bg-white text-[#111111] hover:bg-[#FFF3A3] shadow-[1px_1px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Code Area */}
      <form onSubmit={handleExecute} className="p-4 sm:p-5 space-y-4">
        <div className="relative">
          <label htmlFor="sql-textarea" className="sr-only">
            Editor Kode SQL
          </label>
          <textarea
            id="sql-textarea"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "sql-query-error" : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                handleExecute();
              }
            }}
            rows={7}
            spellCheck={false}
            className="w-full p-4 font-mono text-xs md:text-sm bg-[#181818] text-[#00D084] border-2 border-[#111111] focus:bg-[#111111] focus:outline-none focus:shadow-[4px_4px_0px_0px_#FFD600] leading-relaxed resize-y transition-shadow"
            placeholder="Tulis perintah SQL deklaratif di sini (contoh: SELECT * FROM students;)..."
          />
          <div className="absolute right-3 bottom-3 hidden sm:flex items-center gap-1.5 pointer-events-none text-[10px] font-mono font-bold text-white/50 bg-[#222222] px-2 py-0.5 border border-[#444444]">
            <kbd className="font-bold">Ctrl</kbd>+
            <kbd className="font-bold">Enter</kbd> ↵
          </div>
        </div>

        {/* Zod Validation Error Alert */}
        {error && (
          <div
            id="sql-query-error"
            role="alert"
            className="p-3.5 bg-red-50 border-2 border-[#FF5A5F] shadow-[3px_3px_0px_0px_#FF5A5F] text-xs font-mono flex items-start gap-3"
          >
            <AlertCircle
              aria-hidden="true"
              size={18}
              className="text-[#FF5A5F] shrink-0 mt-0.5"
            />
            <div className="space-y-0.5">
              <p className="font-black text-[#FF5A5F] uppercase tracking-wide">
                Validasi Kueri Gagal:
              </p>
              <p className="text-[#FF5A5F] font-medium leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t-2 border-[#111111]/10">
          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              disabled={isPending}
              className="neo-btn text-xs py-2 px-4 bg-[#FFD600] flex items-center gap-2 shadow-[3px_3px_0_#111111]"
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Play size={15} className="fill-[#111111]" />
              )}
              <span>{isPending ? "Mengeksekusi..." : "Jalankan Query"}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="neo-btn neo-btn-white text-xs py-2 px-3.5 shadow-[2px_2px_0_#111111] flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-black/50">
            <span className="hidden md:inline">Skema Zod Aman</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D084]" />
            <span>Read-Only Sandbox</span>
          </div>
        </div>
      </form>
    </div>
  );
}
