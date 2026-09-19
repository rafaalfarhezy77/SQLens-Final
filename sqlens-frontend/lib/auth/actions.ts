"use server";

import { redirect } from "next/navigation";
import {
  loginSchema,
  registerSchema,
  type AuthActionState,
} from "@/lib/schemas/auth";
import {
  createSession,
  destroySession,
  isSessionSigningConfigured,
} from "./session";
import { authenticateWithBackend } from "@/lib/api/server/auth";

/**
 * Server Action untuk memproses login mahasiswa/pengguna.
 */
export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  // 1. Validasi input menggunakan Zod
  const validation = loginSchema.safeParse({ email, password });

  if (!validation.success) {
    return {
      success: false,
      message: "Data yang dimasukkan tidak valid.",
      fieldErrors: validation.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  if (!isSessionSigningConfigured()) {
    return {
      success: false,
      message: "Konfigurasi sesi server belum tersedia.",
      timestamp: Date.now(),
    };
  }

  const result = await authenticateWithBackend(
    "/v1/auth/login",
    validation.data,
  );
  if (!result.user) {
    return {
      success: false,
      message:
        result.error ?? "Email atau kata sandi tidak cocok. Silakan coba lagi.",
      timestamp: Date.now(),
    };
  }

  // Backend verifies persisted credentials; Next owns the browser-safe session cookie.
  await createSession({
    ...result.user,
  });

  // 4. Redirect ke rute private dashboard sesuai peran
  const loginDestination =
    result.user.role === "dosen" ? "/dashboard/lecturer" : "/dashboard";
  redirect(loginDestination);
}

/**
 * Server Action untuk pendaftaran akun mahasiswa baru atau dosen.
 */
export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const role = formData.get("role")?.toString() || "mahasiswa";
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  // 1. Validasi input menggunakan Zod
  const validation = registerSchema.safeParse({
    name,
    email,
    role,
    password,
    confirmPassword,
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Periksa kembali isian formulir pendaftaran Anda.",
      fieldErrors: validation.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  if (!isSessionSigningConfigured()) {
    return {
      success: false,
      message: "Konfigurasi sesi server belum tersedia.",
      timestamp: Date.now(),
    };
  }

  const validData = validation.data;
  const result = await authenticateWithBackend("/v1/auth/register", {
    name: validData.name,
    email: validData.email,
    password: validData.password,
    role: validData.role,
  });
  if (!result.user) {
    return {
      success: false,
      message: result.error ?? "Akun tidak dapat dibuat.",
      timestamp: Date.now(),
    };
  }

  // Backend persists the account; Next owns the browser-safe session cookie.
  await createSession({
    ...result.user,
  });

  // 3. Redirect ke dashboard sesuai peran akun yang didaftarkan
  const registerDestination =
    result.user.role === "dosen" ? "/dashboard/lecturer" : "/dashboard";
  redirect(registerDestination);
}

/**
 * Server Action untuk keluar dari sesi (logout).
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
