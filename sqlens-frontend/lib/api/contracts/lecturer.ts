import { z } from "zod";

export const materialSchema = z
  .object({
    id: z.string(),
    title: z.string().min(3),
    topic: z.string().min(2),
    difficulty: z.enum(["Dasar", "Menengah", "Lanjut"]),
    content: z.string().min(10),
    sampleSql: z.string().min(6),
    status: z.enum(["draft", "published"]),
  })
  .strict();
export const studentActivitySchema = z
  .object({
    id: z.string(),
    studentName: z.string(),
    email: z.string().email(),
    query: z.string(),
    status: z.enum(["success", "error"]),
    occurredAt: z.string().datetime(),
    count: z.number().int().nonnegative(),
  })
  .strict();
export const studentProgressSchema = z
  .object({
    id: z.string(),
    studentName: z.string(),
    successfulQueries: z.number().int().nonnegative(),
    progressPercent: z.number().int().min(0).max(100),
    latestActivity: z.string().datetime().nullable(),
  })
  .strict();
export type Material = z.infer<typeof materialSchema>;
export type StudentActivity = z.infer<typeof studentActivitySchema>;
export type StudentProgress = z.infer<typeof studentProgressSchema>;
