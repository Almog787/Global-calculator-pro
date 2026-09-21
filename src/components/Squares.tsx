import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  className?: string;
}

export const Squares: React.FC<SquaresProps> = ({
  direction = 'diagonal',
  speed = 0.5,
  borderColor = 'rgba(0, 107, 91, 0.07)',
  squareSize = 40,
  hoverFillColor = 'rgba(0, 107, 91, 0.08)',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef({ x: 0, y: 0 });
  const [hoveredSquare, setHoveredSquare] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const updateCanvasSize = () => {
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
      numSquaresX.current = Math.ceil(parent.clientWidth / squareSize) + 1;
      numSquaresY.current = Math.ceil(parent.clientHeight / squareSize) + 1;
    };

    updateCanvasSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateCanvasSize);
      resizeObserver.observe(parent);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [squareSize]);

  const drawRef = useRef<(() => void) | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dpr = window.devicePixelRatio || 1;
    const effectiveSquareSize = squareSize * dpr;

    const startX = Math.floor(gridOffset.current.x / effectiveSquareSize) * effectiveSquareSize;
    const startY = Math.floor(gridOffset.current.y / effectiveSquareSize) * effectiveSquareSize;

    ctx.lineWidth = 1 * dpr;
    ctx.strokeStyle = borderColor;

    for (let x = startX; x < canvas.width + effectiveSquareSize; x += effectiveSquareSize) {
      for (let y = startY; y < canvas.height + effectiveSquareSize; y += effectiveSquareSize) {
        const squareX = x - (gridOffset.current.x % effectiveSquareSize);
        const squareY = y - (gridOffset.current.y % effectiveSquareSize);

        if (
          hoveredSquare &&
          Math.floor((x - startX) / effectiveSquareSize) === hoveredSquare.x &&
          Math.floor((y - startY) / effectiveSquareSize) === hoveredSquare.y
        ) {
          ctx.fillStyle = hoverFillColor;
          ctx.fillRect(squareX, squareY, effectiveSquareSize, effectiveSquareSize);
        }

        ctx.strokeRect(squareX, squareY, effectiveSquareSize, effectiveSquareSize);
      }
    }

    // Move grid offset according to direction and speed
    const currentSpeed = speed * dpr;
    switch (direction) {
      case 'right':
        gridOffset.current.x = (gridOffset.current.x - currentSpeed + effectiveSquareSize) % effectiveSquareSize;
        break;
      case 'left':
        gridOffset.current.x = (gridOffset.current.x + currentSpeed + effectiveSquareSize) % effectiveSquareSize;
        break;
      case 'up':
        gridOffset.current.y = (gridOffset.current.y + currentSpeed + effectiveSquareSize) % effectiveSquareSize;
        break;
      case 'down':
        gridOffset.current.y = (gridOffset.current.y - currentSpeed + effectiveSquareSize) % effectiveSquareSize;
        break;
      case 'diagonal':
      default:
        gridOffset.current.x = (gridOffset.current.x - currentSpeed + effectiveSquareSize) % effectiveSquareSize;
        gridOffset.current.y = (gridOffset.current.y - currentSpeed + effectiveSquareSize) % effectiveSquareSize;
        break;
    }

    if (drawRef.current) {
      requestRef.current = requestAnimationFrame(drawRef.current);
    }
  }, [borderColor, direction, hoveredSquare, hoverFillColor, speed, squareSize]);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    if (drawRef.current) {
      requestRef.current = requestAnimationFrame(drawRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [draw]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dpr = window.devicePixelRatio || 1;
    const effectiveSquareSize = squareSize * dpr;

    const startX = Math.floor(gridOffset.current.x / effectiveSquareSize) * effectiveSquareSize;
    const startY = Math.floor(gridOffset.current.y / effectiveSquareSize) * effectiveSquareSize;

    const hoveredX = Math.floor((mouseX * dpr + (gridOffset.current.x % effectiveSquareSize) - startX) / effectiveSquareSize);
    const hoveredY = Math.floor((mouseY * dpr + (gridOffset.current.y % effectiveSquareSize) - startY) / effectiveSquareSize);

    setHoveredSquare({ x: hoveredX, y: hoveredY });
  };

  const handleMouseLeave = () => {
    setHoveredSquare(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
    />
  );
};

export default Squares;
