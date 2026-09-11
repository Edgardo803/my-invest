from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import secrets
import string

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserOut, Token

router = APIRouter(prefix="/auth", tags=["Autenticación"])


def generate_referral_code(length: int = 8) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Verificar si el email ya existe
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )

    # Validar rol (solo investor o agent en registro público)
    if user_in.role not in [UserRole.INVESTOR, UserRole.AGENT]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rol no permitido en registro público"
        )

    # Manejar referido
    referred_by_id = None
    if user_in.referral_code:
        referrer = db.query(User).filter(User.referral_code == user_in.referral_code).first()
        if referrer:
            referred_by_id = referrer.id

    # Crear usuario
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role=user_in.role,
        referral_code=generate_referral_code(),
        referred_by=referred_by_id,
        is_verified=False  # Requiere verificación de documentos
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")

    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}
