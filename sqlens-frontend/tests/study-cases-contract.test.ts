import { describe, expect, it } from "vitest";
import {
  studyCaseChallengeSchema,
  studyCaseDetailSchema,
  studyCaseListResponseSchema,
  studyCaseSummarySchema,
} from "@/lib/api/contracts/study-cases";

describe("Study Cases Contracts", () => {
  it("validates a study case challenge correctly", () => {
    const raw = {
      id: "acad-1",
      title: "Filter Mahasiswa",
      description: "Tampilkan mahasiswa Informatika",
      difficulty: "Dasar",
      hint: "Gunakan WHERE major = 'Informatika'",
      starterQuery: "SELECT * FROM students WHERE major = 'Informatika';",
    };
    const parsed = studyCaseChallengeSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });

  it("validates a study case summary", () => {
    const raw = {
      id: "ecommerce",
      title: "E-Commerce & Retail",
      category: "Bisnis",
      difficulty: "Menengah",
      description: "Database transaksi ritel online",
      tableNames: ["customers", "orders", "products"],
      sampleQueries: [
        {
          title: "Daftar Pelanggan",
          query: "SELECT * FROM customers;",
          explanation: "Query semua pelanggan",
        },
      ],
      challengesCount: 2,
    };
    const parsed = studyCaseSummarySchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });

  it("validates a study case detail with tables and challenges", () => {
    const raw = {
      id: "library",
      title: "Sistem Perpustakaan",
      category: "Layanan Publik",
      difficulty: "Dasar",
      description: "Database sirkulasi buku",
      tableNames: ["books", "members"],
      sampleQueries: [],
      challengesCount: 1,
      tables: [
        {
          name: "books",
          description: "Koleksi buku",
          columns: ["id", "title", "author"],
          sampleRows: [
            { id: 1, title: "Basis Data", author: "Bambang" },
          ],
        },
      ],
      challenges: [
        {
          id: "lib-1",
          title: "Buku Terbitan 2020",
          description: "Cari buku baru",
          difficulty: "Dasar",
          hint: "Gunakan published_year >= 2020",
          starterQuery: "SELECT * FROM books WHERE published_year >= 2020;",
        },
      ],
    };
    const parsed = studyCaseDetailSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });

  it("validates study case list response", () => {
    const raw = {
      items: [
        {
          id: "academic",
          title: "Sistem Akademik",
          category: "Pendidikan",
          difficulty: "Dasar",
          description: "Akademik",
          tableNames: ["students"],
          sampleQueries: [],
          challengesCount: 0,
        },
      ],
    };
    const parsed = studyCaseListResponseSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });
});
