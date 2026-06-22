import type { Destination } from '@/lib/types';
import { Card, SectionHead, TileHead, Note, Tag } from '../primitives';
import { Icon } from '../Icon';
import { SaveButton } from '../SaveButton';
import { Hero } from './Hero';
import { AlertStrip, type AlertPill } from './AlertStrip';
import { RouteCompare } from './RouteCompare';
import { BudgetTable } from './BudgetTable';
import { BudgetDonut } from '../charts/BudgetDonut';
import { SeasonGantt } from '../charts/SeasonGantt';
import { RouteFlow } from '../charts/RouteFlow';
import { PoiGrid } from './PoiGrid';
import { PlanCard } from './PlanCard';
import { WarningList } from './WarningList';
import { SourceLinks } from './SourceLinks';
import { DifficultyPips } from '../DifficultyPips';

function buildAlertPills(data: Destination): AlertPill[] {
  const pills: AlertPill[] = [];
  const goodSeason = data.bestSeasons[0];
  if (goodSeason) {
    pills.push({
      kind: 'good',
      title: `ช่วงดี: ${goodSeason.label}`,
      body: goodSeason.note_th,
    });
  }
  if (data.warnings_th[0]) {
    pills.push({
      kind: 'no',
      title: 'ข้อควรระวังหลัก',
      body: data.warnings_th[0],
    });
  }
  return pills;
}

