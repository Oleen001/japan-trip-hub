import type { Metadata } from 'next';
import { getAllDestinations } from '@/lib/data';
import { TopBar } from '@/components/TopBar';
import { RouteClient } from '@/components/RouteClient';

export const metadata: Metadata = {
  title: 'เส้นทางจากโตเกียว · Japan Trip Hub',
  description: 'เทียบวิธีเดินทางจากโตเกียวไปแต่ละปลายทาง — เวลา ค่าใช้จ่าย จำนวนต่อ',
};

export default function RoutePage() {
  const destinations = getAllDestinations();
  return (
    <>
      <TopBar />
      <main>
        <RouteClient destinations={destinations} />
      </main>
    </>
  );
}
