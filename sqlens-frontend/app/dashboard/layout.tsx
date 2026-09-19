import type React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F7F2] bg-grid-pattern selection:bg-[#FFD600] selection:text-[#111111]">
      {/* Top Header */}
      <DashboardHeader />

      {/* Main Layout: Sidebar + Dashboard Content */}
      <div className="dashboard-container flex-1 w-full py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <Sidebar />
          <main
            className="flex-1 w-full space-y-8 min-w-0"
            id="main-content"
            aria-label="Learning Dashboard Main Content"
          >
            {children}
          </main>
        </div>
      </div>

      {/* Bottom Dashboard Footer */}
      <footer className="bg-white border-t-4 border-[#111111] py-6 text-center text-xs font-mono text-[#666666]">
        <div className="dashboard-container flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>&copy; SQLens — Database Query Tutor. All rights reserved.</p>
          <p>
            Built with Neo-Brutalism &bull; Next.js 16 &bull; Tailwind CSS v4
          </p>
        </div>
      </footer>
    </div>
  );
}
