# Japan Trip Hub — Design Spec

> Design system สำหรับ Japan Trip Hub — ต่อยอดจาก aesthetic ของ `tateyama-murodo-guide.html`
> Audience: ตัวเอง (UX/UI designer) ใช้ research/วางแผนทริปญี่ปุ่น · อ่านบนมือถือตอนเที่ยวเป็นหลัก, วางแผนบน desktop
> Stack: Next.js (App Router) + TS + Tailwind · Sarabun · Unicons via `@iconify/react`

## Aesthetic thesis

> **เว็บนี้ควรรู้สึก "สะอาด · น่าเชื่อถือ · เหมือนสมุดวางแผนทริปที่ออกแบบดี" เพราะคนใช้คือนักออกแบบที่อยากได้ข้อมูลแน่นๆ อ่านง่าย ไม่รก และดู data-viz ได้ในตาเดียว**

3 คำคุม: **clean editorial · data-confident · calm-alpine**

หลักที่ห้ามทิ้งจาก Tateyama (DNA ของแบรนด์):
- **ภูเขา/หิมะ/ใบไม้แดง** เป็น metaphor หลัก → palette alp(น้ำเงินเขา)/koyo(ส้มใบไม้)/snow ไม่ใช่สีสุ่ม
- **section heading = เลขใน badge สี่เหลี่ยมมน + icon** — เป็น signature ที่จำได้
- **การ์ดพื้นขาว เส้นบาง shadow นุ่มมาก** — ลอยเบาๆ บนพื้น paper ฟ้าอมเทา
- **data-viz เป็นพระเอก** (donut, gantt, route flow) ไม่ใช่ของแถม
- **ตัวเลขใช้ tabular-nums เสมอ** — ราคา/เวลา/ระยะเรียงตรงคอลัมน์

> ทุก page ใหม่ต้องดูเหมือน "มาจากเว็บเดียวกันกับหน้า Tateyama" — ขยาย ไม่ใช่เปลี่ยนทิศ

---

## 1. Design Tokens (3-tier)

### Tier 1 — Primitive (ค่าดิบ ดึงจาก Tateyama CSS ตรงๆ + เติมเฉดที่ขาด)

```
/* ---- COLOR PRIMITIVES ---- */
--c-ink-900: #1a2332;   /* ink หลัก */
--c-ink-500: #48566b;   /* ink-soft (body รอง, label) */
--c-ink-300: #8794a8;   /* ink ซีดสุด — placeholder, caption (เติมใหม่) */
--c-line:    #e3e8f0;   /* เส้น/border ทุกที่ */
--c-line-strong: #d4e3ec; /* เส้น chip ฟ้า */
--c-paper:   #f7f9fc;   /* พื้น page */
--c-paper-2: #eef2f8;   /* พื้นรองลึกกว่า — filter bar, hover row (เติมใหม่) */
--c-card:    #ffffff;

/* alp = น้ำเงินภูเขา (brand primary) */
--c-alp:      #2d6a8e;
--c-alp-dark: #1d4d6b;
--c-alp-soft: #e8f1f6;
--c-alp-700:  #255a78;  /* hover ของปุ่ม alp (เติมใหม่) */

/* koyo = ส้มใบไม้แดง (brand accent / autumn) */
--c-koyo:      #c8662f;
--c-koyo-soft: #fbeee4;
--c-koyo-dark: #a4521f;  /* text บนพื้นอ่อน contrast พอ (เติมใหม่) */

/* season / category hues */
--c-snow: #6b8aa8;   /* snow / winter / เส้นรอง */
--c-gold: #b8893a;   /* gold accent — note shrine/วัฒนธรรม */
--c-ok:   #2f7d52;   --c-ok-soft: #e6f3eb;   /* เขียว = ดี/ปลอดภัย/now */
--c-warn: #b03a3a;   --c-warn-soft: #fbeaea; /* แดง = เตือน/ไม่ดี */

/* radius */
--r-xs: 6px;   --r-sm: 8px;   --r-md: 10px;
--r-lg: 14px;  --r-xl: 16px;  --r-2xl: 20px;  --r-pill: 99px;

/* shadow */
--sh-card: 0 1px 2px rgba(20,40,70,.05), 0 8px 24px rgba(20,40,70,.07);
--sh-pop:  0 4px 12px rgba(20,40,70,.10), 0 16px 40px rgba(20,40,70,.14); /* panel/modal/pin popover (เติมใหม่) */
--sh-pin:  0 2px 6px rgba(20,40,70,.22); /* pin บนแผนที่ (เติมใหม่) */

/* spacing scale (4px base, ตรงกับที่ Tateyama ใช้จริง 6/8/12/14/18/22/24/48) */
--s-1:4px  --s-2:8px  --s-3:12px  --s-4:14px  --s-5:18px  --s-6:22px  --s-7:24px  --s-8:32px  --s-10:48px  --s-12:64px  --s-16:80px
```

