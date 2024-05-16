import { notFound } from 'next/navigation';

import { Strategy } from './_components/strategy/strategy.component';

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

  return <Strategy id={id} tab={Array.isArray(tab) ? undefined : tab} />;
}
