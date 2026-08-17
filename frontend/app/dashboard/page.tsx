'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Briefcase,
  Target,
  Plus,
  Upload,
  ArrowRight,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Sparkles,
  MessageSquareCode,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { DashboardStats, Resume, Job, MatchAnalysis } from '@/types';
import { ScoreMeter } from '@/components/matches/ScoreMeter';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentResumes, setRecentResumes] = useState<Resume[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentMatches, setRecentMatches] = useState<MatchAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, resumesData, jobsData, matchesData] = await Promise.allSettled([
          api.getDashboardStats(),
          api.getResumes(),
          api.getJobs(),
          api.getMatches(),
        ]);

        if (statsData.status === 'fulfilled') setStats(statsData.value);
        if (resumesData.status === 'fulfilled') setRecentResumes(resumesData.value);
        if (jobsData.status === 'fulfilled') setRecentJobs(jobsData.value);
        if (matchesData.status === 'fulfilled') setRecentMatches(matchesData.value);
      } catch (err: any) {
        setError('Connected to API endpoint. No backend data recorded yet or server initializing.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalResumes = stats?.total_resumes ?? recentResumes.length;
  const totalJobs = stats?.total_jobs ?? recentJobs.length;
  const totalMatches = stats?.recent_analyses_count ?? recentMatches.length;
  const avgMatchScore = stats?.average_match_score ?? (recentMatches.length > 0 ? Math.round(recentMatches.reduce((acc, m) => acc + m.overall_score, 0) / recentMatches.length) : 0);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                Career Insights Command Center <Sparkles className="w-5 h-5 text-indigo-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload resumes, add job descriptions, and evaluate real-time match compatibility.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/resumes">
                <Button size="sm" variant="outline" leftIcon={<Upload className="w-4 h-4" />}>
                  Upload Resume
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                  Add Job Posting
                </Button>
              </Link>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner size="lg" text="Loading dashboard statistics and activity..." />
          ) : (
            <>
              {/* Key Metrics Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Resumes</p>
                    <p className="text-2xl font-bold text-white mt-1">{totalResumes}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Uploaded & parsed</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <FileText className="w-6 h-6" />
                  </div>
                </Card>

                <Card className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Jobs</p>
                    <p className="text-2xl font-bold text-white mt-1">{totalJobs}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Descriptions analyzed</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                    <Briefcase className="w-6 h-6" />
                  </div>
                </Card>

                <Card className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Match Analyses</p>
                    <p className="text-2xl font-bold text-white mt-1">{totalMatches}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Evaluations run</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Target className="w-6 h-6" />
                  </div>
                </Card>

                <Card className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Match Score</p>
                    <p className="text-2xl font-bold text-white mt-1">{avgMatchScore}%</p>
                    <p className="text-[11px] text-slate-500 mt-1">Overall compatibility</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </Card>
              </div>

              {/* Main Content Grid: Activity & Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Resumes & Jobs */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Resumes Widget */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-400" /> Recent Resumes
                      </h3>
                      <Link href="/resumes" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                        View All
                      </Link>
                    </div>

                    {recentResumes.length === 0 ? (
                      <EmptyState
                        title="No Resumes Uploaded"
                        description="Upload your first PDF or DOCX resume to start analyzing matching opportunities."
                        icon={FileText}
                        actionLabel="Upload Resume"
                        onAction={() => (window.location.href = '/resumes')}
                      />
                    ) : (
                      <div className="space-y-3">
                        {recentResumes.slice(0, 3).map((r) => (
                          <div
                            key={r.id}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                              <div>
                                <h4 className="text-sm font-semibold text-white">{r.filename}</h4>
                                <p className="text-xs text-slate-400">
                                  Uploaded on {new Date(r.upload_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={r.status === 'parsed' ? 'success' : 'warning'} size="sm">
                                {r.status}
                              </Badge>
                              <Link
                                href={`/resumes/${r.id}`}
                                className="text-xs font-semibold text-slate-300 hover:text-white"
                              >
                                Details →
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Jobs Widget */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-purple-400" /> Target Job Descriptions
                      </h3>
                      <Link href="/jobs" className="text-xs font-semibold text-purple-400 hover:text-purple-300">
                        View All
                      </Link>
                    </div>

                    {recentJobs.length === 0 ? (
                      <EmptyState
                        title="No Job Postings Added"
                        description="Add a target job description to run detailed match analysis against your resume."
                        icon={Briefcase}
                        actionLabel="Add Job Description"
                        onAction={() => (window.location.href = '/jobs')}
                      />
                    ) : (
                      <div className="space-y-3">
                        {recentJobs.slice(0, 3).map((j) => (
                          <div
                            key={j.id}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Briefcase className="w-5 h-5 text-purple-400 shrink-0" />
                              <div>
                                <h4 className="text-sm font-semibold text-white">{j.title}</h4>
                                <p className="text-xs text-slate-400">{j.company}</p>
                              </div>
                            </div>
                            <Link
                              href={`/jobs/${j.id}`}
                              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                              Analyze →
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar Column: Top Skills & Action Hub */}
                <div className="space-y-6">
                  {/* Top Skills Distribution */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-400" /> Top Extracted Skills
                    </h3>
                    {stats?.top_skills && stats.top_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {stats.top_skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5"
                          >
                            <span>{s.name}</span>
                            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400 font-mono">
                              {s.count}
                            </span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Skills extracted from your parsed resumes will aggregate here automatically.
                      </p>
                    )}
                  </div>

                  {/* AI Interview Coach Quick Launch Card */}
                  <div className="bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-500/30">
                      <MessageSquareCode className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">AI Interview Simulator</h4>
                    <p className="text-xs text-slate-300 mb-4">
                      Practice job-specific technical & behavioral interview questions with real-time feedback.
                    </p>
                    <Link href="/interview">
                      <Button variant="primary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        Launch Simulator
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
