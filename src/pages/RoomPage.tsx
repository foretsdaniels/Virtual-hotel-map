import { useParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { RoomDetail } from '../components/detail/RoomDetail';

export function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const getRoomById = useStore(s => s.getRoomById);
  const room = roomId ? getRoomById(roomId) : undefined;

  if (!room) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-display font-bold text-navy mb-2">Room Not Found</h1>
        <p className="text-muted">Room "{roomId}" does not exist.</p>
      </div>
    );
  }

  return <RoomDetail room={room} />;
}
