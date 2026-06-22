'use client';

import Link from 'next/link';
import type { Destination } from '@/lib/types';
import { Icon } from './Icon';
import { SmartImage } from './SmartImage';
import { SaveButton } from './SaveButton';
import { DifficultyPips } from './DifficultyPips';
import { CategoryGlyph } from './CategoryGlyph';
import { CATEGORY_COLOR, CATEGORY_LABEL_TH, SEASON_LABEL_TH } from '@/lib/maps';
import { cn } from '@/lib/cn';

export function DestinationCard({
  destination,
  variant = 'full',
}: {
  destination: Destination;
  variant?: 'full' | 'compact';
}) {
  const cat = destination.category[0];
  const extraCats = destination.category.length - 1;
  const topSeason = destination.seasonTimeline?.[0]?.type;

  return (
    <Link
      href={`/d/${destination.slug}`}
      className={cn(
        'group block overflow-hidden rounded-xl border border-line bg-white shadow-card transition-[transform,box-shadow] duration-200',
        variant === 'full' && 'hover:-translate-y-[3px] hover:shadow-pop',
      )}
    >
      <div className="relative overflow-hidden">
        <SmartImage
          image={destination.heroImage}
          alt={destination.name.en}
          ratio="16 / 10"
          className="w-full transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute right-[10px] top-[10px]">
          <SaveButton slug={destination.slug} floating />
        </div>
        <div className="absolute inset-x-3 bottom-[10px] flex items-end justify-between gap-2">
          {cat && (
            <span
              className="inline-flex items-center gap-[5px] rounded-pill py-[3px] pl-[3px] pr-[10px] text-tag font-bold text-white shadow-pin"
              style={{ background: CATEGORY_COLOR[cat] }}
            >
              <CategoryGlyph cat={cat} size={13} plate /> {CATEGORY_LABEL_TH[cat]}
              {extraCats > 0 && <span className="opacity-80">+{extraCats}</span>}
            </span>
          )}
          <span className="inline-flex items-center gap-[6px] rounded-full bg-white px-[9px] py-[4px] shadow-pin">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">ง่าย</span>
            <DifficultyPips level={destination.difficultyFromTokyo} />
          </span>
        </div>
      </div>

      <div className="px-[18px] py-4">
        <div className="flex items-baseline gap-2">
          <h3 className="text-[16px] font-bold leading-tight text-ink">{destination.name.en}</h3>
          {destination.name.jp && (
            <span className="text-[13px] text-ink-soft">{destination.name.jp}</span>
          )}
        </div>
        <p
          className={cn(
            'mt-1 text-[13.5px] leading-[1.55] text-ink-soft',
            variant === 'compact' ? 'line-clamp-1' : 'line-clamp-2',
          )}
        >
          {destination.tagline_th}
        </p>
        <div className="mt-[10px] flex items-center gap-3 text-meta text-ink-soft">
          {topSeason && (
            <span className="inline-flex items-center gap-1">
              <Icon name="trees" size={13} style={{ color: 'var(--koyo)' }} />
              {SEASON_LABEL_TH[topSeason]}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Icon name="map-marker" size={13} /> {destination.region}
          </span>
        </div>
      </div>
    </Link>
  );
}
