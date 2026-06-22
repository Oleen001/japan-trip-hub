export type ImageRef = {
  url: string;
  source: 'trip.com' | 'wikimedia' | 'other';
  credit?: string;
  fallbackUrl?: string;
};

export type Category = 'mountain' | 'onsen' | 'shrine' | 'coast' | 'city' | 'nature' | 'lake';
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type SeasonType = 'koyo' | 'snow' | 'bloom' | 'green' | 'event';

export type RouteLeg = {
  mode: string; // key: shinkansen | train | bus | cablecar | ropeway | ferry | walk | car | plane
  label_th: string;
  icon: string; // uil icon name
};

/** One concrete segment of a journey (board X → alight Y on a named service). */
export type AccessStep = {
  from: string; // ต้นทางของ leg นี้ (สถานี/จุด)
  to: string; // ปลายทางของ leg นี้
  mode: string; // key เดียวกับ RouteLeg: shinkansen|train|bus|cablecar|ropeway|ferry|walk|car|plane
  line_th: string; // ชื่อสาย/บริการ เช่น "Hokuriku Shinkansen (Kagayaki)" / "เดินจากสถานี"
  durationMin: number; // เวลาเดินทาง leg นี้ (ไม่รวมเวลารอต่อรถ)
  costYen: number; // ค่าโดยสาร leg นี้ ต่อคน (0 ถ้าเดิน/รวมในตั๋วก่อนหน้า)
  note_th?: string; // ความถี่/การจอง/ที่นั่ง/seasonal/baggage ฯลฯ
};

export type AccessOption = {
  mode: string;
  detail_th: string;
  durationMin: number;
  costYen: number; // ราคารวม option นี้ ต่อคน (ควร ≈ ผลรวม steps[].costYen)
  transfers: number;
  /** optional structured override — if absent, derived from detail_th via parseLegs() */
  legs?: RouteLeg[];
  /** step-by-step breakdown — board/alight, named service, per-leg time + fare. Powers the detail modal. */
  steps?: AccessStep[];
};

export type BestSeason = {
  label: string;
  months: number[];
  note_th: string;
};

export type SeasonTimelineItem = {
  zone: string;
  type: SeasonType;
  startFrac: number;
  endFrac: number;
  note_th: string;
};

export type BudgetItem = {
  label_th: string;
  yen: number;
  thb: number;
  note_th?: string;
};

export type Budget = {
  note_th: string;
  items: BudgetItem[];
  totalYen: number;
  totalThb: number;
  ranges: { lowThb: number; midThb: number; highThb: number };
};

export type Poi = {
  name: string;
  icon: string;
  durationMin?: number;
  blurb_th: string;
  deepDive_th: string;
  location_th: string;
  image: ImageRef;
};

export type RouteStop = {
  name: string;
  elevationM?: number;
  modeToNext?: string;
  modeDetail_th?: string;
};

export type Plan = {
  label_th: string;
  recommended: boolean;
  days: { title_th: string; detail_th: string }[];
};

export type Source = { label: string; url: string };

export type FoodItem = {
  name: string; // ชื่อเมนู
  name_jp?: string;
  emoji: string; // emoji อาหารเป็น visual cue
  note_th: string; // เป็นของถิ่นไหน / กินที่ไหน
};

export type Destination = {
  slug: string;
  name: { en: string; th: string; jp?: string };
  region: string;
  prefecture: string;
  coords: { lat: number; lng: number };
  category: Category[];
  tagline_th: string;
  heroImage: ImageRef;
  difficultyFromTokyo: Difficulty;
  access: {
    summary_th: string;
    jrPassWorth: boolean;
    options: AccessOption[];
  };
  bestSeasons: BestSeason[];
  seasonTimeline?: SeasonTimelineItem[];
  budget: Budget;
  pois: Poi[];
  routeFlow?: RouteStop[];
  plans: Plan[];
  warnings_th: string[];
  sources: Source[];
  tags_th: string[];
  food?: FoodItem[];
};
