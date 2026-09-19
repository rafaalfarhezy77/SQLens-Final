import "server-only";

import { apiErrorSchema, type ApiError } from "@/lib/api/contracts/api-error";
import {
  queryHistoryListResponseSchema,
  type QueryHistoryListResponse,
} from "@/lib/api/contracts/query-history";
import { callAuthenticatedFastApi } from "@/lib/api/server/fastapi-client";
import { BffRequestError } from "@/lib/api/server/errors";

function throwUpstreamError(status: number, body: unknown): never {
  const error = apiErrorSchema.safeParse(body);
  if (error.success && status < 500) {
    throw new BffRequestError(status, error.data);
  }

  throw new BffRequestError(502, {
    code: "BACKEND_RESPONSE_INVALID",
    message:
      "Layanan backend SQLens mengirim respons yang tidak dapat digunakan.",
  });
}

export async function listQueryHistoryForCurrentUser(): Promise<QueryHistoryListResponse> {
  const response = await callAuthenticatedFastApi("/v1/query-history", {
    method: "GET",
  });
  if (!response.ok) {
    throwUpstreamError(response.status, response.body);
  }

  const parsed = queryHistoryListResponseSchema.safeParse(response.body);
  if (!parsed.success) {
    throw new BffRequestError(502, {
      code: "BACKEND_RESPONSE_INVALID",
      message: "Layanan backend SQLens mengirim riwayat yang tidak valid.",
    });
  }

  return parsed.data;
}

export async function clearQueryHistoryForCurrentUser(): Promise<void> {
  const response = await callAuthenticatedFastApi("/v1/query-history", {
    method: "DELETE",
  });
  if (!response.ok) {
    throwUpstreamError(response.status, response.body);
  }
}

export async function deleteQueryHistoryForCurrentUser(
  historyId: string,
): Promise<void> {
  const response = await callAuthenticatedFastApi(
    `/v1/query-history/${encodeURIComponent(historyId)}`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    throwUpstreamError(response.status, response.body);
  }
}

export function getPublicUpstreamError(body: unknown): ApiError | null {
  const parsed = apiErrorSchema.safeParse(body);
  return parsed.success ? parsed.data : null;
}
