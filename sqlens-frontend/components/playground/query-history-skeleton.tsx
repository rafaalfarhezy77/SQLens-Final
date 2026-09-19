/**
 * Future loading presentation for server-provided history. It remains
 * unmounted until a real source exists, so this UI never simulates history.
 */
export function QueryHistorySkeleton() {
  return (
    <div aria-label="Memuat riwayat query" className="space-y-3" role="status">
      <span className="sr-only">Memuat riwayat query</span>
      {["history-skeleton-1", "history-skeleton-2", "history-skeleton-3"].map(
        (key) => (
          <div
            key={key}
            aria-hidden="true"
            className="h-14 animate-pulse border-2 border-black bg-slate-200"
          />
        ),
      )}
    </div>
  );
}
