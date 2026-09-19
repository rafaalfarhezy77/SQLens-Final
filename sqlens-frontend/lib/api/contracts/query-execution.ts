import { z } from "zod";

import { apiErrorSchema } from "@/lib/api/contracts/api-error";
import { queryInputSchema } from "@/lib/schemas/query";

/** Reuses the current sandbox's trusted query-input constraints at the API boundary. */
export const queryExecutionRequestSchema = queryInputSchema;

const queryValueSchema = z.union([
  z.string(),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

const queryStepRowSchema = z
  .object({
    id: z.string().min(1),
    data: z.record(queryValueSchema),
    status: z.enum(["keep", "filtered", "source", "joined"]),
    statusText: z.string().min(1),
    reason: z.string().min(1),
  })
  .strict();

const joinVisualizationDetailsSchema = z
  .object({
    leftTable: z.string().min(1),
    rightTable: z.string().min(1),
    leftKey: z.string().min(1),
    rightKey: z.string().min(1),
    joinType: z.string().min(1),
  })
  .strict();

/** Mirrors the existing SQLens visual-processing model at the transport boundary. */
const queryProcessingStepSchema = z
  .object({
    stepNumber: z.number().int().positive(),
    clause: z.string().min(1),
    title: z.string().min(1),
    badge: z.string().min(1),
    description: z.string().min(1),
    explanation: z.string().min(1),
    rowsBeforeCount: z.number().int().nonnegative(),
    rowsAfterCount: z.number().int().nonnegative(),
    rowEvaluations: z.array(queryStepRowSchema),
    joinDetails: joinVisualizationDetailsSchema.optional(),
  })
  .strict();

export const queryExecutionSuccessResponseSchema = z
  .object({
    status: z.literal("success"),
    query: z.string().min(1),
    executionTimeMs: z.number().finite().nonnegative(),
    columns: z.array(z.string().min(1)),
    rows: z.array(z.record(queryValueSchema)),
    totalRows: z.number().int().nonnegative(),
    steps: z.array(queryProcessingStepSchema),
  })
  .strict();

export const queryExecutionErrorResponseSchema = z
  .object({
    status: z.literal("error"),
    error: apiErrorSchema,
  })
  .strict();

export const queryExecutionResponseSchema = z.discriminatedUnion("status", [
  queryExecutionSuccessResponseSchema,
  queryExecutionErrorResponseSchema,
]);

export type QueryExecutionRequest = z.infer<typeof queryExecutionRequestSchema>;
export type QueryExecutionSuccessResponse = z.infer<
  typeof queryExecutionSuccessResponseSchema
>;
export type QueryExecutionErrorResponse = z.infer<
  typeof queryExecutionErrorResponseSchema
>;
export type QueryExecutionResponse = z.infer<
  typeof queryExecutionResponseSchema
>;
