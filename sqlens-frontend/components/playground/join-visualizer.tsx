import { ArrowRight, Link2 } from "lucide-react";

import type { JoinVisualizationDetails } from "@/lib/playground/query-steps";

interface JoinVisualizerProps {
  details: JoinVisualizationDetails;
  stepNumber: number;
}

/** Static, server-compatible explanation of a JOIN step from the base pipeline. */
export function JoinVisualizer({ details, stepNumber }: JoinVisualizerProps) {
  const headingId = `join-visualizer-heading-${stepNumber}`;

  return (
    <section
      aria-labelledby={headingId}
      className="border-2 border-[#111111] bg-[#FFF9C4]/40 p-4 sm:p-5 shadow-[3px_3px_0px_0px_#111111] space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#111111] pb-3">
        <h4
          id={headingId}
          className="flex items-center gap-2 font-black uppercase text-sm text-[#111111] tracking-tight"
        >
          <div className="w-6 h-6 bg-[#FFD600] border border-[#111111] flex items-center justify-center">
            <Link2 aria-hidden="true" size={14} />
          </div>
          Peta Relasi JOIN Antar-Tabel
        </h4>
        <span className="border-2 border-[#111111] bg-[#111111] px-2.5 py-1 text-xs font-mono font-bold text-[#FFD600] shadow-[2px_2px_0px_0px_#111111]">
          {details.joinType}
        </span>
      </div>

      <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
        <div className="border-2 border-[#111111] bg-white p-3.5 shadow-[2px_2px_0px_0px_#111111] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/50">
              Tabel Kiri (Left)
            </span>
            <span className="text-[10px] font-mono bg-[#FFF3A3] px-1.5 py-0.2 border border-[#111111] font-bold">
              PK
            </span>
          </div>
          <p className="font-mono text-sm font-black text-[#111111]">
            {details.leftTable}
          </p>
          <p className="text-xs text-black/70 font-mono pt-1">
            Primary key:{" "}
            <code className="font-bold text-[#111111] bg-[#F7F7F2] px-1 border border-black/20">
              {details.leftKey}
            </code>
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-1.5 p-2 bg-white border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111]">
          <span className="font-mono text-[11px] font-bold text-[#111111] bg-[#FFD600] px-2 py-0.5 border border-[#111111]">
            {details.leftKey} = {details.rightKey}
          </span>
          <ArrowRight aria-hidden="true" size={18} className="text-[#111111]" />
        </div>

        <div className="border-2 border-[#111111] bg-white p-3.5 shadow-[2px_2px_0px_0px_#111111] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/50">
              Tabel Kanan (Right)
            </span>
            <span className="text-[10px] font-mono bg-[#FFF3A3] px-1.5 py-0.2 border border-[#111111] font-bold">
              FK
            </span>
          </div>
          <p className="font-mono text-sm font-black text-[#111111]">
            {details.rightTable}
          </p>
          <p className="text-xs text-black/70 font-mono pt-1">
            Foreign key:{" "}
            <code className="font-bold text-[#111111] bg-[#F7F7F2] px-1 border border-black/20">
              {details.rightKey}
            </code>
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#111111] p-3 text-xs text-black/80 font-medium leading-relaxed">
        Baris dari kedua tabel digabung ketika nilai{" "}
        <code className="font-mono font-bold bg-[#F7F7F2] px-1 py-0.5 border border-black/20">
          {details.leftTable}.{details.leftKey}
        </code>{" "}
        sama dengan{" "}
        <code className="font-mono font-bold bg-[#F7F7F2] px-1 py-0.5 border border-black/20">
          {details.rightTable}.{details.rightKey}
        </code>
        .
      </div>
    </section>
  );
}
