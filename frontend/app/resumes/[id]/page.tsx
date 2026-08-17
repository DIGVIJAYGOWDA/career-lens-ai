'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Code2,
  AlignLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';
import { Resume } from '@/types';

export default function ResumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params?.id as string;

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'structured' | 'raw'>('structured');

  useEffect(() => {
    if (!resumeId) return;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getResume(resumeId);
        setResume(data);
      } catch (err: any) {
        setError(err.message || 'Unable to fetch resume details from backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [resumeId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <LoadingSpinner size="lg" text="Loading parsed resume details..." />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error || !resume) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-4">
            <Button variant="outline" size="sm" onClick={() => router.push('/resumes')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Resumes
            </Button>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Resume Not Found or Backend Offline</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">{error || 'The requested resume document could not be retrieved.'}</p>
              <Link href="/resumes">
                <Button variant="primary" size="sm">Return to Resumes List</Button>
              </Link>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const parsed = resume.parsed_data;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Back Navigation & Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => router.push('/resumes')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  {resume.filename} <Sparkles className="w-4 h-4 text-indigo-400" />
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uploaded on {new Date(resume.upload_date).toLocaleDateString()} • {(resume.file_size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={resume.status === 'parsed' ? 'success' : 'warning'}>
                Status: {resume.status}
              </Badge>
              <Link href="/jobs">
                <Button variant="primary" size="sm">Match Against Job</Button>
              </Link>
            </div>
          </div>

          {/* View Mode Toggle Tabs */}
          <div className="flex gap-2 border-b border-slate-800">
            <button
              onClick={() => setActiveTab('structured')}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'structured'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" /> Structured Parsed Data
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'raw'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlignLeft className="w-4 h-4" /> Extracted Raw Text
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'structured' ? (
            <div className="space-y-6">
              {/* Skills Section */}
              <Card>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" /> Extracted Technical & Professional Skills
                </h3>
                {parsed?.skills && parsed.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {parsed.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-lg font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No skills extracted yet or processing in backend.</p>
                )}
              </Card>

              {/* Work Experience */}
              <Card>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-400" /> Professional Experience
                </h3>
                {parsed?.experience && parsed.experience.length > 0 ? (
                  <div className="space-y-6">
                    {parsed.experience.map((exp, idx) => (
                      <div key={idx} className="border-l-2 border-slate-800 pl-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-white">{exp.title}</h4>
                          <span className="text-xs text-slate-400 font-mono">{exp.duration}</span>
                        </div>
                        <p className="text-xs font-medium text-purple-400">{exp.company}</p>
                        {exp.description && (
                          <p className="text-xs text-slate-300 leading-relaxed mt-2">{exp.description}</p>
                        )}
                        {exp.key_achievements && exp.key_achievements.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {exp.key_achievements.map((ach, aIdx) => (
                              <li key={aIdx} className="text-xs text-slate-400 flex items-start gap-1.5">
                                <span className="text-indigo-400 mt-0.5">•</span>
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No work experience entries recorded.</p>
                )}
              </Card>

              {/* Education & Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education */}
                <Card>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" /> Education
                  </h3>
                  {parsed?.education && parsed.education.length > 0 ? (
                    <div className="space-y-3">
                      {parsed.education.map((edu, idx) => (
                        <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                          <h4 className="text-xs font-semibold text-white">{edu.degree}</h4>
                          <p className="text-xs text-emerald-400">{edu.institution}</p>
                          {edu.graduation_year && (
                            <p className="text-[11px] text-slate-400 mt-1">Graduated: {edu.graduation_year}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No education entries found.</p>
                  )}
                </Card>

                {/* Certifications */}
                <Card>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" /> Certifications
                  </h3>
                  {parsed?.certifications && parsed.certifications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {parsed.certifications.map((cert, idx) => (
                        <span key={idx} className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                          {cert}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No certifications listed.</p>
                  )}
                </Card>
              </div>

              {/* Projects */}
              {parsed?.projects && parsed.projects.length > 0 && (
                <Card>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-cyan-400" /> Featured Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parsed.projects.map((proj, idx) => (
                      <div key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                        <h4 className="text-xs font-bold text-white mb-1">{proj.title}</h4>
                        <p className="text-xs text-slate-300 mb-2 leading-relaxed">{proj.description}</p>
                        {proj.technologies && (
                          <div className="flex flex-wrap gap-1">
                            {proj.technologies.map((t, tIdx) => (
                              <span key={tIdx} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Extracted Document Text</h3>
              <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 max-h-[600px] overflow-y-auto leading-relaxed">
                {parsed?.extracted_text || 'No raw text extracted.'}
              </pre>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
