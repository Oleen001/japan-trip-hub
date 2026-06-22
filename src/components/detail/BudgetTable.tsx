import type { Budget } from '@/lib/types';
import { Yen } from '../Yen';
import { Icon } from '../Icon';

type Cat = { icon: string; tint: string; fg: string };

const CATS: Record<string, Cat> = {
  transport: { icon: 'subway', tint: 'bg-alp-soft', fg: 'text-alp' },
  lodging: { icon: 'bed', tint: 'bg-koyo-soft', fg: 'text-koyo' },
  food: { icon: 'restaurant', tint: 'bg-ok-soft', fg: 'text-ok' },
  ticket: { icon: 'ticket', tint: 'bg-alp-soft', fg: 'text-alp' },
  shopping: { icon: 'shopping-bag', tint: 'bg-paper-sunken', fg: 'text-snow' },
  misc: { icon: 'wallet', tint: 'bg-paper-sunken', fg: 'text-ink-soft' },
};

/** เดาประเภทจาก keyword ใน label_th → icon + สีหมวด (ตรวจตามลำดับความเฉพาะ) */
function categorize(label: string): Cat {
  const s = label.toLowerCase();
  if (
    /ของฝาก|outlet|เบ็ดเตล็ด|ช้อป|souvenir/.test(s)
  )
    return CATS.shopping;
  if (/อาหาร|โซบะ|มื้อ|dango|maguro|ชิราสึ|food|lunch|กลางวัน/.test(s)) return CATS.food;
  if (/ที่พัก|ryokan|minshuku|hotel|hut|guesthouse|พักริม|พักใน/.test(s)) return CATS.lodging;
  if (
    /เดินทาง|ชินคันเซ็น|shinkansen|รถไฟ|บัส|bus|shuttle|azusa|odoriko|highway|เฟอร์รี|enoden|keio|romancecar|spacia|ลิฟต์/.test(
      s,
    )
  )
    return CATS.transport;
  if (
    /ค่าเข้า|ropeway|cable|chairlift|lift|กระเช้า|pass|ticket|เรือ|จักรยาน|ทัวร์|ออนเซ็น|onsen|พิพิธภัณฑ์|สวน|วัด|ศาลเจ้า|ถ้ำ|กิจกรรม|baggage|กระเป๋า/.test(
      s,
    )
  )
    return CATS.ticket;
  return CATS.misc;
}

export function BudgetTable({ budget }: { budget: Budget }) {
  return (
    <ul className="flex flex-col gap-px">
      {budget.items.map((it, i) => {
        const cat = categorize(it.label_th);
        return (
          <li
            key={i}
            className="group flex items-start gap-2.5 rounded-md px-2 py-2 transition-colors duration-150 hover:bg-paper-sunken"
          >
            <span
              className={`mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cat.tint} ${cat.fg}`}
            >
              <Icon name={cat.icon} size={16} />
            </span>

            <div className="min-w-0 flex-1 pt-px">
              <p className="text-[13.5px] font-medium leading-[1.4] text-ink">{it.label_th}</p>
              {it.note_th && (
                <p className="mt-0.5 text-[11.5px] leading-[1.5] text-ink-faint">{it.note_th}</p>
              )}
            </div>

            <div className="shrink-0 pt-px text-right">
              <Yen amount={it.yen} className="text-[13.5px] font-semibold text-ink" />
              <p className="text-[11px] leading-[1.4] text-ink-faint tabnum">
                ฿{it.thb.toLocaleString('en-US')}
              </p>
            </div>
          </li>
        );
      })}

      <li className="mt-2 flex items-center justify-between gap-2.5 rounded-lg bg-alp-soft px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-alp text-white">
            <Icon name="dollar-alt" size={16} />
          </span>
          <span className="text-[14px] font-extrabold text-alp-dark">รวมต่อคน</span>
        </div>
        <div className="text-right">
          <Yen
            amount={budget.totalYen}
            bold
            className="text-[15px] font-extrabold text-alp-dark"
          />
          <p className="text-[11.5px] font-semibold leading-[1.4] text-alp tabnum">
            ฿{budget.totalThb.toLocaleString('en-US')}
          </p>
        </div>
      </li>
    </ul>
  );
}
