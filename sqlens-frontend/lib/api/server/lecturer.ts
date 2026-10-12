import "server-only";

import { z } from "zod";
import {
  studentActivitySchema,
  studentProgressSchema,
  type StudentActivity,
  type StudentProgress,
} from "@/lib/api/contracts/lecturer";
import { callAuthenticatedFastApi } from "@/lib/api/server/fastapi-client";
import { BffRequestError } from "@/lib/api/server/errors";

const studentActivityListSchema = z.object({
  items: z.array(studentActivitySchema),
});

const studentProgressListSchema = z.object({
  items: z.array(studentProgressSchema),
});

export async function getStudentActivitiesForLecturer(): Promise<StudentActivity[]> {
  const response = await callAuthenticatedFastApi("/v1/lecturer/activities", {
    method: "GET",
  });

  if (!response.ok) {
    throw new BffRequestError(response.status, {
      code: "ACTIVITIES_FETCH_FAILED",
      message: "Gagal memuat data aktivitas mahasiswa.",
    });
  }

  const parsed = studentActivityListSchema.safeParse(response.body);
  if (!parsed.success) {
    return [];
  }

  return parsed.data.items;
}

export async function getStudentProgressForLecturer(): Promise<StudentProgress[]> {
  const response = await callAuthenticatedFastApi("/v1/lecturer/progress", {
    method: "GET",
  });

  if (!response.ok) {
    throw new BffRequestError(response.status, {
      code: "PROGRESS_FETCH_FAILED",
      message: "Gagal memuat data progres mahasiswa.",
    });
  }

  const parsed = studentProgressListSchema.safeParse(response.body);
  if (!parsed.success) {
    return [];
  }

  return parsed.data.items;
}
