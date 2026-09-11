from fastapi import APIRouter
from app.api.v1 import auth, users, projects, investments, uploads

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(projects.router)
api_router.include_router(investments.router)
api_router.include_router(uploads.router)