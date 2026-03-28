import { Bed, Dog, Waves, Users } from 'lucide-react';
import { ROOM_TYPE_COLORS, ROOM_TYPE_LABELS } from '../../utils/constants';
import type { RoomType } from '../../types';

const legendTypes: RoomType[] = [
  'gulf_front',
  'gulf_front_kitchenette',
  'kitchenette',
  'standard',
  'deluxe',
  'grand_suite',
];

export function MapLegend() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h4 className="text-sm font-semibold text-navy mb-3">Room Types</h4>
      <div className="space-y-1.5">
        {legendTypes.map(type => (
          <div key={type} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm border border-gray-200 shrink-0"
              style={{ backgroundColor: ROOM_TYPE_COLORS[type] }}
            />
            <span className="text-xs text-gray-700">{ROOM_TYPE_LABELS[type]}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 mt-3 pt-3">
        <h4 className="text-sm font-semibold text-navy mb-2">Icons</h4>
        <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-600">
          <span className="flex items-center gap-1"><Bed size={12} /> King Bed</span>
          <span className="flex items-center gap-1"><Users size={12} /> Two Queens</span>
          <span className="flex items-center gap-1"><Dog size={12} /> Pet Friendly</span>
          <span className="flex items-center gap-1"><Waves size={12} /> Gulf View</span>
        </div>
      </div>
    </div>
  );
}
