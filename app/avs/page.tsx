import { notFound } from 'next/navigation';

import { AVS } from './_components/avs/avs.component';

export const runtime = 'edge';

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | Array<string> | undefined };
}) {
  const id = searchParams.id;
  const tab = searchParams.tab;

  if (typeof id !== 'string') {
    return notFound();
  }

  return <AVS id={id} tab={Array.isArray(tab) ? undefined : tab} />;
}
