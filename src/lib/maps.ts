import type { Category, Difficulty, SeasonType } from './types';

export const CATEGORY_COLOR: Record<Category, string> = {
  mountain: '#2d6a8e',
  onsen: '#c8662f',
  shrine: '#b8893a',
  coast: '#2f7d8e',
  city: '#48566b',
  nature: '#2f7d52',
  lake: '#6b8aa8',
};

export const CATEGORY_ICON: Record<Category, string> = {
  mountain: 'mountains',
  onsen: 'raindrops-alt',
  shrine: 'building',
  coast: 'water',
  city: 'building',
  nature: 'trees',
  lake: 'water',
};

export const CATEGORY_LABEL_TH: Record<Category, string> = {
  mountain: 'ภูเขา',
  onsen: 'ออนเซน',
  shrine: 'ศาลเจ้า',
  coast: 'ทะเล',
  city: 'เมือง',
  nature: 'ธรรมชาติ',
  lake: 'ทะเลสาบ',
};

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  1: '#2f7d52',
  2: '#5f9e6e',
  3: '#b8893a',
  4: '#c8662f',
  5: '#b03a3a',
};

/** สั้น — ใช้บน chip/pill คู่กับ DifficultyPips (สื่อ level จริง ไม่ใช่ "ง่าย" ทุกอัน) */
export const DIFFICULTY_SHORT_TH: Record<Difficulty, string> = {
  1: 'ง่ายมาก',
  2: 'ง่าย',
  3: 'ปานกลาง',
  4: 'ค่อนข้างยาก',
  5: 'ยาก',
};

export const DIFFICULTY_LABEL_TH: Record<Difficulty, string> = {
  1: 'ชิล day-trip',
  2: 'ง่าย',
  3: 'ปานกลาง',
  4: 'ต้องวางแผน',
  5: 'ต้องค้าง+หลายต่อ',
};

export const SEASON_COLOR: Record<SeasonType, string> = {
  koyo: '#c8662f',
  snow: '#6b8aa8',
  bloom: '#d27ba0',
  green: '#2f7d52',
  event: '#b8893a',
};

export const SEASON_LABEL_TH: Record<SeasonType, string> = {
  koyo: 'ใบไม้แดง',
  snow: 'หิมะ',
  bloom: 'ดอกไม้บาน',
  green: 'เขียวสด',
  event: 'อีเวนต์',
};

export const DONUT_PALETTE = ['#2d6a8e', '#c8662f', '#b8893a', '#2f7d52', '#6b8aa8', '#1d4d6b'];
