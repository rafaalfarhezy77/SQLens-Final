import { describe, expect, it } from "vitest";

import {
  DEFAULT_SQL_QUERY,
  processQuerySimulation,
} from "@/lib/playground/query-processor";

describe("processQuerySimulation", () => {
  it("builds a four-stage JOIN explanation with metadata and filtered rows", () => {
    const result = processQuerySimulation(DEFAULT_SQL_QUERY);

    expect(result.success).toBe(true);
    expect(result.data?.steps).toHaveLength(4);
    expect(result.data?.steps[1]?.joinDetails).toMatchObject({
      leftTable: "students",
      rightTable: "scores",
      joinType: "INNER JOIN",
    });
    expect(result.data?.steps[2]?.rowsAfterCount).toBe(2);
    expect(result.data?.finalRows).toEqual([
      { name: "Andi Pratama", score: 90 },
      { name: "Budi Santoso", score: 85 },
    ]);
  });

  it("builds the single-table projection scenario", () => {
    const result = processQuerySimulation(" SELECT * FROM students; ");

    expect(result.success).toBe(true);
    expect(result.data?.query).toBe("SELECT * FROM students;");
    expect(result.data?.steps).toHaveLength(2);
    expect(result.data?.steps.every((step) => step.joinDetails === undefined)).toBe(
      true,
    );
    expect(result.data?.columns).toEqual(["id", "name", "major"]);
    expect(result.data?.totalRows).toBe(4);
  });

  it.each(["", "DELETE FROM students", "uPdAtE students SET name = 'X'", "DROP TABLE scores"]) (
    "rejects an unsupported or destructive query: %s",
    (query) => {
      const result = processQuerySimulation(query);

      expect(result).toMatchObject({ success: false });
      expect(result.data).toBeUndefined();
      expect(result.error).toBeTruthy();
    },
  );
});
