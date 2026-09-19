import { NextResponse } from "next/server";

import { queryExecutionRequestSchema } from "@/lib/api/contracts/query-execution";
import { toSafeBffError } from "@/lib/api/server/errors";
import { executeQueryForCurrentUser } from "@/lib/api/server/query-execution";

export const runtime = "nodejs";

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

  const input = queryExecutionRequestSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      {
        code: "INVALID_QUERY",
        message: "Query SQL tidak valid.",
        fieldErrors: input.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const response = await executeQueryForCurrentUser(input.data);
    return NextResponse.json(response.payload, { status: response.status });
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
