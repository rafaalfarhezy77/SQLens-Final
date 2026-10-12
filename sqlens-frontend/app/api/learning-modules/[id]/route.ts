import { NextResponse } from "next/server";
import { materialSchema } from "@/lib/api/contracts/lecturer";
import { toSafeBffError } from "@/lib/api/server/errors";
import {
  updateMaterialForCurrentUser,
  deleteMaterialForCurrentUser,
} from "@/lib/api/server/materials";

export const runtime = "nodejs";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "INVALID_REQUEST", message: "Body JSON tidak valid." },
      { status: 400 },
    );
  }

  const updateSchema = materialSchema.omit({ id: true }).partial();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        message: "Data pembaruan materi tidak valid.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const updated = await updateMaterialForCurrentUser(id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  try {
    await deleteMaterialForCurrentUser(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
