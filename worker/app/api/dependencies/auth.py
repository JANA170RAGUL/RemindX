from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.exceptions.custom import AuthException
from app.models.users import User

# Point Swagger UI to the dedicated token endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_access_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise AuthException("Invalid authentication token")
    except Exception:
        raise AuthException("Could not validate credentials")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise AuthException("User not found or disabled")
        
    return user
