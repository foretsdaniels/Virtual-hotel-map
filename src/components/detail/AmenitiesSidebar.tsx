import {
  Tv, Wifi, Wind, Coffee, Bath, UtensilsCrossed,
  Refrigerator, Bed, Dog, Waves, Sun, Armchair, Check,
} from 'lucide-react';

const AMENITY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Smart TV': Tv,
  'Free WiFi': Wifi,
  'Air Conditioning': Wind,
  'Coffee Maker': Coffee,
  'Private Bathroom': Bath,
  'Full Kitchenette': UtensilsCrossed,
  'Mini Fridge': Refrigerator,
  'King Bed': Bed,
  'Two Queen Beds': Bed,
  'Pet Friendly': Dog,
  'Gulf View Balcony': Waves,
  'Heated Pool': Sun,
  'Separate Living Area': Armchair,
};

function getIcon(amenity: string) {
  for (const [key, Icon] of Object.entries(AMENITY_ICONS)) {
    if (amenity.includes(key)) return Icon;
  }
  return Check;
}

interface Props {
  amenities: string[];
}

export function AmenitiesSidebar({ amenities }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-navy mb-3">Amenities</h3>
      <div className="space-y-2">
        {amenities.map(amenity => {
          const Icon = getIcon(amenity);
          return (
            <div key={amenity} className="flex items-center gap-2.5 text-sm text-gray-700">
              <Icon size={16} className="text-teal shrink-0" />
              <span>{amenity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
