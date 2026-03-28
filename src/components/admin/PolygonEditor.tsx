import { useState, useRef, useCallback } from 'react';
import { useStore, useMapDataStore } from '../../hooks/useStore';
import { Modal } from '../ui/Modal';
import { Download, Upload, Pencil, Check } from 'lucide-react';
import type { MapData, MapRegion, MapStyle } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  floor: 'ground' | 'second';
}

const DEFAULT_STYLE: MapStyle = { fill: '#BAE6FD', stroke: '#1B3A5C', strokeWidth: 1.5 };
const HIGHLIGHT_STYLE: MapStyle = { fill: '#F2D9A2', stroke: '#1B3A5C', strokeWidth: 2.5 };

export function PolygonEditor({ open, onClose, floor }: Props) {
  const mapData = useMapDataStore();
  const updateMapData = useStore(s => s.updateMapData);
  const [drawMode, setDrawMode] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>([]);
  const [linkId, setLinkId] = useState('');
  const [linkType, setLinkType] = useState<'room' | 'area'>('room');
  const svgRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const floorData = floor === 'ground' ? mapData.groundFloor : mapData.secondFloor;

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!drawMode || !svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    setCurrentPoints(prev => [...prev, [Math.round(svgP.x), Math.round(svgP.y)]]);
  }, [drawMode]);

  const handleDoubleClick = useCallback(() => {
    if (currentPoints.length < 3) return;
    // Shape complete, prompt for ID
    setDrawMode(false);
  }, [currentPoints]);

  const savePolygon = () => {
    if (currentPoints.length < 3 || !linkId.trim()) return;

    const pathD = currentPoints.map((p, i) =>
      `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`
    ).join(' ') + ' Z';

    const cx = currentPoints.reduce((s, p) => s + p[0], 0) / currentPoints.length;
    const cy = currentPoints.reduce((s, p) => s + p[1], 0) / currentPoints.length;

    const newRegion: MapRegion = {
      entityType: linkType,
      entityId: linkId.trim(),
      svgPath: pathD,
      label: linkId.trim(),
      labelX: cx,
      labelY: cy,
      defaultStyle: DEFAULT_STYLE,
      highlightStyle: HIGHLIGHT_STYLE,
      filteredOutStyle: { fill: '#e5e7eb', stroke: '#9ca3af', strokeWidth: 1 },
    };

    const newMapData: MapData = { ...mapData };
    const floorKey = floor === 'ground' ? 'groundFloor' : 'secondFloor';
    if (linkType === 'room') {
      newMapData[floorKey] = {
        ...newMapData[floorKey],
        regions: [...newMapData[floorKey].regions, newRegion],
      };
    } else {
      newMapData[floorKey] = {
        ...newMapData[floorKey],
        areas: [...newMapData[floorKey].areas, newRegion],
      };
    }

    updateMapData(newMapData);
    setCurrentPoints([]);
    setLinkId('');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'map.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as MapData;
        updateMapData(data);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal open={open} onClose={onClose} title="Map Polygon Editor" wide>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setDrawMode(!drawMode); setCurrentPoints([]); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              drawMode ? 'bg-teal text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Pencil size={14} /> {drawMode ? 'Drawing...' : 'Draw Region'}
          </button>
          <button onClick={exportJson} className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
            <Download size={14} /> Export JSON
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
            <Upload size={14} /> Import JSON
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={importJson} className="hidden" />
        </div>

        {drawMode && (
          <p className="text-xs text-muted">
            Click on the map to place vertices. Double-click to close the shape.
            Points placed: {currentPoints.length}
          </p>
        )}

        {currentPoints.length >= 3 && !drawMode && (
          <div className="flex items-end gap-3 p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="text-xs text-muted">Type</label>
              <select
                value={linkType}
                onChange={e => setLinkType(e.target.value as 'room' | 'area')}
                className="block px-2 py-1 border rounded text-sm"
              >
                <option value="room">Room</option>
                <option value="area">Area</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted">Entity ID</label>
              <input
                type="text"
                value={linkId}
                onChange={e => setLinkId(e.target.value)}
                placeholder="e.g. 210 or pool"
                className="block w-full px-2 py-1 border rounded text-sm"
              />
            </div>
            <button onClick={savePolygon} className="flex items-center gap-1 px-3 py-1.5 bg-navy text-white rounded-lg text-sm">
              <Check size={14} /> Save
            </button>
          </div>
        )}

        <div className="border rounded-xl overflow-hidden bg-white">
          <svg
            ref={svgRef}
            viewBox={floorData.viewBox}
            className="w-full h-auto cursor-crosshair"
            onClick={handleSvgClick}
            onDoubleClick={handleDoubleClick}
          >
            {[...floorData.areas, ...floorData.regions].map(r => (
              <g key={r.entityId}>
                <path
                  d={r.svgPath}
                  fill={r.defaultStyle.fill}
                  stroke={r.defaultStyle.stroke}
                  strokeWidth={r.defaultStyle.strokeWidth}
                  opacity={0.6}
                />
                {r.labelX != null && r.labelY != null && (
                  <text x={r.labelX} y={r.labelY} textAnchor="middle" dominantBaseline="central"
                    fontSize="9" fill="#1B3A5C" pointerEvents="none">
                    {r.label}
                  </text>
                )}
              </g>
            ))}

            {/* Drawing preview */}
            {currentPoints.length > 0 && (
              <>
                <polyline
                  points={currentPoints.map(p => p.join(',')).join(' ')}
                  fill="rgba(42, 191, 191, 0.2)"
                  stroke="#2ABFBF"
                  strokeWidth={2}
                  strokeDasharray="4"
                />
                {currentPoints.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r={4} fill="#2ABFBF" stroke="white" strokeWidth={1.5} />
                ))}
              </>
            )}
          </svg>
        </div>
      </div>
    </Modal>
  );
}
