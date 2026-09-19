import type React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F2] bg-grid-pattern flex flex-col justify-between selection:bg-[#FFD600] selection:text-[#111111]">
      {/* Top Header */}
      <header className="bg-[#FFFFFF] border-b-4 border-[#111111] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-3 focus-visible:ring-black"
          >
            <div className="w-10 h-10 bg-[#FFD600] border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center font-black text-xl font-mono group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
              SQ
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tight text-xl leading-none">
                SQLENS
              </span>
              <span className="font-mono text-xs font-semibold text-[#555555] uppercase tracking-wider">
                Database Query Tutor
              </span>
            </div>
          </Link>

          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-white border-2 border-[#111111] shadow-[2px_2px_0_#111111] hover:bg-[#FFD600] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <ArrowLeft size={14} />
            <span>BACK TO HOME</span>
          </Link>
        </div>
      </header>

      {/* Main Centered Content */}
      <main
        className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-auto"
        id="main-content"
      >
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-[#666666] border-t border-[#111111]/15">
        <p>&copy; SQLens — Database Query Tutor. All rights reserved.</p>
      </footer>
    </div>
  );
}
