from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.schemas import ParsedResumeData, JobRequirements, InterviewQuestionEvaluation

class AIProvider(ABC):
    @abstractmethod
    def structure_resume(self, extracted_text: str) -> ParsedResumeData:
        pass

    @abstractmethod
    def extract_job_requirements(self, job_description: str) -> JobRequirements:
        pass

    @abstractmethod
    def generate_recommendations(self, resume_data: dict, job_data: dict, match_result: dict) -> dict:
        pass

    @abstractmethod
    def evaluate_interview_answer(self, question: str, user_answer: str, job_title: str) -> InterviewQuestionEvaluation:
        pass
