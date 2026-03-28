import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { MapPage } from './pages/MapPage';
import { RoomPage } from './pages/RoomPage';
import { AreaPage } from './pages/AreaPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { PropertyEditor } from './components/admin/PropertyEditor';
import { PolygonEditor } from './components/admin/PolygonEditor';
import { useStore, useProperty } from './hooks/useStore';
import { Phone, MapPin } from 'lucide-react';

function AppShell() {
  const [searchParams] = useSearchParams();
  const setAdminMode = useStore(s => s.setAdminMode);
  const adminMode = useStore(s => s.adminMode);
  const property = useProperty();

  const [propertyEditorOpen, setPropertyEditorOpen] = useState(false);
  const [polygonEditorOpen, setPolygonEditorOpen] = useState(false);

  // Admin mode via URL param
  useEffect(() => {
    if (searchParams.get('admin') === 'true') {
      const pin = prompt('Enter admin PIN:');
      if (pin === (property.adminPin ?? '1234')) {
        setAdminMode(true);
      }
    }
  }, [searchParams, setAdminMode, property.adminPin]);

  // Admin mode via keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (!adminMode) {
          const pin = prompt('Enter admin PIN:');
          if (pin === (property.adminPin ?? '1234')) {
            setAdminMode(true);
          }
        } else {
          setAdminMode(false);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [adminMode, setAdminMode, property.adminPin]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Top bar */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/map" className="flex items-center gap-3 no-underline">
            <span className="text-xl font-display font-bold text-navy">{property.name}</span>
          </a>
          <div className="hidden md:flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Phone size={14} /> {property.phone}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {property.address}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/map" replace />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/area/:areaId" element={<AreaPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-muted">
          {property.name} &middot; {property.address} &middot; {property.phone}
        </div>
      </footer>

      {/* Admin */}
      <AdminPanel
        onOpenPropertyEditor={() => setPropertyEditorOpen(true)}
        onOpenPolygonEditor={() => setPolygonEditorOpen(true)}
      />
      <PropertyEditor
        open={propertyEditorOpen}
        onClose={() => setPropertyEditorOpen(false)}
      />
      <PolygonEditor
        open={polygonEditorOpen}
        onClose={() => setPolygonEditorOpen(false)}
        floor="ground"
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
