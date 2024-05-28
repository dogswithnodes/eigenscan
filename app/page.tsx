import { Suspense } from 'react';

import { HomeTabs } from './_components/home-tabs/home-tabs.component';
import { ProtocolData } from './_components/protocol-data/protocol-data.component';

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
