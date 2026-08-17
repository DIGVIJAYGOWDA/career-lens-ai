from typing import Dict, Any, List, Tuple
from app.services.normalization.skill_normalizer import SkillNormalizer
from app.services.embeddings.semantic_matcher import SemanticMatcher
from app.schemas import ComponentScores

class MatchingEngine:
    @classmethod
    def calculate_match(cls, resume_data: dict, job_data: dict) -> dict:
        """
        Calculates reproducible, explainable match score breakdown.
        """
        parsed_resume = resume_data.get("parsed_data", {}) or {}
        parsed_job_reqs = job_data.get("requirements", {}) or {}

        # 1. Skill Extraction & Normalization
        resume_skills_raw = parsed_resume.get("skills", [])
        resume_skills = set(SkillNormalizer.normalize_skills(resume_skills_raw))
        
        # Also extract skills from raw resume text as secondary check
        extracted_text = parsed_resume.get("extracted_text", "")
        
        req_skills_raw = parsed_job_reqs.get("required_skills", [])
        pref_skills_raw = parsed_job_reqs.get("preferred_skills", [])
        
        req_skills = SkillNormalizer.normalize_skills(req_skills_raw)
        pref_skills = SkillNormalizer.normalize_skills(pref_skills_raw)

        # Matched vs Missing calculation (Deterministic)
        matched_skills = []
        missing_required = []
        missing_preferred = []

        for req in req_skills:
            # Match if normalized skill is in resume skills set OR exact text match in extracted_text
            if req.lower() in [s.lower() for s in resume_skills] or (req and req.lower() in extracted_text.lower()):
                matched_skills.append(req)
            else:
                missing_required.append(req)

        for pref in pref_skills:
            if pref.lower() in [s.lower() for s in resume_skills] or (pref and pref.lower() in extracted_text.lower()):
                if pref not in matched_skills:
                    matched_skills.append(pref)
            else:
                missing_preferred.append(pref)

        # 2. Sub-Score Calculations
        # Required Skill Score
        if req_skills:
            req_matched_count = len(req_skills) - len(missing_required)
            required_score = round((req_matched_count / len(req_skills)) * 100.0, 1)
        else:
            required_score = 85.0

        # Preferred Skill Score
        if pref_skills:
            pref_matched_count = len(pref_skills) - len(missing_preferred)
            preferred_score = round((pref_matched_count / len(pref_skills)) * 100.0, 1)
        else:
            preferred_score = 75.0

        # Experience Score
        exp_entries = parsed_resume.get("experience", [])
        req_exp_years = parsed_job_reqs.get("experience_years", 2)
        candidate_years = len(exp_entries) * 1.5 # Estimate ~1.5 yrs per role entry
        if candidate_years >= req_exp_years:
            experience_score = 95.0
        elif candidate_years > 0:
            experience_score = round((candidate_years / max(1, req_exp_years)) * 85.0, 1)
        else:
            experience_score = 60.0

        # Education Score
        edu_entries = parsed_resume.get("education", [])
        req_edu_level = (parsed_job_reqs.get("education_level") or "").lower()
        if not req_edu_level or len(edu_entries) > 0:
            education_score = 90.0
        else:
            education_score = 70.0

        # Semantic Similarity Score (using local TF-IDF cosine matcher)
        job_description = job_data.get("description", "")
        semantic_score = SemanticMatcher.calculate_similarity(extracted_text, job_description)

        # 3. Overall Weighted Composite Score Formula
        # Weights: 40% Required Skills, 20% Preferred Skills, 15% Experience, 10% Education, 15% Semantic
        overall = (
            0.40 * required_score +
            0.20 * preferred_score +
            0.15 * experience_score +
            0.10 * education_score +
            0.15 * semantic_score
        )
        overall_score = round(min(100.0, max(0.0, overall)), 1)

        # 4. Strengths & Improvements Generation
        strengths = []
        improvements = []

        if required_score >= 80:
            strengths.append(f"Strong alignment on required skills ({len(req_skills) - len(missing_required)}/{len(req_skills)} matched).")
        if len(matched_skills) > 0:
            strengths.append(f"Demonstrated technical proficiency in {', '.join(matched_skills[:4])}.")
        if experience_score >= 85:
            strengths.append("Work experience depth satisfies position requirements.")

        if missing_required:
            improvements.append(f"Missing core required skills: {', '.join(missing_required[:3])}.")
        if missing_preferred:
            improvements.append(f"Acquire preferred skills to stand out: {', '.join(missing_preferred[:3])}.")
        if semantic_score < 70:
            improvements.append("Tailor resume language to reflect terminology used in job description.")

        return {
            "overall_score": overall_score,
            "component_scores": ComponentScores(
                required_skill_match=required_score,
                preferred_skill_match=preferred_score,
                experience_match=experience_score,
                education_match=education_score,
                semantic_similarity=semantic_score
            ).model_dump(),
            "matched_skills": matched_skills,
            "missing_required_skills": missing_required,
            "missing_preferred_skills": missing_preferred,
            "strengths": strengths if strengths else ["Good baseline background for application."],
            "improvements": improvements if improvements else ["Minor resume keyword optimization recommended."]
        }
