from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List, Optional, Dict, Any

class Example(BaseModel):
    input: str
    output: str
    explanation: Optional[str] = None

class ProblemBase(BaseModel):
    title: str
    description: str
    difficulty: str
    starter_code: Optional[str]
    examples: Optional[List[Example]] = []

class ProblemCreate(ProblemBase):
    pass

class Problem(ProblemBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
