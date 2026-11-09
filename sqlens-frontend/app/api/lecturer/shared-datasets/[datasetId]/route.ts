import { NextResponse } from "next/server";
import { deleteSharedDataset } from "@/lib/api/server/shared-datasets";
import { toSafeBffError } from "@/lib/api/server/errors";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ datasetId: string }> },
): Promise<NextResponse> {
  const { datasetId } = await params;
  try {
    await deleteSharedDataset(datasetId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
