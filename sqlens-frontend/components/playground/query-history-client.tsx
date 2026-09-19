"use client";

import {
  AlertTriangle,
  History,
  Loader2,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  useClearQueryHistoryMutation,
  useDeleteQueryHistoryMutation,
} from "@/lib/api/hooks/use-query-history-mutations";
import { useQueryHistoryQuery } from "@/lib/api/hooks/use-query-history-query";
import { QueryHistoryClientError } from "@/lib/api/services/query-history-client";
import { QueryHistorySkeleton } from "@/components/playground/query-history-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

function getPublicMessage(error: unknown): string {
  if (error instanceof QueryHistoryClientError) {
    return error.message;
  }

  return "Riwayat query tidak dapat dimuat saat ini.";
}

function formatExecutedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Waktu eksekusi tidak tersedia";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function QueryHistoryClient() {
  const router = useRouter();
  const historyQuery = useQueryHistoryQuery();
  const deleteMutation = useDeleteQueryHistoryMutation();
  const clearMutation = useClearQueryHistoryMutation();
  const mutationError = deleteMutation.error ?? clearMutation.error;

  const replayQuery = (query: string) => {
    router.push(`/dashboard/playground?q=${encodeURIComponent(query)}`);
  };

  return (
    <section aria-labelledby="query-history-heading">
      <Card className="border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] bg-white">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b-2 border-[#111111] bg-[#FFD600]">
          <CardTitle
            id="query-history-heading"
            className="flex items-center gap-2 text-base md:text-lg text-[#111111]"
          >
            <History aria-hidden="true" size={18} />
            Riwayat Query
          </CardTitle>
          {historyQuery.data && historyQuery.data.items.length > 0 ? (
            <button
              type="button"
              onClick={() => clearMutation.mutate()}
              disabled={clearMutation.isPending}
              className="inline-flex items-center gap-1.5 border-2 border-[#111111] bg-white px-3 py-1.5 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#111111] hover:bg-[#F7F7F2] active:translate-x-0.5 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#111111] disabled:cursor-not-allowed disabled:opacity-60 transition-all cursor-pointer"
            >
              {clearMutation.isPending ? (
                <Loader2 aria-hidden="true" className="size-3 animate-spin" />
              ) : (
                <Trash2 aria-hidden="true" size={13} />
              )}
              Hapus Semua
            </button>
          ) : null}
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          {historyQuery.isPending ? <QueryHistorySkeleton /> : null}

          {historyQuery.isError ? (
            <div
              role="alert"
              className="border-2 border-[#ef4444] bg-red-50 p-4 text-sm text-[#111111] shadow-[3px_3px_0px_0px_#ef4444] space-y-2"
            >
              <p className="flex items-center gap-2 font-black text-[#ef4444] uppercase tracking-wide">
                <AlertTriangle aria-hidden="true" size={16} />
                Riwayat query tidak tersedia
              </p>
              <p className="text-xs font-mono text-black/80">
                {getPublicMessage(historyQuery.error)}
              </p>
              <button
                type="button"
                onClick={() => historyQuery.refetch()}
                className="mt-2 inline-flex items-center gap-1 border-2 border-[#111111] bg-[#FFD600] px-3 py-1.5 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#111111] cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          ) : null}

          {historyQuery.data?.items.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <History size={28} className="mx-auto text-black/30" />
              <p className="text-sm font-medium text-black/70">
                Belum ada query yang tercatat untuk sesi Anda.
              </p>
              <p className="text-xs text-black/50 font-mono">
                Query yang berhasil atau gagal akan otomatis tersimpan dalam
                sesi Anda.
              </p>
            </div>
          ) : null}

          {historyQuery.data && historyQuery.data.items.length > 0 ? (
            <ul className="space-y-3" aria-label="Daftar riwayat query">
              {historyQuery.data.items.map((item) => {
                const isDeleting =
                  deleteMutation.isPending &&
                  deleteMutation.variables === item.id;

                return (
                  <li
                    key={item.id}
                    className="border-2 border-[#111111] bg-[#F7F7F2] p-3.5 shadow-[2px_2px_0px_0px_#111111] hover:shadow-[3px_3px_0px_0px_#111111] transition-shadow"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <p className="font-mono text-xs font-bold text-[#111111] bg-white p-2 border border-[#111111] truncate">
                          {item.query}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-black/70">
                          <span>{formatExecutedAt(item.executedAt)}</span>
                          <span>·</span>
                          <span
                            className={cn(
                              "px-1.5 py-0.2 border text-[10px] font-bold uppercase",
                              item.status === "success"
                                ? "bg-green-100 text-green-800 border-green-400"
                                : "bg-red-100 text-red-800 border-red-400",
                            )}
                          >
                            {item.status === "success" ? "Berhasil" : "Gagal"}
                          </span>
                          {item.rowCount !== undefined ? (
                            <span>· {item.rowCount} baris</span>
                          ) : null}
                          {item.executionTimeMs !== undefined ? (
                            <span>· {item.executionTimeMs} ms</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <button
                          type="button"
                          onClick={() => replayQuery(item.query)}
                          className="inline-flex items-center gap-1 border-2 border-[#111111] bg-[#FFD600] px-2.5 py-1 text-xs font-bold shadow-[1px_1px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#111111] cursor-pointer"
                        >
                          <RotateCcw aria-hidden="true" size={12} />
                          Ulangi
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(item.id)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1 border-2 border-[#111111] bg-white px-2.5 py-1 text-xs font-bold shadow-[1px_1px_0px_0px_#111111] hover:bg-red-50 hover:text-red-600 hover:border-red-600 active:translate-x-0.5 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#111111] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                          {isDeleting ? (
                            <Loader2
                              aria-hidden="true"
                              className="size-3 animate-spin"
                            />
                          ) : (
                            <Trash2 aria-hidden="true" size={12} />
                          )}
                          Hapus
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {mutationError ? (
            <p
              role="alert"
              className="mt-4 border-2 border-[#ef4444] bg-red-50 p-3 text-xs font-mono font-medium text-[#ef4444] shadow-[2px_2px_0px_0px_#ef4444]"
            >
              {getPublicMessage(mutationError)}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
