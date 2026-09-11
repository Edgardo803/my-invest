from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.investment import InvestmentStatus


class InvestmentCreate(BaseModel):
    project_id: int
    amount: float = Field(..., gt=0)


class InvestmentOut(BaseModel):
    id: int
    investor_id: int
    project_id: int
    amount: float
    ownership_percentage: Optional[float] = None
    status: InvestmentStatus
    expected_return: Optional[float] = None
    actual_return: Optional[float] = None
    return_paid: bool
    created_at: datetime
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InvestmentSummary(BaseModel):
    total_invested: float
    total_expected_return: float
    total_actual_return: float
    number_of_investments: int
    average_roi: Optional[float] = None
