export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface WorkExperience {
  company: string;
  title: string;
  duration: string;
  description?: string;
  key_achievements?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field_of_study?: string;
  graduation_year?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies?: string[];
  link?: string;
}

export interface ParsedResumeData {
  extracted_text: string;
  skills: string[];
  education: Education[];
  experience: WorkExperience[];
  projects: Project[];
  certifications: string[];
}

export interface Resume {
  id: string;
  user_id: string;
  filename: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  status: 'processing' | 'parsed' | 'error';
  analysis_status?: string;
  parsed_data?: ParsedResumeData;
}

export interface JobRequirements {
  required_skills: string[];
  preferred_skills: string[];
  experience_years?: number;
  education_level?: string;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  description: string;
  created_at: string;
  requirements?: JobRequirements;
  analysis_status?: 'pending' | 'completed' | 'error';
}

export interface ComponentScores {
  required_skill_match: number; // 0 - 100
  preferred_skill_match: number; // 0 - 100
  experience_match: number; // 0 - 100
  education_match: number; // 0 - 100
  semantic_similarity: number; // 0 - 100
}

export interface MatchAnalysis {
  id: string;
  resume_id: string;
  job_id: string;
  overall_score: number; // 0 - 100
  component_scores: ComponentScores;
  matched_skills: string[];
  missing_required_skills: string[];
  missing_preferred_skills: string[];
  strengths: string[];
  improvements: string[];
  created_at: string;
  resume?: Resume;
  job?: Job;
}

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PriorityItem {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  category: 'SKILL' | 'RESUME' | 'INTERVIEW' | 'PROJECT';
}

export interface Recommendation {
  id: string;
  match_id: string;
  priority_skills: PriorityItem[];
  learning_roadmap: {
    phase: string;
    topics: string[];
    resources: string[];
  }[];
  resume_suggestions: string[];
  interview_topics: string[];
  suggested_projects: {
    title: string;
    description: string;
    skills_covered: string[];
  }[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string; // e.g., 'Behavioral', 'Technical', 'System Design'
  difficulty: 'Easy' | 'Medium' | 'Hard';
  user_answer?: string;
  evaluation?: {
    score: number; // 0 - 100
    strengths: string[];
    improvements: string[];
    sample_answer: string;
  };
}

export interface InterviewSession {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  status: 'in_progress' | 'completed';
  current_question_index: number;
  questions: InterviewQuestion[];
  created_at: string;
  final_score?: number;
  feedback_summary?: string;
}

export interface DashboardStats {
  total_resumes: number;
  total_jobs: number;
  recent_analyses_count: number;
  average_match_score: number;
  top_skills: { name: string; count: number }[];
  common_skill_gaps: { name: string; count: number }[];
}
