'use client';

import { useMemo, useState } from 'react';
import type { Destination } from '@/lib/types';
import { DEFAULT_FILTER, matchesFilter, type FilterState } from '@/lib/filter';
import { useSaved } from '@/lib/useSaved';
import { FilterBar } from './FilterBar';
import { DestinationCard } from './DestinationCard';
import { Icon } from './Icon';

export function ListClient({
  destinations,
  savedOnly = false,
}: {
  destinations: Destination[];
  savedOnly?: boolean;
}) {
  const [filter, setFilter] = useState<FilterState>({ ...DEFAULT_FILTER, savedOnly });
  const { saved } = useSaved();

  const regions = useMemo(
    () => Array.from(new Set(destinations.map((d) => d.region))).sort(),
    [destinations],
  );

  const visible = useMemo(
    () => destinations.filter((d) => matchesFilter(d, filter, saved)),
    [destinations, filter, saved],
  );

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h1 className="text-h2 text-ink">{savedOnly ? 'ที่บันทึกไว้' : 'ปลายทางทั้งหมด'}</h1>
        <span className="text-[13px] text-ink-soft">
          พบ <b className="tabnum text-alp">{visible.length}</b> ที่
        </span>
      </div>

      <div className="mb-6 rounded-xl border border-line bg-white px-5 py-4 shadow-card">
        <FilterBar value={filter} onChange={setFilter} regions={regions} />
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line py-16 text-center text-ink-faint">
          <Icon name={savedOnly ? 'star' : 'map-marker'} size={36} />
          <p className="mt-3 text-[14px]">
            {savedOnly ? 'ยังไม่มีปลายทางที่บันทึกไว้ — กดดาวบนการ์ดเพื่อบันทึก' : 'ไม่มีปลายทางตรงตัวกรอง'}
          </p>
        </div>
      )}
    </div>
  );
}
