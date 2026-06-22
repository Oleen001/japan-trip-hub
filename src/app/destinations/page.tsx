import { Suspense } from 'react';
import { getAllDestinations } from '@/lib/data';
import { TopBar } from '@/components/TopBar';
import { ListClient } from '@/components/ListClient';

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const destinations = getAllDestinations();
  return (
    <>
      <TopBar />
      <main>
        <Suspense>
          <ListClient destinations={destinations} savedOnly={saved === '1'} />
        </Suspense>
      </main>
    </>
  );
}
