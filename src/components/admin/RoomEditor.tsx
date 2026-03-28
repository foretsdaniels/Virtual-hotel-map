import { useState } from 'react';
import type { Room, RoomType, BedType } from '../../types';
import { useStore } from '../../hooks/useStore';
import { Modal } from '../ui/Modal';
import { ROOM_TYPE_LABELS } from '../../utils/constants';
import { Plus, X, Trash2 } from 'lucide-react';

interface Props {
  room: Room;
  open: boolean;
  onClose: () => void;
}

const ROOM_TYPES: RoomType[] = ['standard', 'gulf_front', 'gulf_front_kitchenette', 'kitchenette', 'deluxe', 'grand_suite'];
const BED_TYPES: { value: BedType; label: string }[] = [
  { value: 'king', label: 'King' },
  { value: 'two_queens', label: 'Two Queens' },
];

export function RoomEditor({ room, open, onClose }: Props) {
  const updateRoom = useStore(s => s.updateRoom);
  const [draft, setDraft] = useState<Room>({ ...room });
  const [newAmenity, setNewAmenity] = useState('');

  const handleSave = () => {
    updateRoom(draft);
    onClose();
  };

  const addAmenity = () => {
    if (!newAmenity.trim()) return;
    setDraft(d => ({ ...d, amenities: [...d.amenities, newAmenity.trim()] }));
    setNewAmenity('');
  };

  const removeAmenity = (index: number) => {
    setDraft(d => ({ ...d, amenities: d.amenities.filter((_, i) => i !== index) }));
  };

  const addTour = () => {
    const id = `${room.id}-tour-${Date.now()}`;
    setDraft(d => ({
      ...d,
      tours: [...d.tours, { id, title: 'New Scene', splatUrl: '', hotspots: [] }],
    }));
  };

  const removeTour = (index: number) => {
    setDraft(d => ({ ...d, tours: d.tours.filter((_, i) => i !== index) }));
  };

  const updateTour = (index: number, field: string, value: string) => {
    setDraft(d => ({
      ...d,
      tours: d.tours.map((t, i) => i === index ? { ...t, [field]: value } : t),
    }));
  };

  return (
    <Modal open={open} onClose={onClose} title={`Edit ${room.displayName}`} wide>
      <div className="space-y-4">
        {/* Display Name */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Display Name</label>
          <input
            type="text"
            value={draft.displayName}
            onChange={e => setDraft(d => ({ ...d, displayName: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Room Type</label>
          <select
            value={draft.roomType}
            onChange={e => setDraft(d => ({ ...d, roomType: e.target.value as RoomType }))}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            {ROOM_TYPES.map(t => (
              <option key={t} value={t}>{ROOM_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* Bed Type */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Bed Type</label>
          <div className="flex gap-3">
            {BED_TYPES.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  checked={draft.bedType === value}
                  onChange={() => setDraft(d => ({ ...d, bedType: value }))}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Pet Friendly */}
        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.petFriendly}
              onChange={e => setDraft(d => ({ ...d, petFriendly: e.target.checked }))}
            />
            Pet Friendly
          </label>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Amenities</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {draft.amenities.map((a, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                {a}
                <button onClick={() => removeAmenity(i)} className="hover:text-red-500">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAmenity}
              onChange={e => setNewAmenity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addAmenity()}
              placeholder="Add amenity..."
              className="flex-1 px-3 py-1.5 border rounded-lg text-sm"
            />
            <button onClick={addAmenity} className="px-3 py-1.5 bg-teal text-white rounded-lg text-sm">
              Add
            </button>
          </div>
        </div>

        {/* Tours (Splat Scenes) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-muted">3D Tours (Gaussian Splats)</label>
            <button onClick={addTour} className="flex items-center gap-1 text-xs text-teal hover:text-teal/80">
              <Plus size={12} /> Add Scene
            </button>
          </div>
          {draft.tours.map((tour, i) => (
            <div key={tour.id} className="border rounded-lg p-3 mb-2">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={tour.title}
                  onChange={e => updateTour(i, 'title', e.target.value)}
                  className="font-medium text-sm border-0 border-b border-gray-200 focus:border-teal focus:outline-none pb-0.5"
                />
                <button onClick={() => removeTour(i)} className="p-1 text-red-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                type="text"
                value={tour.splatUrl}
                onChange={e => updateTour(i, 'splatUrl', e.target.value)}
                placeholder="/splats/room/scene.splat"
                className="w-full px-2 py-1 border rounded text-xs text-muted"
              />
              <div className="text-xs text-muted mt-1">
                {tour.hotspots.length} hotspot{tour.hotspots.length !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Save */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted hover:text-navy">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