> **Type scale** (ดึงจาก Tateyama จริง): 38 / 28(mobile h1) / 23(h2) / 17(sub) / 16(h4) / 15(lead·body) / 14(table) / 13.5 / 13(meta) / 12(label uppercase) / 11(tag) / 10.5(caption)
> line-height หลัก **1.65** (body), heading 1.2, table 1.5

### Tier 2 — Semantic (FE ใช้ตัวนี้ ไม่อ้าง primitive ตรงๆ)

```
--text:           --c-ink-900
--text-muted:     --c-ink-500
--text-faint:     --c-ink-300
--bg:             --c-paper
--bg-sunken:      --c-paper-2
--surface:        --c-card
--border:         --c-line

--brand:          --c-alp        /* primary action, section number, link */
--brand-ink:      --c-alp-dark
--brand-tint:     --c-alp-soft
--accent:         --c-koyo       /* highlight, "star", peak, koyo */
--accent-tint:    --c-koyo-soft

--success:        --c-ok    --success-tint: --c-ok-soft
--danger:         --c-warn  --danger-tint:  --c-warn-soft
--info:           --c-alp   --info-tint:    --c-alp-soft
--cultural:       --c-gold       /* gold note — shrine/วัด/วัฒนธรรม */

/* category color map — ใช้กับ category badge/chip ทุกที่ ให้ consistent */
--cat-mountain: --c-alp
--cat-onsen:    --c-koyo
--cat-shrine:   --c-gold
--cat-coast:    #2f7d8e   /* teal — ทะเล (เติม) */
--cat-city:     --c-ink-500
--cat-nature:   --c-ok
--cat-lake:     --c-snow

/* difficulty scale 1..5 — น้ำเงินอ่อน→ส้มเข้ม (ง่าย→ยาก) */
--diff-1: --c-ok       /* day-trip ชิล */
--diff-2: #5f9e6e
--diff-3: --c-gold     /* ปานกลาง */
--diff-4: --c-koyo
--diff-5: --c-warn     /* ต้องค้าง+หลายต่อ */

/* season color map — ใช้กับ season timeline + best-season chip */
--season-koyo:  --c-koyo   /* ใบไม้แดง */
--season-snow:  --c-snow
--season-bloom: #d27ba0    /* ซากุระ/ดอกไม้ (เติม) */
--season-green: --c-ok     /* เขียวสด */
--season-event: --c-gold
```

### Tier 3 — Component tokens (เฉพาะ component)

```
/* card */            --card-radius: --r-xl(16) · --card-pad: 22px 24px · border: 1px --border · shadow: --sh-card
/* poi card */        --poi-radius: --r-lg(14) · --poi-pad: 18px · img-h: 148px
/* pin (map) */       --pin-size: 34px(default)/42px(active) · --pin-radius: 50% 50% 50% 0 (teardrop)
/* section-num */     --secnum-size: 34px · radius --r-md(10) · bg --brand · color #fff
/* chip/tag */        --chip-h: 26px · radius --r-xs(6) · pad 2px 9px · font 11/700
/* filter-chip */     --fchip-h: 34px · radius --r-pill · pad 7px 14px · font 13
/* button-primary */  bg --brand, hover --c-alp-700, text #fff, radius --r-md, pad 10px 18px
/* panel (map side) */ radius --r-xl · shadow --sh-pop · width 340px (desktop)
```

### Tailwind config (extend) — ให้ FE วางทับ

