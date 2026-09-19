import { z } from "zod";

/**
 * Public error envelope returned by a future Next BFF or FastAPI service.
 * It intentionally excludes raw database, provider, and stack-trace details.
 */
export const apiErrorSchema = z
  .object({
    code: z.string().min(1),
    message: z.string().min(1),
    fieldErrors: z.record(z.array(z.string().min(1))).optional(),
  })
  .strict();

export type ApiError = z.infer<typeof apiErrorSchema>;
