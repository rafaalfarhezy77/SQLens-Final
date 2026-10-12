import { NextResponse } from "next/server";
import { toSafeBffError } from "@/lib/api/server/errors";
import { getStudentProgressForLecturer } from "@/lib/api/server/lecturer";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  try {
    const progress = await getStudentProgressForLecturer();
    return NextResponse.json(progress);
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
