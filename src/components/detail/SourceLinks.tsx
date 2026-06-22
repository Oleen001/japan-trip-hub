import type { Source } from '@/lib/types';
import { Icon } from '../Icon';

export function SourceLinks({ sources }: { sources: Source[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((s, i) => (
        <a
          key={i}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-[6px] rounded-sm border border-line-strong bg-alp-soft px-3 py-[6px] text-[12.5px] text-alp-dark transition-colors duration-150 hover:bg-[#dceaf2]"
        >
          <Icon name="external-link-alt" size={13} />
          {s.label}
        </a>
      ))}
    </div>
  );
}
