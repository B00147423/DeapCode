from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from api.db.database import get_db
from models.user import User  # Explicit import
from utils.jwt import decode_access_token
from jose import JWTError  # If using python-jose for JWT

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")  # Match your login route

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to get the current user from a JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        if not payload or "sub" not in payload:
            raise credentials_exception
        user = db.query(User).filter(User.id == payload["sub"]).first()
        if not user:
            raise credentials_exception
        return user
    except JWTError:  # Or your custom token decode exception
        raise credentials_exception