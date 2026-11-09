import { NextResponse } from "next/server";
import { getStudyCaseDetail } from "@/lib/api/server/study-cases";
import { toSafeBffError } from "@/lib/api/server/errors";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> },
): Promise<NextResponse> {
  const { caseId } = await params;
  try {
    const detail = await getStudyCaseDetail(caseId);
    if (!detail) {
      return NextResponse.json(
        { code: "STUDY_CASE_NOT_FOUND", message: "Studi kasus tidak ditemukan." },
        { status: 404 },
      );
    }
    return NextResponse.json(detail);
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
