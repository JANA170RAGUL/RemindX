from sqlalchemy.orm import Session
from app.models.users import User
from app.schemas.auth import RegisterRequest, LoginRequest
from app.core.security import get_password_hash, verify_password, create_access_token
from app.exceptions.custom import AuthException, ValidationException
from typing import Dict, Any

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register_user(self, payload: RegisterRequest) -> User:
        # Check if user exists
        existing_user = self.db.query(User).filter(User.email == payload.email).first()
        if existing_user:
            raise ValidationException("Email is already registered")

        # Create new user
        hashed_password = get_password_hash(payload.password)
        new_user = User(
            full_name=payload.full_name,
            email=payload.email,
            password_hash=hashed_password
        )
        
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        
        return new_user

    def authenticate_user(self, payload: LoginRequest) -> Dict[str, Any]:
        user = self.db.query(User).filter(User.email == payload.email).first()
        
        if not user or not verify_password(payload.password, user.password_hash):
            raise AuthException("Invalid email or password")
            
        access_token = create_access_token(data={"sub": user.email, "id": str(user.id)})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
