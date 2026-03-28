import { useMapDataStore, useFilteredRoomIds, useRooms } from '../../hooks/useStore';
import { MapRegionCell } from './MapRegion';
import type { FloorMap } from '../../types';

interface Props {
  floor: 'ground' | 'second';
  onFloorChange: (floor: 'ground' | 'second') => void;
}

export function PropertyMap({ floor, onFloorChange }: Props) {
  const mapData = useMapDataStore();
  const filteredIds = useFilteredRoomIds();
  const rooms = useRooms();

  const floorData: FloorMap = floor === 'ground' ? mapData.groundFloor : mapData.secondFloor;
  const matchCount = rooms.filter(r => filteredIds.has(r.id)).length;
  const totalCount = rooms.length;

  return (
    <div className="w-full">
      {/* Floor toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onFloorChange('ground')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              floor === 'ground'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ground Floor
          </button>
          <button
            onClick={() => onFloorChange('second')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              floor === 'second'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Second Floor
          </button>
        </div>
        <div className="text-sm text-muted">
          <span className="font-semibold text-navy">{matchCount}</span>
          {matchCount !== totalCount && ` of ${totalCount}`} rooms
          {matchCount !== totalCount && ' match'}
        </div>
      </div>

      {/* SVG Map */}
      <div
        className="bg-white rounded-2xl p-4 lg:p-6 overflow-auto"
        style={{ boxShadow: 'var(--shadow-map)' }}
      >
        {/* Floor label */}
        <div className="text-center mb-2">
          {floor === 'ground' && (
            <span className="text-sm font-semibold tracking-widest text-teal uppercase">
              Beach Front
            </span>
          )}
          {floor === 'second' && (
            <span className="text-sm font-semibold tracking-widest text-navy uppercase">
              Second Floor — Across Gorrie Drive
            </span>
          )}
        </div>
        <svg
          viewBox={floorData.viewBox}
          className="w-full h-auto"
          style={{ minHeight: 300 }}
        >
          {/* Common areas first (behind rooms) */}
          {floorData.areas.map(area => (
            <MapRegionCell key={area.entityId} region={area} />
          ))}
          {/* Room regions */}
          {floorData.regions.map(region => (
            <MapRegionCell key={region.entityId} region={region} />
          ))}
        </svg>

        {/* Street label for ground floor */}
        {floor === 'ground' && (
          <div className="text-center mt-2">
            <span className="text-xs tracking-[0.3em] text-muted uppercase">
              Street Parking — Gorrie Drive
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
