# Buccaneer Inn — Virtual Hotel Explorer

Interactive property map and 3D virtual room explorer for **Buccaneer Inn**, St. George Island, Florida. Built with React, TypeScript, and Gaussian Splatting for immersive 3D room tours.

## Tech Stack

- **React 18** + **Vite** — fast dev server and optimized production builds
- **TypeScript** — full type safety across the application
- **Tailwind CSS v4** — utility-first styling with custom design tokens
- **Zustand** — lightweight state management
- **React Router v6** — client-side routing with deep-link support
- **Three.js** + **@mkkellogg/gaussian-splats-3d** — 3D Gaussian Splat rendering
- **Lucide React** — icon system
- **Framer Motion** — animation library

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── data/                    # JSON data layer (no room data in components)
│   ├── rooms.json           # All 90 rooms with types, amenities, tours
│   ├── areas.json           # Common areas (pool, patio, banquet, etc.)
│   ├── map.json             # SVG coordinates for both floor maps
│   └── property.json        # Property info, contact, theme colors
├── types/
│   └── index.ts             # TypeScript interfaces
├── hooks/
│   └── useStore.ts          # Zustand store with filter logic
├── components/
│   ├── map/                 # SVG property map, regions, tooltips, legend
│   ├── filter/              # Multi-select filter chips
│   ├── tour/                # Gaussian Splat 3D viewer, hotspots, nav tabs
│   ├── detail/              # Room/area detail pages, amenities, breadcrumbs
│   ├── admin/               # Admin panel, editors (room, hotspot, polygon, property)
│   └── ui/                  # Shared UI components (Badge, Modal, IconButton)
├── pages/
│   ├── MapPage.tsx           # Main map view with filters
│   ├── RoomPage.tsx          # Room detail + 3D tour
│   └── AreaPage.tsx          # Common area detail + 3D tour
├── utils/
│   └── constants.ts          # Room type labels and colors
└── App.tsx                   # Root layout, routing, admin mode
```

## Routes

| URL | View |
|-----|------|
| `/` or `/map` | Property map (ground floor default) |
| `/map?floor=2` | Property map, second floor |
| `/room/:roomId` | Room detail with 3D tour |
| `/room/:roomId?tour=210-balcony` | Room detail, specific scene pre-loaded |
| `/area/:areaId` | Common area detail with 3D tour |

All routes support deep-linking — navigating directly to `/room/210` loads the room data and renders the full detail view without visiting the map first.

## Property Layout

### Ground Floor (Beach Side)

| Zone | Rooms |
|------|-------|
| East Wing | 101–120 |
| West Wing | 301–322 |
| Common Areas | Pool, Beach Patio, Picnic Area, Banquet Room, Front Desk |

### Second Floor (Across Gorrie Drive)

| Zone | Rooms |
|------|-------|
| East Wing | 201–224 |
| West Wing | 401–422 |
| Suites | 501, 502 |

## Room Types

| Type | Color | Description |
|------|-------|-------------|
| Gulf Front | Teal `#2ABFBF` | Ocean/gulf view rooms |
| Gulf Front Kitchenette | Seafoam `#6EE7B7` | Gulf view + kitchenette |
| Kitchenette | Sand `#F2D9A2` | Interior-facing with kitchenette |
| Standard | Sky Blue `#BAE6FD` | Standard rooms |
| Deluxe | Slate Blue `#818CF8` | Extra square footage + dinette |
| Grand Suite | Gold `#F59E0B` | Largest rooms, premium amenities |

## Gaussian Splat 3D Tours

This project uses **Gaussian Splatting** instead of traditional 360° panorama photos. Gaussian splats are volumetric 3D captures that let users orbit, zoom, and explore spaces with true depth and parallax.

### Adding Splat Files

1. Capture rooms using a tool like **Luma AI**, **Polycam**, **Nerfstudio**, or **3D Gaussian Splatting**
2. Export as `.splat` or `.ply` format
3. Place files in `public/splats/{roomId}/` — e.g., `public/splats/210/bedroom.splat`
4. Update the room's `tours` array in `src/data/rooms.json`:

```json
{
  "id": "210-bedroom",
  "title": "Bedroom",
  "splatUrl": "/splats/210/bedroom.splat",
  "cameraPosition": [0, 1.5, 3],
  "cameraTarget": [0, 1, 0],
  "hotspots": []
}
```

Each scene supports:
- **`splatUrl`** — path to the `.splat` file
- **`cameraPosition`** — initial camera `[x, y, z]`
- **`cameraTarget`** — camera look-at `[x, y, z]`
- **`hotspots`** — informational pins placed at `yaw`/`pitch` coordinates

When no splat file is available, the viewer shows a placeholder with instructions.

## Filter System

Filters are rendered as multi-select chips and support:

- **Room Type** — Standard, Gulf Front, Gulf Front Kitchenette, Kitchenette, Deluxe, Grand Suite
- **Bed Type** — King, Two Queens
- **Pet Friendly** — toggle

Filters are additive (OR within category, AND across categories). Filter state persists in URL query params (e.g., `?type=gulf_front,deluxe&bed=king&pet=true`). Non-matching rooms appear greyed out and are non-clickable on the map.

## Admin Mode

Access admin mode via:
- Keyboard shortcut: `Ctrl+Shift+A`
- URL parameter: `?admin=true`
- PIN code: `1234` (configurable in `property.json`)

### Admin Features

- **Room Editor** — edit display name, room type, bed type, pet policy, amenities, and splat tour scenes
- **Hotspot Editor** — add, edit, and delete hotspot markers within 3D scenes
- **Polygon Editor** — draw new SVG map regions, link to room/area IDs, export/import `map.json`
- **Property Editor** — edit property name, contact info, booking URL, and theme colors (live preview)

## Data Architecture

All content lives in JSON files under `src/data/`. No room, area, or tour data is hardcoded in components. This makes it possible for a non-developer to update content by editing JSON files or swapping in a CMS API.

| File | Purpose |
|------|---------|
| `rooms.json` | Room definitions, types, amenities, tour scenes |
| `areas.json` | Common areas with descriptions and tours |
| `map.json` | SVG path coordinates for both floor maps |
| `property.json` | Property metadata, contact info, theme colors |

## Design System

- **Typography**: Playfair Display (headings) + DM Sans (body)
- **Primary**: Navy `#1B3A5C`
- **Accent**: Teal `#2ABFBF`
- **Sand**: `#F2D9A2`
- **Background**: `#FAFAF8`

Theme colors are configurable via the admin Property Editor and apply live through CSS custom properties.
