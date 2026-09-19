import type {
  QueryHistoryItem,
  QueryHistoryListResponse,
} from "@/lib/api/contracts/query-history";

/**
 * Planned Next BFF endpoints. These constants declare a contract only; no
 * route handler, fetch call, or successful placeholder response exists yet.
 */
export const queryHistoryEndpoints = {
  list: "/api/query-history",
  clear: "/api/query-history",
  remove: (historyId: string) =>
    `/api/query-history/${encodeURIComponent(historyId)}`,
} as const;

/**
 * Future service boundary. A concrete implementation must check HTTP status
 * and parse unknown JSON with queryHistoryListResponseSchema before returning.
 */
export interface QueryHistoryService {
  list(): Promise<QueryHistoryListResponse>;
  remove(historyId: QueryHistoryItem["id"]): Promise<void>;
  clear(): Promise<void>;
}
