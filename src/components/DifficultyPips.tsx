import type { Difficulty } from '@/lib/types';
import { DIFFICULTY_COLOR, DIFFICULTY_LABEL_TH } from '@/lib/maps';

export function DifficultyPips({
  level,
  className,
  light = false,
}: {
  level: Difficulty;
  className?: string;
  light?: boolean;
}) {
  const color = DIFFICULTY_COLOR[level];
  return (
    <span
      className={`inline-flex items-center gap-[3px] ${className ?? ''}`}
      title={`ง่ายจากโตเกียว: ระดับ ${level}/5 — ${DIFFICULTY_LABEL_TH[level]}`}
      aria-label={`ความง่ายจากโตเกียว ระดับ ${level} จาก 5 — ${DIFFICULTY_LABEL_TH[level]}`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="h-[7px] w-[7px] rounded-full"
          style={{
            background: i <= level ? color : light ? 'rgba(255,255,255,.4)' : 'var(--line-strong)',
          }}
        />
      ))}
    </span>
  );
}
