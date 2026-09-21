import React, { useEffect, useRef, useState } from 'react';

export interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover' | 'mount';
}

const DEFAULT_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+~|}{[]:;?><,./-=';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARS,
  className = '',
  encryptedClassName = 'text-primary/70 font-mono',
  parentClassName = '',
  animateOn = 'mount',
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLSpanElement | null>(null);

  const availableChars = useOriginalCharsOnly
    ? Array.from(new Set(text.split(''))).filter((c) => c !== ' ').join('') || DEFAULT_CHARS
    : characters;

  const triggerDecryption = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsScrambling(true);

    let iteration = 0;
    const textLength = text.length;

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';

            let isRevealed: boolean;
            if (sequential) {
              if (revealDirection === 'start') {
                isRevealed = index < iteration;
              } else if (revealDirection === 'end') {
                isRevealed = index >= textLength - iteration;
              } else {
                const center = textLength / 2;
                isRevealed = Math.abs(index - center) < iteration / 2;
              }
            } else {
              isRevealed = Math.random() < iteration / maxIterations;
            }

            if (isRevealed) {
              return text[index];
            }

            const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
            return randomChar;
          })
          .join('');
      });

      iteration++;

      if (iteration > (sequential ? textLength + 2 : maxIterations)) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'mount') {
      triggerDecryption();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, animateOn]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover' && !isScrambling) {
      triggerDecryption();
    }
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`inline-block whitespace-nowrap ${parentClassName}`}
    >
      <span className={isScrambling ? encryptedClassName : className}>
        {displayText}
      </span>
    </span>
  );
};

export default DecryptedText;
