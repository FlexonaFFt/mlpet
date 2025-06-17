from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: str

    @validator("password")
    def validate_password(cls, value):
        if len(value) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return value

class UserLogin(BaseModel):
    email_or_username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserBase(BaseModel):
    username: str
    email: EmailStr

class User(UserBase):
    id: int
    created_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ChatBase(BaseModel):
    user_id: int

class ChatCreate(ChatBase):
    pass

class Chat(ChatBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class MessageBase(BaseModel):
    chat_id: int
    sender: str
    content: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class RequestLogBase(BaseModel):
    chat_id: int
    request: str
    response: str

class RequestLogCreate(RequestLogBase):
    pass

class RequestLog(RequestLogBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class AchievementBase(BaseModel):
    name: str
    description: str

class AchievementCreate(AchievementBase):
    pass

class Achievement(AchievementBase):
    id: int

    class Config:
        orm_mode = True

class UserAchievementBase(BaseModel):
    user_id: int
    achievement_id: int

class UserAchievementCreate(UserAchievementBase):
    pass

class UserAchievement(UserAchievementBase):
    id: int
    achieved_at: datetime

    class Config:
        orm_mode = True
