#C:\Users\beka\DeapCode\backend\api\auth\auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.user import User
from schemas.auth import SignupRequest, LoginRequest
from utils.jwt import create_access_token, create_refresh_token, decode_access_token
from api.db.dependencies import get_db
from passlib.context import CryptContext
router = APIRouter()


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Signup Route
@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if passwords match
    if data.password != data.repeat_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
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
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create Access Token and Refresh Token
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.post("/refresh")
def refresh_access_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        # Decode and verify the refresh token
        payload = decode_access_token(refresh_token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        # Create new access token using the user id (sub) from the refresh token payload
        new_access_token = create_access_token({"sub": payload["sub"]})
        return {"access_token": new_access_token, "token_type": "bearer"}
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
