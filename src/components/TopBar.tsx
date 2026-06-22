'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './Icon';
import { useSaved } from '@/lib/useSaved';
import { cn } from '@/lib/cn';

export function TopBar() {
  const pathname = usePathname();
  const { count, hydrated } = useSaved();

  const navItem = (href: string, icon: string, label: string) => {
    const active = pathname === href || (href === '/' && pathname === '/');
    return (
      <Link
        href={href}
        className={cn(
          'inline-flex items-center gap-[6px] rounded-md px-3 py-[7px] text-[13.5px] font-semibold transition-colors duration-150',
          active ? 'bg-alp-soft text-alp-dark' : 'text-ink-soft hover:bg-paper-sunken',
        )}
      >
        <Icon name={icon} size={16} /> <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 h-[60px] border-b border-line bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex flex-none items-center gap-[10px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand.svg" alt="" className="h-9 w-auto flex-none rounded-md" />
          <span className="whitespace-nowrap text-[15px] font-extrabold tracking-[-.01em] text-ink sm:text-[16px]">
            Japan Trip Hub
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItem('/', 'map', 'แผนที่')}
          {navItem('/destinations', 'list-ul', 'รายการ')}
          <Link
            href="/destinations?saved=1"
            className="ml-1 inline-flex items-center gap-[6px] rounded-md border border-line px-3 py-[7px] text-[13.5px] font-semibold text-ink-soft transition-colors hover:bg-paper-sunken"
          >
            <Icon name="star" size={16} style={{ color: 'var(--gold)' }} />
            <span className="hidden sm:inline">บันทึกไว้</span>
            <span className="tabnum">{hydrated ? count : 0}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
