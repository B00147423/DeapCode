#C:\Users\beka\DeapCode\backend\api\auth\auth.py
from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session
from models.user import User
from schemas.auth import SignupRequest, LoginRequest
from utils.jwt import create_access_token, create_refresh_token, decode_access_token
from api.db.dependencies import get_db
from passlib.context import CryptContext
from core.config import settings
import re
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from api.auth.protected import get_current_user

router = APIRouter()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def validate_username(username: str) -> tuple[bool, str]:
    """
    Validates username with additional rules:
    - Must start with a letter
    - No consecutive underscores
    - No consecutive numbers
    - No reserved words
    """
    # Check if starts with letter
    if not username[0].isalpha():
        return False, "Username must start with a letter"
    
    special_characters = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", ".", "?", ":", ";", ",", "<", ">", "/", "\\", "|", "~", "`", "=", "+", "-", "_"]
    if any(char in username for char in special_characters):
        return False, "Username cannot contain special characters"
    
    # Check for reserved words
    reserved_words = ["admin", "moderator", "system", "root", "staff"]
    if username.lower() in reserved_words:
        return False, "This username is reserved"
    
    return True, ""

# Signup Route
@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username exists
    existing_username = db.query(User).filter(User.username == data.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Additional username validation
    is_valid, error_message = validate_username(data.username)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_message)
    
    # Check if passwords match
    if data.password != data.repeat_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Password strength validation
    if len(data.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
    if not re.search(r'[A-Z]', data.password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")
    if not re.search(r'[a-z]', data.password):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter")
    if not re.search(r'\d', data.password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', data.password):
        raise HTTPException(status_code=400, detail="Password must contain at least one special character")
    
    # Hash the password before saving it to DB
    hashed_password = pwd_context.hash(data.password)
    
    # Create the new user
    new_user = User(
        username=data.username,
        email=data.email,
        hashed_password=hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate a token for the new user
    token = create_access_token({"sub": str(new_user.id)})
    return {"access_token": token, "token_type": "bearer"}

# api/routes/auth.py
@router.post("/login")
def login(response: Response, data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create Access Token and Refresh Token
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=settings.DEBUG == False,  # Only use secure in production
        samesite="lax",
        max_age=15 * 60  # 15 minutes
    )
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.DEBUG == False,  # Only use secure in production
        samesite="lax",
        max_age=7 * 24 * 60 * 60  # 7 days
    )
    
    # Return user details along with tokens
    return {
        "id": str(user.id),
        "email": user.email,
        "username": user.username,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh")
def refresh_access_token(refresh_token: dict, db: Session = Depends(get_db)):
    try:
        # Get the refresh token from the request body
        token = refresh_token.get("refresh_token")
        if not token:
            raise HTTPException(status_code=400, detail="Refresh token is required")

        # Decode and verify the refresh token
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        # Get user from database to ensure they still exist
        user = db.query(User).filter(User.id == payload["sub"]).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        # Create new access token using the user id (sub) from the refresh token payload
        new_access_token = create_access_token({"sub": str(user.id)})
        new_refresh_token = create_refresh_token({"sub": str(user.id)})
        
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"username": current_user.username, "email": current_user.email}