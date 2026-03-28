export type RoomType =
  | 'standard'
  | 'gulf_front'
  | 'gulf_front_kitchenette'
  | 'kitchenette'
  | 'deluxe'
  | 'grand_suite';

export type BedType = 'king' | 'two_queens';

export interface Hotspot {
  id: string;
  yaw: number;
  pitch: number;
  title: string;
  description: string;
  icon?: string;
  mediaUrl?: string;
}

export interface SplatScene {
  id: string;
  title: string;
  splatUrl: string;
  hotspots: Hotspot[];
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
}

export interface Room {
  id: string;
  displayName: string;
  building: string;
  roomType: RoomType;
  bedType: BedType;
  petFriendly: boolean;
  amenities: string[];
  tours: SplatScene[];
}

export interface CommonArea {
  id: string;
  displayName: string;
  category: 'amenity' | 'event' | 'service';
  description: string;
  amenities: string[];
  tours: SplatScene[];
}

export interface MapStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface MapRegion {
  entityType: 'room' | 'area';
  entityId: string;
  svgPath: string;
  label: string;
  labelX?: number;
  labelY?: number;
  defaultStyle: MapStyle;
  highlightStyle: MapStyle;
  filteredOutStyle?: MapStyle;
}

export interface FloorMap {
  viewBox: string;
  regions: MapRegion[];
  areas: MapRegion[];
  decorations?: Array<{
    type: string;
    svgPath: string;
    label?: string;
    style: MapStyle;
  }>;
}

export interface MapData {
  groundFloor: FloorMap;
  secondFloor: FloorMap;
}

export interface PropertyData {
  name: string;
  tagline: string;
  phone: string;
  address: string;
  description: string;
  heroImageUrl: string;
  logoUrl: string;
  bookingUrl: string;
  adminPin?: string;
  theme: {
    primary: string;
    accent: string;
    sand: string;
    background: string;
  };
}

export interface FilterState {
  roomTypes: RoomType[];
  bedTypes: BedType[];
  petFriendly: boolean | null;
}
