from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models.room import Room as RoomModel
from schemas.room import Room as RoomSchema, RoomCreate
from api.db.database import get_db
import uuid

router = APIRouter()

@router.post("/", response_model=RoomSchema)
def create_room(room_data: RoomCreate, db: Session = Depends(get_db)):
    new_room = RoomModel(
        id=uuid.uuid4(),
        host_id=room_data.host_id,
        problem_id=room_data.problem_id
    )
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room

@router.get("/{room_id}", response_model=RoomSchema)
def get_room(room_id: uuid.UUID, db: Session = Depends(get_db)):
    room = db.query(RoomModel).filter(RoomModel.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room
