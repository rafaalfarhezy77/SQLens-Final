import "server-only";

import {
  queryExecutionResponseSchema,
  type QueryExecutionRequest,
  type QueryExecutionResponse,
} from "@/lib/api/contracts/query-execution";
import { apiErrorSchema } from "@/lib/api/contracts/api-error";
import { callAuthenticatedFastApi } from "@/lib/api/server/fastapi-client";
import { BffRequestError } from "@/lib/api/server/errors";

export async function executeQueryForCurrentUser(
  input: QueryExecutionRequest,
): Promise<{ payload: QueryExecutionResponse; status: number }> {
  const response = await callAuthenticatedFastApi("/v1/query-executions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const parsed = queryExecutionResponseSchema.safeParse(response.body);
  if (!parsed.success) {
    const publicError = apiErrorSchema.safeParse(response.body);
    if (publicError.success && response.status < 500) {
      throw new BffRequestError(response.status, publicError.data);
    }

    throw new BffRequestError(502, {
      code: "BACKEND_RESPONSE_INVALID",
      message:
        "Layanan backend SQLens mengirim hasil eksekusi yang tidak valid.",
    });
  }

  return { payload: parsed.data, status: response.status };
}