```js
// tailwind.config.ts — theme.extend
extend: {
  colors: {
    ink:   { DEFAULT:'#1a2332', soft:'#48566b', faint:'#8794a8' },
    paper: { DEFAULT:'#f7f9fc', sunken:'#eef2f8' },
    line:  { DEFAULT:'#e3e8f0', strong:'#d4e3ec' },
    alp:   { DEFAULT:'#2d6a8e', dark:'#1d4d6b', soft:'#e8f1f6', 700:'#255a78' },
    koyo:  { DEFAULT:'#c8662f', soft:'#fbeee4', dark:'#a4521f' },
    snow:  '#6b8aa8',
    gold:  '#b8893a',
    ok:    { DEFAULT:'#2f7d52', soft:'#e6f3eb' },
    warn:  { DEFAULT:'#b03a3a', soft:'#fbeaea' },
  },
  borderRadius: { xs:'6px', sm:'8px', md:'10px', lg:'14px', xl:'16px', '2xl':'20px' },
  boxShadow: {
    card: '0 1px 2px rgba(20,40,70,.05), 0 8px 24px rgba(20,40,70,.07)',
    pop:  '0 4px 12px rgba(20,40,70,.10), 0 16px 40px rgba(20,40,70,.14)',
    pin:  '0 2px 6px rgba(20,40,70,.22)',
  },
  fontFamily: { sans:['Sarabun','Sukhumvit Set','-apple-system','Segoe UI','sans-serif'] },
  fontSize: { // ที่ Tateyama ใช้จริง — เพิ่ม tracking ให้ heading
    'h1':['38px',{lineHeight:'1.2',letterSpacing:'-.02em',fontWeight:'800'}],
    'h1-m':['28px',{lineHeight:'1.2',letterSpacing:'-.02em',fontWeight:'800'}],
    'h2':['23px',{lineHeight:'1.25',letterSpacing:'-.01em',fontWeight:'800'}],
    'lead':['15px',{lineHeight:'1.65'}],
    'meta':['13px',{lineHeight:'1.5'}],
    'label':['12px',{lineHeight:'1.4',letterSpacing:'.05em'}], // uppercase
    'tag':['11px',{lineHeight:'1.3',fontWeight:'700'}],
  },
}
```

> **Body global**: `font-family: Sarabun; color: ink; background: paper; line-height: 1.65; -webkit-font-smoothing: antialiased; scroll-behavior: smooth`
> **Thai readability**: line-height 1.65 สำคัญมาก (อย่าลดต่ำกว่า 1.55) — Sarabun สระบน/ล่างต้องการที่หายใจ · heading 1.2-1.25 พอ · อย่าใช้ font-weight 300 กับ Thai body (บางเกินจอ retina)

---

## 2. หน้า Index — แผนที่ญี่ปุ่น (HERO ของเว็บ)

### Layout (desktop ≥1024)

```
┌──────────────────────────────────────────────────────────┐
│  TOP BAR  (sticky, h 60)  โลโก้ภูเขา · "Japan Trip Hub"    │
│           · nav [แผนที่ | รายการ] · ★ บันทึกไว้ (count)     │
├────────────────────────────────┬─────────────────────────┤
│                                │  PREVIEW PANEL (340px)   │
│   FILTER BAR (sticky บนแผนที่)  │  ── default state ──     │
│   [ภาค ▾][ฤดู ▾][ประเภท chips]  │  สรุปสั้น: "X ปลายทาง     │
│   ─── reachability slider ───   │  · กรองอยู่: ..."         │
│                                │  + การ์ด featured 1 ที่   │
│                                │                          │
│        🗾 JAPAN SVG MAP         │  ── hover/active pin ──  │
│        (react-simple-maps)     │  → การ์ดปลายทางเต็ม       │
│        pin ตามพิกัด lat/lng     │    (รูป hero, ชื่อ,       │
│        โตเกียว = ⊙ anchor       │     tagline, badge,      │
│                                │     category, ฤดู,       │
│        เส้นจาง โตเกียว→pin       │     ปุ่ม "ดูรายละเอียด")  │
│        (เมื่อ hover)             │                          │
└────────────────────────────────┴─────────────────────────┘
```

- **พื้นแผนที่**: `bg paper` พร้อม pattern ภูเขาจางๆ ที่มุมล่าง (port `.hero::before` zigzag จาก Tateyama opacity .04-.06) — ให้ hero มี texture แต่ไม่รก
- **เกาะญี่ปุ่น (geography)**: fill `#dde6f0` (เทาฟ้าจาง), stroke `--c-line-strong` 0.75px · ไม่ต้องลงสีรายจังหวัด (เป็น stylized ไม่ใช่ choropleth) · ภูมิภาคที่ filter เลือก → fill `--c-alp-soft` ทั้งภาค (ไฮไลต์เบาๆ)
- **โตเกียว anchor**: จุด `⊙` วงแหวน 2 ชั้นสี `--c-alp-dark` มี label "โตเกียว (ฐาน)" เล็กๆ — สื่อว่าเว็บนี้วัดระยะ "จากโตเกียว"

