from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import User, Resume, Job, Match
from app.schemas import MatchCreate, MatchResponse, ResumeResponse, JobResponse
from app.core.dependencies import get_current_user
from app.services.matching.matching_engine import MatchingEngine

router = APIRouter()

@router.post("", response_model=MatchResponse, status_code=status.HTTP_201_CREATED)
def create_match(
    match_in: MatchCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ownership & existence validation
    resume = db.query(Resume).filter(Resume.id == match_in.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specified resume was not found")

    job = db.query(Job).filter(Job.id == match_in.job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specified job posting was not found")

    # Run deterministic matching engine
    resume_dict = {
        "id": resume.id,
        "extracted_text": resume.extracted_text,
        "parsed_data": resume.parsed_data or {}
    }
    job_dict = {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "description": job.description,
        "requirements": job.requirements or {}
    }

    match_result = MatchingEngine.calculate_match(resume_dict, job_dict)

    new_match = Match(
        user_id=current_user.id,
        resume_id=resume.id,
        job_id=job.id,
        overall_score=match_result["overall_score"],
        component_scores=match_result["component_scores"],
        matched_skills=match_result["matched_skills"],
        missing_required_skills=match_result["missing_required_skills"],
        missing_preferred_skills=match_result["missing_preferred_skills"],
        strengths=match_result["strengths"],
        improvements=match_result["improvements"]
    )
    db.add(new_match)
    db.commit()
    db.refresh(new_match)

    # Attach loaded models for schema response
    res = MatchResponse.model_validate(new_match)
    res.resume = ResumeResponse.model_validate(resume)
    res.job = JobResponse.model_validate(job)
    return res

@router.get("", response_model=List[MatchResponse])
def list_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    matches = db.query(Match).filter(Match.user_id == current_user.id).order_by(Match.created_at.desc()).all()
    results = []
    for m in matches:
        res = MatchResponse.model_validate(m)
        if m.resume:
            res.resume = ResumeResponse.model_validate(m.resume)
        if m.job:
            res.job = JobResponse.model_validate(m.job)
        results.append(res)
    return results

@router.get("/{match_id}", response_model=MatchResponse)
def get_match(
    match_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    match = db.query(Match).filter(Match.id == match_id, Match.user_id == current_user.id).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match analysis not found")

    res = MatchResponse.model_validate(match)
    if match.resume:
        res.resume = ResumeResponse.model_validate(match.resume)
    if match.job:
        res.job = JobResponse.model_validate(match.job)
    return res
