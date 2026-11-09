import { z } from "zod";

import { datasetTableSchema } from "@/lib/api/contracts/datasets";

export const sharedDatasetSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string(),
    schemaName: z.string().min(1),
    tableNames: z.array(z.string().min(1)),
    createdBy: z.string().min(1),
    createdByName: z.string().min(1),
    isActive: z.boolean(),
    createdAt: z.string(),
  })
  .strict();

export type SharedDataset = z.infer<typeof sharedDatasetSchema>;

export const sharedDatasetListSchema = z
  .object({
    items: z.array(sharedDatasetSchema),
  })
  .strict();

export type SharedDatasetList = z.infer<typeof sharedDatasetListSchema>;

export const sharedDatasetDetailSchema = sharedDatasetSchema.extend({
  tables: z.array(datasetTableSchema),
});

export type SharedDatasetDetail = z.infer<typeof sharedDatasetDetailSchema>;

export const uploadSharedCsvSchema = z
  .object({
    title: z.string().trim().min(3, "Judul dataset minimal 3 karakter").max(150),
    description: z.string().max(500).default(""),
    files: z
      .array(
        z.object({
          filename: z.string().min(1),
          content: z.string(),
        }),
      )
      .min(1, "Minimal 1 file CSV")
      .max(5, "Maksimal 5 file CSV"),
  })
  .strict();

export type UploadSharedCsvInput = z.infer<typeof uploadSharedCsvSchema>;

export const uploadSharedSqlSchema = z
  .object({
    title: z.string().trim().min(3, "Judul dataset minimal 3 karakter").max(150),
    description: z.string().max(500).default(""),
    sql: z.string().min(1, "Skrip SQL tidak boleh kosong"),
  })
  .strict();

export type UploadSharedSqlInput = z.infer<typeof uploadSharedSqlSchema>;
