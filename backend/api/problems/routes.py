from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.db.database import get_db
from models.problem import Problem
from schemas.problem import Problem as ProblemSchema
from typing import List

router = APIRouter()

@router.get("/", response_model=List[ProblemSchema])
def get_problems(db: Session = Depends(get_db)):
    return db.query(Problem).all()