### Pin design (signfor ของหน้านี้)

รูปทรง **teardrop** (`border-radius: 50% 50% 50% 0` หมุน -45°) — สื่อ map marker ชัด ไม่ใช่วงกลมเฉยๆ

| State | Visual |
|---|---|
| **default** | teardrop 34px · fill = สี `--cat-[หมวดหลัก]` ของปลายทาง · ขอบขาว 2px · `shadow-pin` · ข้างในมี Unicon ของ category (mountain/water/...) สีขาว 16px |
| **hover** | scale 1.12 · ยก shadow ขึ้น · เด้งขึ้น -3px (translateY) · เส้นจางโตเกียว→pin ปรากฏ · panel ขวาเปลี่ยนเป็นการ์ดปลายทางนั้น |
| **active/selected** | 42px · ขอบ `--c-koyo` 3px + halo `0 0 0 6px koyo-soft` (ยืมจาก `.rstop.hi` ใน Tateyama) · pin อื่น opacity .55 |
| **difficulty hint** | จุดเล็ก (dot 8px) มุมล่างขวา pin สี `--diff-N` — เห็นความง่ายจากแผนที่เลยไม่ต้อง hover |
| **saved (★)** | ดาวเล็กมุมบนขวา pin สี `--c-gold` |

> ป้องกัน pin ทับกัน (Hakone/Nikko/Tateyama อยู่ใกล้โตเกียว): ถ้า 2 pin ใกล้กัน <ระยะ pin → ใช้ leader line สั้นๆ ดึง label ออก หรือ cluster แล้วกางเมื่อ zoom (v1 มีแค่ 3 ที่ ปัญหานี้ยังเล็ก — แต่ design ให้รองรับ)

### Filter UI

วางใน **filter bar** sticky โปร่งแสง (`bg card/85 + backdrop-blur(8px)`, border-bottom `--c-line`) เหนือแผนที่

1. **ภาค (region)** — dropdown หรือ segmented · option: ทั้งหมด / Kanto / Chubu / Tohoku ... · เลือกแล้วไฮไลต์ภาคบนแผนที่
2. **ฤดู (season)** — chips เลือกได้หลายอัน: 🌸ใบไม้ผลิ 🍃ร้อน 🍁ใบไม้แดง ❄️หิมะ · สีตรง `--season-*` · active = fill เต็มสีนั้น, inactive = outline
3. **ประเภท (category) chips** — เลือกหลายอัน: ภูเขา/ออนเซน/ศาลเจ้า/ทะเล/เมือง/ธรรมชาติ/ทะเลสาบ · มี Unicon นำหน้า · style = `filter-chip` (pill 34px) · active = bg สี category + text ขาว, inactive = bg paper + border + text muted
4. **reachability slider** — แกน "ความง่ายจากโตเกียว 1→5" · track gradient `--diff-1 → --diff-5` · thumb วงกลมขาวขอบ alp · label สองข้าง "ชิล day-trip" ↔ "ต้องค้าง+หลายต่อ" · ลากแล้ว pin ที่ difficulty เกินค่า → จางลง opacity .25 + ตัดออกจาก count
   > (SPEC ระบุ reachability เป็น "later" — แต่ design ไว้ให้พร้อม FE เปิดได้)

Chip pattern (active/inactive) ต้องมี **transition .15s** bg+color, อย่าให้กระตุก

### Preview panel (ขวา)

- **default (ไม่ hover อะไร)**: หัว "พบ N ปลายทาง" + บรรทัดสรุป filter ที่กรอง + การ์ด featured 1 ที่ (สุ่ม/แนะนำ) → ให้ panel ไม่ว่างโล่ง
- **hover/active pin**: morph เป็น **การ์ดปลายทางเต็ม** (ดู §3) + ปุ่ม `ดูรายละเอียด →` (primary) ที่ก้น panel
- transition: fade + slide 8px ขึ้น (.18s) — ยืม timing จาก donut Tateyama (.15-.18s)
- panel scroll เองได้ถ้าเนื้อยาว, หัว panel sticky

### Mobile (<768) — หน้า Index พลิกเป็น 2 โหมด

