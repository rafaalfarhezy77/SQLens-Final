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
): Promise<{ user?: AuthenticatedUser; error?: string }> {
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
      signal: AbortSignal.timeout(5_000),
    });
    const body: unknown = await response.json().catch(() => null);
    const parsed = authenticatedUserSchema.safeParse(body);
    if (!response.ok || !parsed.success) {
      return { error: "Email atau kata sandi tidak dapat diproses." };
    }
    return { user: parsed.data };
  } catch {
    return { error: "Layanan autentikasi SQLens tidak tersedia." };
  }
}
