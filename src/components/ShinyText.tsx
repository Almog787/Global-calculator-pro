import React from 'react';

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number; // duration in seconds
  className?: string;
  shimmerWidth?: number; // width in percent
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  if (disabled) {
    return <span className={className}>{text}</span>;
  }

  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block font-semibold bg-clip-text text-transparent bg-gradient-to-r from-neutral-600 via-neutral-100 to-neutral-600 dark:from-neutral-400 dark:via-white dark:to-neutral-400 ${className}`}
      style={{
        backgroundSize: '200% 100%',
        animation: `shimmer ${animationDuration} infinite linear`,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
