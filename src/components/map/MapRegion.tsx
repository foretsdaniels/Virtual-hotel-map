import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MapRegion as MapRegionType } from '../../types';
import { useFilteredRoomIds } from '../../hooks/useStore';
import { RoomTooltip } from './RoomTooltip';

interface Props {
  region: MapRegionType;
}

export function MapRegionCell({ region }: Props) {
  const navigate = useNavigate();
  const filteredIds = useFilteredRoomIds();
  const [hovered, setHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const isRoom = region.entityType === 'room';
  const isFiltered = isRoom && !filteredIds.has(region.entityId);

  const style = isFiltered
    ? region.filteredOutStyle ?? region.defaultStyle
    : hovered
      ? region.highlightStyle
      : region.defaultStyle;

  const handleClick = useCallback(() => {
    if (isFiltered) return;
    const path = isRoom ? `/room/${region.entityId}` : `/area/${region.entityId}`;
    navigate(path);
  }, [isFiltered, isRoom, region.entityId, navigate]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<SVGPathElement>) => {
    if (isFiltered) return;
    const rect = (e.target as SVGPathElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
    setHovered(true);
  }, [isFiltered]);

  return (
    <>
      <path
        d={region.svgPath}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        className={`map-region ${isFiltered ? 'filtered-out' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
      />
      {region.labelX !== undefined && region.labelY !== undefined && (
        <text
          x={region.labelX}
          y={region.labelY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="11"
          fontWeight="600"
          fontFamily="var(--font-body)"
          fill={isFiltered ? '#9ca3af' : '#1B3A5C'}
          pointerEvents="none"
        >
          {region.label}
        </text>
      )}
      {hovered && isRoom && !isFiltered && (
        <RoomTooltip roomId={region.entityId} position={tooltipPos} />
      )}
    </>
  );
}
