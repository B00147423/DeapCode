import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import json
from sqlalchemy.orm import Session
from api.db.database import SessionLocal
from models.problem import Problem
import uuid

def load_problems():
    db: Session = SessionLocal()
    problems_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "problems", "problems.json")
    with open(problems_path, "r") as f:
        problems_data = json.load(f)
    for p in problems_data:
        exists = db.query(Problem).filter_by(title=p["title"]).first()
        if exists:
            continue  # Skip if already exists
        problem = Problem(
            id=uuid.uuid4(),
            title=p["title"],
            description=p["description"],
            difficulty=p["difficulty"],
            examples=p.get("examples", [])
        )
        db.add(problem)
    db.commit()
    db.close()

if __name__ == "__main__":
    load_problems()
