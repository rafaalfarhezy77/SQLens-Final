"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("SQLens Auth Segment Error:", error);
  }, [error]);

  return (
    <div className="border-3 border-[#111111] bg-[#FFFFFF] shadow-[6px_6px_0px_0px_#111111] p-6 sm:p-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#ef4444] border-2 border-[#111111] flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#111111]">
          <AlertTriangle size={22} />
        </div>
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#ef4444]">
            AUTH PIPELINE ERROR
          </span>
          <h2 className="text-lg font-black uppercase text-[#111111]">
            Gagal Memproses Otentikasi
          </h2>
        </div>
      </div>

      <div className="p-3 bg-[#F7F7F2] border-2 border-[#111111] font-mono text-xs text-[#111111] space-y-1">
        <p className="font-bold">Detail Error:</p>
        <p className="opacity-80 break-words">
          {error.message || "An unexpected error occurred during auth flow."}
        </p>
      </div>

      <p className="text-xs font-medium text-black/70">
        Terjadi kendala saat memuat formulir otentikasi. Silakan muat ulang atau
        coba beberapa saat lagi.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 font-bold uppercase text-xs tracking-wider border-2 border-[#111111] bg-[#FFD600] text-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5"
        >
          <RefreshCw size={14} />
          <span>Coba Lagi</span>
        </button>

        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 font-bold uppercase text-xs tracking-wider border-2 border-[#111111] bg-[#FFFFFF] text-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:bg-[#F7F7F2]"
        >
          <Home size={14} />
          <span>Beranda</span>
        </Link>
      </div>
    </div>
  );
}
