/**
 * Central, serializable TanStack Query keys. They are defined now so future
 * client hooks do not scatter incompatible inline cache keys through the UI.
 */
export const apiQueryKeys = {
  all: ["sqlens"] as const,
  queryHistory: {
    all: () => [...apiQueryKeys.all, "query-history"] as const,
    list: () => [...apiQueryKeys.queryHistory.all(), "list"] as const,
  },
} as const;
