'use client';

import { useState } from 'react';
import type { AccessOption } from '@/lib/types';
import { Icon } from '../Icon';
import { FlatIcon } from '../FlatIcon';
import { Yen } from '../Yen';
import { Tag } from '../primitives';
import { Modal } from '../Modal';
import { getLegs, computeBadges, BADGE_META, fmtDuration, iconForMode } from '@/lib/route';
import { cn } from '@/lib/cn';

/**
 * rome2rio-style route comparison. Each access option becomes a card with
 * superlative badges (fastest / cheapest / fewest transfers / recommended),
 * a transport-mode leg chain (🚄 → 🚌 → 🚡), and the duration as the hero metric.
 * Options carrying a `steps[]` breakdown open a step-by-step detail modal.
 */
export function RouteCompare({ options }: { options: AccessOption[] }) {
  const badges = computeBadges(options);
  const [active, setActive] = useState<AccessOption | null>(null);

  return (
    <>
      <ul className="flex flex-col gap-3">
        {options.map((opt, i) => {
          const legs = getLegs(opt);
          const recommended = badges[i].includes('recommended');
          const hasSteps = !!opt.steps && opt.steps.length > 0;
          return (
            <li
              key={i}
              className={cn(
                'rounded-lg border px-4 py-[14px] transition-colors',
                recommended ? 'border-koyo/45 bg-koyo-soft/40' : 'border-line bg-paper',
              )}
            >
              {badges[i].length > 0 && (
                <div className="mb-[10px] flex flex-wrap gap-[6px]">
                  {badges[i].map((b) => (
                    <Tag key={b} tone={BADGE_META[b].tone} icon={BADGE_META[b].icon}>
                      {BADGE_META[b].label_th}
                    </Tag>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-bold leading-snug text-ink">{opt.mode}</div>

                  {legs.length > 0 && (
                    <div className="mt-[10px] flex flex-wrap items-center gap-x-[3px] gap-y-[6px]">
                      {legs.map((leg, j) => (
                        <span key={j} className="flex items-center gap-[3px]">
                          {j > 0 && <Icon name="angle-right" size={13} className="text-ink-soft" />}
                          <span className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-[8px] py-[2px] text-[11.5px] font-semibold text-ink-soft">
                            <FlatIcon name={leg.icon} size={14} />
                            {leg.label_th}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-5">
                  <div className="text-right">
                    <div className="text-[18px] font-extrabold leading-none text-ink tabnum">
                      {fmtDuration(opt.durationMin)}
                    </div>
                    <div className="mt-[5px] text-[11px] text-ink-soft">ใช้เวลา</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[15px] leading-none">
                      <Yen amount={opt.costYen} bold />
                    </div>
                    <div className="mt-[5px] text-[11px] text-ink-soft">
                      {opt.transfers === 0 ? 'ไปตรง' : `${opt.transfers} ต่อ`}
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-[10px] text-[12.5px] leading-[1.6] text-ink-soft">{opt.detail_th}</p>

              {hasSteps && (
                <button
                  type="button"
                  onClick={() => setActive(opt)}
                  className="mt-3 inline-flex cursor-pointer items-center gap-[6px] rounded-full border border-alp/30 bg-alp-soft px-[13px] py-[6px] text-[12.5px] font-bold text-alp-dark transition-colors hover:bg-alp hover:text-white"
                >
                  <Icon name="route" size={15} />
                  ดูวิธีเดินทางทีละขั้น · ราคาต่อคน
                  <Icon name="angle-right" size={14} />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <Modal
        open={active != null}
        onClose={() => setActive(null)}
        maxWidth={580}
        title={active?.mode}
        subtitle={
          active && (
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <Icon name="clock" size={13} /> {fmtDuration(active.durationMin)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon name="exchange" size={13} />
                {active.transfers === 0 ? 'ไปตรง' : `${active.transfers} ต่อ`}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-ink">
                รวม <Yen amount={active.costYen} bold /> /คน
              </span>
            </span>
          )
        }
      >
        {active?.steps && <StepTimeline steps={active.steps} total={active.costYen} />}
      </Modal>
    </>
  );
}

function StepTimeline({
  steps,
  total,
}: {
  steps: NonNullable<AccessOption['steps']>;
  total: number;
}) {
  return (
    <div>
      <ol className="relative pl-[26px]">
        <span
          className="absolute bottom-[14px] left-[9px] top-[14px] w-[2px]"
          style={{ background: 'linear-gradient(180deg,var(--alp),var(--koyo) 55%,var(--alp))' }}
          aria-hidden
        />
        {steps.map((s, i) => (
          <li key={i} className="relative pb-[18px] last:pb-0">
            <span
              className="absolute left-[-26px] top-[2px] grid h-[20px] w-[20px] place-items-center rounded-full border-2 border-alp bg-white"
              aria-hidden
            >
              <FlatIcon name={iconForMode(s.mode)} size={13} />
            </span>

            <div className="flex items-baseline justify-between gap-3">
              <div className="text-[13.5px] font-bold leading-snug text-ink">{s.line_th}</div>
              <div className="flex flex-none items-center gap-2 text-[12px] text-ink-soft tabnum">
                <span className="inline-flex items-center gap-1">
                  <Icon name="clock" size={12} /> {fmtDuration(s.durationMin)}
                </span>
                {s.costYen > 0 ? (
                  <span className="font-semibold text-ink">
                    <Yen amount={s.costYen} />
                  </span>
                ) : (
                  <span className="text-ink-soft">รวมแล้ว</span>
                )}
              </div>
            </div>

            <div className="mt-[3px] flex items-center gap-[6px] text-[12px] text-ink-soft">
              <span className="font-medium">{s.from}</span>
              <Icon name="arrow-right" size={12} className="text-alp" />
              <span className="font-medium">{s.to}</span>
            </div>

            {s.note_th && (
              <p className="mt-[5px] text-[11.5px] leading-[1.55] text-ink-soft">{s.note_th}</p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-2 flex items-center justify-between rounded-lg bg-paper-sunken px-4 py-3">
        <span className="text-[13px] font-bold text-ink">รวมทั้งหมด · ต่อคน</span>
        <span className="text-[16px] font-extrabold text-ink">
          <Yen amount={total} bold />
        </span>
      </div>
      <p className="mt-[10px] text-[11px] leading-[1.5] text-ink-soft">
        ราคาผู้ใหญ่ปกติ · เรท 0.23 THB/JPY · เวลาไม่รวมเวลารอต่อรถ — ตรวจสอบอีกครั้งก่อนจอง
      </p>
    </div>
  );
}
