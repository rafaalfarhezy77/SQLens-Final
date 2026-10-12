import { NextResponse } from "next/server";
import { materialSchema } from "@/lib/api/contracts/lecturer";
import { toSafeBffError } from "@/lib/api/server/errors";
import {
  listMaterialsForCurrentUser,
  createMaterialForCurrentUser,
} from "@/lib/api/server/materials";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  try {
    const materials = await listMaterialsForCurrentUser();
    return NextResponse.json(materials);
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}

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

  const createSchema = materialSchema.omit({ id: true });
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        message: "Data materi tidak valid.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const newMaterial = await createMaterialForCurrentUser(parsed.data);
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    const safeError = toSafeBffError(error);
    return NextResponse.json(safeError.payload, { status: safeError.status });
  }
}
