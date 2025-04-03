from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.user import User
from schemas.auth import SignupRequest, LoginRequest
from utils.jwt import create_access_token
from dependencies import get_db
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

# Login Route
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # Find the user
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate token
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}
