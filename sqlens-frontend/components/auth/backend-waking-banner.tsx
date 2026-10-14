"use client";

import { useEffect, useState } from "react";
import { Clock, RefreshCw } from "lucide-react";

interface BackendWakingBannerProps {
  initialSeconds?: number;
  message?: string;
}

export function BackendWakingBanner({
  initialSeconds = 15,
  message,
}: BackendWakingBannerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const percentage = Math.round(
    ((initialSeconds - secondsLeft) / initialSeconds) * 100,
  );

  return (
    <div
      role="alert"
      className="p-4 bg-[#FFF9D2] border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] text-xs font-mono space-y-3"
    >
      <div className="flex items-start gap-2.5">
        <div className="p-1 bg-[#FFD600] border border-[#111111] shrink-0 mt-0.5">
          <Clock size={16} className="text-[#111111] animate-pulse" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-black uppercase tracking-tight text-[#111111] text-[13px] flex items-center gap-1.5">
              <span>SERVER SEDANG BANGUN (RENDER FREE TIER)</span>
            </span>
            <span className="px-2 py-0.5 bg-black text-[#FFD600] font-black text-[11px] rounded-none border border-black shrink-0">
              {secondsLeft > 0 ? `${secondsLeft}s` : "SIAP!"}
            </span>
          </div>
          <p className="text-black/85 leading-relaxed text-[11px]">
            {message ||
              "Layanan backend sedang dinyalakan dari mode hemat daya Render. Mohon tunggu 15 detik sebelum mencoba login kembali."}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 bg-white border border-[#111111] overflow-hidden">
          <div
            className="h-full bg-[#FFD600] transition-all duration-1000 ease-linear"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-black/70 font-bold uppercase">
          <span>
            {secondsLeft > 0
              ? `Menunggu server siap... (${secondsLeft} detik)`
              : "Server kemungkinan sudah bangun!"}
          </span>
          <span>{secondsLeft > 0 ? `${percentage}%` : "100% SIAP"}</span>
        </div>
      </div>

      {secondsLeft === 0 && (
        <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#00875A] font-black uppercase">
          <RefreshCw size={12} className="shrink-0 animate-spin" />
          <span>
            Waktu tunggu selesai. Silakan klik tombol di bawah untuk mencoba
            kembali!
          </span>
        </div>
      )}
    </div>
  );
}
