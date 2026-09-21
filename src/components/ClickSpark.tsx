import React, { useRef, useEffect } from 'react';

export interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  extraScale?: number;
  children: React.ReactNode;
  className?: string;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#006b5b',
  sparkSize = 8,
  sparkRadius = 24,
  sparkCount = 8,
  duration = 400,
  extraScale = 1.2,
  children,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          canvas.width = width * window.devicePixelRatio;
          canvas.height = height * window.devicePixelRatio;
        }
      });
      resizeObserver.observe(parent);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  const drawRef = useRef<((timestamp: number) => void) | null>(null);

  useEffect(() => {
    drawRef.current = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentDistance = easeProgress * sparkRadius * window.devicePixelRatio;
        const currentSize = (1 - easeProgress) * sparkSize * extraScale * window.devicePixelRatio;

        const x = (spark.x + Math.cos(spark.angle) * currentDistance) * window.devicePixelRatio;
        const y = (spark.y + Math.sin(spark.angle) * currentDistance) * window.devicePixelRatio;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, currentSize), 0, 2 * Math.PI);
        ctx.fillStyle = sparkColor;
        ctx.globalAlpha = 1 - progress;
        ctx.fill();
        ctx.restore();

        return true;
      });

      if (sparksRef.current.length > 0 && drawRef.current) {
        requestAnimationFrame(drawRef.current);
      }
    };
  }, [duration, extraScale, sparkColor, sparkRadius, sparkSize]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    const newSparks: Spark[] = [];

    for (let i = 0; i < sparkCount; i++) {
      const angle = (2 * Math.PI * i) / sparkCount + (Math.random() - 0.5) * 0.5;
      newSparks.push({
        x,
        y,
        angle,
        startTime: now,
      });
    }

    const wasEmpty = sparksRef.current.length === 0;
    sparksRef.current.push(...newSparks);

    if (wasEmpty && drawRef.current) {
      requestAnimationFrame(drawRef.current);
    }
  };

  return (
    <div className={`relative ${className}`} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-50 w-full h-full"
      />
      {children}
    </div>
  );
};

export default ClickSpark;
