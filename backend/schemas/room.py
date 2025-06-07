from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RoomCreate(BaseModel):
    host_id: int
    problem_id: int

class Room(BaseModel):
    id: int
    host_id: int
    guest_id: int
    problem_id: int
    created_at: datetime
