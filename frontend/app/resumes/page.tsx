'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Plus, Upload, Search, AlertCircle } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ResumeUploader } from '@/components/resumes/ResumeUploader';
import { ResumeCard } from '@/components/resumes/ResumeCard';
import { api } from '@/lib/api';
import { Resume } from '@/types';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getResumes();
      setResumes(data);
    } catch (err: any) {
      setError(err.message || 'Connected to API endpoint. No resumes found yet or backend offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const newResume = await api.uploadResume(file);
      setResumes((prev) => [newResume, ...prev]);
      setIsUploadModalOpen(false);
    } catch (err: any) {
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const filteredResumes = resumes.filter((r) =>
    r.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">Resume Management</h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload and manage your resumes for automated skill extraction and job matching.
              </p>
            </div>
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              variant="primary"
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Upload New Resume
            </Button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resumes by filename..."
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
            <LoadingSpinner size="lg" text="Fetching resumes..." />
          ) : filteredResumes.length === 0 ? (
            <EmptyState
              title={searchQuery ? 'No matching resumes found' : 'No Resumes Uploaded Yet'}
              description="Upload your PDF or DOCX resume to extract skills, education, and work experience."
              icon={FileText}
              actionLabel="Upload Resume Now"
              onAction={() => setIsUploadModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}

          {/* Upload Modal */}
          <Modal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            title="Upload Resume Document"
            maxWidth="lg"
          >
            <ResumeUploader onUpload={handleUpload} isLoading={uploading} />
          </Modal>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
