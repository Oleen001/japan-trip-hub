import { Icon as Iconify } from '@iconify/react';

type IconProps = {
  name: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Site-wide icon — Phosphor *duotone* (filled, two-tone: solid primary +
 * low-opacity secondary, matching the favicon's flat-duotone look).
 *
 * Call sites still pass the original Unicons (uil) names; this map translates
 * them to the Phosphor equivalent. Names already in Phosphor form pass through.
 * Keep in sync with icon names used across the app + lib/maps + lib/route.
 */
const UIL_TO_PH: Record<string, string> = {
  'angle-double-right': 'caret-double-right',
  'angle-left': 'caret-left',
  'angle-right': 'caret-right',
  'arrow-right': 'arrow-right',
  'check-circle': 'check-circle',
  clock: 'clock',
  directions: 'signpost',
  exchange: 'arrows-left-right',
  'external-link-alt': 'arrow-square-out',
  filter: 'funnel',
  'focus-target': 'crosshair',
  map: 'map-trifold',
  'map-marker': 'map-pin',
  minus: 'minus',
  mountains: 'mountains',
  plus: 'plus',
  route: 'path',
  star: 'star',
  subway: 'train-simple',
  times: 'x',
  trees: 'tree',
  yen: 'currency-jpy',
  // category / map-pin glyphs
  'raindrops-alt': 'drop',
  tint: 'drop',
  building: 'buildings',
  water: 'waves',
  // route badges
  'bolt-alt': 'lightning',
  'tag-alt': 'tag',
  'sign-alt': 'arrows-merge',
  // tile heads + misc
  'dollar-alt': 'coins',
  receipt: 'receipt',
  'exclamation-triangle': 'warning',
  ticket: 'ticket',
  'info-circle': 'info',
  'list-ul': 'list-bullets',
  restaurant: 'fork-knife',
  'calendar-alt': 'calendar',
  // transport leg modes
  plane: 'airplane',
  'cable-car': 'cable-car',
  ship: 'boat',
  bus: 'bus',
  walking: 'person-simple-walk',
  car: 'car',
};

/** Phosphor duotone wrapper. `name` accepts legacy uil ids (mapped) or ph ids. */
export function Icon({ name, size = '1em', className, style }: IconProps) {
  const ph = UIL_TO_PH[name] ?? name;
  return (
    <Iconify
      icon={`ph:${ph}-duotone`}
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
    />
  );
}
