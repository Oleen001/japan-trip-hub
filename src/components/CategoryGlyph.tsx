import type { Category } from '@/lib/types';
import { cn } from '@/lib/cn';

/**
 * Category illustration glyph (src in /public/cat/<category>.svg). The art is
 * full-colour flat illustration meant for light backgrounds, so on a coloured
 * surface (e.g. a category-tinted chip) pass `plate` to sit it on a white disc
 * — keeps it legible without per-category tweaks.
 */
export function CategoryGlyph({
  cat,
  size = 18,
  plate = false,
  className,
}: {
  cat: Category;
  size?: number;
  plate?: boolean;
  className?: string;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  const img = (
    <img
      src={`/cat/${cat}.svg`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      draggable={false}
      aria-hidden
      className={cn('object-contain', className)}
    />
  );

  if (!plate) return img;

  const box = Math.round(size * 1.34);
  return (
    <span
      className={cn('inline-grid flex-none place-items-center rounded-full bg-white', className)}
      style={{ width: box, height: box }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/cat/${cat}.svg`}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        draggable={false}
        aria-hidden
        className="object-contain"
      />
    </span>
  );
}
