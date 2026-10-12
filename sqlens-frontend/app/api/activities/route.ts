import { NextResponse } from "next/server";
import { toSafeBffError } from "@/lib/api/server/errors";
import { getStudentActivitiesForLecturer } from "@/lib/api/server/lecturer";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  try {
    const activities = await getStudentActivitiesForLecturer();
    return NextResponse.json(activities);
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
