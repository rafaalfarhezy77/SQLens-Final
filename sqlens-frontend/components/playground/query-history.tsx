import { QueryHistoryClient } from "@/components/playground/query-history-client";
import { SqlensQueryClientProvider } from "@/components/providers/query-client-provider";

export interface QueryHistoryProps {
  limit?: number;
  showViewAllLink?: boolean;
}

/** Keeps React Query inside the Query History client subtree. */
export function QueryHistory({
  limit,
  showViewAllLink,
}: QueryHistoryProps = {}) {
  return (
    <SqlensQueryClientProvider>
      <QueryHistoryClient limit={limit} showViewAllLink={showViewAllLink} />
    </SqlensQueryClientProvider>
  );
}
