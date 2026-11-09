import "server-only";

import {
  studyCaseDetailSchema,
  studyCaseListResponseSchema,
  type StudyCaseDetail,
  type StudyCaseSummary,
} from "@/lib/api/contracts/study-cases";
import { callAuthenticatedFastApi } from "@/lib/api/server/fastapi-client";
import { BffRequestError } from "@/lib/api/server/errors";

export async function getStudyCases(): Promise<StudyCaseSummary[]> {
  const response = await callAuthenticatedFastApi("/v1/study-cases", {
    method: "GET",
  });

  if (!response.ok) {
    throw new BffRequestError(response.status, {
      code: "STUDY_CASES_UNAVAILABLE",
      message: "Daftar studi kasus tidak dapat dimuat.",
    });
  }

  const parsed = studyCaseListResponseSchema.safeParse(response.body);
  if (!parsed.success) {
    return [];
  }

  return parsed.data.items;
}

export async function getStudyCaseDetail(
  caseId: string,
): Promise<StudyCaseDetail | null> {
  const response = await callAuthenticatedFastApi(`/v1/study-cases/${caseId}`, {
    method: "GET",
  });

  if (!response.ok) {
    return null;
  }

  const parsed = studyCaseDetailSchema.safeParse(response.body);
  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}
