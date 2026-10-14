import { describe, expect, it } from "vitest";

import {
  customDatasetInfoSchema,
  customDatasetResponseSchema,
  uploadCsvSchema,
  uploadSqlSchema,
} from "@/lib/api/contracts/custom-dataset";

describe("Custom Dataset Contracts", () => {
  it("validates a custom dataset info response with tables", () => {
    const validData = {
      has_custom_dataset: true,
      tables: [
        {
          name: "produk",
          columns: ["id", "nama", "harga"],
          rows: [{ id: 1, nama: "Laptop", harga: 12000000 }],
          relationship: "Tabel kustom produk.",
        },
      ],
    };
    const result = customDatasetInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates empty custom dataset info", () => {
    const emptyData = {
      has_custom_dataset: false,
      tables: [],
    };
    const result = customDatasetInfoSchema.safeParse(emptyData);
    expect(result.success).toBe(true);
  });

  it("validates upload CSV payload", () => {
    const csvPayload = {
      files: [
        { filename: "produk.csv", content: "id,nama\n1,Buku" },
      ],
    };
    const result = uploadCsvSchema.safeParse(csvPayload);
    expect(result.success).toBe(true);
  });

  it("rejects empty files array in upload CSV", () => {
    const emptyPayload = { files: [] };
    const result = uploadCsvSchema.safeParse(emptyPayload);
    expect(result.success).toBe(false);
  });

  it("validates upload SQL payload", () => {
    const sqlPayload = {
      sql: "CREATE TABLE test (id INT); INSERT INTO test VALUES (1);",
    };
    const result = uploadSqlSchema.safeParse(sqlPayload);
    expect(result.success).toBe(true);
  });

  it("validates custom dataset upload response", () => {
    const responsePayload = {
      status: "success",
      message: "Tabel berhasil dibuat",
      tables: [
        {
          name: "kategori",
          columns: ["id", "nama"],
          rows: [{ id: 1, nama: "Elektronik" }],
        },
      ],
    };
    const result = customDatasetResponseSchema.safeParse(responsePayload);
    expect(result.success).toBe(true);
  });
});
