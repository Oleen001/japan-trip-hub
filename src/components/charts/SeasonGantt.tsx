'use client';

import { useState, useRef, useEffect } from 'react';
import type { SeasonTimelineItem, SeasonType } from '@/lib/types';
import { SEASON_COLOR, SEASON_LABEL_TH } from '@/lib/maps';
import { Icon } from '../Icon';
import { cn } from '@/lib/cn';

const MONTH_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const MONTH_TH_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

/** turn a 0..1 year fraction into a "ปลาย ก.ย." style label */
function fracToMonthLabel(frac: number, kind: 'start' | 'end'): string {
  const pos = frac * 12;
  const monthIdx = Math.min(11, Math.floor(pos));
  const within = pos - monthIdx; // 0..1 within the month
  let qualifier = '';
  if (within < 0.34) qualifier = 'ต้น';
  else if (within < 0.67) qualifier = 'กลาง';
  else qualifier = 'ปลาย';
  // for an end boundary that lands right at a month start, read it as end of previous month
  if (kind === 'end' && within < 0.12 && monthIdx > 0) {
    return `ต้น ${MONTH_TH[monthIdx]}`;
  }
  return `${qualifier} ${MONTH_TH[monthIdx]}`;
}

function rangeLabel(row: SeasonTimelineItem): string {
  return `${fracToMonthLabel(row.startFrac, 'start')} – ${fracToMonthLabel(row.endFrac, 'end')}`;
}

/**
 * Season Gantt over a full-year axis (Jan..Dec). startFrac/endFrac are 0..1 of
 * the year. Each zone gets its own row: a header line (zone name + season chip +
 * month range) above a solid colour bar on the shared year track. Bars carry no
 * inline text (so nothing wraps); hover (desktop) / tap (mobile) opens a popover
 * with the note. An accessible table fallback mirrors the data for screen readers.
 */
