import { notFound } from 'next/navigation';

import { Profile } from './_components/profile/profile.component';

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

  return <Profile id={id} tab={Array.isArray(tab) ? undefined : tab} />;
}
