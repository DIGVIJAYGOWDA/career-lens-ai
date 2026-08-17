import React from 'react';
import Link from 'next/link';
import { FileText, Calendar, ChevronRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Resume } from '@/types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface ResumeCardProps {
  resume: Resume;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ resume }) => {
  const getStatusBadge = () => {
    switch (resume.status) {
      case 'parsed':
        return (
          <Badge variant="success" size="sm" className="gap-1">
            <CheckCircle2 className="w-3 h-3" /> Parsed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="warning" size="sm" className="gap-1">
            <Clock className="w-3 h-3 animate-spin" /> Processing
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="danger" size="sm" className="gap-1">
            <AlertTriangle className="w-3 h-3" /> Error
          </Badge>
        );
      default:
        return <Badge variant="neutral" size="sm">{resume.status}</Badge>;
    }
  };

  const formattedDate = new Date(resume.upload_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const skillsCount = resume.parsed_data?.skills?.length || 0;

  return (
    <Card hoverEffect className="group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">{resume.filename}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {resume.parsed_data && (
        <div className="my-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Skills Extracted: <strong className="text-slate-200">{skillsCount}</strong></span>
          <span>Exp: <strong className="text-slate-200">{resume.parsed_data.experience?.length || 0} roles</strong></span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500 uppercase font-mono">ID: {resume.id.substring(0, 8)}</span>
        <Link
          href={`/resumes/${resume.id}`}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
        >
          View Analysis <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  );
};
