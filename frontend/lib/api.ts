import {
  AuthResponse,
  User,
  Resume,
  Job,
  MatchAnalysis,
  Recommendation,
  DashboardStats,
  InterviewSession,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Token helper
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('careerlens_token');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('careerlens_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('careerlens_token');
  }
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API Request Failed (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Ignore json parse error
    }
    throw new ApiError(errorMessage, response.status);
  }

  return response.json();
}

// Centralized API Client
export const api = {
  // Auth
  async register(data: { email: string; password: string; full_name: string }): Promise<AuthResponse> {
    return request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCurrentUser(): Promise<User> {
    return request<User>('/api/v1/auth/me');
  },

  // Resumes
  async uploadResume(file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append('file', file);
    return request<Resume>('/api/v1/resumes/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async getResumes(): Promise<Resume[]> {
    return request<Resume[]>('/api/v1/resumes');
  },

  async getResume(id: string): Promise<Resume> {
    return request<Resume>(`/api/v1/resumes/${id}`);
  },

  // Jobs
  async createJob(data: { title: string; company: string; description: string }): Promise<Job> {
    return request<Job>('/api/v1/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getJobs(): Promise<Job[]> {
    return request<Job[]>('/api/v1/jobs');
  },

  async getJob(id: string): Promise<Job> {
    return request<Job>(`/api/v1/jobs/${id}`);
  },

  // Matches
  async createMatch(resume_id: string, job_id: string): Promise<MatchAnalysis> {
    return request<MatchAnalysis>('/api/v1/matches', {
      method: 'POST',
      body: JSON.stringify({ resume_id, job_id }),
    });
  },

  async getMatch(id: string): Promise<MatchAnalysis> {
    return request<MatchAnalysis>(`/api/v1/matches/${id}`);
  },

  async getMatches(): Promise<MatchAnalysis[]> {
    return request<MatchAnalysis[]>('/api/v1/matches');
  },

  // Recommendations
  async getRecommendations(match_id: string): Promise<Recommendation> {
    return request<Recommendation>(`/api/v1/recommendations/${match_id}`);
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>('/api/v1/dashboard/stats');
  },

  // Interview Coach
  async startInterview(job_id: string): Promise<InterviewSession> {
    return request<InterviewSession>('/api/v1/interviews', {
      method: 'POST',
      body: JSON.stringify({ job_id }),
    });
  },

  async submitInterviewAnswer(session_id: string, question_id: string, answer: string): Promise<InterviewSession> {
    return request<InterviewSession>(`/api/v1/interviews/${session_id}/answer`, {
      method: 'POST',
      body: JSON.stringify({ question_id, answer }),
    });
  },
};
