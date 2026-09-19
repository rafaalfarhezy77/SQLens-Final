import { apiErrorSchema } from "@/lib/api/contracts/api-error";
import {
  queryHistoryListResponseSchema,
  type QueryHistoryListResponse,
} from "@/lib/api/contracts/query-history";
import { queryHistoryEndpoints } from "@/lib/api/services/query-history-service";

export class QueryHistoryClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QueryHistoryClientError";
  }
}

async function getResponseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function throwPublicError(response: Response): Promise<never> {
  const payload = apiErrorSchema.safeParse(await getResponseJson(response));
  if (payload.success) {
    throw new QueryHistoryClientError(payload.data.message);
  }

  throw new QueryHistoryClientError(
    "Riwayat query tidak dapat dimuat saat ini.",
  );
}

export async function getQueryHistory(): Promise<QueryHistoryListResponse> {
  const response = await fetch(queryHistoryEndpoints.list, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    return throwPublicError(response);
  }

  const parsed = queryHistoryListResponseSchema.safeParse(
    await getResponseJson(response),
  );
  if (!parsed.success) {
    throw new QueryHistoryClientError("Riwayat query dari server tidak valid.");
  }

  return parsed.data;
}

export async function deleteQueryHistory(historyId: string): Promise<void> {
  const response = await fetch(queryHistoryEndpoints.remove(historyId), {
    method: "DELETE",
  });
  if (!response.ok) {
    return throwPublicError(response);
  }
}

export async function clearQueryHistory(): Promise<void> {
  const response = await fetch(queryHistoryEndpoints.clear, {
    method: "DELETE",
  });
  if (!response.ok) {
    return throwPublicError(response);
  }
}
