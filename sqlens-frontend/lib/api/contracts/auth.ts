import { z } from "zod";

export const authenticatedUserSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["mahasiswa", "dosen"]),
  })
  .strict();

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;
