import { z } from "zod";
import { datasetTableSchema } from "@/lib/api/contracts/datasets";

export const customDatasetInfoSchema = z
  .object({
    has_custom_dataset: z.boolean(),
    tables: z.array(datasetTableSchema),
  })
  .strict();

export type CustomDatasetInfo = z.infer<typeof customDatasetInfoSchema>;

export const uploadCsvSchema = z
  .object({
    files: z
      .array(
        z.object({
          filename: z.string().min(1),
          content: z.string(),
        }),
      )
      .min(1)
      .max(5),
  })
  .strict();

export type UploadCsvPayload = z.infer<typeof uploadCsvSchema>;

export const uploadSqlSchema = z
  .object({
    sql: z.string().min(1),
  })
  .strict();

export type UploadSqlPayload = z.infer<typeof uploadSqlSchema>;

export const customDatasetResponseSchema = z
  .object({
    status: z.string(),
    message: z.string(),
    tables: z.array(datasetTableSchema).optional(),
  })
  .passthrough();

export type CustomDatasetResponse = z.infer<typeof customDatasetResponseSchema>;
