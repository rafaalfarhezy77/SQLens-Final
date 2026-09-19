import { NextResponse } from "next/server";

import { toSafeBffError } from "@/lib/api/server/errors";
import {
  clearQueryHistoryForCurrentUser,
  listQueryHistoryForCurrentUser,
} from "@/lib/api/server/query-history";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  try {
    const history = await listQueryHistoryForCurrentUser();
    return NextResponse.json(history);
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    await clearQueryHistoryForCurrentUser();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
