import "server-only";

import {
  authenticatedUserSchema,
  type AuthenticatedUser,
} from "@/lib/api/contracts/auth";

type AuthPayload = {
  email: string;
  password: string;
  name?: string;
  role?: "mahasiswa" | "dosen";
};

function getBackendBaseUrl(): string | null {
  const value = process.env.SQLENS_FASTAPI_BASE_URL;
  return value ? value.replace(/\/$/, "") : null;
}

export async function authenticateWithBackend(
  path: "/v1/auth/login" | "/v1/auth/register",
  payload: AuthPayload,
): Promise<{ user?: AuthenticatedUser; error?: string; isWaking?: boolean }> {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl)
    return { error: "Integrasi autentikasi backend belum dikonfigurasi." };

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (response.status === 502 || response.status === 503 || response.status === 504) {
      return {
        error:
          "Server sedang bangun dari mode tidur (Render free tier). Silakan tunggu sekitar 15 detik lalu coba lagi.",
        isWaking: true,
      };
    }

    const body: unknown = await response.json().catch(() => null);
    const parsed = authenticatedUserSchema.safeParse(body);
    if (!response.ok || !parsed.success) {
      return { error: "Email atau kata sandi tidak dapat diproses." };
    }
    return { user: parsed.data };
  } catch (err: unknown) {
    const isTimeout =
      (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) ||
      (typeof DOMException !== "undefined" && err instanceof DOMException && err.name === "TimeoutError");

    return {
      error:
        "Server backend sedang dinyalakan (Render free tier butuh waktu bangun). Silakan tunggu 15 detik lalu coba lagi.",
      isWaking: true,
    };
  }
}
