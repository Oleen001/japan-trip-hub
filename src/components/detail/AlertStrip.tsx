import { Icon } from '../Icon';

export type AlertPill = {
  kind: 'good' | 'no';
  title: string;
  body: string;
};

export function AlertStrip({ pills }: { pills: AlertPill[] }) {
  return (
    <div className="relative z-[5] mx-auto -mt-10 grid max-w-[840px] grid-cols-1 gap-[14px] px-5 sm:grid-cols-2">
      {pills.map((p, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg border border-line bg-white px-[18px] py-4 shadow-card"
          style={{ borderLeft: `4px solid ${p.kind === 'good' ? 'var(--ok)' : 'var(--warn)'}` }}
        >
          <span
            className="mt-px text-[22px]"
            style={{ color: p.kind === 'good' ? 'var(--ok)' : 'var(--warn)' }}
          >
            <Icon name={p.kind === 'good' ? 'check-circle' : 'times-circle'} size={22} />
          </span>
          <div>
            <b className="mb-[2px] block text-[14.5px]">{p.title}</b>
            <p className="text-[13px] leading-[1.5] text-ink-soft">{p.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
