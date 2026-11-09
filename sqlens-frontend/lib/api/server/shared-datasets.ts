import "server-only";

import {
  sharedDatasetDetailSchema,
  sharedDatasetListSchema,
  type SharedDataset,
  type SharedDatasetDetail,
  type UploadSharedCsvInput,
  type UploadSharedSqlInput,
} from "@/lib/api/contracts/shared-datasets";
import { callAuthenticatedFastApi } from "@/lib/api/server/fastapi-client";
import { BffRequestError } from "@/lib/api/server/errors";

export async function getSharedDatasets(): Promise<SharedDataset[]> {
  const response = await callAuthenticatedFastApi("/v1/shared-datasets", {
    method: "GET",
  });

  if (!response.ok) {
    return [];
  }

  const parsed = sharedDatasetListSchema.safeParse(response.body);
  if (!parsed.success) {
    return [];
  }

  return parsed.data.items;
}

export async function getSharedDatasetDetail(
  datasetId: string,
): Promise<SharedDatasetDetail | null> {
  const response = await callAuthenticatedFastApi(
    `/v1/shared-datasets/${datasetId}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    return null;
  }

  const parsed = sharedDatasetDetailSchema.safeParse(response.body);
  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

export async function uploadSharedCsv(
  input: UploadSharedCsvInput,
): Promise<SharedDatasetDetail> {
  const response = await callAuthenticatedFastApi(
    "/v1/lecturer/shared-datasets/upload-csv",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const errorBody = response.body as { message?: string; code?: string };
    throw new BffRequestError(response.status, {
      code: errorBody.code || "UPLOAD_SHARED_CSV_FAILED",
      message: errorBody.message || "Gagal mengunggah file CSV dataset bersama.",
    });
  }

  const parsed = sharedDatasetDetailSchema.safeParse(response.body);
  if (!parsed.success) {
    throw new BffRequestError(502, {
      code: "INVALID_BACKEND_RESPONSE",
      message: "Respon server tidak valid setelah upload dataset bersama.",
    });
  }

  return parsed.data;
}

export async function uploadSharedSql(
  input: UploadSharedSqlInput,
): Promise<SharedDatasetDetail> {
  const response = await callAuthenticatedFastApi(
    "/v1/lecturer/shared-datasets/upload-sql",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const errorBody = response.body as { message?: string; code?: string };
    throw new BffRequestError(response.status, {
      code: errorBody.code || "UPLOAD_SHARED_SQL_FAILED",
      message: errorBody.message || "Gagal mengunggah skrip SQL dataset bersama.",
    });
  }

  const parsed = sharedDatasetDetailSchema.safeParse(response.body);
  if (!parsed.success) {
    throw new BffRequestError(502, {
      code: "INVALID_BACKEND_RESPONSE",
      message: "Respon server tidak valid setelah upload dataset bersama.",
    });
  }

  return parsed.data;
}

export async function deleteSharedDataset(datasetId: string): Promise<void> {
  const response = await callAuthenticatedFastApi(
    `/v1/lecturer/shared-datasets/${datasetId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok && response.status !== 204) {
    const errorBody = response.body as { message?: string; code?: string };
    throw new BffRequestError(response.status, {
      code: errorBody.code || "DELETE_FAILED",
      message: errorBody.message || "Gagal menghapus dataset bersama.",
    });
  }
}