แผนที่เต็มจอกด pin ลำบากบนมือถือ → **ให้ list เป็น default บนมือถือ**, มี toggle [🗺️ แผนที่ | ☰ รายการ]
- โหมดแผนที่ mobile: แผนที่เต็มกว้าง, แตะ pin → **bottom sheet** เด้งขึ้น (แทน side panel) snap 2 ระดับ (peek การ์ด / เต็ม) · ปัดลงปิด
- filter → ปุ่ม "ตัวกรอง" เปิด bottom sheet เต็ม, chips เรียงเป็น grid, มีปุ่ม "ใช้ตัวกรอง (N)"

---

## 3. การ์ดปลายทาง (Destination Card)

ใช้ที่เดียวกัน 2 บริบท: **list view** (`/destinations`) และ **preview panel** (index hover) — props เดียวกัน, variant ต่างนิดหน่อย

```
┌─────────────────────────────┐
│ ░░ HERO IMAGE 16:10 ░░  [★] │  ← รูป object-cover, มี ★ save มุมขวาบน
│ ░░ overlay gradient ░░       │     (gradient ล่างจาง เพื่อให้ badge อ่านออกถ้าวางบนรูป)
│  [🏔 ภูเขา] [diff ●●●○○]     │  ← category chip + difficulty pip ลอยมุมล่างรูป
├─────────────────────────────┤
│  Tateyama 立山              │  ← ชื่อ en (16/700) + jp เล็กข้าง (ink-faint)
│  เส้นทางอัลไพน์เหนือเมฆ...    │  ← tagline_th (13.5 ink-soft, clamp 2 บรรทัด)
│  🍁 ใบไม้แดง  ·  Chubu       │  ← best season chip + region (meta 12)
└─────────────────────────────┘
```

รายละเอียด:
- **radius 16** (card หลัก), รูปบนชน radius `13px 13px 0 0` (เหมือน `.poi-img` margin trick), shadow-card, border `--c-line`
- **รูป hero**: ratio 16:10, `loading=lazy`, มี `onerror` สลับ `fallbackUrl` (ตามกฎ SPEC) · พื้นรอโหลด `--c-alp-soft` (skeleton shimmer เบาๆ)
- **difficulty pip**: 5 จุด ●●●○○ เติมสีตาม `--diff-N` (จำนวนเติม = ค่า difficulty) + tooltip "ง่ายจากโตเกียว: ระดับ 3/5" · นี่สื่อ "ไปง่ายแค่ไหน" ในแวบเดียว = คุณค่าหลักของเว็บ
- **category chip**: ใช้สี category map, มี Unicon, ถ้าหลาย category โชว์อันแรก + "+2"
- **hover (list)**: ยกการ์ด translateY -3px + shadow ลึกขึ้น (.18s) · รูป zoom in scale 1.04 (overflow hidden) — micro delight เบาๆ
- **variant `compact`** (ใน preview panel): ตัด tagline เหลือ 1 บรรทัด, ปุ่ม CTA ก้น panel

> อย่าใส่ข้อมูลเยอะในการ์ด — การ์ดทำหน้าที่ "ดึงให้กดเข้า detail" ไม่ใช่สรุปทั้งหมด. ความ restraint นี้คือสิ่งที่ทำให้ list ดูสะอาด

---

## 4. Detail Template (`/d/[slug]`)

โครงเดียวกับ Tateyama เป๊ะ แต่ generalize ให้ render จาก `Destination` JSON. ความกว้างเนื้อหา `max-w-[880px]` (ตรง `.wrap` เดิม), การ์ดทุกอันมี section number badge + icon

