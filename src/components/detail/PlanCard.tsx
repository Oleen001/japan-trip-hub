import type { Plan } from '@/lib/types';
import { Card, Tag, MiniHead } from '../primitives';
import { Icon } from '../Icon';

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
      {plan.days.map((day, i) => (
        <div
          key={i}
          className="flex gap-4 border-b border-line py-[18px] last:border-none last:pb-0"
        >
          <div className="w-[54px] flex-none text-center">
            <div className="text-[26px] font-extrabold leading-none text-alp">{i + 1}</div>
            <div className="text-[10px] uppercase tracking-[.08em] text-ink-soft">Day</div>
          </div>
          <div>
            <h4 className="mb-1 flex items-center gap-2 text-[15px] font-bold">
              <Icon name="map-marker" size={18} style={{ color: 'var(--alp)' }} />
              {day.title_th}
            </h4>
            <p className="text-[13.5px] leading-[1.65] text-ink-soft">{day.detail_th}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}
