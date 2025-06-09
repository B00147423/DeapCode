from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.db.database import get_db
from models.problem import Problem
from schemas.problem import Problem as ProblemSchema, ProblemCreate
from typing import List
from uuid import UUID
from slugify import slugify


router = APIRouter()

@router.get("/", response_model=List[ProblemSchema])
def get_problems(db: Session = Depends(get_db)):
    return db.query(Problem).all()

# Get single problem by slug
@router.get("/{slug}", response_model=ProblemSchema)
def get_problem_by_slug(slug: str, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem


@router.post("/", response_model=ProblemSchema)
def create_problem(problem: ProblemCreate, db: Session = Depends(get_db)):
    slug = slugify(problem.title)
    new_problem = Problem(**problem.dict(), slug=slug)
    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)
    return new_problem