import { describe, expect, it } from "vitest";

import { registerSchema } from "@/lib/schemas/auth";
import { queryInputSchema } from "@/lib/schemas/query";

describe("queryInputSchema", () => {
  it("accepts a read-only SELECT query and normalizes its surrounding whitespace", () => {
    const result = queryInputSchema.safeParse({ query: "  SELECT * FROM students;  " });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.query).toBe("SELECT * FROM students;");
    }
  });

  it("rejects destructive SQL commands", () => {
    const result = queryInputSchema.safeParse({ query: "DROP TABLE students;" });

    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("reports a mismatched password confirmation", () => {
    const result = registerSchema.safeParse({
      name: "Budi Santoso",
      email: "budi@student.example",
      password: "password123",
      confirmPassword: "different-password",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toContain(
        "Konfirmasi kata sandi tidak cocok dengan kata sandi",
      );
    }
  });
});
