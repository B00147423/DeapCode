from sqlalchemy import Column, String, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.types import TIMESTAMP
from api.db.database import Base
import uuid

class Problem(Base):
    __tablename__ = "problems"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    starter_code = Column(String, nullable=True)  # Optional starter code
    examples = Column(JSON, nullable=True)        # Example I/O
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
