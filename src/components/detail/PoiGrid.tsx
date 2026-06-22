'use client';

import { useState } from 'react';
import type { Poi } from '@/lib/types';
import { Icon } from '../Icon';
import { FlatIcon } from '../FlatIcon';
import { SmartImage } from '../SmartImage';
import { Modal } from '../Modal';

function fmtDuration(min?: number) {
  if (min == null) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} น.`;
  if (m === 0) return `${h} ชม.`;
  return `${h} ชม. ${m} น.`;
}

export function PoiGrid({ pois }: { pois: Poi[] }) {
  const [active, setActive] = useState<Poi | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
        {pois.map((poi) => (
          <PoiCard key={poi.name} poi={poi} onOpen={() => setActive(poi)} />
        ))}
      </div>

      <Modal
        open={active != null}
        onClose={() => setActive(null)}
        maxWidth={620}
        title={
          <span className="flex items-center gap-2">
            {active && <FlatIcon name={active.icon} size={22} />}
            {active?.name}
          </span>
        }
        subtitle={
          active && (
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <Icon name="map-marker" size={13} /> {active.location_th}
              </span>
              {fmtDuration(active.durationMin) && (
                <span className="inline-flex items-center gap-1 font-semibold text-koyo-dark">
                  <Icon name="clock" size={13} /> {fmtDuration(active.durationMin)}
                </span>
              )}
            </span>
          )
        }
      >
        {active && (
          <div>
            <div className="overflow-hidden rounded-lg">
              <SmartImage image={active.image} alt={active.name} ratio="16 / 9" className="w-full" />
            </div>
            <p className="mt-4 text-[14px] font-semibold leading-[1.6] text-ink">{active.blurb_th}</p>
            <p className="mt-3 border-t border-line pt-3 text-[13.5px] leading-[1.75] text-ink-soft">
              {active.deepDive_th}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}

function PoiCard({ poi, onOpen }: { poi: Poi; onOpen: () => void }) {
  const dur = fmtDuration(poi.durationMin);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full cursor-pointer overflow-hidden rounded-lg border border-line bg-white text-left shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-pop focus-visible:-translate-y-[3px]"
    >
      <div className="overflow-hidden">
        <SmartImage
          image={poi.image}
          alt={poi.name}
          ratio="16 / 8"
          className="w-full transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </div>

      <div className="p-[18px]">
        <div className="mb-[6px] flex items-baseline justify-between gap-2">
          <h4 className="flex items-center gap-2 text-[16px] font-bold">
            <FlatIcon name={poi.icon} size={20} />
            {poi.name}
          </h4>
          {dur && (
            <span className="inline-flex flex-none items-center gap-1 whitespace-nowrap text-[11.5px] font-bold text-koyo-dark">
              <Icon name="clock" size={13} /> {dur}
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-[13px] leading-[1.6] text-ink-soft">{poi.blurb_th}</p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[.04em] text-alp">
            <Icon name="map-marker" size={13} /> {poi.location_th}
          </span>
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-alp">
            อ่านงานวิจัยเชิงลึก
            <Icon name="angle-right" size={14} className="transition-transform group-hover:translate-x-[2px]" />
          </span>
        </div>
      </div>
    </button>
  );
}
