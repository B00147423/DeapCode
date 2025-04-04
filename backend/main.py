from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.auth import auth, protected, users  # Correct import style
from api.db.database import engine, Base  # Correct import style

# Create tables if they don't exist already
Base.metadata.create_all(bind=engine)

# FastAPI app setup
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers for different endpoints
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(protected.router, prefix="/protected", tags=["Protected"])
