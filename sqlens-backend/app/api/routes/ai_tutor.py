from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.security import TrustedUser, require_trusted_user
from app.schemas.ai_tutor import AiTutorRequest, AiTutorResponse
from app.services.ai_tutor import AiTutorService

router = APIRouter(prefix="/ai-tutor", tags=["ai-tutor"])
service = AiTutorService()
CurrentUser = Annotated[TrustedUser, Depends(require_trusted_user)]


@router.post("/ask", response_model=AiTutorResponse)
def ask_ai_tutor(payload: AiTutorRequest, _: CurrentUser) -> AiTutorResponse:
    return service.ask(prompt=payload.prompt, query=payload.query, context=payload.context)
