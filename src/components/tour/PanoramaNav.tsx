import type { SplatScene } from '../../types';

interface Props {
  tours: SplatScene[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function PanoramaNav({ tours, activeIndex, onSelect }: Props) {
  return (
    <div className="flex gap-1 mb-3 bg-gray-100 rounded-lg p-1 overflow-x-auto">
      {tours.map((tour, i) => (
        <button
          key={tour.id}
          onClick={() => onSelect(i)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
            i === activeIndex
              ? 'bg-white text-navy shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tour.title}
        </button>
      ))}
    </div>
  );
}
