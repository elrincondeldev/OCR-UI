import type { FilterType } from '../../../shared/types/api';

const TABS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending Review', value: 'non_validated' },
  { label: 'Validated', value: 'validated' },
];

interface Props {
  active: FilterType;
  onChange: (f: FilterType) => void;
}

export function FilterTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            active === tab.value
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
