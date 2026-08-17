import React from 'react';
import Link from 'next/link';
import { Briefcase, Building2, Calendar, ChevronRight } from 'lucide-react';
import { Job } from '@/types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface JobCardProps {
  job: Job;
  onMatch?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onMatch }) => {
  const formattedDate = new Date(job.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const reqSkills = job.requirements?.required_skills || [];

  return (
    <Card hoverEffect className="group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">{job.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{job.company}</span>
              </div>
            </div>
          </div>
          <Badge variant="indigo" size="sm">
            Job Posting
          </Badge>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {reqSkills.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Key Requirements
            </p>
            <div className="flex flex-wrap gap-1.5">
              {reqSkills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/80"
                >
                  {skill}
                </span>
              ))}
              {reqSkills.length > 4 && (
                <span className="text-[11px] bg-slate-800/60 text-slate-400 px-2 py-0.5 rounded-md">
                  +{reqSkills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3">
          {onMatch && (
            <button
              onClick={() => onMatch(job.id)}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              Match Resume
            </button>
          )}
          <Link
            href={`/jobs/${job.id}`}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
          >
            Details <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
