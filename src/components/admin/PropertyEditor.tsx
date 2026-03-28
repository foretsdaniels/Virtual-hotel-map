import { useState } from 'react';
import { useStore, useProperty } from '../../hooks/useStore';
import { Modal } from '../ui/Modal';
import type { PropertyData } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PropertyEditor({ open, onClose }: Props) {
  const property = useProperty();
  const updateProperty = useStore(s => s.updateProperty);
  const [draft, setDraft] = useState<PropertyData>({ ...property });

  const handleSave = () => {
    updateProperty(draft);
    // Apply theme as CSS variables
    document.documentElement.style.setProperty('--color-navy', draft.theme.primary);
    document.documentElement.style.setProperty('--color-teal', draft.theme.accent);
    document.documentElement.style.setProperty('--color-sand', draft.theme.sand);
    document.documentElement.style.setProperty('--color-bg', draft.theme.background);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Property Settings">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Property Name</label>
          <input
            type="text"
            value={draft.name}
            onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Tagline</label>
          <input
            type="text"
            value={draft.tagline}
            onChange={e => setDraft(d => ({ ...d, tagline: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Phone</label>
            <input
              type="text"
              value={draft.phone}
              onChange={e => setDraft(d => ({ ...d, phone: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Booking URL</label>
            <input
              type="text"
              value={draft.bookingUrl}
              onChange={e => setDraft(d => ({ ...d, bookingUrl: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Address</label>
          <input
            type="text"
            value={draft.address}
            onChange={e => setDraft(d => ({ ...d, address: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Description</label>
          <textarea
            value={draft.description}
            onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
            rows={2}
          />
        </div>

        {/* Theme Colors */}
        <div>
          <label className="block text-xs font-medium text-muted mb-2">Theme Colors</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'primary' as const, label: 'Primary (Navy)' },
              { key: 'accent' as const, label: 'Accent (Teal)' },
              { key: 'sand' as const, label: 'Sand' },
              { key: 'background' as const, label: 'Background' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <input
                  type="color"
                  value={draft.theme[key]}
                  onChange={e => setDraft(d => ({ ...d, theme: { ...d.theme, [key]: e.target.value } }))}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <div>
                  <div className="text-xs text-gray-600">{label}</div>
                  <div className="text-xs text-muted font-mono">{draft.theme[key]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted hover:text-navy">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
