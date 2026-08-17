import React from 'react';
import Link from 'next/link';
import { Sparkles, Globe, Share2, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white">CareerLens AI</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Explainable AI-powered resume matching, skill gap analysis, and intelligent interview preparation.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            <li><Link href="/resumes" className="hover:text-white transition-colors">Resume Analyzer</Link></li>
            <li><Link href="/jobs" className="hover:text-white transition-colors">Job Matcher</Link></li>
            <li><Link href="/interview" className="hover:text-white transition-colors">AI Interview Coach</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#how-it-works" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Skill Taxonomy</a></li>
            <li><a href="#benefits" className="hover:text-white transition-colors">Career Insights</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
          <div className="flex gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition-colors" title="Website"><Globe className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors" title="Social"><Share2 className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors" title="Portal"><ExternalLink className="w-5 h-5" /></a>
          </div>
          <p className="mt-4 text-xs text-slate-500">Built with standard open technology.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} CareerLens AI. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-400">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400">Terms of Service</a>
          <a href="#" className="hover:text-slate-400">Security</a>
        </div>
      </div>
    </footer>
  );
};
