from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import settings

# 1. Create the database engine
engine = create_engine(settings.DATABASE_URL)

# 2. Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Base class for your models
Base = declarative_base()