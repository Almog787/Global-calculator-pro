import React from 'react';

export interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  colors = ['#006b5b', '#00dfc1', '#3b82f6', '#006b5b'],
  animationSpeed = 6,
  showBorder = false,
}) => {
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    backgroundSize: '300% 100%',
    animation: `gradientMove ${animationSpeed}s ease infinite`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <span
      className={`relative inline-flex items-center justify-center font-bold ${
        showBorder ? 'px-3 py-1 rounded-full border border-border-subtle bg-surface/50' : ''
      } ${className}`}
    >
      <span style={gradientStyle} className="inline-block">
        {children}
      </span>
    </span>
  );
};

export default GradientText;
