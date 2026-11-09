import { z } from "zod";

const datasetValueSchema = z.union([
  z.string(),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

export const studyCaseChallengeSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    difficulty: z.string().min(1),
    hint: z.string().min(1),
    starterQuery: z.string().min(1),
  })
  .strict();

export type StudyCaseChallenge = z.infer<typeof studyCaseChallengeSchema>;

export const studyCaseTableSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    columns: z.array(z.string().min(1)),
    sampleRows: z.array(z.record(datasetValueSchema)),
  })
  .strict();

export type StudyCaseTable = z.infer<typeof studyCaseTableSchema>;

export const sampleQuerySchema = z
  .object({
    title: z.string().min(1),
    query: z.string().min(1),
    explanation: z.string().min(1),
  })
  .strict();

export type SampleQuery = z.infer<typeof sampleQuerySchema>;

export const studyCaseSummarySchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    category: z.string().min(1),
    difficulty: z.string().min(1),
    description: z.string().min(1),
    tableNames: z.array(z.string().min(1)),
    sampleQueries: z.array(sampleQuerySchema),
    challengesCount: z.number().int().nonnegative(),
  })
  .strict();

export type StudyCaseSummary = z.infer<typeof studyCaseSummarySchema>;

export const studyCaseDetailSchema = studyCaseSummarySchema.extend({
  tables: z.array(studyCaseTableSchema),
  challenges: z.array(studyCaseChallengeSchema),
});

export type StudyCaseDetail = z.infer<typeof studyCaseDetailSchema>;

export const studyCaseListResponseSchema = z
  .object({
    items: z.array(studyCaseSummarySchema),
  })
  .strict();

export type StudyCaseListResponse = z.infer<typeof studyCaseListResponseSchema>;
