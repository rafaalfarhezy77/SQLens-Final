import { z } from "zod";

export const queryHistoryStatusSchema = z.enum(["success", "error"]);

/**
 * Transport contract for one persisted execution owned by the authenticated
 * user. Optional metrics are omitted when the SQL engine cannot provide them.
 */
export const queryHistoryItemSchema = z
  .object({
    id: z.string().min(1),
    query: z.string().min(1),
    status: queryHistoryStatusSchema,
    executedAt: z.string().datetime({ offset: true }),
    executionTimeMs: z.number().finite().nonnegative().optional(),
    rowCount: z.number().int().nonnegative().optional(),
  })
  .strict();

export const queryHistoryListResponseSchema = z
  .object({
    items: z.array(queryHistoryItemSchema),
  })
  .strict();

export type QueryHistoryItem = z.infer<typeof queryHistoryItemSchema>;
export type QueryHistoryListResponse = z.infer<
  typeof queryHistoryListResponseSchema
>;
