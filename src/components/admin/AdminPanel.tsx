import { useAdminMode, useStore } from '../../hooks/useStore';
import { Settings, X, Map, Home, Palette } from 'lucide-react';

interface Props {
  onOpenRoomEditor?: () => void;
  onOpenPolygonEditor?: () => void;
  onOpenPropertyEditor?: () => void;
}

export function AdminPanel({ onOpenRoomEditor, onOpenPolygonEditor, onOpenPropertyEditor }: Props) {
  const adminMode = useAdminMode();
  const toggleAdmin = useStore(s => s.toggleAdmin);

  if (!adminMode) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-navy text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
        <Settings size={16} className="text-teal" />
        <span className="text-sm font-medium">Admin Mode</span>
        <div className="w-px h-6 bg-white/20" />
        {onOpenRoomEditor && (
          <button
            onClick={onOpenRoomEditor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Home size={14} /> Rooms
          </button>
        )}
        {onOpenPolygonEditor && (
          <button
            onClick={onOpenPolygonEditor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Map size={14} /> Map Editor
          </button>
        )}
        {onOpenPropertyEditor && (
          <button
            onClick={onOpenPropertyEditor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Palette size={14} /> Property
          </button>
        )}
        <div className="w-px h-6 bg-white/20" />
        <button onClick={toggleAdmin} className="p-1 hover:bg-white/10 rounded-lg">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
