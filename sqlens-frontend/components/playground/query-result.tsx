import { CheckCircle2, Clock, Table, AlertTriangle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { QueryExecutionSuccessResponse } from "@/lib/api/contracts/query-execution";

export interface QueryResultProps {
  result?: QueryExecutionSuccessResponse;
  error?: string;
}

export function QueryResult({ result, error }: QueryResultProps) {
  if (error) {
    return (
      <Card
        variant="white"
        className="border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111]"
      >
        <CardHeader className="bg-red-50 border-b-2 border-[#111111]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#ef4444] text-base">
              <AlertTriangle size={18} /> Eksekusi Query Ditolak
            </CardTitle>
            <Badge variant="error">ERROR</Badge>
          </div>
          <CardDescription className="text-black/70">
            Engine database SQLens tidak dapat memproses perintah yang
            diberikan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-3">
          <div className="text-xs font-mono font-medium text-[#ef4444] bg-white p-3.5 border-2 border-[#ef4444] shadow-[2px_2px_0px_0px_#ef4444] leading-relaxed">
            <span className="font-black block mb-1">PESAN ENGINE:</span>
            {error}
          </div>
          <p className="text-xs text-black/60 font-mono">
            *Tips: Pastikan sintaks kueri sesuai standar SQLens (SELECT ... FROM
            ... WHERE ...).
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card
        variant="white"
        className="border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111]"
      >
        <CardContent className="py-12 px-6 text-center space-y-4">
          <div className="w-14 h-14 bg-[#FFF3A3] border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] flex items-center justify-center mx-auto text-[#111111]">
            <Table size={28} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <p className="font-mono text-xs md:text-sm font-black uppercase tracking-wider text-[#111111]">
              HASIL QUERY AKAN MUNCUL DI SINI
            </p>
            <p className="text-xs text-black/70 font-medium leading-relaxed">
              Tulis query SQL pada editor di atas atau pilih salah satu preset,
              lalu klik{" "}
              <strong className="text-[#111111] underline">
                Jalankan Query
              </strong>{" "}
              untuk melihat result set dan alur visualisasi.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { columns, rows, totalRows, executionTimeMs } = result;

  return (
    <Card
      variant="white"
      className="border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111]"
    >
      <CardHeader className="bg-[#F7F7F2] border-b-2 border-[#111111]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#22c55e] border-2 border-[#111111] flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#111111]">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <CardTitle className="text-base">
                Hasil Query Akhir (Result Set)
              </CardTitle>
              <CardDescription className="text-xs">
                Dataset final setelah evaluasi seluruh klausa dan filter.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
            <Badge variant="yellow">{totalRows} Baris</Badge>
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111] text-black font-bold">
              <Clock size={12} className="text-black/60" /> {executionTimeMs}ms
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead className="bg-[#FFF3A3] border-b-2 border-[#111111] sticky top-0 z-10 select-none">
            <tr>
              <th className="p-3 border-r-2 border-[#111111] text-black/60 w-12 text-center font-bold">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="p-3 border-r-2 border-[#111111] last:border-r-0 font-black uppercase tracking-wider text-[#111111]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="p-8 text-center text-black/50 italic font-mono bg-white"
                >
                  Tidak ada baris data yang memenuhi kondisi kueri (0 baris).
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={columns.map((column) => String(row[column])).join("|")}
                  className="border-b border-[#111111]/15 last:border-b-0 odd:bg-white even:bg-[#F7F7F2]/70 hover:bg-[#FFF9C4]/45 transition-colors"
                >
                  <td className="p-2.5 border-r border-[#111111]/30 text-center text-black/40 font-bold select-none">
                    {idx + 1}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="p-2.5 border-r border-[#111111]/30 last:border-r-0 font-medium text-[#111111]"
                    >
                      {String(row[col] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
