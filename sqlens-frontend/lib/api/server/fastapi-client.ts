import "server-only";

import { createHmac } from "node:crypto";

import { getSession } from "@/lib/auth/session";
import { BffRequestError } from "@/lib/api/server/errors";

interface FastApiResponse {
  body: unknown;
  ok: boolean;
  status: number;
}

function getFastApiConfiguration(): { baseUrl: string; sharedSecret: string } {
  const baseUrl = process.env.SQLENS_FASTAPI_BASE_URL;
  const sharedSecret = process.env.SQLENS_BFF_SHARED_SECRET;

  if (!baseUrl || !sharedSecret) {
    throw new BffRequestError(503, {
      code: "BACKEND_CONFIGURATION_UNAVAILABLE",
      message: "Integrasi layanan SQLens belum dikonfigurasi.",
    });
  }

  return { baseUrl: baseUrl.replace(/\/$/, ""), sharedSecret };
}

export async function callAuthenticatedFastApi(
  path: string,
  init: RequestInit,
): Promise<FastApiResponse> {
  const session = await getSession();
  if (!session) {
    throw new BffRequestError(401, {
      code: "UNAUTHORIZED",
      message: "Sesi pengguna tidak tersedia.",
    });
  }

  const { baseUrl, sharedSecret } = getFastApiConfiguration();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", sharedSecret)
    .update(`${timestamp}.${session.id}`)
    .digest("hex");

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...init.headers,
        "x-sqlens-user-id": session.id,
        "x-sqlens-bff-timestamp": timestamp,
        "x-sqlens-bff-signature": signature,
      },
      signal: AbortSignal.timeout(5_000),
    });
  } catch {
    throw new BffRequestError(503, {
      code: "BACKEND_UNAVAILABLE",
      message: "Layanan backend SQLens tidak tersedia.",
    });
  }

  if (response.status === 204) {
    return { body: undefined, ok: response.ok, status: response.status };
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // The caller maps a non-JSON upstream payload to a safe public error.
  }

  return { body, ok: response.ok, status: response.status };
}