export function SeasonGantt({
  timeline,
  tripRange,
}: {
  timeline: SeasonTimelineItem[];
  tripRange?: { startFrac: number; endFrac: number; label: string };
}) {
  const ticks = Array.from({ length: 13 }, (_, i) => i); // 0..12, monthly grid
  const [active, setActive] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // distinct season types present, in a stable order, for the legend
  const order: SeasonType[] = ['bloom', 'green', 'koyo', 'event', 'snow'];
  const present = order.filter((t) => timeline.some((row) => row.type === t));

  // dismiss popover on outside click / Escape (mobile tap UX)
  useEffect(() => {
    if (active == null) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setActive(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  return (
    <div ref={rootRef}>
      {/* legend */}
      <div className="mb-[14px] flex flex-wrap items-center gap-x-[14px] gap-y-[6px]">
        {present.map((t) => (
          <span key={t} className="inline-flex items-center gap-[6px] text-[12px] font-semibold text-ink-soft">
            <i className="h-[10px] w-[10px] flex-none rounded-full" style={{ background: SEASON_COLOR[t] }} aria-hidden />
            {SEASON_LABEL_TH[t]}
          </span>
        ))}
        {tripRange && (
          <span className="inline-flex items-center gap-[6px] text-[12px] font-semibold text-ok">
            <i className="h-[12px] w-[3px] flex-none rounded-full border-x border-dashed border-ok bg-ok/20" aria-hidden />
            {tripRange.label}
          </span>
        )}
      </div>

      {/* month axis */}
      <div className="relative mb-[2px] h-[16px]" aria-hidden>
        {ticks.map((m) => {
          // show every month on sm+, every 2nd month on mobile to avoid crowding
          const hideOnMobile = m % 2 !== 0;
          if (m === 12) return null;
          return (
            <span
              key={m}
              className={cn(
                'absolute bottom-0 text-[10px] font-medium text-ink-faint tabnum',
                hideOnMobile && 'hidden sm:inline',
              )}
              style={{ left: `calc(${(m / 12) * 100}% + ${(1 / 12 / 2) * 100}%)`, transform: 'translateX(-50%)' }}
            >
              {MONTH_TH[m]}
            </span>
          );
        })}
      </div>

      {/* track stack */}
      <div className="relative">
        {/* grid lines (every month) */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          {ticks.map((m) => (
            <i
              key={m}
              className={cn(
                'absolute top-0 bottom-0 w-px',
                m === 0 || m === 12 ? 'bg-line' : 'bg-line/55',
              )}
              style={{ left: `${(m / 12) * 100}%` }}
            />
          ))}
        </div>

        {/* trip overlay band */}
        {tripRange && (
          <div
            className="pointer-events-none absolute top-0 bottom-0 z-[1] rounded-[3px] border-x-[1.5px] border-dashed border-ok"
            style={{
              left: `${tripRange.startFrac * 100}%`,
              width: `${(tripRange.endFrac - tripRange.startFrac) * 100}%`,
              background: 'rgba(47,125,82,.08)',
            }}
            aria-hidden
          />
        )}

        {/* rows */}
        <ul className="relative z-[2] flex flex-col">
          {timeline.map((row, i) => {
            const left = row.startFrac * 100;
            const width = (row.endFrac - row.startFrac) * 100;
            const isActive = active === i;
            // popover anchors to bar centre; flip side near edges so it stays in view
            const centre = left + width / 2;
            const popAlign = centre < 28 ? 'left' : centre > 72 ? 'right' : 'center';
            return (
              <li
                key={i}
                className="border-b border-dashed border-line/70 py-[10px] first:pt-[6px] last:border-none last:pb-[2px]"
              >
                {/* header line: zone + season chip + month range */}
                <div className="mb-[7px] flex flex-wrap items-center gap-x-[8px] gap-y-[3px]">
                  <span className="text-[12.5px] font-bold leading-tight text-ink">{row.zone}</span>
                  <span
                    className="inline-flex flex-none items-center gap-[4px] whitespace-nowrap rounded-full px-[7px] py-[1px] text-[10.5px] font-bold text-white"
                    style={{ background: SEASON_COLOR[row.type] }}
                  >
                    {SEASON_LABEL_TH[row.type]}
                  </span>
                  <span className="whitespace-nowrap text-[11px] font-medium text-ink-faint tabnum">{rangeLabel(row)}</span>
                </div>

                {/* bar track */}
                <div className="relative h-[14px]">
                  <button
                    type="button"
                    onClick={() => setActive((prev) => (prev === i ? null : i))}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive((prev) => (prev === i ? null : prev))}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive((prev) => (prev === i ? null : prev))}
                    aria-label={`${row.zone} — ${SEASON_LABEL_TH[row.type]} ${rangeLabel(row)}`}
                    aria-expanded={isActive}
                    className={cn(
                      'group absolute top-1/2 z-[2] flex h-[14px] -translate-y-1/2 cursor-pointer items-center rounded-full',
                      'shadow-card outline-none transition-[filter,box-shadow] duration-150 ease-out',
                      'hover:brightness-105 focus-visible:ring-2 focus-visible:ring-alp/70 focus-visible:ring-offset-1',
                      isActive && 'brightness-105',
                    )}
                    style={{
                      left: `${left}%`,
                      width: `max(${width}%, 14px)`,
                      background: SEASON_COLOR[row.type],
                      boxShadow: isActive
                        ? `0 0 0 4px ${SEASON_COLOR[row.type]}33, var(--sh-card)`
                        : undefined,
                    }}
                  >
                    {/* end-cap dots for a crafted bar look */}
                    <span className="pointer-events-none ml-[3px] h-[6px] w-[6px] rounded-full bg-white/55" aria-hidden />
                  </button>

                  {/* popover — outer div positions; inner div animates (so the
                      entrance transform doesn't fight the centring translate) */}
                  {isActive && (
                    <div
                      className="pointer-events-none absolute bottom-[calc(100%+10px)] z-[20]"
                      style={
                        popAlign === 'center'
                          ? { left: `${centre}%` }
                          : popAlign === 'left'
                            ? { left: `${left}%` }
                            : { right: `${100 - (left + width)}%` }
                      }
                    >
                      <div
                        role="tooltip"
                        className={cn(
                          'pointer-events-auto relative w-[200px] max-w-[78vw] rounded-lg border border-line bg-white p-[12px] text-left shadow-pop',
                          'motion-safe:animate-[gantt-pop_.16s_ease-out]',
                          popAlign === 'center' && 'ml-[-100px]',
                        )}
                      >
                        <div className="mb-[6px] flex items-center gap-[6px]">
                          <i
                            className="h-[9px] w-[9px] flex-none rounded-full"
                            style={{ background: SEASON_COLOR[row.type] }}
                            aria-hidden
                          />
                          <span className="text-[12.5px] font-bold leading-tight text-ink">{row.zone}</span>
                        </div>
                        <div className="mb-[6px] flex flex-wrap items-center gap-x-[6px] gap-y-[4px] text-[11.5px] font-semibold text-ink-soft">
                          <span
                            className="inline-flex flex-none items-center whitespace-nowrap rounded-full px-[6px] py-px text-[10px] font-bold text-white"
                            style={{ background: SEASON_COLOR[row.type] }}
                          >
                            {SEASON_LABEL_TH[row.type]}
                          </span>
                          <span className="inline-flex items-center gap-[3px] whitespace-nowrap tabnum">
                            <Icon name="calendar-alt" size={12} className="text-ink-faint" />
                            {rangeLabel(row)}
                          </span>
                        </div>
                        <p className="text-[11.5px] leading-[1.55] text-ink-soft">{row.note_th}</p>
                        {/* arrow */}
                        <span
                          className={cn(
                            'absolute top-full h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-b border-r border-line bg-white',
                            popAlign === 'left' && 'left-[18px]',
                            popAlign === 'right' && 'right-[18px]',
                            popAlign === 'center' && 'left-1/2',
                          )}
                          aria-hidden
                        />
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* hint */}
      <p className="mt-[10px] flex items-center gap-[5px] text-[11px] text-ink-faint">
        <Icon name="info-circle" size={13} />
        แตะแถบเพื่อดูรายละเอียดแต่ละช่วง
      </p>

      {/* a11y table fallback (visually hidden) — wrapped in a div so the sr-only
          clip actually contains it (a table escapes sr-only on its own and
          forces horizontal overflow on mobile) */}
      <div className="sr-only">
        <table>
          <caption>ช่วงเวลาแต่ละฤดูในรอบปี</caption>
          <thead>
            <tr>
              <th>โซน</th>
              <th>ประเภท</th>
              <th>ช่วง</th>
              <th>หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((row, i) => (
              <tr key={i}>
                <td>{row.zone}</td>
                <td>{SEASON_LABEL_TH[row.type]}</td>
                <td>
                  {MONTH_TH_FULL[Math.floor(row.startFrac * 12) % 12]}–
                  {MONTH_TH_FULL[Math.min(11, Math.floor(row.endFrac * 12))]}
                </td>
                <td>{row.note_th}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
