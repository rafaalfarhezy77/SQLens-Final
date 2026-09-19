import { afterEach, describe, expect, it, vi } from "vitest";

import {
  QueryHistoryClientError,
  clearQueryHistory,
  deleteQueryHistory,
  getQueryHistory,
} from "@/lib/api/services/query-history-client";

const historyResponse = {
  items: [
    {
      id: "history-1",
      query: "SELECT * FROM students;",
      status: "success",
      executedAt: "2026-09-18T09:30:00+07:00",
      rowCount: 4,
    },
  ],
};

describe("Query History browser service", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads and validates the BFF list response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(historyResponse), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getQueryHistory()).resolves.toEqual(historyResponse);
    expect(fetchMock).toHaveBeenCalledWith("/api/query-history", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  });

  it("rejects malformed successful payloads and safe public errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response(JSON.stringify({ items: [{}] })))
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ code: "BACKEND_UNAVAILABLE", message: "Backend offline" }),
            { status: 503 },
          ),
        ),
    );

    await expect(getQueryHistory()).rejects.toThrow(QueryHistoryClientError);
    await expect(getQueryHistory()).rejects.toThrow("Backend offline");
  });

  it("uses BFF DELETE endpoints for one entry and all entries", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(deleteQueryHistory("a/b")).resolves.toBeUndefined();
    await expect(clearQueryHistory()).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/query-history/a%2Fb", {
      method: "DELETE",
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/query-history", {
      method: "DELETE",
    });
  });

  it("does not turn an invalid DELETE response into a successful mutation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("not json", { status: 500 })),
    );

    await expect(deleteQueryHistory("history-1")).rejects.toThrow(
      "Riwayat query tidak dapat dimuat saat ini.",
    );
    await expect(clearQueryHistory()).rejects.toThrow(QueryHistoryClientError);
  });
});
