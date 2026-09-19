import { Database, Table } from "lucide-react";
import type { EducationalDataset } from "@/lib/api/contracts/datasets";

export function DatasetPreview({ dataset }: { dataset?: EducationalDataset }) {
  if (!dataset) {
    return (
      <div className="neo-card p-6 bg-white">
        <p role="alert" className="font-mono text-xs text-[#FF5A5F] font-bold">
          Dataset pendidikan belum dapat dimuat dari backend.
        </p>
      </div>
    );
  }

  return (
    <div className="neo-card h-full flex flex-col bg-white">
      <div className="bg-[#F7F7F2] p-4 border-b-2 border-[#111111] flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-tight text-[#111111]">
            <span className="w-6 h-6 bg-[#FFD600] border border-[#111111] flex items-center justify-center font-bold text-xs shadow-[1px_1px_0_#111111]">
              <Database size={14} />
            </span>
            <span>DATASET SANDBOX</span>
          </h2>
          <p className="text-xs text-[#555555] font-medium mt-0.5">
            Data sampel edukatif untuk mempraktikkan proyeksi, filter, dan join.
          </p>
        </div>
        <span className="neo-badge neo-badge-dark text-[10px] shrink-0">
          {dataset.tables.length} TABEL
        </span>
      </div>

      <div className="space-y-6 flex-1 p-4 md:p-5 overflow-x-auto">
        {dataset.tables.map((table) => (
          <div key={table.name} className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs font-bold border-b-2 border-[#111111] pb-1.5">
              <span className="flex items-center gap-1.5 text-[#111111] uppercase tracking-wide">
                <Table size={14} className="text-[#555555]" /> TABEL:{" "}
                {table.name}
              </span>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 border border-[#111111] text-[#555555] font-bold">
                {table.rows.length} BARIS
              </span>
            </div>

            <div className="border-2 border-[#111111] overflow-x-auto shadow-[2px_2px_0px_0px_#111111]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#FFF3A3] border-b-2 border-[#111111] select-none">
                  <tr>
                    {table.columns.map((column) => (
                      <th
                        key={column}
                        className="p-2 border-r border-[#111111] last:border-r-0 font-bold uppercase text-[11px] text-[#111111]"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr
                      key={`${table.name}-${table.columns.map((column) => String(row[column] ?? "")).join("|")}`}
                      className="border-b border-[#111111]/15 last:border-0 odd:bg-white even:bg-[#F7F7F2]/60 hover:bg-[#FFF9C4]/40 transition-colors"
                    >
                      {table.columns.map((column) => (
                        <td
                          key={column}
                          className="p-2 border-r border-[#111111]/20 last:border-r-0 text-black/90 font-medium text-xs"
                        >
                          {String(row[column] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
