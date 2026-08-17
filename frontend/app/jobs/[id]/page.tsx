'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';
import { Job, Resume } from '@/types';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const [jobData, resumesData] = await Promise.all([
          api.getJob(jobId),
          api.getResumes().catch(() => []),
        ]);
        setJob(jobData);
        setResumes(resumesData);
        if (resumesData.length > 0) {
          setSelectedResumeId(resumesData[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'Unable to fetch job details from backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [jobId]);

  const handleRunMatch = async () => {
    if (!selectedResumeId || !jobId) return;
    setMatching(true);
    try {
      const match = await api.createMatch(selectedResumeId, jobId);
      setIsMatchModalOpen(false);
      router.push(`/matches/${match.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to generate match score');
    } finally {
      setMatching(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <LoadingSpinner size="lg" text="Loading job details..." />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error || !job) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-4">
            <Button variant="outline" size="sm" onClick={() => router.push('/jobs')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Jobs
            </Button>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Job Posting Not Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">{error || 'The requested job posting could not be loaded.'}</p>
              <Link href="/jobs">
                <Button variant="primary" size="sm">Return to Jobs List</Button>
              </Link>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const reqs = job.requirements;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => router.push('/jobs')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  {job.title} <Sparkles className="w-4 h-4 text-purple-400" />
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-purple-300">
                    <Building2 className="w-3.5 h-3.5" /> {job.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Created {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsMatchModalOpen(true)}
              leftIcon={<Target className="w-4 h-4" />}
            >
              Match Resume Against Job
            </Button>
          </div>

          {/* Job Requirements Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Required Technical Skills</h3>
              {reqs?.required_skills && reqs.required_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {reqs.required_skills.map((skill, idx) => (
                    <span key={idx} className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No specific required skills extracted.</p>
              )}
            </Card>

            <Card>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Preferred Qualifications</h3>
              {reqs?.preferred_skills && reqs.preferred_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {reqs.preferred_skills.map((skill, idx) => (
                    <span key={idx} className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No preferred qualifications specified.</p>
              )}
            </Card>
          </div>

          {/* Full Job Description Text */}
          <Card>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Full Description</h3>
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
              {job.description}
            </div>
          </Card>

          {/* Match Selection Modal */}
          <Modal
            isOpen={isMatchModalOpen}
            onClose={() => setIsMatchModalOpen(false)}
            title="Generate Match Analysis"
            maxWidth="md"
          >
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Select your resume to evaluate compatibility with <strong>{job.title}</strong> at <strong>{job.company}</strong>.
              </p>

              {resumes.length === 0 ? (
                <div className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl">
                  Please upload a resume first before running match analysis.
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Resume</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.filename} ({new Date(r.upload_date).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" size="sm" onClick={() => setIsMatchModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRunMatch}
                  disabled={resumes.length === 0}
                  isLoading={matching}
                >
                  Generate Match
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
