import Link from "next/link";
import { MobileNavToggle } from "@/components/client/mobile-nav-toggle";
import { LogoutButton } from "@/components/auth/logout-button";
import { getSession } from "@/lib/auth/session";

export async function DashboardHeader() {
  const session = await getSession();
  const displayName = session?.name || "Student";
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST";

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b-4 border-[#111111] shadow-[0_4px_0_#111111] shrink-0">
      <div className="dashboard-container flex items-center justify-between h-20">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
          aria-label="Kembali ke Landing Page SQLens"
        >
          <div className="w-10 h-10 bg-[#FFD600] border-2 border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center font-mono font-black text-xl group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0_#111111] transition-all">
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

        {/* Desktop Top Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-5 lg:gap-6 font-bold text-sm tracking-wide uppercase"
          aria-label="Top Navigation"
        >
          <Link
            href="/"
            className="border-2 border-transparent hover:bg-[#111111] hover:text-[#FFD600] px-2.5 py-1.5 transition-all text-[#111111]"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="border-2 border-transparent hover:bg-[#111111] hover:text-[#FFD600] px-2.5 py-1.5 transition-all text-[#111111]"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/playground"
            className="border-2 border-transparent hover:bg-[#111111] hover:text-[#FFD600] px-2.5 py-1.5 transition-all text-[#111111]"
          >
            SQL Playground
          </Link>
          <Link
            href="/dashboard/ai-tutor"
            className="border-2 border-transparent hover:bg-[#111111] hover:text-[#FFD600] px-2.5 py-1.5 transition-all text-[#111111]"
          >
            AI Tutor
          </Link>
          <Link
            href="/dashboard/query-history"
            className="border-2 border-transparent hover:bg-[#111111] hover:text-[#FFD600] px-2.5 py-1.5 transition-all text-[#111111]"
          >
            Query History
          </Link>
        </nav>

        {/* User Profile & Logout Action */}
        <div className="hidden md:flex items-center gap-3.5">
          <div className="flex items-center gap-2.5 pl-3 border-l-2 border-[#111111]">
            <div className="w-9 h-9 bg-[#FFF3A3] border-2 border-[#111111] font-mono font-black text-sm flex items-center justify-center shadow-[2px_2px_0_#111111]">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs leading-tight">
                {displayName}
              </span>
              <span className="font-mono text-[10px] text-[#666666]">
                {session?.role === "dosen"
                  ? "Lecturer Account"
                  : "Learner Account"}
              </span>
            </div>
          </div>

          <div className="w-28">
            <LogoutButton className="py-1.5 px-2.5 text-[11px] font-mono hover:bg-[#FF5A5F] hover:text-white" />
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <MobileNavToggle />
      </div>
    </header>
  );
}
