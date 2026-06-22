import Link from 'next/link';
import { Icon } from '@/components/Icon';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-alp text-white">
        <Icon name="mountains" size={36} />
      </span>
      <h1 className="mt-5 text-h2 text-ink">ไม่พบหน้านี้</h1>
      <p className="mt-2 text-ink-soft">ปลายทางที่หาอาจยังไม่มีข้อมูล หรือ URL ผิด</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-alp px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-alp-700"
      >
        <Icon name="map" size={18} /> กลับหน้าแผนที่
      </Link>
    </main>
  );
}
