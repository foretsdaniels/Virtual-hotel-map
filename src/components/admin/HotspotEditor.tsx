import { useState } from 'react';
import type { Hotspot, SplatScene } from '../../types';
import { Modal } from '../ui/Modal';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  tour: SplatScene;
  open: boolean;
  onClose: () => void;
  onSave: (hotspots: Hotspot[]) => void;
}

export function HotspotEditor({ tour, open, onClose, onSave }: Props) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([...tour.hotspots]);

  const addHotspot = () => {
    setHotspots(prev => [
      ...prev,
      {
        id: `hs-${Date.now()}`,
        yaw: 0,
        pitch: 0,
        title: 'New Hotspot',
        description: '',
        icon: 'info',
      },
    ]);
  };

  const updateHotspot = (index: number, field: keyof Hotspot, value: string | number) => {
    setHotspots(prev =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  };

  const removeHotspot = (index: number) => {
    setHotspots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(hotspots);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Hotspots — ${tour.title}`}>
      <div className="space-y-3">
        {hotspots.map((hs, i) => (
          <div key={hs.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                value={hs.title}
                onChange={e => updateHotspot(i, 'title', e.target.value)}
                className="font-medium text-sm border-0 border-b border-gray-200 focus:border-teal focus:outline-none"
              />
              <button onClick={() => removeHotspot(i)} className="p-1 text-red-400 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
            <textarea
              value={hs.description}
              onChange={e => updateHotspot(i, 'description', e.target.value)}
              placeholder="Description..."
              className="w-full px-2 py-1 border rounded text-xs text-muted resize-none"
              rows={2}
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <label className="text-xs text-muted">Yaw</label>
                <input
                  type="number"
                  value={hs.yaw}
                  onChange={e => updateHotspot(i, 'yaw', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-muted">Pitch</label>
                <input
                  type="number"
                  value={hs.pitch}
                  onChange={e => updateHotspot(i, 'pitch', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-muted">Icon</label>
                <input
                  type="text"
                  value={hs.icon ?? ''}
                  onChange={e => updateHotspot(i, 'icon', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addHotspot}
          className="flex items-center gap-1.5 w-full justify-center px-3 py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-muted hover:border-teal hover:text-teal transition-colors"
        >
          <Plus size={14} /> Add Hotspot
        </button>

        <div className="flex justify-end gap-3 pt-3 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted hover:text-navy">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium">
            Save Hotspots
          </button>
        </div>
      </div>
    </Modal>
  );
}
