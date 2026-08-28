import React from 'react';

interface MeasurementToggleProps {
  system: 'metric' | 'imperial';
  onChange: (system: 'metric' | 'imperial') => void;
}

export default function MeasurementToggle({ system, onChange }: MeasurementToggleProps) {
  return (
    <div className="flex bg-stone-100 rounded-lg p-1 w-fit mb-6">
      <button
        onClick={() => onChange('metric')}
        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
          system === 'metric' 
            ? 'bg-white text-stone-900 shadow-sm' 
            : 'text-stone-500 hover:text-stone-700'
        }`}
      >
        Metric
      </button>
      <button
        onClick={() => onChange('imperial')}
        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
          system === 'imperial' 
            ? 'bg-white text-stone-900 shadow-sm' 
            : 'text-stone-500 hover:text-stone-700'
        }`}
      >
        Imperial
      </button>
    </div>
  );
}
