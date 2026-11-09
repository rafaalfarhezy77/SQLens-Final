import { NextResponse } from "next/server";
import { getStudyCases } from "@/lib/api/server/study-cases";
import { toSafeBffError } from "@/lib/api/server/errors";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  try {
    const items = await getStudyCases();
    return NextResponse.json({ items });
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
