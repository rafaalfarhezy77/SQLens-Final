import Link from "next/link";
import { Terminal, Bot, History } from "lucide-react";

export function QuickActions() {
  return (
    <section
      className="neo-card p-6 sm:p-8 bg-white"
      aria-labelledby="quick-actions-heading"
    >
      <div className="mb-6">
        <span className="neo-badge mb-2">SHORTCUTS</span>
        <h2
          id="quick-actions-heading"
          className="text-2xl font-black uppercase tracking-tight text-[#111111]"
        >
          QUICK ACTIONS
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Quick Action 1 */}
        <Link
          href="/dashboard/playground"
          className="neo-card p-5 bg-[#FFF3A3] hover:-translate-y-1 hover:shadow-[6px_6px_0_#111111] transition-all block group"
        >
          <div className="w-10 h-10 bg-[#111111] text-[#FFD600] flex items-center justify-center font-bold mb-4 shadow-[2px_2px_0_#FFD600]">
            <Terminal size={20} strokeWidth={2.5} />
          </div>
          <h3 className="font-black text-lg uppercase tracking-tight text-[#111111]">
            WRITE A QUERY
          </h3>
          <p className="text-xs text-[#444444] font-medium mt-1">
            Buka SQL Playground dan eksperimen dengan data nyata.
          </p>
        </Link>

        {/* Quick Action 2 */}
        <Link
          href="/dashboard/ai-tutor"
          className="neo-card p-5 bg-white hover:-translate-y-1 hover:shadow-[6px_6px_0_#111111] transition-all block group"
        >
          <div className="w-10 h-10 bg-[#FFD600] text-[#111111] border-2 border-[#111111] flex items-center justify-center font-bold mb-4 shadow-[2px_2px_0_#111111]">
            <Bot size={20} strokeWidth={2.5} />
          </div>
          <h3 className="font-black text-lg uppercase tracking-tight text-[#111111]">
            ASK AI TUTOR
          </h3>
          <p className="text-xs text-[#444444] font-medium mt-1">
            Dapatkan penjelasan query atau petunjuk saat kamu bingung.
          </p>
        </Link>

        {/* Quick Action 3 */}
        <Link
          href="/dashboard/query-history"
          className="neo-card p-5 bg-white hover:-translate-y-1 hover:shadow-[6px_6px_0_#111111] transition-all block group"
        >
          <div className="w-10 h-10 bg-[#F7F7F2] text-[#111111] border-2 border-[#111111] flex items-center justify-center font-bold mb-4 shadow-[2px_2px_0_#111111]">
            <History size={20} strokeWidth={2.5} />
          </div>
          <h3 className="font-black text-lg uppercase tracking-tight text-[#111111]">
            VIEW QUERY HISTORY
          </h3>
          <p className="text-xs text-[#444444] font-medium mt-1">
            Review dan audit query-query yang sudah pernah kamu jalankan.
          </p>
        </Link>
      </div>
    </section>
  );
}
