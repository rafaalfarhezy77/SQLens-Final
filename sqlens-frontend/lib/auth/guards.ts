import "server-only";

import { redirect } from "next/navigation";
import { getSession, type SessionUser } from "@/lib/auth/session";

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect("/login?unauthorized=1");
  return session;
}

export async function requireDosen(): Promise<SessionUser> {
  const session = await requireSession();
  if (session.role !== "dosen") redirect("/dashboard?forbidden=lecturer");
  return session;
}
