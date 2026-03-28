import { useNavigate } from 'react-router-dom';
import { useMapDataStore } from '../../hooks/useStore';

interface Props {
  highlightId: string;
  floor: 'ground' | 'second';
}

export function MiniMap({ highlightId, floor }: Props) {
  const navigate = useNavigate();
  const mapData = useMapDataStore();
  const floorData = floor === 'ground' ? mapData.groundFloor : mapData.secondFloor;

  const allRegions = [...floorData.regions, ...floorData.areas];

  return (
    <div
      className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/map${floor === 'second' ? '?floor=2' : ''}`)}
      title="Back to map"
    >
      <div className="text-xs text-muted mb-2 font-medium">
        {floor === 'ground' ? 'Ground Floor' : 'Second Floor'}
      </div>
      <svg viewBox={floorData.viewBox} className="w-full h-auto">
        {allRegions.map(r => (
          <path
            key={r.entityId}
            d={r.svgPath}
            fill={r.entityId === highlightId ? '#2ABFBF' : '#e5e7eb'}
            stroke={r.entityId === highlightId ? '#1B3A5C' : '#d1d5db'}
            strokeWidth={r.entityId === highlightId ? 3 : 1}
            opacity={r.entityId === highlightId ? 1 : 0.4}
          />
        ))}
      </svg>
    </div>
  );
}
