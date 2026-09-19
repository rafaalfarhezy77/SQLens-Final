import { describe, expect, it } from "vitest";
import { iotReadingSchema } from "@/lib/api/contracts/iot";
import { materialSchema, studentActivitySchema, studentProgressSchema } from "@/lib/api/contracts/lecturer";

describe("lecturer and IoT transport contracts", () => {
  it("accepts the minimal material domain", () => {
    expect(materialSchema.safeParse({ id: "m1", title: "SELECT", topic: "SQL", difficulty: "Dasar", content: "Belajar SELECT dasar.", sampleSql: "SELECT * FROM students;", status: "draft" }).success).toBe(true);
  });
  it("rejects an invalid activity status", () => {
    expect(studentActivitySchema.safeParse({ id: "a1", studentName: "S", email: "s@example.com", query: "SELECT 1", status: "pending", occurredAt: "2026-01-01T00:00:00.000Z", count: 1 }).success).toBe(false);
  });
  it("validates progress and IoT readings", () => {
    expect(studentProgressSchema.safeParse({ id: "s1", studentName: "Student", successfulQueries: 2, progressPercent: 50, latestActivity: null }).success).toBe(true);
    expect(iotReadingSchema.safeParse({ id: "r1", deviceId: "sensor-1", sensorType: "temperature", value: 25, unit: "C", recordedAt: "2026-01-01T00:00:00.000Z", status: "normal" }).success).toBe(true);
  });
});
