import { useState, useCallback } from 'react';
import type { SplatScene } from '../../types';
import { SplatViewer } from './SplatViewer';
import { PanoramaNav } from './PanoramaNav';
import { HotspotPopover } from './HotspotPopover';
import { Camera } from 'lucide-react';

interface Props {
  tours: SplatScene[];
  initialTourId?: string;
}

export function TourViewer({ tours, initialTourId }: Props) {
  const initialIndex = initialTourId
    ? Math.max(0, tours.findIndex(t => t.id === initialTourId))
    : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [loadedTabs, setLoadedTabs] = useState<Set<number>>(new Set([initialIndex]));

  const activeTour = tours[activeIndex];

  const handleTabChange = useCallback((index: number) => {
    setActiveIndex(index);
    setActiveHotspotId(null);
    setLoadedTabs(prev => new Set(prev).add(index));
  }, []);

  const activeHotspot = activeTour?.hotspots.find(h => h.id === activeHotspotId);

  if (!tours.length) {
    return (
      <div className="w-full h-full min-h-[300px] lg:min-h-[500px] bg-gray-900 rounded-xl flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 rounded-full bg-navy/30 flex items-center justify-center mx-auto mb-4">
            <Camera size={28} className="text-white/50" />
          </div>
          <p className="text-white/80 font-display text-lg mb-2">Virtual tour coming soon</p>
          <p className="text-white/40 text-sm">Contact us for a personal walkthrough</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {tours.length > 1 && (
        <PanoramaNav
          tours={tours}
          activeIndex={activeIndex}
          onSelect={handleTabChange}
        />
      )}

      <div className="relative rounded-xl overflow-hidden" style={{ height: 'clamp(300px, 50vh, 600px)' }}>
        {/* Only render splat viewer for tabs that have been visited (lazy load) */}
        {loadedTabs.has(activeIndex) && activeTour && (
          <SplatViewer
            scene={activeTour}
            onHotspotClick={setActiveHotspotId}
          />
        )}

        {/* Hotspot popover */}
        {activeHotspot && (
          <HotspotPopover
            hotspot={activeHotspot}
            onClose={() => setActiveHotspotId(null)}
          />
        )}
      </div>
    </div>
  );
}
