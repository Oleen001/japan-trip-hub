'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Destination } from '@/lib/types';
import { DEFAULT_FILTER, isFilterActive, matchesFilter, type FilterState } from '@/lib/filter';
import { useSaved } from '@/lib/useSaved';
import { FilterBar } from './FilterBar';
import { PreviewPanel } from './PreviewPanel';
import { DestinationCard } from './DestinationCard';
import { Icon } from './Icon';
import { cn } from '@/lib/cn';

const JapanMap = dynamic(() => import('./map/JapanMap').then((m) => m.JapanMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-ink-soft">กำลังโหลดแผนที่…</div>
  ),
});

function summarize(f: FilterState): string {
  if (!isFilterActive(f)) return 'แสดงทั้งหมด · hover pin เพื่อดูการ์ด';
  const parts: string[] = [];
  if (f.region !== 'all') parts.push(`ภาค ${f.region}`);
  if (f.categories.length) parts.push(`${f.categories.length} ประเภท`);
  if (f.seasons.length) parts.push(`${f.seasons.length} ฤดู`);
  if (f.maxDifficulty < 5) parts.push(`ความง่าย ≤${f.maxDifficulty}`);
  if (f.savedOnly) parts.push('เฉพาะที่บันทึก');
  return 'กรอง: ' + parts.join(' · ');
}

export function IndexClient({ destinations }: { destinations: Destination[] }) {
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [filterOpen, setFilterOpen] = useState(false);
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

  const previewDest =
    destinations.find((d) => d.slug === (activeSlug ?? hoverSlug)) ?? null;
  const featured = visible[0] ?? null;

  return (
    <div className="mx-auto max-w-[1280px]">
      {/* mobile toggle + filter button */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 lg:hidden">
        <div className="inline-flex rounded-md border border-line bg-white p-[3px]">
          {(['list', 'map'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setMobileView(v)}
              className={cn(
                'inline-flex cursor-pointer items-center gap-1 rounded-[7px] px-3 py-[6px] text-[13px] font-semibold transition-colors',
                mobileView === v ? 'bg-alp text-white' : 'text-ink-soft',
              )}
            >
              <Icon name={v === 'list' ? 'list-ul' : 'map'} size={15} />
              {v === 'list' ? 'รายการ' : 'แผนที่'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="inline-flex cursor-pointer items-center gap-[6px] rounded-md border border-line bg-white px-3 py-[7px] text-[13px] font-semibold text-ink-soft"
        >
          <Icon name="filter" size={15} /> ตัวกรอง
          {isFilterActive(filter) && <span className="h-2 w-2 rounded-full bg-koyo" />}
        </button>
      </div>

      {/* desktop layout */}
      <div className="grid lg:grid-cols-[1fr_360px]">
        {/* map column */}
        <div
          className={cn(
            'relative border-line lg:border-r',
            mobileView === 'map' ? 'block' : 'hidden lg:block',
          )}
        >
          {/* desktop filter bar */}
          <div className="sticky top-[60px] z-20 hidden border-b border-line bg-white/85 px-5 py-3 backdrop-blur-md lg:block">
            <FilterBar value={filter} onChange={setFilter} regions={regions} />
          </div>
          <div className="h-[60vh] min-h-[420px] lg:h-[calc(100vh-60px-92px)]">
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
        </div>

        {/* preview panel (desktop) / bottom area */}
        <aside className="hidden border-l border-line bg-paper-sunken lg:block lg:h-[calc(100vh-60px)] lg:sticky lg:top-[60px]">
          <PreviewPanel
            destination={previewDest}
            featured={featured}
            count={visible.length}
            filterSummary={summarize(filter)}
          />
        </aside>
      </div>

      {/* mobile list */}
      <div className={cn('px-4 pb-10', mobileView === 'list' ? 'block lg:hidden' : 'hidden')}>
        <p className="mb-3 mt-1 text-[13px] text-ink-soft">
          พบ <b className="tabnum text-alp">{visible.length}</b> ปลายทาง · {summarize(filter)}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
        {visible.length === 0 && (
          <div className="rounded-xl border border-dashed border-line py-12 text-center text-ink-soft">
            ไม่มีปลายทางตรงตัวกรอง
          </div>
        )}
      </div>

      {/* mobile bottom sheet: selected pin */}
      {mobileView === 'map' && activeSlug && previewDest && (
        <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
          <div className="mx-auto max-w-[640px] rounded-t-2xl border border-line bg-white p-4 shadow-pop">
            <button
              onClick={() => setActiveSlug(null)}
              className="mx-auto mb-2 block h-1 w-10 cursor-pointer rounded-full bg-line"
              aria-label="ปิด"
            />
            <DestinationCard destination={previewDest} variant="compact" />
          </div>
        </div>
      )}

      {/* mobile filter sheet */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal>
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
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
              ใช้ตัวกรอง ({visible.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
