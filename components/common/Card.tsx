import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  // FIX: Add style prop to allow for inline styles like animation-delay.
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', animated = false, style }) => {
  const animationClass = animated ? 'opacity-0 animate-fade-in-up' : '';
  
  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-blue-500/10 hover:border-slate-600 hover:-translate-y-2 ${animationClass} ${className}`}
      // FIX: Apply the style prop to the div.
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;