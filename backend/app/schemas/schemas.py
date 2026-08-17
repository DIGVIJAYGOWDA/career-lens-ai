from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field

# User & Auth
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Resume
class WorkExperience(BaseModel):
    company: str
    title: str
    duration: str
    description: Optional[str] = None
    key_achievements: Optional[List[str]] = []

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    graduation_year: Optional[str] = None

class Project(BaseModel):
    title: str
    description: str
    technologies: Optional[List[str]] = []
    link: Optional[str] = None

class ParsedResumeData(BaseModel):
    extracted_text: str
    skills: List[str] = []
    education: List[Education] = []
    experience: List[WorkExperience] = []
    projects: List[Project] = []
    certifications: List[str] = []

class ResumeResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    file_size: int
    file_type: str
    upload_date: datetime
    status: str
    analysis_status: Optional[str] = "completed"
    parsed_data: Optional[ParsedResumeData] = None

    class Config:
        from_attributes = True


# Job
class JobRequirements(BaseModel):
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    experience_years: Optional[int] = 0
    education_level: Optional[str] = None

class JobCreate(BaseModel):
    title: str
    company: str
    description: str

class JobResponse(BaseModel):
    id: str
    user_id: str
    title: str
    company: str
    description: str
    created_at: datetime
    analysis_status: Optional[str] = "completed"
    requirements: Optional[JobRequirements] = None

    class Config:
        from_attributes = True


# Match
class ComponentScores(BaseModel):
    required_skill_match: float
    preferred_skill_match: float
    experience_match: float
    education_match: float
    semantic_similarity: float

class MatchCreate(BaseModel):
    resume_id: str
    job_id: str

class MatchResponse(BaseModel):
    id: str
    resume_id: str
    job_id: str
    overall_score: float
    component_scores: ComponentScores
    matched_skills: List[str] = []
    missing_required_skills: List[str] = []
    missing_preferred_skills: List[str] = []
    strengths: List[str] = []
    improvements: List[str] = []
    created_at: datetime
    resume: Optional[ResumeResponse] = None
    job: Optional[JobResponse] = None

    class Config:
        from_attributes = True


# Recommendation
class PriorityItem(BaseModel):
    id: str
    title: str
    description: str
    priority: str # HIGH, MEDIUM, LOW
    category: str # SKILL, RESUME, INTERVIEW, PROJECT

class LearningRoadmapStep(BaseModel):
    phase: str
    topics: List[str] = []
    resources: List[str] = []

class SuggestedProject(BaseModel):
    title: str
    description: str
    skills_covered: List[str] = []

class RecommendationResponse(BaseModel):
    id: str
    match_id: str
    priority_skills: List[PriorityItem] = []
    learning_roadmap: List[LearningRoadmapStep] = []
    resume_suggestions: List[str] = []
    interview_topics: List[str] = []
    suggested_projects: List[SuggestedProject] = []

    class Config:
        from_attributes = True


# Interview Coach
class InterviewQuestionEvaluation(BaseModel):
    score: float
    strengths: List[str] = []
    improvements: List[str] = []
    sample_answer: str

class InterviewQuestion(BaseModel):
    id: str
    question: str
    category: str
    difficulty: str
    user_answer: Optional[str] = None
    evaluation: Optional[InterviewQuestionEvaluation] = None

class InterviewStartRequest(BaseModel):
    job_id: str

class InterviewAnswerRequest(BaseModel):
    question_id: str
    answer: str

class InterviewSessionResponse(BaseModel):
    id: str
    job_id: str
    job_title: str
    company: str
    status: str
    current_question_index: int
    questions: List[InterviewQuestion] = []
    created_at: datetime
    final_score: Optional[float] = None
    feedback_summary: Optional[str] = None

    class Config:
        from_attributes = True


# Dashboard Stats
class SkillCount(BaseModel):
    name: str
    count: int

class DashboardStats(BaseModel):
    total_resumes: int
    total_jobs: int
    recent_analyses_count: int
    average_match_score: float
    top_skills: List[SkillCount] = []
    common_skill_gaps: List[SkillCount] = []
