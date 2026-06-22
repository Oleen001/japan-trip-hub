export function WarningList({ items }: { items: string[] }) {
  return (
    <ol className="list-none">
      {items.map((item, i) => (
        <li
          key={i}
          className="relative border-b border-line py-3 pl-[46px] pr-3 text-[14px] leading-[1.6] last:border-none"
        >
          <span className="absolute left-3 top-[11px] grid h-6 w-6 place-items-center rounded-[7px] bg-warn-soft text-[13px] font-bold text-warn">
            {i + 1}
          </span>
          {item}
        </li>
      ))}
    </ol>
  );
}
