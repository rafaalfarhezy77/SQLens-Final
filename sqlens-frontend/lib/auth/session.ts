import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";

export const SESSION_COOKIE_NAME = "sqlens_session";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "mahasiswa" | "dosen";
  createdAt: number;
}

const sessionUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["mahasiswa", "dosen"]),
  createdAt: z.number().int().nonnegative(),
});

function getSessionSigningSecret(): string | null {
  return process.env.SQLENS_SESSION_SECRET ?? null;
}

export function isSessionSigningConfigured(): boolean {
  return Boolean(getSessionSigningSecret());
}

function signSessionPayload(encodedPayload: string): string {
  const secret = getSessionSigningSecret();

  if (!secret) {
    throw new Error("SQLens session signing is not configured.");
  }

  return createHmac("sha256", secret).update(encodedPayload).digest("hex");
}

/**
 * Membuat atau memperbarui cookie sesi sqlens_session di sisi server.
 */
export async function createSession(
  user: Omit<SessionUser, "createdAt">,
): Promise<void> {
  const cookieStore = await cookies();
  const sessionData: SessionUser = {
    ...user,
    createdAt: Date.now(),
  };

  const encodedPayload = Buffer.from(JSON.stringify(sessionData)).toString(
    "base64url",
  );
  const signature = signSessionPayload(encodedPayload);
  const serializedData = `${encodedPayload}.${signature}`;

  cookieStore.set(SESSION_COOKIE_NAME, serializedData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

/**
 * Membaca data sesi aktif dari cookie sqlens_session.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  const separatorIndex = sessionCookie.value.lastIndexOf(".");
  if (separatorIndex <= 0) {
    return null;
  }

  const encodedPayload = sessionCookie.value.slice(0, separatorIndex);
  const signature = sessionCookie.value.slice(separatorIndex + 1);

  try {
    const expectedSignature = signSessionPayload(encodedPayload);
    const receivedBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      return null;
    }

    const rawData = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const parsedSession: unknown = JSON.parse(rawData);
    const session = sessionUserSchema.safeParse(parsedSession);
    return session.success ? session.data : null;
  } catch {
    return null;
  }
}

/**
 * Menghapus cookie sesi sqlens_session saat logout.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
