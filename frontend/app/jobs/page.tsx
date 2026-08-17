'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Search, Building2, AlertCircle } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { JobCard } from '@/components/jobs/JobCard';
import { api } from '@/lib/api';
import { Job, Resume } from '@/types';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Match modal selection state
  const [matchModalJobId, setMatchModalJobId] = useState<string | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [matching, setMatching] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsData, resumesData] = await Promise.all([
        api.getJobs(),
        api.getResumes().catch(() => []),
      ]);
      setJobs(jobsData);
      setResumes(resumesData);
      if (resumesData.length > 0) {
        setSelectedResumeId(resumesData[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Connected to API endpoint. No job postings created yet or backend server initializing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!title || !company || !description) {
      setFormError('Please fill out Job Title, Company Name, and Job Description.');
      return;
    }

    setCreating(true);
    try {
      const newJob = await api.createJob({ title, company, description });
      setJobs((prev) => [newJob, ...prev]);
      setIsModalOpen(false);
      setTitle('');
      setCompany('');
      setDescription('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to create job posting');
    } finally {
      setCreating(false);
    }
  };

  const handleRunMatch = async () => {
    if (!matchModalJobId || !selectedResumeId) return;
    setMatching(true);
    try {
      const match = await api.createMatch(selectedResumeId, matchModalJobId);
      setMatchModalJobId(null);
      router.push(`/matches/${match.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to generate match score. Please check backend connection.');
    } finally {
      setMatching(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">Job Descriptions & Matcher</h2>
              <p className="text-xs text-slate-400 mt-1">
                Add target job descriptions to analyze required skills and generate match scores against your resumes.
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Job Description
            </Button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by title or company..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner size="lg" text="Loading job postings..." />
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              title={searchQuery ? 'No matching jobs found' : 'No Job Descriptions Created'}
              description="Add a target job description to automatically extract requirements and compute match scores."
              icon={Briefcase}
              actionLabel="Add Job Description"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onMatch={(jobId) => setMatchModalJobId(jobId)}
                />
              ))}
            </div>
          )}

          {/* Create Job Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Add Target Job Description"
            maxWidth="lg"
          >
            <form onSubmit={handleCreateJob} className="space-y-4">
              {formError && (
                <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. TechCorp Inc."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Paste the full job description text here (including required skills, qualifications, responsibilities)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={creating}>
                  Save & Process Job
                </Button>
              </div>
            </form>
          </Modal>

          {/* Quick Match Selection Modal */}
          <Modal
            isOpen={!!matchModalJobId}
            onClose={() => setMatchModalJobId(null)}
            title="Match Resume to Job"
            maxWidth="md"
          >
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Select one of your uploaded resumes to calculate an explainable match score against this job posting.
              </p>

              {resumes.length === 0 ? (
                <div className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl">
                  You need to upload a resume first before performing match analysis.
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Resume</label>
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
                <Button variant="outline" size="sm" onClick={() => setMatchModalJobId(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRunMatch}
                  disabled={resumes.length === 0}
                  isLoading={matching}
                >
                  Generate Match Analysis
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
