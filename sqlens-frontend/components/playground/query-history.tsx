import { QueryHistoryClient } from "@/components/playground/query-history-client";
import { SqlensQueryClientProvider } from "@/components/providers/query-client-provider";

/** Keeps React Query inside the Query History client subtree. */
export function QueryHistory() {
  return (
    <SqlensQueryClientProvider>
      <QueryHistoryClient />
    </SqlensQueryClientProvider>
  );
}
