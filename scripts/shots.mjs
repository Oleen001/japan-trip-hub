import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:3217';
const OUT = '/tmp/jth-shots';
mkdirSync(OUT, { recursive: true });

const shots = [
  { name: 'index-desktop', url: '/', vp: { width: 1440, height: 900 }, wait: 2500 },
  { name: 'detail-desktop', url: '/d/tateyama', vp: { width: 1440, height: 1000 }, full: true, wait: 1500 },
  { name: 'index-mobile', url: '/', vp: { width: 390, height: 844 }, wait: 2000 },
  { name: 'detail-mobile', url: '/d/tateyama', vp: { width: 390, height: 844 }, full: true, wait: 1500 },
];

const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: s.vp, deviceScaleFactor: 2 });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERR: ' + e.message));
  await page.goto(BASE + s.url, { waitUntil: 'networkidle', timeout: 30000 }).catch((e) => errors.push('GOTO: ' + e.message));
  await page.waitForTimeout(s.wait);
  await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: !!s.full });
  console.log(`✓ ${s.name}` + (errors.length ? `  ⚠ ${errors.length} console errors:\n   ` + errors.slice(0, 5).join('\n   ') : ''));
  await page.close();
}
await browser.close();
console.log('done →', OUT);
