from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import User, Match, Recommendation, Resume, Job
from app.schemas import RecommendationResponse, PriorityItem, LearningRoadmapStep, SuggestedProject
from app.core.dependencies import get_current_user
from app.services.ai import get_ai_provider

router = APIRouter()

@router.get("/{match_id}", response_model=RecommendationResponse)
def get_recommendations_for_match(
    match_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    match = db.query(Match).filter(Match.id == match_id, Match.user_id == current_user.id).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match record not found")

    # Check if recommendation already generated and saved in DB
    existing_rec = db.query(Recommendation).filter(Recommendation.match_id == match_id).first()
    if existing_rec:
        return existing_rec

    # Generate new recommendation using AI provider logic
    resume = db.query(Resume).filter(Resume.id == match.resume_id).first()
    job = db.query(Job).filter(Job.id == match.job_id).first()

    resume_dict = resume.parsed_data if resume else {}
    job_dict = {"title": job.title if job else "Engineering Role", "description": job.description if job else ""}
    match_dict = {
        "matched_skills": match.matched_skills or [],
        "missing_required_skills": match.missing_required_skills or [],
        "missing_preferred_skills": match.missing_preferred_skills or []
    }

    ai = get_ai_provider()
    rec_data = ai.generate_recommendations(resume_dict, job_dict, match_dict)

    new_rec = Recommendation(
        match_id=match.id,
        user_id=current_user.id,
        priority_skills=rec_data.get("priority_skills", []),
        learning_roadmap=rec_data.get("learning_roadmap", []),
        resume_suggestions=rec_data.get("resume_suggestions", []),
        interview_topics=rec_data.get("interview_topics", []),
        suggested_projects=rec_data.get("suggested_projects", [])
    )
    db.add(new_rec)
    db.commit()
    db.refresh(new_rec)

    return new_rec
