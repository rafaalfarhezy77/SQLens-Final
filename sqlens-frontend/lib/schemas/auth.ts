import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .min(1, "Email tidak boleh kosong")
    .email("Format alamat email tidak valid"),
  password: z
    .string({ required_error: "Kata sandi wajib diisi" })
    .min(1, "Kata sandi tidak boleh kosong")
    .min(6, "Kata sandi minimal 6 karakter"),
});

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: "Nama lengkap wajib diisi" })
      .min(1, "Nama lengkap tidak boleh kosong")
      .min(2, "Nama lengkap minimal 2 karakter"),
    email: z
      .string({ required_error: "Email wajib diisi" })
      .min(1, "Email tidak boleh kosong")
      .email("Format alamat email tidak valid"),
    password: z
      .string({ required_error: "Kata sandi wajib diisi" })
      .min(1, "Kata sandi tidak boleh kosong")
      .min(6, "Kata sandi minimal 6 karakter"),
    confirmPassword: z
      .string({ required_error: "Konfirmasi kata sandi wajib diisi" })
      .min(1, "Konfirmasi kata sandi tidak boleh kosong"),
    role: z
      .enum(["mahasiswa", "dosen"], {
        invalid_type_error: "Role tidak valid",
      })
      .default("mahasiswa"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok dengan kata sandi",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export interface AuthActionState {
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  timestamp?: number;
}
