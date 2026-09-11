from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime
from app.models.project import ProjectStatus, ProjectPhase


class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    purchase_price: Optional[float] = None
    renovation_cost: Optional[float] = None
    total_investment: Optional[float] = None
    expected_sale_price: Optional[float] = None
    roi_optimistic: Optional[float] = None
    roi_realistic: Optional[float] = None
    roi_pessimistic: Optional[float] = None


class ProjectCreate(ProjectBase):
    images: List[str] = []


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    purchase_price: Optional[float] = None
    renovation_cost: Optional[float] = None
    total_investment: Optional[float] = None
    expected_sale_price: Optional[float] = None
    roi_optimistic: Optional[float] = None
    roi_realistic: Optional[float] = None
    roi_pessimistic: Optional[float] = None
    status: Optional[ProjectStatus] = None
    current_phase: Optional[ProjectPhase] = None
    images: Optional[List[str]] = None
    floor_plans: Optional[List[str]] = None
    documents: Optional[List[str]] = None
    financial_projection: Optional[Any] = None


class ProjectOut(ProjectBase):
    id: int
    status: ProjectStatus
    current_phase: ProjectPhase
    images: List[str] = []
    floor_plans: List[str] = []
    documents: List[str] = []
    agent_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Nuevos campos de financiación
    total_raised: float = 0
    remaining_amount: Optional[float] = None

    class Config:
        from_attributes = True


class PhaseUpdateCreate(BaseModel):
    phase: ProjectPhase
    title: str
    description: Optional[str] = None
    images: List[str] = []
    documents: List[str] = []


class PhaseUpdateOut(PhaseUpdateCreate):
    id: int
    project_id: int
    created_at: datetime

    class Config:
        from_attributes = True
