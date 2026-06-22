'use client';

import type { Category, SeasonType } from '@/lib/types';
import type { FilterState } from '@/lib/filter';
import { Icon } from './Icon';
import { CategoryGlyph } from './CategoryGlyph';
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL_TH,
  SEASON_COLOR,
  SEASON_LABEL_TH,
} from '@/lib/maps';
import { cn } from '@/lib/cn';

const ALL_CATEGORIES: Category[] = ['mountain', 'onsen', 'shrine', 'coast', 'city', 'nature', 'lake'];
const ALL_SEASONS: SeasonType[] = ['bloom', 'green', 'koyo', 'snow'];

export function FilterBar({
  value,
  onChange,
  regions,
  className,
  layout = 'bar',
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  regions: string[];
  className?: string;
  layout?: 'bar' | 'sheet';
}) {
  const toggleSeason = (s: SeasonType) =>
    onChange({
      ...value,
      seasons: value.seasons.includes(s)
        ? value.seasons.filter((x) => x !== s)
        : [...value.seasons, s],
    });

  const toggleCat = (c: Category) =>
    onChange({
      ...value,
      categories: value.categories.includes(c)
        ? value.categories.filter((x) => x !== c)
        : [...value.categories, c],
    });

  return (
    <div className={cn('flex flex-col gap-[14px]', className)}>
      {/* region */}
      <div className={cn('flex flex-wrap items-center gap-3', layout === 'sheet' && 'flex-col items-stretch')}>
        <label className="flex items-center gap-2 text-[13px] font-semibold text-ink-soft">
          ภาค
          <select
            value={value.region}
            onChange={(e) => onChange({ ...value, region: e.target.value })}
            className="cursor-pointer rounded-md border border-line bg-white px-3 py-[7px] text-[13px] font-medium text-ink outline-none focus:border-alp"
          >
            <option value="all">ทั้งหมด</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* season chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold text-ink-soft">ฤดู</span>
        {ALL_SEASONS.map((s) => {
          const active = value.seasons.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggleSeason(s)}
              aria-pressed={active}
              className="inline-flex h-[30px] cursor-pointer items-center gap-1 rounded-full border px-[12px] text-[12.5px] font-semibold transition-colors duration-150"
              style={
                active
                  ? { background: SEASON_COLOR[s], color: '#fff', borderColor: SEASON_COLOR[s] }
                  : { background: 'transparent', color: 'var(--ink-soft)', borderColor: 'var(--line-strong)' }
              }
            >
              {SEASON_LABEL_TH[s]}
            </button>
          );
        })}
      </div>

      {/* category chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold text-ink-soft">ประเภท</span>
        {ALL_CATEGORIES.map((c) => {
          const active = value.categories.includes(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => toggleCat(c)}
              aria-pressed={active}
              className="inline-flex h-[34px] cursor-pointer items-center gap-[6px] rounded-full border px-[14px] text-[13px] font-semibold transition-colors duration-150"
              style={
                active
                  ? { background: CATEGORY_COLOR[c], color: '#fff', borderColor: CATEGORY_COLOR[c] }
                  : { background: 'var(--paper)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }
              }
            >
              <CategoryGlyph cat={c} size={active ? 15 : 17} plate={active} />
              {CATEGORY_LABEL_TH[c]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
