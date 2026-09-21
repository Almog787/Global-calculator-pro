import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface RotatingTextProps {
  texts: string[];
  transitionDuration?: number;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | 'random';
  className?: string;
  elementClassName?: string;
}

export const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  transitionDuration = 0.5,
  rotationInterval = 2500,
  staggerDuration = 0.025,
  staggerFrom = 'first',
  className = '',
  elementClassName = '',
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (!texts || texts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts, rotationInterval]);

  const currentText = texts[currentTextIndex] || '';
  const characters = Array.from(currentText);

  const getStaggerDelay = (index: number, total: number) => {
    switch (staggerFrom) {
      case 'last':
        return (total - 1 - index) * staggerDuration;
      case 'center': {
        const center = (total - 1) / 2;
        return Math.abs(center - index) * staggerDuration;
      }
      case 'random': {
        const pseudoRandom = ((index * 37 + 13) % 100) / 100;
        return pseudoRandom * total * staggerDuration;
      }
      case 'first':
      default:
        return index * staggerDuration;
    }
  };

  return (
    <span className={`inline-flex items-center overflow-hidden align-middle ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentTextIndex}
          className="inline-flex flex-wrap"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {characters.map((char, index) => (
            <motion.span
              key={`${currentTextIndex}-${index}-${char}`}
              className={`inline-block ${char === ' ' ? 'w-2' : ''} ${elementClassName}`}
              variants={{
                initial: { y: '100%', opacity: 0, filter: 'blur(4px)' },
                animate: { y: 0, opacity: 1, filter: 'blur(0px)' },
                exit: { y: '-100%', opacity: 0, filter: 'blur(4px)' },
              }}
              transition={{
                duration: transitionDuration,
                delay: getStaggerDelay(index, characters.length),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
