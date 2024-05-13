import { ProtocolData } from './_components/protocol-data/protocol-data.component';
import { HomeTabs } from './_components/home-tabs/home-tabs.component';

export default async function Home() {
  return (
    <>
      <ProtocolData />
      <HomeTabs />
    </>
  );
}
