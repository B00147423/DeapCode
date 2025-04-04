from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from api.db.database import SessionLocal  # Assuming you have a `SessionLocal` in `database.py`
from models import user  # Import the User model from the appropriate module
from utils.jwt import decode_access_token
from api.db.database import get_db

# Dependency to get the current user from the token
def get_current_user(token: str = Depends(decode_access_token), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token or token expired")
    # Use the token data (usually user ID) to fetch the user from DB
    user = db.query(user).filter(user.id == token["sub"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user