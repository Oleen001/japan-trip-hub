import type { AccessOption } from '@/lib/types';
import { Icon } from '../Icon';

function fmtDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} น.`;
  if (m === 0) return `${h} ชม.`;
  return `${h} ชม. ${m} น.`;
}

export function AccessTable({ options }: { options: AccessOption[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {options.map((opt, i) => (
        <li key={i} className="rounded-md border border-line bg-paper px-4 py-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="flex items-center gap-2 text-[14.5px] font-bold text-ink">
              <Icon name="subway" size={16} style={{ color: 'var(--alp)' }} />
              {opt.mode}
            </span>
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-ink-soft tabnum">
              <span className="inline-flex items-center gap-1">
                <Icon name="clock" size={13} /> {fmtDuration(opt.durationMin)}
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-ink">
                <Icon name="yen" size={13} /> {opt.costYen.toLocaleString('en-US')}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon name="angle-double-right" size={13} />
                {opt.transfers === 0 ? 'ตรง' : `${opt.transfers} ต่อ`}
              </span>
            </span>
          </div>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-ink-soft">{opt.detail_th}</p>
        </li>
      ))}
    </ul>
  );
}
