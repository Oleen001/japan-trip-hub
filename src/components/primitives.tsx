import { Icon } from './Icon';
import { cn } from '@/lib/cn';

export function Card({
  children,
  className,
  pad = true,
}: {
  children: React.ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-line bg-white shadow-card',
        pad && 'px-6 py-[22px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export type Tone = 'alp' | 'koyo' | 'gold' | 'ok' | 'warn' | 'snow';

const TAG_TONE: Record<Tone, string> = {
  alp: 'bg-alp-soft text-alp-dark',
  koyo: 'bg-koyo-soft text-koyo',
  gold: 'bg-[#f5edd9] text-[#7a5a1f]',
  ok: 'bg-ok-soft text-ok',
  warn: 'bg-warn-soft text-warn',
  snow: 'bg-[#e9eef4] text-[#3f5870]',
};

export function Tag({
  children,
  tone = 'alp',
  icon,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  icon?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-xs px-[9px] py-[2px] text-tag font-bold',
        TAG_TONE[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

export function SectionHead({
  num,
  icon,
  title,
  subtitle,
}: {
  num?: number;
  icon?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-[18px] flex items-center gap-3">
      <div className="grid h-[34px] w-[34px] flex-none place-items-center rounded-md bg-alp text-[15px] font-bold text-white">
        {num != null ? num : icon ? <Icon name={icon} size={19} /> : null}
      </div>
      <div>
        <h2 className="text-h2 text-ink">{title}</h2>
        {subtitle && <div className="text-[13px] font-medium text-ink-soft">{subtitle}</div>}
      </div>
    </div>
  );
}

const NOTE_TONE = {
  gold: { bg: 'var(--koyo-soft)', border: 'var(--gold)', icon: 'var(--gold)' },
  blue: { bg: 'var(--alp-soft)', border: 'var(--alp)', icon: 'var(--alp)' },
  green: { bg: 'var(--ok-soft)', border: 'var(--ok)', icon: 'var(--ok)' },
  warn: { bg: 'var(--warn-soft)', border: 'var(--warn)', icon: 'var(--warn)' },
} as const;

export function Note({
  tone = 'gold',
  icon = 'info-circle',
  children,
}: {
  tone?: keyof typeof NOTE_TONE;
  icon?: string;
  children: React.ReactNode;
}) {
  const t = NOTE_TONE[tone];
  return (
    <div
      className="mt-[14px] flex items-start gap-[10px] rounded-md px-[14px] py-3 text-[12.5px] text-ink-soft"
      style={{ background: t.bg, borderLeft: `3px solid ${t.border}` }}
    >
      <span className="mt-px flex-none" style={{ color: t.icon }}>
        <Icon name={icon} size={18} />
      </span>
      <div className="leading-[1.6]">{children}</div>
    </div>
  );
}

/** compact header for bento tiles — smaller than SectionHead, no big number badge */
export function TileHead({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-[14px] flex items-center gap-[10px]">
      <div className="grid h-7 w-7 flex-none place-items-center rounded-md bg-alp-soft text-alp">
        <Icon name={icon} size={16} />
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-extrabold leading-tight text-ink">{title}</h3>
        {subtitle && <div className="text-[11.5px] leading-tight text-ink-soft">{subtitle}</div>}
      </div>
    </div>
  );
}

export function MiniHead({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-[18px] flex items-center gap-2 text-[15px] font-bold text-alp-dark first:mt-0">
      <Icon name={icon} size={18} />
      {children}
    </h3>
  );
}
