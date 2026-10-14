import { NextResponse } from "next/server";
import { z } from "zod";

import {
  uploadCsvSchema,
  uploadSqlSchema,
} from "@/lib/api/contracts/custom-dataset";
import { toSafeBffError } from "@/lib/api/server/errors";
import {
  uploadCsvCustomDataset,
  uploadSqlCustomDataset,
} from "@/lib/api/server/custom-dataset";

export const runtime = "nodejs";

const uploadPayloadSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("csv"),
    files: uploadCsvSchema.shape.files,
  }),
  z.object({
    type: z.literal("sql"),
    sql: uploadSqlSchema.shape.sql,
  }),
]);

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "INVALID_REQUEST", message: "Body JSON tidak valid." },
      { status: 400 },
    );
  }

  const input = uploadPayloadSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      {
        code: "INVALID_PAYLOAD",
        message: "Format data upload tidak valid.",
        fieldErrors: input.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    if (input.data.type === "csv") {
      const result = await uploadCsvCustomDataset({ files: input.data.files });
      return NextResponse.json(result, { status: 200 });
    } else {
      const result = await uploadSqlCustomDataset({ sql: input.data.sql });
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
