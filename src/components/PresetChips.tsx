interface PresetChipsProps {
  presets: number[];
  selectedValue?: number;
  onSelect: (value: number) => void;
  unit?: string;
  className?: string;
}

export default function PresetChips({
  presets,
  selectedValue,
  onSelect,
  unit = '%',
  className = '',
}: PresetChipsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {presets.map((val) => {
        const isSelected = selectedValue === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onSelect(val)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all duration-150 active:scale-95 cursor-pointer ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-stone-100/80 text-stone-600 border-stone-200/80 hover:bg-stone-200 hover:text-stone-900'
            }`}
          >
            {val}
            {unit}
          </button>
        );
      })}
    </div>
  );
}
