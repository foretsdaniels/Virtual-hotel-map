import { createPortal } from 'react-dom';
import { useStore } from '../../hooks/useStore';
import { Bed, Dog, Waves } from 'lucide-react';
import { ROOM_TYPE_LABELS } from '../../utils/constants';

interface Props {
  roomId: string;
  position: { x: number; y: number };
}

export function RoomTooltip({ roomId, position }: Props) {
  const room = useStore(s => s.getRoomById(roomId));
  if (!room) return null;

  return createPortal(
    <div
      className="fixed z-[100] pointer-events-none"
      style={{ left: position.x, top: position.y - 8, transform: 'translate(-50%, -100%)' }}
    >
      <div className="bg-white rounded-lg shadow-lg px-3 py-2 min-w-[180px] border border-gray-100">
        <div className="font-semibold text-sm text-navy">{room.displayName}</div>
        <div className="text-xs text-muted mt-0.5">{ROOM_TYPE_LABELS[room.roomType]}</div>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Bed size={12} />
            {room.bedType === 'king' ? 'King' : 'Two Queens'}
          </span>
          {room.petFriendly && (
            <span className="flex items-center gap-1 text-amber-600">
              <Dog size={12} /> Pet OK
            </span>
          )}
          {room.roomType.includes('gulf') && (
            <span className="flex items-center gap-1 text-teal">
              <Waves size={12} /> Gulf View
            </span>
          )}
        </div>
      </div>
      <div className="w-2 h-2 bg-white border-b border-r border-gray-100 rotate-45 mx-auto -mt-1" />
    </div>,
    document.body
  );
}
