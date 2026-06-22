'use client';

import { useState } from 'react';
import type { BudgetItem } from '@/lib/types';
import { DONUT_PALETTE } from '@/lib/maps';
import { Yen } from '../Yen';

const R = 70;
const CIRC = 2 * Math.PI * R; // ~439.82

function fmtYen(n: number) {
  return '¥' + n.toLocaleString('en-US');
}
function fmtThb(n: number) {
  return '~' + n.toLocaleString('en-US') + ' ฿';
}

export function BudgetDonut({
  items,
  totalYen,
  totalThb,
}: {
  items: BudgetItem[];
  totalYen: number;
  totalThb: number;
}) {
  const [active, setActive] = useState<number | null>(null);

  // sort desc by yen for cleaner segments, keep mapping to color by order
  const ordered = [...items].sort((a, b) => b.yen - a.yen);
  const sum = ordered.reduce((s, it) => s + it.yen, 0) || totalYen || 1;

  let offset = 0;
  const segments = ordered.map((it, i) => {
    const frac = it.yen / sum;
    const dash = frac * CIRC;
    const seg = {
      item: it,
      color: DONUT_PALETTE[i % DONUT_PALETTE.length],
      dasharray: `${dash.toFixed(2)} ${(CIRC - dash).toFixed(2)}`,
      dashoffset: -offset,
      pct: Math.round(frac * 100),
    };
    offset += dash;
    return seg;
  });

  const center =
    active != null
      ? {
          t: segments[active].item.label_th,
          v: fmtYen(segments[active].item.yen),
          v2: `${segments[active].pct}% · ${fmtThb(segments[active].item.thb)}`,
          small: true,
        }
      : { t: 'รวม/คน', v: fmtYen(totalYen), v2: fmtThb(totalThb), small: false };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-[26px]">
      <div className="relative mx-auto h-[180px] w-[180px] flex-none sm:mx-0">
        <svg viewBox="0 0 180 180" width={180} height={180} role="img" aria-label="สัดส่วนงบประมาณ">
          <circle cx={90} cy={90} r={R} fill="none" stroke="var(--line)" strokeWidth={22} />
          <g transform="rotate(-90 90 90)" fill="none" strokeWidth={22}>
            {segments.map((s, i) => (
              <circle
                key={i}
                cx={90}
                cy={90}
                r={R}
                stroke={s.color}
                strokeDasharray={s.dasharray}
                strokeDashoffset={s.dashoffset}
                className="cursor-pointer transition-[stroke-width,opacity] duration-150"
                style={{
                  opacity: active == null ? 1 : active === i ? 1 : 0.3,
                  strokeWidth: active === i ? 27 : 22,
                }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              />
            ))}
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] tracking-wide text-ink-soft">{center.t}</span>
          <span
            className="font-extrabold leading-tight tabnum"
            style={{ fontSize: center.small ? 17 : 22 }}
          >
            {center.v}
          </span>
          <span className="text-[12px] font-bold text-alp tabnum">{center.v2}</span>
        </div>
      </div>

      <ul className="flex min-w-[240px] flex-1 flex-col gap-[7px]">
        {segments.map((s, i) => (
          <li
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className="-mx-[6px] flex cursor-pointer items-center gap-[10px] rounded-sm px-[6px] py-[3px] text-[13px] transition-colors duration-150 hover:bg-alp-soft"
            style={{ opacity: active == null || active === i ? 1 : 0.45 }}
          >
            <span className="h-3 w-3 flex-none rounded-[3px]" style={{ background: s.color }} />
            <span className="flex-1">{s.item.label_th}</span>
            <Yen amount={s.item.yen} bold className="whitespace-nowrap" />
            <span className="w-10 text-right text-[11.5px] text-ink-soft tabnum">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
