import { Suspense } from 'react';

import { ProtocolData } from './_components/protocol-data/protocol-data.component';
import { HomeTabs } from './_components/home-tabs/home-tabs.component';

export default function Home() {
  return (
    <>
      <ProtocolData />
      <Suspense>
        <HomeTabs />
      </Suspense>
    </>
  );
}
