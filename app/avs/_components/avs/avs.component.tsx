'use client';
import { useAVS } from './avs.service';
import { AVSCards } from './components/avs-cards/avs-cards.component';
import { AVSTabs } from './components/avs-tabs/avs-tabs.component';

import { AccountPreloader } from '@/app/_components/account-preloader/account-preloader.component';
import { Empty } from '@/app/_components/empty/empty.component';
import { useStrategies } from '@/app/_services/strategies.service';

type Props = {
  id: string;
  tab: string | undefined;
};

export const AVS: React.FC<Props> = ({ id, tab }) => {
  const strategies = useStrategies();

  const avs = useAVS(id);

  if (avs.isPending || strategies.isPending) {
    return <AccountPreloader />;
  }

  const error = avs.error || strategies.error;

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <Empty />;
  }

  if (!avs.data) {
    return <Empty />;
  }

  const {
    name,
    created,
    logo,
    description,
    website,
    twitter,
    registrationsCount,
    registrations,
    quorums,
    actions,
  } = avs.data;

  return (
    <>
      <AVSCards id={id} name={name} created={created} logo={logo} description={description} />
      <AVSTabs
        id={id}
        tab={tab}
        avsDetails={{
          registrationsCount,
          website,
          twitter,
        }}
        quorums={quorums}
        strategies={strategies.data}
        registrations={registrations}
        actions={actions}
      />
    </>
  );
};
