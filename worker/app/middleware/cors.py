from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

def setup_cors_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://illustrious-fascination-production-493c.up.railway.app",
            settings.FRONTEND_URL,
            "http://localhost:3000",
            "http://localhost:5173",
            "*"
        ],
        allow_origin_regex="https://.*\.up\.railway\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
