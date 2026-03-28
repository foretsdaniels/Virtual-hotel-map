import type { Room } from '../../types';
import { Badge } from '../ui/Badge';
import { ROOM_TYPE_LABELS, ROOM_TYPE_COLORS } from '../../utils/constants';
import { Bed, Users, Dog, Waves } from 'lucide-react';

interface Props {
  room: Room;
}

export function RoomHeader({ room }: Props) {
  const isGulfView = room.roomType.includes('gulf');

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-display font-bold text-navy mb-3">
        {room.displayName}
      </h1>
      <div className="flex flex-wrap gap-2">
        <Badge color={ROOM_TYPE_COLORS[room.roomType]}>
          {ROOM_TYPE_LABELS[room.roomType]}
        </Badge>
        <Badge color="#1B3A5C">
          {room.bedType === 'king' ? (
            <><Bed size={12} /> King Bed</>
          ) : (
            <><Users size={12} /> Two Queens</>
          )}
        </Badge>
        {room.petFriendly && (
          <Badge color="#D97706">
            <Dog size={12} /> Pet Friendly
          </Badge>
        )}
        {isGulfView && (
          <Badge color="#2ABFBF">
            <Waves size={12} /> Gulf View
          </Badge>
        )}
      </div>
    </div>
  );
}
