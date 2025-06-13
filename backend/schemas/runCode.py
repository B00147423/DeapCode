from pydantic import BaseModel
from typing import List

class MultiJudgeRequest(BaseModel):
    codes: List[str]
    language: str
