import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="user", cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="user", cascade="all, delete-orphan")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=True)
    file_size = Column(Integer, default=0)
    file_type = Column(String, nullable=False)
    upload_date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    status = Column(String, default="parsed") # processing, parsed, error
    analysis_status = Column(String, default="completed")
    extracted_text = Column(Text, nullable=True)
    parsed_data = Column(JSON, nullable=True) # skills, education, experience, projects, certifications

    user = relationship("User", back_populates="resumes")
    matches = relationship("Match", back_populates="resume", cascade="all, delete-orphan")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    analysis_status = Column(String, default="completed")
    requirements = Column(JSON, nullable=True) # required_skills, preferred_skills, experience_years, education_level

    user = relationship("User", back_populates="jobs")
    matches = relationship("Match", back_populates="job", cascade="all, delete-orphan")


class Match(Base):
    __tablename__ = "matches"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    resume_id = Column(String, ForeignKey("resumes.id"), nullable=False)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    overall_score = Column(Float, nullable=False)
    component_scores = Column(JSON, nullable=False)
    matched_skills = Column(JSON, default=list)
    missing_required_skills = Column(JSON, default=list)
    missing_preferred_skills = Column(JSON, default=list)
    strengths = Column(JSON, default=list)
    improvements = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="matches")
    resume = relationship("Resume", back_populates="matches")
    job = relationship("Job", back_populates="matches")
    recommendations = relationship("Recommendation", back_populates="match", cascade="all, delete-orphan")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String, primary_key=True, default=generate_uuid)
    match_id = Column(String, ForeignKey("matches.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    priority_skills = Column(JSON, default=list)
    learning_roadmap = Column(JSON, default=list)
    resume_suggestions = Column(JSON, default=list)
    interview_topics = Column(JSON, default=list)
    suggested_projects = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    match = relationship("Match", back_populates="recommendations")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    job_title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    status = Column(String, default="in_progress") # in_progress, completed
    current_question_index = Column(Integer, default=0)
    questions = Column(JSON, default=list)
    final_score = Column(Float, nullable=True)
    feedback_summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
