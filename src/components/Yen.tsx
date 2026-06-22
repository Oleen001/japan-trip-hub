'use client';

import { fmtThb, fmtYen } from '@/lib/money';
import { cn } from '@/lib/cn';

/**
 * Mandatory wrapper for EVERY yen value on the site.
 * Renders ¥amount and reveals a ฿baht tooltip on hover/focus.
 * `title` is set too, so touch + screen readers always get the baht value.
 */
export function Yen({
  amount,
  className,
  bold = false,
}: {
  amount: number;
  className?: string;
  bold?: boolean;
}) {
  const baht = `≈ ฿${fmtThb(amount)}`;
  return (
    <span
      tabIndex={0}
      title={baht}
      className={cn(
        'group/yen relative inline-flex cursor-help items-center tabnum outline-none',
        bold && 'font-bold text-ink',
        className,
      )}
    >
      ¥{fmtYen(amount)}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-[7px] py-[3px] text-[11px] font-semibold text-white opacity-0 shadow-pop transition-opacity duration-150 group-hover/yen:opacity-100 group-focus/yen:opacity-100"
      >
        {baht}
      </span>
    </span>
  );
}
