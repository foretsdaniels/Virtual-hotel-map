import type { Hotspot } from '../../types';
import { X, Tv, Waves, Sun, Coffee, Bath, Wind } from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  tv: Tv,
  waves: Waves,
  sun: Sun,
  coffee: Coffee,
  bath: Bath,
  wind: Wind,
};

interface Props {
  hotspot: Hotspot;
  onClose: () => void;
}

export function HotspotPopover({ hotspot, onClose }: Props) {
  const Icon = hotspot.icon ? ICONS[hotspot.icon] : null;

  return (
    <div className="absolute top-4 left-4 z-20 max-w-xs">
      <div className="bg-white rounded-xl shadow-2xl p-4 border border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} />
              </div>
            )}
            <div>
              <h4 className="font-semibold text-sm text-navy">{hotspot.title}</h4>
              <p className="text-xs text-muted mt-1">{hotspot.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg shrink-0">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
