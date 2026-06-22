import { getAllDestinations } from '@/lib/data';
import { TopBar } from '@/components/TopBar';
import { IndexClient } from '@/components/IndexClient';

export default function HomePage() {
  const destinations = getAllDestinations();
  return (
    <>
      <TopBar />
      <main>
        <IndexClient destinations={destinations} />
      </main>
    </>
  );
}
