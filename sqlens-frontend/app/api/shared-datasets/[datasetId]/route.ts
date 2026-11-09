import { NextResponse } from "next/server";
import { getSharedDatasetDetail } from "@/lib/api/server/shared-datasets";
import { toSafeBffError } from "@/lib/api/server/errors";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ datasetId: string }> },
): Promise<NextResponse> {
  const { datasetId } = await params;
  try {
    const detail = await getSharedDatasetDetail(datasetId);
    if (!detail) {
      return NextResponse.json(
        {
          code: "SHARED_DATASET_NOT_FOUND",
          message: "Dataset bersama tidak ditemukan.",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(detail);
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
