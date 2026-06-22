import { Icon as Iconify } from '@iconify/react';

type IconProps = {
  name: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
};

/** Unicons (uil) wrapper. `name` = bare uil id e.g. "water", "mountains". */
export function Icon({ name, size = '1em', className, style }: IconProps) {
  return (
    <Iconify
      icon={`uil:${name}`}
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
    />
  );
}
