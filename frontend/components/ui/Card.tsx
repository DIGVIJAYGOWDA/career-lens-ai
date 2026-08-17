import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-sm ${
        hoverEffect ? 'hover:border-slate-700 hover:shadow-lg transition-all cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
