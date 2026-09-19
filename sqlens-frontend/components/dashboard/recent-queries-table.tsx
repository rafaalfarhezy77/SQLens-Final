"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import type { RecentActivityItem } from "@/lib/data/dashboard";

export interface RecentQueriesTableProps {
  initialActivities?: RecentActivityItem[];
}

export function RecentQueriesTable({
  initialActivities = [],
}: RecentQueriesTableProps) {
  const [filter, setFilter] = useState<"ALL" | "SUCCESS" | "NEEDS REVIEW">(
    "ALL",
  );

  // Seed default activities if empty
  const defaultItems: RecentActivityItem[] = [
    {
      id: "q-1",
      query:
        "SELECT name, score FROM students JOIN scores ON students.id = scores.student_id WHERE score >= 80;",
      action: "JOIN & Filter",
      status: "success",
      duration: "12ms",
      timestamp: "10 menit lalu",
    },
    {
      id: "q-2",
      query: "SELECT department, COUNT(*) FROM students GROUP BY department;",
      action: "Aggregation",
      status: "success",
      duration: "18ms",
      timestamp: "1 jam lalu",
    },
    {
      id: "q-3",
      query: "SELECT * FROM students WHERE score > 100;",
      action: "Logic Filter",
      status: "error",
      duration: "8ms",
      timestamp: "Kemarin",
    },
  ];

  const items = initialActivities.length > 0 ? initialActivities : defaultItems;

  const filteredItems = items.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "SUCCESS") return item.status === "success";
    if (filter === "NEEDS REVIEW")
      return item.status === "error" || item.status === "warning";
    return true;
  });

  return (
    <section
      className="neo-card p-6 sm:p-7 bg-white space-y-6"
      aria-labelledby="queries-section-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#111111]">
        <div>
          <h2
            id="queries-section-heading"
            className="text-2xl font-black uppercase tracking-tight text-[#111111]"
          >
            RECENT QUERIES
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] font-medium">
            Query terakhir yang kamu jalankan di SQL Playground.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          {(["ALL", "SUCCESS", "NEEDS REVIEW"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`neo-btn-tab text-xs py-1.5 px-3 ${
                filter === tab ? "is-active" : ""
              }`}
              aria-pressed={filter === tab}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Queries Table */}
      <div className="border-3 border-[#111111] shadow-[4px_4px_0_#111111] overflow-x-auto bg-white">
        <table
          className="w-full text-left border-collapse font-mono text-xs"
          aria-label="Tabel Riwayat Query"
        >
          <thead className="bg-[#FFF3A3] border-b-2 border-[#111111] font-bold uppercase select-none">
            <tr>
              <th
                scope="col"
                className="p-3.5 sm:p-4 border-r-2 border-[#111111]"
              >
                QUERY
              </th>
              <th
                scope="col"
                className="p-3.5 sm:p-4 border-r-2 border-[#111111]"
              >
                TOPIC
              </th>
              <th
                scope="col"
                className="p-3.5 sm:p-4 border-r-2 border-[#111111]"
              >
                STATUS
              </th>
              <th
                scope="col"
                className="p-3.5 sm:p-4 border-r-2 border-[#111111]"
              >
                TIME
              </th>
              <th scope="col" className="p-3.5 sm:p-4 text-center">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#111111]">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-[#777777]">
                  Tidak ada query yang sesuai dengan filter ini.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#FFF3A3]/20 transition-colors"
                >
                  <td className="p-3.5 sm:p-4 border-r-2 border-[#111111] font-bold text-[#111111] max-w-xs md:max-w-sm lg:max-w-md xl:max-w-xl truncate">
                    {item.query}
                  </td>
                  <td className="p-3.5 sm:p-4 border-r-2 border-[#111111] text-[#555555]">
                    {item.action}
                  </td>
                  <td className="p-3.5 sm:p-4 border-r-2 border-[#111111]">
                    {item.status === "success" ? (
                      <span className="neo-badge neo-badge-green text-[10px]">
                        SUCCESS
                      </span>
                    ) : (
                      <span className="neo-badge neo-badge-red text-[10px]">
                        NEEDS REVIEW
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 sm:p-4 border-r-2 border-[#111111] text-[#777777]">
                    {item.timestamp}
                  </td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <Link
                      href={`/dashboard/playground?q=${encodeURIComponent(
                        item.query,
                      )}`}
                      className="inline-flex items-center gap-1 neo-btn-tab text-[11px] py-1.5 px-3 hover:bg-[#FFD600]"
                    >
                      <RotateCcw size={12} />
                      <span>ULANGI</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
