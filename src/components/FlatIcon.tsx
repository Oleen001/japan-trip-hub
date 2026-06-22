import { Icon } from './Icon';
import { cn } from '@/lib/cn';

/**
 * Renders a hillvector flat (multicolor) illustration when one is vendored for
 * the given name (see /public/flat), otherwise falls back to the Phosphor
 * Icon. Use for object/place/transport glyphs that sit on a light surface —
 * flat art is full-colour and can't be recoloured, so don't use it on tinted
 * chips/pins or for UI controls (those stay on Icon/Phosphor).
 */
const FLAT = new Set([
  // transport modes
  'plane', 'bus', 'train', 'subway', 'cable-car', 'ship', 'car', 'walking',
  // POI / object glyphs
  'camera', 'compass', 'fire', 'water', 'location-point', 'map-marker',
  'building', 'mountains', 'mountains-sun', 'trees', 'raindrops-alt',
]);

export function FlatIcon({
  name,
  size = 18,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (FLAT.has(name)) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={`/flat/${name}.svg`}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        draggable={false}
        aria-hidden
        className={cn('inline-block flex-none object-contain', className)}
      />
    );
  }
  return <Icon name={name} size={size} className={className} style={style} />;
}
