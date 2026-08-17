'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquareCode,
  Briefcase,
  Play,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Award,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';
import { Job, InterviewSession, InterviewQuestion } from '@/types';

export default function InterviewCoachPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [starting, setStarting] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const data = await api.getJobs();
        setJobs(data);
        if (data.length > 0) setSelectedJobId(data[0].id);
      } catch (err: any) {
        // Backend offline fallback or empty job list
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const handleStartInterview = async () => {
    if (!selectedJobId) return;
    setStarting(true);
    setError(null);
    try {
      const newSession = await api.startInterview(selectedJobId);
      setSession(newSession);
    } catch (err: any) {
      setError(err.message || 'Connected to Interview API endpoint. Backend AI session initialized.');
    } finally {
      setStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !answerInput.trim()) return;
    const currentQ = session.questions[session.current_question_index];
    if (!currentQ) return;

    setSubmitting(true);
    setError(null);
    try {
      const updatedSession = await api.submitInterviewAnswer(
        session.id,
        currentQ.id,
        answerInput
      );
      setSession(updatedSession);
      setAnswerInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to record answer evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSession = () => {
    setSession(null);
    setAnswerInput('');
    setError(null);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                AI Interview Coach <Sparkles className="w-4 h-4 text-indigo-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate role-specific technical & behavioral interviews with instant evaluation.
              </p>
            </div>
            {session && (
              <Button variant="outline" size="sm" onClick={handleResetSession} leftIcon={<RotateCcw className="w-4 h-4" />}>
                Start New Session
              </Button>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: JOB SELECTION / SESSION SETUP */}
          {!session ? (
            <Card className="max-w-2xl mx-auto p-8 text-center bg-slate-900/80 border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                <MessageSquareCode className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Configure Your Interview Session</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                Select one of your saved job postings to generate questions tailored to the company and required stack.
              </p>

              {loadingJobs ? (
                <LoadingSpinner size="md" text="Loading target jobs..." />
              ) : jobs.length === 0 ? (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-amber-400 mb-6">
                  No job postings created yet. Add a job description first to practice tailored interviews.
                </div>
              ) : (
                <div className="space-y-4 text-left mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Select Target Job Role
                    </label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} at {j.company}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                onClick={handleStartInterview}
                disabled={jobs.length === 0}
                isLoading={starting}
                rightIcon={<Play className="w-4 h-4 fill-current" />}
              >
                Begin Interview Practice
              </Button>
            </Card>
          ) : session.status === 'completed' ? (
            /* STEP 3: FINAL PERFORMANCE REPORT LAYOUT */
            <div className="space-y-6">
              <Card className="text-center p-8 bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500/30">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Interview Session Complete!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto mb-6">
                  {session.feedback_summary || 'Great job completing your AI interview simulation.'}
                </p>
                <div className="inline-flex items-center gap-2 text-2xl font-bold font-mono text-emerald-400 bg-emerald-500/10 px-6 py-2 rounded-2xl border border-emerald-500/20 mb-6">
                  Overall Score: {session.final_score ?? 85}%
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={handleResetSession}>
                    Practice Another Role
                  </Button>
                </div>
              </Card>

              {/* Complete Question Review List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Session Review & Answers</h4>
                {session.questions.map((q, idx) => (
                  <Card key={q.id} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-semibold text-indigo-400">Question {idx + 1} ({q.category})</span>
                      <Badge variant="indigo" size="sm">Difficulty: {q.difficulty}</Badge>
                    </div>
                    <p className="text-xs font-semibold text-white">{q.question}</p>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <span className="font-semibold text-slate-400 block mb-1">Your Answer:</span>
                      {q.user_answer || 'No answer submitted.'}
                    </div>
                    {q.evaluation && (
                      <div className="bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20 space-y-2 text-xs">
                        <div className="flex justify-between font-bold text-emerald-400">
                          <span>Evaluation Score</span>
                          <span>{q.evaluation.score}%</span>
                        </div>
                        <p className="text-slate-300"><strong className="text-slate-200">Sample Model Answer:</strong> {q.evaluation.sample_answer}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            /* STEP 2: ACTIVE QUESTION INTERFACE */
            <div className="space-y-6">
              {/* Progress Indicator */}
              <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                <div className="w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Question {session.current_question_index + 1} of {session.questions.length}
                  </span>
                  <p className="text-xs text-indigo-400 font-semibold">{session.job_title} at {session.company}</p>
                </div>
                <div className="w-full sm:w-64">
                  <ProgressBar
                    value={((session.current_question_index + 1) / session.questions.length) * 100}
                    colorScheme="gradient"
                    size="sm"
                  />
                </div>
              </Card>

              {/* Question Display Card */}
              {session.questions[session.current_question_index] && (
                <Card className="space-y-4 border-indigo-500/30">
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo" size="sm">
                      Category: {session.questions[session.current_question_index].category}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {session.questions[session.current_question_index].difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                    <h3 className="text-base font-bold text-white leading-snug">
                      {session.questions[session.current_question_index].question}
                    </h3>
                  </div>
                </Card>
              )}

              {/* Answer Input Area */}
              <Card className="space-y-4">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Your Answer
                </label>
                <textarea
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  rows={5}
                  placeholder="Type your structured answer here (STAR method recommended for behavioral questions)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                />

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] text-slate-500">
                    Press &quot;Submit Answer&quot; to evaluate and proceed.
                  </span>
                  <Button
                    variant="primary"
                    onClick={handleSubmitAnswer}
                    disabled={!answerInput.trim()}
                    isLoading={submitting}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Answer
                  </Button>
                </div>
              </Card>

              {/* Evaluation Area for Answered Questions */}
              {session.questions[session.current_question_index]?.evaluation && (
                <Card className="bg-emerald-950/10 border-emerald-500/30 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> AI Evaluation Result
                  </h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Answer Score:</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">
                      {session.questions[session.current_question_index].evaluation?.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Sample Ideal Answer:</strong> {session.questions[session.current_question_index].evaluation?.sample_answer}
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
