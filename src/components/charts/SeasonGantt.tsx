import type { SeasonTimelineItem } from '@/lib/types';
import { SEASON_COLOR, SEASON_LABEL_TH } from '@/lib/maps';

const MONTH_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

/**
 * Gantt over a full-year axis (Jan..Dec). startFrac/endFrac are 0..1 of the year.
 * Renders an accessible table fallback alongside the visual bars (per a11y note).
 */
export function SeasonGantt({
  timeline,
  tripRange,
}: {
  timeline: SeasonTimelineItem[];
  tripRange?: { startFrac: number; endFrac: number; label: string };
}) {
  // axis ticks every 2 months for readability
  const ticks = [0, 2, 4, 6, 8, 10, 12];

  return (
    <div>
      <div className="ml-[120px] sm:ml-[150px]">
        {/* axis */}
        <div className="relative h-[18px] border-b border-line">
          {ticks.map((m) => (
            <span
              key={m}
              className="absolute bottom-[2px] -translate-x-1/2 whitespace-nowrap text-[10.5px] text-ink-soft"
              style={{ left: `${(m / 12) * 100}%` }}
            >
              {m === 12 ? MONTH_TH[11] : MONTH_TH[m]}
            </span>
          ))}
        </div>

        <div className="relative">
          {/* grid lines */}
          {ticks.slice(1, -1).map((m) => (
            <i
              key={m}
              className="absolute top-0 bottom-0 z-0 w-px bg-line opacity-55"
              style={{ left: `${(m / 12) * 100}%` }}
            />
          ))}

          {/* trip overlay */}
          {tripRange && (
            <div
              className="absolute top-0 bottom-0 z-[1] border-x-[1.5px] border-dashed border-ok"
              style={{
                left: `${tripRange.startFrac * 100}%`,
                width: `${(tripRange.endFrac - tripRange.startFrac) * 100}%`,
                background: 'rgba(47,125,82,.09)',
              }}
            >
              <b className="absolute top-[2px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[5px] bg-white px-[5px] py-px text-[9.5px] font-bold text-ok shadow-card">
                {tripRange.label}
              </b>
            </div>
          )}

          {/* rows */}
          {timeline.map((row, i) => (
            <div
              key={i}
              className="relative h-[34px] border-b border-dashed border-line last:border-none"
            >
              <span className="absolute top-0 -left-[120px] flex h-[34px] w-[108px] items-center text-[12px] font-semibold sm:-left-[150px] sm:w-[140px] sm:text-[12.5px]">
                {row.zone}
              </span>
              <div
                className="absolute top-[9px] z-[2] flex h-4 items-center justify-center rounded-full px-2 text-[9.5px] font-bold text-white shadow-card"
                style={{
                  left: `${row.startFrac * 100}%`,
                  width: `${(row.endFrac - row.startFrac) * 100}%`,
                  background: SEASON_COLOR[row.type],
                }}
                title={`${SEASON_LABEL_TH[row.type]} — ${row.note_th}`}
              >
                <span className="truncate">{SEASON_LABEL_TH[row.type]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* a11y table fallback (visually hidden) */}
      <table className="sr-only">
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
                {MONTH_TH[Math.floor(row.startFrac * 12) % 12]}–{MONTH_TH[Math.min(11, Math.floor(row.endFrac * 12))]}
              </td>
              <td>{row.note_th}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
