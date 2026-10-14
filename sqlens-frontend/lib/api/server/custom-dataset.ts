import "server-only";

import {
  customDatasetInfoSchema,
  customDatasetResponseSchema,
  type CustomDatasetInfo,
  type CustomDatasetResponse,
  type UploadCsvPayload,
  type UploadSqlPayload,
} from "@/lib/api/contracts/custom-dataset";
import { BffRequestError } from "@/lib/api/server/errors";
import { callAuthenticatedFastApi } from "@/lib/api/server/fastapi-client";

export async function getCustomDatasetInfo(): Promise<CustomDatasetInfo> {
  const response = await callAuthenticatedFastApi("/v1/datasets/custom", {
    method: "GET",
  });
  const parsed = customDatasetInfoSchema.safeParse(response.body);
  if (!response.ok || !parsed.success) {
    throw new BffRequestError(response.status || 502, {
      code: "CUSTOM_DATASET_UNAVAILABLE",
      message: "Status dataset kustom tidak dapat dimuat.",
    });
  }
  return parsed.data;
}

export async function uploadCsvCustomDataset(
  payload: UploadCsvPayload,
): Promise<CustomDatasetResponse> {
  const response = await callAuthenticatedFastApi(
    "/v1/datasets/custom/upload-csv",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const parsed = customDatasetResponseSchema.safeParse(response.body);
  if (!response.ok || !parsed.success) {
    const errorBody = response.body as { message?: string } | undefined;
    throw new BffRequestError(response.status || 400, {
      code: "UPLOAD_FAILED",
      message: errorBody?.message || "Gagal mengunggah dataset CSV.",
    });
  }
  return parsed.data;
}

export async function uploadSqlCustomDataset(
  payload: UploadSqlPayload,
): Promise<CustomDatasetResponse> {
  const response = await callAuthenticatedFastApi(
    "/v1/datasets/custom/upload-sql",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const parsed = customDatasetResponseSchema.safeParse(response.body);
  if (!response.ok || !parsed.success) {
    const errorBody = response.body as { message?: string } | undefined;
    throw new BffRequestError(response.status || 400, {
      code: "UPLOAD_FAILED",
      message: errorBody?.message || "Gagal mengunggah skrip SQL.",
    });
  }
  return parsed.data;
}

export async function resetCustomDataset(): Promise<CustomDatasetResponse> {
  const response = await callAuthenticatedFastApi("/v1/datasets/custom", {
    method: "DELETE",
  });
  const parsed = customDatasetResponseSchema.safeParse(response.body);
  if (!response.ok || !parsed.success) {
    throw new BffRequestError(response.status || 502, {
      code: "RESET_FAILED",
      message: "Gagal mereset dataset kustom.",
    });
  }
  return parsed.data;
}
