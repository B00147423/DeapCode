from pydantic import BaseModel

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str
    repeat_password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UpdatePasswordRequest(BaseModel):
    old_password: str
    new_password: str
    repeat_new_password: str

class UpdateEmailRequest(BaseModel):
    new_email: str
    repeat_new_email: str

class UpdateUsernameRequest(BaseModel):
    new_username: str
    repeat_new_username: str

class UpdateProfileRequest(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None
    repeat_password: str | None = None

class UpdateUserRequest(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None
    repeat_password: str | None = None
    is_active: bool | None = None