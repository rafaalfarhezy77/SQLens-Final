import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

const service = vi.hoisted(() => ({
  get: vi.fn(),
  remove: vi.fn(),
  clear: vi.fn(),
}));

vi.mock("@/lib/api/services/query-history-client", () => ({
  getQueryHistory: service.get,
  deleteQueryHistory: service.remove,
  clearQueryHistory: service.clear,
}));

import {
  useClearQueryHistoryMutation,
  useDeleteQueryHistoryMutation,
} from "@/lib/api/hooks/use-query-history-mutations";
import { useQueryHistoryQuery } from "@/lib/api/hooks/use-query-history-query";
import { apiQueryKeys } from "@/lib/api/query-keys";

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe("Query History TanStack hooks", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads remote history through the centralized list key", async () => {
    service.get.mockResolvedValue({ items: [] });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { result } = renderHook(() => useQueryHistoryQuery(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ items: [] });
    expect(client.getQueryData(apiQueryKeys.queryHistory.list())).toEqual({ items: [] });
  });

  it("invalidates history after delete and clear mutations succeed", async () => {
    service.remove.mockResolvedValue(undefined);
    service.clear.mockResolvedValue(undefined);
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidateQueries = vi.spyOn(client, "invalidateQueries");
    const { result } = renderHook(
      () => ({
        remove: useDeleteQueryHistoryMutation(),
        clear: useClearQueryHistoryMutation(),
      }),
      { wrapper: createWrapper(client) },
    );

    await result.current.remove.mutateAsync("history-1");
    await result.current.clear.mutateAsync();

    expect(service.remove).toHaveBeenCalledWith("history-1", expect.anything());
    expect(service.clear).toHaveBeenCalledWith(undefined, expect.anything());
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: apiQueryKeys.queryHistory.all(),
    });
  });
});
