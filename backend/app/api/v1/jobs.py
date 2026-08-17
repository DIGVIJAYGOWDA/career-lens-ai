from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import User, Job
from app.schemas import JobCreate, JobResponse, JobRequirements
from app.core.dependencies import get_current_user
from app.services.ai import get_ai_provider

router = APIRouter()

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    job_in: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ai = get_ai_provider()
    requirements: JobRequirements = ai.extract_job_requirements(job_in.description)

    new_job = Job(
        user_id=current_user.id,
        title=job_in.title,
        company=job_in.company,
        description=job_in.description,
        analysis_status="completed",
        requirements=requirements.model_dump()
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job

@router.get("", response_model=List[JobResponse])
def list_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    jobs = db.query(Job).filter(Job.user_id == current_user.id).order_by(Job.created_at.desc()).all()
    return jobs

@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found")
    return job

@router.post("/{job_id}/analyze", response_model=JobResponse)
def analyze_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found")

    ai = get_ai_provider()
    requirements = ai.extract_job_requirements(job.description)
    job.requirements = requirements.model_dump()
    job.analysis_status = "completed"

    db.commit()
    db.refresh(job)
    return job
