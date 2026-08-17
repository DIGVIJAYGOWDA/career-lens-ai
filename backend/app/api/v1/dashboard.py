from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import User, Resume, Job, Match
from app.schemas import DashboardStats, SkillCount
from app.core.dependencies import get_current_user

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    user_jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
    user_matches = db.query(Match).filter(Match.user_id == current_user.id).all()

    total_resumes = len(user_resumes)
    total_jobs = len(user_jobs)
    recent_analyses_count = len(user_matches)

    if user_matches:
        avg_score = round(sum(m.overall_score for m in user_matches) / len(user_matches), 1)
    else:
        avg_score = 0.0

    # Aggregate extracted skills across all user resumes
    skills_counter = Counter()
    for r in user_resumes:
        if r.parsed_data and isinstance(r.parsed_data, dict):
            skills = r.parsed_data.get("skills", [])
            for s in skills:
                skills_counter[s] += 1

    top_skills = [SkillCount(name=k, count=v) for k, v in skills_counter.most_common(8)]

    # Aggregate missing required skills across all matches
    gaps_counter = Counter()
    for m in user_matches:
        if m.missing_required_skills:
            for g in m.missing_required_skills:
                gaps_counter[g] += 1

    common_gaps = [SkillCount(name=k, count=v) for k, v in gaps_counter.most_common(8)]

    return DashboardStats(
        total_resumes=total_resumes,
        total_jobs=total_jobs,
        recent_analyses_count=recent_analyses_count,
        average_match_score=avg_score,
        top_skills=top_skills,
        common_skill_gaps=common_gaps
    )
