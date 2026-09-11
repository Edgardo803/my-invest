from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user, get_current_agent
from app.models.user import User, UserRole
from app.models.project import Project, ProjectStatus, PhaseUpdate
from app.models.investment import Investment
from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate, PhaseUpdateCreate, PhaseUpdateOut

router = APIRouter(prefix="/projects", tags=["Proyectos"])


def enrich_project(db: Session, project: Project) -> dict:
    """Añade total_raised y remaining_amount al proyecto"""
    total_raised = (
        db.query(func.coalesce(func.sum(Investment.amount), 0))
        .filter(Investment.project_id == project.id)
        .scalar()
    ) or 0

    remaining = None
    if project.total_investment is not None:
        remaining = max(project.total_investment - total_raised, 0)

    data = ProjectOut.model_validate(project).model_dump()
    data["total_raised"] = float(total_raised)
    data["remaining_amount"] = float(remaining) if remaining is not None else None
    return data


@router.post("/", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    project = Project(
        **project_in.model_dump(),
        agent_id=current_user.id,
        status=ProjectStatus.PENDING_REVIEW
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return enrich_project(db, project)


@router.get("/", response_model=List[ProjectOut])
def list_projects(
    status: ProjectStatus | None = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Project)

    if current_user.role == UserRole.AGENT:
        query = query.filter(Project.agent_id == current_user.id)
    elif current_user.role == UserRole.INVESTOR:
        query = query.filter(Project.status.in_([
            ProjectStatus.APPROVED, ProjectStatus.ACTIVE, ProjectStatus.COMPLETED
        ]))

    if status:
        query = query.filter(Project.status == status)

    projects = query.offset(skip).limit(limit).all()
    return [enrich_project(db, p) for p in projects]


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    if current_user.role == UserRole.AGENT and project.agent_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes acceso a este proyecto")
    if current_user.role == UserRole.INVESTOR and project.status not in [
        ProjectStatus.APPROVED, ProjectStatus.ACTIVE, ProjectStatus.COMPLETED
    ]:
        raise HTTPException(status_code=403, detail="Proyecto no disponible")

    return enrich_project(db, project)


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    if current_user.role == UserRole.AGENT and project.agent_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    if current_user.role == UserRole.INVESTOR:
        raise HTTPException(status_code=403, detail="Los inversores no pueden modificar proyectos")

    update_data = project_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.add(project)
    db.commit()
    db.refresh(project)
    return enrich_project(db, project)


@router.post("/{project_id}/phases", response_model=PhaseUpdateOut, status_code=201)
def add_phase_update(
    project_id: int,
    phase_in: PhaseUpdateCreate,
    current_user: User = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    if current_user.role == UserRole.AGENT and project.agent_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso")

    phase_update = PhaseUpdate(
        project_id=project_id,
        **phase_in.model_dump()
    )
    project.current_phase = phase_in.phase

    db.add(phase_update)
    db.add(project)
    db.commit()
    db.refresh(phase_update)
    return phase_update