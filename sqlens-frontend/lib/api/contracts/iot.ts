import { z } from "zod";

export const iotReadingSchema = z
  .object({
    id: z.string(),
    deviceId: z.string(),
    sensorType: z.string(),
    value: z.number().finite(),
    unit: z.string(),
    recordedAt: z.string().datetime(),
    status: z.enum(["normal", "warning", "offline"]),
  })
  .strict();
export type IoTReading = z.infer<typeof iotReadingSchema>;
