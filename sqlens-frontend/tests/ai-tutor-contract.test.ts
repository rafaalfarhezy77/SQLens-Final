import { describe, expect, it } from "vitest";

import { aiTutorResponseSchema } from "@/lib/api/contracts/ai-tutor";

describe("AI Tutor contract", () => {
  const validResponse = {
    explanation: "WHERE menyaring baris setelah sumber data dibaca.",
    hint: "Periksa nama kolom dan operator perbandingan.",
    sqlConcept: "Filter deterministik", 
    reasoning: ["Baca tabel", "Evaluasi predikat"],
  };

  it("accepts the structured educational response", () => {
    expect(aiTutorResponseSchema.safeParse(validResponse).success).toBe(true);
  });

  it("rejects arbitrary provider payloads", () => {
    expect(aiTutorResponseSchema.safeParse({ explanation: "tanpa kontrak" }).success).toBe(false);
  });
});
