"""
Script para crear el primer superusuario (admin).
Ejecutar: python create_admin.py
"""
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User, UserRole
import secrets
import string

Base.metadata.create_all(bind=engine)

def generate_referral_code(length: int = 8) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def create_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "admin@myinvest.com").first()
        if existing:
            print("El admin ya existe.")
            return

        admin = User(
            email="admin@myinvest.com",
            hashed_password=get_password_hash("Admin123!"),
            full_name="Administrador My Invest",
            phone="+34000000000",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
            referral_code=generate_referral_code()
        )
        db.add(admin)
        db.commit()
        print("✅ Admin creado correctamente")
        print("Email: admin@myinvest.com")
        print("Password: Admin123!")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
