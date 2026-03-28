import type { RoomType } from '../types';

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  standard: 'Standard Room',
  gulf_front: 'Gulf Front',
  gulf_front_kitchenette: 'Gulf Front Kitchenette',
  kitchenette: 'Kitchenette',
  deluxe: 'Deluxe Room',
  grand_suite: 'Grand Suite',
};

export const ROOM_TYPE_COLORS: Record<RoomType, string> = {
  gulf_front: '#2ABFBF',
  gulf_front_kitchenette: '#6EE7B7',
  kitchenette: '#F2D9A2',
  standard: '#BAE6FD',
  deluxe: '#818CF8',
  grand_suite: '#F59E0B',
};

export const FLOOR_LABELS = {
  ground: 'Ground Floor',
  second: 'Second Floor',
} as const;
