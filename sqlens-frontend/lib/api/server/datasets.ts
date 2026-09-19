import "server-only";

import {
  educationalDatasetSchema,
  type EducationalDataset,
} from "@/lib/api/contracts/datasets";
import { callAuthenticatedFastApi } from "@/lib/api/server/fastapi-client";
import { BffRequestError } from "@/lib/api/server/errors";

export async function getEducationalDataset(): Promise<EducationalDataset> {
  const response = await callAuthenticatedFastApi("/v1/datasets/educational", {
    method: "GET",
  });
  const parsed = educationalDatasetSchema.safeParse(response.body);
  if (!response.ok || !parsed.success) {
    throw new BffRequestError(502, {
      code: "DATASET_UNAVAILABLE",
      message: "Dataset pendidikan tidak dapat dimuat.",
    });
  }
  return parsed.data;
}
