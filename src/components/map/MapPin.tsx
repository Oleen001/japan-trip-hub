'use client';

import { Marker } from 'react-simple-maps';
import type { Category, Difficulty } from '@/lib/types';
import { CATEGORY_COLOR, CATEGORY_ICON, DIFFICULTY_COLOR } from '@/lib/maps';
import { Icon } from '../Icon';

export type PinState = 'default' | 'hover' | 'active' | 'dimmed';

export function MapPin({
  coords,
  category,
  difficulty,
  state,
  saved,
  onHover,
  onLeave,
  onSelect,
  label,
  zoom = 1,
}: {
  coords: [number, number];
  category: Category;
  difficulty: Difficulty;
  state: PinState;
  saved?: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
  label: string;
  zoom?: number;
}) {
  const color = CATEGORY_COLOR[category];
  const size = state === 'active' ? 42 : 34;
  const dimmed = state === 'dimmed';
  const lifted = state === 'hover' || state === 'active';
  // counter-scale against ZoomableGroup so pins keep a constant on-screen size
  // (no counter-scale below zoom 1, so they don't grow when zoomed out)
  const k = 1 / Math.max(1, zoom);

  return (
    <Marker coordinates={coords} onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onSelect}>
      <g transform={`scale(${k})`}>
      <g
        style={{
          cursor: 'pointer',
          opacity: dimmed ? 0.5 : 1,
          transition: 'opacity .16s ease, transform .16s ease',
          transform: lifted ? 'translateY(-3px)' : 'none',
        }}
        tabIndex={0}
        role="button"
        aria-label={`${label} — ความง่าย ${difficulty}/5`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
        onFocus={onHover}
        onBlur={onLeave}
      >
        {/* active halo */}
        {state === 'active' && (
          <circle r={size / 2 + 6} cx={0} cy={-size / 2} fill="rgba(200,102,47,.18)" />
        )}
        {/* hit area (transparent, ≥44px) */}
        <circle r={24} cx={0} cy={-size / 2} fill="transparent" />
        {/* teardrop */}
        <g transform={`translate(${-size / 2}, ${-size}) scale(${lifted ? 1.12 : 1})`}>
          <path
            d={teardropPath(size)}
            fill={color}
            stroke={state === 'active' ? 'var(--koyo)' : '#fff'}
            strokeWidth={state === 'active' ? 3 : 2}
            style={{ filter: 'drop-shadow(0 2px 6px rgba(20,40,70,.22))' }}
          />
          {/* category icon */}
          <foreignObject x={size * 0.18} y={size * 0.12} width={size * 0.64} height={size * 0.64}>
            <div className="flex h-full w-full items-center justify-center text-white">
              <Icon name={CATEGORY_ICON[category]} size={size * 0.5} />
            </div>
          </foreignObject>
        </g>
        {/* difficulty dot */}
        <circle
          r={4}
          cx={size * 0.32}
          cy={-size * 0.18}
          fill={DIFFICULTY_COLOR[difficulty]}
          stroke="#fff"
          strokeWidth={1.5}
        />
        {/* saved star */}
        {saved && (
          <g transform={`translate(${-size * 0.42}, ${-size * 0.95})`}>
            <circle r={6} fill="#fff" />
            <foreignObject x={-5} y={-5} width={10} height={10}>
              <div className="flex h-full w-full items-center justify-center" style={{ color: 'var(--gold)' }}>
                <Icon name="star" size={10} />
              </div>
            </foreignObject>
          </g>
        )}
      </g>
      </g>
    </Marker>
  );
}

function teardropPath(size: number): string {
  // teardrop: rounded top, point at bottom-left rotated look — use classic map pin path
  const w = size;
  const h = size;
  const r = w / 2;
  // pin shape: circle top + triangle point at bottom center
  return `M ${r} ${h}
    C ${r * 0.25} ${h * 0.62}, 0 ${r * 0.95}, 0 ${r}
    A ${r} ${r} 0 1 1 ${w} ${r}
    C ${w} ${r * 0.95}, ${r * 1.75} ${h * 0.62}, ${r} ${h} Z`;
}
