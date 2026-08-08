interface VisualRatioBarProps {
  percentage: number;
  label?: string;
  className?: string;
}

export default function VisualRatioBar({ percentage, label, className = '' }: VisualRatioBarProps) {
  // Clamp between 0 and 100 for visual bar, but allow displaying full number
  const clampedPerc = Math.min(Math.max(percentage || 0, 0), 100);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between items-center text-xs font-semibold text-stone-500">
          <span>{label}</span>
          <span className="font-mono">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200/60 p-0.5">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedPerc}%` }}
        />
      </div>
    </div>
  );
}
