from fastapi import APIRouter, Depends, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import os
import uuid
from app.core.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse, ProfileUpdateRequest
from app.services.auth_service import AuthService
from app.utils.response import success_response
from app.models.users import User
from app.api.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.register_user(payload)
    return success_response(
        data={"id": str(user.id), "email": user.email},
        message="User registered successfully"
    )

@router.post("/login", response_model=None)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    result = auth_service.authenticate_user(payload)
    
    # Returning the consistent nested API format
    return success_response(
        data=TokenResponse(**result).dict(),
        message="Login successful"
    )

@router.post("/token", include_in_schema=False)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Dedicated endpoint for Swagger UI's "Authorize" button
    auth_service = AuthService(db)
    login_request = LoginRequest(email=form_data.username, password=form_data.password)
    result = auth_service.authenticate_user(login_request)
    
    # Must return flat format for Swagger to parse the token automatically
    return {
        "access_token": result["access_token"],
        "token_type": "bearer"
    }

@router.get("/me", response_model=None)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return success_response(
        data=UserResponse.from_orm(current_user).dict(),
        message="User fetched successfully"
    )

@router.put("/profile", response_model=None)
def update_current_user_profile(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.email is not None:
        current_user.email = payload.email
    if payload.timezone is not None:
        current_user.timezone = payload.timezone
    if payload.avatar_url is not None:
        current_user.avatar_url = payload.avatar_url

    db.commit()
    db.refresh(current_user)

    return success_response(
        data=UserResponse.from_orm(current_user).dict(),
        message="Profile updated successfully"
    )

@router.post("/avatar", response_model=None)
async def upload_user_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ext = file.filename.split(".")[-1] if "." in file.filename else "png"
    unique_filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join("static", "avatars", unique_filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Update user avatar_url
    avatar_url = f"http://localhost:8000/static/avatars/{unique_filename}"
    current_user.avatar_url = avatar_url
    db.commit()
    db.refresh(current_user)

    return success_response(
        data=UserResponse.from_orm(current_user).dict(),
        message="Avatar uploaded successfully"
    )
