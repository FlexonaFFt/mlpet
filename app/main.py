from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta

from app.database import Base, engine, SessionLocal, User, Chat, Message, RequestLog, Achievement, UserAchievement
from app.schemas import UserCreate, UserLogin, Token, User as UserSchema, ChatCreate, Chat, MessageCreate, Message, RequestLogCreate, RequestLog, AchievementCreate, Achievement, UserAchievementCreate, UserAchievement

import asyncio

SECRET_KEY = "supersecretkey"  # Используйте .env в продакшене
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()
Base.metadata.create_all(bind=engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Utils ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(data: dict, expires_minutes: int = 30):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# --- Routes ---
@app.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = pwd_context.hash(user.password)
    db_user = User(email=user.email, username=user.username, password_hash=hashed_password, created_at=datetime.utcnow())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = create_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(
        (User.email == user.email_or_username) |
        (User.username == user.email_or_username)
    ).first()

    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    db_user.last_login_at = datetime.utcnow()
    db.commit()
    db.refresh(db_user)

    access_token = create_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=UserSchema)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/chats/", response_model=Chat)
def create_chat(chat: ChatCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_chat = Chat(**chat.dict(), user_id=current_user.id, created_at=datetime.utcnow())
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

@app.get("/chats/me", response_model=list[Chat])
def read_my_chats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Chat).filter(Chat.user_id == current_user.id).all()

@app.post("/chats/{chat_id}/messages/", response_model=Message)
def create_message(chat_id: int, message: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not db_chat:
        raise HTTPException(status_code=404, detail="Chat not found or not owned by user")
    db_message = Message(**message.dict(), chat_id=chat_id, created_at=datetime.utcnow())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.get("/chats/{chat_id}/messages/", response_model=list[Message])
def read_messages(chat_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not db_chat:
        raise HTTPException(status_code=404, detail="Chat not found or not owned by user")
    return db.query(Message).filter(Message.chat_id == chat_id).all()

@app.post("/chats/{chat_id}/request_logs/", response_model=RequestLog)
def create_request_log(chat_id: int, request_log: RequestLogCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not db_chat:
        raise HTTPException(status_code=404, detail="Chat not found or not owned by user")
    db_request_log = RequestLog(**request_log.dict(), chat_id=chat_id, created_at=datetime.utcnow())
    db.add(db_request_log)
    db.commit()
    db.refresh(db_request_log)
    return db_request_log

@app.get("/chats/{chat_id}/request_logs/", response_model=list[RequestLog])
def read_request_logs(chat_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not db_chat:
        raise HTTPException(status_code=404, detail="Chat not found or not owned by user")
    return db.query(RequestLog).filter(RequestLog.chat_id == chat_id).all()

@app.post("/achievements/", response_model=Achievement)
def create_achievement(achievement: AchievementCreate, db: Session = Depends(get_db)):
    db_achievement = Achievement(**achievement.dict())
    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)
    return db_achievement

@app.get("/achievements/", response_model=list[Achievement])
def read_achievements(db: Session = Depends(get_db)):
    return db.query(Achievement).all()

@app.post("/users/{user_id}/achievements/", response_model=UserAchievement)
def create_user_achievement(user_id: int, user_achievement: UserAchievementCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_achievement = db.query(Achievement).filter(Achievement.id == user_achievement.achievement_id).first()
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    db_user_achievement = UserAchievement(**user_achievement.dict(), achieved_at=datetime.utcnow())
    db.add(db_user_achievement)
    db.commit()
    db.refresh(db_user_achievement)
    return db_user_achievement

@app.get("/users/{user_id}/achievements/", response_model=list[UserAchievement])
def read_user_achievements(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()