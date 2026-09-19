import { describe, expect, it } from "vitest";

import { queryHistoryListResponseSchema } from "@/lib/api/contracts/query-history";
import { apiQueryKeys } from "@/lib/api/query-keys";
import { BffRequestError, toSafeBffError } from "@/lib/api/server/errors";

describe("query history transport contract", () => {
  it("accepts a valid server response", () => {
    const result = queryHistoryListResponseSchema.safeParse({
      items: [
        {
          id: "history-1",
          query: "SELECT * FROM students;",
          status: "success",
          executedAt: "2026-09-18T09:30:00+07:00",
          executionTimeMs: 12,
          rowCount: 3,
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid external history payload", () => {
    const result = queryHistoryListResponseSchema.safeParse({
      items: [{ id: "history-1", query: "SELECT 1", status: "unknown" }],
    });

    expect(result.success).toBe(false);
  });
});

describe("BFF error normalization", () => {
  it("keeps a public BFF error intact and safely normalizes unknown errors", () => {
    const original = new BffRequestError(503, {
      code: "UPSTREAM_UNAVAILABLE",
      message: "Layanan tidak tersedia.",
    });

    expect(toSafeBffError(original)).toBe(original);

    const normalized = toSafeBffError(new Error("private driver failure"));
    expect(normalized.status).toBe(500);
    expect(normalized.payload).toEqual({
      code: "BFF_INTERNAL_ERROR",
      message: "Layanan SQLens tidak dapat memproses permintaan saat ini.",
    });
  });
});

describe("API query keys", () => {
  it("uses a stable hierarchical key for query history", () => {
    expect(apiQueryKeys.queryHistory.all()).toEqual(["sqlens", "query-history"]);
    expect(apiQueryKeys.queryHistory.list()).toEqual(["sqlens", "query-history", "list"]);
  });
});
