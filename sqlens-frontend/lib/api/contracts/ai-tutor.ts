import { z } from "zod";

export const aiTutorResponseSchema = z
  .object({
    explanation: z.string().min(1).max(4_000),
    hint: z.string().min(1).max(1_000),
    sqlConcept: z.string().min(1).max(1_000),
    reasoning: z.array(z.string().min(1).max(600)).min(1).max(5),
  })
  .strict();

export type AiTutorResponse = z.infer<typeof aiTutorResponseSchema>;
