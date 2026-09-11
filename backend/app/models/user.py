from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class UserRole(str, enum.Enum):
    INVESTOR = "investor"
    AGENT = "agent"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.INVESTOR, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    dni_document = Column(String(500), nullable=True)  # path o URL del documento
    referral_code = Column(String(50), unique=True, nullable=True)
    referred_by = Column(Integer, nullable=True)  # ID del usuario que lo refirió
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    projects_submitted = relationship("Project", back_populates="agent", foreign_keys="Project.agent_id")
    investments = relationship("Investment", back_populates="investor")
