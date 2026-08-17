import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'gradient';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  colorScheme = 'indigo',
  showLabel = false,
  size = 'md',
  className = '',
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));

  const colors = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-300">
          <span>Match Progress</span>
          <span>{normalizedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${colors[colorScheme]} ${heights[size]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${normalizedValue}%` }}
        ></div>
      </div>
    </div>
  );
};
