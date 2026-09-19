import { z } from "zod";

const PROHIBITED_KEYWORDS = [
  "DROP",
  "DELETE",
  "TRUNCATE",
  "ALTER",
  "UPDATE",
  "INSERT INTO",
  "GRANT",
  "REVOKE",
];

export const queryInputSchema = z.object({
  query: z
    .string({ required_error: "Query SQL tidak boleh kosong" })
    .trim()
    .min(5, "Query SQL minimal 5 karakter")
    .max(500, "Query SQL maksimal 500 karakter untuk simulasi sandbox")
    .refine(
      (val) => {
        const upper = val.toUpperCase();
        return !PROHIBITED_KEYWORDS.some((kw) => upper.includes(kw));
      },
      {
        message:
          "Operasi destruktif (DROP, DELETE, TRUNCATE, ALTER, UPDATE) tidak diizinkan dalam sandbox edukasi SQLens.",
      },
    ),
});

export type QueryInput = z.infer<typeof queryInputSchema>;

export interface QueryExecutionResult {
  success: boolean;
  message?: string;
  error?: string;
  query: string;
  executionTimeMs: number;
  columns: string[];
  rows: Record<string, string | number>[];
  totalRows: number;
}
