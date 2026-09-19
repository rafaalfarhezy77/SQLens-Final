"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils/cn";

export interface LogoutButtonProps {
  className?: string;
  onBeforeLogout?: () => void;
}

export function LogoutButton({ className, onBeforeLogout }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    onBeforeLogout?.();
    startTransition(async () => {
      await logoutAction();
    });
  };

  const baseStyles =
    "flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold uppercase tracking-wider border-2 border-[#111111] bg-[#FFFFFF] text-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:bg-[#FFD600] hover:shadow-[3px_3px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={cn(baseStyles, className)}
      title="Keluar dari sesi dan hapus cookie"
    >
      {isPending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <LogOut size={14} />
      )}
      <span>{isPending ? "Mengeluarkan..." : "Keluar Sesi (Logout)"}</span>
    </button>
  );
}
