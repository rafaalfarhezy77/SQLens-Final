from collections.abc import Mapping


class PublicApiError(Exception):
    def __init__(
        self,
        *,
        status_code: int,
        code: str,
        message: str,
        field_errors: Mapping[str, list[str]] | None = None,
    ) -> None:
        self.status_code = status_code
        self.code = code
        self.message = message
        self.field_errors = dict(field_errors) if field_errors else None
        super().__init__(message)

    def as_payload(self) -> dict[str, object]:
        payload: dict[str, object] = {"code": self.code, "message": self.message}
        if self.field_errors:
            payload["fieldErrors"] = self.field_errors
        return payload
