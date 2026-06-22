import type { Budget } from '@/lib/types';
import { Yen } from '../Yen';

export function BudgetTable({ budget }: { budget: Budget }) {
  return (
    <div className="overflow-x-auto rounded-md border border-line">
      <table className="w-full min-w-[440px] border-collapse text-[14px]">
        <thead>
          <tr className="bg-paper">
            <th className="px-3 py-[11px] text-left text-[12px] font-bold uppercase tracking-wide text-ink-soft">
              รายการ
            </th>
            <th className="px-3 py-[11px] text-right text-[12px] font-bold uppercase tracking-wide text-ink-soft">
              JPY
            </th>
            <th className="px-3 py-[11px] text-right text-[12px] font-bold uppercase tracking-wide text-ink-soft">
              THB
            </th>
          </tr>
        </thead>
        <tbody>
          {budget.items.map((it, i) => (
            <tr key={i} className="border-t border-line align-top">
              <td className="px-3 py-[11px]">
                <span className="font-medium text-ink">{it.label_th}</span>
                {it.note_th && (
                  <span className="mt-px block text-[12px] leading-[1.5] text-ink-soft">
                    {it.note_th}
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-[11px] text-right font-semibold tabnum">
                <Yen amount={it.yen} />
              </td>
              <td className="whitespace-nowrap px-3 py-[11px] text-right text-ink-soft tabnum">
                ~{it.thb.toLocaleString('en-US')}
              </td>
            </tr>
          ))}
          <tr className="border-t-2 border-ink bg-alp-soft">
            <td className="px-3 py-[11px] text-[15px] font-extrabold">รวมต่อคน</td>
            <td className="whitespace-nowrap px-3 py-[11px] text-right text-[15px] font-extrabold tabnum">
              ~<Yen amount={budget.totalYen} />
            </td>
            <td className="whitespace-nowrap px-3 py-[11px] text-right text-[15px] font-extrabold tabnum">
              ~{budget.totalThb.toLocaleString('en-US')} ฿
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
