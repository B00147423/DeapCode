# config.py or core/config.py
from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    PROJECT_NAME = "DeapCode"
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    DATABASE_URL = os.getenv("DATABASE_URL")
    EXCHANGE_API_KEY = os.getenv("EXCHANGE_API_KEY")
    
    # Loading CORS settings
    ALLOWED_ORIGINS = os.getenv("ALLOW_CORS_ORIGINS", "http://localhost:3000").split(",")
    ALLOW_CORS = os.getenv("ALLOW_CORS", "True").lower() == "true"
    ALLOW_CORS_METHODS = os.getenv("ALLOW_CORS_METHODS", "GET,POST").split(",")
    ALLOW_CORS_HEADERS = os.getenv("ALLOW_CORS_HEADERS", "Content-Type,Authorization").split(",")
    ALLOW_CORS_EXPOSE_HEADERS = os.getenv("ALLOW_CORS_EXPOSE_HEADERS", "X-Total-Count").split(",")
    ALLOW_CORS_ALLOW_CREDENTIALS = os.getenv("ALLOW_CORS_ALLOW_CREDENTIALS", "True").lower() == "true"
    ALLOW_CORS_MAX_AGE = int(os.getenv("ALLOW_CORS_MAX_AGE", 3600))
    ALLOW_CORS_ALLOW_ORIGINS = os.getenv("ALLOW_CORS_ALLOW_ORIGINS", "*")

    TIMEZONE = os.getenv("TIMEZONE", "UTC")
    DEFAULT_PAGE_SIZE = int(os.getenv("DEFAULT_PAGE_SIZE", 10))
    MAX_PAGE_SIZE = int(os.getenv("MAX_PAGE_SIZE", 100))

    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    ALGORITHM = os.getenv("ALGORITHM", "HS256")

settings = Settings()