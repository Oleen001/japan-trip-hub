import type { AccessOption, RouteLeg } from './types';
import type { Tone } from '@/components/primitives';

/**
 * Transport-mode detection for route legs.
 * Order = priority: more specific patterns first (shinkansen before generic train,
 * ropeway/cablecar before bus, bus before car so "รถบัส" isn't caught as "รถ").
 */
const LEG_MODES: { key: string; re: RegExp; icon: string; label_th: string }[] = [
  { key: 'plane', re: /\bflight|\bfly\b|เครื่องบิน|บินภายใน|✈/i, icon: 'plane', label_th: 'เครื่องบิน' },
  { key: 'shinkansen', re: /shinkansen|ชินคันเซน|新幹線|kagayaki|hakutaka|nozomi|hikari/i, icon: 'subway', label_th: 'ชินคันเซน' },
  { key: 'ropeway', re: /ropeway|กระเช้า|ロープウェイ/i, icon: 'cable-car', label_th: 'กระเช้า' },
  { key: 'cablecar', re: /cable\s?car|cablecar|เคเบิล|ケーブル|funicular/i, icon: 'cable-car', label_th: 'เคเบิลคาร์' },
  { key: 'ferry', re: /ferry|เรือ|ข้ามฟาก|船|pirate ship/i, icon: 'ship', label_th: 'เรือ' },
  { key: 'bus', re: /\bbus\b|บัส|รถบัส|รถเมล์|シャトル|バス|shuttle|highland/i, icon: 'bus', label_th: 'บัส' },
  { key: 'walk', re: /\bwalk(ing)?\b|\btrek(king)?\b|\bhik(e|ing)\b|เดิน(?!ทาง)|เทรล|徒歩/i, icon: 'walking', label_th: 'เดิน' },
  { key: 'car', re: /\bcar\b|\btaxi\b|รถยนต์|แท็กซี่|รถเช่า|รถส่วนตัว/i, icon: 'car', label_th: 'รถ' },
  // generic rail last — catches dentetsu / private lines / named trains / 電車 / 線 / "รถไฟ"
  {
    key: 'train',
    re: /\btrain\b|รถไฟ|電車|電鉄|私鉄|[A-Za-z]+\s*line\b|dentetsu|express|limited exp|local line|\bjr\b|romancecar|odakyu|kintetsu|tobu|keisei|hankyu|keihan|nankai|meitetsu|sagano|enoden|narita exp|n'?ex|rapid|chuo|yamanote|sobu|tokaido/i,
    icon: 'subway',
    label_th: 'รถไฟ',
  },
];

function detectMode(part: string): RouteLeg | null {
  for (const m of LEG_MODES) {
    if (m.re.test(part)) return { mode: m.key, label_th: m.label_th, icon: m.icon };
  }
  return null;
}

/**
 * Derive an ordered transport-mode chain from a free-text `detail_th` that uses
 * "→" between stops/segments. Collapses consecutive duplicate modes so a chain
 * reads 🚄 → 🚌 → 🚡 rather than repeating the same icon.
 */
export function parseLegs(detail_th: string, mode?: string): RouteLeg[] {
  // include `mode` as a leading segment — it often names the train/service
  // (e.g. "Odakyu Romancecar") that the detail text only refers to by station.
  const source = mode ? `${mode} → ${detail_th}` : detail_th;
  const parts = source.split(/→|➜|->|—>|·/);
  const legs: RouteLeg[] = [];
  for (const part of parts) {
    const leg = detectMode(part);
    if (!leg) continue;
    if (legs.length && legs[legs.length - 1].mode === leg.mode) continue;
    legs.push(leg);
  }
  return legs;
}

/**
 * Single transport icon for a short mode label (e.g. routeFlow `modeToNext`
 * like "highland bus" / "ropeway" / "เดิน"). Shares the LEG_MODES table so the
 * icon set is consistent with RouteCompare's leg chips. Falls back to a generic
 * arrow only when no mode keyword matches at all.
 */
export function iconForMode(text?: string): string {
  return detectMode(text ?? '')?.icon ?? 'angle-double-right';
}

/** legs from structured field if present, else parsed from mode + detail_th. */
export function getLegs(opt: AccessOption): RouteLeg[] {
  if (opt.legs && opt.legs.length) return opt.legs;
  return parseLegs(opt.detail_th, opt.mode);
}

export type RouteBadge = 'fastest' | 'cheapest' | 'fewest' | 'recommended';

export const BADGE_META: Record<RouteBadge, { label_th: string; icon: string; tone: Tone }> = {
  fastest: { label_th: 'เร็วสุด', icon: 'bolt-alt', tone: 'ok' },
  cheapest: { label_th: 'ถูกสุด', icon: 'tag-alt', tone: 'alp' },
  fewest: { label_th: 'ต่อน้อยสุด', icon: 'sign-alt', tone: 'snow' },
  recommended: { label_th: 'แนะนำ', icon: 'star', tone: 'koyo' },
};

/**
 * Per-option superlative badges. Only awards fastest/cheapest/fewest when there
 * is genuine variation (≥2 options) and the winner is strictly unique — avoids
 * tagging every option when they tie.
 */
export function computeBadges(options: AccessOption[]): RouteBadge[][] {
  const out: RouteBadge[][] = options.map(() => []);
  if (options.length === 0) return out;

  const award = (
    badge: RouteBadge,
    pick: (o: AccessOption) => number,
  ) => {
    if (options.length < 2) return;
    const vals = options.map(pick);
    const best = Math.min(...vals);
    if (vals.every((v) => v === best)) return; // all tie → not a distinction
    const winners = vals.filter((v) => v === best);
    if (winners.length > 1) return; // ambiguous → skip to keep signal clean
    out[vals.indexOf(best)].push(badge);
  };

  award('fastest', (o) => o.durationMin);
  award('cheapest', (o) => o.costYen);
  award('fewest', (o) => o.transfers);

  options.forEach((o, i) => {
    if (/แนะนำ/.test(o.mode)) out[i].push('recommended');
  });

  return out;
}

export function fmtDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} น.`;
  if (m === 0) return `${h} ชม.`;
  return `${h} ชม. ${m} น.`;
}
