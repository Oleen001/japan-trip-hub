import type { Plan } from '@/lib/types';
import { Card, Tag, MiniHead } from '../primitives';
import { Icon } from '../Icon';
import { FlatIcon } from '../FlatIcon';
import { iconForMode } from '@/lib/route';

/** split a "A → B → C" day description into ordered steps, tagging transit legs */
function toSteps(detail: string): { text: string; icon: string; transit: boolean }[] {
  return detail
    .split(/→|➜|->/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => {
      const mode = iconForMode(text);
      const transit = mode !== 'angle-double-right';
      return { text, icon: transit ? mode : 'map-marker', transit };
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
        const steps = toSteps(day.detail_th);
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
                  {steps.map((s, j) => (
                    <li key={j} className="relative pb-[13px] last:pb-0">
                      <span
                        className={
                          s.transit
                            ? 'absolute left-[-26px] top-[1px] grid h-[20px] w-[20px] place-items-center rounded-full border-2 border-koyo bg-koyo-soft'
                            : 'absolute left-[-21px] top-[5px] grid h-[11px] w-[11px] place-items-center rounded-full border-[3px] border-alp bg-white'
                        }
                        aria-hidden
                      >
                        {s.transit && <FlatIcon name={s.icon} size={12} />}
                      </span>
                      <p className="text-[13px] leading-[1.55] text-ink-soft">{s.text}</p>
                    </li>
                  ))}
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
