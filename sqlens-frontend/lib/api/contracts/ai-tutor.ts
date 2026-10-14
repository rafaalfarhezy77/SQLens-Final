import { z } from "zod";

export const aiTutorResponseSchema = z
  .object({
    explanation: z.string().min(1).max(4_000),
    hint: z.string().min(1).max(1_000),
    sqlConcept: z.union([
      z.string().min(1).max(1_000),
      z.array(z.string()).transform((arr) => arr.join(", ")),
    ]),
    reasoning: z.union([
      z.array(z.string().min(1).max(600)).min(1).max(10),
      z.string().transform((str) => [str]),
    ]),
  })
  .passthrough();

export type AiTutorResponse = z.infer<typeof aiTutorResponseSchema>;
