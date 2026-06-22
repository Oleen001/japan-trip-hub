import type { Destination } from '@/lib/types';
import { Icon } from '../Icon';
import { CategoryGlyph } from '../CategoryGlyph';
import { DifficultyPips } from '../DifficultyPips';
import { CATEGORY_LABEL_TH, DIFFICULTY_SHORT_TH, SEASON_LABEL_TH } from '@/lib/maps';

export function Hero({ data }: { data: Destination }) {
  const primaryCat = data.category[0];
  const topSeasonType = data.seasonTimeline?.[0]?.type;

  return (
    <header className="mountain-pattern relative overflow-hidden text-white">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg,rgba(29,77,107,.86),rgba(45,106,142,.80) 45%,rgba(63,126,156,.82)), url('${data.heroImage.url}') center 30%/cover no-repeat`,
          backgroundColor: '#1d4d6b',
        }}
        aria-hidden
      />
      <div className="relative z-[1] mx-auto max-w-[780px] px-5 pt-16 pb-[72px] text-center">
        <span className="mb-[18px] inline-flex items-center gap-[7px] rounded-full bg-white/[.16] px-[14px] py-[6px] text-[12px] uppercase tracking-[.18em] backdrop-blur-sm">
          <Icon name="map-marker" size={14} /> {data.region} · {data.prefecture}
        </span>
        <h1 className="mb-2 text-h1-m sm:text-[32px] lg:text-h1">
          {data.name.en}
          {data.name.jp && <span className="ml-2 font-medium opacity-80">{data.name.jp}</span>}
        </h1>
        <p className="text-[17px] font-medium opacity-95">{data.tagline_th}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-[10px]">
          <MetaPill icon="subway">ฐานโตเกียว</MetaPill>
          {primaryCat && (
            <span className="inline-flex items-center gap-[7px] rounded-full border border-white/[.18] bg-white/[.12] py-[5px] pl-[5px] pr-[14px] text-[13.5px]">
              <CategoryGlyph cat={primaryCat} size={16} plate />
              {CATEGORY_LABEL_TH[primaryCat]}
            </span>
          )}
          {topSeasonType && <MetaPill icon="trees">{SEASON_LABEL_TH[topSeasonType]}</MetaPill>}
          <span className="inline-flex items-center gap-[7px] rounded-full border border-white/[.18] bg-white/[.12] px-[14px] py-[7px] text-[13.5px]">
            {DIFFICULTY_SHORT_TH[data.difficultyFromTokyo]} <DifficultyPips level={data.difficultyFromTokyo} light />
          </span>
        </div>
      </div>
    </header>
  );
}

function MetaPill({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[7px] rounded-full border border-white/[.18] bg-white/[.12] px-[14px] py-[7px] text-[13.5px]">
      <Icon name={icon} size={15} /> {children}
    </span>
  );
}
