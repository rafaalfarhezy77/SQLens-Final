import "server-only";

import { z } from "zod";
import { iotReadingSchema, type IoTReading } from "@/lib/api/contracts/iot";
import { callAuthenticatedFastApi } from "@/lib/api/server/fastapi-client";
import { BffRequestError } from "@/lib/api/server/errors";

const iotReadingListSchema = z.object({
  items: z.array(iotReadingSchema),
});

export async function getLatestIoTReadings(): Promise<IoTReading[]> {
  const response = await callAuthenticatedFastApi("/v1/iot/readings", {
    method: "GET",
  });

  if (!response.ok) {
    throw new BffRequestError(response.status, {
      code: "IOT_READINGS_FETCH_FAILED",
      message: "Gagal memuat data monitoring IoT.",
    });
  }

  const parsed = iotReadingListSchema.safeParse(response.body);
  if (!parsed.success) {
    console.error("IoT schema validation failed:", parsed.error);
    return [];
  }

  return parsed.data.items;
}
