import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import User, Job, InterviewSession
from app.schemas import (
    InterviewStartRequest, InterviewAnswerRequest, InterviewSessionResponse,
    InterviewQuestion, InterviewQuestionEvaluation
)
from app.core.dependencies import get_current_user
from app.services.ai import get_ai_provider

router = APIRouter()

@router.post("", response_model=InterviewSessionResponse, status_code=status.HTTP_201_CREATED)
def start_interview_session(
    req: InterviewStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == req.job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specified job role not found")

    reqs = job.requirements or {}
    req_skills = reqs.get("required_skills", ["Software Engineering", "System Design"])

    # Generate tailored interview questions based on job description
    questions = [
        {
            "id": f"q-1-{uuid.uuid4().hex[:6]}",
            "question": f"Can you explain your experience building scalable applications using {req_skills[0] if len(req_skills) > 0 else 'modern technology'}?",
            "category": "Technical Architecture",
            "difficulty": "Medium",
            "user_answer": None,
            "evaluation": None
        },
        {
            "id": f"q-2-{uuid.uuid4().hex[:6]}",
            "question": f"How do you handle production debugging and state management when working with {req_skills[1] if len(req_skills) > 1 else 'complex frameworks'}?",
            "category": "Problem Solving",
            "difficulty": "Hard",
            "user_answer": None,
            "evaluation": None
        },
        {
            "id": f"q-3-{uuid.uuid4().hex[:6]}",
            "question": "Describe a scenario where you faced a tight deadline or conflicting requirements. How did you prioritize tasks?",
            "category": "Behavioral (STAR Method)",
            "difficulty": "Medium",
            "user_answer": None,
            "evaluation": None
        }
    ]

    new_session = InterviewSession(
        user_id=current_user.id,
        job_id=job.id,
        job_title=job.title,
        company=job.company,
        status="in_progress",
        current_question_index=0,
        questions=questions
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session

@router.post("/{session_id}/answer", response_model=InterviewSessionResponse)
def submit_interview_answer(
    session_id: str,
    answer_in: InterviewAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")

    questions = list(session.questions)
    current_idx = session.current_question_index

    if current_idx >= len(questions):
        session.status = "completed"
        db.commit()
        db.refresh(session)
        return session

    target_q = questions[current_idx]
    if target_q["id"] != answer_in.question_id:
        # Search by ID if index mismatched
        for q in questions:
            if q["id"] == answer_in.question_id:
                target_q = q
                break

    # Evaluate answer using AI Provider
    ai = get_ai_provider()
    eval_res: InterviewQuestionEvaluation = ai.evaluate_interview_answer(
        question=target_q["question"],
        user_answer=answer_in.answer,
        job_title=session.job_title
    )

    target_q["user_answer"] = answer_in.answer
    target_q["evaluation"] = eval_res.model_dump()

    # Move to next question or complete session
    if current_idx + 1 >= len(questions):
        session.status = "completed"
        scores = [q["evaluation"]["score"] for q in questions if q.get("evaluation")]
        session.final_score = round(sum(scores) / len(scores), 1) if scores else 85.0
        session.feedback_summary = f"Strong interview performance demonstrating clear problem-solving and expertise relevant to {session.job_title} at {session.company}."
    else:
        session.current_question_index = current_idx + 1

    session.questions = questions
    db.commit()
    db.refresh(session)

    return session
