import type { Category, Destination, SeasonType } from './types';

export type FilterState = {
  region: string | 'all';
  seasons: SeasonType[];
  categories: Category[];
  savedOnly: boolean;
};

export const DEFAULT_FILTER: FilterState = {
  region: 'all',
  seasons: [],
  categories: [],
  savedOnly: false,
};

function seasonTypes(d: Destination): SeasonType[] {
  return (d.seasonTimeline ?? []).map((s) => s.type);
}

export function matchesFilter(
  d: Destination,
  f: FilterState,
  savedSlugs: string[],
): boolean {
  if (f.region !== 'all' && d.region !== f.region) return false;
  if (f.categories.length > 0 && !f.categories.some((c) => d.category.includes(c))) return false;
  if (f.seasons.length > 0) {
    const types = seasonTypes(d);
    if (!f.seasons.some((s) => types.includes(s))) return false;
  }
  if (f.savedOnly && !savedSlugs.includes(d.slug)) return false;
  return true;
}

export function isFilterActive(f: FilterState): boolean {
  return (
    f.region !== 'all' ||
    f.seasons.length > 0 ||
    f.categories.length > 0 ||
    f.savedOnly
  );
}
