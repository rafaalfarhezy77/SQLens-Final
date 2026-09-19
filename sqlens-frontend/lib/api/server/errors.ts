import type { ApiError } from "@/lib/api/contracts/api-error";

export class BffRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly payload: ApiError,
  ) {
    super(payload.message);
  }
}

export function toSafeBffError(error: unknown): BffRequestError {
  if (error instanceof BffRequestError) {
    return error;
  }

  return new BffRequestError(500, {
    code: "BFF_INTERNAL_ERROR",
    message: "Layanan SQLens tidak dapat memproses permintaan saat ini.",
  });
}
