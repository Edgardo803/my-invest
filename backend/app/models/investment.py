from sqlalchemy import Column, Integer, Float, Boolean, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class InvestmentStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    investor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    amount = Column(Float, nullable=False)                 # Cantidad invertida
    ownership_percentage = Column(Float, nullable=True)    # % de participación
    status = Column(Enum(InvestmentStatus), default=InvestmentStatus.PENDING)

    # Simulación de pagos
    payment_reference = Column(String(100), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)

    # Retornos
    expected_return = Column(Float, nullable=True)
    actual_return = Column(Float, nullable=True)
    return_paid = Column(Boolean, default=False)
    return_paid_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    investor = relationship("User", back_populates="investments")
    project = relationship("Project", back_populates="investments")
