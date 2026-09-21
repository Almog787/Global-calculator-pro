import React, { useEffect, useRef, useState } from 'react';

export interface TrueFocusProps {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence,
  manualMode = false,
  blurAmount = 4,
  borderColor = '#006b5b',
  glowColor = 'rgba(0, 107, 91, 0.4)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1.2,
  className = '',
}) => {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (manualMode) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    const activeIndex = manualMode ? lastActiveIndex : currentIndex;
    if (activeIndex === null || !wordRefs.current[activeIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeWordRect = wordRefs.current[activeIndex]!.getBoundingClientRect();

    setFocusRect({
      x: activeWordRect.left - parentRect.left - 4,
      y: activeWordRect.top - parentRect.top - 2,
      width: activeWordRect.width + 8,
      height: activeWordRect.height + 4,
    });
  }, [currentIndex, lastActiveIndex, manualMode]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}
    >
      {words.map((word, index) => {
        const isActive = manualMode ? lastActiveIndex === index : currentIndex === index;
        return (
          <span
            key={`${word}-${index}`}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            onMouseEnter={() => {
              if (manualMode) setLastActiveIndex(index);
            }}
            onMouseLeave={() => {
              if (manualMode) setLastActiveIndex(null);
            }}
            className={`cursor-pointer transition-all duration-300 select-none ${
              isActive ? 'opacity-100 filter-none font-bold' : 'opacity-70'
            }`}
            style={{
              filter: isActive ? 'none' : `blur(${blurAmount * 0.4}px)`,
            }}
          >
            {word}
          </span>
        );
      })}

      <div
        className="pointer-events-none absolute border-2 rounded-lg transition-all duration-300 z-10"
        style={{
          transform: `translate(${focusRect.x}px, ${focusRect.y}px)`,
          width: `${focusRect.width}px`,
          height: `${focusRect.height}px`,
          borderColor: borderColor,
          boxShadow: `0 0 12px ${glowColor}`,
          opacity: focusRect.width > 0 ? 1 : 0,
        }}
      >
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full" />
      </div>
    </div>
  );
};

export default TrueFocus;
