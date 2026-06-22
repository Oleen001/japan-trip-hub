import fs from 'node:fs';
import path from 'node:path';
import type { Destination } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

export function getAllSlugs(): string[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

export function getDestination(slug: string): Destination | null {
  const file = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw) as Destination;
  } catch {
    return null;
  }
}

export function getAllDestinations(): Destination[] {
  return getAllSlugs()
    .map((slug) => getDestination(slug))
    .filter((d): d is Destination => d !== null)
    .sort((a, b) => a.difficultyFromTokyo - b.difficultyFromTokyo);
}
