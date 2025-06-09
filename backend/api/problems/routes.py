from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.db.database import get_db
from models.problem import Problem
from schemas.problem import Problem as ProblemSchema
from typing import List
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[ProblemSchema])
def get_problems(db: Session = Depends(get_db)):
    return db.query(Problem).all()

# Get single problem by ID
@router.get("/{problem_id}", response_model=ProblemSchema)
def get_problem(problem_id: UUID, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem