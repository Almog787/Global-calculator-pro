import React, { useEffect, useRef, useState } from 'react';

export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number; // duration in seconds
  delay?: number; // delay in seconds
  decimals?: number;
  separator?: string;
  decimal?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  startWhen?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  preserveValue?: boolean;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from,
  duration = 0.8,
  delay = 0,
  decimals = 0,
  separator = ',',
  decimal = '.',
  prefix = '',
  suffix = '',
  className = '',
  startWhen = true,
  onStart,
  onEnd,
  preserveValue = true,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(from !== undefined ? from : to);
  const previousValueRef = useRef<number>(from !== undefined ? from : to);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!startWhen) return;

    const startVal = isFirstRender.current
      ? (from !== undefined ? from : (preserveValue ? 0 : to))
      : previousValueRef.current;
    
    isFirstRender.current = false;
    const endVal = to;

    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;

    const durationMs = Math.max(100, duration * 1000);
    const delayMs = Math.max(0, delay * 1000);

    const animate = (timestamp: number) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
        onStart?.();
      }

      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease out expo for smooth decelerating numbers
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (endVal - startVal) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
        previousValueRef.current = endVal;
        onEnd?.();
      }
    };

    if (delayMs > 0) {
      timeoutId = setTimeout(() => {
        animationFrameId = window.requestAnimationFrame(animate);
      }, delayMs);
    } else {
      animationFrameId = window.requestAnimationFrame(animate);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      previousValueRef.current = endVal;
    };
  }, [to, from, duration, delay, startWhen, onStart, onEnd, preserveValue]);

  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimals);
    const [intPart, decPart] = fixed.split('.');

    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    if (decimals > 0 && decPart !== undefined) {
      return `${formattedInt}${decimal}${decPart}`;
    }
    return formattedInt;
  };

  return (
    <span className={`tabular-nums font-feature-settings-tnum ${className}`}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  );
};

export default CountUp;
