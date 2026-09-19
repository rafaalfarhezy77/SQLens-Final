"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function HeroQueryRunner() {
  const [ran, setRan] = useState(false);

  return (
    <div className="sql-panel rounded-none">
      {/* Window Title Bar */}
      <div className="sql-panel-header">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#FF5A5F] border border-[#111111]" />
          <span className="w-3 h-3 bg-[#FFD600] border border-[#111111]" />
          <span className="w-3 h-3 bg-[#00D084] border border-[#111111]" />
          <span className="font-mono text-xs font-bold text-[#AAAAAA] ml-2">
            editor.sql
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-[#FFD600] bg-[#222222] px-2 py-0.5 border border-[#444444]">
          SQL Engine
        </span>
      </div>

      {/* Code Editor Area */}
      <div className="p-4 sm:p-5 font-mono text-sm leading-relaxed overflow-x-auto bg-[#181818]">
        <p className="text-white">
          <span className="text-[#FFD600] font-bold">SELECT</span>{" "}
          students.name, scores.score
          <br />
          <span className="text-[#FFD600] font-bold">FROM</span> students
          <br />
          <span className="text-[#FFD600] font-bold">JOIN</span> scores
          <br />
          &nbsp;&nbsp;
          <span className="text-[#FFD600] font-bold">ON</span> students.id =
          scores.student_id
          <br />
          <span className="text-[#FFD600] font-bold">WHERE</span> scores.score
          &gt;= <span className="text-[#00D084]">80;</span>
        </p>
      </div>

      {/* Action Bar */}
      <div className="px-4 py-3 bg-[#222222] border-t-2 border-b-2 border-[#333333] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setRan(true)}
          className="neo-btn text-xs py-2 px-4 bg-[#FFD600] flex items-center gap-2 shadow-[2px_2px_0_#000000]"
        >
          <Play size={14} className="fill-current text-[#111111]" />
          <span>RUN QUERY</span>
        </button>

        <span
          className={`font-mono text-xs text-[#00D084] font-bold transition-opacity ${
            ran ? "opacity-100" : "opacity-75"
          }`}
          aria-live="polite"
        >
          {ran ? "✓ Query Result: 2 rows returned" : "Ready to execute"}
        </span>
      </div>

      {/* Result Table Preview */}
      <div className="p-4 bg-[#FFFFFF] text-[#111111]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#00D084] border border-[#111111]" />
            Query Result
          </span>
          <span className="font-mono text-[10px] text-[#777777] font-semibold">
            2 ROWS AFFECTED
          </span>
        </div>

        <div className="border-2 border-[#111111] overflow-hidden">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#FFF3A3] border-b-2 border-[#111111]">
              <tr>
                <th className="p-2 border-r-2 border-[#111111] font-bold">
                  name
                </th>
                <th className="p-2 font-bold">score</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#111111]">
              <tr>
                <td className="p-2 border-r-2 border-[#111111] font-semibold">
                  Andi
                </td>
                <td className="p-2 font-bold text-[#111111]">90</td>
              </tr>
              <tr>
                <td className="p-2 border-r-2 border-[#111111] font-semibold">
                  Budi
                </td>
                <td className="p-2 font-bold text-[#111111]">85</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
