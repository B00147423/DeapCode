#!/usr/bin/env python3
"""
Script to update existing problems with slugs if they don't have them
"""
from sqlalchemy.orm import Session
from api.db.database import engine, get_db
from models.problem import Problem
from slugify import slugify

def update_problem_slugs():
    """Update any problems that don't have slugs"""
    db = Session(bind=engine)
    try:
        # Find problems without slugs
        problems_without_slugs = db.query(Problem).filter(
            (Problem.slug == None) | (Problem.slug == "")
        ).all()
        
        print(f"Found {len(problems_without_slugs)} problems without slugs")
        
        for problem in problems_without_slugs:
            if problem.title:
                problem.slug = slugify(problem.title)
                print(f"Updated problem '{problem.title}' with slug '{problem.slug}'")
        
        db.commit()
        print("Successfully updated all problem slugs")
        
    except Exception as e:
        print(f"Error updating slugs: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_problem_slugs() 