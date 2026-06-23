'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Destination } from '@/lib/types';
import { DEFAULT_FILTER, isFilterActive, matchesFilter, type FilterState } from '@/lib/filter';
import { useSaved } from '@/lib/useSaved';
import { FilterBar } from './FilterBar';
import { DestinationCard } from './DestinationCard';
import { RouteCompare } from './detail/RouteCompare';
import { DifficultyPips } from './DifficultyPips';
import { DIFFICULTY_SHORT_TH } from '@/lib/maps';
import { Icon } from './Icon';
import { cn } from '@/lib/cn';

const JapanMap = dynamic(() => import('./map/JapanMap').then((m) => m.JapanMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-ink-soft">กำลังโหลดแผนที่…</div>
  ),
});

function summarize(f: FilterState): string {
  if (!isFilterActive(f)) return 'ทั้งหมด · hover การ์ดเพื่อเด้ง pin';
  const parts: string[] = [];
  if (f.region !== 'all') parts.push(`ภาค ${f.region}`);
  if (f.categories.length) parts.push(`${f.categories.length} ประเภท`);
  if (f.seasons.length) parts.push(`${f.seasons.length} ฤดู`);
  if (f.savedOnly) parts.push('เฉพาะที่บันทึก');
  return 'กรอง: ' + parts.join(' · ');
}

