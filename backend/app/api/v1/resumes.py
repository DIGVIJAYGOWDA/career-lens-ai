import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import User, Resume
from app.schemas import ResumeResponse, ParsedResumeData
from app.core.dependencies import get_current_user
from app.core.config import settings
from app.services.parser.document_parser import DocumentParser
from app.services.ai import get_ai_provider

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024 # 10MB

@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    filename = file.filename or "resume.pdf"
    ext = filename.split(".")[-1].lower()
    if ext not in ["pdf", "docx", "doc"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Only PDF and DOCX files are allowed."
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 10MB limit."
        )

    # 1. Parse text from file
    try:
        extracted_text = DocumentParser.parse_file(file_bytes, filename)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Document parsing error: {str(e)}"
        )

    # 2. Use AI Provider to extract structured data
    ai = get_ai_provider()
    structured_data: ParsedResumeData = ai.structure_resume(extracted_text)

    # Save to storage directory if exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, f"{current_user.id}_{filename}")
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Save DB record
    new_resume = Resume(
        user_id=current_user.id,
        filename=filename,
        file_path=file_path,
        file_size=len(file_bytes),
        file_type=ext.upper(),
        status="parsed",
        analysis_status="completed",
        extracted_text=extracted_text,
        parsed_data=structured_data.model_dump()
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return new_resume

@router.get("", response_model=List[ResumeResponse])
def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.upload_date.desc()).all()
    return resumes

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume

@router.post("/{resume_id}/analyze", response_model=ResumeResponse)
def analyze_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    ai = get_ai_provider()
    structured_data = ai.structure_resume(resume.extracted_text or "")
    resume.parsed_data = structured_data.model_dump()
    resume.status = "parsed"
    resume.analysis_status = "completed"

    db.commit()
    db.refresh(resume)
    return resume
