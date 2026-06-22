'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Destination, AccessOption } from '@/lib/types';
import { RouteCompare } from './detail/RouteCompare';
import { getLegs, computeBadges, fmtDuration } from '@/lib/route';
import { Yen } from './Yen';
import { Icon } from './Icon';
import { DifficultyPips } from './DifficultyPips';
import { useSaved } from '@/lib/useSaved';
import { cn } from '@/lib/cn';

const JapanMap = dynamic(() => import('./map/JapanMap').then((m) => m.JapanMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-ink-faint">กำลังโหลดแผนที่…</div>
  ),
});

/** best representative option for the summary list: recommended → fastest → first */
function bestOption(d: Destination): AccessOption {
  const opts = d.access.options;
  const badges = computeBadges(opts);
  const rec = opts.findIndex((_, i) => badges[i].includes('recommended'));
  if (rec >= 0) return opts[rec];
  let fastest = 0;
  opts.forEach((o, i) => {
    if (o.durationMin < opts[fastest].durationMin) fastest = i;
  });
  return opts[fastest] ?? opts[0];
}

export function RouteClient({ destinations }: { destinations: Destination[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const { saved } = useSaved();

  const allSlugs = useMemo(() => new Set(destinations.map((d) => d.slug)), [destinations]);
  const selected = destinations.find((d) => d.slug === activeSlug) ?? null;

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="px-4 pt-5 sm:px-6">
        <h1 className="flex items-center gap-2 text-[22px] font-extrabold tracking-[-.01em] text-ink">
          <Icon name="directions" size={24} style={{ color: 'var(--alp)' }} />
          เส้นทางจากโตเกียว
        </h1>
        <p className="mt-1 text-[13px] text-ink-soft">
          เลือกปลายทางบนแผนที่ หรือในรายการ เพื่อเทียบทุกวิธีเดินทาง — เวลา · ค่าใช้จ่าย · จำนวนต่อ
        </p>
      </div>

      <div className="mt-4 grid lg:grid-cols-[1fr_440px]">
        {/* map */}
        <div className="relative hidden border-line lg:block lg:border-r">
          <div className="lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)]">
            <JapanMap
              destinations={destinations}
              activeSlug={activeSlug}
              hoverSlug={hoverSlug}
              visibleSlugs={allSlugs}
              savedSlugs={saved}
              onHoverPin={setHoverSlug}
              onSelectPin={(slug) => setActiveSlug((cur) => (cur === slug ? null : slug))}
            />
          </div>
        </div>

        {/* route panel */}
        <aside className="border-line px-4 pb-16 sm:px-5 lg:border-l lg:bg-paper-sunken">
          {selected ? (
            <div className="py-5">
              <button
                onClick={() => setActiveSlug(null)}
                className="mb-3 inline-flex cursor-pointer items-center gap-1 text-[13px] font-semibold text-alp hover:text-alp-700"
              >
                <Icon name="angle-left" size={16} /> ทุกปลายทาง
              </button>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-extrabold text-ink">
                    {selected.name.th}
                    {selected.name.jp && (
                      <span className="ml-2 text-[13px] font-medium text-ink-soft">{selected.name.jp}</span>
                    )}
                  </h2>
                  <p className="text-[12.5px] text-ink-soft">
                    {selected.region} · {selected.prefecture}
                  </p>
                </div>
                <span className="inline-flex flex-none items-center gap-[6px] rounded-full bg-white px-[9px] py-[4px] shadow-pin">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">ง่าย</span>
                  <DifficultyPips level={selected.difficultyFromTokyo} />
                </span>
              </div>

              <p className="mt-3 text-[13px] leading-[1.6] text-ink-soft">{selected.access.summary_th}</p>

              <div className="mt-4">
                <RouteCompare options={selected.access.options} />
              </div>

              <Link
                href={`/d/${selected.slug}`}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1 rounded-md bg-alp px-4 py-[11px] text-[14px] font-bold text-white transition-colors duration-150 hover:bg-alp-700"
              >
                ดูรายละเอียดเต็ม <Icon name="angle-right" size={16} />
              </Link>
            </div>
          ) : (
            <div className="py-5">
              <p className="mb-3 text-[13px] font-semibold text-ink-soft">
                {destinations.length} ปลายทาง · เรียงตามความง่าย
              </p>
              <ul className="flex flex-col gap-[10px]">
                {destinations.map((d) => {
                  const best = bestOption(d);
                  const legs = getLegs(best);
                  return (
                    <li key={d.slug}>
                      <button
                        onClick={() => setActiveSlug(d.slug)}
                        onMouseEnter={() => setHoverSlug(d.slug)}
                        onMouseLeave={() => setHoverSlug(null)}
                        className="w-full cursor-pointer rounded-lg border border-line bg-white px-4 py-[13px] text-left shadow-card transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-pop"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-[14.5px] font-bold text-ink">
                              {d.name.th}
                              <span className="ml-1 text-[12px] font-normal text-ink-soft">
                                {d.name.en}
                              </span>
                            </div>
                            {legs.length > 0 && (
                              <div className="mt-[6px] flex flex-wrap items-center gap-[2px] text-ink-faint">
                                {legs.map((leg, j) => (
                                  <span key={j} className="flex items-center gap-[2px]">
                                    {j > 0 && <Icon name="angle-right" size={11} />}
                                    <Icon name={leg.icon} size={14} style={{ color: 'var(--alp)' }} />
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-none items-center gap-3 text-right">
                            <div>
                              <div className="text-[15px] font-extrabold leading-none text-ink tabnum">
                                {fmtDuration(best.durationMin)}
                              </div>
                              <div className="mt-1 text-[11px] leading-none">
                                <Yen amount={best.costYen} />
                              </div>
                            </div>
                            <Icon name="angle-right" size={18} className="text-ink-faint" />
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