export function IndexClient({ destinations }: { destinations: Destination[] }) {
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false); // mobile filter sheet
  const [listOpen, setListOpen] = useState(false); // mobile results sheet
  const { saved } = useSaved();

  const regions = useMemo(
    () => Array.from(new Set(destinations.map((d) => d.region))).sort(),
    [destinations],
  );
  const visible = useMemo(
    () => destinations.filter((d) => matchesFilter(d, filter, saved)),
    [destinations, filter, saved],
  );
  const visibleSlugs = useMemo(() => new Set(visible.map((d) => d.slug)), [visible]);
  const activeDest = activeSlug ? destinations.find((d) => d.slug === activeSlug) ?? null : null;

  return (
    // fills the viewport below the 60px TopBar; no page scroll — Google-Maps-style
    <div className="relative h-[calc(100vh-60px)] w-full overflow-hidden">
      {/* map fills the whole area */}
      <div className="absolute inset-0">
        <JapanMap
          destinations={destinations}
          activeSlug={activeSlug}
          hoverSlug={hoverSlug}
          visibleSlugs={visibleSlugs}
          savedSlugs={saved}
          onHoverPin={setHoverSlug}
          onSelectPin={(slug) => setActiveSlug((cur) => (cur === slug ? null : slug))}
        />
      </div>

      {/* ── desktop: floating left panel — filter+results, or route view when a pin is active ── */}
      <div className="absolute bottom-4 left-4 top-4 z-20 hidden w-[380px] flex-col overflow-hidden rounded-2xl border border-line bg-white/95 shadow-pop backdrop-blur-md lg:flex">
        {activeDest ? (
          <>
            <div className="border-b border-line px-4 py-[14px]">
              <button
                onClick={() => setActiveSlug(null)}
                className="mb-[10px] inline-flex cursor-pointer items-center gap-1 text-[12.5px] font-semibold text-alp hover:text-alp-700"
              >
                <Icon name="angle-left" size={15} /> ทุกปลายทาง
              </button>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-[17px] font-extrabold leading-tight text-ink">
                    {activeDest.name.th}
                    {activeDest.name.jp && (
                      <span className="ml-[6px] text-[12px] font-medium text-ink-soft">{activeDest.name.jp}</span>
                    )}
                  </h2>
                  <p className="text-[11.5px] text-ink-soft">
                    {activeDest.region} · {activeDest.prefecture}
                  </p>
                </div>
                <span className="inline-flex flex-none items-center gap-[5px] rounded-full bg-paper px-[8px] py-[3px]">
                  <span className="text-[9.5px] font-bold uppercase tracking-wide text-ink-soft">
                    {DIFFICULTY_SHORT_TH[activeDest.difficultyFromTokyo]}
                  </span>
                  <DifficultyPips level={activeDest.difficultyFromTokyo} />
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <p className="mb-3 text-[12.5px] leading-[1.6] text-ink-soft">{activeDest.access.summary_th}</p>
              <RouteCompare options={activeDest.access.options} />
              <Link
                href={`/d/${activeDest.slug}`}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1 rounded-md bg-alp px-4 py-[11px] text-[14px] font-bold text-white transition-colors hover:bg-alp-700"
              >
                ดูรายละเอียดเต็ม <Icon name="angle-right" size={16} />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-line px-4 py-[14px]">
              <FilterBar value={filter} onChange={setFilter} regions={regions} />
            </div>
            <div className="flex items-baseline justify-between border-b border-line px-4 py-[10px]">
              <span className="text-[13.5px] font-extrabold text-ink">
                พบ <span className="tabnum text-alp">{visible.length}</span> ปลายทาง
              </span>
              <span className="truncate pl-2 text-[11.5px] text-ink-soft">{summarize(filter)}</span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {visible.map((d) => (
                <div
                  key={d.slug}
                  onMouseEnter={() => setHoverSlug(d.slug)}
                  onMouseLeave={() => setHoverSlug(null)}
                  className={cn(
                    'rounded-xl ring-2 transition-shadow',
                    hoverSlug === d.slug ? 'ring-alp/40' : 'ring-transparent',
                  )}
                >
                  <DestinationCard destination={d} variant="compact" />
                </div>
              ))}
              {visible.length === 0 && (
                <div className="rounded-xl border border-dashed border-line py-12 text-center text-ink-soft">
                  <Icon name="map-marker" size={30} />
                  <p className="mt-2 text-[13px]">ไม่มีปลายทางตรงตัวกรอง</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── mobile: floating controls over the map ── */}
      <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between gap-2 lg:hidden">
        <button
          onClick={() => setFilterOpen(true)}
          className="inline-flex cursor-pointer items-center gap-[6px] rounded-full border border-line bg-white/95 px-4 py-[9px] text-[13px] font-semibold text-ink-soft shadow-card backdrop-blur"
        >
          <Icon name="filter" size={15} /> ตัวกรอง
          {isFilterActive(filter) && <span className="h-2 w-2 rounded-full bg-koyo" />}
        </button>
        <button
          onClick={() => setListOpen(true)}
          className="inline-flex cursor-pointer items-center gap-[6px] rounded-full border border-line bg-white/95 px-4 py-[9px] text-[13px] font-semibold text-ink-soft shadow-card backdrop-blur"
        >
          <Icon name="list-ul" size={15} /> {visible.length} ปลายทาง
        </button>
      </div>

      {/* mobile: selected pin card — bottom sheet flush to the edge, footer button always visible */}
      {activeDest && (
        <div className="absolute inset-x-0 bottom-0 z-30 lg:hidden">
          <div
            key={activeDest.slug}
            className="mx-auto flex max-h-[82vh] max-w-[560px] flex-col rounded-t-2xl border border-line bg-white shadow-pop"
          >
            <div className="flex flex-none items-center justify-between px-4 pb-2 pt-3">
              <span className="text-[12px] font-bold uppercase tracking-wide text-ink-soft">
                ปลายทางที่เลือก
              </span>
              <button
                onClick={() => setActiveSlug(null)}
                aria-label="ปิด"
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-paper text-ink-soft transition-colors hover:bg-paper-sunken hover:text-ink"
              >
                <Icon name="times" size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3">
              <DestinationCard destination={activeDest} variant="compact" />
            </div>
            <div className="flex-none border-t border-line p-3">
              <Link
                href={`/d/${activeDest.slug}`}
                className="flex w-full items-center justify-center gap-1 rounded-md bg-alp px-4 py-[12px] text-[14px] font-bold text-white transition-colors hover:bg-alp-700"
              >
                ดูรายละเอียด <Icon name="angle-right" size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* mobile: results list sheet */}
      {listOpen && (
        <div className="absolute inset-0 z-40 lg:hidden" role="dialog" aria-modal>
          <div className="absolute inset-0 bg-ink/40" onClick={() => setListOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-2xl bg-paper p-4 shadow-pop">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold">{visible.length} ปลายทาง</h2>
              <button onClick={() => setListOpen(false)} className="cursor-pointer text-ink-soft">
                <Icon name="times" size={22} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visible.map((d) => (
                <DestinationCard key={d.slug} destination={d} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* mobile: filter sheet */}
      {filterOpen && (
        <div className="absolute inset-0 z-50 lg:hidden" role="dialog" aria-modal>
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-pop">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-extrabold">ตัวกรอง</h2>
              <button onClick={() => setFilterOpen(false)} className="cursor-pointer text-ink-soft">
                <Icon name="times" size={22} />
              </button>
            </div>
            <FilterBar value={filter} onChange={setFilter} regions={regions} layout="sheet" />
            <button
              onClick={() => setFilterOpen(false)}
              className="mt-6 w-full cursor-pointer rounded-md bg-alp px-4 py-3 text-[15px] font-bold text-white"
            >
              ดู {visible.length} ปลายทาง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
