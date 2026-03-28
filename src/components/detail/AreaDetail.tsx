import { useProperty } from '../../hooks/useStore';
import type { CommonArea } from '../../types';
import { Breadcrumb } from './Breadcrumb';
import { AmenitiesSidebar } from './AmenitiesSidebar';
import { TourViewer } from '../tour/TourViewer';
import { Badge } from '../ui/Badge';

interface Props {
  area: CommonArea;
}

const CATEGORY_COLORS: Record<string, string> = {
  amenity: '#2ABFBF',
  event: '#818CF8',
  service: '#F59E0B',
};

export function AreaDetail({ area }: Props) {
  const property = useProperty();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Map', to: '/map' },
          { label: area.displayName },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left: Tour Viewer */}
        <div>
          <TourViewer tours={area.tours} />
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-navy mb-3">
              {area.displayName}
            </h1>
            <Badge color={CATEGORY_COLORS[area.category]}>
              {area.category.charAt(0).toUpperCase() + area.category.slice(1)}
            </Badge>
            <p className="text-sm text-muted mt-3">{area.description}</p>
          </div>

          <AmenitiesSidebar amenities={area.amenities} />

          <a
            href={property.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-navy text-white rounded-xl font-medium hover:bg-navy/90 transition-colors"
          >
            Book Your Stay
          </a>
        </div>
      </div>
    </div>
  );
}
