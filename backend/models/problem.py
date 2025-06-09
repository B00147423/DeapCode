from sqlalchemy import Column, String, JSON, event
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.types import TIMESTAMP
from api.db.database import Base
import uuid
from slugify import slugify

class Problem(Base):
    __tablename__ = "problems"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True) 
    description = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    starter_code = Column(String, nullable=True)  # Optional starter code
    examples = Column(JSON, nullable=True)        # Example I/O
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

# Automatically generate slug from title before insert
@event.listens_for(Problem, 'before_insert')
def generate_slug(mapper, connection, target):
    if not target.slug and target.title:
        target.slug = slugify(target.title)
