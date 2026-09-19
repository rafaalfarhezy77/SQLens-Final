"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export function MobileNavToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Buka Menu Navigasi Dashboard"
        aria-expanded={isOpen}
        className="p-2 border-2 border-[#111111] bg-[#FFD600] shadow-[3px_3px_0_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-[#FFFFFF] border-r-4 border-[#111111] h-full flex flex-col p-6 shadow-[6px_0px_0px_0px_#111111] animate-in slide-in-from-left duration-200">
            {/* Header User profile */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#111111]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFD600] border-2 border-[#111111] font-mono font-black text-sm flex items-center justify-center shadow-[2px_2px_0_#111111]">
                  ST
                </div>
                <div>
                  <span className="font-black text-sm block">Student</span>
                  <span className="font-mono text-xs text-[#555555]">
                    student@sqlens.edu
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 border-2 border-[#111111] bg-white text-black shadow-[2px_2px_0_#111111] cursor-pointer"
                aria-label="Tutup menu navigasi"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 py-4 space-y-2 overflow-y-auto font-bold uppercase tracking-wider text-sm">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-2 border-b border-[#EAEAE4] hover:bg-[#111111] hover:text-[#FFD600] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 bg-[#FFD600] border-2 border-[#111111] shadow-[2px_2px_0_#111111]"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/playground"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-2 border-b border-[#EAEAE4] hover:bg-[#111111] hover:text-[#FFD600] transition-colors"
              >
                SQL Playground
              </Link>
              <Link
                href="/dashboard/ai-tutor"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-2 border-b border-[#EAEAE4] hover:bg-[#111111] hover:text-[#FFD600] transition-colors"
              >
                AI Tutor
              </Link>
              <Link
                href="/dashboard/query-history"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-2 border-b border-[#EAEAE4] hover:bg-[#111111] hover:text-[#FFD600] transition-colors"
              >
                Query History
              </Link>
              <Link
                href="/dashboard/learning"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-2 border-b border-[#EAEAE4] hover:bg-[#111111] hover:text-[#FFD600] transition-colors"
              >
                Learning Materials
              </Link>
            </nav>

            {/* Bottom Logout */}
            <div className="pt-4 border-t-2 border-[#111111]">
              <LogoutButton onBeforeLogout={() => setIsOpen(false)} />
            </div>
          </div>

          <button
            type="button"
            aria-label="Tutup overlay"
            className="flex-1 cursor-default"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
