import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllSlugs, getDestination } from '@/lib/data';
import { TopBar } from '@/components/TopBar';
import { DestinationDetail } from '@/components/detail/DestinationDetail';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getDestination(slug);
  if (!data) return { title: 'ไม่พบปลายทาง — Japan Trip Hub' };
  return {
    title: `${data.name.en} ${data.name.jp ?? ''} — Japan Trip Hub`,
    description: data.tagline_th,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getDestination(slug);
  if (!data) notFound();

  return (
    <>
      <TopBar />
      <main>
        <DestinationDetail data={data} />
      </main>
    </>
  );
}