ลำดับ section (เลข badge):
1. **Hero** — `heroImage` + overlay gradient alp (160deg) + zigzag mountain pattern (port `.hero::before`) · kicker chip (region/prefecture) · h1 = `name.en` + `name.jp` · sub = `tagline_th` · meta chips (ฐานโตเกียว / category / ฤดูแนะนำ / difficulty)
2. **Alert strip** — 2 pill (good/warn) จาก field พิเศษหรือ `warnings_th[0]` + จุดเด่น · `grid 2คอลัมน์`, mobile → 1 คอลัมน์ · ลอยทับ hero -40px (เหมือนเดิม)
3. **§1 การเดินทาง** — `access.summary_th` (lead) + ตาราง `access.options` (mode/detail/duration/cost/transfers) + **route flow แนวตั้ง** (`.rflow`) จาก `routeFlow[]` (dot timeline, ไฮไลต์จุด peak) · badge `jrPassWorth` (เขียว ok ถ้า true)
4. **§2 ค่าใช้จ่าย** — ตาราง `budget.items` (JPY/THB tabular-nums, row total ไฮไลต์ alp-soft) + **donut** จาก items (interactive hover→center morph, port JS เดิม) + note ช่วงงบ low/mid/high
5. **§3 ช่วงเวลา** — **season timeline gantt** จาก `seasonTimeline[]` (แท่งตาม startFrac/endFrac, สีตาม type ผ่าน `--season-*`, แถบ "ทริปคุณ" ถ้ามี) + ตารางอากาศ/แต่งตัว จาก `bestSeasons[].note_th`
6. **§4 จุดห้ามพลาด (POI)** — **poi-grid 2 คอลัมน์** การ์ด POI (ดู interaction ขยายด้านล่าง)
7. **§5 แผน** — `plans[]` แต่ละ plan = การ์ด, `recommended` ได้ tag เขียว "แนะนำ" · days = `.day` row (เลขวันใหญ่สี alp + title + detail)
8. **⚠ ข้อควรระวัง** — `ol.warn` (เลขใน badge แดงมน) จาก `warnings_th[]`
9. **🔗 แหล่งข้อมูล** — `.src` chips ลิงก์ external จาก `sources[]` + note disclaimer

### POI expand — "กดดู research ลึก" (interaction สำคัญ)

การ์ด POI = `blurb_th` (สั้น) บน collapsed state. **คลิกการ์ด/ปุ่ม → ขยาย deep-dive**

3 ทางเลือก (เลือก B เป็น default):

- **A. Inline accordion** — การ์ดขยายลงในตำแหน่งเดิม, grid reflow, เนื้อ `deepDive_th` สไลด์ลง (max-height transition). ดี: อยู่ในบริบท. เสีย: grid 2-col reflow แล้วการ์ดข้างกระโดด
- **B. Expand-to-full-width (แนะนำ)** — คลิก → การ์ดนั้นขยายเต็มความกว้าง row (col-span-2), การ์ดอื่น row เดียวกัน fade ลงล่าง, โชว์ `image` ใหญ่ + `deepDive_th` + `location_th` + `durationMin` + ปุ่ม "ย่อ". ปุ่ม ✕ มุมขวาบน. แอนิเมชัน FLIP (.22s ease) ลื่น ไม่กระโดด
- **C. Modal/drawer** — คลิก → drawer ขวา (desktop) / bottom sheet (mobile) เลื่อนเข้า, deep-dive เต็ม, พื้นหลัง dim. ดีสุดสำหรับ deep-dive ยาวมาก + มีหลายภาพ

> เลือกตาม `deepDive_th` ความยาว: ถ้า ≤3 ย่อหน้า ใช้ **B**; ถ้ายาว+มีหลายภาพ ใช้ **C**. ทั้งคู่ใช้ chevron/"ดูเชิงลึก" affordance ชัดเจน + cursor pointer + hover ยกการ์ด (เหมือนการ์ด list) เพื่อบอกว่ากดได้

collapsed POI card ต้องมี affordance ว่า "กดได้": มุมล่างมี `อ่านงานวิจัยเชิงลึก ›` (สี alp, 12px) + chevron หมุน 90° เมื่อขยาย

### Charts — generalize จาก data

- **Donut (budget)**: คำนวณ `stroke-dasharray` จาก `items[].yen` (สัดส่วนของ `totalYen`), วน segment สี alp→koyo→gold→ok→snow→alp-dark (palette เดิม). center morph ตอน hover (port JS เดิม 1:1). legend = items list. **ทำเป็น React component** อ่าน array แล้ว gen segment เอง (อย่า hardcode)
- **Gantt (season)**: แกน axis คำนวณ label จากช่วงเดือนของ data, แท่งวาง `left = startFrac*100%`, `width = (endFrac-startFrac)*100%`, สีตาม `type` ผ่าน `--season-*`. ถ้ามี "ช่วงทริป" → overlay `.g-trip` dashed เขียว
- **Route flow (vertical)**: จาก `routeFlow[]`, dot timeline เส้น gradient alp→koyo, จุด `elevationM` สูงสุด = `.hi` (ไฮไลต์ koyo + halo), segment `modeDetail_th` ระหว่างจุด มี Unicon ตาม mode

