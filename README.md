# Japan Trip Hub

Research hub ปลายทางเที่ยวญี่ปุ่นจากโตเกียว — แผนที่ญี่ปุ่น + pin แต่ละปลายทาง, filter, detail template
ที่ render จาก data (port มาจาก `../tateyama-murodo-guide.html`)

## รัน

```bash
npm install        # มี .npmrc legacy-peer-deps อยู่แล้ว (react-simple-maps ยังไม่ declare React 19 peer)
npm run dev        # http://localhost:3000
npm run build      # production build (static + SSG)
npm run typecheck  # tsc --noEmit
npm run lint
```

> **หมายเหตุ:** `npm install` ใช้ `--legacy-peer-deps` (ตั้งใน `.npmrc`) เพราะ `react-simple-maps@3`
> ยังประกาศ peer เป็น React 16/17/18 แต่ใช้กับ React 19 ได้จริง (d3 internals ไม่พึ่ง React internals)

## โครงสร้าง

```
data/                    1 ไฟล์ = 1 ปลายทาง (tateyama / hakone / nikko)
public/japan.topo.json   Japan topojson (simplify จาก dataofjapan/land 12MB → 35KB ด้วย mapshaper)
src/
  app/
    page.tsx                 / — index (แผนที่ + pin + filter + preview panel)
    destinations/page.tsx    /destinations — list view + filter (?saved=1 = เฉพาะที่บันทึก)
    d/[slug]/page.tsx        /d/<slug> — detail template (SSG จาก data)
    layout.tsx · globals.css · not-found.tsx
  lib/
    types.ts        Destination schema (ตรงกับ SPEC.md)
    data.ts         loader อ่าน data/*.json (server-side)
    maps.ts         category/season/difficulty → สี/icon/label
    filter.ts       FilterState + matchesFilter
    useSaved.ts     localStorage favorite hook (cross-tab sync)
    cn.ts
  components/
    Icon.tsx        @iconify/react wrapper (Unicons prefix uil)
    SmartImage.tsx  lazy + onerror fallbackUrl + skeleton (ตามกฎ SPEC)
    DestinationCard.tsx · DifficultyPips · SaveButton · TopBar · primitives (Card/Tag/Note/SectionHead)
    FilterBar · PreviewPanel · IndexClient · ListClient
    map/        JapanMap (react-simple-maps) · MapPin (teardrop SVG)
    charts/     BudgetDonut (port JS hover-morph) · SeasonGantt · RouteFlow
    detail/     Hero · AlertStrip · AccessTable · BudgetTable · PoiGrid (FLIP expand) ·
                PlanCard · WarningList · SourceLinks · DestinationDetail (orchestrator)
```

## สิ่งที่ทำเสร็จ (works — verified ใน browser)

- **Detail `/d/tateyama`** — port 1:1 จาก HTML เดิม: hero+pattern, alert strip, access table,
  route flow (vertical timeline + peak highlight), budget table, **donut interactive** (hover→center morph),
  **season gantt** (คำนวณจาก startFrac/endFrac), POI grid + **expand deep-dive (FLIP variant B)**,
  plans, warnings, sources. charts ทำงาน, รูป trip.com + Wikimedia โหลดครบ (fallback ทำงาน)
- **Index `/`** — JapanMap + teardrop pin ตามพิกัด (category=สี fill + icon, difficulty=dot สี),
  Tokyo anchor, FilterBar (region/season chips/category chips/difficulty slider), PreviewPanel (hover pin → card)
- **List `/destinations`** — grid + filter + empty state
- **SaveButton** localStorage favorite (sync ข้าม component/tab) + counter ใน TopBar
- **Responsive** — mobile: index = list default + toggle แผนที่ + bottom sheet (pin/filter); donut/gantt/poi stack;
  budget table scroll-x ในกล่องเฉพาะ
- **a11y** — reduced-motion (ตัด transition), gantt มี table fallback (sr-only), pin keyboard-focusable,
  difficulty pip มี aria-label, touch target ≥44px (pin hit-area)
- **data-driven** — เพิ่ม `data/<slug>.json` ใหม่ → map/list/detail render อัตโนมัติ (hakone + nikko เสียบมาแล้ว build ผ่าน)

## จุดที่ยังไม่เสร็จ / ทำทีหลังได้

- **Detail map (react-leaflet)** — ยังไม่ใส่ (SPEC บอกใส่ทีหลังได้). มี `.leaflet-placeholder` CSS เตรียมไว้
  ปัจจุบัน detail ใช้ RouteFlow (vertical) แทน interactive map — เพียงพอสำหรับ v1
- **Page transition (Framer Motion route)** — ยังไม่ทำ fade-through; ใช้ FLIP เฉพาะ POI + panel swap ตาม scope
- **Pin clustering** — v1 มี 3 ที่ ยังไม่ทับกันรุนแรง; ถ้าเพิ่มปลายทางใกล้โตเกียวเยอะค่อยทำ leader-line/cluster
- **next/image** — ใช้ native `<img>` (SmartImage) เพราะต้อง onerror fallback + remote host หลากหลาย;
  CLS กันด้วย aspect-ratio. ถ้าต้องการ optimize ค่อยเปลี่ยนเป็น next/image + custom loader

## เช็ค / verify

```bash
node scripts/shots.mjs   # ต้อง dev server รันที่ port 3217 ก่อน — ถ่าย index/detail desktop+mobile → /tmp/jth-shots
```

icons ทั้งหมดใช้ Unicons (`uil`) ผ่าน Iconify · `uil:torii` ไม่มี (404) → shrine ใช้ `uil:building` แทน
รูปทุกใบ: trip.com ก่อน + `fallbackUrl` Wikimedia + onerror สลับอัตโนมัติ
