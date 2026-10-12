import "server-only";

import { z } from "zod";
import { materialSchema, type Material } from "@/lib/api/contracts/lecturer";
import { callAuthenticatedFastApi } from "@/lib/api/server/fastapi-client";
import { BffRequestError } from "@/lib/api/server/errors";

const materialListResponseSchema = z.object({
  items: z.array(materialSchema),
});

export async function listMaterialsForCurrentUser(): Promise<Material[]> {
  const response = await callAuthenticatedFastApi("/v1/materials", {
    method: "GET",
  });

  if (!response.ok) {
    throw new BffRequestError(response.status, {
      code: "MATERIALS_FETCH_FAILED",
      message: "Gagal memuat materi pembelajaran.",
    });
  }

  const parsed = materialListResponseSchema.safeParse(response.body);
  if (!parsed.success) {
    return [];
  }

  return parsed.data.items;
}

export async function createMaterialForCurrentUser(
  data: Omit<Material, "id">,
): Promise<Material> {
  const response = await callAuthenticatedFastApi("/v1/materials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new BffRequestError(response.status, {
      code: "MATERIAL_CREATE_FAILED",
      message: "Gagal membuat materi pembelajaran.",
    });
  }

  const parsed = materialSchema.safeParse(response.body);
  if (!parsed.success) {
    throw new BffRequestError(500, {
      code: "INVALID_RESPONSE",
      message: "Format materi baru tidak valid.",
    });
  }

  return parsed.data;
}

export async function updateMaterialForCurrentUser(
  id: string,
  data: Partial<Omit<Material, "id">>,
): Promise<Material> {
  const response = await callAuthenticatedFastApi(`/v1/materials/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new BffRequestError(response.status, {
      code: "MATERIAL_UPDATE_FAILED",
      message: "Gagal memperbarui materi pembelajaran.",
    });
  }

  const parsed = materialSchema.safeParse(response.body);
  if (!parsed.success) {
    throw new BffRequestError(500, {
      code: "INVALID_RESPONSE",
      message: "Format materi diperbarui tidak valid.",
    });
  }

  return parsed.data;
}

export async function deleteMaterialForCurrentUser(id: string): Promise<void> {
  const response = await callAuthenticatedFastApi(`/v1/materials/${id}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 204) {
    throw new BffRequestError(response.status, {
      code: "MATERIAL_DELETE_FAILED",
      message: "Gagal menghapus materi pembelajaran.",
    });
  }
}
