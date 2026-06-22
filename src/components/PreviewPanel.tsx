'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Destination } from '@/lib/types';
import { DestinationCard } from './DestinationCard';
import { Icon } from './Icon';

export function PreviewPanel({
  destination,
  featured,
  count,
  filterSummary,
}: {
  destination: Destination | null;
  featured: Destination | null;
  count: number;
  filterSummary: string;
}) {
  const show = destination ?? featured;

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 border-b border-line bg-white/90 px-5 py-4 backdrop-blur">
        <div className="text-[15px] font-extrabold text-ink">
          พบ <span className="tabnum text-alp">{count}</span> ปลายทาง
        </div>
        <p className="mt-px text-[12.5px] leading-[1.5] text-ink-soft">{filterSummary}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={show?.slug ?? 'empty'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            {show ? (
              <>
                {!destination && (
                  <div className="mb-2 flex items-center gap-[6px] text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                    <Icon name="star" size={13} style={{ color: 'var(--gold)' }} /> แนะนำ
                  </div>
                )}
                <DestinationCard destination={show} variant="compact" />
                <Link
                  href={`/d/${show.slug}`}
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1 rounded-md bg-alp px-4 py-[10px] text-[14px] font-bold text-white transition-colors duration-150 hover:bg-alp-700"
                >
                  ดูรายละเอียด <Icon name="angle-right" size={16} />
                </Link>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line py-12 text-center text-ink-soft">
                <Icon name="map-marker" size={32} />
                <p className="mt-2 text-[13px]">ไม่มีปลายทางตรงตัวกรอง</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
