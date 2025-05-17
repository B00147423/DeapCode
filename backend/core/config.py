# config.py or core/config.py
from dotenv import load_dotenv
import os
load_dotenv()

class Settings:
    PROJECT_NAME = "DeapCode"
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    DATABASE_URL = os.getenv("DATABASE_URL")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
    REFRESH_TOKEN_EXPIRE_MINUTES = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", 10080))
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ALLOW_CORS = os.getenv("ALLOW_CORS", "True").lower() == "true"
    ALLOWED_ORIGINS = os.getenv("ALLOW_CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    ALLOW_CORS_METHODS = os.getenv("ALLOW_CORS_METHODS", "GET,POST,DELETE,PUT,OPTIONS").split(",")
    ALLOW_CORS_HEADERS = os.getenv("ALLOW_CORS_HEADERS", "Content-Type,Authorization").split(",")
    ALLOW_CORS_EXPOSE_HEADERS = os.getenv("ALLOW_CORS_EXPOSE_HEADERS", "X-Total-Count").split(",")
    ALLOW_CORS_ALLOW_CREDENTIALS = os.getenv("ALLOW_CORS_ALLOW_CREDENTIALS", "True").lower() == "true"
    ALLOW_CORS_MAX_AGE = int(os.getenv("ALLOW_CORS_MAX_AGE", 3600))

settings = Settings()