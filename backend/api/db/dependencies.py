from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from api.db.database import SessionLocal  # Assuming you have a `SessionLocal` in `database.py`
from models import user  # Import the User model from the appropriate module
from utils.jwt import decode_access_token
from api.db.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token or token expired")
        user = db.query(user).filter(user.id == payload["sub"]).first()
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token or token expired")
