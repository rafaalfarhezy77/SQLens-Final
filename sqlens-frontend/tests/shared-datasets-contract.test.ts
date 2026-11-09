import { describe, expect, it } from "vitest";
import {
  sharedDatasetDetailSchema,
  sharedDatasetListSchema,
  sharedDatasetSchema,
  uploadSharedCsvSchema,
  uploadSharedSqlSchema,
} from "@/lib/api/contracts/shared-datasets";

describe("Shared Datasets Contracts", () => {
  it("validates a shared dataset item", () => {
    const raw = {
      id: "sh-1",
      title: "Dataset Praktikum 1",
      description: "Data penjualan",
      schemaName: "shared_abc123",
      tableNames: ["penjualan", "barang"],
      createdBy: "dos_1",
      createdByName: "Dr. Budi",
      isActive: true,
      createdAt: "2026-02-01T10:00:00Z",
    };
    const parsed = sharedDatasetSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });

  it("validates shared dataset detail with tables", () => {
    const raw = {
      id: "sh-1",
      title: "Dataset Praktikum 1",
      description: "Data penjualan",
      schemaName: "shared_abc123",
      tableNames: ["barang"],
      createdBy: "dos_1",
      createdByName: "Dr. Budi",
      isActive: true,
      createdAt: "2026-02-01T10:00:00Z",
      tables: [
        {
          name: "barang",
          columns: ["id", "nama"],
          rows: [{ id: 1, nama: "Buku" }],
        },
      ],
    };
    const parsed = sharedDatasetDetailSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });

  it("validates upload CSV payload", () => {
    const raw = {
      title: "Dataset Penjualan Mobil",
      description: "CSV praktikum 2",
      files: [
        {
          filename: "mobil.csv",
          content: "id,merk,harga\n1,Toyota,200\n",
        },
      ],
    };
    const parsed = uploadSharedCsvSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });

  it("rejects upload CSV payload with empty title", () => {
    const raw = {
      title: "",
      files: [{ filename: "mobil.csv", content: "id\n1\n" }],
    };
    const parsed = uploadSharedCsvSchema.safeParse(raw);
    expect(parsed.success).toBe(false);
  });

  it("validates upload SQL payload", () => {
    const raw = {
      title: "Skrip DDL Bank",
      description: "Tabel nasabah",
      sql: "CREATE TABLE nasabah (id INT, nama VARCHAR(100));",
    };
    const parsed = uploadSharedSqlSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });
});
