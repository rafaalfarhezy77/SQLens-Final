import { z } from "zod";

const datasetValueSchema = z.union([
  z.string(),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

export const datasetTableSchema = z
  .object({
    name: z.string().min(1),
    columns: z.array(z.string().min(1)),
    rows: z.array(z.record(datasetValueSchema)),
    relationship: z.string().optional(),
  })
  .strict();

export type DatasetTable = z.infer<typeof datasetTableSchema>;

export const educationalDatasetSchema = z
  .object({
    tables: z.array(datasetTableSchema).min(1),
  })
  .strict();

export type EducationalDataset = z.infer<typeof educationalDatasetSchema>;
