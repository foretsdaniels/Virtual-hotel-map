import { X, Dog } from 'lucide-react';
import { useFilterParams } from '../../hooks/useStore';
import { ROOM_TYPE_LABELS, ROOM_TYPE_COLORS } from '../../utils/constants';
import type { RoomType, BedType } from '../../types';

const roomTypes: RoomType[] = [
  'standard', 'gulf_front', 'gulf_front_kitchenette',
  'kitchenette', 'deluxe', 'grand_suite',
];

const bedTypes: { value: BedType; label: string }[] = [
  { value: 'king', label: 'King' },
  { value: 'two_queens', label: 'Two Queens' },
];

export function FilterPanel() {
  const { filters, toggleRoomType, toggleBedType, togglePetFriendly, clearFilters } = useFilterParams();
  const hasFilters = filters.roomTypes.length > 0 || filters.bedTypes.length > 0 || filters.petFriendly !== null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-navy">Filters</h4>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted hover:text-navy transition-colors"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Room Type */}
      <div className="mb-3">
        <div className="text-xs text-muted mb-1.5 font-medium">Room Type</div>
        <div className="flex flex-wrap gap-1.5">
          {roomTypes.map(type => {
            const active = filters.roomTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleRoomType(type)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? 'border-navy text-navy shadow-sm'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
                style={active ? { backgroundColor: ROOM_TYPE_COLORS[type] + '30' } : undefined}
              >
                {ROOM_TYPE_LABELS[type]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bed Type */}
      <div className="mb-3">
        <div className="text-xs text-muted mb-1.5 font-medium">Bed Type</div>
        <div className="flex gap-1.5">
          {bedTypes.map(({ value, label }) => {
            const active = filters.bedTypes.includes(value);
            return (
              <button
                key={value}
                onClick={() => toggleBedType(value)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? 'border-navy text-navy bg-sky/30 shadow-sm'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pet Friendly */}
      <div>
        <button
          onClick={togglePetFriendly}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
            filters.petFriendly
              ? 'border-amber-400 text-amber-700 bg-amber-50 shadow-sm'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
          }`}
        >
          <Dog size={12} /> Pet Friendly
        </button>
      </div>
    </div>
  );
}
