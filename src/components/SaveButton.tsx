'use client';

import { Icon } from './Icon';
import { useSaved } from '@/lib/useSaved';
import { cn } from '@/lib/cn';

export function SaveButton({
  slug,
  className,
  floating = false,
}: {
  slug: string;
  className?: string;
  floating?: boolean;
}) {
  const { isSaved, toggle, hydrated } = useSaved();
  const saved = hydrated && isSaved(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={saved ? 'เอาออกจากที่บันทึกไว้' : 'บันทึกไว้'}
      className={cn(
        'inline-grid h-9 w-9 cursor-pointer place-items-center rounded-full transition-colors duration-150',
        floating
          ? 'bg-white/85 text-ink shadow-pin backdrop-blur hover:bg-white'
          : 'border border-line bg-white text-ink-soft hover:bg-paper-sunken',
        saved && 'text-gold',
        className,
      )}
    >
      <Icon name={saved ? 'star' : 'star'} size={18} style={saved ? { color: 'var(--gold)' } : undefined} />
    </button>
  );
}