---

## 5. Component Inventory (ให้ FE สร้าง)

| Component | Props หลัก | หมายเหตุ |
|---|---|---|
| `TopBar` | `savedCount` | sticky, nav แผนที่/รายการ, ★ counter |
| `JapanMap` | `destinations[]`, `activeSlug`, `filter`, `onHoverPin`, `onSelectPin` | react-simple-maps, render `MapPin` ตามพิกัด |
| `MapPin` | `category`, `difficulty`, `state` (default/hover/active), `saved` | teardrop SVG + Unicon, halo เมื่อ active |
| `FilterBar` | `value`, `onChange` | region select + season chips + category chips + slider |
| `SeasonChip` `CategoryChip` | `type`, `active`, `onToggle` | toggle pill, สี map, Unicon |
| `ReachabilitySlider` | `value`, `onChange` | track gradient diff, label 2 ข้าง |
| `PreviewPanel` | `destination?`, `count`, `filterSummary` | default-state vs detail-state |
| `DestinationCard` | `destination`, `variant?:'full'\|'compact'`, `saved`, `onToggleSave` | ใช้ทั้ง list + panel |
| `DifficultyPips` | `level:1..5` | ●●●○○ + tooltip |
| `SaveButton` | `slug`, `saved` | ★ localStorage toggle |
| `DestinationDetail` | `data:Destination` | orchestrate ทุก section |
| `SectionHead` | `num`, `icon`, `title`, `subtitle?` | badge เลข+icon (signature) |
| `Card` | `children`, `pad?` | white card base |
| `Hero` | `image`, `title`, `jp?`, `sub`, `meta[]`, `kicker` | overlay + zigzag pattern |
| `AlertStrip` | `pills:[{kind,title,body}]` | good/warn grid |
| `AccessTable` `BudgetTable` | data rows | tabular-nums, total row |
| `BudgetDonut` | `items[]`, `total` | SVG gen + hover morph |
| `SeasonGantt` | `timeline[]`, `tripRange?` | คำนวณ axis + bars |
| `RouteFlow` | `stops[]` | vertical dot timeline |
| `PoiGrid` + `PoiCard` | `pois[]`; `poi`, `expanded`, `onToggle` | expand deep-dive (variant B/C) |
| `PlanCard` | `plan` | days list, recommended tag |
| `WarningList` | `items[]` | ol.warn เลขแดง |
| `SourceLinks` | `sources[]` | external chips |
| `Note` | `tone:'gold'\|'blue'\|'green'\|'warn'`, `icon`, `children` | callout (port `.note`) |
| `Tag` `Chip` | `label`, `tone` | inline label |
| `Icon` | `name` (uil) | `@iconify/react` wrapper |

> **Icon set: ใช้ Unicons (`uil`) ทั้งเว็บ** — เพื่อ stroke/metric สม่ำเสมอกับ Tateyama. ผ่าน `@iconify/react` prefix `uil`. mapping SPEC `poi.icon` = ชื่อ uil ตรงๆ (`water`→`uil:water`, `fire`→`uil:fire`). category icon: mountain→`uil:mountains`, onsen→`uil:raindrops-alt`, shrine→`uil:torii`(หรือ `uil:building`), coast→`uil:water`, city→`uil:building`, nature→`uil:trees`, lake→`uil:water`.

---

## 6. Motion

ปรัชญา: **เบา เร็ว มีเหตุผล** — ทุก motion .15–.22s, easing `ease`/`ease-out`. ของที่เป็นข้อมูลนิ่ง (ตาราง ตัวเลข) **ไม่ขยับ**; เฉพาะของที่ตอบ interaction ถึงขยับ

| Element | Motion | Duration |
|---|---|---|
| Card hover (list/poi) | translateY -3px + shadow ลึก + (รูป scale 1.04) | .18s ease |
| Pin hover | scale 1.12 + translateY -3px + leader line fade-in | .16s ease-out |
| Pin select | halo ขยายออก (scale halo 0→1) | .2s ease-out |
| Filter chip toggle | bg+color crossfade | .15s |
| Preview panel content swap | fade + slide-up 8px | .18s |
| POI expand (variant B) | FLIP layout transition | .22s ease |
| POI expand (variant C) | drawer slide-in + backdrop fade | .24s ease-out |
| Donut hover | segment stroke-width 22→27 + center morph (port เดิม) | .18s |
| Page transition | fade-through .15s (Next route) — เนื้อ fade-in 6px ขึ้น | .2s |
| Reduced motion | `prefers-reduced-motion` → ตัด translate/scale เหลือ opacity เท่านั้น | — |

