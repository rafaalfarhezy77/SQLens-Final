import { NextResponse } from "next/server";
import { z } from "zod";

import { toSafeBffError } from "@/lib/api/server/errors";
import { deleteQueryHistoryForCurrentUser } from "@/lib/api/server/query-history";

const historyIdSchema = z.string().uuid();

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ historyId: string }> },
): Promise<NextResponse> {
  const { historyId } = await params;
  const parsedHistoryId = historyIdSchema.safeParse(historyId);

  if (!parsedHistoryId.success) {
    return NextResponse.json(
      {
        code: "INVALID_HISTORY_ID",
        message: "Identitas riwayat query tidak valid.",
      },
      { status: 400 },
    );
  }

  try {
    await deleteQueryHistoryForCurrentUser(parsedHistoryId.data);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
