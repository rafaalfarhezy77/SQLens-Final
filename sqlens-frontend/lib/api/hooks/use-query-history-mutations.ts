"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiQueryKeys } from "@/lib/api/query-keys";
import {
  clearQueryHistory,
  deleteQueryHistory,
} from "@/lib/api/services/query-history-client";

export function useDeleteQueryHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQueryHistory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: apiQueryKeys.queryHistory.all(),
      });
    },
  });
}

export function useClearQueryHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearQueryHistory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: apiQueryKeys.queryHistory.all(),
      });
    },
  });
}
