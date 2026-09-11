from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import api_router
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole
import secrets
import string

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos subidos (DEBE ir después de crear app)
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(api_router, prefix=settings.API_V1_STR)

def generate_referral_code(length: int = 8) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def ensure_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "admin@myinvest.com").first()
        if existing:
            print("ℹ️ El admin ya existe.")
            return

        admin = User(
            email="admin@myinvest.com",
            hashed_password=get_password_hash("Admin123!"),
            full_name="Administrador My Invest",
            phone="+34000000000",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
            referral_code=generate_referral_code(),
        )
        db.add(admin)
        db.commit()
        print("✅ Admin creado: admin@myinvest.com / Admin123!")
    except Exception as e:
        print(f"❌ Error creando admin: {e}")
        db.rollback()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    ensure_admin()



@app.on_event("startup")
def on_startup():
    ensure_admin()


@app.get("/")
def root():
    return {
        "message": "Bienvenido a My Invest API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {"status": "ok"}
