import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  FileSearch,
  Target,
  Brain,
  MessageSquareCode,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Zap,
} from 'lucide-react';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <LandingNavbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Explainable AI Job Matching</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            Land Your Dream Role with <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              Precision AI Match & Coaching
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            CareerLens AI parses your resume, compares it against real job requirements with explainable scoring, identifies missing skills, and prepares you with AI-driven interview simulations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Analyze Your Resume Now
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Hero Feature Showcase Card */}
          <div className="relative max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 font-mono ml-2">careerlens.ai/match-analysis</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                88% Match Score
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Matched Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'TypeScript', 'Next.js', 'Node.js', 'Tailwind'].map((skill) => (
                    <span key={skill} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Missing Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Docker', 'GraphQL', 'CI/CD'].map((skill) => (
                    <span key={skill} className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md">
                      ✕ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">AI Roadmap</p>
                <p className="text-xs text-slate-300">
                  Focus on containerizing Next.js apps with Docker to boost match score to 96%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">The Problem</h2>
            <p className="text-3xl font-extrabold text-white">Why Traditional Job Applications Fail Candidates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/20">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Black-Box ATS Rejections</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Traditional Applicant Tracking Systems silently reject qualified applicants based on rigid keyword matching without explaining what failed.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unclear Skill Gaps</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Candidates apply repeatedly without knowing whether they lack technical depth, key certifications, or specific domain terminology.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
                <MessageSquareCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unprepared Interviews</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Even when invited to interviews, candidates struggle without customized, role-tailored interview practice and feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / VALUE PROP */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Key Features</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Engineered for Maximum Career Impact</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors">
              <Brain className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Explainable Match Score</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Breaks down your overall match percentage into clear sub-scores: Required Skills, Preferred Skills, Experience, and Education.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/50 transition-colors">
              <TrendingUp className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Skill Gap Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identifies matched competencies and flags missing high-priority skills so you know exactly what to learn next.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-colors">
              <BarChart3 className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">AI Learning Roadmaps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates actionable learning roadmaps, resume tweaks, and suggested portfolio projects tailored to your target job.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/50 transition-colors">
              <Zap className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">AI Interview Simulation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice tailored job questions with real-time feedback, sample answers, and detailed strength evaluations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-900/30 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Workflow</h2>
            <p className="text-3xl font-extrabold text-white">How CareerLens AI Works in 4 Steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mb-4 text-lg shadow-lg shadow-indigo-600/30">
                1
              </div>
              <h4 className="text-base font-bold text-white mb-2">Upload Resume</h4>
              <p className="text-xs text-slate-400">
                Upload your PDF or DOCX resume. The backend extracts skills, experience, and projects.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mb-4 text-lg shadow-lg shadow-purple-600/30">
                2
              </div>
              <h4 className="text-base font-bold text-white mb-2">Add Job Description</h4>
              <p className="text-xs text-slate-400">
                Paste the target job description to extract required and preferred qualifications.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 text-lg shadow-lg shadow-emerald-600/30">
                3
              </div>
              <h4 className="text-base font-bold text-white mb-2">Generate Match Score</h4>
              <p className="text-xs text-slate-400">
                Get an explainable match breakdown, identified skill gaps, and AI career recommendations.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center mb-4 text-lg shadow-lg shadow-cyan-600/30">
                4
              </div>
              <h4 className="text-base font-bold text-white mb-2">Practice Interviews</h4>
              <p className="text-xs text-slate-400">
                Practice tailored interview questions and receive instant scoring and feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Empower Your Job Search with Complete Clarity
              </h2>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Stop guessing why you aren’t getting interviews. CareerLens AI equips you with exact insights to optimize your resume and master interviews.
              </p>
              <ul className="space-y-3">
                {['No black-box scoring algorithms', '100% Free architecture ready', 'Real-time skill gap feedback', 'Tailored interview questions'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center md:text-right">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
