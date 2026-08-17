'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Lightbulb,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ScoreMeter } from '@/components/matches/ScoreMeter';
import { api } from '@/lib/api';
import { MatchAnalysis } from '@/types';

export default function MatchAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params?.id as string;

  const [match, setMatch] = useState<MatchAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;
    const fetchMatch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getMatch(matchId);
        setMatch(data);
      } catch (err: any) {
        setError(err.message || 'Unable to fetch match analysis data from backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [matchId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <LoadingSpinner size="lg" text="Generating explainable match score breakdown..." />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error || !match) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-4">
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Dashboard
            </Button>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Match Analysis Not Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">{error || 'The requested match analysis report is unavailable.'}</p>
              <Link href="/dashboard">
                <Button variant="primary" size="sm">Return to Dashboard</Button>
              </Link>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const scores = match.component_scores;

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
                  Match Analysis Report <Sparkles className="w-4 h-4 text-emerald-400" />
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Explainable AI evaluation computed on {new Date(match.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Link href={`/recommendations/${match.id}`}>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View AI Career Recommendations
              </Button>
            </Link>
          </div>

          {/* Top Score Banner & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Score Gauge Card */}
            <Card className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-900 to-slate-950 border-indigo-500/20">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
                Overall Compatibility Score
              </p>
              <ScoreMeter score={match.overall_score} size="lg" />
              <p className="text-xs text-slate-400 mt-6 max-w-xs leading-relaxed">
                Score calculated via backend vector embeddings and structured criteria weighting.
              </p>
            </Card>

            {/* Component Sub-scores */}
            <Card className="lg:col-span-2 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Component Score Breakdown
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Required Skills Match</span>
                    <span className="text-indigo-400 font-mono">{scores?.required_skill_match ?? 0}%</span>
                  </div>
                  <ProgressBar value={scores?.required_skill_match ?? 0} colorScheme="indigo" size="md" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Preferred Qualifications Match</span>
                    <span className="text-purple-400 font-mono">{scores?.preferred_skill_match ?? 0}%</span>
                  </div>
                  <ProgressBar value={scores?.preferred_skill_match ?? 0} colorScheme="emerald" size="md" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Work Experience Depth</span>
                    <span className="text-cyan-400 font-mono">{scores?.experience_match ?? 0}%</span>
                  </div>
                  <ProgressBar value={scores?.experience_match ?? 0} colorScheme="indigo" size="md" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Education Alignment</span>
                    <span className="text-emerald-400 font-mono">{scores?.education_match ?? 0}%</span>
                  </div>
                  <ProgressBar value={scores?.education_match ?? 0} colorScheme="emerald" size="md" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Semantic Resume-Job Similarity</span>
                    <span className="text-amber-400 font-mono">{scores?.semantic_similarity ?? 0}%</span>
                  </div>
                  <ProgressBar value={scores?.semantic_similarity ?? 0} colorScheme="amber" size="md" />
                </div>
              </div>
            </Card>
          </div>

          {/* Skill Matching Grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matched Skills */}
            <Card>
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Matched Skills ({match.matched_skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {match.matched_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg"
                  >
                    ✓ {skill}
                  </span>
                )) || <p className="text-xs text-slate-500">None identified.</p>}
              </div>
            </Card>

            {/* Missing Required Skills */}
            <Card>
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Missing Required ({match.missing_required_skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {match.missing_required_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-lg"
                  >
                    ✕ {skill}
                  </span>
                )) || <p className="text-xs text-slate-500">No required gaps.</p>}
              </div>
            </Card>

            {/* Missing Preferred Skills */}
            <Card>
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Missing Preferred ({match.missing_preferred_skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {match.missing_preferred_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg"
                  >
                    ! {skill}
                  </span>
                )) || <p className="text-xs text-slate-500">No preferred gaps.</p>}
              </div>
            </Card>
          </div>

          {/* Qualitative Analysis: Strengths & Improvement Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Key Candidate Strengths
              </h3>
              <ul className="space-y-2.5">
                {match.strengths?.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                    <span className="leading-relaxed">{str}</span>
                  </li>
                )) || <p className="text-xs text-slate-500">No specific strengths documented.</p>}
              </ul>
            </Card>

            <Card>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Key Areas for Improvement
              </h3>
              <ul className="space-y-2.5">
                {match.improvements?.map((imp, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-amber-400 shrink-0 mt-0.5 font-bold">•</span>
                    <span className="leading-relaxed">{imp}</span>
                  </li>
                )) || <p className="text-xs text-slate-500">No specific improvements suggested.</p>}
              </ul>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
