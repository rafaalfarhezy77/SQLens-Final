"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("SQLens Root Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F7F7F2]">
      <div className="w-full max-w-lg border-3 border-[#111111] bg-[#FFFFFF] shadow-[6px_6px_0px_0px_#111111] p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#ef4444] border-2 border-[#111111] flex items-center justify-center text-white shadow-[3px_3px_0px_0px_#111111]">
            <AlertTriangle size={28} />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#ef4444] tracking-wider">
              ERROR 500 — SYSTEM MALFUNCTION
            </span>
            <h1 className="text-xl md:text-2xl font-black uppercase text-[#111111]">
              Terjadi Kesalahan Sistem
            </h1>
          </div>
        </div>

        <div className="p-4 bg-[#F7F7F2] border-2 border-[#111111] font-mono text-xs text-[#111111] space-y-1">
          <p className="font-bold">Pesan Kesalahan:</p>
          <p className="opacity-80 break-words">
            {error.message || "An unexpected error occurred."}
          </p>
          {error.digest && (
            <p className="text-[10px] opacity-50 mt-1">
              Digest ID: {error.digest}
            </p>
          )}
        </div>

        <p className="text-xs md:text-sm font-medium text-black/70">
          Aplikasi mengalami kendala saat memproses tampilan. Anda dapat mencoba
          memuat ulang halaman atau kembali ke beranda.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 font-bold uppercase text-xs tracking-wider border-2 border-[#111111] bg-[#FFD600] text-[#111111] shadow-[3px_3px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5"
          >
            <RefreshCw size={14} />
            <span>Coba Lagi (Retry)</span>
          </button>

          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 font-bold uppercase text-xs tracking-wider border-2 border-[#111111] bg-[#FFFFFF] text-[#111111] shadow-[3px_3px_0px_0px_#111111] hover:bg-[#F7F7F2] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#111111]"
          >
            <Home size={14} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
