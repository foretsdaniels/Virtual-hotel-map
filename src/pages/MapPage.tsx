import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyMap } from '../components/map/PropertyMap';
import { FilterPanel } from '../components/filter/FilterPanel';
import { MapLegend } from '../components/map/MapLegend';
import { useProperty, useStore } from '../hooks/useStore';
import type { RoomType, BedType } from '../types';

export function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const property = useProperty();
  const setFilters = useStore(s => s.setFilters);

  const floorParam = searchParams.get('floor');
  const [floor, setFloor] = useState<'ground' | 'second'>(
    floorParam === '2' ? 'second' : 'ground'
  );

  // Sync filters from URL on mount
  useEffect(() => {
    const types = searchParams.get('type')?.split(',').filter(Boolean) as RoomType[] | undefined;
    const beds = searchParams.get('bed')?.split(',').filter(Boolean) as BedType[] | undefined;
    const pet = searchParams.get('pet');
    setFilters({
      roomTypes: types ?? [],
      bedTypes: beds ?? [],
      petFriendly: pet === 'true' ? true : null,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFloorChange = (f: 'ground' | 'second') => {
    setFloor(f);
    const newParams = new URLSearchParams(searchParams);
    if (f === 'second') {
      newParams.set('floor', '2');
    } else {
      newParams.delete('floor');
    }
    setSearchParams(newParams, { replace: true });
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-navy">
          {property.name}
        </h1>
        <p className="text-muted mt-1">{property.tagline}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar: Filters + Legend */}
        <div className="space-y-4 order-2 lg:order-1">
          <FilterPanel />
          <MapLegend />
        </div>

        {/* Map */}
        <div className="order-1 lg:order-2">
          <PropertyMap floor={floor} onFloorChange={handleFloorChange} />
        </div>
      </div>
    </div>
  );
}
