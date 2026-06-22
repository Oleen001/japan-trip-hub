import type { RouteStop } from '@/lib/types';
import { FlatIcon } from '../FlatIcon';
import { iconForMode } from '@/lib/route';

export function RouteFlow({ stops }: { stops: RouteStop[] }) {
  const peakElev = Math.max(...stops.map((s) => s.elevationM ?? -Infinity));

  return (
    <div className="relative mt-[14px] mb-1 pl-7">
      <span
        className="absolute top-[10px] bottom-[10px] left-[10px] w-[2px]"
        style={{ background: 'linear-gradient(180deg,var(--alp),var(--koyo) 45%,var(--alp))' }}
        aria-hidden
      />
      <ol>
        {stops.map((stop, i) => {
          const isPeak = stop.elevationM != null && stop.elevationM === peakElev && stops.length > 2;
          return (
            <li key={i}>
              <div className="relative flex items-baseline gap-[9px] py-[5px]">
                <span
                  className="absolute box-border rounded-full"
                  style={
                    isPeak
                      ? {
                          left: -25,
                          top: 6,
                          width: 17,
                          height: 17,
                          background: 'var(--koyo)',
                          border: '3px solid var(--koyo)',
                          boxShadow: '0 0 0 4px var(--koyo-soft)',
                        }
                      : {
                          left: -23,
                          top: 8,
                          width: 13,
                          height: 13,
                          background: 'var(--card)',
                          border: '3px solid var(--alp)',
                        }
                  }
                  aria-hidden
                />
                <b
                  className="text-[14px]"
                  style={isPeak ? { color: 'var(--koyo)', fontSize: 15 } : undefined}
                >
                  {stop.name}
                </b>
                {stop.elevationM != null && (
                  <span className="text-[11.5px] text-ink-soft tabnum">
                    {stop.elevationM.toLocaleString('en-US')} m
                  </span>
                )}
                {isPeak && (
                  <span className="rounded-full bg-koyo px-[7px] py-px text-[10px] font-bold text-white">
                    ★ จุดสูงสุด
                  </span>
                )}
              </div>
              {stop.modeToNext && i < stops.length - 1 && (
                <div className="flex min-h-[20px] items-center gap-[6px] py-px pl-px text-[11.5px] text-ink-soft">
                  <span>
                    <FlatIcon name={iconForMode(stop.modeToNext)} size={15} />
                  </span>
                  <em className="not-italic">
                    <span className="italic">{stop.modeToNext}</span>
                    {stop.modeDetail_th ? ` · ${stop.modeDetail_th}` : ''}
                  </em>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
