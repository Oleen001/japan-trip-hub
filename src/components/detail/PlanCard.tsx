import type { Plan, PlanStep } from '@/lib/types';
import { Card, Tag, MiniHead } from '../primitives';
import { Icon } from '../Icon';
import { FlatIcon } from '../FlatIcon';
import { iconForMode, fmtDuration } from '@/lib/route';

/** fallback: split a "A → B → C" description into rough steps when no structured data */
function parseSteps(detail: string): PlanStep[] {
  return detail
    .split(/→|➜|->/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => {
      const mode = iconForMode(text);
      return { title_th: text, mode: mode === 'angle-double-right' ? undefined : mode };
    });
}

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Card>
      <MiniHead icon={plan.recommended ? 'star' : 'angle-double-right'}>
        {plan.label_th}
        {plan.recommended && (
          <Tag tone="ok" className="ml-1">
            แนะนำ
          </Tag>
        )}
      </MiniHead>
      {plan.days.map((day, i) => {
        const steps = day.steps && day.steps.length ? day.steps : parseSteps(day.detail_th);
        const structured = !!(day.steps && day.steps.length);
        return (
          <div
            key={i}
            className="flex gap-4 border-b border-line py-[18px] last:border-none last:pb-0"
          >
            <div className="w-[44px] flex-none text-center">
              <div className="text-[24px] font-extrabold leading-none text-alp">{i + 1}</div>
              <div className="text-[10px] uppercase tracking-[.08em] text-ink-soft">Day</div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="mb-[14px] flex items-center gap-2 text-[15px] font-bold">
                <Icon name="map-marker" size={18} style={{ color: 'var(--alp)' }} />
                {day.title_th}
              </h4>

              {steps.length > 1 ? (
                <ol className="relative pl-[26px]">
                  <span
                    className="absolute bottom-[10px] left-[9px] top-[10px] w-[2px]"
                    style={{ background: 'linear-gradient(180deg,var(--alp),var(--koyo) 60%,var(--alp))' }}
                    aria-hidden
                  />
                  {steps.map((s, j) => {
                    const transit = !!s.mode;
                    return (
                      <li key={j} className="relative pb-[14px] last:pb-0">
                        <span
                          className={
                            transit
                              ? 'absolute left-[-26px] top-[1px] grid h-[20px] w-[20px] place-items-center rounded-full border-2 border-koyo bg-koyo-soft'
                              : 'absolute left-[-21px] top-[5px] grid h-[11px] w-[11px] place-items-center rounded-full border-[3px] border-alp bg-white'
                          }
                          aria-hidden
                        >
                          {transit && <FlatIcon name={iconForMode(s.mode!)} size={12} />}
                        </span>

                        <div className="flex items-baseline justify-between gap-2">
                          <div className="min-w-0">
                            {s.time_th && (
                              <span className="mr-[6px] text-[11px] font-bold text-alp tabnum">{s.time_th}</span>
                            )}
                            <span className={structured ? 'text-[13.5px] font-bold text-ink' : 'text-[13px] text-ink-soft'}>
                              {s.title_th}
                            </span>
                          </div>
                          {s.durationMin != null && (
                            <span className="inline-flex flex-none items-center gap-1 whitespace-nowrap text-[11px] text-ink-soft tabnum">
                              <Icon name="clock" size={12} /> {fmtDuration(s.durationMin)}
                            </span>
                          )}
                        </div>
                        {s.detail_th && (
                          <p className="mt-[2px] text-[12.5px] leading-[1.5] text-ink-soft">{s.detail_th}</p>
                        )}
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="text-[13.5px] leading-[1.65] text-ink-soft">{day.detail_th}</p>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
}
