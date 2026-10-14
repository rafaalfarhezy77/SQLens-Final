import { NextResponse } from "next/server";

import { toSafeBffError } from "@/lib/api/server/errors";
import {
  getCustomDatasetInfo,
  resetCustomDataset,
} from "@/lib/api/server/custom-dataset";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  try {
    const data = await getCustomDatasetInfo();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    const data = await resetCustomDataset();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
