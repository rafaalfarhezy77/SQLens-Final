from fastapi import APIRouter

from app.api.routes import auth, datasets, query_execution, query_history

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(datasets.router)
api_router.include_router(query_execution.router)
api_router.include_router(query_history.router)
