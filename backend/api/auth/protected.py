# api/routes/protected.py
from fastapi import APIRouter, Depends, HTTPException
from utils.jwt import decode_access_token
from api.db.dependencies import get_db
router = APIRouter()

# Dependency to check the current user from the token
def get_current_user(token: str = Depends(decode_access_token)):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token or token expired")
    return token
@router.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    return {"message": "Protected route accessed", "user_data": current_user}