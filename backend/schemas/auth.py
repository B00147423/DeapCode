from pydantic import BaseModel, EmailStr, constr

# Username validation - only letters, numbers, and underscores allowed
UsernameStr = constr(
    min_length=3,
    max_length=30,
    pattern=r'^[a-zA-Z0-9_]+$'
)

class SignupRequest(BaseModel):
    username: str = constr(min_length=3, max_length=30, pattern=r'^[a-zA-Z0-9_]+$')
    email: EmailStr
    password: str
    repeat_password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UpdatePasswordRequest(BaseModel):
    old_password: str
    new_password: str
    repeat_new_password: str

class UpdateEmailRequest(BaseModel):
    new_email: EmailStr
    repeat_new_email: EmailStr

class UpdateUsernameRequest(BaseModel):
    new_username: str = constr(min_length=3, max_length=30, pattern=r'^[a-zA-Z0-9_]+$')
    repeat_new_username: str = constr(min_length=3, max_length=30, pattern=r'^[a-zA-Z0-9_]+$')

class UpdateProfileRequest(BaseModel):
    username: str | None = constr(min_length=3, max_length=30, pattern=r'^[a-zA-Z0-9_]+$')
    email: EmailStr | None = None
    password: str | None = None
    repeat_password: str | None = None

class UpdateUserRequest(BaseModel):
    username: str | None = constr(min_length=3, max_length=30, pattern=r'^[a-zA-Z0-9_]+$')
    email: EmailStr | None = None
    password: str | None = None
    repeat_password: str | None = None
    is_active: bool | None = None