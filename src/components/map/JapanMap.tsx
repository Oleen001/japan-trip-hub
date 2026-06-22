'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import type { Destination } from '@/lib/types';
import { MapPin, type PinState } from './MapPin';
import { Icon } from '../Icon';

const TOKYO: [number, number] = [139.6917, 35.6895];
const HOME: { coordinates: [number, number]; zoom: number } = { coordinates: [138.4, 36.4], zoom: 1.7 };
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 12;

export function JapanMap({
  destinations,
  activeSlug,
  hoverSlug,
  visibleSlugs,
  savedSlugs,
  onHoverPin,
  onSelectPin,
}: {
  destinations: Destination[];
  activeSlug: string | null;
  hoverSlug: string | null;
  visibleSlugs: Set<string>;
  savedSlugs: string[];
  onHoverPin: (slug: string | null) => void;
  onSelectPin: (slug: string) => void;
}) {
  const [pos, setPos] = useState(HOME);
  const activeDest = activeSlug ? destinations.find((d) => d.slug === activeSlug) ?? null : null;
  const popK = 1 / Math.max(1, pos.zoom);

  function pinState(slug: string): PinState {
    if (activeSlug === slug) return 'active';
    if (hoverSlug === slug) return 'hover';
    if (activeSlug && activeSlug !== slug) return 'dimmed';
    if (!visibleSlugs.has(slug)) return 'dimmed';
    return 'default';
  }

  const zoomBy = (f: number) =>
    setPos((p) => ({ ...p, zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, p.zoom * f)) }));

  return (
    <div className="map-texture relative h-full w-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 1700, center: [138.2, 37] }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          center={pos.coordinates}
          zoom={pos.zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onMoveEnd={(p) => setPos(p)}
        >
          <Geographies geography="/japan.topo.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#dde6f0"
                  stroke="#d4e3ec"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: '#d3dfee' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Tokyo anchor */}
          <Marker coordinates={TOKYO}>
            <g transform={`scale(${1 / Math.max(1, pos.zoom)})`}>
              <circle r={8} fill="none" stroke="var(--alp-dark)" strokeWidth={2} />
              <circle r={3.5} fill="var(--alp-dark)" />
              <text
                y={-14}
                textAnchor="middle"
                style={{ fontSize: 10, fontWeight: 700, fill: 'var(--alp-dark)' }}
              >
                โตเกียว (ฐาน)
              </text>
            </g>
          </Marker>

          {destinations.map((d) => {
            const st = pinState(d.slug);
            return (
              <MapPin
                key={d.slug}
                coords={[d.coords.lng, d.coords.lat]}
                category={d.category[0]}
                difficulty={d.difficultyFromTokyo}
                state={st}
                saved={savedSlugs.includes(d.slug)}
                label={d.name.en}
                onHover={() => onHoverPin(d.slug)}
                onLeave={() => onHoverPin(null)}
                onSelect={() => onSelectPin(d.slug)}
                zoom={pos.zoom}
              />
            );
          })}

          {/* popover (map callout) for the active pin — tracks the pin, points down at it */}
          {activeDest && (
            <Marker coordinates={[activeDest.coords.lng, activeDest.coords.lat]}>
              <g transform={`scale(${popK})`} style={{ pointerEvents: 'auto' }}>
                <foreignObject x={-124} y={-214} width={248} height={172} style={{ overflow: 'visible' }}>
                  <div
                    className="relative w-[236px] overflow-hidden rounded-xl border border-line bg-white shadow-pop"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link href={`/d/${activeDest.slug}`} className="block">
                      <div className="relative h-[96px] w-full overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeDest.heroImage.url}
                          alt={activeDest.name.en}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const t = e.currentTarget;
                            if (activeDest.heroImage.fallbackUrl && t.src !== activeDest.heroImage.fallbackUrl)
                              t.src = activeDest.heroImage.fallbackUrl;
                          }}
                        />
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
                      </div>
                      <div className="px-[14px] py-[11px]">
                        <div className="flex items-baseline gap-[6px]">
                          <span className="text-[14px] font-extrabold leading-tight text-ink">
                            {activeDest.name.en}
                          </span>
                          {activeDest.name.jp && (
                            <span className="text-[11px] text-ink-soft">{activeDest.name.jp}</span>
                          )}
                        </div>
                        <p className="mt-[3px] line-clamp-2 text-[11.5px] leading-[1.45] text-ink-soft">
                          {activeDest.tagline_th}
                        </p>
                        <span className="mt-[7px] inline-flex items-center gap-1 text-[11.5px] font-bold text-alp">
                          ดูรายละเอียด
                          <Icon name="angle-right" size={13} />
                        </span>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPin(activeDest.slug);
                      }}
                      aria-label="ปิด"
                      className="absolute right-[7px] top-[7px] grid h-[26px] w-[26px] cursor-pointer place-items-center rounded-full bg-white/85 text-ink-soft shadow-pin backdrop-blur transition-colors hover:bg-white hover:text-ink"
                    >
                      <Icon name="times" size={14} />
                    </button>
                  </div>
                  {/* pointer arrow */}
                  <div className="mx-auto h-0 w-0 border-x-[8px] border-t-[9px] border-x-transparent border-t-white drop-shadow-[0_3px_2px_rgba(20,40,70,.12)]" />
                </foreignObject>
              </g>
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>

      {/* zoom controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col overflow-hidden rounded-md border border-line bg-white shadow-card">
        <button
          type="button"
          onClick={() => zoomBy(1.6)}
          aria-label="ซูมเข้า"
          className="grid h-9 w-9 cursor-pointer place-items-center text-ink-soft transition-colors hover:bg-paper-sunken"
        >
          <Icon name="plus" size={18} />
        </button>
        <div className="h-px bg-line" />
        <button
          type="button"
          onClick={() => zoomBy(1 / 1.6)}
          aria-label="ซูมออก"
          className="grid h-9 w-9 cursor-pointer place-items-center text-ink-soft transition-colors hover:bg-paper-sunken"
        >
          <Icon name="minus" size={18} />
        </button>
        <div className="h-px bg-line" />
        <button
          type="button"
          onClick={() => setPos(HOME)}
          aria-label="รีเซ็ตมุมมอง"
          className="grid h-9 w-9 cursor-pointer place-items-center text-ink-soft transition-colors hover:bg-paper-sunken"
        >
          <Icon name="focus-target" size={17} />
        </button>
      </div>
    </div>
  );
}
