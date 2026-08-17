import React from 'react';

interface ScoreMeterProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const normalizedScore = Math.min(100, Math.max(0, score));

  const getScoreColor = () => {
    if (normalizedScore >= 85) return { stroke: '#10B981', text: 'text-emerald-400', label: 'Strong Match' };
    if (normalizedScore >= 70) return { stroke: '#6366F1', text: 'text-indigo-400', label: 'Good Match' };
    if (normalizedScore >= 50) return { stroke: '#F59E0B', text: 'text-amber-400', label: 'Moderate Match' };
    return { stroke: '#F43F5E', text: 'text-rose-400', label: 'Low Match' };
  };

  const color = getScoreColor();

  const sizeConfig = {
    sm: { diameter: 80, strokeWidth: 8, fontSize: 'text-xl', labelSize: 'text-[10px]' },
    md: { diameter: 140, strokeWidth: 12, fontSize: 'text-3xl', labelSize: 'text-xs' },
    lg: { diameter: 200, strokeWidth: 16, fontSize: 'text-5xl', labelSize: 'text-sm' },
  };

  const config = sizeConfig[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={config.diameter} height={config.diameter} className="transform -rotate-90">
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={config.strokeWidth}
            fill="transparent"
          />
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            stroke={color.stroke}
            strokeWidth={config.strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-bold font-mono tracking-tight text-white ${config.fontSize}`}>
            {normalizedScore}%
          </span>
          {showLabel && (
            <span className={`font-medium ${color.text} ${config.labelSize}`}>
              {color.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
