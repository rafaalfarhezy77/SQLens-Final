import { NextResponse } from "next/server";
import { getSharedDatasets } from "@/lib/api/server/shared-datasets";
import { toSafeBffError } from "@/lib/api/server/errors";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  try {
    const items = await getSharedDatasets();
    return NextResponse.json({ items });
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
