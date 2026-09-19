from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import get_settings
from app.core.errors import PublicApiError

settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.1.0")
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.exception_handler(PublicApiError)
async def handle_public_api_error(_: Request, error: PublicApiError) -> JSONResponse:
    return JSONResponse(status_code=error.status_code, content=error.as_payload())


@app.exception_handler(RequestValidationError)
async def handle_validation_error(_: Request, error: RequestValidationError) -> JSONResponse:
    field_errors: dict[str, list[str]] = {}
    for issue in error.errors():
        location = issue.get("loc", [])
        field_name = str(location[-1]) if location else "request"
        message = str(issue.get("msg", "Input tidak valid."))
        field_errors.setdefault(field_name, []).append(message)

    return JSONResponse(
        status_code=422,
        content={
            "code": "VALIDATION_ERROR",
            "message": "Permintaan tidak valid.",
            "fieldErrors": field_errors,
        },
    )


@app.get("/health", tags=["health"])
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
