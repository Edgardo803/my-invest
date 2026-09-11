from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserRole
from app.models.project import Project, ProjectStatus
from app.models.investment import Investment, InvestmentStatus
from app.schemas.investment import InvestmentCreate, InvestmentOut, InvestmentSummary

router = APIRouter(prefix="/investments", tags=["Inversiones"])


@router.post("/", response_model=InvestmentOut, status_code=status.HTTP_201_CREATED)
def create_investment(
    investment_in: InvestmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.INVESTOR:
        raise HTTPException(status_code=403, detail="Solo inversores pueden invertir")

    project = db.query(Project).filter(Project.id == investment_in.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    if project.status not in [ProjectStatus.APPROVED, ProjectStatus.ACTIVE]:
        raise HTTPException(status_code=400, detail="Este proyecto no acepta inversiones actualmente")

    # Simulación: calculamos porcentaje aproximado (ejemplo simple)
    ownership = None
    if project.total_investment and project.total_investment > 0:
        ownership = (investment_in.amount / project.total_investment) * 100

    # Retorno esperado basado en ROI realista
    expected_return = None
    if project.roi_realistic:
        expected_return = investment_in.amount * (1 + project.roi_realistic / 100)

    investment = Investment(
        investor_id=current_user.id,
        project_id=investment_in.project_id,
        amount=investment_in.amount,
        ownership_percentage=ownership,
        status=InvestmentStatus.CONFIRMED,  # Simulado como confirmado
        expected_return=expected_return,
        payment_reference=f"SIM-{current_user.id}-{investment_in.project_id}-{int(investment_in.amount)}"
    )
    db.add(investment)
    db.commit()
    db.refresh(investment)
    return investment


@router.get("/me", response_model=List[InvestmentOut])
def my_investments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    investments = db.query(Investment).filter(Investment.investor_id == current_user.id).all()
    return investments


@router.get("/me/summary", response_model=InvestmentSummary)
def my_investment_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    investments = db.query(Investment).filter(Investment.investor_id == current_user.id).all()

    total_invested = sum(i.amount for i in investments)
    total_expected = sum(i.expected_return or 0 for i in investments)
    total_actual = sum(i.actual_return or 0 for i in investments)
    count = len(investments)
    avg_roi = None
    if total_invested > 0 and total_expected > 0:
        avg_roi = ((total_expected - total_invested) / total_invested) * 100

    return InvestmentSummary(
        total_invested=total_invested,
        total_expected_return=total_expected,
        total_actual_return=total_actual,
        number_of_investments=count,
        average_roi=avg_roi
    )