> ใช้ Framer Motion เฉพาะ POI FLIP + page transition + panel swap (ที่ layout เปลี่ยน). hover เล็กๆ ใช้ CSS transition ล้วน (เบากว่า, ไม่ต้อง JS). **ห้าม** parallax/scroll-jack — ขัดกับ thesis "calm, อ่านง่าย"

---

## 7. Responsive

Mobile-first (อ่านตอนเที่ยว). Breakpoints: `sm 640 · md 768 · lg 1024`

| | Mobile (<768) | Tablet (768–1023) | Desktop (≥1024) |
|---|---|---|---|
| **Index** | list เป็น default + toggle แผนที่; แตะ pin → bottom sheet; filter ใน bottom sheet | แผนที่ + panel ใต้แผนที่ (stack) | แผนที่ซ้าย + panel ขวา 340px (ตาม §2) |
| **List** | 1 คอลัมน์ การ์ด | 2 คอลัมน์ | 3 คอลัมน์ |
| **Detail wrap** | padding 0 16px | 0 20px | max-w 880 กลาง |
| **poi-grid** | 1 คอลัมน์ | 2 คอลัมน์ | 2 คอลัมน์ |
| **alert strip** | 1 คอลัมน์ | 2 | 2 |
| **donut** | center กลาง legend ใต้ | side-by-side | side-by-side |
| **gantt** | label ย่อ 96px (เหมือน `@media 680` เดิม) | เต็ม | เต็ม |
| **hero h1** | 28px | 32px | 38px |
| **route flow** | label เลขความสูงตัดบรรทัดได้ | เต็ม | เต็ม |
| **table** | ค่า cost ตัดบรรทัด detail ลงล่างได้ (อย่าให้ scroll-x) | เต็ม | เต็ม |

จุดเสี่ยง responsive:
- **ตาราง access/budget** กว้างเกินมือถือ → บนมือถือ collapse เป็น stacked rows (label บน / ค่าล่าง) หรือ ให้ scroll-x ในกล่องเฉพาะตาราง ไม่ทั้งหน้า
- **route flow** elevation number ต้อง wrap ใต้ชื่อ stop บนจอแคบ
- **map pin tap target** ≥44px บนมือถือ (pin 34 + padding hit-area โปร่ง)
- **Sarabun + จอเล็ก**: h1 28px อย่าต่ำกว่านี้, tagline clamp 2 บรรทัดกัน layout เด้ง

---

## Quality gate (ตรวจก่อนส่ง)

- **Distinctiveness** ✓ — section-number badge + alp/koyo + zigzag mountain pattern + teardrop pin = จำได้แม้ลบโลโก้
- **Hierarchy** ✓ — index มี 1 focal: แผนที่+pin; detail มี section number นำสายตาเป็นลำดับ 1→9
- **Restraint** ✓ — alp เป็น primary ครองทั้งเว็บ, koyo เป็น accent จุดเดียว (peak/star/active), ไม่มีสีที่สาม
- **Craft** ✓ — radius/shadow/spacing ดึงค่าจริงจาก Tateyama, empty state (panel default), loading (skeleton รูป), difficulty pip
- **Thai fit** ✓ — Sarabun line-height 1.65, ไม่มี weight 300 ใน body, heading -.02em tracking

## หมายเหตุ handoff

- ส่งต่อ **frontend-engineer** สร้างตาม inventory §5 — เริ่มจาก token (§1) → Tateyama port (detail template §4) → index map (§2)
- ถ้าต้องการ design tokens เป็น `tokens.json`/DESIGN.md จาก live reference เพิ่ม → **design-extractor**
- ถ้าจะ audit a11y เต็ม (contrast pin บนแผนที่, focus order filter, screen reader ของ donut/gantt) → **a11y-architect** — โดยเฉพาะ **donut/gantt ต้องมี data ในรูป table สำรอง** ให้ screen reader อ่านได้ (อย่าพึ่ง SVG อย่างเดียว)
- รูปทุกใบทำตามกฎ SPEC: verify 200 + `fallbackUrl` Wikimedia + `onerror` สลับ
```
