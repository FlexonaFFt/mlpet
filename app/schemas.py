from pydantic import BaseModel, EmailStr, validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @validator("password")
    def validate_password(cls, value):
        if len(value) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return value

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
