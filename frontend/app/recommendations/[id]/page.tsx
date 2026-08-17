'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lightbulb,
  ArrowLeft,
  CheckSquare,
  BookOpen,
  FolderPlus,
  MessageSquare,
  Sparkles,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';
import { Recommendation, PriorityItem } from '@/types';

export default function RecommendationsPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params?.id as string;

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;
    const fetchRecs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getRecommendations(matchId);
        setRecommendation(data);
      } catch (err: any) {
        setError(err.message || 'Connected to recommendations API endpoint. Backend AI generating recommendations.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [matchId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <LoadingSpinner size="lg" text="Generating personalized AI learning roadmap & recommendations..." />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const highPriority = recommendation?.priority_skills?.filter((p) => p.priority === 'HIGH') || [];
  const medPriority = recommendation?.priority_skills?.filter((p) => p.priority === 'MEDIUM') || [];
  const lowPriority = recommendation?.priority_skills?.filter((p) => p.priority === 'LOW') || [];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => router.back()} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  AI Career Recommendations <Sparkles className="w-4 h-4 text-purple-400" />
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actionable roadmap generated specifically to bridge your resume skill gaps.
                </p>
              </div>
            </div>

            <Link href="/interview">
              <Button variant="primary" size="sm" rightIcon={<MessageSquare className="w-4 h-4" />}>
                Practice AI Interview
              </Button>
            </Link>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* PRIORITY SKILLS MATRIX */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> Prioritized Skill Development Matrix
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* HIGH PRIORITY */}
              <Card className="border-rose-500/30 bg-rose-950/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-rose-400 uppercase">HIGH PRIORITY</span>
                  <Badge variant="danger" size="sm">{highPriority.length} Items</Badge>
                </div>
                {highPriority.length > 0 ? (
                  <div className="space-y-3">
                    {highPriority.map((item) => (
                      <div key={item.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No high-priority gaps identified.</p>
                )}
              </Card>

              {/* MEDIUM PRIORITY */}
              <Card className="border-amber-500/30 bg-amber-950/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase">MEDIUM PRIORITY</span>
                  <Badge variant="warning" size="sm">{medPriority.length} Items</Badge>
                </div>
                {medPriority.length > 0 ? (
                  <div className="space-y-3">
                    {medPriority.map((item) => (
                      <div key={item.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No medium-priority gaps identified.</p>
                )}
              </Card>

              {/* LOW PRIORITY */}
              <Card className="border-emerald-500/30 bg-emerald-950/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase">LOW PRIORITY</span>
                  <Badge variant="success" size="sm">{lowPriority.length} Items</Badge>
                </div>
                {lowPriority.length > 0 ? (
                  <div className="space-y-3">
                    {lowPriority.map((item) => (
                      <div key={item.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No low-priority gaps identified.</p>
                )}
              </Card>
            </div>
          </div>

          {/* LEARNING ROADMAP & RESUME SUGGESTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Learning Roadmap */}
            <Card>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Phased Learning Roadmap
              </h3>
              {recommendation?.learning_roadmap && recommendation.learning_roadmap.length > 0 ? (
                <div className="space-y-4">
                  {recommendation.learning_roadmap.map((step, idx) => (
                    <div key={idx} className="border-l-2 border-cyan-500/50 pl-4 py-1 space-y-1.5">
                      <h4 className="text-xs font-bold text-cyan-400">{step.phase}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {step.topics?.map((topic, tIdx) => (
                          <span key={tIdx} className="text-xs bg-slate-950 text-slate-200 px-2 py-0.5 rounded border border-slate-800">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No custom roadmap steps generated yet.</p>
              )}
            </Card>

            {/* Resume Improvement Suggestions */}
            <Card>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" /> Resume Action Items
              </h3>
              {recommendation?.resume_suggestions && recommendation.resume_suggestions.length > 0 ? (
                <ul className="space-y-2.5">
                  {recommendation.resume_suggestions.map((sug, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <input type="checkbox" className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600" />
                      <span className="leading-relaxed">{sug}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">No specific resume suggestions available.</p>
              )}
            </Card>
          </div>

          {/* SUGGESTED PORTFOLIO PROJECTS */}
          {recommendation?.suggested_projects && recommendation.suggested_projects.length > 0 && (
            <Card>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-purple-400" /> Suggested Portfolio Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendation.suggested_projects.map((proj, idx) => (
                  <div key={idx} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.skills_covered?.map((s, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
