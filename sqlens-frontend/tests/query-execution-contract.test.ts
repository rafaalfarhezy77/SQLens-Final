import { describe, expect, it } from "vitest";

import {
  queryExecutionRequestSchema,
  queryExecutionResponseSchema,
} from "@/lib/api/contracts/query-execution";
import { apiErrorSchema } from "@/lib/api/contracts/api-error";
import { queryHistoryItemSchema } from "@/lib/api/contracts/query-history";

const successfulExecution = {
  status: "success",
  query: "SELECT name FROM students;",
  executionTimeMs: 8,
  columns: ["name"],
  rows: [{ name: "Andi Pratama" }],
  totalRows: 1,
  steps: [
    {
      stepNumber: 1,
      clause: "FROM students",
      title: "Source",
      badge: "01 / FROM",
      description: "Load rows",
      explanation: "Rows are read.",
      rowsBeforeCount: 1,
      rowsAfterCount: 1,
      rowEvaluations: [
        {
          id: "step-1",
          data: { name: "Andi Pratama" },
          status: "source",
          statusText: "LOADED",
          reason: "Source row",
        },
      ],
      joinDetails: {
        leftTable: "students",
        rightTable: "scores",
        leftKey: "id",
        rightKey: "student_id",
        joinType: "INNER JOIN",
      },
    },
  ],
};

describe("API runtime schemas", () => {
  it("accepts both valid execution success and public error responses", () => {
    expect(queryExecutionResponseSchema.safeParse(successfulExecution).success).toBe(
      true,
    );
    expect(
      queryExecutionResponseSchema.safeParse({
        status: "error",
        error: { code: "INVALID_QUERY", message: "Query tidak valid." },
      }).success,
    ).toBe(true);
  });

  it("rejects malformed execution rows and error envelopes", () => {
    expect(
      queryExecutionResponseSchema.safeParse({
        ...successfulExecution,
        rows: [{ name: { unsafe: true } }],
      }).success,
    ).toBe(false);
    expect(apiErrorSchema.safeParse({ code: "", message: "" }).success).toBe(
      false,
    );
  });

  it("rejects unsafe requests, malformed history dates, and invalid statuses", () => {
    expect(
      queryExecutionRequestSchema.safeParse({ query: "INSERT INTO students VALUES (1)" })
        .success,
    ).toBe(false);
    expect(
      queryHistoryItemSchema.safeParse({
        id: "h-1",
        query: "SELECT 1",
        status: "success",
        executedAt: "not-a-date",
      }).success,
    ).toBe(false);
    expect(
      queryHistoryItemSchema.safeParse({
        id: "h-1",
        query: "SELECT 1",
        status: "pending",
        executedAt: "2026-09-18T09:30:00+07:00",
      }).success,
    ).toBe(false);
  });
});
