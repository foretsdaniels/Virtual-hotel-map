import { create } from 'zustand';
import type { Room, CommonArea, MapData, PropertyData, FilterState, RoomType, BedType } from '../types';
import roomsData from '../data/rooms.json';
import areasData from '../data/areas.json';
import mapData from '../data/map.json';
import propertyData from '../data/property.json';

interface AppState {
  rooms: Room[];
  areas: CommonArea[];
  mapData: MapData;
  property: PropertyData;
  filters: FilterState;
  adminMode: boolean;
  filteredRoomIds: Set<string>;

  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  toggleAdmin: () => void;
  setAdminMode: (mode: boolean) => void;
  getRoomById: (id: string) => Room | undefined;
  getAreaById: (id: string) => CommonArea | undefined;
  updateRoom: (room: Room) => void;
  updateArea: (area: CommonArea) => void;
  updateProperty: (property: Partial<PropertyData>) => void;
  updateMapData: (data: MapData) => void;
}

function computeFilteredIds(rooms: Room[], filters: FilterState): Set<string> {
  const { roomTypes, bedTypes, petFriendly } = filters;
  const hasTypeFilter = roomTypes.length > 0;
  const hasBedFilter = bedTypes.length > 0;
  const hasPetFilter = petFriendly !== null;

  if (!hasTypeFilter && !hasBedFilter && !hasPetFilter) {
    return new Set(rooms.map(r => r.id));
  }

  return new Set(
    rooms
      .filter(r => {
        if (hasTypeFilter && !roomTypes.includes(r.roomType)) return false;
        if (hasBedFilter && !bedTypes.includes(r.bedType)) return false;
        if (hasPetFilter && petFriendly && !r.petFriendly) return false;
        return true;
      })
      .map(r => r.id)
  );
}

const defaultFilters: FilterState = {
  roomTypes: [],
  bedTypes: [],
  petFriendly: null,
};

export const useStore = create<AppState>((set, get) => ({
  rooms: roomsData as Room[],
  areas: areasData as CommonArea[],
  mapData: mapData as unknown as MapData,
  property: propertyData as PropertyData,
  filters: defaultFilters,
  adminMode: false,
  filteredRoomIds: new Set((roomsData as Room[]).map(r => r.id)),

  setFilters: (partial) => {
    const filters = { ...get().filters, ...partial };
    set({
      filters,
      filteredRoomIds: computeFilteredIds(get().rooms, filters),
    });
  },

  clearFilters: () => {
    set({
      filters: defaultFilters,
      filteredRoomIds: new Set(get().rooms.map(r => r.id)),
    });
  },

  toggleAdmin: () => set(s => ({ adminMode: !s.adminMode })),
  setAdminMode: (mode) => set({ adminMode: mode }),

  getRoomById: (id) => get().rooms.find(r => r.id === id),
  getAreaById: (id) => get().areas.find(a => a.id === id),

  updateRoom: (room) => {
    const rooms = get().rooms.map(r => r.id === room.id ? room : r);
    set({ rooms, filteredRoomIds: computeFilteredIds(rooms, get().filters) });
  },

  updateArea: (area) => {
    set({ areas: get().areas.map(a => a.id === area.id ? area : a) });
  },

  updateProperty: (partial) => {
    set({ property: { ...get().property, ...partial } });
  },

  updateMapData: (data) => set({ mapData: data }),
}));

// Selector hooks
export const useRooms = () => useStore(s => s.rooms);
export const useAreas = () => useStore(s => s.areas);
export const useMapDataStore = () => useStore(s => s.mapData);
export const useProperty = () => useStore(s => s.property);
export const useFilters = () => useStore(s => s.filters);
export const useFilteredRoomIds = () => useStore(s => s.filteredRoomIds);
export const useAdminMode = () => useStore(s => s.adminMode);

export function useFilterParams() {
  const filters = useStore(s => s.filters);
  const setFilters = useStore(s => s.setFilters);
  const clearFilters = useStore(s => s.clearFilters);

  const toggleRoomType = (type: RoomType) => {
    const current = filters.roomTypes;
    const next = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setFilters({ roomTypes: next });
  };

  const toggleBedType = (type: BedType) => {
    const current = filters.bedTypes;
    const next = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setFilters({ bedTypes: next });
  };

  const togglePetFriendly = () => {
    setFilters({ petFriendly: filters.petFriendly ? null : true });
  };

  return { filters, toggleRoomType, toggleBedType, togglePetFriendly, clearFilters };
}
