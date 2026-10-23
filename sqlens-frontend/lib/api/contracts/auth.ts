import { z } from "zod";

export const authenticatedUserSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["mahasiswa", "dosen"]),
    accessToken: z.string().optional().nullable(),
    tokenType: z.string().optional().nullable(),
  })
  .passthrough();

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;