export function DestinationDetail({ data }: { data: Destination }) {
  const alertPills = buildAlertPills(data);
  const { ranges } = data.budget;

  return (
    <article>
      <Hero data={data} />
      {alertPills.length > 0 && <AlertStrip pills={alertPills} />}

      <div className="mx-auto max-w-[1080px] px-4 pb-20 sm:px-5">
        {/* floating save + tags row */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-[6px]">
            {data.tags_th.slice(0, 6).map((t) => (
              <Tag key={t} tone="snow">
                {t}
              </Tag>
            ))}
          </div>
          <SaveButton slug={data.slug} />
        </div>

        {/* §1 POI */}
        {data.pois.length > 0 && (
          <section className="mt-12">
            <SectionHead
              num={1}
              title="จุดห้ามพลาด"
              subtitle={`${data.pois.length} จุดเด่น · กดการ์ดดูงานวิจัยเชิงลึก`}
            />
            <PoiGrid pois={data.pois} />
          </section>
        )}

        {/* two-column: main (เนื้อหาหลัก) + rail (ข้อมูลเสริม) — 2 รางอิสระ ไม่มีช่องค้าง */}
        <div className="mt-10 lg:grid lg:grid-cols-[1.65fr_1fr] lg:items-start lg:gap-4">
          {/* MAIN column */}
          <div className="flex flex-col gap-4">
            {/* การเดินทาง */}
            <Card>
              <TileHead icon="directions" title="การเดินทางจากโตเกียว" subtitle={`${data.region} · ${data.prefecture}`} />
              <p className="mb-4 text-[14px] leading-[1.6] text-ink-soft">{data.access.summary_th}</p>
              {data.access.jrPassWorth && (
                <Tag tone="ok" icon="ticket" className="mb-3">
                  JR Pass คุ้ม
                </Tag>
              )}
              <RouteCompare options={data.access.options} />
            </Card>

            {/* season timeline gantt */}
            {data.seasonTimeline && data.seasonTimeline.length > 0 && (
              <Card>
                <TileHead icon="trees" title="ช่วงเวลาที่สวย" subtitle="แต่ละโซนพีคคนละช่วง" />
                <SeasonGantt timeline={data.seasonTimeline} />
              </Card>
            )}

            {/* แผนแนะนำ */}
            {data.plans.length > 0 && (
              <Card>
                <TileHead icon="map" title="แผนแนะนำ" subtitle={`${data.plans.length} แบบ`} />
                <div className="flex flex-col gap-[14px]">
                  {data.plans.map((plan, i) => (
                    <PlanCard key={i} plan={plan} />
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* RAIL column */}
          <div className="mt-4 flex flex-col gap-4 lg:mt-0">
            {/* route flow */}
            {data.routeFlow && data.routeFlow.length > 0 && (
              <Card>
                <TileHead icon="mountains" title="ระดับความสูง" subtitle="route flow ตามเส้นทาง" />
                <RouteFlow stops={data.routeFlow} />
              </Card>
            )}

            {/* ค่าใช้จ่าย — donut + table (rail) */}
            <Card>
              <TileHead icon="dollar-alt" title="ค่าใช้จ่าย" subtitle="ต่อคน · เรท 0.23 THB/JPY" />
              <BudgetDonut
                items={data.budget.items}
                totalYen={data.budget.totalYen}
                totalThb={data.budget.totalThb}
              />
              {data.budget.note_th && (
                <p className="mb-5 mt-4 text-[12.5px] leading-[1.6] text-ink-soft">{data.budget.note_th}</p>
              )}
              <div className="border-t border-line pt-5">
                <BudgetTable budget={data.budget} />
                <Note tone="blue">
                  <b>ช่วงงบ:</b>&nbsp; Low ~{ranges.lowThb.toLocaleString('en-US')} ฿ &nbsp;·&nbsp;{' '}
                  <b>Mid ~{ranges.midThb.toLocaleString('en-US')} ฿</b> &nbsp;·&nbsp; High ~
                  {ranges.highThb.toLocaleString('en-US')}+ ฿
                </Note>
              </div>
            </Card>

            {/* อาหารแนะนำ */}
            {data.food && data.food.length > 0 && (
              <Card>
                <TileHead icon="restaurant" title="กินอะไรดี" subtitle="ของถิ่น" />
                <ul className="flex flex-col gap-[14px]">
                  {data.food.map((f, i) => (
                    <li key={i} className="flex gap-[10px]">
                      <span className="flex-none text-[24px] leading-none">{f.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-bold leading-tight text-ink">
                          {f.name}
                          {f.name_jp && (
                            <span className="ml-1 text-[11px] font-normal text-ink-soft">{f.name_jp}</span>
                          )}
                        </div>
                        <p className="mt-px text-[12px] leading-[1.5] text-ink-soft">{f.note_th}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* ฤดูแนะนำ */}
            {data.bestSeasons.length > 0 && (
              <Card>
                <TileHead icon="calendar-alt" title="ฤดูแนะนำ" subtitle="ไปช่วงไหนดี" />
                <ul className="flex flex-col gap-3">
                  {data.bestSeasons.map((s, i) => (
                    <li key={i} className="rounded-md border border-line bg-paper px-3 py-[10px]">
                      <div className="mb-1 flex items-center gap-2">
                        <Icon name="check-circle" size={15} style={{ color: 'var(--ok)' }} />
                        <b className="text-[13.5px]">{s.label}</b>
                      </div>
                      <p className="text-[12.5px] leading-[1.55] text-ink-soft">{s.note_th}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* ข้อควรระวัง */}
            {data.warnings_th.length > 0 && (
              <Card>
                <TileHead icon="exclamation-triangle" title="ข้อควรระวัง" subtitle="สิ่งที่คนมักพลาด" />
                <WarningList items={data.warnings_th} />
              </Card>
            )}

            {/* แหล่งข้อมูล */}
            {data.sources.length > 0 && (
              <Card>
                <TileHead icon="external-link-alt" title="แหล่งข้อมูล" subtitle="อ้างอิงทางการ" />
                <SourceLinks sources={data.sources} />
                <Note tone="gold" icon="exclamation-triangle">
                  ตัวเลขบาทคิดเรท 0.23 THB/JPY · <b>ตรวจสอบเองอีกครั้งก่อนจอง</b>
                </Note>
              </Card>
            )}
          </div>
        </div>

        <footer className="mt-12 flex items-center justify-between border-t border-line pt-6 text-[12px] text-ink-soft">
          <span className="inline-flex items-center gap-1">
            ความง่ายจากโตเกียว <DifficultyPips level={data.difficultyFromTokyo} />
          </span>
          <span>Japan Trip Hub · Park AG</span>
        </footer>
      </div>
    </article>
  );
}
