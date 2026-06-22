# Japan Trip Hub — Shared SPEC

เว็บ research ปลายทางเที่ยวญี่ปุ่นสวยๆ ที่ไปจากโตเกียวไม่ยาก ไว้อ่าน/วางแผนทริปส่วนตัว
ทุกทีม (Research / Design / FE) อ่านไฟล์นี้เป็น source of truth

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- Static export (host Vercel / GitHub Pages)
- Index map: `react-simple-maps` (SVG Japan, stylized)
- Detail map: `react-leaflet` (route/POI จริง)
- Charts: inline SVG/CSS (port จาก Tateyama HTML เดิม) — donut, koyo gantt, route flow
- Icons: Unicons (Iconscout) via Iconify — `@iconify/react` prefix `uil`
- Font: Sarabun (Google Fonts)

## Pages
| Route | หน้าที่ |
|---|---|
| `/` | Index — แผนที่ญี่ปุ่น SVG + pin แต่ละปลายทาง + filter (region/ฤดู/ความง่าย/ประเภท) + reachability slider |
| `/destinations` | List view — การ์ดทุกที่ กรอง/เรียง |
| `/d/[slug]` | Detail — template เดียว render จาก data |

## Design direction (ต่อยอดจาก Tateyama HTML)
Palette: alp `#2d6a8e` / koyo `#c8662f` / gold `#b8893a` / ok `#2f7d52` / ink `#1a2332` / paper `#f7f9fc`
- การ์ด radius 14-16, shadow นุ่ม, เส้น `#e3e8f0`
- Section heading: เลขใน badge สี่เหลี่ยมมน + icon
- รูป hero overlay gradient + pattern ภูเขา
- โทน: สะอาด, อ่านง่าย, มี data-viz, ไม่รก
ดูตัวอย่างจริงที่ `../tateyama-murodo-guide.html`

## Data schema (1 ไฟล์ = 1 ปลายทาง → `data/<slug>.json`)
```ts
type Destination = {
  slug: string                      // "tateyama"
  name: { en: string; th: string; jp?: string }
  region: string                    // "Chubu" | "Kanto" | ...
  prefecture: string
  coords: { lat: number; lng: number }
  category: ('mountain'|'onsen'|'shrine'|'coast'|'city'|'nature'|'lake')[]
  tagline_th: string                // 1 บรรทัดดึงดูด
  heroImage: ImageRef
  difficultyFromTokyo: 1|2|3|4|5     // 1 = day-trip ชิล, 5 = ต้องค้าง+หลายต่อ
  access: {
    summary_th: string
    jrPassWorth: boolean
    options: { mode: string; detail_th: string; durationMin: number; costYen: number; transfers: number }[]
  }
  bestSeasons: { label: string; months: number[]; note_th: string }[]
  seasonTimeline?: { zone: string; type: 'koyo'|'snow'|'bloom'|'green'|'event'; startFrac: number; endFrac: number; note_th: string }[]
                                     // startFrac/endFrac = 0..1 ของแกน timeline (กำหนด axis เป็น ม.ค.-ธ.ค. หรือช่วงที่เกี่ยว)
  budget: {
    note_th: string
    items: { label_th: string; yen: number; thb: number; note_th?: string }[]
    totalYen: number; totalThb: number
    ranges: { lowThb: number; midThb: number; highThb: number }
  }
  pois: {
    name: string; icon: string      // icon = ชื่อ uil เช่น "water","fire"
    durationMin?: number
    blurb_th: string                // สั้น แสดงบนการ์ด
    deepDive_th: string             // ยาว แสดงตอนกดขยาย (research ลึก)
    location_th: string
    image: ImageRef
  }[]
  routeFlow?: { name: string; elevationM?: number; modeToNext?: string; modeDetail_th?: string }[]
  plans: { label_th: string; recommended: boolean; days: { title_th: string; detail_th: string }[] }[]
  warnings_th: string[]
  sources: { label: string; url: string }[]
  tags_th: string[]
}
type ImageRef = { url: string; source: 'trip.com'|'wikimedia'|'other'; credit?: string; fallbackUrl?: string }
```

### กฎเรื่องรูป (สำคัญ — เหมือนที่ทำกับ Tateyama)
- **ห้ามแต่ง URL เอง** — ต้อง verify ทุกลิงก์ว่า HTTP 200 + content-type image ก่อนใส่
- เน้น **trip.com ก่อน** (ดึง og:image จากหน้า attraction จริง / harvest tripcdn) แล้วค่อย Wikimedia Commons (`Special:FilePath/<file>?width=900`)
- ใส่ `fallbackUrl` (Wikimedia) ทุกอันที่ source = trip.com → `onerror` สลับอัตโนมัติ
- เปิดดูรูปจริงก่อนแปะว่าตรง subject (กันแปะผิดจุด)

## Destinations v1 (ลึก 3 ที่)
| slug | สถานะ |
|---|---|
| `tateyama` | port จาก `../tateyama-murodo-guide.html` (มี data ครบแล้ว) |
| `hakone` | research ใหม่ |
| `nikko` | research ใหม่ |

## Feature scope
**v1 must:** index map + pin, list+filter, detail template (port Tateyama), POI expand deep-dive, charts, save favorite (localStorage), responsive, Sarabun
**later:** trip builder, compare, reachability slider, PWA offline, access calculator
