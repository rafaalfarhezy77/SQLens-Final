"use client";

import { useQuery } from "@tanstack/react-query";

import { apiQueryKeys } from "@/lib/api/query-keys";
import { getQueryHistory } from "@/lib/api/services/query-history-client";

export function useQueryHistoryQuery() {
  return useQuery({
    queryKey: apiQueryKeys.queryHistory.list(),
    queryFn: getQueryHistory,
  });
}
