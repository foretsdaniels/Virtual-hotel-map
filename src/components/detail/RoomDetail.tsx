import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Room } from '../../types';
import { useRooms, useProperty } from '../../hooks/useStore';
import { Breadcrumb } from './Breadcrumb';
import { RoomHeader } from './RoomHeader';
import { AmenitiesSidebar } from './AmenitiesSidebar';
import { TourViewer } from '../tour/TourViewer';
import { MiniMap } from '../map/MiniMap';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface Props {
  room: Room;
}

export function RoomDetail({ room }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rooms = useRooms();
  const property = useProperty();
  const tourId = searchParams.get('tour') ?? undefined;

  const floor = room.building.includes('Second') || room.building.includes('Suite')
    ? 'second' as const
    : 'ground' as const;

  const floorRooms = useMemo(() => {
    return rooms.filter(r => {
      const rFloor = r.building.includes('Second') || r.building.includes('Suite') ? 'second' : 'ground';
      return rFloor === floor;
    });
  }, [rooms, floor]);

  const currentIndex = floorRooms.findIndex(r => r.id === room.id);
  const prevRoom = currentIndex > 0 ? floorRooms[currentIndex - 1] : floorRooms[floorRooms.length - 1];
  const nextRoom = currentIndex < floorRooms.length - 1 ? floorRooms[currentIndex + 1] : floorRooms[0];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Map', to: `/map${floor === 'second' ? '?floor=2' : ''}` },
          { label: room.building },
          { label: room.displayName },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left: Tour Viewer */}
        <div>
          <TourViewer tours={room.tours} initialTourId={tourId} />
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          <RoomHeader room={room} />
          <AmenitiesSidebar amenities={room.amenities} />

          <MiniMap highlightId={room.id} floor={floor} />

          <a
            href={property.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-navy text-white rounded-xl font-medium hover:bg-navy/90 transition-colors"
          >
            Book This Room <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={() => navigate(`/room/${prevRoom.id}`)}
          className="flex items-center gap-2 text-sm text-muted hover:text-navy transition-colors"
        >
          <ChevronLeft size={16} />
          {prevRoom.displayName}
        </button>
        <span className="text-xs text-muted">
          Room {currentIndex + 1} of {floorRooms.length}
        </span>
        <button
          onClick={() => navigate(`/room/${nextRoom.id}`)}
          className="flex items-center gap-2 text-sm text-muted hover:text-navy transition-colors"
        >
          {nextRoom.displayName}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
