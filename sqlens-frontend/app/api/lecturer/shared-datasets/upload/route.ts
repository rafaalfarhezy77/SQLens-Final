import { NextResponse } from "next/server";
import {
  uploadSharedCsvSchema,
  uploadSharedSqlSchema,
} from "@/lib/api/contracts/shared-datasets";
import {
  uploadSharedCsv,
  uploadSharedSql,
} from "@/lib/api/server/shared-datasets";
import { toSafeBffError } from "@/lib/api/server/errors";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "INVALID_JSON", message: "Body JSON tidak valid." },
      { status: 400 },
    );
  }

  // Check if CSV or SQL
  const isSql = typeof body === "object" && body !== null && "sql" in body;

  try {
    if (isSql) {
      const parsed = uploadSharedSqlSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          {
            code: "VALIDATION_ERROR",
            message: "Format upload SQL tidak valid.",
            fieldErrors: parsed.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      }
      const result = await uploadSharedSql(parsed.data);
      return NextResponse.json(result, { status: 201 });
    }

    const parsed = uploadSharedCsvSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: "Format upload CSV tidak valid.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const result = await uploadSharedCsv(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
