'use client';

import { useRef } from 'react';
import { Marker } from 'react-simple-maps';
import type { Category, Difficulty } from '@/lib/types';
import { CATEGORY_COLOR, DIFFICULTY_COLOR } from '@/lib/maps';
import { Icon } from '../Icon';

export type PinState = 'default' | 'hover' | 'active' | 'dimmed';

export function MapPin({
  coords,
  pinId,
  imageUrl,
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
  pinId: string;
  imageUrl: string;
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
  // pointer-down position, to tell a click apart from a map pan (d3-zoom)
  const downRef = useRef<{ x: number; y: number } | null>(null);
  const color = CATEGORY_COLOR[category];
  const size = state === 'active' ? 46 : 38;
  const clipId = `pin-clip-${pinId}`;
  const dimmed = state === 'dimmed';
  const lifted = state === 'hover' || state === 'active';
  // counter-scale against ZoomableGroup so pins keep a constant on-screen size
  // (no counter-scale below zoom 1, so they don't grow when zoomed out)
  const k = 1 / Math.max(1, zoom);

  return (
    <Marker coordinates={coords} onMouseEnter={onHover} onMouseLeave={onLeave}>
      <g transform={`scale(${k})`}>
      <g
        style={{
          cursor: 'pointer',
          opacity: dimmed ? 0.5 : 1,
          outline: 'none', // focus shown via teardrop stroke below, not a rectangular ring
          transition: 'opacity .16s ease, transform .16s ease',
          transform: lifted ? 'translateY(-3px)' : 'none',
        }}
        tabIndex={0}
        role="button"
        aria-label={`${label} — ความง่าย ${difficulty}/5`}
        // Distinguish a tap from a map pan ourselves: d3-zoom (ZoomableGroup)
        // intercepts pointer events, so a plain onClick fires unreliably.
        // Record pointer-down, then treat pointer-up as a select only if the
        // pointer barely moved (< 6px) — a real drag is left to the map.
        onPointerDown={(e) => {
          downRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const d = downRef.current;
          downRef.current = null;
          if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) {
            e.stopPropagation();
            onSelect();
          }
        }}
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
        {/* teardrop = location photo masked by the pin shape */}
        <g transform={`translate(${-size / 2}, ${-size}) scale(${lifted ? 1.12 : 1})`}>
          <defs>
            <clipPath id={clipId}>
              <path d={teardropPath(size)} />
            </clipPath>
          </defs>
          {/* color backing (shows while photo loads / if it fails) */}
          <path d={teardropPath(size)} fill={color} />
          <image
            href={imageUrl}
            x={0}
            y={0}
            width={size}
            height={size}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
            style={{ filter: 'drop-shadow(0 2px 6px rgba(20,40,70,.22))' }}
          />
          <path
            d={teardropPath(size)}
            fill="none"
            stroke={state === 'active' || state === 'hover' ? 'var(--koyo)' : '#fff'}
            strokeWidth={state === 'active' ? 3 : state === 'hover' ? 2.5 : 2}
          />
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
