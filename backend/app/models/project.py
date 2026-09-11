from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class ProjectStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    ACTIVE = "active"
    COMPLETED = "completed"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class ProjectPhase(str, enum.Enum):
    PURCHASE = "purchase"          # Fase 1: Compra
    RENOVATION = "renovation"      # Fase 2: Reforma
    COMMERCIALIZATION = "sale"     # Fase 3: Comercialización y venta
    COMPLETED = "completed"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(255), nullable=True)
    address = Column(String(500), nullable=True)

    # Datos financieros
    purchase_price = Column(Float, nullable=True)
    renovation_cost = Column(Float, nullable=True)
    total_investment = Column(Float, nullable=True)
    expected_sale_price = Column(Float, nullable=True)

    # Escenarios de rentabilidad (%)
    roi_optimistic = Column(Float, nullable=True)
    roi_realistic = Column(Float, nullable=True)
    roi_pessimistic = Column(Float, nullable=True)

    # Estado y fases
    status = Column(Enum(ProjectStatus), default=ProjectStatus.DRAFT)
    current_phase = Column(Enum(ProjectPhase), default=ProjectPhase.PURCHASE)

    # Dossier
    images = Column(JSON, default=list)          # lista de URLs
    floor_plans = Column(JSON, default=list)     # planos
    documents = Column(JSON, default=list)       # escrituras, reportes, etc.
    financial_projection = Column(JSON, nullable=True)

    # Relación con agente
    agent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    agent = relationship("User", back_populates="projects_submitted", foreign_keys=[agent_id])

    # Fechas
    start_date = Column(DateTime(timezone=True), nullable=True)
    estimated_end_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    investments = relationship("Investment", back_populates="project")
    phase_updates = relationship("PhaseUpdate", back_populates="project")


class PhaseUpdate(Base):
    __tablename__ = "phase_updates"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    phase = Column(Enum(ProjectPhase), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    images = Column(JSON, default=list)
    documents = Column(JSON, default=list)  # ej: escritura de compraventa
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="phase_updates")
